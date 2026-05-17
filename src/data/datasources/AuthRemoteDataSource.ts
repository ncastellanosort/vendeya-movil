import { supabase } from '../../core/supabase/supabaseClient';
import type { LoginResponseDto } from '../dtos/LoginResponseDto';

export class AuthRemoteDataSource {
  async login(email: string, password: string): Promise<LoginResponseDto> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData?.user?.id) {
      throw new Error('No se pudo iniciar sesion');
    }

    // Fetch user profile from public.usuarios
    const { data: profile } = await supabase
      .from('usuarios')
      .select('id, nombre, correo, rol')
      .eq('id', authData.user.id)
      .maybeSingle();

    // If profile exists, return it
    if (profile) {
      return {
        token: authData.session.access_token,
        user: {
          id: profile.id,
          email: profile.correo,
          name: profile.nombre,
          rol: profile.rol,
        },
      };
    }

    // Profile doesn't exist yet — create it from auth data
    const defaultName = (authData.user.user_metadata?.nombre as string)
      || authData.user.email?.split('@')[0]
      || 'Usuario';

    const { data: newProfile, error: insertError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        correo: authData.user.email!,
        nombre: defaultName,
        rol: 'operador',
      })
      .select('id, nombre, correo, rol')
      .single();

    if (insertError) {
      await supabase.auth.signOut();
      throw new Error(insertError.message);
    }

    return {
      token: authData.session.access_token,
      user: {
        id: newProfile.id,
        email: newProfile.correo,
        name: newProfile.nombre,
        rol: newProfile.rol,
      },
    };
  }
}
