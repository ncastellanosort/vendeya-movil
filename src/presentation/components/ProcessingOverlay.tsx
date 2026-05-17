import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../core/theme/colors';

export function ProcessingOverlay() {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Procesando...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 16,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  text: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
});
