export interface UserProfile {
    id?: string;
    email: string;
    name: string;
    picture?: string;
    provider: AuthProvider;
  }