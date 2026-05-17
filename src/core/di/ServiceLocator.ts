import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import type { IScanRepository } from '../../domain/repositories/IScanRepository';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';
import { SendScanUseCase } from '../../domain/usecases/SendScanUseCase';

export class ServiceLocator {
  private static authRepository: IAuthRepository;
  private static scanRepository: IScanRepository;

  static initialize(authRepo: IAuthRepository, scanRepo: IScanRepository) {
    this.authRepository = authRepo;
    this.scanRepository = scanRepo;
  }

  static getLoginUseCase(): LoginUseCase {
    return new LoginUseCase(this.authRepository);
  }

  static getSendScanUseCase(): SendScanUseCase {
    return new SendScanUseCase(this.scanRepository);
  }

  static getAuthRepository(): IAuthRepository {
    return this.authRepository;
  }
}
