import { BaseAuth } from './BaseAuth';
import { Client, Account } from 'appwrite';
import { appwriteConfig } from '@/config/appwrite';

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);
const account = new Account(client);

export class AppwriteAuth extends BaseAuth {
  // eslint-disable-next-line
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await account.createEmailPasswordSession(email, password);
      return response;
    } catch (error) {
      // eslint-disable-next-line
      throw new Error(`Login failed: ${(error as any).message}`);
    }
  }
  // eslint-disable-next-line
  async register(email: string, password: string): Promise<any> {
    try {
      const response = await account.create(email, email, password);
      return response;
    } catch (error) {
      console.log('Error:', typeof error);
       // eslint-disable-next-line
      throw new Error(`Registration failed: ${(error as any).message}`);
    }
  }
  // eslint-disable-next-line
  async getUser(): Promise<any> {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      console.log('Error:', typeof error);
       // eslint-disable-next-line
      throw new Error(`Failed to get user: ${(error as any).message}`);
    }
  }

  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.log('Error:', typeof error);
       // eslint-disable-next-line
      throw new Error(`Logout failed: ${(error as any).message}`);
    }
  }
}