import { config } from '@/config';
import { images } from '@/constants/imports';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Filter, Heart, Leaf, Search, ShoppingBag, X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Product {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  quantityKg: number;
  minimumOrderKg: number;
  images?: string[];
  subcategory: string;
  producerId: string;
  grade: string;
  harvestDate: string;
}

interface Category {
  key: string;
  name: string;
  subcategories: string[];
}

const ExploreScreen = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Fetch categories from API
  const getCategories = async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${config.baseUrl}${config.categoriesUrl}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  // Fetch all products from API
  const getAllProducts = async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${config.baseUrl}${config.productsUrl}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
    isRefetching: isRefetchingCategories,
  } = useQuery({
    queryKey: ['exploreCategories'],
    queryFn: getCategories,
  });

  const {
    data: products = [],
    isLoading: productsLoading,
    refetch: refetchProducts,
    isRefetching: isRefetchingProducts,
  } = useQuery({
    queryKey: ['exploreProducts'],
    queryFn: getAllProducts,
  });

  const isRefreshing = isRefetchingCategories || isRefetchingProducts;

  const onRefresh = () => {
    refetchCategories();
    refetchProducts();
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const selectedCategory = categories.find((cat) => cat.key === activeCategory);
    const matchesCategory =
      activeCategory === 'All' ||
      (selectedCategory && selectedCategory.subcategories.includes(product.subcategory));
    return matchesSearch && matchesCategory && product.quantityKg > 0;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="w-[48%] mb-4"
      onPress={() => router.push(`/product?id=${item.id}`)}
      activeOpacity={0.7}
    >
      <View className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-neutral-700">
        {/* Product Image */}
        <View className="h-40 bg-green-50 dark:bg-neutral-700 relative">
          {item.images && item.images.length > 0 ? (
            <Image
              source={{ uri: config.image_url(item.images[0]) }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={images.fallback}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          )}

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            className="absolute top-2 right-2 bg-white dark:bg-neutral-800 rounded-full p-2 shadow-sm"
          >
            <Heart
              size={16}
              color={favorites[item.id] ? '#EF4444' : '#9CA3AF'}
              fill={favorites[item.id] ? '#EF4444' : 'none'}
            />
          </TouchableOpacity>

          {/* Grade Badge */}
          {item.grade && (
            <View className="absolute top-2 left-2 bg-primary px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">{item.grade}</Text>
            </View>
          )}

          {/* Stock Badge */}
          <View className="absolute bottom-2 left-2 bg-white/90 dark:bg-neutral-800/90 px-2 py-1 rounded-full">
            <Text className="text-xs text-gray-700 dark:text-gray-300">{item.quantityKg}kg</Text>
          </View>
        </View>

        {/* Product Info */}
        <View className="p-3">
          <Text
            className="text-gray-900 dark:text-white font-semibold text-sm mb-1"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            className="text-gray-500 dark:text-neutral-400 text-xs mb-2"
            numberOfLines={2}
          >
            {item.description || 'Fresh from local farms'}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-primary font-bold text-base">
              {item.pricePerKg} DZD/kg
            </Text>
            <View className="bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
              <Text className="text-green-700 dark:text-green-300 text-xs font-medium">
                {item.subcategory}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-neutral-950">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View className="bg-white dark:bg-neutral-900 px-4 pt-12 pb-4 border-b border-gray-100 dark:border-neutral-800">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-gray-500 dark:text-neutral-400 text-sm">
              {t('explore.discover') || 'Discover'}
            </Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('explore.title') || 'Explore Products'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/qrCode')}
            className="w-12 h-12 bg-primary rounded-full items-center justify-center"
          >
            <Leaf size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 dark:bg-neutral-800 rounded-xl px-4 py-3">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder={t('explore.searchPlaceholder') || 'Search products...'}
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <View className="bg-white dark:bg-neutral-900 px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoriesLoading ? (
            <ActivityIndicator size="small" color="#22C55E" />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setActiveCategory('All')}
                className={`mr-3 px-5 py-2.5 rounded-full border ${
                  activeCategory === 'All'
                    ? 'bg-primary border-primary'
                    : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700'
                }`}
              >
                <Text
                  className={`font-medium ${
                    activeCategory === 'All'
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t('explore.all') || 'All'}
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  onPress={() => setActiveCategory(category.key)}
                  className={`mr-3 px-5 py-2.5 rounded-full border ${
                    activeCategory === category.key
                      ? 'bg-primary border-primary'
                      : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      activeCategory === category.key
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View className="px-4 py-3 flex-row items-center justify-between">
        <Text className="text-gray-600 dark:text-neutral-400 text-sm">
          {filteredProducts.length} {t('explore.productsFound') || 'products found'}
        </Text>
        <TouchableOpacity className="flex-row items-center">
          <Filter size={16} color="#6B7280" />
          <Text className="text-gray-600 dark:text-neutral-400 text-sm ml-1">
            {t('explore.filter') || 'Filter'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      {productsLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22C55E" />
          <Text className="text-gray-500 dark:text-neutral-400 mt-4">
            {t('common.loading') || 'Loading products...'}
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <ShoppingBag size={64} color="#9CA3AF" />
          <Text className="text-gray-700 dark:text-gray-300 text-lg font-semibold mt-4 text-center">
            {t('explore.noProducts') || 'No products found'}
          </Text>
          <Text className="text-gray-500 dark:text-neutral-400 text-sm mt-2 text-center">
            {t('explore.tryAdjusting') || 'Try adjusting your search or filters'}
          </Text>
          {searchQuery && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              className="mt-4 bg-primary px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">
                {t('explore.clearSearch') || 'Clear Search'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#22C55E"
              colors={['#22C55E']}
            />
          }
          renderItem={renderProductCard}
        />
      )}
    </View>
  );
};

export default ExploreScreen;
