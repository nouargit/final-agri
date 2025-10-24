import { Redirect, Tabs, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { icons } from "@/constants/imports";
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      initialRouteName="training"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle:
        {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          
         
          elevation: 0, 
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          borderBottomWidth: 0,
          borderRadius: 20,
          marginHorizontal: 0,
          marginBottom: 0,
          borderBlockColor:"transparent",
          borderBlockEndColor:"red",
          position: 'absolute',
        }
      }}
     >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
     
      <Tabs.Screen
        name="training"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
      name='cart'
      options={{
        title:'Cart',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="Handbag" color={color} />
      }}
      />
       
      <Tabs.Screen
      name='shop'
      options={{
        title:'Shop',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="Store" color={color} />
      }}
      />
       <Tabs.Screen
      name='profile'
      options={{
        title:'Profile',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="User" color={color} />
      }}
      />

    </Tabs>
  );
}
