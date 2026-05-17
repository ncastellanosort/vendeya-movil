import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LoadingButton } from '../components/LoadingButton';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../../core/theme/colors';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    try {
      await login(email.trim(), password);
    } catch {
      // Error handled by useAuth
    }
  };

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>VendeYa</Text>
          <Text style={styles.subtitle}>Reconocimiento inteligente de productos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesion</Text>

          <Text style={styles.label}>Correo electronico</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={colors.outline}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <Text style={styles.label}>Contrasena</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.outline}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <LoadingButton
            title="Iniciar sesion"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={!isFormValid}
            style={styles.loginButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardTitle: {
    fontFamily: 'ArchivoNarrow_700Bold',
    fontSize: 24,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 16,
  },
  label: {
    fontFamily: 'WorkSans_600SemiBold',
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.onSurface,
    fontFamily: 'WorkSans_400Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  errorBox: {
    backgroundColor: colors.errorContainer,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.onErrorContainer,
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 24,
  },
});
