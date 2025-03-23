import type { Transaction } from "@/types/finance";

export abstract class BaseFinanceService {
  abstract getTransactions(limit: number, offset: number): Promise<any>;
  abstract addTransaction(transactionData:any): Promise<any>;
  abstract setBudgetTarget(budgetData: { category: string; monthlyTarget: number; notes: string }): Promise<any>;
  abstract importBankStatement(file: File): Promise<any>;
}