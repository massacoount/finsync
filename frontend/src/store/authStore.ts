import { defineStore } from "pinia";
import { ref } from "vue";
import { authService } from "@/api/authService";
import { useNotifications } from "@/composables/useNotifications";
import type User from "@/models/user";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const { addNotification } = useNotifications();

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthService:", authService);
      user.value = await authService.login(email, password);
    } catch (error) {
      addNotification(
        "Login failed. Please check your credentials and try again.",
        "error"
      );
    }
  };
  const logout = async () => {
    try {
      await authService.logout();
      user.value = null;
    } catch (error) {
      addNotification("Logout failed. Please try again.", "error");
    }
  };

  function hasRole(requiredRoles: string[]): boolean {
    return (
      user.value?.roles.some((role) => requiredRoles.includes(role)) ?? false
    );
  }
  return {
    user,
    login,
    logout,
    hasRole,
  };
});
