<template>
  <div class="p-6 w-full">
    <h2 class="text-2xl font-semibold mb-6 text-center">Add Expense</h2>
    <form @submit.prevent="handleAddExpense" class="space-y-4">
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700"
          >Date</label
        >
        <input
          id="date"
          v-model="date"
          type="date"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label for="amount" class="block text-sm font-medium text-gray-700"
          >Amount</label
        >
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
        <label for="category" class="block text-sm font-medium text-gray-700"
          >Category</label
        >
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
        <label for="description" class="block text-sm font-medium text-gray-700"
          >Description</label
        >
        <textarea
          id="description"
          v-model="description"
          placeholder="Description"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        ></textarea>
      </div>
      <button
        type="submit"
        class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Expense
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { financeService } from "@/api/financeService";

export default {
  setup() {
    const date = ref("");
    const amount = ref("");
    const category = ref("");
    const description = ref("");

    const handleAddExpense = async () => {
      try {
        const expenseData = {
          date: date.value,
          amount: amount.value,
          category: category.value,
          description: description.value,
        };
        await financeService.addExpense(expenseData);
        alert("Expense added successfully");
      } catch (error) {
        console.error("Error adding expense:", error);
        alert("Failed to add expense");
      }
    };

    return { date, amount, category, description, handleAddExpense };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
