import type { IScanRepository } from '../../domain/repositories/IScanRepository';
import type { ScanRemoteDataSource } from '../datasources/ScanRemoteDataSource';
import type { SesionRemoteDataSource } from '../datasources/SesionRemoteDataSource';

export class ScanRepositoryImpl implements IScanRepository {
  constructor(
    private scanDataSource: ScanRemoteDataSource,
    private sesionDataSource: SesionRemoteDataSource,
  ) {}

  async createSession(usuarioId: string): Promise<string> {
    return this.sesionDataSource.crearSesion(usuarioId);
  }

  async uploadPhoto(sesionId: string, imageUri: string): Promise<void> {
    await this.scanDataSource.uploadPhoto(sesionId, imageUri);
  }
}
