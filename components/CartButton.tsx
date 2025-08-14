import { View, Text, TouchableOpacity, Image } from 'react-native'
import { icons } from '@/constants/imports';


import React from 'react'

const CartButton = () => {
   const totalItems = 10;
  return (
    <TouchableOpacity className='cart-btn' style={{backgroundColor:'#020f10'}} onPress={()=>{}}>

<Image source={icons.cart} className="size-5" resizeMode="contain" />
{
    totalItems > 0 && (
        <View className='cart-badge'>
            <Text className='text-white text-xs'>{totalItems}</Text>
        </View>
    )

}
      
    </TouchableOpacity>
  )
}

export default CartButton