import { View, Text, FlatList } from 'react-native'
import SwiperCard from '@/components/SwiperCard'
import React from 'react'
import {images} from '@/constants/imports'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AirbnbRating } from "react-native-ratings";
import Swiper from "react-native-deck-swiper";
  
const cart = () => {
  const data = [
    {
      id: 1,
      title: "Blue pudding thing",
      desc: "the best blue pudding ever",
      price: 100,
      src: images.bluePudding,
    },
    {
      id: 2,
      title: "Patesry",
      desc: "the best patesry ever",
      price: 200,
      src: images.patesry,
    },
    {
      id: 3,
      title: "Pan Cake",
      desc: "the best pan cake ever",
      price: 300,
      src: images.panCake,
    },
  ];
  return ( 
    <SafeAreaView className='flex-1'>
    <View className='flex-1 items-center justify-center mt-24 p-4 '>
      
      <FlatList
        horizontal
        snapToAlignment="center"
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        data={data}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 20,
        }}
        ListEmptyComponent={
          <Text className="text-xl font-bold text-center">
            Cart is empty
          </Text>
        }
        renderItem={({ item }) => (
          <SwiperCard
            src={item.src}
            title={item.title}
            desc={item.desc}
            price={item.price}
          />
        )}
      />
 
    
  
     
    </View>
    </SafeAreaView>
  )
}

export default cart;
