import apiClient from '../../core/http/ApiClient';
import { useAppStore } from '../../core/store/useAppStore';
import type { ScanResponseDto } from '../dtos/ScanResponseDto';
import * as Crypto from 'expo-crypto';

export class ScanRemoteDataSource {
  async uploadPhoto(orderId: string, imageUri: string): Promise<ScanResponseDto> {
    // Mock bypass for dev testing — simulates API without hitting the server
    if (useAppStore.getState().token === 'mock-token-dev') {
      await new Promise((r) => setTimeout(r, 1200));
      return { success: true, message: 'Foto procesada (mock)' };
    }

    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `photo_${Crypto.randomUUID()}.jpg`,
    } as any);

    const response = await apiClient.post<ScanResponseDto>('/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return response.data;
  }
}
