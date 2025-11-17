import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Tabs, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      console.log('Checking auth status, token:', token ? 'exists' : 'not found');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Re-check authentication when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      checkAuthStatus();
    }, [])
  );

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;
  
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle:
        {
          
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
          
         
          elevation: 0, 
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          borderBottomWidth: 0,
          borderTopWidth: 1,
          marginHorizontal: 0,
          marginBottom: 0,
         
          
          position: 'absolute',
        }
      }}
     >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
     
      <Tabs.Screen
        name="training"
        options={{
          title: t('tabs.explore'),
          
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
      name='cart'
      options={{
        title: t('tabs.cart'),
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="Handbag" color={color} />
      }}
      />
       
      <Tabs.Screen
      name='shop'
      options={{
        title: t('tabs.shop'),
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="Store" color={color} />
      }}
      />
       <Tabs.Screen
      name='profile'
      options={{
        title: t('tabs.profile'),
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="User" color={color} />
      }}
      />

    </Tabs>
  );
}
