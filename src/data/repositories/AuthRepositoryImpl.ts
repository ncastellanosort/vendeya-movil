import { supabase } from '../../core/supabase/supabaseClient';
import type { IAuthRepository, AuthCredentials, AuthResult } from '../../domain/repositories/IAuthRepository';
import type { AuthRemoteDataSource } from '../datasources/AuthRemoteDataSource';

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(private remoteDataSource: AuthRemoteDataSource) {}

  async login(credentials: AuthCredentials): Promise<AuthResult> {
    return this.remoteDataSource.login(credentials.email, credentials.password);
  }

  async getToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async clearToken(): Promise<void> {
    await supabase.auth.signOut();
  }
}
