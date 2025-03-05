import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService } from '../api/authService';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  const fetchUser = async () => {
    try {
      user.value = await authService.getUser();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      user.value = null;
    }
  };

  return {
    user,
    fetchUser,
  };
});