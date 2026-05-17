import type { IScanRepository } from '../../domain/repositories/IScanRepository';
import type { ScanRemoteDataSource } from '../datasources/ScanRemoteDataSource';

export class ScanRepositoryImpl implements IScanRepository {
  constructor(private remoteDataSource: ScanRemoteDataSource) {}

  async uploadPhoto(orderId: string, imageUri: string): Promise<void> {
    await this.remoteDataSource.uploadPhoto(orderId, imageUri);
  }
}
