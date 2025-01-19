import { BaseAuth } from './BaseAuth';
import { httpClient } from '../httpClient';

export class AppwriteAuth extends BaseAuth {
  async login(email: string, password: string): Promise<any> {
    const response = await httpClient.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string): Promise<any> {
    const response = await httpClient.post('/auth/register', { email, password });
    return response.data;
  }
}