import { useUserStore } from '@/store/userStore';

export const useUser = () => {
  const userStore = useUserStore();
  const { user, fetchUser } = userStore;

  return {
    user,
    fetchUser,
  };
};