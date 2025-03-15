import { BaseAuth } from './BaseAuth';
import { DefaultAuth } from './DefaultAuth';
import { AppwriteAuth } from './AppwriteAuth';

export class AuthFactory {
  static createAuthService(provider: string): BaseAuth {
    switch (provider) {
      case 'appwrite':
        throw new AppwriteAuth();
      default:
        return new DefaultAuth();
    }
  }
}