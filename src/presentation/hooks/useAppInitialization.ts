import { useEffect } from 'react';
import { useAppStore } from '../../core/store/useAppStore';
import { supabase } from '../../core/supabase/supabaseClient';

export function useAppInitialization() {
  const setCredentials = useAppStore((s) => s.setCredentials);
  const setRestoringSession = useAppStore((s) => s.setRestoringSession);

  useEffect(() => {
    // Always start at Login — no session restoration from SecureStore
    setRestoringSession(false);

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
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
          useAppStore.setState({
            token: null,
            user: null,
            isAuthenticated: false,
            currentOrderId: null,
          });
          break;
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
}
