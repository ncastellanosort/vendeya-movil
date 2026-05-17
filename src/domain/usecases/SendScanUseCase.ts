import type { IScanRepository } from '../repositories/IScanRepository';

export class SendScanUseCase {
  constructor(private scanRepository: IScanRepository) {}

  async execute(orderId: string, imageUri: string): Promise<void> {
    if (!orderId) throw new Error('ID de orden no valido');
    if (!imageUri) throw new Error('Imagen no capturada');
    return this.scanRepository.uploadPhoto(orderId, imageUri);
  }
}
