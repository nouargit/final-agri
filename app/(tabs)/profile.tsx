import { IconSymbol } from '@/components/ui/IconSymbol';
import { images } from '@/constants/imports';
import { getDateLocale, setAppLanguage } from '@/lib/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProducerInfo {
  cityId?: number;
  a_longitude?: number;
  a_latitude?: number;
  a_address?: string;
  farmerLicensePhoto?: string;
}

interface UserData {
  id?: string;
  email?: string;
  fullname?: string;
  role?: string;
  createdAt?: string;
  producer?: ProducerInfo | null;
}




function Profile() {


  
  async function getUserData(): Promise<UserData> {
    const jsonValue = await AsyncStorage.getItem('user_data');
    console.log('User Data from AsyncStorage:', jsonValue);
    if (!jsonValue) return {};

    try {
      const raw = JSON.parse(jsonValue);
      const u = raw?.userWithInfo ?? raw?.user ?? raw;
      const normalized: UserData = {
        id: u?.id,
        email: u?.email,
        fullname: u?.fullname,
        role: u?.role,
        createdAt: u?.createdAt,
        producer: u?.producer ?? null,
      };
      return normalized;
    } catch (e) {
      console.warn('Failed parsing user_data; returning empty object');
      return {};
    }
  }



  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();


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
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('profile.cancel'), style: 'cancel' },
        {
          text: t('profile.confirmLogout'),
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
    return date.toLocaleDateString(getDateLocale(), { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const menuItems = [
    { icon: 'person.circle', title: t('profile.menu.editProfile'), subtitle: t('profile.subtitle') },
    { icon: 'heart', title: t('profile.menu.favorites'), subtitle: t('profile.menu.favorites'), onPress: () => router.push('../shopCreationForm') },
    { icon: 'bag', title: t('profile.menu.orderHistory'), subtitle: t('profile.menu.orderHistory') },
    { icon: 'creditcard', title: t('profile.menu.paymentMethods'), subtitle: t('profile.menu.paymentMethods') },
    { icon: 'location', title: t('profile.menu.addresses'), subtitle: t('profile.menu.addresses') },
    { icon: 'bell', title: t('profile.menu.notifications'), subtitle: t('profile.menu.notifications') },
    { icon: 'questionmark.circle', title: t('profile.menu.help'), subtitle: t('profile.menu.help') },
    { icon: 'info.circle', title: t('profile.menu.about'), subtitle: t('profile.menu.about') },
    { icon: 'info.circle', title: t('profile.menu.myShop'), subtitle: t('profile.menu.myShopSubtitle'), onPress:()=>router.push('/shop') },
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
              <Text className="text-3xl font-bold text-neutral-900 dark:text-white">{t('profile.title')}</Text>
              <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-1">{t('profile.subtitle')}</Text>
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
                source={images.fallback}
                className="w-28 h-28 rounded-full border-4 border-white dark:border-neutral-700"
              />
              <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-2 rounded-full">
                <IconSymbol name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-2xl font-gilroy-semibold text-neutral-900 dark:text-white mt-4">
              {data?.fullname || t('profile.guestUser')}
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-400 mt-1">
              {data?.email || t('profile.noEmail')}
            </Text>
            <Text className="text-sm text-neutral-400 dark:text-neutral-500 mt-2">
              {t('profile.memberSince', { date: formatJoinDate(data?.createdAt) })}
            </Text>
            {!!data?.role && (
              <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {`Role: ${data.role}`}
              </Text>
            )}
            {!!data?.producer?.a_address && (
              <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {data.producer.a_address}
              </Text>
            )}
          </View>

          {/* Quick Stats */}
          <View className="flex-row justify-between mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-neutral-900 dark:text-white">12</Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">{t('profile.orders')}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-neutral-900 dark:text-white">4</Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">{t('profile.favorites')}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-neutral-900 dark:text-white">3</Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">{t('profile.inCart')}</Text>
            </View>
            
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">{t('profile.accountSettings')}</Text>

          <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 mb-4">
            <Text className="text-neutral-900 dark:text-white font-semibold mb-3">{t('profile.language')}</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setAppLanguage('en')} className={`px-3 py-2 rounded-full ${i18n.language==='en' ? 'bg-primary' : 'bg-neutral-100 dark:bg-neutral-700'}`}>
                <Text className={`${i18n.language==='en' ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>{t('profile.english')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAppLanguage('fr')} className={`px-3 py-2 rounded-full ${i18n.language==='fr' ? 'bg-primary' : 'bg-neutral-100 dark:bg-neutral-700'}`}>
                <Text className={`${i18n.language==='fr' ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>{t('profile.french')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAppLanguage('ar')} className={`px-3 py-2 rounded-full ${i18n.language==='ar' ? 'bg-primary' : 'bg-neutral-100 dark:bg-neutral-700'}`}>
                <Text className={`${i18n.language==='ar' ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>{t('profile.arabic')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
              activeOpacity={0.7}
              onPress={item.onPress}
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
            <Text className="text-center text-neutral-500 dark:text-neutral-400 text-sm">{t('profile.appNameVersion')}</Text>
            <Text className="text-center text-neutral-400 dark:text-neutral-500 text-xs mt-1">{t('profile.appTagline')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;
