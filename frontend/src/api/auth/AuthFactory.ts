import { BaseAuth } from './BaseAuth';
import { DefaultAuth } from './DefaultAuth';

export class AuthFactory {
  static createAuthService(provider: string): BaseAuth {
    switch (provider) {
      case 'firebase':
        throw new Error('Not implemented');
      case 'appwrite':
        throw new Error('Not implemented');
      default:
        return new DefaultAuth();
    }
  }
}