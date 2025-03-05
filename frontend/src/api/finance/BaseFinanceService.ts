export abstract class BaseFinanceService {
  abstract getTransactions(limit: number, offset: number): Promise<any>;
  abstract addTransaction(transactionData: { date: Date; amount: number; accountFrom: string; accountTo: string; store: string; remarks: string }): Promise<any>;
  abstract setBudgetTarget(budgetData: { category: string; monthlyTarget: number; notes: string }): Promise<any>;
  abstract importBankStatement(file: File): Promise<any>;
}