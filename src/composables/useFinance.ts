import { useFinanceStore } from '@/store/financeStore';

export const useFinance = () => {
  const financeStore = useFinanceStore();
  const {
    transactions,
    accounts,
    fetchTransactions,
    loadMoreTransactions,
    fetchAccounts,
    addTransaction,
    editTransaction,
    deleteTransaction,
    hasMore,
  } = financeStore;

  return {
    transactions,
    accounts,
    fetchTransactions,
    loadMoreTransactions,
    fetchAccounts,
    addTransaction,
    editTransaction,
    deleteTransaction,
    hasMore,
  };
};