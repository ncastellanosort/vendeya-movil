# FreshScan AI — App Móvil

Aplicación móvil de reconocimiento inteligente de productos en supermercados mediante visión artificial. Parte del ecosistema Vendeya: captura imágenes de múltiples productos, las envía a una API central de orquestación, y el sistema —usando Gemini— identifica cada producto, calcula el total de la compra y muestra los resultados en tiempo real.

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Expo (React Native) | SDK 54 | Framework móvil |
| TypeScript | 5.9 | Lenguaje |
| React Navigation | 7 | Navegación entre pantallas |
| Zustand | 5 | Estado global (auth + flujo de escaneo) |
| Axios | 1.16 | Cliente HTTP con interceptors |
| expo-camera | 17 | Captura de fotos |
| expo-crypto | 15 | Generación de UUID para órdenes |
| expo-secure-store | 15 | Almacenamiento seguro del token JWT |
| expo-font | 14 | Carga de fuentes Google |
| Archivo Narrow + Work Sans | — | Tipografía (Google Fonts) |

## Arquitectura

Clean Architecture con 3 capas + infraestructura transversal:

```
App.tsx                     → Entrada: carga fuentes, inicializa DI
  └── AppNavigator          → Stack condicional (auth vs main)
        └── Screens         → Login, Home, Camera, Preview, Success

src/
├── core/                   # Infraestructura cross-cutting
│   ├── constants/api.ts    # URL de la API central y timeout
│   ├── http/ApiClient.ts   # Axios + interceptor de auth + handler 401
│   ├── store/useAppStore   # Zustand: token, user, orderId
│   ├── di/ServiceLocator   # Registro manual de dependencias
│   └── theme/              # Tokens de color (MD3) y tipografía
├── domain/                 # Lógica de negocio pura (sin dependencias)
│   ├── entities/           # User, ScanOrder
│   ├── repositories/       # Interfaces: IAuthRepository, IScanRepository
│   └── usecases/           # LoginUseCase, SendScanUseCase
├── data/                   # Implementaciones concretas
│   ├── dtos/               # Formas de respuesta del API
│   ├── datasources/        # Llamadas HTTP (AuthRemote, ScanRemote)
│   └── repositories/       # Implementaciones de las interfaces domain
└── presentation/           # UI
    ├── navigation/         # AppNavigator (stack condicional)
    ├── screens/            # 5 pantallas del flujo
    ├── components/         # LoadingButton, CameraFrameOverlay
    └── hooks/              # useAuth, useScan, useAppInitialization
```

**Regla de dependencia:** Presentation → Domain (interfaces) ← Data. Domain no importa nada de React/React Native.

## Flujo de la app

```
Login ──→ Home ──→ Camera ──→ Preview ──→ Success ──(reset)──→ Home
                        ↑                      │
                        └─── (retomar) ─────────┘
```

1. **Login** — Credenciales contra la API central. Botón "Modo prueba" para desarrollo sin backend.
2. **Home** — Genera un `order_id` (UUID) y navega a la cámara.
3. **Camera** — Cámara con overlay de recuadro y esquinas. Captura la foto.
4. **Preview** — Previsualiza la imagen. Botones "Enviar foto" (upload) y "Retomarla".
5. **Success** — Confirmación de envío. Muestra el ID de orden. "Volver al inicio".

## Formato del POST /scan

```
POST /scan
Content-Type: multipart/form-data

order_id: 550e8400-e29b-41d4-a716-446655440000
image: photo_<uuid>.jpg (JPEG)
```

## Configuración

```bash
# Endpoint de la API central (por defecto localhost)
EXPO_PUBLIC_API_URL=https://api.vendeya.com/api
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npx expo start

# Con túnel para dispositivos externos
npx expo start --tunnel

# TypeScript check
npx tsc --noEmit

# Plataforma específica
npx expo start --android
npx expo start --ios
```

### Modo prueba (sin API)

En la pantalla de Login, usar el botón **"Entrar en modo prueba"**. Esto:

- Omite la autenticación contra la API
- Simula el upload de la foto (1.2s de delay, retorna éxito)
- Permite testear el flujo completo de cámara y navegación sin backend

El código real de API permanece intacto; solo se activa con credenciales reales y `EXPO_PUBLIC_API_URL` configurada.

## Tema visual

Paleta Material Design 3 extraída del diseño FreshScan AI:

- **Primary** `#af101a` — Rojo intenso (logo, acentos, botones principales)
- **Secondary** `#ff8f00` — Naranja (acciones secundarias, call-to-action)
- **Tertiary** `#00799c` — Teal (éxito, confirmaciones)
- **Background** `#f4faff` — Azul muy claro (fondo general)
- **Surface** `#ffffff` — Blanco (cards, contenedores)

Tipografía: **Archivo Narrow Bold** para headlines, **Work Sans** para cuerpo y labels.

## Repositorios relacionados

| Repositorio | Descripción |
|---|---|
| API Central | Orquestación, health-check, failover Linux↔Windows |
| Backend Linux | Procesamiento principal + integración Gemini |
| Backend Windows | Servidor de respaldo |
| Frontend Monitor | Visualización en tiempo real (caja inteligente) |
| Panel Admin | Gestión de productos, usuarios, reportes |
