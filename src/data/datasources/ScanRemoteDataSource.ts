import { File } from 'expo-file-system';
import { supabase } from '../../core/supabase/supabaseClient';
import { SCAN_API_URL, SCAN_HEALTH_URL } from '../../core/constants/api';
import type { ScanResponseDto } from '../dtos/ScanResponseDto';
import * as Crypto from 'expo-crypto';
import { ScanRejectedError } from '../../domain/ScanRejectedError';

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

    // 5. Health check before notifying central API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const healthResponse = await fetch(SCAN_HEALTH_URL, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!healthResponse.ok) {
        throw new Error(
          `Health check failed with status ${healthResponse.status}`,
        );
      }

      const healthBody = await healthResponse.json();
      if (healthBody?.status !== 'ok') {
        throw new Error('El servicio de procesamiento no está disponible.');
      }
    } catch (error) {
      if (error instanceof ScanRejectedError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('El servicio de procesamiento no responde. Intente de nuevo.');
      }
      throw new Error('El servicio de procesamiento no está disponible. Intente de nuevo.');
    }

    // 6. Notify central API
    try {
      const { data } = await supabase.auth.getSession();
      const jwtToken = data.session?.access_token;

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: fileName,
      } as any);
      formData.append('sesion_id', sesionId);

      const response = await fetch(SCAN_API_URL, {
        method: 'POST',
        headers: jwtToken
          ? { Authorization: `Bearer ${jwtToken}` }
          : {},
        body: formData,
      });

      if (response.status === 422) {
        const body = await response.json();
        const { tipo, mensaje } = body?.detail ?? {};
        throw new ScanRejectedError(
          tipo ?? 'DESCONOCIDO',
          mensaje ?? 'La imagen no pudo ser procesada.',
        );
      }
      if (!response.ok) {
        throw new Error(`API /scan responded with status ${response.status}`);
      }
    } catch (error) {
      if (error instanceof ScanRejectedError) throw error;
      // Central API may be down; image is already saved in Supabase
    }

    return { success: true, message: 'Foto procesada' };
  }
}
