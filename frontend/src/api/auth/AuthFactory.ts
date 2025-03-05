import { BaseAuth } from './BaseAuth';
import { FirebaseAuth } from './FirebaseAuth';
import { AppwriteAuth } from './AppwriteAuth';
import { NodeAuth } from './NodeAuth';

export class AuthFactory {
  static createAuthService(provider: string): BaseAuth {
    switch (provider) {
      case 'firebase':
        return new FirebaseAuth();
      case 'appwrite':
        return new AppwriteAuth();
      default:
        return new NodeAuth();
    }
  }
}