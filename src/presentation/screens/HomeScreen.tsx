import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../../core/store/useAppStore';
import { useScan } from '../hooks/useScan';
import * as Crypto from 'expo-crypto';
import { LoadingButton } from '../components/LoadingButton';
import { colors } from '../../core/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const { setCurrentOrderId } = useScan();

  const handleSendPhoto = () => {
    const orderId = Crypto.randomUUID();
    setCurrentOrderId(orderId);
    navigation.navigate('Camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topbar}>
        <View>
          <Text style={styles.brand}>FreshScan AI</Text>
        </View>
        <View style={styles.userBadge}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || 'U')[0].toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.greeting}>Hola, {user?.name || 'Usuario'}</Text>
          <Text style={styles.subtitle}>{"¿"}Que deseas escanear hoy?</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIconBox}>
            <Text style={styles.cardIcon}>📸</Text>
          </View>
          <Text style={styles.cardTitle}>Escanear productos</Text>
          <Text style={styles.cardDescription}>
            Toma una foto de los productos y la IA los reconocera automaticamente
            en tiempo real.
          </Text>

          <LoadingButton
            title="Enviar foto"
            onPress={handleSendPhoto}
            isLoading={false}
            style={styles.sendButton}
          />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoDot} />
          <Text style={styles.infoText}>
            Asegurate de tener buena iluminacion para mejores resultados.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <LoadingButton
          title="Cerrar sesion"
          onPress={logout}
          isLoading={false}
          variant="outline"
          textStyle={styles.logoutText}
          style={styles.logoutButton}
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
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  brand: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'WorkSans_600SemiBold',
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  greeting: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
  },
  subtitle: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardIconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 36,
  },
  cardTitle: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  sendButton: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  infoText: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
    flexShrink: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 12,
  },
  logoutText: {
    color: colors.onSurfaceVariant,
  },
  logoutButton: {
    borderColor: colors.outline,
  },
});
