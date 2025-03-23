export interface Transaction {
  id: string;
  date: string;
  description: string; // e.g., "Grocery Store"
  amount: number; // e.g., -50.75 for expenses, +1000.00 for income
  category: string; // e.g., "Groceries", "Salary"
  type: "income" | "expense"; // Type of transaction\
  accountId: string; // ID of the account associated with the transaction
}

export interface TransactionApi {
  transaction_id: string;
  user_id: string;
  description: string;
  amount: number;
  from_account_id: string;
  to_account_id: string;
  category_id: string;
  tag_id: string;
  transaction_date: string;
}

export interface AccountApi {
  account_id: string;
  user_id: string;
  account_name: string;
  opening_balance: number;
  current_balance: number;
  account_type: "CHECKING" | "SAVINGS" | "CREDIT";
  opening_date: string;
}
