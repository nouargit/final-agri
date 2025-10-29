import Bag from '@/components/Bag'
import { config } from '@/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react-native'
import { FlatList, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const cart = () => {

 const getCarts = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await fetch(`${config.baseUrl}/api/carts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetched cart data:', data.data[0].shop.name);
    return data.data || data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

const {data: cart, isLoading, error} = useQuery({
  queryKey: ['carts'],
  queryFn: getCarts,
})
if (isLoading) {
  return <Text>Loading...</Text>
}
if (error) {
  return <Text>Error: {error.message}</Text>
}
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950  ">
      
      <View className="flex-row  items-center bg-gray-100 dark:bg-neutral-800 rounded-2xl px-3 py-2 border border-gray-400 dark:border-gray-700 mt-8 mx-7">
         <Search size={15} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-2 text-gray-900 dark:text-white py-2"
                  placeholder="Search products..."
                  placeholderTextColor="#9CA3AF"
                 
        
                />
      </View>
      <View className="flex-col items-center justify-center">
     <FlatList
      data={cart}
      
      renderItem={({item: bag}) => (
        <Bag bag={bag} shop={bag.shop} />
      )}
      keyExtractor={(item) => item.id.toString()}
     />
      </View>
    

     

    </SafeAreaView>
  )
}

export default cart