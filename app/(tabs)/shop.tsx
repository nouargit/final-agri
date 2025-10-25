import ProfileItemCard from '@/components/ProfileItemCard';
import { images } from '@/constants/imports';
import items from '@/constants/items';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ChevronDown, Plus, Search, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';

import { Alert, Dimensions, Image, Modal, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const config = {
  baseUrl: 'http://10.142.232.194:8000',
  csrfTokenUrl: '/sanctum/csrf-cookie',
  shopsUrl: '/api/shops',
};

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [tabs, setTabs] = useState<string[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [shopSelectionVisible, setShopSelectionVisible] = useState(false);
  const scrollY = useSharedValue(0);
  const screenHeight = Dimensions.get('window').height;
  const [shopItems] = useState([...items]);

  const getShopCategories = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }
    
    if (!selectedShopId) {
      return [];
    }
    
    const url = `${config.baseUrl}/api/categories?shop_id=${selectedShopId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const categories = await response.json();

      if (Array.isArray(categories.data)) {
        const mappedCategories = categories.data.map((category: { name: string; id: string }) => ({
          label: category.name,
          value: category.id,
          id: category.id
        }));

        setTabs(categories.data.map((category: { name: string }) => category.name));
        return mappedCategories;
      }
      return [];
    } else {
      throw new Error('Failed to fetch shop categories');
    }
  };

  const getShopData = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }
      
      const response = await fetch(`${config.baseUrl}${config.shopsUrl}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        throw new Error(`Expected JSON, got ${contentType}. Response: ${responseText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data: shopData, error, isLoading, isError } = useQuery({
    queryKey: ['shop'],
    queryFn: getShopData,
    retry: 1,
    retryDelay: 1000,
  });

  const { data: categories, error: categoriesError, isLoading: categoriesLoading, isError: categoriesIsError, refetch: refetchCategories } = useQuery({
    queryKey: ['categories', selectedShopId],
    queryFn: getShopCategories,
    retry: 1,
    retryDelay: 1000,
    enabled: !!selectedShopId,
  });

  useEffect(() => {
    if (selectedShopId) {
      refetchCategories();
    } else {
      setTabs([]);
    }
  }, [selectedShopId, refetchCategories]);

  const filteredItems = shopItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const profileAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 120], [1, 0], Extrapolate.CLAMP),
      transform: [
        {
          translateY: interpolate(scrollY.value, [0, 120], [0, 1], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const handleAddCategory = async () => {
    if (newCategory.trim() && !tabs.includes(newCategory.trim())) {
      if (!selectedShopId) {
        Alert.alert('Error', 'Please select a shop first');
        return;
      }

      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No authentication token found. Please login first.');
        }

        const response = await fetch(`${config.baseUrl}/api/categories`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newCategory.trim(),
            shop_id: selectedShopId,
            slug: newCategory.trim().toLowerCase().replace(/\s+/g, '-'),
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setTabs([...tabs, newCategory.trim()]);
          setNewCategory('');
          setModalVisible(false);
          Alert.alert('Success', 'Category added successfully!');
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || 'Failed to add category');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to add category. Please try again.');
      }
    }
  };

  return (
    
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <Animated.FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-1 px-2 pb-4">
            <ProfileItemCard item={item} />
          </View>
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        stickyHeaderIndices={[-1]}
        ListHeaderComponentStyle={{ zIndex: 10 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              No items found
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            {/* Header & Profile */}
           <View className="w-full h-64">
            <Image
              source={images.shopBg}
              className="w-full h-64 object-cover"
              style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}
            />
            <Animated.View
              className="px-4 pt-12 pb-6 bg-white dark:bg-neutral-950  border-gray-200 dark:border-gray-700 rounded-t-3xl"
              style={profileAnimatedStyle}
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-2xl font-bold text-neutral-950 dark:text-white">Shop</Text>
                
                {/* Shop Selection Dropdown */}
                <TouchableOpacity
                  onPress={() => setShopSelectionVisible(true)}
                  className="bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded-full flex-row items-center mr-2"
                >
                  <Text className="text-sm text-gray-700 dark:text-gray-300 mr-1">
                    {selectedShopId 
                      ? (Array.isArray(shopData) 
                          ? shopData.find(shop => shop.id === selectedShopId)?.name || 'Select Shop'
                          : shopData?.name || 'Select Shop')
                      : 'Select Shop'
                    }
                  </Text>
                  <ChevronDown size={16} color="#6B7280" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="bg-gray-100 dark:bg-neutral-700 p-2 rounded-full"
                >
                  <Plus size={24} color="#6B7280" />
                </TouchableOpacity>
                 <TouchableOpacity
                  onPress={() => router.push('/addProduct')}
                  className="bg-gray-100 dark:bg-neutral-700 p-2 rounded-full"
                >
                  <Plus size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
             
              <View className="items-center">
                
                <Image
                  source={images.shopAvatar}
                  className="w-24 h-24 rounded-full border-2 border-neutral-200 dark:border-neutral-700"
                />
                <Text className="text-lg font-bold text-neutral-900 dark:text-white mt-2">
                  {Array.isArray(shopData)
    ? shopData[0]?.name || 'No Shop Name'
    : shopData?.name || 'No Shop Name'}
                </Text>
              </View>

              <View className="flex-row justify-around mt-4">
                <View className="items-center">
                  <Text className="text-lg font-bold text-neutral-900 dark:text-white">128</Text>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400">Following</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-neutral-900 dark:text-white">10.5k</Text>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400">Followers</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-neutral-900 dark:text-white">89</Text>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400">Likes</Text>
                </View>
              </View>

              <Text className="text-center text-neutral-600 dark:text-neutral-400 mt-3 px-8">
                {Array.isArray(shopData)
    ? shopData[0]?.description || 'No Shop Description'
    : shopData?.description || 'No Shop Description'}
              </Text>
            </Animated.View>

            {/* Search & Tabs */}
            <View className="bg-white dark:bg-neutral-950 px-4 pt-2 pb-2 border-b border-gray-200 dark:border-gray-700 mb-5">
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

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {tabs.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`px-6 py-2 mx-1 ${
                      activeTab === tab ? 'border-b-2 border-gray-900 dark:border-white' : ''
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        activeTab === tab
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            </View>
          </>
        }
       // keep search + tabs sticky
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 pb-8">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">Add Category</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white mb-4"
              placeholder="Category name"
              placeholderTextColor="#9CA3AF"
              value={newCategory}
              onChangeText={setNewCategory}
            />

            <TouchableOpacity
              onPress={handleAddCategory}
              className="bg-gray-900 dark:bg-white rounded-xl py-3 items-center"
            >
              <Text className="text-white dark:text-gray-900 font-semibold text-base">
                Add Category
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </Modal>

      {/* Shop Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={shopSelectionVisible}
        onRequestClose={() => setShopSelectionVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 pb-8">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">Select Shop</Text>
              <TouchableOpacity onPress={() => setShopSelectionVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-80">
              {Array.isArray(shopData) && shopData.map((shop) => (
                <TouchableOpacity
                  key={shop.id}
                  onPress={() => {
                    setSelectedShopId(shop.id);
                    setShopSelectionVisible(false);
                  }}
                  className={`p-4 rounded-xl mb-2 ${
                    selectedShopId === shop.id 
                      ? 'bg-gray-900 dark:bg-white' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Text className={`font-semibold ${
                    selectedShopId === shop.id 
                      ? 'text-white dark:text-gray-900' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {shop.name}
                  </Text>
                  {shop.description && (
                    <Text className={`text-sm mt-1 ${
                      selectedShopId === shop.id 
                        ? 'text-gray-200 dark:text-gray-600' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {shop.description}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
    
  );
}

