import { AuthFactory } from "./auth/AuthFactory";
import { BaseAuth } from "./auth/BaseAuth";

const authProvider = import.meta.env.VITE_AUTH_PROVIDER || "appwrite";
const authService: BaseAuth =
  AuthFactory.createAuthService(authProvider);

export { authService };
