import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const authStore = useAuthStore();
  const { user, login, logout } = authStore;
  return {
    user,
    login,
    logout
  };
};