import { useState } from 'react';
import { useAppStore } from '../../core/store/useAppStore';
import { ServiceLocator } from '../../core/di/ServiceLocator';

export function useScan() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentOrderId = useAppStore((s) => s.currentOrderId);
  const setCurrentOrderId = useAppStore((s) => s.setCurrentOrderId);
  const userId = useAppStore((s) => s.user?.id);

  const crearSesion = async (): Promise<string> => {
    if (!userId) throw new Error('Usuario no autenticado');
    const repo = ServiceLocator.getScanRepository();
    const sesionId = await repo.createSession(userId);
    setCurrentOrderId(sesionId);
    return sesionId;
  };

  const uploadPhoto = async (imageUri: string) => {
    if (!userId) throw new Error('Usuario no autenticado');
    setIsUploading(true);
    setError(null);
    try {
      const repo = ServiceLocator.getScanRepository();
      const sesionId = await repo.createSession(userId);
      setCurrentOrderId(sesionId);

      const useCase = ServiceLocator.getSendScanUseCase();
      await useCase.execute(sesionId, imageUri);
    } catch (e: any) {
      const message = e?.response?.data?.message || e.message || 'Error al enviar';
      setError(message);
      throw e;
    } finally {
      setIsUploading(false);
    }
  };

  return { crearSesion, uploadPhoto, isUploading, error, currentOrderId, setCurrentOrderId };
}
