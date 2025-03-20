import { FinanceServiceFactory } from './finance/FinanceServiceFactory';
import { BaseFinanceService } from './finance/BaseFinanceService';
import { appConfig } from '@/config/app';
const financeService: BaseFinanceService = FinanceServiceFactory.createFinanceService(appConfig.backendProvider);
console.log('Creating finance service for provider:', appConfig.backendProvider);
console.log('Finance service:', financeService);
export { financeService };