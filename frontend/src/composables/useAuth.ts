import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const authStore = useAuthStore();
  const { user, login, logout, register } = authStore;
  return {
    user,
    login,
    register,
    logout
  };
};