import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import './globals.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 0,
    },
  },
});


export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Light': require('../assets/fonts/Quicksand-Light.ttf'),
    'Malika': require('../assets/fonts/malika.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              animation: 'slide_from_right',
              animationTypeForReplace: 'push',
              animationDuration: 300,
            }}
          >
            <Stack.Screen 
              name="(auth)" 
              options={{ 
                headerShown: false,
                animation: 'fade'
              }} 
            />
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_bottom'
              }} 
            />
            <Stack.Screen 
              name="+not-found"
              options={{
                animation: 'slide_from_right'
              }}
            />
            <Stack.Screen 
              name="shopOrdersScreen" 
              options={{ 
                headerShown: true,
                animation: 'slide_from_bottom'
              }} 
            />
            <Stack.Screen 
              name="product" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="cakeDesigner" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_bottom'
              }} 
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaView>
  );
}

