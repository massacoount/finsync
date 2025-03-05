export interface IAuthProvider {
  login(req: Request): Promise<string>;
  callback(req: Request): Promise<UserProfile>;
  getAuthUrl(): string;
}
