export interface AuthProvider {
  login(email: string, password: string): Promise<any>;
  register(email: string, password: string): Promise<any>;
}

export abstract class BaseAuth implements AuthProvider {
  abstract login(email: string, password: string): Promise<any>;
  abstract register(email: string, password: string): Promise<any>;
  abstract getUser(): Promise<any>;
  abstract logout(): Promise<void>;
}