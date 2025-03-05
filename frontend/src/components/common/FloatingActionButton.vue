<template>
  <div class="fixed bottom-24 right-4">
    <button class="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl" @click="toggleActions">+</button>
    <div v-if="showActions" class="flex flex-col items-end mt-2 space-y-2">
      <button class="bg-blue-500 text-white py-2 px-4 rounded shadow" @click="emitAction('addTransaction')">Add Transaction</button>
      <button class="bg-blue-500 text-white py-2 px-4 rounded shadow" @click="emitAction('manageAccounts')">Manage Accounts</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup(_, { emit }) {
    const showActions = ref(false);

    const toggleActions = () => {
      showActions.value = !showActions.value;
    };

    const emitAction = (action) => {
      emit('action', action);
      showActions.value = false;
    };

    return {
      showActions,
      toggleActions,
      emitAction,
    };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>