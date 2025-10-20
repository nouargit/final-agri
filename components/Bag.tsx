import { images } from '@/constants/imports';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from "react-native";
const filters = [
  {
    label: "All", 
    value: '',
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Preparing",
    value: "preparing",
  },
  {
    label: "On the way",
    value: "on the way",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
]
const orders = [
  {
    id: "ORD-1001",
    bakery: "Sweet Delights Bakery",
    date: "2025-10-01",
    status: "Pending",
    total: "$25.50",
    thumbnail:
      images.bluePudding,
  },
  {
    id: "ORD-1002",
    bakery: "Cake Heaven",
    date: "2025-09-28",
    status: "Delivered",
    total: "$42.00",
    thumbnail:
      images.baklawa,
  },
  {
    id: "ORD-1003",
    bakery: "Golden Bakes",
    date: "2025-09-25",
    status: "On the way",
    total: "$18.75",
    thumbnail:
      images.panCake,
  },
  {
    id: "ORD-1004",
    bakery: "Delightful Bakes",
    date: "2025-09-22",
    status: "Cancelled",
    total: "$30.00",
    thumbnail:
      images.beghrir,
  },
  
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Preparing: "bg-orange-100 text-orange-800",
  "On the way": "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};
interface BagProps {
  bag: {
    id: number
    ShopName: string
    price: number
    ItemsNumber: number
    ShopImage: any
    date: string
    total: string
    status: string
  }
}

const Bag = ({ bag }: BagProps) => {
  const [bg, text] = statusColors[bag.status].split(" ");

  return (
    <View className="mb-3 ">
  {/* Shadow container - outside the touchable */}
 
  
  <TouchableOpacity className="bg-white dark:bg-neutral-800 rounded-2xl p-4 flex-row items-center " onPress={() => {
    router.navigate(`/orders`)
  }}>
    {/* Thumbnail */}
    <Image
      source={bag.ShopImage}
      className="w-16 h-16 rounded-full mr-4"
    />

    {/* Order Info */}
    <View className="flex-1">
     
      <Text className="font-bold text-gray-800 dark:text-neutral-100">{bag.ShopName}</Text>

      <View className="flex-row items-center mt-1">
        <Text className="text-gray-500 dark:text-neutral-500 text-sm">{bag.date}</Text>

        <View className={`ml-2 px-2 py-0.5 rounded-full ${bg}`}>
          <Text className={`text-xs font-medium ${text}`}>
            {bag.status}
          </Text>
        </View>
      </View>
    </View>

    {/* Price */}
    <Text className="text-gray-800 dark:text-white font-bold">{bag.total}</Text>
  </TouchableOpacity>
</View>)}
export default Bag;