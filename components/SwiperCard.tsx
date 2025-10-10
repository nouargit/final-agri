import React from 'react'
import { View, Image, Text, ImageSourcePropType } from 'react-native'

type SwiperCardProps = {
  dessert: {
    image: string;
  };
  index: number;
  scrollY: number;
}

export default function SwiperCard({ dessert, index, scrollY }: SwiperCardProps) {
  return (
    <View className="flex-1 bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden">
      {/* Product Image */}
      <View className="h-64 w-full">
        <Image 
          source={src} 
          className="w-full h-full" 
          resizeMode="cover" 
        />
      </View>
      
      {/* Product Info */}
      <View className="flex-1 p-6 justify-between">
        <View className="gap-3">
          <Text className="text-xl font-bold text-neutral-900 dark:text-white" numberOfLines={2}>
            {title}
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-300" numberOfLines={3}>
            {desc}
          </Text>
        </View>
        
        {/* Price and Rating */}
        <View className="flex-row items-center justify-between mt-4">
          <Text className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${price}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-yellow-500">★</Text>
            <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              4.8
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
