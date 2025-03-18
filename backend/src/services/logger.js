import winston from 'winston';
import { format } from 'winston';

export default class LoggerService {
  constructor() {
    // Check if we are in production or not
    this.isProduction = process.env.NODE_ENV === 'production';

    // Define the log format based on the environment
    this.logFormat = this.isProduction
      ? format.combine(
          format.timestamp(),
          format.json()
        )
      : format.combine(
          format.colorize(),
          format.timestamp(),
          format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
          })
        );

    // Create the logger
    this.logger = winston.createLogger({
      level: 'debug', // Set log level to debug for development
      format: this.logFormat,
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error'
        }),
        new winston.transports.File({
          filename: 'combined.log'
        })
      ]
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