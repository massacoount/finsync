const { createLogger, transports, format } = require("winston");

class LoggerService {
  constructor() {
    // Check if we are in production or not
    this.isProduction = process.env.NODE_ENV === "production";

    // Define the log format based on the environment
    this.logFormat = this.isProduction
      ? format.combine(format.timestamp(), format.json()) // JSON format with timestamp for production
      : format.combine(format.timestamp(), format.prettyPrint()); // Pretty print format with timestamp for development

    // Create the logger
    this.logger = createLogger({
      level: "info", // Set log level to 'info'
      format: this.logFormat, // Use the dynamic log format
      transports: [
        // Info logs
        new transports.File({
          filename: process.env.INFO_LOG_PATH || "info.log", // Default to "info.log" if INFO_LOG_PATH is not set
          level: "info", // Only log info and above (info, warn, error)
        }),

        // Error logs
        new transports.File({
          filename: process.env.ERROR_LOG_PATH || "error.log", // Default to "error.log" if ERROR_LOG_PATH is not set
          level: "error", // Only log errors
        }),

        // Console transport for development (optional, you can disable it in production)
        ...(this.isProduction
          ? []
          : [new transports.Console({ format: this.logFormat })]),
      ],
    });
  }

  // Method to log info messages
  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  // Method to log error messages
  error(message, meta = {}) {
    this.logger.error(message, meta);
  }

  // Method to log warn messages
  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  // Method to log debug messages
  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
}
module.exports = LoggerService;
