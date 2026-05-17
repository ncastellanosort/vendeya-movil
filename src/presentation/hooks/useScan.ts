import { useState } from 'react';
import { useAppStore } from '../../core/store/useAppStore';
import { ServiceLocator } from '../../core/di/ServiceLocator';

export function useScan() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentOrderId = useAppStore((s) => s.currentOrderId);
  const setCurrentOrderId = useAppStore((s) => s.setCurrentOrderId);

  const uploadPhoto = async (imageUri: string) => {
    if (!currentOrderId) throw new Error('No hay una orden activa');
    setIsUploading(true);
    setError(null);
    try {
      const useCase = ServiceLocator.getSendScanUseCase();
      await useCase.execute(currentOrderId, imageUri);
    } catch (e: any) {
      const message =
        e?.response?.data?.message || e.message || 'Error al enviar';
      setError(message);
      throw e;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadPhoto, isUploading, error, currentOrderId, setCurrentOrderId };
}
