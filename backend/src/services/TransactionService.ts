import { getRepository } from "typeorm";
import { injectable } from "tsyringe";
import { CustomError } from "../models/CustomError";
import { TransactionEntity } from "../entity/Transaction";
import { Transaction } from "@finsync/shared";

@injectable()
export class TransactionService {
  private transactionRepository = getRepository(TransactionEntity);

  async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find();
    return transactions.map(transaction => ({
      id: `${transaction.id!}`,
      amount: transaction.amount!,
      date: transaction.date!.toISOString(),
      description: transaction.description!,
      accountFrom: transaction.accountFrom!,
      accountTo: transaction.accountTo!,
      userId: `${transaction.user?.id!}`
    }));
  }

  async createTransaction(data: any): Promise<Transaction> {
    const transaction = this.transactionRepository.create(data);
    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.getTransaction(`${(savedTransaction as TransactionEntity).id!}`);
  }

  async getTransaction(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne(id);
    if (!transaction) {
      throw new CustomError("Transaction not found", 404);
    }
    return {
      id: `${transaction.id!}`,
      amount: transaction.amount!,
      date: transaction.date!.toISOString(),
      description: transaction.description!,
      accountFrom: transaction.accountFrom!,
      accountTo: transaction.accountTo!,
      userId: `${transaction.user?.id!}`
    }
  }

  async updateTransaction(id: string, data: any): Promise<Transaction> {
    await this.transactionRepository.update(id, data);
    return this.getTransaction(id);
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
