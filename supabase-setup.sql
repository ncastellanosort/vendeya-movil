-- ============================
-- Ejecutar en Supabase SQL Editor
-- ============================

-- 1. Storage bucket para imágenes de sesiones
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sesion-imagenes',
  'sesion-imagenes',
  true,
  10485760,  -- 10 MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heif', 'image/heic']
);

-- Políticas del bucket
CREATE POLICY "Usuarios autenticados pueden subir" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'sesion-imagenes');

CREATE POLICY "Acceso publico de lectura" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'sesion-imagenes');

-- 2. RLS para tabla sesiones
ALTER TABLE public.sesiones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados crean sesiones" ON public.sesiones
  FOR INSERT
  TO authenticated
  WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuarios ven sus propias sesiones" ON public.sesiones
  FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

-- 3. RLS para tabla imagenes_sesion
ALTER TABLE public.imagenes_sesion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios insertan en sus sesiones" ON public.imagenes_sesion
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sesion_id IN (
      SELECT id FROM public.sesiones WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios ven imagenes de sus sesiones" ON public.imagenes_sesion
  FOR SELECT
  TO authenticated
  USING (
    sesion_id IN (
      SELECT id FROM public.sesiones WHERE usuario_id = auth.uid()
    )
  );
