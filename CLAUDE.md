# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start          # Dev server (tunnel: npx expo start --tunnel)
npx expo start --android
npx expo start --ios
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

- **`src/core/`** — Cross-cutting: `ApiClient` (axios + auth interceptor), `useAppStore` (Zustand), `ServiceLocator` (manual DI registry), `theme/` (colors + typography tokens).
- **`src/domain/`** — Entities (`User`, `ScanOrder`), repository interfaces (`IAuthRepository`, `IScanRepository`), use cases (`LoginUseCase`, `SendScanUseCase`). Pure TypeScript, no React/RN imports.
- **`src/data/`** — Repository implementations (`AuthRepositoryImpl` wraps SecureStore, `ScanRepositoryImpl` delegates to remote), data sources (`AuthRemoteDataSource`, `ScanRemoteDataSource`), DTOs matching API responses.
- **`src/presentation/`** — Screens, components, hooks (`useAuth`, `useScan`, `useAppInitialization`), and `AppNavigator` (conditional auth stack).

### DI initialization

`ServiceLocator.initialize(authRepo, scanRepo)` is called once in `App.tsx` before any component mounts. Use cases are instantiated fresh from the locator each time a hook calls them — they are stateless.

### State management

`useAppStore` (Zustand) holds:
- `token`, `user`, `isAuthenticated`, `isRestoringSession` — auth state
- `currentOrderId` — scan flow tracking (UUID generated on "Enviar foto" tap)

`isRestoringSession` is `true` by default. `useAppInitialization` checks SecureStore for a saved token and flips it to `false` once done, preventing a login-screen flash.

### Auth & API

`ApiClient` attaches `Authorization: Bearer <token>` via request interceptor. On 401, it clears the token from SecureStore. The actual Supabase/auth calls go through the central API, not directly to Supabase.

### Mock mode for local development

On the Login screen, "Entrar en modo prueba" sets a fake token (`mock-token-dev`) bypassing the API. `ScanRemoteDataSource` detects this token and returns a mock success after a 1.2s delay instead of hitting `/scan`.

## Navigation

React Navigation native-stack with conditional rendering based on `isAuthenticated`:

```
Login → Home → Camera → Preview → Success → (reset) → Home
                          ↑          │
                          └─(retake)─┘
```

- Camera uses `slide_from_bottom` animation.
- Success sets `gestureEnabled: false` and calls `navigation.reset()` to prevent back-navigation to Preview.
- `CameraScreen` clears `currentOrderId` on back/close.

## Theme

Colors from `src/core/theme/colors.ts` — Material Design 3 tokens with red primary (`#af101a`), orange secondary (`#ff8f00`), teal tertiary (`#00799c`), and light blue surface (`#f4faff` background).

Fonts loaded in `App.tsx` via `expo-font` + `@expo-google-fonts/archivo-narrow` (headlines) and `@expo-google-fonts/work-sans` (body/labels). Fonts must finish loading before the navigator renders.

## Key conventions

- No barrel exports. Import directly from each file.
- Repository interfaces define contracts in Domain; Data implements them.
- Remote data sources return DTOs; repository implementations map them to domain entities.
- Screens receive typed props via `NativeStackScreenProps<RootStackParamList, 'ScreenName'>`.
- The `/scan` endpoint expects `multipart/form-data` with fields `order_id` (string UUID) and `image` (JPEG file).
