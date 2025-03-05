<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Set Budget Target</h2>
      <form @submit.prevent="handleSetBudgetTarget" class="space-y-4">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <input
            id="category"
            v-model="category"
            type="text"
            placeholder="Category"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="monthlyTarget" class="block text-sm font-medium text-gray-700">Monthly Target</label>
          <input
            id="monthlyTarget"
            v-model="monthlyTarget"
            type="number"
            placeholder="Monthly Target"
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
          Set Budget Target
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
    const category = ref('');
    const monthlyTarget = ref('');
    const notes = ref('');

    const handleSetBudgetTarget = async () => {
      try {
        const budgetData = { category: category.value, monthlyTarget: monthlyTarget.value, notes: notes.value };
        await financeService.setBudgetTarget(budgetData);
        alert('Budget target set successfully');
      } catch (error) {
        console.error('Error setting budget target:', error);
        alert('Failed to set budget target');
      }
    };

    return { category, monthlyTarget, notes, handleSetBudgetTarget };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>