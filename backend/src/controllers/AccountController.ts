import { NextFunction, Request, Response } from "express";
import { AccountService } from "../services/AccountService";
import { handleRequest } from '../utils/handleRequest';
import logger from '../config/logger';

export class AccountController {
  constructor(private accountService: AccountService) {}

  getAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Get accounts requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.accountService.getAccounts.bind(this.accountService));
  }

  createAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Create account requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.accountService.createAccount.bind(this.accountService), req.body);
  }

  getAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Get account requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.accountService.getAccount.bind(this.accountService), req.params.id);
  }

  updateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Update account requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.accountService.updateAccount.bind(this.accountService), req.params.id, req.body);
  }

  deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Delete account requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.accountService.deleteAccount.bind(this.accountService), req.params.id);
  }

  getAccountTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Get account transactions requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.accountService.getAccountTransactions.bind(this.accountService), req.params.id);
  }

  getAccountTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Get account transaction requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.accountService.getAccountTransaction.bind(this.accountService), req.params.id, req.params.transactionId);
  }
}
