import winston from "winston";
import { format } from "winston";

export default class LoggerService {
  constructor() {
    // Define the log format based on the environment
    // Create the logger
    this.logger = winston.createLogger({
      level: "debug", // Set log level to debug for development
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new winston.transports.File({
          filename: process.env.ERROR_LOG_PATH || "error.log", // Default to "error.log" if ERROR_LOG_PATH is not set
          level: "error",
        }),
        new winston.transports.File({
          filename: process.env.APP_LOG_PATH || "app.log",
        }),
      ],
    });
  }

  error(message, meta = {}) {
    this.logger.error(message, meta);
  }

  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
}
