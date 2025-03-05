import { BaseAuth } from './BaseAuth';
import { Client, Account } from 'appwrite';

const client = new Client();
const {
  VITE_APPWRITE_ENDPOINT,
  VITE_APPWRITE_PROJECT_ID,
} = import.meta.env;

client
  .setEndpoint(VITE_APPWRITE_ENDPOINT) // Your Appwrite Endpoint
  .setProject(VITE_APPWRITE_PROJECT_ID); // Your project ID

const account = new Account(client);

export class AppwriteAuth extends BaseAuth {
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await account.createEmailPasswordSession(email, password);
      return response;
    } catch (error) {
      throw new Error(`Login failed: ${(error as any).message}`);
    }
  }

  async register(email: string, password: string): Promise<any> {
    try {
      const response = await account.create(email, email, password);
      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${(error as any).message}`);
    }
  }

  async getUser(): Promise<any> {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${(error as any).message}`);
    }
  }

  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      throw new Error(`Logout failed: ${(error as any).message}`);
    }
  }
}