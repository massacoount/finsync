import { Request, Response } from "express";
import logger from "../config/logger";
import { CustomError } from "../models/CustomError";

class ErrorHandler {
  private static sendErrorResponse(res: Response, statusCode: number, message: string, details?: string) {
    res.status(statusCode);
    if (res.req.accepts('html') || res.req.get('Content-Type') === 'text/html') {
      res.type('html').send(`<h1>${statusCode} - ${message}</h1><p>${details || 'An error occurred.'}</p>`);
    } else if (res.req.accepts('json') || res.req.get('Content-Type') === 'application/json') {
      res.json({ error: message, details });
    } else {
      res.type('txt').send(`${statusCode} - ${message}`);
    }
  }

  public static notFoundHandler(req: Request, res: Response) {
    logger.error(`404 - Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`, req.headers['x-trace-id']);
    this.sendErrorResponse(res, 404, 'Not Found', 'The requested resource could not be found.');
  }

  public static clientErrorHandler(err: CustomError, req: Request, res: Response) {
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, req.headers['x-trace-id']);
    this.sendErrorResponse(res, err.statusCode, err.message, err.details);
  }

  public static serverErrorHandler(err: Error, req: Request, res: Response) {
    logger.error(err.stack || err.message, req.headers['x-trace-id']);
    this.sendErrorResponse(res, 500, 'Internal Server Error', 'Something went wrong on our end.');
  }
}

export default ErrorHandler;
