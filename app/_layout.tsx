import { useColorScheme } from '@/hooks/useColorScheme';
import i18n, { initializeI18n } from '@/lib/i18n';
import { NavigationContainer } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import './globals.css';


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
  const [langReady, setLangReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Light': require('../assets/fonts/Quicksand-Light.ttf'),
    'Malika': require('../assets/fonts/malika.ttf'),
    'Gilmer-Bold': require('../assets/fonts/Gilmer-Bold.otf'),
    'Gilmer-Regular': require('../assets/fonts/Gilmer-Regular.otf'),
    
    'Gilmer-Thin': require('../assets/fonts/Gilmer-Thin.otf'),
    // Gilroy fonts
    'Gilroy-Light': require('../assets/fonts/Gilroy-Light.ttf'),
    'Gilroy-Regular': require('../assets/fonts/Gilroy-Light.ttf'), // Using Light as Regular
    'Gilroy-Medium': require('../assets/fonts/Gilroy-Medium.ttf'),
    'Gilroy-SemiBold': require('../assets/fonts/Gilroy-SemiBold.ttf'),
    'Gilroy-Bold': require('../assets/fonts/Gilroy-Bold.ttf'),
    'Gilroy-Heavy': require('../assets/fonts/Gilroy-Heavy.ttf'),
    'Dubai-Regular': require('../assets/fonts/Dubai-Regular.ttf'),
  });

  useEffect(() => {
    initializeI18n().then(() => setLangReady(true))
  }, [])

  useEffect(() => {
    if (!langReady) return
    const isArabic = i18n.language === 'ar'
    const anyText = Text as any
    const anyTextInput = TextInput as any
    anyText.defaultProps = anyText.defaultProps || {}
    anyTextInput.defaultProps = anyTextInput.defaultProps || {}
    if (isArabic) {
      anyText.defaultProps.style = [{ fontFamily: 'Dubai-Regular', textAlign: 'right' }]
      anyTextInput.defaultProps.style = [{ fontFamily: 'Dubai-Regular', textAlign: 'right' }]
    } else {
      anyText.defaultProps.style = null
      anyTextInput.defaultProps.style = null
    }
  }, [langReady, i18n.language])

  if (!loaded || !langReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}

