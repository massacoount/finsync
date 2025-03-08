import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import ErrorHandler from "./middleware/ErrorHandler";
import authRoutes from "./routes/AuthRoutes";
import accountRoutes from "./routes/AccountRoutes";
import transactionRoutes from "./routes/TransactionRoutes";
import userRoutes from "./routes/UserRoutes";
import AuthMiddleware from "./middleware/AuthMiddleware";
import { addTraceId } from "./config/logger";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(addTraceId);
  }

  private initializeRoutes() {
    this.app.use("/oauth2", authRoutes);
    this.app.use("/accounts", AuthMiddleware.authenticate, accountRoutes);
    this.app.use("/transactions", AuthMiddleware.authenticate, transactionRoutes);
    this.app.use("/users", AuthMiddleware.authenticate, userRoutes);
  }

  private initializeErrorHandling() {
    this.app.use(ErrorHandler.notFoundHandler);
    this.app.use(ErrorHandler.clientErrorHandler);
    this.app.use(ErrorHandler.serverErrorHandler);
  }
}

export default new App().app;