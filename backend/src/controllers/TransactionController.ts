import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/TransactionService';
import { handleRequest } from '../utils/handleRequest';
import logger from '../config/logger';

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Get transactions requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.transactionService.getTransactions.bind(this.transactionService));
  }

  createTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Create transaction requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.transactionService.createTransaction.bind(this.transactionService), req.body);
  }

  getTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Get transaction requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.transactionService.getTransaction.bind(this.transactionService), req.params.id);
  }

  updateTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Update transaction requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.transactionService.updateTransaction.bind(this.transactionService), req.params.id, req.body);
  }

  deleteTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Delete transaction requested', req.headers['x-trace-id']);
    return handleRequest(req, res, next, this.transactionService.deleteTransaction.bind(this.transactionService), req.params.id);
  }
}
