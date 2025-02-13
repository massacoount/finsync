import { ref } from 'vue';
import { financeService } from '@/api/financeService';

export const useFinance = () => {
  const transactions = ref([]);

  const fetchTransactions = async () => {
    try {
      transactions.value = await financeService.getTransactions();
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return {
    transactions,
    fetchTransactions,
  };
};