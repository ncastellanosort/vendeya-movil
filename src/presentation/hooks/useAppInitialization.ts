import { useEffect } from 'react';
import { useAppStore } from '../../core/store/useAppStore';
import { supabase } from '../../core/supabase/supabaseClient';

export function useAppInitialization() {
  const setCredentials = useAppStore((s) => s.setCredentials);
  const logout = useAppStore((s) => s.logout);
  const setRestoringSession = useAppStore((s) => s.setRestoringSession);

  useEffect(() => {
    let restored = false;

    // 1. Restore session from SecureStore on app start
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
        restored = true;
        setRestoringSession(false);
      }
    })();

    // 2. Listen for auth state changes (sign out, token refresh, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Only react after initial restoration is done to avoid race conditions
      if (!restored) return;

      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            setCredentials(session.access_token, {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.nombre ?? session.user.email?.split('@')[0] ?? 'Usuario',
              rol: 'operador',
            });
          }
          break;

        case 'SIGNED_OUT':
          logout();
          break;
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
}
