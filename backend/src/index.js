require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const LoggerService = require("./services/logger.js");
const DatabaseService = require("./services/database.js");
const OAuthService = require("./services/oauth.js");
const Util = require("./utils/util.js");
const AuthController = require("./controllers/auth.js");
const AccountController = require("./controllers/account.js");
const TransactionController = require("./controllers/transaction.js");
const TagController = require("./controllers/tag.js");
const BudgetController = require("./controllers/budget.js");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

class FinsyncApp {
  constructor() {
    try {
      this.app = express();
      this.logger = new LoggerService();
      this.dbService = new DatabaseService(this.logger);
      this.oauthService = new OAuthService(this.logger, this.dbService);
      this.util = new Util(this.logger);
      this.setupMiddleware();
      this.setupSwagger();
      this.setupControllers();
      this.setupStaticFiles();
      this.setupErrorHandling();
      this.logger.log("info", "Initializing Finsync application");
    } catch (err) {
      this.logger.log("error", "Error initializing Finsync application", err);
    }
  }

  setupMiddleware() {
    this.logger.log("debug", "Setting up middleware");
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  setupSwagger() {
    this.logger.log("debug", "Setting up Swagger documentation");
    const swaggerDocument = YAML.load(path.join(__dirname, "openapi.yaml"));
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  setupControllers() {
    this.logger.log("debug", "Setting up controllers");
    const authController = new AuthController(
      this.logger,
      this.dbService,
      this.util,
      this.oauthService
    );
    const accountController = new AccountController(
      this.logger,
      this.dbService,
      this.util
    );
    const transactionController = new TransactionController(
      this.logger,
      this.dbService,
      this.util
    );
    const tagController = new TagController(
      this.logger,
      this.dbService,
      this.util
    );
    const budgetController = new BudgetController(
      this.logger,
      this.dbService,
      this.util
    );

    this.app.use("/auth", authController.router);
    this.app.use(
      "/accounts",
      //this.oauthService.authenticateRequest(),
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
    const handleError = (code, error, req, res) => {
      const accept =
        req.headers && req.headers["accept"]
          ? req.headers["accept"]
          : "application/json";
      if (accept.includes("application/json")) {
        res.status(code).json(error);
      } else if (accept.includes("text/plain")) {
        res.status(code).send(error.message);
      } else {
        res.status(code).sendFile(`${__dirname}/public/${code}.html`);
      }
    };

    this.app.use((err, req, res) => {
      this.logger.log("error", "Unhandled error:", err);
      handleError(
        500,
        {
          error: "Internal Server Error",
          message: "An unexpected error occurred",
        },
        req,
        res
      );
    });
    this.app.use((req, res) => {
      this.logger.log("error", "Not found error:", req.originalUrl);
      handleError(
        404,
        {
          error: "Not Found",
          message: "The requested resource was not found",
        },
        req,
        res
      );
    });
  }

  setupStaticFiles() {
    this.app.use(express.static("public"));
  }

  start(port = 3000) {
    try {
      this.logger.log("info", "Starting server", { port });
      return this.app.listen(port, () => {
        this.logger.log("info", `Server running on port ${port}`);
      });
    } catch (err) {
      this.logger.log("error", "Error starting server", err);
    }
  }
}

// Usage
const app = new FinsyncApp();
app.start(process.env.PORT || 3000);