export const colors = {
  primary: '#af101a',
  primaryContainer: '#d32f2f',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#fff2f0',
  primaryFixed: '#ffdad6',
  primaryFixedDim: '#ffb3ac',
  surfaceTint: '#ba1a20',
  inversePrimary: '#ffb3ac',

  secondary: '#8f4e00',
  secondaryContainer: '#ff8f00',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#623400',
  secondaryFixed: '#ffdcc2',
  secondaryFixedDim: '#ffb77a',

  tertiary: '#005f7b',
  tertiaryContainer: '#00799c',
  onTertiary: '#ffffff',
  onTertiaryFixed: '#001f2a',

  // Surfaces
  background: '#f4faff',
  surface: '#f4faff',
  surfaceBright: '#f4faff',
  surfaceDim: '#cfdce4',
  surfaceContainer: '#e3f0f8',
  surfaceContainerLow: '#e9f6fd',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#ddeaf2',
  surfaceContainerHighest: '#d7e4ec',
  surfaceVariant: '#d7e4ec',

  // On surfaces
  onSurface: '#111d23',
  onSurfaceVariant: '#5b403d',
  onBackground: '#111d23',

  // Outline
  outline: '#8f6f6c',
  outlineVariant: '#e4beba',

  // Error
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  // Inverse
  inverseSurface: '#263238',
  inverseOnSurface: '#e6f3fb',
} as const;

export type AppColors = typeof colors;
