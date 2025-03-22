export interface Transaction {
  id: string;
  date: string;
  description: string; // e.g., "Grocery Store"
  amount: number; // e.g., -50.75 for expenses, +1000.00 for income
  category: string; // e.g., "Groceries", "Salary"
  type: "income" | "expense"; // Type of transaction\
  accountId: string; // ID of the account associated with the transaction
}
