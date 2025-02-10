<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Add Account</h2>
      <form @submit.prevent="handleAddAccount" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Account Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Account Name"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Account Type</label>
          <select
            id="type"
            v-model="type"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="asset">Asset</option>
            <option value="liability">Liability</option>
            <option value="equity">Equity</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label for="balance" class="block text-sm font-medium text-gray-700">Initial Balance</label>
          <input
            id="balance"
            v-model="balance"
            type="number"
            placeholder="Initial Balance"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Account
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
    const name = ref('');
    const type = ref('asset');
    const balance = ref(0);

    const handleAddAccount = async () => {
      try {
        const accountData = { name: name.value, type: type.value, balance: balance.value };
        await financeService.createAccount(accountData);
        alert('Account added successfully');
      } catch (error) {
        console.error('Error adding account:', error);
        alert('Failed to add account');
      }
    };

    return { name, type, balance, handleAddAccount };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>