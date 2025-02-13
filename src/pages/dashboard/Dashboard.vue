<template>
  <div class="dashboard">
    <div class="p-4 rounded-xl w-full">
      <h2 class="text-lg font-semibold mb-3">Latest Transactions</h2>
      <div class="relative mb-3">
        <input
          type="text"
          placeholder="Search by Name, Number or Transaction ID"
          class="w-full p-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <span class="absolute left-3 top-3 text-gray-400">🔍</span>
      </div>

      <div class="space-y-4">
        <!-- Transactions List -->
        <div v-for="transaction in transactions" :key="transaction.id" class="flex justify-between items-center py-2 border-b">
          <div class="flex items-center space-x-3">
            <div>
              <p class="text-sm font-semibold">{{ transaction.store }}</p>
              <p class="text-xs text-gray-500">{{ transaction.description }}</p>
              <p class="text-xs text-gray-500">{{ transaction.date }}</p>
              <p class="text-xs text-gray-500">From: {{ transaction.accountFrom }}</p>
              <p class="text-xs text-gray-500">To: {{ transaction.accountTo }}</p>
            </div>
          </div>
          <p :class="{'text-red-500': transaction.amount < 0, 'text-green-500': transaction.amount > 0}" class="font-semibold">
            {{ transaction.amount < 0 ? '-' : '' }}${{ Math.abs(transaction.amount).toFixed(2) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useFinance } from '@/composables/useFinance';

export default {
  setup() {
    const { user, checkAuth } = useAuth();
    const { transactions, fetchTransactions } = useFinance();

    onMounted(async () => {
      await checkAuth();
      if (user.value) {
        fetchTransactions();
      } else {
        console.error('User is not authenticated');
      }
    });

    return { transactions };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>