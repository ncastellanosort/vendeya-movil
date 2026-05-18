# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

AGENTS.md includes this file (`@CLAUDE.md`) — keep both in sync. When writing Expo code, reference the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/.

## Commands

```bash
npm start               # expo start (dev server)
npm run android         # expo start --android
npm run ios             # expo start --ios
npx expo start --tunnel # tunnel for external devices
npx tsc --noEmit        # TypeScript check (no build output)
```

There is no test runner, linter, or formatter configured yet.

## Architecture

Clean Architecture with three layers + cross-cutting core:

```
App.tsx (font loading + DI init) → AppNavigator → Screens
```

### Dependency direction

`Presentation` → `Domain` (interfaces only) ← `Data` (implements interfaces)

`Core/` is consumed by all layers. `Domain/` has zero imports from other layers.

### Layers

- **`src/core/`** — `supabase/supabaseClient` (client with SecureStore session adapter), `ApiClient` (axios + auth interceptor reading token from `supabase.auth.getSession()`), `useAppStore` (Zustand), `ServiceLocator` (manual DI registry), `theme/` (MD3 colors + typography), `constants/api` (URLs + timeout).
- **`src/domain/`** — Entities (`User` with `id, email, name, rol`), repository interfaces (`IAuthRepository`, `IScanRepository`), use cases (`LoginUseCase`, `SendScanUseCase`). Pure TypeScript, no React/RN imports.
- **`src/data/`** — Repository implementations (`AuthRepositoryImpl`, `ScanRepositoryImpl`), data sources (`AuthRemoteDataSource`, `ScanRemoteDataSource`, `SesionRemoteDataSource`), DTOs.
- **`src/presentation/`** — Screens (5), components (`LoadingButton`, `CameraFrameOverlay`, `ProcessingOverlay`), hooks (`useAuth`, `useScan`, `useAppInitialization`, `useSessionPolling`), `AppNavigator` (conditional auth stack).

### DI initialization

`ServiceLocator.initialize(authRepo, scanRepo)` is called once in `App.tsx` before any component mounts. `ScanRepositoryImpl` takes two data sources: `ScanRemoteDataSource` + `SesionRemoteDataSource`.

### State management

`useAppStore` (Zustand) holds:
- `token`, `user`, `isAuthenticated`, `isRestoringSession` — auth state
- `currentOrderId` — the active `sesiones.id`, generated when tapping "Enviar foto"

`isRestoringSession` is `false` by default (no session restoration — user always lands on Login). `useAppInitialization` immediately sets it to `false` and subscribes to `supabase.auth.onAuthStateChange` to react to sign-in/sign-out/token-refresh events.

### Session polling

`useSessionPolling` runs in `AppNavigator` when `currentOrderId` is set. Every 30s it calls `getSessionStatus()` — if the session is no longer `'activa'`, it forces logout (session expired server-side).

## Auth flow

Supabase Auth (`signInWithPassword`) handles login. Session is persisted via a custom SecureStore adapter in `supabaseClient.ts`. After login, `AuthRemoteDataSource` fetches the user profile from `public.usuarios` — if the row doesn't exist yet, it auto-creates one with `rol = 'operador'`. The Supabase `access_token` is used as the Bearer token for all API calls.

`ApiClient` interceptor reads the token from `supabase.auth.getSession()`. On 401, it calls `supabase.auth.signOut()`. The Zustand `logout()` also signs out from Supabase and clears `currentOrderId`.

`useAppInitialization` listens to `onAuthStateChange`:
- `SIGNED_IN` / `TOKEN_REFRESHED` → sets credentials from session user metadata
- `SIGNED_OUT` → clears all auth state

## Scan flow (session + storage + DB)

When the user taps "Enviar foto" on HomeScreen:

1. **Create session** — `SesionRemoteDataSource.crearSesion(usuarioId)` inserts into `public.sesiones` (columns: `usuario_id`, `estado = 'activa'`). Returns the session UUID as `order_id`.
2. **Open camera** — navigates to CameraScreen.
3. **Capture & preview** — user takes photo, reviews on PreviewScreen. `ProcessingOverlay` is shown during upload.
4. **Upload** — `ScanRemoteDataSource.uploadPhoto(sesionId, imageUri)`:
   - Reads file via new `File` API (`new File(uri)` → `.info()` + `.bytes()`)
   - Uploads binary to Supabase Storage bucket `sesion-imagenes` at `{sesionId}/{uuid}.jpg`
   - Gets public URL, inserts into `public.imagenes_sesion` (`sesion_id`, `url_imagen`, `nombre_archivo`, `formato`, `peso_kb`)
   - Fire-and-forget POST to central API `/scan` using `fetch()` (multipart/form-data with fields `file` + `sesion_id`, JWT Bearer header)
5. **Success** — navigates to SuccessScreen showing the session ID.

## Database tables

| Table | Key columns | Notes |
|---|---|---|
| `public.usuarios` | `id` (PK, FK→auth.users), `nombre`, `correo`, `rol` | Auto-created on first login if missing |
| `public.sesiones` | `id` (PK), `usuario_id` (FK→usuarios), `estado` | Created when scan flow starts |
| `public.imagenes_sesion` | `id` (PK), `sesion_id` (FK→sesiones), `url_imagen` | One row per uploaded photo |

## Supabase Storage

Bucket: `sesion-imagenes` (public, 10 MB, images only). RLS policies in `supabase-setup.sql`. Use the new `File` API from `expo-file-system` — never the deprecated `FileSystem.getInfoAsync`/`readAsStringAsync`.

```typescript
import { File } from 'expo-file-system';
const file = new File(uri);
const { size } = await file.info();
const bytes = await file.bytes();
```

## Environment variables

Set in `.env` (prefixed with `EXPO_PUBLIC_` for Expo client-side access):

- `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_KEY` — Supabase project credentials
- `EXPO_PUBLIC_SCAN_API_URL_MIGUEL` — scan endpoint URL (per-developer; currently the one wired in `api.ts`)

The `ApiClient` base URL defaults to `http://localhost:3000/api` (no env var currently set).

## Navigation

```
Login → Home → Camera → Preview → Success → (reset) → Home
                          ↑          │
                          └─(retake)─┘
```

- Camera uses `slide_from_bottom` animation.
- Success sets `gestureEnabled: false` and calls `navigation.reset()` to prevent back-navigation.
- CameraScreen clears `currentOrderId` on close/back.

## Camera

`CameraView` from `expo-camera` with `selectedLens` (iOS native lens switching) and `zoom` (Android fallback). Lens selector pills (x0.5, x1, x2) are rendered as an overlay. On mount, calls `getAvailableLensesAsync()` via type assertion to detect multi-lens hardware.

## Theme

Colors from `src/core/theme/colors.ts` — Material Design 3: red primary (`#af101a`), brown secondary (`#8f4e00`), orange secondary container (`#ff8f00`), teal tertiary container (`#00799c`), surface background (`#f4faff`).

Fonts: `ArchivoNarrow_700Bold` (headlines) + `WorkSans_400Regular/600SemiBold/700Bold` (body). Loaded in `App.tsx` via `useFonts`; navigator renders only after fonts are ready.

## Key conventions

- No barrel exports. Import directly from each file.
- Repository interfaces define contracts in Domain; Data implements them.
- Remote data sources return DTOs; repository implementations map them to domain entities.
- Screens receive typed props via `NativeStackScreenProps<RootStackParamList, 'ScreenName'>`.
- New expo-file-system API only: `File` class, never the deprecated `FileSystem.*Async` functions.
- UUID generation uses `Crypto.randomUUID()` from `expo-crypto`, not `expo-crypto`'s `uuid()` function.
