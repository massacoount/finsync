import { Client, Databases, Storage, ID } from 'appwrite';

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Your Appwrite Endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Your project ID

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = 'your_database_id'; // Replace with your database ID
const EXPENSES_COLLECTION_ID = 'expenses';
const INCOME_COLLECTION_ID = 'income';
const BUDGET_TARGETS_COLLECTION_ID = 'budget_targets';
const BANK_STATEMENTS_BUCKET_ID = 'bank_statements';

export const financeService = {
  async addExpense(expenseData: { date: string; amount: number; category: string; description: string }) {
    const response = await databases.createDocument(DATABASE_ID, EXPENSES_COLLECTION_ID, ID.unique(), expenseData);
    return response;
  },

  async addIncome(incomeData: { date: string; amount: number; source: string; notes: string }) {
    const response = await databases.createDocument(DATABASE_ID, INCOME_COLLECTION_ID, ID.unique(), incomeData);
    return response;
  },

  async setBudgetTarget(budgetData: { category: string; monthlyTarget: number; notes: string }) {
    const response = await databases.createDocument(DATABASE_ID, BUDGET_TARGETS_COLLECTION_ID, ID.unique(), budgetData);
    return response;
  },

  async importBankStatement(file: File) {
    const response = await storage.createFile(BANK_STATEMENTS_BUCKET_ID, ID.unique(), file);
    return response;
  },
};