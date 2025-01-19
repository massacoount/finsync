<template>
  <div class="max-w-lg mx-auto bg-white shadow-md rounded-md p-6">
    <h2 class="text-2xl font-bold mb-4">Import Bank Statement</h2>
    <form @submit.prevent="importBankStatement">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Select File</label>
        <input type="file" @change="onFileChange" class="w-full p-2 border border-gray-300 rounded" />
      </div>
      <button type="submit" class="bg-primary-color text-white py-2 px-4 rounded hover:bg-blue-600">Upload</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { financeService } from '@/api/financeService';

export default {
  setup() {
    const file = ref(null);

    const onFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const importBankStatement = async () => {
      try {
        if (file.value) {
          await financeService.importBankStatement(file.value);
          alert('Bank statement imported successfully');
        } else {
          alert('Please select a file');
        }
      } catch (error) {
        console.error('Error importing bank statement:', error);
        alert('Failed to import bank statement');
      }
    };

    return { file, onFileChange, importBankStatement };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>