import winston from "winston";
import { format } from "winston";

export default class LoggerService {
  constructor() {
    this.logger = winston.createLogger({
      level: "debug",
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new winston.transports.File({
          filename: process.env.ERROR_LOG_PATH || "error.log",
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
