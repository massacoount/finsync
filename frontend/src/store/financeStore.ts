import { defineStore } from 'pinia';
import { ref } from 'vue';
import { financeService } from '@/api/financeService';

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref([]);
  const accounts = ref([]);
  const limit = ref(10);
  const offset = ref(0);
  const hasMore = ref(true);

  const fetchTransactions = async () => {
    try {
      const newTransactions = await financeService.getTransactions(limit.value, offset.value);
      if (newTransactions.length < limit.value) {
        hasMore.value = false;
      }
      transactions.value.push(...newTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const loadMoreTransactions = async () => {
    if (hasMore.value) {
      offset.value += limit.value;
      await fetchTransactions();
    }
  };

  const fetchAccounts = async () => {
    try {
      accounts.value = await financeService.getAccounts();
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await financeService.addTransaction(transactionData);
      transactions.value.unshift(newTransaction);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const editTransaction = async (transactionId, transactionData) => {
    try {
      const updatedTransaction = await financeService.editTransaction(transactionId, transactionData);
      const index = transactions.value.findIndex(transaction => transaction.id === transactionId);
      if (index !== -1) {
        transactions.value[index] = updatedTransaction;
      }
    } catch (error) {
      console.error('Error editing transaction:', error);
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      await financeService.deleteTransaction(transactionId);
      transactions.value = transactions.value.filter(transaction => transaction.id !== transactionId);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

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
});