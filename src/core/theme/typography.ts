import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  displayLg: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -0.02 * 48,
    fontWeight: '700',
  },
  headlineLg: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  headlineLgMobile: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  titleMd: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodySm: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  labelBold: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.05 * 12,
    fontWeight: '700',
  },
});

export const fontFamilies = {
  headline: 'ArchivoNarrow_700Bold',
  body: 'WorkSans_400Regular',
  bodyBold: 'WorkSans_700Bold',
  bodySemiBold: 'WorkSans_600SemiBold',
};
