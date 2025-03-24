import { BaseAuth } from './BaseAuth';
import { DefaultAuth } from './DefaultAuth';

export class AuthFactory {
  static createAuthService(provider: string): BaseAuth {
    console.debug('Creating auth service for provider:', provider);
    switch (provider) {
      default:
        return new DefaultAuth();
    }
  }
}