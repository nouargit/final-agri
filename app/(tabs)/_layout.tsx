import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { icons } from "@/constants/imports";
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/stors/Auth';

export default function TabLayout() {
  const {isAuthenticated} = useAuth();
  const colorScheme = useColorScheme();
  
  console.log('TabLayout - Auth state:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('TabLayout - not authenticated, redirecting to sign-in');
    return <Redirect href="/(auth)/sign-in" />;
  }
  
  console.log('TabLayout - authenticated, showing tabs');
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
            height: -2,
          },
          borderBottomWidth: 0,
          borderRadius: 20,
          marginHorizontal: 15,
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
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="Plus" color={color} />
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
