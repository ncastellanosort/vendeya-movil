import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../../core/store/useAppStore';
import { useAppInitialization } from '../hooks/useAppInitialization';
import { colors } from '../../core/theme/colors';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { PreviewScreen } from '../screens/PreviewScreen';
import { SuccessScreen } from '../screens/SuccessScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Camera: undefined;
  Preview: { photoUri: string };
  Success: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  useAppInitialization();

  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isRestoringSession = useAppStore((s) => s.isRestoringSession);

  if (isRestoringSession) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="Preview" component={PreviewScreen} />
          <Stack.Screen
            name="Success"
            component={SuccessScreen}
            options={{ gestureEnabled: false }}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
