import { useAuthStore } from "@/store/authStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  if (!authStore.user && to.path !== "/auth/login") {
    return next({ path: "/auth/login", query: { returnUrl: to.fullPath } });
  }

  // Check for required roles
  if (to.meta.roles && !authStore.hasRole(to.meta.roles as string[])) {
    return next({ path: "/unauthorized" });
  }

  next();
}
