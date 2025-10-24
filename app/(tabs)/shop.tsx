import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StatusBar, Image, ScrollView, Dimensions } from 'react-native';
import { Search, Plus, X, Grid3x3 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ItemCard from '@/components/ItemCard';
import items from '@/constants/items';
import { images } from '@/constants/imports';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import ProfileItemCard from '@/components/ProfileItemCard';
import cn from 'clsx';

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [tabs, setTabs] = useState(['All', 'Traditional', 'Cake', 'Home']);
  const scrollY = useSharedValue(0);
  const screenHeight = Dimensions.get('window').height;
  const [shopItems] = useState([...items]);
  
  const filteredItems = shopItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });
 
  const PROFILE_HEADER_HEIGHT = 260;

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
const stickyHeader = (scrollY: { value: number; }, screenHeight: number) => {
  if (scrollY.value >= screenHeight) {
    return true;
  }
  return false; 
};


const handleAddCategory = () => {
  if (newCategory.trim() && !tabs.includes(newCategory.trim())) {
    setTabs([...tabs, newCategory.trim()]);
    setNewCategory('');
    setModalVisible(false);
  }
};

  return (
    
    <View className="flex-1 bg-white dark:bg-neutral-950">
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
        // Make the header sticky (keeps Search + Tabs pinned)
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
            <Animated.View
              className="px-4 pt-12 pb-6 bg-white dark:bg-neutral-950  border-gray-200 dark:border-gray-700"
              style={profileAnimatedStyle}
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-2xl font-bold text-neutral-950 dark:text-white">Shop</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
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
                  @sweetshop
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
                Delicious treats delivered to your door 🍰
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
    </View>
  );
}

