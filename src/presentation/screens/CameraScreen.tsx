import React, { useRef, useCallback, useState, useEffect } from 'react';
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

interface LensOption {
  key: string;
  label: string;
  zoom?: number;
}

const FALLBACK_LENSES: LensOption[] = [
  { key: 'ultrawide', label: 'x0.5', zoom: 0 },
  { key: 'wide', label: 'x1', zoom: 0.5 },
  { key: 'telephoto', label: 'x2', zoom: 1 },
];

const LENS_LABEL_MAP: Record<string, string> = {
  builtInUltraWideCamera: 'x0.5',
  builtInWideAngleCamera: 'x1',
  builtInTelephotoCamera: 'x2',
};

function mapLenses(lenses: string[]): LensOption[] {
  if (lenses.length <= 1) return [];
  return lenses.map((l) => ({
    key: l,
    label: LENS_LABEL_MAP[l] ?? l.replace('builtIn', '').replace('Camera', ''),
  }));
}

export function CameraScreen({ navigation }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { setCurrentOrderId } = useScan();

  const [zoom, setZoom] = useState(0);
  const [availableLenses, setAvailableLenses] = useState<LensOption[]>([]);
  const [selectedLens, setSelectedLens] = useState<string | undefined>(undefined);
  const [activeLensKey, setActiveLensKey] = useState<string>('wide');

  const lensOptions = availableLenses.length > 0 ? availableLenses : FALLBACK_LENSES;

  // Detect available lenses on mount
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        // Access CameraView instance methods via type assertion
        const view = cameraRef.current as any;
        if (view?.getAvailableLensesAsync) {
          const lenses: string[] = await view.getAvailableLensesAsync();
          const mapped = mapLenses(lenses);
          if (mapped.length > 0) {
            setAvailableLenses(mapped);
            setActiveLensKey(mapped[1]?.key ?? mapped[0]?.key);
          }
        }
      } catch {
        // Fallback to digital zoom
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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

  const handleLensChange = (option: LensOption) => {
    setActiveLensKey(option.key);
    if (availableLenses.length > 0) {
      setSelectedLens(option.key);
    } else {
      setZoom(option.zoom ?? 0);
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
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        zoom={zoom}
        selectedLens={selectedLens}
      >
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

        {/* Lens switcher */}
        <View style={styles.lensSwitcher}>
          {lensOptions.map((option) => {
            const isActive = option.key === activeLensKey;
            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.lensPill, isActive && styles.lensPillActive]}
                onPress={() => handleLensChange(option)}
                activeOpacity={0.7}
              >
                <Text style={[styles.lensText, isActive && styles.lensTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
  lensSwitcher: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  lensPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    minWidth: 52,
    alignItems: 'center',
  },
  lensPillActive: {
    backgroundColor: colors.primaryContainer,
  },
  lensText: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
  lensTextActive: {
    color: '#ffffff',
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
