import CategoryCard from '@/components/CategorysCard';
import ItemCard from '@/components/ItemCard';
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { config } from '@/config';
import categoriesEN from '@/constants/categories';
import { images } from '@/constants/imports';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MasonryList from "@react-native-seoul/masonry-list";
import { useQuery } from '@tanstack/react-query';
import { Search,Handbag } from 'lucide-react-native';
import { Dimensions, ScrollView, StatusBar, View,Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Vibration } from 'react-native';
import { Button } from '@/components/ui/button';
import PromoCard from '@/components/PromoCard';



const Training = () => {
  const { t } = useTranslation();

// Test function to check if images are accessible

const productsData = [
  {
    id: 1,
    name: 'orange',
    price: 20,
    category: 'cakes',
   
    image: images.orange,
  },
  {
    id: 2,
    name: 'potato',
    price: 15,
    category: 'cakes',
    
    image: images.potato,
  },
  {
    id: 3,
    name: 'salad',
    price: 25,
    category: 'cakes',
    
    image: images.salad,
  },
  {
    id: 4,
    name: 'kameh',
    price: 30,
    category: 'cakes',
    
    image: images.kameh,
  },
];



 const handleVibrate = () => {
    Vibration.vibrate(30); 
  };



  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View className="flex-row justify-between px-6 pt-5 pb-4 rounded-b-3xl  dark:bg-neutral-900 ">
        <TouchableOpacity className="justify-end w-10 h-10 bg-slate-200 dark:bg-neutral-700 rounded-full p-2 items-center" onPress={handleVibrate}>
          <Handbag size={24} color="#52b649" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-4xl font-gilroy-bold text-primary dark:text-primary">agri</Text>
        <View className="justify-end w-10 h-10 bg-slate-200 dark:bg-neutral-700 rounded-full p-2 items-center">
          <TouchableOpacity onPress={() => router.push('/orders')} >
          <Search size={24} color="#52b649" strokeWidth={2} />
          </TouchableOpacity>
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
          
          <View className=" px-1 py-3 mb-3">
            
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
       
      />
      
    </View>
  )
}

export default Training


const { width } = Dimensions.get('window');
const cardWidth = width - 42; // match list horizontal padding
