import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';



const shopOrdersManagement = () => {
  const {shop_id}=useLocalSearchParams();
  return (
    <View>
      <Text>shopOrdersManagement {shop_id}</Text>
    </View>
  )
}

export default shopOrdersManagement