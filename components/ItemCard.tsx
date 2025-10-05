import { View, Text, ImageSourcePropType, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

interface Item {
  price: number
  id: number
  image: ImageSourcePropType
  name: string
}

type ItemCardProps = {
  item: Item
}

const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
       style={{ width: "100%" }}
  className="mb-1"
      onPress={() => {
        router.push(`../product`)
      }}
    >
      <View className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg dark:shadow-neutral-900/30 overflow-hidden border border-neutral-100 dark:border-neutral-700">
        {/* Image Container with Gradient Overlay */}
        <View className="relative max-h-[350px]">
          <Image
            
            source={item.image}
  style={{ width: "100%", maxHeight: 350, alignSelf: "center" }} // try 3/4 or 4/5
  className="rounded-t-3xl"
  resizeMode='cover'
          />
          {/* Subtle gradient overlay for better text readability */}
          <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
        </View>

        {/* Content Section */}
       

        {/* Decorative Element */}
       
      </View>
       <View className="p-4">
          <Text className="text-l font-quicksand-semibold text-neutral-900 dark:text-white leading-tight ">
            {item.name}
          </Text>
          <Text className="font-quicksand-small text-neutral-500 dark:text-neutral-400">
            Tap to explore
          </Text>
           <Text className="text-lg font-bold text-neutral-900 dark:text-white leading-tight mb-1">
            DZD {item.price.toFixed(2)}
          </Text>
        </View>
    </TouchableOpacity>
  )
}

export default ItemCard