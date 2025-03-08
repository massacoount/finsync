import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { handleRequest } from '../utils/handleRequest';
import logger from '../config/logger';

export class UserController {
  constructor(private userService: UserService) {}

  getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Get users requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.userService.getUsers.bind(this.userService));
  }

  createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Create user requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.userService.createUser.bind(this.userService), req.body);
  }

  getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Get user requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.userService.getUser.bind(this.userService), req.params.id);
  }

  updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Update user requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.userService.updateUser.bind(this.userService), req.params.id, req.body);
  }

  deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Delete user requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.userService.deleteUser.bind(this.userService), req.params.id);
  }
}
