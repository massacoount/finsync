import { ref } from 'vue';
import { AuthFactory } from '@/api/auth/AuthFactory';
import { BaseAuth } from '@/api/auth/BaseAuth';

const user = ref(null);
const authProvider: BaseAuth = AuthFactory.createAuthProvider(import.meta.env.VITE_AUTH_PROVIDER);

const login = async (email: string, password: string) => {
  try {
    await authProvider.login(email, password);
    user.value = await authProvider.getUser();
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const logout = async () => {
  try {
    await authProvider.logout();
    user.value = null;
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const checkAuth = async () => {
  try {
    user.value = await authProvider.getUser();
  } catch (error) {
    user.value = null;
  }
};

export const useAuth = () => {
  return {
    user,
    login,
    logout,
    checkAuth,
  };
};