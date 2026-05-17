import { useEffect } from 'react';
import { useAppStore } from '../../core/store/useAppStore';
import { ServiceLocator } from '../../core/di/ServiceLocator';

export function useSessionPolling() {
  const currentOrderId = useAppStore((s) => s.currentOrderId);
  const logout = useAppStore((s) => s.logout);

  useEffect(() => {
    if (!currentOrderId) return;

    const interval = setInterval(async () => {
      try {
        const scanRepo = ServiceLocator.getScanRepository();
        const estado = await scanRepo.getSessionStatus(currentOrderId);
        if (estado !== 'activa') {
          logout();
        }
      } catch {
        // Error consultando — reintentará en 30s
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [currentOrderId]);
}
