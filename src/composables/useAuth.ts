import { ref } from 'vue';
import { login, register } from '@/api/authService';

export function useAuth() {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');

  const loginAction = async (credentials) => {
    const response = await login(credentials);
    token.value = response.data.token;
    user.value = response.data.user;
    localStorage.setItem('token', token.value);
  };

  const logoutAction = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
  };

  return { user, token, loginAction, logoutAction };
}