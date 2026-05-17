import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { CameraFrameOverlay } from '../components/CameraFrameOverlay';
import { useScan } from '../hooks/useScan';
import { colors } from '../../core/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export function CameraScreen({ navigation }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { setCurrentOrderId } = useScan();

  const handleClose = useCallback(() => {
    setCurrentOrderId(null);
    navigation.goBack();
  }, [navigation, setCurrentOrderId]);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (photo?.uri) {
        navigation.navigate('Preview', { photoUri: photo.uri });
      }
    } catch {
      // Camera capture failed silently; user can retry
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Acceso a la camara requerido</Text>
        <Text style={styles.permissionText}>
          Necesitamos acceso a la camara para reconocer los productos automaticamente.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={
            permission.canAskAgain
              ? requestPermission
              : () => Linking.openSettings()
          }
        >
          <Text style={styles.permissionButtonText}>
            {permission.canAskAgain ? 'Conceder permiso' : 'Abrir configuracion'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <CameraFrameOverlay />

        {/* Close button */}
        <SafeAreaView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Header hint */}
        <View style={styles.hintTop}>
          <Text style={styles.hintText}>
            Centra los productos dentro del recuadro
          </Text>
        </View>

        {/* Capture button */}
        <View style={styles.captureContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            activeOpacity={0.7}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const CAPTURE_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  hintTop: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintText: {
    fontFamily: 'WorkSans_400Regular',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: CAPTURE_SIZE,
    height: CAPTURE_SIZE,
    borderRadius: CAPTURE_SIZE / 2,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: CAPTURE_SIZE - 16,
    height: CAPTURE_SIZE - 16,
    borderRadius: (CAPTURE_SIZE - 16) / 2,
    backgroundColor: '#ffffff',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  permissionTitle: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: colors.primaryContainer,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontFamily: 'WorkSans_600SemiBold',
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
