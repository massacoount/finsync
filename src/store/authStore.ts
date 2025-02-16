import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { authService } from "@/api/authService";
import { useNotifications } from "@/composables/useNotifications";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const { addNotification } = useNotifications();

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      user.value = await authService.getUser();
    } catch (error) {
      console.error("Login failed:", error);
      addNotification(
        "Login failed. Please check your credentials and try again.",
        "error"
      );
      throw new Error(
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      user.value = null;
    } catch (error) {
      console.error("Logout failed:", error);
      addNotification("Logout failed. Please try again.", "error");
      throw new Error("Logout failed. Please try again.");
    }
  };

  const checkAuth = async () => {
    try {
      user.value = await authService.getUser();
      if (user.value) {
        addNotification("User authenticated", "success");
      } else {
        addNotification("User not authenticated", "warning");
      }
      return user.value;
    } catch (error) {
      user.value = null;
      console.error("Check auth failed:", error);
    }
  };

  return {
    user,
    login,
    logout,
    checkAuth,
  };
});
