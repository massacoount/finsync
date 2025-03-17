require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const winston = require("winston");
const swaggerUi = require("swagger-ui-express");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const OAuth2Server = require("oauth2-server");
const YAML = require("yamljs");
const path = require("path");
const { body, validationResult } = require("express-validator");

class DatabaseService {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) reject(err);
        else resolve(conn);
      });
    });
  }
}

class LoggerService {
  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "app.log" }),
      ],
    });
  }

  log(message, meta) {
    this.logger.log("info", message, meta);
  }

  error(message, meta) {
    this.logger.log("error", message, meta);
  }
}

class OAuthService {
  constructor(dbService, logger) {
    this.db = dbService;
    this.logger = logger;
    this.oauth = new OAuth2Server({
      model: this,
      grants: ["authorization_code", "refresh_token", "password"],
      accessTokenLifetime: 3600, // 1 hour
      allowBearerTokensInQueryString: false,
    });
  }

  async getClient(clientId, clientSecret) {
    const [client] = await this.db.query(
      "SELECT * FROM oauth_client WHERE client_id = ? AND client_secret = ?",
      [clientId, clientSecret]
    );
    if (!client) return null;
    return {
      id: client.client_id,
      grants: JSON.parse(client.allowed_grants),
      redirectUris: [client.redirect_uri],
    };
  }

  async getUser(username, password) {
    const [user] = await this.db.query("SELECT * FROM user WHERE email = ?", [
      username,
    ]);
    if (!user || !(await bcrypt.compare(password, user.hash))) {
      return null;
    }
    return { id: user.id };
  }

  async saveToken(token, client, user) {
    await this.db.query(
      "INSERT INTO oauth_token (access_token, access_token_expires, client_id, user_id, refresh_token, scope) VALUES (?, ?, ?, ?, ?, ?)",
      [
        token.accessToken,
        token.accessTokenExpiresAt,
        client.id,
        user.id,
        token.refreshToken,
        token.scope,
      ]
    );
    return { ...token, client, user };
  }

  async getAccessToken(accessToken) {
    const [token] = await this.db.query(
      `SELECT t.*, u.* FROM oauth_token t 
       JOIN user u ON t.user_id = u.id 
       WHERE access_token = ? AND access_token_expires > NOW()`,
      [accessToken]
    );
    if (!token) return null;
    return {
      accessToken: token.access_token,
      accessTokenExpiresAt: token.access_token_expires,
      scope: token.scope,
      user: { id: token.user_id },
      client: { id: token.client_id },
    };
  }

  async getAuthorizationCode(authorizationCode) {
    const [code] = await this.db.query(
      "SELECT * FROM oauth_code WHERE code = ? AND expires > NOW()",
      [authorizationCode]
    );
    if (!code) return null;
    return {
      code: code.code,
      expiresAt: code.expires,
      redirectUri: code.redirect_uri,
      scope: code.scope,
      client: { id: code.client_id },
      user: { id: code.user_id },
    };
  }

  async saveAuthorizationCode(code, client, user) {
    const authCode = {
      code: code.authorizationCode,
      expires: code.expiresAt,
      redirect_uri: code.redirectUri,
      scope: code.scope,
      client_id: client.id,
      user_id: user.id,
    };

    await this.db.query("INSERT INTO oauth_code SET ?", authCode);
    return { ...code, client, user };
  }

  async revokeAuthorizationCode(code) {
    await this.db.query("DELETE FROM oauth_code WHERE code = ?", [code.code]);
    return true;
  }

  async validateScope(user, client, scope) {
    if (!scope) return "";
    const requestedScopes = scope.split(" ");
    const [allowedScopes] = await this.db.query(
      "SELECT allowed_scopes FROM oauth_client WHERE client_id = ?",
      [client.id]
    );
    if (!allowedScopes || !allowedScopes.allowed_scopes) return "";
    const validScopes = requestedScopes.filter((s) =>
      allowedScopes.allowed_scopes.includes(s)
    );
    return validScopes.join(" ");
  }

  async verifyScope(token, scope) {
    if (!token.scope) return false;
    const requestedScopes = scope.split(" ");
    const tokenScopes = token.scope.split(" ");
    return requestedScopes.every((s) => tokenScopes.includes(s));
  }

  async handlePasswordGrant(req, res) {
    const { username, password, client_id, client_secret, scope } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "invalid_request" });
    }

    const client = await this.getClient(client_id, client_secret);
    if (!client || !client.grants.includes("password")) {
      return res.status(401).json({ error: "invalid_client" });
    }

    const user = await this.getUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "invalid_grant" });
    }

    const validScope = await this.validateScope(user, client, scope);
    const token = await this.generateToken(client, user, validScope);

    res.set(
      "X-OAuth-Warning",
      "Password grant is deprecated - prefer Authorization Code Flow with PKCE"
    );
    res.json(token);
  }

  async generateToken(client, user, scope) {
    const accessToken = crypto.randomBytes(32).toString("hex");
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    await this.saveToken(
      {
        accessToken,
        accessTokenExpiresAt: expiresAt,
        refreshToken,
        scope,
      },
      client,
      user
    );

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: refreshToken,
      scope,
    };
  }

  async tokenHandler(req, res) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    try {
      if (request.body.grant_type === "password") {
        return this.handlePasswordGrant(req, res);
      }

      const token = await this.oauth.token(request, response);
      res.json(token);
    } catch (err) {
      this.logger.error("Token error:", err);
      res.status(err.code || 500).json(this.formatOAuthError(err));
    }
  }

  async authorizeHandler(req, res) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    try {
      const authParams = await this.oauth.authorize(request, response);
      res.redirect(
        `${authParams.redirectUri}?code=${authParams.authorizationCode}`
      );
    } catch (err) {
      this.logger.error("Authorization error:", err);
      res.status(err.code || 500).json(this.formatOAuthError(err));
    }
  }

  formatOAuthError(error) {
    return {
      error: error.name,
      error_description: error.message,
    };
  }

  // Method to be used as middleware for route protection
  authenticateRequest() {
    return async (req, res, next) => {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) return res.status(401).json({ error: "invalid_token" });

      try {
        const request = new OAuth2Server.Request(req);
        const response = new OAuth2Server.Response(res);
        const tokenData = await this.oauth.authenticate(request, response);
        req.user = tokenData.user;
        next();
      } catch (err) {
        res.status(401).json(this.formatOAuthError(err));
      }
    };
  }
}

class Util {
  constructor(logger, oauthService) {
    this.logger = logger;
    this.oauthService = oauthService;
  }

  validateRequest() {
    return (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.logger.log("Request is rejected with errors", errors);
        return res.status(400).json({ errors: errors.array() });
      }
      return next();
    };
  }
}

class AuthController {
  constructor(dbService, logger, util, oauthService) {
    this.db = dbService;
    this.logger = logger;
    this.util = util;
    this.oauthService = oauthService;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/authorize", this.authorize.bind(this));
    this.router.post("/token", this.token.bind(this));
    this.router.get(
      "/userinfo",
      this.oauthService.authenticateRequest(),
      this.userInfo.bind(this)
    );
  }

  async authorize(req, res) {
    await this.oauthService.authorizeHandler(req, res);
  }

  async token(req, res) {
    await this.oauthService.tokenHandler(req, res);
  }

  async userInfo(req, res) {
    const [user] = await this.db.query(
      "SELECT id, name, email FROM user WHERE id = ?",
      [req.user.id]
    );
    res.json({
      sub: user.id,
      name: user.name,
      email: user.email,
      email_verified: true,
    });
  }
}

class AccountController {
  constructor(dbService, logger, util) {
    this.db = dbService;
    this.logger = logger;
    this.util = util;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.util.validateRequest(),
      this.getAccounts.bind(this)
    );
    this.router.post(
      "/",
      this.util.validateRequest(),
      this.createAccount.bind(this)
    );
    this.router.get(
      "/:id",
      this.util.validateRequest(),
      this.getAccount.bind(this)
    );
    this.router.put(
      "/:id",
      this.util.validateRequest(),
      this.updateAccount.bind(this)
    );
    this.router.delete(
      "/:id",
      this.util.validateRequest(),
      this.deleteAccount.bind(this)
    );
  }

  async getAccounts(req, res) {
    try {
      const accounts = await this.db.query(
        "SELECT * FROM account WHERE user_id = ?",
        [req.user.id]
      );
      res.json(accounts);
    } catch (error) {
      this.logger.error("Error fetching accounts:", error);
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  }

  async createAccount(req, res) {
    const { account_name, opening_balance, account_type } = req.body;
    try {
      const accountId = uuidv4();
      await this.db.query(
        "INSERT INTO account (account_id, user_id, account_name, opening_balance, current_balance, account_type, opening_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          accountId,
          req.user.id,
          account_name,
          opening_balance,
          opening_balance,
          account_type,
          new Date(),
        ]
      );
      res.status(201).json({ id: accountId, ...req.body });
    } catch (error) {
      this.logger.error("Error creating account:", error);
      res.status(400).json({ error: "Failed to create account" });
    }
  }

  async getAccount(req, res) {
    try {
      const [account] = await this.db.query(
        "SELECT * FROM account WHERE account_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    } catch (error) {
      this.logger.error("Error fetching account:", error);
      res.status(500).json({ error: "Failed to fetch account" });
    }
  }

  async updateAccount(req, res) {
    const { account_name, account_type } = req.body;
    try {
      await this.db.query(
        "UPDATE account SET account_name = ?, account_type = ? WHERE account_id = ? AND user_id = ?",
        [account_name, account_type, req.params.id, req.user.id]
      );
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      this.logger.error("Error updating account:", error);
      res.status(400).json({ error: "Failed to update account" });
    }
  }

  async deleteAccount(req, res) {
    try {
      await this.db.query(
        "DELETE FROM account WHERE account_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      res.status(204).send();
    } catch (error) {
      this.logger.error("Error deleting account:", error);
      res.status(400).json({ error: "Failed to delete account" });
    }
  }
}

class TransactionController {
  constructor(dbService, logger, util) {
    this.db = dbService;
    this.logger = logger;
    this.util = util;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.util.validateRequest(),
      this.getTransactions.bind(this)
    );
    this.router.post(
      "/",
      this.util.validateRequest(),
      this.createTransaction.bind(this)
    );
    this.router.get(
      "/:id",
      this.util.validateRequest(),
      this.getTransaction.bind(this)
    );
    this.router.put(
      "/:id",
      this.util.validateRequest(),
      this.updateTransaction.bind(this)
    );
    this.router.delete(
      "/:id",
      this.util.validateRequest(),
      this.deleteTransaction.bind(this)
    );
  }

  async getTransactions(req, res) {
    try {
      const transactions = await this.db.query(
        "SELECT * FROM transaction WHERE user_id = ?",
        [req.user.id]
      );
      res.json(transactions);
    } catch (error) {
      this.logger.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  }

  async createTransaction(req, res) {
    const {
      description,
      amount,
      from_account_id,
      to_account_id,
      category_id,
      tag_id,
    } = req.body;
    const connection = await this.db.getConnection();
    try {
      await connection.beginTransaction();

      const transactionId = uuidv4();
      await connection.query(
        "INSERT INTO transaction (transaction_id, user_id, description, amount, from_account_id, to_account_id, category_id, tag_id, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          transactionId,
          req.user.id,
          description,
          amount,
          from_account_id,
          to_account_id,
          category_id,
          tag_id,
          new Date(),
        ]
      );

      // Update account balances
      await connection.query(
        "UPDATE account SET current_balance = current_balance - ? WHERE account_id = ?",
        [amount, from_account_id]
      );
      await connection.query(
        "UPDATE account SET current_balance = current_balance + ? WHERE account_id = ?",
        [amount, to_account_id]
      );

      await connection.commit();
      res.status(201).json({ id: transactionId, ...req.body });
    } catch (error) {
      await connection.rollback();
      this.logger.error("Error creating transaction:", error);
      res.status(400).json({ error: "Failed to create transaction" });
    } finally {
      connection.release();
    }
  }

  async getTransaction(req, res) {
    try {
      const [transaction] = await this.db.query(
        "SELECT * FROM transaction WHERE transaction_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      if (transaction) {
        res.json(transaction);
      } else {
        res.status(404).json({ error: "Transaction not found" });
      }
    } catch (error) {
      this.logger.error("Error fetching transaction:", error);
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  }

  async updateTransaction(req, res) {
    // Updating transactions might require complex logic to handle balance adjustments
    // This is a simplified version
    const { description, category_id, tag_id } = req.body;
    try {
      await this.db.query(
        "UPDATE transaction SET description = ?, category_id = ?, tag_id = ? WHERE transaction_id = ? AND user_id = ?",
        [description, category_id, tag_id, req.params.id, req.user.id]
      );
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      this.logger.error("Error updating transaction:", error);
      res.status(400).json({ error: "Failed to update transaction" });
    }
  }

  async deleteTransaction(req, res) {
    // Deleting transactions might require complex logic to handle balance adjustments
    // This is a simplified version
    try {
      await this.db.query(
        "DELETE FROM transaction WHERE transaction_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      res.status(204).send();
    } catch (error) {
      this.logger.error("Error deleting transaction:", error);
      res.status(400).json({ error: "Failed to delete transaction" });
    }
  }
}

class TagController {
  constructor(dbService, logger, util) {
    this.db = dbService;
    this.logger = logger;
    this.util = util;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", this.util.validateRequest(), this.getTags.bind(this));
    this.router.post(
      "/",
      this.util.validateRequest(),
      this.createTag.bind(this)
    );
    this.router.put(
      "/:id",
      this.util.validateRequest(),
      this.updateTag.bind(this)
    );
    this.router.delete(
      "/:id",
      this.util.validateRequest(),
      this.deleteTag.bind(this)
    );
  }

  async getTags(req, res) {
    try {
      const tags = await this.db.query("SELECT * FROM tag WHERE user_id = ?", [
        req.user.id,
      ]);
      res.json(tags);
    } catch (error) {
      this.logger.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  }

  async createTag(req, res) {
    const { tag_name } = req.body;
    try {
      const tagId = uuidv4();
      await this.db.query(
        "INSERT INTO tag (tag_id, user_id, tag_name) VALUES (?, ?, ?)",
        [tagId, req.user.id, tag_name]
      );
      res.status(201).json({ id: tagId, tag_name });
    } catch (error) {
      this.logger.error("Error creating tag:", error);
      res.status(400).json({ error: "Failed to create tag" });
    }
  }

  async updateTag(req, res) {
    const { tag_name } = req.body;
    try {
      await this.db.query(
        "UPDATE tag SET tag_name = ? WHERE tag_id = ? AND user_id = ?",
        [tag_name, req.params.id, req.user.id]
      );
      res.json({ id: req.params.id, tag_name });
    } catch (error) {
      this.logger.error("Error updating tag:", error);
      res.status(400).json({ error: "Failed to update tag" });
    }
  }

  async deleteTag(req, res) {
    try {
      await this.db.query("DELETE FROM tag WHERE tag_id = ? AND user_id = ?", [
        req.params.id,
        req.user.id,
      ]);
      res.status(204).send();
    } catch (error) {
      this.logger.error("Error deleting tag:", error);
      res.status(400).json({ error: "Failed to delete tag" });
    }
  }
}

class BudgetController {
  constructor(dbService, logger, util) {
    this.db = dbService;
    this.logger = logger;
    this.util = util;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.util.validateRequest(),
      this.getBudgets.bind(this)
    );
    this.router.post(
      "/",
      this.util.validateRequest(),
      this.createBudget.bind(this)
    );
    this.router.get(
      "/:id",
      this.util.validateRequest(),
      this.getBudget.bind(this)
    );
    this.router.put(
      "/:id",
      this.util.validateRequest(),
      this.updateBudget.bind(this)
    );
    this.router.delete(
      "/:id",
      this.util.validateRequest(),
      this.deleteBudget.bind(this)
    );
  }

  async getBudgets(req, res) {
    try {
      const budgets = await this.db.query(
        "SELECT * FROM budget WHERE user_id = ?",
        [req.user.id]
      );
      res.json(budgets);
    } catch (error) {
      this.logger.error("Error fetching budgets:", error);
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  }

  async createBudget(req, res) {
    const { category_id, amount, start_date, end_date } = req.body;
    try {
      const budgetId = uuidv4();
      await this.db.query(
        "INSERT INTO budget (budget_id, user_id, category_id, amount, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
        [budgetId, req.user.id, category_id, amount, start_date, end_date]
      );
      res.status(201).json({ id: budgetId, ...req.body });
    } catch (error) {
      this.logger.error("Error creating budget:", error);
      res.status(400).json({ error: "Failed to create budget" });
    }
  }

  async getBudget(req, res) {
    try {
      const [budget] = await this.db.query(
        "SELECT * FROM budget WHERE budget_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      if (budget) {
        res.json(budget);
      } else {
        res.status(404).json({ error: "Budget not found" });
      }
    } catch (error) {
      this.logger.error("Error fetching budget:", error);
      res.status(500).json({ error: "Failed to fetch budget" });
    }
  }

  async updateBudget(req, res) {
    const { category_id, amount, start_date, end_date } = req.body;
    try {
      await this.db.query(
        "UPDATE budget SET category_id = ?, amount = ?, start_date = ?, end_date = ? WHERE budget_id = ? AND user_id = ?",
        [category_id, amount, start_date, end_date, req.params.id, req.user.id]
      );
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      this.logger.error("Error updating budget:", error);
      res.status(400).json({ error: "Failed to update budget" });
    }
  }

  async deleteBudget(req, res) {
    try {
      await this.db.query(
        "DELETE FROM budget WHERE budget_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      res.status(204).send();
    } catch (error) {
      this.logger.error("Error deleting budget:", error);
      res.status(400).json({ error: "Failed to delete budget" });
    }
  }
}

class FinsyncApp {
  constructor() {
    this.app = express();
    this.dbService = new DatabaseService();
    this.logger = new LoggerService();
    this.oauthService = new OAuthService(this.dbService, this.logger);
    this.util = new Util(this.logger, this.oauthService);
    this.setupMiddleware();
    this.setupSwagger();
    this.setupControllers();
    this.setupErrorHandling();
    this.setupStaticFiles();
  }

  setupMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  setupSwagger() {
    const swaggerDocument = YAML.load(path.join(__dirname, "openapi.yaml"));
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  setupControllers() {
    const authController = new AuthController(
      this.dbService,
      this.logger,
      this.util,
      this.oauthService
    );
    const accountController = new AccountController(
      this.dbService,
      this.logger,
      this.util
    );
    const transactionController = new TransactionController(
      this.dbService,
      this.logger,
      this.util
    );
    const tagController = new TagController(
      this.dbService,
      this.logger,
      this.util
    );
    const budgetController = new BudgetController(
      this.dbService,
      this.logger,
      this.util
    );

    this.app.use("/auth", authController.router);
    this.app.use(
      "/accounts",
      this.oauthService.authenticateRequest(),
      accountController.router
    );
    this.app.use(
      "/transactions",
      this.oauthService.authenticateRequest(),
      transactionController.router
    );
    this.app.use(
      "/tags",
      this.oauthService.authenticateRequest(),
      tagController.router
    );
    this.app.use(
      "/budgets",
      this.oauthService.authenticateRequest(),
      budgetController.router
    );
  }

  setupErrorHandling() {
    const handleError = (code, req, res) => {
      const accept = req.accepts(["html", "json", "text"]);
      if (accept === "json") {
        res.status(code).json({ error: "Not Found", url: req.originalUrl });
      } else if (accept === "text") {
        res.status(code).send(`Request ${req.originalUrl} not found`);
      } else {
        res.status(code).sendFile(`${__dirname}/public/${code}.html`);
      }
    };

    this.app.use((err, req, res) => {
      this.logger.error("Unhandled error:", err);
      handleError(500, req, res);
    });
    app.use((req, res) => {
      this.logger.error("Not found error:", req.originalUrl);
      handleError(404, req, res);
    });
  }

  setupStaticFiles() {
    this.app.use(express.static("public"));
  }

  start(port = 3000) {
    return this.app.listen(port, () => {
      this.logger.log(`Server running on port ${port}`);
    });
  }
}

// Usage
const app = new FinsyncApp();
app.start(process.env.PORT || 3000);
