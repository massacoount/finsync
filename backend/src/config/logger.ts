import { createLogger, format, transports, Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

const { combine, timestamp, printf, colorize, json } = format;

const logFormat = printf(({ level, message, timestamp, traceId }) => {
  return `${timestamp} [${level}] [${traceId}]: ${message}`;
});

class LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: combine(
        timestamp(),
        colorize(),
        json(),
        logFormat
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' })
      ],
      exceptionHandlers: [
        new transports.File({ filename: 'logs/error.log' })
      ]
    });
  }

  log(level: string, message: string, traceId?: string | string) {
    this.logger.log({ level, message, traceId });
  }

  info(message: string, traceId?: string | string[]) {
    this.logger.info({ message, traceId });
  }

  error(message: string, traceId?: string| string[]) {
    this.logger.error({ message, traceId });
  }

  // Add other methods as needed
}

export const addTraceId = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['x-trace-id']) {
    delete req.headers['x-trace-id'];
  }
  req.headers['x-trace-id'] = `${new Date().toISOString()}-${uuidv4()}`;
  next();
};

export default new LoggerService();
