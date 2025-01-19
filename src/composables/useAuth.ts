import { ref } from 'vue';
import { AuthFactory } from '@/api/auth/AuthFactory';
import { BaseAuth } from '@/api/auth/BaseAuth';

export function useAuth() {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');
  const provider = ref(import.meta.env.VITE_AUTH_PROVIDER || 'appwrite'); // Default provider from .env
  const authProvider: BaseAuth = AuthFactory.createAuthProvider(provider.value);

  const loginAction = async (credentials) => {
    const response = await authProvider.login(credentials.email, credentials.password);
    if (provider.value === 'firebase') {
      user.value = response;
      token.value = await response.getIdToken();
    } else {
      token.value = response.token;
      user.value = response.user;
    }
    localStorage.setItem('token', token.value);
  };

  const registerAction = async (userData) => {
    const response = await authProvider.register(userData.email, userData.password);
    if (provider.value === 'firebase') {
      user.value = response;
      token.value = await response.getIdToken();
    } else {
      token.value = response.token;
      user.value = response.user;
    }
    localStorage.setItem('token', token.value);
  };

  const logoutAction = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
  };

  return { user, token, loginAction, registerAction, logoutAction, provider };
}