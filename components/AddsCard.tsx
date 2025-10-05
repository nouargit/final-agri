import { View, Text, ImageSourcePropType, Image } from 'react-native'
import React from 'react'

const AddsCard = ( {image}: {image: ImageSourcePropType}) => {
  return (
    <View className="w-full h-[200px] rounded-3xl overflow-hidden m-2">
      <Image source={image} className="w-full h-[200px]"  />
    </View>
  )
}

export default AddsCard