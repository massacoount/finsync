import { AuthFactory } from "./auth/AuthFactory";
import { BaseAuth } from "./auth/BaseAuth";
import { appConfig } from "@/config/app";
const authService: BaseAuth = AuthFactory.createAuthService(appConfig.backendProvider);
console.log('Creating auth service for provider:', appConfig.backendProvider);
console.log('Auth service:', authService);
export { authService };
