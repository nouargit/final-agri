import { IconSymbol } from '@/components/ui/IconSymbol';
import { images } from '@/constants/imports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserData {
  
   
      name?: string;
      email?: string;
      created_at?: string;
   
  
}

async function getUserData(): Promise<UserData> {
  const jsonValue = await AsyncStorage.getItem('user_data');
  return jsonValue ? JSON.parse(jsonValue) : {};
}


function Profile() {
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(true);
const {data}=useQuery({
  queryKey: ['userData'],
  queryFn: getUserData,
})
  useEffect(() => {
    if (data) {
      setUserData(data);
      setIsLoading(false);
    }
  }, [data]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['auth_token', 'user_data']);
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const menuItems = [
    { icon: 'person.circle', title: 'Edit Profile', subtitle: 'Update your personal information' },
    { icon: 'heart', title: 'Favorites', subtitle: 'Your saved items' },
    { icon: 'bag', title: 'Order History', subtitle: 'View past orders' },
    { icon: 'creditcard', title: 'Payment Methods', subtitle: 'Manage your cards' },
    { icon: 'location', title: 'Addresses', subtitle: 'Delivery addresses' },
    { icon: 'bell', title: 'Notifications', subtitle: 'Manage notifications' },
    { icon: 'questionmark.circle', title: 'Help & Support', subtitle: 'Get help when you need it' },
    { icon: 'info.circle', title: 'About', subtitle: 'App version and info' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950 justify-center items-center">
        <Text className="text-neutral-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Profile</Text>
              <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-1">
                Manage your account
              </Text>
            </View>
            <TouchableOpacity 
              onPress={handleLogout}
              className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full"
            >
              <IconSymbol name="power" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        <View className="mx-6 mb-6 bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm">
          <View className="items-center">
            <View className="relative">
              <Image
                source={images.avatar}
                className="w-28 h-28 rounded-full border-4 border-white dark:border-neutral-700"
              />
              <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-2 rounded-full">
                <IconSymbol name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-2xl font-bold text-neutral-900 dark:text-white mt-4">
              {data?.name || 'Guest User'}
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-400 mt-1">
              {data?.email || 'No email'}
            </Text>
            <Text className="text-sm text-neutral-400 dark:text-neutral-500 mt-2">
              Member since {formatJoinDate(data?.created_at)}
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="flex-row justify-between mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-neutral-900 dark:text-white">12</Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Orders</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-neutral-900 dark:text-white">4</Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Favorites</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-neutral-900 dark:text-white">3</Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">In Cart</Text>
            </View>
            
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Account Settings
          </Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
              activeOpacity={0.7}
            >
              <View className="bg-neutral-100 dark:bg-neutral-700 p-3 rounded-full mr-4">
                <IconSymbol name={item.icon as any} size={20} color="#6b7280" />
              </View>
              
              <View className="flex-1">
                <Text className="text-neutral-900 dark:text-white font-semibold text-base">
                  {item.title}
                </Text>
                <Text className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                  {item.subtitle}
                </Text>
              </View>
              
              <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View className="px-6 mt-6 mb-8">
          <View className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4">
            <Text className="text-center text-neutral-500 dark:text-neutral-400 text-sm">
              Sweeta App v1.0.0
            </Text>
            <Text className="text-center text-neutral-400 dark:text-neutral-500 text-xs mt-1">
              Made with ❤️ for sweet lovers
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;
