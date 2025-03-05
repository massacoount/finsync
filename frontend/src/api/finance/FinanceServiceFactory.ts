import { BaseFinanceService } from './BaseFinanceService';
import { AppwriteFinanceService } from './AppwriteFinanceService';

export class FinanceServiceFactory {
  static createFinanceService(provider: string): BaseFinanceService {
    switch (provider) {
      case 'appwrite':
        return new AppwriteFinanceService();
      default:
        throw new Error('Invalid provider');
    }
  }
}