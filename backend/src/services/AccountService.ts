import { getRepository } from "typeorm";
import { AccountEntity } from "../entity/Account";
import { Transaction } from '@finsync/shared';

export class AccountService {
  private accountRepository = getRepository(AccountEntity);

  async getAccounts(): Promise<AccountEntity[]> {
    return this.accountRepository.find();
  }

  async createAccount(data: any): Promise<AccountEntity[]> {
    const account = this.accountRepository.create(data);
    const savedAccount = await this.accountRepository.save(account);
    return savedAccount;
  }

  async getAccount(id: string): Promise<AccountEntity| undefined> {
    return this.accountRepository.findOne(id);
  }

  async updateAccount(id: string, data: any): Promise<AccountEntity| undefined> {
    await this.accountRepository.update(id, data);
    return this.getAccount(id);
  }

  async deleteAccount(id: string): Promise<void> {
    await this.accountRepository.delete(id);
  }

  async getAccountTransactions(accountId: string): Promise<Transaction[]> {
    const transactions = await getRepository('Transaction').find({
      where: [{ accountFrom: accountId }, { accountTo: accountId }]
    });
    return transactions as Transaction[];
  }

  async getAccountTransaction(accountId: string, transactionId: string): Promise<Transaction> {
    const transaction = await getRepository('Transaction').findOne({
      where: { id: transactionId, accountFrom: accountId }
    }) || await getRepository('Transaction').findOne({
      where: { id: transactionId, accountTo: accountId }
    });
    return transaction as Transaction;
  }
}
