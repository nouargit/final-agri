// d:\AC\src\AuthSendOtpFormRN.tsx
import CategoryCard from '@/components/CategorysCard';
import PromoCard from '@/components/PromoCard';
import categoriesEN from '@/constants/categories';
import { images } from '@/constants/imports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, MapPin, QrCode, Search, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock data for featured products (since items.ts is empty)
const featuredProducts = [
  { id: 1, name: 'Fresh Potatoes', price: 250, image: images.potato, rating: 4.5, category: 'vegetables' },
  { id: 2, name: 'Organic Oranges', price: 350, image: images.orange, rating: 4.8, category: 'Fruits' },
  { id: 3, name: 'Fresh Salad', price: 180, image: images.salad, rating: 4.6, category: 'vegetables' },
  { id: 4, name: 'Wheat Grains', price: 420, image: images.kameh, rating: 4.7, category: 'Grains' },
];

const trendingProducts = [
  { id: 5, name: 'Premium Potatoes', price: 300, image: images.potato, rating: 4.9 },
  { id: 6, name: 'Sweet Oranges', price: 380, image: images.orange, rating: 4.7 },
];

export default function HomeScreen() {
  const [userName, setUserName] = useState('Guest');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useSharedValue(0);
  const { t } = useTranslation();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || 'Guest');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100, 200],
      [1, 0.8, 0.6],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, -50],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const vibration = () => {
    // Haptic feedback can be added here
  };

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <StatusBar style="auto" />
      <SafeAreaView className="flex-1">
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header Section with Gradient */}
          <Animated.View style={headerAnimatedStyle}>
            <View className="px-6 pt-4 pb-6 bg-primary/5 dark:bg-primary/10">
              {/* Top Bar */}
              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t('common.welcome') || 'Welcome back'}
                  </Text>
                  <Text className="text-2xl font-gilroy-bold text-neutral-900 dark:text-white mt-1">
                    {userName} 👋
                  </Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => router.push('/profile')}
                  className="bg-white dark:bg-neutral-800 p-3 rounded-full shadow-sm"
                >
                  <Bell size={24} className="text-primary" color="#22680C" />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View className="flex-row items-center bg-white dark:bg-neutral-800 rounded-2xl px-4 py-3 shadow-sm border border-neutral-200 dark:border-neutral-700">
                <Search size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-neutral-900 dark:text-white font-gilroy-medium"
                  placeholder={t('common.search') || "Search for products..."}
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={() => router.push('/training')}
                />
              </View>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(500)}
            className="px-6 -mt-4 mb-6"
          >
            <View className="bg-white dark:bg-neutral-800 rounded-3xl p-4 shadow-lg border border-neutral-200 dark:border-neutral-700">
              <View className="flex-row justify-between items-center">
                {/* QR Scanner */}
                <TouchableOpacity
                  onPress={() => router.push('/qrCode')}
                  className="items-center flex-1"
                >
                  <View className="bg-primary/10 p-4 rounded-2xl mb-2">
                    <QrCode size={28} color="#22680C" />
                  </View>
                  <Text className="text-xs font-gilroy-semibold text-neutral-700 dark:text-neutral-300">
                    {t('home.scanQR') || 'Scan QR'}
                  </Text>
                </TouchableOpacity>

                {/* Orders */}
                <TouchableOpacity
                  onPress={() => router.push('/orders')}
                  className="items-center flex-1"
                >
                  <View className="bg-primary/10 p-4 rounded-2xl mb-2">
                    <ShoppingBag size={28} color="#22680C" />
                  </View>
                  <Text className="text-xs font-gilroy-semibold text-neutral-700 dark:text-neutral-300">
                    {t('home.orders') || 'My Orders'}
                  </Text>
                </TouchableOpacity>

                {/* Delivery */}
                <TouchableOpacity
                  onPress={() => router.push('/deleveryMap')}
                  className="items-center flex-1"
                >
                  <View className="bg-primary/10 p-4 rounded-2xl mb-2">
                    <MapPin size={28} color="#22680C" />
                  </View>
                  <Text className="text-xs font-gilroy-semibold text-neutral-700 dark:text-neutral-300">
                    {t('home.track') || 'Track'}
                  </Text>
                </TouchableOpacity>

                {/* Cart */}
                <TouchableOpacity
                  onPress={() => router.push('/cart')}
                  className="items-center flex-1"
                >
                  <View className="bg-primary/10 p-4 rounded-2xl mb-2">
                    <ShoppingBag size={28} color="#22680C" />
                  </View>
                  <Text className="text-xs font-gilroy-semibold text-neutral-700 dark:text-neutral-300">
                    {t('home.cart') || 'Cart'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Promo Card */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} className="px-6">
            <PromoCard />
          </Animated.View>

          {/* Categories */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)} className="mt-6">
            <View className="px-6 mb-4 flex-row justify-between items-center">
              <View>
                <Text className="text-xl font-gilroy-bold text-neutral-900 dark:text-white">
                  {t('home.categories') || 'Categories'}
                </Text>
                <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {t('home.exploreProduce') || 'Explore fresh produce'}
                </Text>
              </View>
              <TouchableOpacity>
                <Text className="text-primary font-gilroy-semibold">
                  {t('common.seeAll') || 'See All'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {categoriesEN.map((category, index) => (
                <Animated.View
                  key={category.id}
                  entering={FadeInDown.delay(300 + index * 100).duration(500)}
                >
                  <CategoryCard category={category} vibration={vibration} />
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Featured Products */}
          <Animated.View entering={FadeInDown.delay(400).duration(500)} className="mt-6 px-6">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Sparkles size={24} color="#22680C" />
                <Text className="text-xl font-gilroy-bold text-neutral-900 dark:text-white ml-2">
                  {t('home.featured') || 'Featured Products'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/productShop')}>
                <Text className="text-primary font-gilroy-semibold">
                  {t('common.viewAll') || 'View All'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {featuredProducts.map((product, index) => (
                <Animated.View
                  key={product.id}
                  entering={FadeInDown.delay(450 + index * 100).duration(500)}
                  style={{ width: (width - 48 - 12) / 2, marginBottom: 16 }}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/product?id=${product.id}`)}
                    className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm"
                    activeOpacity={0.8}
                  >
                    <View className="relative">
                      <Image
                        source={product.image}
                        style={{ width: '100%', height: 140 }}
                        resizeMode="cover"
                      />
                      <View className="absolute top-2 right-2 bg-primary px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-gilroy-bold">
                          ⭐ {product.rating}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="p-3">
                      <Text 
                        className="text-sm font-gilroy-bold text-neutral-900 dark:text-white"
                        numberOfLines={1}
                      >
                        {product.name}
                      </Text>
                      <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {product.category}
                      </Text>
                      <View className="flex-row justify-between items-center mt-2">
                        <Text className="text-lg font-gilroy-bold text-primary">
                          {product.price} DZD
                        </Text>
                        <TouchableOpacity className="bg-primary p-2 rounded-full">
                          <ShoppingBag size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Trending Products */}
          <Animated.View entering={FadeInDown.delay(600).duration(500)} className="mt-6 px-6 mb-6">
            <View className="flex-row items-center mb-4">
              <TrendingUp size={24} color="#22680C" />
              <Text className="text-xl font-gilroy-bold text-neutral-900 dark:text-white ml-2">
                {t('home.trending') || 'Trending Now'}
              </Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {trendingProducts.map((product, index) => (
                <Animated.View
                  key={product.id}
                  entering={FadeInDown.delay(650 + index * 100).duration(500)}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/product?id=${product.id}`)}
                    className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm"
                    style={{ width: width * 0.7 }}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row">
                      <Image
                        source={product.image}
                        style={{ width: 120, height: 120 }}
                        resizeMode="cover"
                      />
                      <View className="flex-1 p-4 justify-between">
                        <View>
                          <Text className="text-base font-gilroy-bold text-neutral-900 dark:text-white">
                            {product.name}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Text className="text-xs text-yellow-500">⭐ {product.rating}</Text>
                            <Text className="text-xs text-neutral-400 ml-2">(128 reviews)</Text>
                          </View>
                        </View>
                        <View className="flex-row justify-between items-center">
                          <Text className="text-lg font-gilroy-bold text-primary">
                            {product.price} DZD
                          </Text>
                          <TouchableOpacity className="bg-primary px-4 py-2 rounded-full">
                            <Text className="text-white text-xs font-gilroy-bold">Add</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}