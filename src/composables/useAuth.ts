import { ref } from "vue";
import { authService } from "@/api/authService";
const user = ref(null);

const login = async (email: string, password: string) => {
  try {
    await authService.login(email, password);
    user.value = await authService.getUser();
  } catch (error) {
    console.error("Login failed:", error);
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
    throw new Error("Logout failed. Please try again.");
  }
};

const checkAuth = async () => {
  try {
    user.value = await authService.getUser();
  } catch (error) {
    user.value = null;
    console.error("Check auth failed:", error);
    throw new Error("Failed to check authentication status.");
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
