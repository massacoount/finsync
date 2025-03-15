import { BaseFinanceService } from './BaseFinanceService';
import DefaultFinanceService from './DefaultFinanceService';

export class FinanceServiceFactory {
  static createFinanceService(provider: string): BaseFinanceService {
    switch (provider) {
      case 'appwrite':
        throw new Error('Not implemented');
      case 'firebase':
        throw new Error('Not implemented');
      default:
        return new DefaultFinanceService();
    }
  }
}