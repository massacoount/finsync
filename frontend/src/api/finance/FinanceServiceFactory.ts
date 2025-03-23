import { BaseFinanceService } from './BaseFinanceService';
import DefaultFinanceService from './DefaultFinanceService';

export class FinanceServiceFactory {
  static createFinanceService(provider: string): BaseFinanceService {
    switch (provider) {
      default:
        return new DefaultFinanceService();
    }
  }
}