import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { handleRequest } from '../utils/handleRequest';
import logger from '../config/logger';

export class AuthController {
  constructor(private authService: AuthService) {}

  getAccessToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Access token requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.authService.getAccessToken.bind(this.authService), req.body);
  }

  refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Token refresh requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.authService.refreshToken.bind(this.authService), req.body);
  }
}