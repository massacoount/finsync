<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="p-8 m-8 w-full border">
      <h2 class="text-2xl font-semibold mb-6 text-center">Finsync</h2>
      <p class="text-center mb-4">Login to sync your finances</p>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white font-semibold shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

export default {
  setup() {
    const router = useRouter();
    const { login } = useAuth();
    const email = ref('');
    const password = ref('');

    const handleLogin = async () => {
      try {
        console.log('Logging in with:', email.value
        , password.value);
        await login(email.value, password.value);
        // Redirect to dashboard or another page after successful login
        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

    return { email, password, handleLogin };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>