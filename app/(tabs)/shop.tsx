import { config } from '@/config';
import { images } from '@/constants/imports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Package, Plus, Search, ShoppingBag, X } from 'lucide-react-native';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';




const HEADER_IMAGE_HEIGHT = 250;
const AVATAR_SIZE = 120;
const PROFILE_OVERLAP = 100;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: string;
  producer_id: string;
  stock: number;
}

interface Category {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const scrollY = useSharedValue(0);
  const theme = useColorScheme();
  const { t } = useTranslation();

  // Fetch user data
  const getUserData = async (): Promise<UserData | null> => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  // Fetch categories
  const getCategories = async (): Promise<Category[]> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${config.baseUrl}${config.categoriesUrl}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  // Fetch producer products
  const getProducerProducts = async (): Promise<Product[]> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${config.baseUrl}${config.preducerProductsUrl}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      console.log('Fetched products:', data);
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const { data: userData } = useQuery({
    queryKey: ['userData'],
    queryFn: getUserData,
  });

  const { data: categories = [], refetch: refetchCategories, isRefetching: isRefetchingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts, isRefetching: isRefetchingProducts } = useQuery({
    queryKey: ['producerProducts'],
    queryFn: getProducerProducts,
  });

  const onRefresh = () => {
    refetchCategories();
    refetchProducts();
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || product.category_id === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = ['All', ...categories.map(cat => cat.name)];

  // Animated styles for the entire header section
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200, 300],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, -100],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Animated styles for the header image (parallax effect)
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.5, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          Alert.alert(t('shop.error') || 'Error', 'Authentication required');
          return;
        }

        const response = await fetch(`${config.baseUrl}${config.categoriesUrl}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newCategory.trim(),
          }),
        });

        if (response.ok) {
          await refetchCategories();
          setNewCategory('');
          setModalVisible(false);
          Alert.alert(t('common.success') || 'Success', t('shop.addCategorySuccess') || 'Category added successfully');
        } else {
          const errorData = await response.json();
          Alert.alert(t('shop.error') || 'Error', errorData.message || t('shop.addCategoryError') || 'Failed to add category');
        }
      } catch (error) {
        Alert.alert(t('shop.error') || 'Error', t('shop.addCategoryError') || 'Failed to add category');
      }
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={{ width: "50%" }}
      className="my-2 px-2"
      onPress={() => router.push(`/product?id=${product.id}`)}
    >
      <View className="bg-white dark:bg-neutral-800 rounded-2xl  overflow-hidden border border-neutral-100 dark:border-neutral-700">
        <View className="relative">
          <Image
            source={product.images && product.images.length > 0 
              ? { uri: config.image_url(product.images[0]) } 
              : images.fallback
            }
            style={{ width: "100%", height: 150 }}
            className="rounded-t-2xl"
            resizeMode='cover'
          />
          <View className="absolute top-2 right-2 bg-primary px-2 py-1 rounded-full">
            <Text className="text-white font-bold text-xs">${product.price}</Text>
          </View>
          {product.stock <= 0 && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center">
              <Text className="text-white font-bold text-sm">Out of Stock</Text>
            </View>
          )}
        </View>

        <View className="p-3">
          <Text className="text-sm font-bold text-neutral-900 dark:text-white leading-tight mb-1" numberOfLines={1}>
            {product.name}
          </Text>
          <Text className="text-xs text-neutral-500 dark:text-neutral-400" numberOfLines={2}>
            {product.description || 'No description'}
          </Text>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-xs text-neutral-400">Stock: {product.stock}</Text>
            <TouchableOpacity 
              onPress={() => router.push(`/product?id=${product.id}`)}
              className="bg-primary/10 px-2 py-1 rounded-full"
            >
              <Text className="text-primary text-xs font-semibold">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950">
      <StatusBar barStyle="light-content" />

      <Animated.FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 0 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingProducts || isRefetchingCategories}
            onRefresh={onRefresh}
            tintColor="#43cd32"
            colors={['#43cd32']}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            {productsLoading ? (
              <ActivityIndicator size="large" color="#22680C" />
            ) : (
              <>
                <ShoppingBag size={64} color="#9CA3AF" />
                <Text className="text-gray-500 dark:text-gray-400 text-center mt-4 text-lg">
                  {t('shop.noProducts') || 'No products yet'}
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-center mt-2 px-8">
                  {t('shop.addFirstProduct') || 'Tap the + button to add your first product'}
                </Text>
              </>
            )}
          </View>
        }
        ListHeaderComponent={
          <>
            {/* Header Container with Image and Overlapping Profile */}
            <Animated.View style={headerAnimatedStyle}>
              {/* Background Image */}
              <View style={{ height: HEADER_IMAGE_HEIGHT, overflow: 'hidden' }}>
                <Animated.View style={[{ width: '100%', height: '100%' }, imageAnimatedStyle]}>
                  <Image
                    source={images.bg}
                    className="w-full h-full opacity-80"
                  />
                </Animated.View>
              </View>

              {/* Profile Section - Overlapping the image */}
              <View 
                className="bg-white dark:bg-neutral-950 rounded-t-3xl px-4 pt-16 pb-4"
                style={{ marginTop: -PROFILE_OVERLAP }}
              >
                {/* Avatar - Positioned to overlap both sections */}
                <View 
                  className="absolute mx-5 left-1/2 items-center"
                  style={{ 
                    top: -(AVATAR_SIZE / 2),
                    transform: [{ translateX: -AVATAR_SIZE / 2 }]
                  }}
                >
                  <View
                    style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                    className="rounded-full border-4 border-white dark:border-neutral-950 bg-primary/20 items-center justify-center"
                  >
                    <Text className="text-4xl font-bold text-primary">
                      {userData?.fullName?.charAt(0)?.toUpperCase() || 'P'}
                    </Text>
                  </View>
                </View>

                {/* Producer Name */}
                <View className="items-center mb-4">
                  <Text className="text-lg font-bold text-neutral-900 dark:text-white mt-2">
                    {userData?.fullName || 'Producer'}
                  </Text>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                    {userData?.role === 'producer' ? 'Agricultural Producer' : userData?.role || 'Producer'}
                  </Text>
                </View>

                {/* Stats */}
                <View className="flex-row justify-around mb-4">
                  <View className="items-center">
                    <Text className="text-lg font-bold text-neutral-900 dark:text-white">
                      {products.length}
                    </Text>
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400">Products</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-lg font-bold text-neutral-900 dark:text-white">
                      {categories.length}
                    </Text>
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400">Categories</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-lg font-bold text-neutral-900 dark:text-white">
                      {products.reduce((sum, p) => sum + p.stock, 0)}
                    </Text>
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400">Stock</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Action Bar */}
            <View className="flex-row items-center justify-between mx-4 mb-2">
            
              
              <View className="flex-row items-center gap-2">
                {/* Add Product Button */}
                <TouchableOpacity
                  onPress={() => router.push('/addProduct')}
                  className="bg-primary px-4 py-2 rounded-full flex-row items-center"
                >
                  <Plus size={20} color="white" />
                  <Text className="text-white font-semibold ml-1">Product</Text>
                </TouchableOpacity>

                {/* Orders Button */}
                <TouchableOpacity 
                  className="p-2 bg-slate-200 rounded-full dark:bg-neutral-700" 
                  onPress={() => router.push('/shopOrdersScreen')}
                >
                  <Package size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
                
            {/* Search & Tabs */}
            <View className="bg-white dark:bg-neutral-950 px-4 pt-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              {/* Search Bar */}
              <View className="flex-row items-center bg-gray-100 dark:bg-neutral-800 rounded-full px-3 my-3">
                <Search size={15} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-2 text-gray-900 dark:text-white py-2"
                  placeholder="Search products..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Category Tabs */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="my-2">
                {tabs.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`px-6 py-2 mx-1 border dark:border-white rounded-3xl mb-2 ${
                      activeTab === tab ? 'border-2 border-primary dark:border-primary bg-primary/10' : 'border-gray-600 dark:border-gray-400'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        activeTab === tab ? 'text-primary dark:text-primary' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-full ml-1"
                >
                  <Plus size={24} color="#6B7280" />
                </TouchableOpacity>
              </ScrollView>
            </View>
          </>
        }
      />

     
    </View>
  );
}