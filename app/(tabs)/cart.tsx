import Bag from '@/components/Bag'
import { Search } from 'lucide-react-native'
import { View, Text, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const cart = () => {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950  ">
      
      <View className="flex-row  items-center bg-gray-100 dark:bg-neutral-800 rounded-2xl px-3 py-2 border border-gray-200 dark:border-gray-700 mt-8 mx-7">
         <Search size={15} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-2 text-gray-900 dark:text-white py-2"
                  placeholder="Search products..."
                  placeholderTextColor="#9CA3AF"
                 
        
                />
      </View>
    <View className="flex-1  py-4 px-4 h-1/2 bg-gray-100 dark:bg-neutral-900 mx-3 mt-10 rounded-3xl">
<Bag bag={{
  id: 1,
  ShopName: 'Shop 1',
  price: 10,
  ItemsNumber: 2,
  ShopImage: require('../../assets/images/shopAvatar.jpg'),
  date: '2023-01-01',
  total: '20.00',
  status: 'Pending',
}} />
        <Bag bag={{
  id: 2,
  ShopName: 'Shop 2',
  price: 20,
  ItemsNumber: 3,
  ShopImage: require('../../assets/images/shopAvatar.webp'),
  date: '2023-01-01',
  total: '30.00',
  status: 'On the way',
}} />
        
     
    </View>
    </SafeAreaView>
  )
}

export default cart