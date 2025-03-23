import { defineStore } from 'pinia';
import { ref } from 'vue';
import { financeService } from '@/api/financeService';
import type { Transaction } from '@/types/finance';

export const useFinanceStore = defineStore('finance', () => {
  //TODO: Define the store
  const transactions = ref<any[]>([]);
  const accounts = ref<any[]>([]);
  const limit = ref<number>(10);
  const offset = ref<number>(0);
  const hasMore = ref<boolean>(true);

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
   return [];
  };

  const addTransaction = async (transactionData: Transaction) => {
    try {
      const newTransaction = await financeService.addTransaction(transactionData);
      transactions.value.unshift(newTransaction);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const editTransaction = async (transactionId:number, transactionData: any) => {
    try {
      //const updatedTransaction = await financeService.editTransaction(transactionId, transactionData);
      const updatedTransaction = {};
      const index = transactions.value.findIndex(transaction => transaction.id === transactionId);
      if (index !== -1) {
        transactions.value[index] = updatedTransaction;
      }
    } catch (error) {
      console.error('Error editing transaction:', error);
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      //await financeService.deleteTransaction(transactionId);
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