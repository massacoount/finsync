<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Add Income</h2>
      <form @submit.prevent="handleAddIncome" class="space-y-4">
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
          <input
            id="date"
            v-model="date"
            type="date"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
          <input
            id="amount"
            v-model="amount"
            type="number"
            placeholder="Amount"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="source" class="block text-sm font-medium text-gray-700">Source</label>
          <input
            id="source"
            v-model="source"
            type="text"
            placeholder="Source"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            v-model="notes"
            placeholder="Notes"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Income
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { financeService } from '@/api/financeService';

export default {
  setup() {
    const date = ref('');
    const amount = ref('');
    const source = ref('');
    const notes = ref('');

    const handleAddIncome = async () => {
      try {
        const incomeData = { date: date.value, amount: amount.value, source: source.value, notes: notes.value };
        await financeService.addIncome(incomeData);
        alert('Income added successfully');
      } catch (error) {
        console.error('Error adding income:', error);
        alert('Failed to add income');
      }
    };

    return { date, amount, source, notes, handleAddIncome };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>