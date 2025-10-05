import { View, Text, StatusBar, ScrollView } from 'react-native'
import ItemCard from '@/components/ItemCard'
import React from 'react'
import MasonryList from "@react-native-seoul/masonry-list";
import { images } from '@/constants/imports'
import AddsCard from '@/components/AddsCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import items from '@/constants/items'
import categoriesEN from '@/constants/categories'
import CategoryCard from '@/components/CategorysCard'
import { Item } from '@/constants/items'
import { FlatList, Dimensions } from 'react-native'
const Training = () => {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-3xl font-bold text-neutral-900 dark:text-white">
          Training
        </Text>
        <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-1">
          Discover our products
        </Text>
      </View>

      <MasonryList
        data={items as Item[]}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8}}
        style={{ gap: 10 }}
        renderItem={({ item }) => <ItemCard item={item as Item} />}
        ListHeaderComponent={
          <View className="px-1 py-3 mb-5">
            {/* Paginated horizontal promo cards */}
            <FlatList
              data={promoImages}
              horizontal
              pagingEnabled
              snapToInterval={cardWidth}
              snapToAlignment="end"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => `promo-${idx}`}
              renderItem={({ item }) => (
                <View style={{ width: cardWidth, marginRight: 9 }}>
                  <AddsCard image={item} />
                </View>
              )}
            />
            {/* Categories Section */}
            <View className="mt-6 mb-1">
              <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                Categories
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                className="flex-row w-full"
              >
                {categoriesEN.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </ScrollView>
            </View>

            <Text className="text-lg font-bold text-neutral-900 dark:text-white mt-6 mb-1">
              Popular products
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

export default Training

const promoImages = [images.cake, images.cake2, images.panCake, images.patesry];
const { width } = Dimensions.get('window');
const cardWidth = width - 42; // match list horizontal padding
