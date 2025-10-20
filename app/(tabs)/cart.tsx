import Bag from '@/components/Bag'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const cart = () => {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950  ">
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