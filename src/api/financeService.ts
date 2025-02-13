import { FinanceServiceFactory } from './finance/FinanceServiceFactory';
import { BaseFinanceService } from './finance/BaseFinanceService';

const financeProvider = import.meta.env.VITE_FINANCE_PROVIDER || 'appwrite';
const financeService: BaseFinanceService = FinanceServiceFactory.createFinanceService(financeProvider);

export { financeService };