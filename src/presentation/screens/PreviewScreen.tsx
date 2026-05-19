import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { LoadingButton } from '../components/LoadingButton';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { useScan } from '../hooks/useScan';
import { colors } from '../../core/theme/colors';
import { ScanRejectedError } from '../../domain/ScanRejectedError';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

export function PreviewScreen({ navigation, route }: Props) {
  const { photoUri } = route.params;
  const { uploadPhoto, isUploading, error } = useScan();

  const handleSend = async () => {
    try {
      await uploadPhoto(photoUri);
      navigation.reset({ index: 0, routes: [{ name: 'Success' }] });
    } catch (e) {
      if (e instanceof ScanRejectedError) {
        Alert.alert(e.tipo === 'SIN_PRODUCTOS' ? 'Sin productos' : 'Calidad insuficiente', e.message, [
          { text: 'Entendido', onPress: () => navigation.goBack() },
        ]);
      }
    }
  };

  const handleRetake = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topbar}>
        <Text style={styles.brand}>VendeYa</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Vista previa</Text>
          <Text style={styles.subtitle}>Revisa la foto antes de enviarla al sistema</Text>
        </View>

        <View style={styles.imageCard}>
          <Image
            source={{ uri: photoUri }}
            style={styles.image}
            resizeMode="contain"
          />
          {isUploading ? <ProcessingOverlay /> : null}
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <LoadingButton
            title="Retomarla"
            onPress={handleRetake}
            isLoading={false}
            disabled={isUploading}
            variant="outline"
            style={styles.actionButton}
          />
          <LoadingButton
            title="Enviar foto"
            onPress={handleSend}
            isLoading={isUploading}
            style={styles.actionButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topbar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  brand: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 24,
    fontWeight: '700',
    color: colors.onSurface,
  },
  subtitle: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  imageCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  errorBox: {
    backgroundColor: colors.errorContainer,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.onErrorContainer,
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
