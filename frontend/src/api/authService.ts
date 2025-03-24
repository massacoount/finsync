import { AuthFactory } from "./auth/AuthFactory";
import { BaseAuth } from "./auth/BaseAuth";
import { appConfig } from "@/config/app";
const authService: BaseAuth = AuthFactory.createAuthService(appConfig.backendProvider);
export { authService };
