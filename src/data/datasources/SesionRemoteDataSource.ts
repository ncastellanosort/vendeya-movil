import { supabase } from '../../core/supabase/supabaseClient';

export class SesionRemoteDataSource {
  async crearSesion(usuarioId: string): Promise<string> {
    const { data, error } = await supabase
      .from('sesiones')
      .insert({
        usuario_id: usuarioId,
        estado: 'activa',
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);
    return data.id;
  }

  async consultarEstado(sesionId: string): Promise<string> {
    const { data, error } = await supabase
      .from('sesiones')
      .select('estado')
      .eq('id', sesionId)
      .single();

    if (error) throw new Error(error.message);
    return data.estado;
  }
}
