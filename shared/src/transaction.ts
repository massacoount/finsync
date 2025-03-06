export interface Transaction {
  id?: string;
  userId: string;
  date: string;
  amount: number;
  description?: string;
  accountFrom: string;
  accountTo: string;
  createdAt?: string;
  updatedAt?: string;
}