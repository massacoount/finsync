export default interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  avatar: string;
  provider: string;
  accessToken: string;
  accessTokenExpiresAt: number;
  accessTokenType: string;
  refreshToken: string;
  emailVerified: boolean;
}
