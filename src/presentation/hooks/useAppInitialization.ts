import { useEffect } from 'react';
import { useAppStore } from '../../core/store/useAppStore';
import { supabase } from '../../core/supabase/supabaseClient';

export function useAppInitialization() {
  const setCredentials = useAppStore((s) => s.setCredentials);
  const setRestoringSession = useAppStore((s) => s.setRestoringSession);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session?.user) {
          const { data: profile } = await supabase
            .from('usuarios')
            .select('id, nombre, correo, rol')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            setCredentials(session.access_token, {
              id: profile.id,
              email: profile.correo,
              name: profile.nombre,
              rol: profile.rol,
            });
          }
        }
      } catch {
        // No active session — show login
      } finally {
        setRestoringSession(false);
      }
    })();
  }, []);
}
