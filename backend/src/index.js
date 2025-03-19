import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import LoggerService from "./services/logger.js";
import DatabaseService from "./services/database.js";
import OAuthService from "./services/oauth.js";
import Util from "./utils/util.js";
import OauthController from "./controllers/account.js";
import AccountController from "./controllers/account.js";
import TransactionController from "./controllers/transaction.js";
import TagController from "./controllers/tag.js";
import BudgetController from "./controllers/budget.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FinsyncApp {
  constructor() {
    this.app = express();
    this.logger = new LoggerService();

    try {
      this.dbService = new DatabaseService(this.logger);
      this.oauthService = new OAuthService(this.logger, this.dbService);
      this.util = new Util(this.logger);
      this.setupMiddleware();
      this.setupControllers();
      this.setupSwagger();
      this.setupStaticFiles();
      this.setupErrorHandling();
      this.logger.info("Finsync application initialized successfully");
    } catch (err) {
      this.logger.error("Error initializing Finsync application:", err);
      process.exit(1);
    }
  }

  setupMiddleware() {
    this.logger.debug("Setting up middleware");
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }
  setupSwagger() {
    this.logger.debug("Setting up Swagger documentation");
    const swaggerFilePath = path.resolve(__dirname, "../openapi.yaml");
    this.logger.debug(`Loading Swagger documentation from ${swaggerFilePath}`);
    const swaggerDocument = YAML.load(swaggerFilePath);
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  setupControllers() {
    this.logger.debug("Setting up controllers");
    const oauthController = new OauthController(
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

    this.app.use("/auth", oauthController.router);
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
        const errorPagePath = path.resolve(__dirname, `../public/${code}.html`);

        res.status(code).sendFile(errorPagePath, (err) => {
          if (err) {
            this.logger.error(`Error serving error page for code ${code}`, err);

            res.status(code).send(error.message);
          }
        });
      }
    };
    this.app.use((req, res, _next) => {
      this.logger.error(`Not found error requested URL ${req.originalUrl}`);
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
    this.app.use((err, req, res, _next) => {
      this.logger.error("Unhandled error ", { url: req.originalUrl });
      handleError(
        err.status || 500,
        {
          error: "Internal Server Error",
          message: "An unexpected error occurred",
        },
        req,
        res
      );
    });
  }

  setupStaticFiles() {
    this.app.use(express.static(path.join(__dirname, "../public")));
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  async start(port = 3000) {
    try {
      await this.dbService.getConnection();
      this.logger.info("Database connection established");
      this.app.listen(port, () => {
        this.logger.info(`Server running on port ${port}`);
      });
    } catch (err) {
      this.logger.error("Failed to start server:", err);
      process.exit(1);
    }
  }
}

const app = new FinsyncApp();
app.start(process.env.FINSYNC_PORT || 3000);

export default app;
