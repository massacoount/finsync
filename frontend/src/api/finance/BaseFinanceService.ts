import type { Transaction } from "@/types/finance";

export abstract class BaseFinanceService {
  abstract getTransactions(
    limit: number,
    offset: number
  ): Promise<Transaction[]>;
  abstract addTransaction(transaction: Transaction): Promise<Transaction>;
  abstract importBankStatement(file: File): Promise<Transaction[]>;
}
