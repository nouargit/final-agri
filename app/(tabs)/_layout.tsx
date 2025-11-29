import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { config } from '@/config';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type UserRole = 'producer' | 'buyer' | 'transporter' | null;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Derived role booleans for conditional rendering
  const isProducer = userRole === 'producer';
  const isBuyer = userRole === 'buyer';
  const isTransporter = userRole === 'transporter';

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      console.log('Checking auth status, token:', token ? 'exists' : 'not found');
      setIsAuthenticated(!!token);
      if (token) {
        // Try to fetch user profile to determine role
        try {
          const res = await fetch(`${config.baseUrl}${config.meUrl}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          if (res.ok) {
            const data = await res.json();
            const user = data.data || data.user || data;
            
            // Extract role from various possible response structures
            let role: string | null = null;
            if (typeof user?.role === 'string') {
              role = user.role.toLowerCase();
            } else if (Array.isArray(user?.roles) && user.roles.length > 0) {
              role = user.roles[0].toLowerCase();
            } else if (Array.isArray(user?.data?.roles) && user.data.roles.length > 0) {
              role = user.data.roles[0].toLowerCase();
            } else if (data.session?.userWithInfo?.role) {
              role = data.session.userWithInfo.role.toLowerCase();
            }
            
            // Map to known roles
            if (role?.includes('producer')) {
              setUserRole('producer');
            } else if (role?.includes('buyer')) {
              setUserRole('buyer');
            } else if (role?.includes('transporter')) {
              setUserRole('transporter');
            } else {
              setUserRole(null);
            }
          } else {
            console.warn('Failed to fetch user profile for role detection:', res.status);
            setUserRole(null);
          }
        } catch (e) {
          console.warn('Error determining user role:', e);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUserRole(null);
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

  
   // if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;
  
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
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="Handbag" color={color} />,
        // Cart is hidden - replaced by buyerOrders for buyers
        href: null,
      }}
      />

      <Tabs.Screen
        name="buyerOrders"
        options={{
          title: t('tabs.orders'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list" color={color} />,
          // Buyer orders visible only for buyers
          href: isBuyer ? undefined : null,
        }}
      />
       
      <Tabs.Screen
        name="map"
        options={{
          title: t('tabs.map'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="location" color={color} />,
          // Map is visible only for transporters
          href: isTransporter ? undefined : null,
        }}
      />

      <Tabs.Screen
  name="shop"
  options={{
    title: t('tabs.shop'),
    tabBarIcon: ({ color }) => (
      <IconSymbol size={28} name="Store" color={color} />
    ),
    // Shop is visible only for producers
    href: isProducer ? undefined : null,
  }}
/>

      <Tabs.Screen
        name="preducerOrders"
        options={{
          title: t('tabs.orders'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list" color={color} />,
          // Producer orders visible only for producers
          href: isProducer ? undefined : null,
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
