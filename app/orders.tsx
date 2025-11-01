import { useCallback, useRef, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SearchBar from '@/components/SearchBar';
import { config } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import OrderCard from '../components/OrderCard';

import AsyncStorage from '@react-native-async-storage/async-storage';

const orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const cart_id = useLocalSearchParams().id as string;

  
  

   const getCart = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No auth token found');
    }
    const response = await fetch(`${config.baseUrl}/api/carts/${cart_id}`
      ,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Raw API response:', data.items[0].product.shop.name);
    return data.data || data;
   }

 
   const getCartSummary = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No auth token found');
    }
    const response = await fetch(`${config.baseUrl}/api/carts/${cart_id}/summary`
      ,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    //console.log('Raw API response:', data.data);
    return data.data || data;
   }


  const {data:cart, isLoading, error, refetch} = useQuery({
    queryKey: ['cart', cart_id],
    queryFn: getCart,
  });
  const {data:cartSummary, isLoading:isLoadingSummary, error:errorSummary, refetch:refetchSummary} = useQuery({
    queryKey: ['cartSummary', cart_id],
    queryFn: getCartSummary,
  });
  
  if (isLoadingSummary) {
    return <Text>Loading cart summary...</Text>;
  }
  if (errorSummary) {
    return <Text>Error: {errorSummary.message}</Text>;
  }
  if (!cartSummary) {
    return <Text>No cart summary available</Text>;
  }
 

  //console.log('Cart data:', cart); // This will show you the data structure

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {isLoading && <Text>Loading cart...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {cart && (
        <FlatList
          data={cart.items}
          scrollEnabled={true}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard key={item.id}  order={item} cart={cart} image={item.product.images[0]}  refetch={refetch}/>
          )}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
     

       
    </View>
      <View className='flex-row justify-between items-center px-4 py-2 bg-white dark:bg-neutral-800 rounded-b-2xl shadow-sm border-t border-gray-100 dark:border-neutral-700 w-full'>
          <Text className='text-lg font-bold text-gray-900 dark:text-white'>Total: {cartSummary?.summary?.subtotal}</Text>
          <TouchableOpacity onPress={()=>router.push(`/checkout?total=${cartSummary?.summary?.subtotal}&shopLocation=${cart?.shop?.location}`)} className='bg-primary text-white px-4 py-2 rounded-full'>
            <Text className='text-lg font-bold text-white'>Checkout</Text>
          </TouchableOpacity>
        </View>
    </GestureHandlerRootView>
  )
}

export default orders