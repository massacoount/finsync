import { AppwriteFinanceService } from './AppwriteFinanceService';
import { BaseFinanceService } from './BaseFinanceService';
import DefaultFinanceService from './DefaultFinanceService';

export class FinanceServiceFactory {
  static createFinanceService(provider: string): BaseFinanceService {
    switch (provider) {
      case 'appwrite':
        return new AppwriteFinanceService();
      default:
        return new DefaultFinanceService();
    }
  }
}