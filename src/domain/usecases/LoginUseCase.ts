import type { AuthCredentials, AuthResult, IAuthRepository } from '../repositories/IAuthRepository';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: AuthCredentials): Promise<AuthResult> {
    if (!credentials.email?.trim() || !credentials.password?.trim()) {
      throw new Error('Credenciales requeridas');
    }
    return this.authRepository.login(credentials);
  }
}
