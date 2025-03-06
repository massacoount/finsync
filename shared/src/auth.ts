export interface TokenResponse {
    token: string;
}export enum AuthProvider {
  LOCAL = 'LOCAL',
  MICROSOFT = 'MICROSOFT',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB'
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  picture?: string;
  provider: AuthProvider;
}