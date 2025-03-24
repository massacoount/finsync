<template>
  <div class="mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Profile</h2>
    <div class="mt-auto">
      <button
        @click="logout"
        class="w-full flex items-center justify-center space-x-3 text-red-500 hover:bg-red-100 p-2"
      >
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
    <!-- Add your profile form here -->
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth';

export default {
  name: "Profile",
  setup() {
    const { logout } = useAuth();

    return {
      logout,
    };
  },
};
</script>