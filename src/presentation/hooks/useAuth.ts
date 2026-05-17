import { useState } from 'react';
import { useAppStore } from '../../core/store/useAppStore';
import { ServiceLocator } from '../../core/di/ServiceLocator';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setCredentials = useAppStore((s) => s.setCredentials);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const useCase = ServiceLocator.getLoginUseCase();
      const result = await useCase.execute({ email, password });
      setCredentials(result.token, result.user);
    } catch (e: any) {
      const message =
        e?.response?.data?.message || e.message || 'Error de conexion';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
