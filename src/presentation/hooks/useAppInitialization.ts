import { useEffect } from 'react';
import { useAppStore } from '../../core/store/useAppStore';
import { ServiceLocator } from '../../core/di/ServiceLocator';

export function useAppInitialization() {
  const setCredentials = useAppStore((s) => s.setCredentials);
  const setRestoringSession = useAppStore((s) => s.setRestoringSession);

  useEffect(() => {
    (async () => {
      try {
        const authRepo = ServiceLocator.getAuthRepository();
        const token = await authRepo.getToken();
        if (token) {
          setCredentials(token, { id: '', email: '', name: '' });
        }
      } catch {
        // Silently fail; show login screen
      } finally {
        setRestoringSession(false);
      }
    })();
  }, []);
}
