import CategoryCard from '@/components/CategorysCard';
import ItemCard from '@/components/ItemCard';
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { config } from '@/config';
import categoriesEN from '@/constants/categories';
import { images } from '@/constants/imports';
import { Item } from '@/constants/items';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MasonryList from "@react-native-seoul/masonry-list";
import { useQuery } from '@tanstack/react-query';
import { Search,Handbag } from 'lucide-react-native';
import { Dimensions, ScrollView, StatusBar, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Vibration } from 'react-native';



const Training = () => {
  const { t } = useTranslation();

// Test function to check if images are accessible


// Test connectivity when component mounts

// Test the first few image URLs
 const handleVibrate = () => {
    Vibration.vibrate(30); 
  };

const getProducts = async () => {
  try {
     const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

    const response = await fetch(`${config.baseUrl}/api/products`,{
      method:'GET',
      headers:{
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
  const data = await response.json();
 
  
const products = Array.isArray(data) ? data : data.data || [];
  
  // Test the first few image URLs after cleaning
 
  
  //ensure data is an array
  return products.map((p: { images: any[]; image_url: any; }) => {
    
    return {
      ...p,
      // Transform API images to match ItemCard expectations: Array<{ url: string }>
      // API returns { url: "..." } but with extra spaces and backticks that need cleaning
      images: p.images?.map((img: any) => {
        // Clean the URL by removing spaces and backticks
        let cleanUrl = img.uri || img.url || img;
       
        
        if (typeof cleanUrl === 'string') {
          // Handle the specific backtick issue - remove wrapping backticks first
          cleanUrl = cleanUrl.replace(/^`+/, '').replace(/`+$/, '');
          
        
       
          
          // Return the cleaned URL without any backticks
          const result = { url: cleanUrl };
      
          return result;
        } else {
          // If it's not a string, return as-is
          const result = { url: cleanUrl };
         
          return result;
        }
      }) || (p.image_url ? [{ url: p.image_url }] : []),
    };
  });


  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array on error
  }
  
}

const {data: productsData, isLoading, error, refetch} = useQuery({
  queryKey: ['products'],
  queryFn: getProducts,
});
  const [refreshing, setRefreshing] = useState(false);
const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  if (isLoading) {
    return (
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-950 justify-center items-center">
        <Text className="text-neutral-500">{t('training.loadingProducts')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-950 justify-center items-center">
        <Text className="text-red-500">{t('training.errorLoadingProducts')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View className="flex-row justify-between px-6 pt-5 pb-4 rounded-b-3xl  dark:bg-neutral-900 ">
        <TouchableOpacity className="justify-end w-10 h-10 bg-slate-200 dark:bg-neutral-700 rounded-full p-2 items-center" onPress={handleVibrate}>
          <Handbag size={24} color="#ff6370" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-4xl font-gilroy-bold text-primary dark:text-primary">sweetr.</Text>
        <View className="justify-end w-10 h-10 bg-slate-200 dark:bg-neutral-700 rounded-full p-2 items-center">
          <Search size={24} color="#ff6370" strokeWidth={2} />
        </View>
      </View>
      
     
       <FlatList
        data={productsData || []}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 7,
          paddingBottom: 100,
          paddingTop: 8,
        }}
        renderItem={({ item }) => (
          <View className="flex-1 px-2 pb-3 mt-1">
            <ItemCard item={item} />
          </View>)}
        ListHeaderComponent={
          <View className="px-1 py-3 mb-3">
            <View className="mt-1 mb-2">
              <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                {t('training.categories')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row w-full">
                {(categoriesEN || []).map((category) => (
                  <CategoryCard key={category.id} category={category} vibration={handleVibrate} />
                ))}
              </ScrollView>
            </View>
            <Text className="text-lg font-bold text-neutral-900 dark:text-white mt-6 mb-1">
              {t('training.popularProducts')}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff6370"
            colors={["#ff6370"]}
          />
        }
      />
      
    </View>
  )
}

export default Training

const promoImages = [images.cake, images.cake2, images.panCake, images.patesry];
const { width } = Dimensions.get('window');
const cardWidth = width - 42; // match list horizontal padding
