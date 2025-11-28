import { config } from '@/config';
import { images } from '@/constants/imports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Grid, Heart, Home, Leaf, Menu, Search, ShoppingBag } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Product {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  quantityKg: number;
  minimumOrderKg: number;
  images?: string[];
  subcategory: string;
  producer_id?: string;
  producerId: string;
  grade: string;
  harvestDate: string;
  scheduleDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

export default function FarmMarketplaceHome() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

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

  // Fetch all products (from all producers)
  const getAllProducts = async (): Promise<Product[]> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Using the legacy products endpoint for consumer view
      const response = await fetch(`${config.baseUrl}${config.productsUrl}`, {
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
      
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: getAllProducts,
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.subcategory === activeCategory;
    return matchesSearch && matchesCategory && product.quantityKg > 0;
  });

  const promosBanners = [
    { id: 1, title: 'Fresh Harvest', subtitle: '30% OFF', description: 'Organic Vegetables', emoji: '🥬', color: 'bg-green-400' },
    { id: 2, title: 'Farm Fresh', subtitle: 'Buy 2 Get 1', description: 'Premium Fruits', emoji: '🍎', color: 'bg-red-400' },
    { id: 3, title: 'Free Delivery', subtitle: 'Orders $50+', description: 'Limited Time', emoji: '🚚', color: 'bg-blue-400' },
    { id: 4, title: 'Dairy Delight', subtitle: '20% OFF', description: 'Fresh From Farm', emoji: '🥛', color: 'bg-yellow-400' },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'All';
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-gray-600 text-sm">Fresh From</Text>
            <Text className="text-xl font-bold text-gray-900">Local Farms</Text>
          </View>
          <View className="w-12 h-12 bg-green-600 rounded-full items-center justify-center">
            <Leaf size={24} color="white" />
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Menu Button */}
        <TouchableOpacity className="absolute right-4 top-14 bg-gray-900 p-3 rounded-xl" >
          <Menu size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Promo Banners - Horizontal Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4 mt-4"
          snapToInterval={300}
          decelerationRate="fast"
        >
          {promosBanners.map((promo) => (
            <View key={promo.id} className={`${promo.color} rounded-3xl p-6 mr-4 w-72`}>
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold mb-1">{promo.title}</Text>
                  <Text className="text-white text-3xl font-bold mb-2">{promo.subtitle}</Text>
                  <Text className="text-white text-sm opacity-90">{promo.description}</Text>
                </View>
                <View className="ml-4">
                  <Text className="text-6xl">{promo.emoji}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4 mt-6 mb-4"
        >
          {categoriesLoading ? (
            <ActivityIndicator size="small" color="#16A34A" />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setActiveCategory('All')}
                className={`mr-3 px-5 py-2.5 rounded-full ${
                  activeCategory === 'All'
                    ? 'bg-white border-2 border-gray-900'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <Text
                  className={`${
                    activeCategory === 'All'
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-500'
                  }`}
                >
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setActiveCategory(category.id)}
                  className={`mr-3 px-5 py-2.5 rounded-full ${
                    activeCategory === category.id
                      ? 'bg-white border-2 border-gray-900'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <Text
                    className={`${
                      activeCategory === category.id
                        ? 'text-gray-900 font-semibold'
                        : 'text-gray-500'
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>

        {/* Products Grid */}
        <View className="px-4 flex-row flex-wrap justify-between pb-24">
          {productsLoading ? (
            <View className="w-full items-center justify-center py-20">
              <ActivityIndicator size="large" color="#16A34A" />
              <Text className="text-gray-500 mt-4">Loading products...</Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="w-full items-center justify-center py-20">
              <ShoppingBag size={64} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-lg">No products found</Text>
              <Text className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</Text>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                className="w-[48%] mb-4"
                onPress={() => router.push(`/product?id=${product.id}`)}
                activeOpacity={0.7}
              >
                <View className="bg-white rounded-2xl p-4 shadow-sm">
                  {/* Product Image */}
                  <View className="bg-green-50 rounded-2xl h-36 items-center justify-center mb-3 relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        source={{ uri: config.image_url(product.images[0]) }}
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
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm"
                    >
                      <Heart
                        size={18}
                        color={favorites[product.id] ? '#EF4444' : '#9CA3AF'}
                        fill={favorites[product.id] ? '#EF4444' : 'none'}
                      />
                    </TouchableOpacity>

                    {/* Stock Badge */}
                    <View className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-full">
                      <Text className="text-xs text-gray-700">{product.quantityKg}kg</Text>
                    </View>
                  </View>

                  {/* Product Info */}
                  <Text className="text-gray-900 font-semibold mb-1" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text className="text-gray-500 text-xs mb-2" numberOfLines={2}>
                    {product.description || 'Fresh from local farms'}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-green-600 font-bold text-lg">
                      ${product.pricePerKg}/kg
                    </Text>
                    <View className="bg-green-50 px-2 py-1 rounded-full">
                      <Text className="text-green-700 text-xs font-semibold">
                        {product.subcategory}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <View className="flex-row justify-around items-center">
          <TouchableOpacity className="items-center">
            <View className="bg-green-600 p-3 rounded-xl">
              <Home size={24} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Grid size={24} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Heart size={24} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <ShoppingBag size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}