import { File } from 'expo-file-system';
import apiClient from '../../core/http/ApiClient';
import { supabase } from '../../core/supabase/supabaseClient';
import type { ScanResponseDto } from '../dtos/ScanResponseDto';
import * as Crypto from 'expo-crypto';

const STORAGE_BUCKET = 'sesion-imagenes';

export class ScanRemoteDataSource {
  async uploadPhoto(sesionId: string, imageUri: string): Promise<ScanResponseDto> {
    // 1. Read file metadata and bytes
    const file = new File(imageUri);
    const fileInfo = await file.info();
    const bytes = await file.bytes();
    const ext = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `photo_${Crypto.randomUUID()}.${ext}`;
    const pesoKb = fileInfo.size ? Math.round(fileInfo.size / 1024) : null;

    // 2. Upload to Supabase Storage
    const storagePath = `${sesionId}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, bytes, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: false,
      });

    if (uploadError) throw new Error(`Error al subir imagen: ${uploadError.message}`);

    // 3. Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    // 4. Insert into imagenes_sesion
    const { error: insertError } = await supabase
      .from('imagenes_sesion')
      .insert({
        sesion_id: sesionId,
        url_imagen: urlData.publicUrl,
        nombre_archivo: fileName,
        formato: ext,
        peso_kb: pesoKb,
      });

    if (insertError) throw new Error(`Error al guardar registro: ${insertError.message}`);

    // 5. Notify central API (fire-and-forget style — don't block on failure)
    try {
      const formData = new FormData();
      formData.append('order_id', sesionId);
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: fileName,
      } as any);

      await apiClient.post<ScanResponseDto>('/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
    } catch {
      // Central API may be down; image is already saved in Supabase
    }

    return { success: true, message: 'Foto procesada' };
  }
}
