export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';

export interface Account {
  id?: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string; // Matches pattern ^[A-Z]{3}$
  createdAt?: string;
  updatedAt?: string;
}