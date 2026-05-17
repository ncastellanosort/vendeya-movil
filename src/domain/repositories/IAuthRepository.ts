import type { User } from '../entities/User';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: User;
}

export interface IAuthRepository {
  login(credentials: AuthCredentials): Promise<AuthResult>;
  getToken(): Promise<string | null>;
  clearToken(): Promise<void>;
}
