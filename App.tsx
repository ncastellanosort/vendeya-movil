import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import {
  useFonts,
  ArchivoNarrow_700Bold,
} from '@expo-google-fonts/archivo-narrow';
import {
  WorkSans_400Regular,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';
import { ServiceLocator } from './src/core/di/ServiceLocator';
import { AuthRepositoryImpl } from './src/data/repositories/AuthRepositoryImpl';
import { ScanRepositoryImpl } from './src/data/repositories/ScanRepositoryImpl';
import { AuthRemoteDataSource } from './src/data/datasources/AuthRemoteDataSource';
import { ScanRemoteDataSource } from './src/data/datasources/ScanRemoteDataSource';
import { SesionRemoteDataSource } from './src/data/datasources/SesionRemoteDataSource';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';

ServiceLocator.initialize(
  new AuthRepositoryImpl(new AuthRemoteDataSource()),
  new ScanRepositoryImpl(new ScanRemoteDataSource(), new SesionRemoteDataSource()),
);

export default function App() {
  const [fontsLoaded] = useFonts({
    ArchivoNarrow_700Bold,
    WorkSans_400Regular,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#af101a" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4faff',
  },
});
