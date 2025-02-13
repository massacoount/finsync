import { Client, Databases, Storage, ID } from 'appwrite';
import { BaseFinanceService } from './BaseFinanceService';

const client = new Client();
const {
  VITE_APPWRITE_ENDPOINT,
  VITE_APPWRITE_PROJECT_ID,
  VITE_APPWRITE_API_KEY,
} = import.meta.env;
client
  .setEndpoint(VITE_APPWRITE_ENDPOINT) // Your Appwrite Endpoint
  .setProject(VITE_APPWRITE_PROJECT_ID); // Your project ID

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = 'finsync'; // Replace with your database ID
const TRANSACTIONS_COLLECTION_ID = 'transactions';
const ACCOUNTS_COLLECTION_ID = 'accounts';
const BANK_STATEMENTS_BUCKET_ID = 'bank_statements';

export class AppwriteFinanceService extends BaseFinanceService {
  async getTransactions() {
    const transactions = await databases.listDocuments(DATABASE_ID, TRANSACTIONS_COLLECTION_ID, [], {
      'X-Appwrite-Key': VITE_APPWRITE_API_KEY,
    });
    return transactions.documents;
  }

  async addTransaction(transactionData: { date: Date; amount: number; accountFrom: string; accountTo: string; store: string; remarks: string }) {
    const addTransactionResponse = await databases.createDocument(DATABASE_ID, TRANSACTIONS_COLLECTION_ID, ID.unique(), transactionData, {
      'X-Appwrite-Key': VITE_APPWRITE_API_KEY,
    });
    return { addTransactionResponse };
  }

  async setBudgetTarget(budgetData: { category: string; monthlyTarget: number; notes: string }) {
    const response = await databases.createDocument(DATABASE_ID, ACCOUNTS_COLLECTION_ID, ID.unique(), budgetData, {
      'X-Appwrite-Key': VITE_APPWRITE_API_KEY,
    });
    return response;
  }

  async importBankStatement(file: File) {
    const response = await storage.createFile(BANK_STATEMENTS_BUCKET_ID, ID.unique(), file, {
      'X-Appwrite-Key': VITE_APPWRITE_API_KEY,
    });
    return response;
  }
}