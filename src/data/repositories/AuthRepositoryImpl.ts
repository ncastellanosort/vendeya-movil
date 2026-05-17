import type { IAuthRepository, AuthCredentials, AuthResult } from '../../domain/repositories/IAuthRepository';
import type { AuthRemoteDataSource } from '../datasources/AuthRemoteDataSource';

export class AuthRepositoryImpl implements IAuthRepository {
  private TOKEN_KEY = 'auth_token';

  constructor(
    private remoteDataSource: AuthRemoteDataSource,
    private secureStore: {
      get: (key: string) => Promise<string | null>;
      set: (key: string, value: string) => Promise<void>;
      del: (key: string) => Promise<void>;
    },
  ) {}

  async login(credentials: AuthCredentials): Promise<AuthResult> {
    const dto = await this.remoteDataSource.login(credentials.email, credentials.password);
    await this.secureStore.set(this.TOKEN_KEY, dto.token);
    return { token: dto.token, user: dto.user };
  }

  async getToken(): Promise<string | null> {
    return this.secureStore.get(this.TOKEN_KEY);
  }

  async clearToken(): Promise<void> {
    await this.secureStore.del(this.TOKEN_KEY);
  }
}
