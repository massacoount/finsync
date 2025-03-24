import { defineStore } from "pinia";
import { ref } from "vue";
import { authService } from "@/api/authService";
import { useNotifications } from "@/composables/useNotifications";
import type User from "@/models/user";
import { ApiError } from "@/api/api-error";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const { addNotification } = useNotifications();

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthService:", authService);
      user.value = await authService.login(email, password);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        addNotification(
          error.message,
          error.level
        );
      } else {
        addNotification(
          "An unknown error occurred.",
          "error"
        );
      }
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      user.value = null;
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        addNotification(
          error.message,
          error.level
        );
      } else {
        addNotification(
          "An unknown error occurred.",
          "error"
        );
      }
    }
   }

    const register = async (user: Partial<User>, password: string) => {
      try {
        await authService.register(user, password)
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          addNotification(
            error.message,
            error.level
          );
        } else {
          addNotification(
            "An unknown error occurred.",
            "error"
          );
        }
      }
    };

  const hasRole = (requiredRoles: string[]) => {
    return (
      user.value?.roles.some((role: string) => requiredRoles.includes(role)) ?? false
    );
  }

  return {
    user,
    login,
    logout,
    hasRole,
    register
  };
});
