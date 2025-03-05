import { Client, Databases, Storage, ID, Query } from "appwrite";
import { BaseFinanceService } from "./BaseFinanceService";

const client = new Client();
const {
  VITE_APPWRITE_ENDPOINT,
  VITE_APPWRITE_PROJECT_ID,
} = import.meta.env;

client
  .setEndpoint(VITE_APPWRITE_ENDPOINT) // Your Appwrite Endpoint
  .setProject(VITE_APPWRITE_PROJECT_ID); // Your project ID

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = "finsync"; // Replace with your database ID
const TRANSACTIONS_COLLECTION_ID = "transactions";
const ACCOUNTS_COLLECTION_ID = "accounts";
const BANK_STATEMENTS_BUCKET_ID = "bank_statements";

export class AppwriteFinanceService extends BaseFinanceService {
  async getTransactions(limit: number, offset: number) {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION_ID,
      [Query.orderDesc("date"), Query.limit(limit), Query.offset(offset)],
    );
    return transactions.documents;
  }
  async addTransaction(transactionData: {
    date: Date;
    amount: number;
    accountFrom: string;
    accountTo: string;
    store: string;
    remarks: string;
  }) {
    const addTransactionResponse = await databases.createDocument(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION_ID,
      ID.unique(),
      transactionData,
    );
    return addTransactionResponse;
  }

  async editTransaction(
    transactionId: string,
    transactionData: {
      date: Date;
      amount: number;
      accountFrom: string;
      accountTo: string;
      store: string;
      remarks: string;
    }
  ) {
    const editTransactionResponse = await databases.updateDocument(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION_ID,
      transactionId,
      transactionData,
    );
    return editTransactionResponse;
  }

  async deleteTransaction(transactionId: string) {
    await databases.deleteDocument(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION_ID,
      transactionId,
    );
  }

  async setBudgetTarget(budgetData: {
    category: string;
    monthlyTarget: number;
    notes: string;
  }) {
    const response = await databases.createDocument(
      DATABASE_ID,
      ACCOUNTS_COLLECTION_ID,
      ID.unique(),
      budgetData,
    );
    return response;
  }

  async importBankStatement(file: File) {
    const response = await storage.createFile(
      BANK_STATEMENTS_BUCKET_ID,
      ID.unique(),
      file,
    );
    return response;
  }
}
