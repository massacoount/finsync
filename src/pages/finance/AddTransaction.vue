<template>
  <div class="p-2 w-full">
    <h2 class="text-2xl font-semibold mb-6 text-center">Add Transaction</h2>
    <form @submit.prevent="handleAddTransaction" class="space-y-4">
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700"
          >Date</label
        >
        <input
          id="date"
          v-model="date"
          type="date"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700"
          >Description</label
        >
        <input
          id="description"
          v-model="description"
          type="text"
          placeholder="Description"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          for="debitAccount"
          class="block text-sm font-medium text-gray-700"
          >Debit Account</label
        >
        <select
          id="debitAccount"
          v-model="debitAccount"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option
            v-for="account in accounts"
            :key="account.id"
            :value="account.id"
          >
            {{ account.name }}
          </option>
        </select>
      </div>
      <div>
        <label
          for="creditAccount"
          class="block text-sm font-medium text-gray-700"
          >Credit Account</label
        >
        <select
          id="creditAccount"
          v-model="creditAccount"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option
            v-for="account in accounts"
            :key="account.id"
            :value="account.id"
          >
            {{ account.name }}
          </option>
        </select>
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
          class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        class="w-full py-2 px-4 bg-blue-500 text-white font-semibold shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Transaction
      </button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useFinance } from "@/composables/useFinance";
import { useNotifications } from "@/composables/useNotifications";

export default {
  setup() {
    const date = ref("");
    const description = ref("");
    const debitAccount = ref("");
    const creditAccount = ref("");
    const amount = ref("");
    const { accounts, fetchAccounts, addTransaction } = useFinance();
    const { addNotification } = useNotifications();

    const handleAddTransaction = async () => {
      try {
        const transactionData = {
          date: date.value,
          description: description.value,
          debit_account_id: debitAccount.value,
          credit_account_id: creditAccount.value,
          amount: amount.value,
        };
        await addTransaction(transactionData);
        addNotification("Transaction added successfully", "success");
      } catch (error) {
        console.error("Error adding transaction:", error);
        addNotification("Failed to add transaction", "error");
      }
    };

    onMounted(fetchAccounts);

    return {
      date,
      description,
      debitAccount,
      creditAccount,
      amount,
      accounts,
      handleAddTransaction,
    };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>