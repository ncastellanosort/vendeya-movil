import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { LoadingButton } from '../components/LoadingButton';
import { useScan } from '../hooks/useScan';
import { colors } from '../../core/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

export function SuccessScreen({ navigation }: Props) {
  const { setCurrentOrderId, currentOrderId } = useScan();

  const handleGoHome = () => {
    setCurrentOrderId(null);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Enviado</Text>
        <Text style={styles.subtitle}>
          La foto se ha enviado correctamente al sistema de reconocimiento.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>ID de orden</Text>
          <Text style={styles.infoValue}>
            {currentOrderId?.slice(0, 8) ?? '---'}
          </Text>
        </View>

        <LoadingButton
          title="Volver al inicio"
          onPress={handleGoHome}
          isLoading={false}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  checkmark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkmarkIcon: {
    color: colors.onTertiary,
    fontSize: 40,
    fontWeight: '700',
  },
  title: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 15,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  infoCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: 36,
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 14,
    color: colors.onSurface,
    fontWeight: '700',
    marginTop: 4,
  },
  button: {
    minWidth: 220,
  },
});
