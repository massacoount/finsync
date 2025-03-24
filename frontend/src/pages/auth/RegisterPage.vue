<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8  shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Register</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white font-semibold  shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

export default {
  setup() {
    const { register } = useAuth();
    const name = ref('')
    const email = ref('');
    const password = ref('');

    const handleRegister = async () => {
      await register({name: name.value, email: email.value}, password.value);
    };

    return { email, password, handleRegister };
  },
};
</script>