import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import './globals.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import useAuthStore from '@/stors/Auth';
import { useEffect } from 'react';
import { AuthProvider } from 'react-native-laravel-sanctum';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();
  const config = {
    loginUrl: 'http://10.0.2.2:8000/sanctum/token',
    logoutUrl: 'http://10.0.2.2:8000/logout',
    userUrl: 'http://10.0.2.2:8000/api/user',
    csrfTokenUrl: 'http://10.0.2.2:8000/sanctum/csrf-cookie',
  };
  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Light': require('../assets/fonts/Quicksand-Light.ttf'),
    'Malika': require('../assets/fonts/malika.ttf'),
  });

  if (!loaded || isLoading) {
    return null;
  }

  return (
     <AuthProvider
      config={config}
    >
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="product" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </AuthProvider>
  );
}
