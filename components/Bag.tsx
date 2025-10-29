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
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Preparing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "On the way": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
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
  shop: {
    name: string
    image: any
  }
}

const Bag = ({ bag, shop }: BagProps) => {
  //const [bg, text] = statusColors[bag.status].split(" ");

  return (
    <View className=" mt-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-md shadow-neutral-300 dark:shadow-neutral-900 w-full">
  {/* Shadow container - outside the touchable */}
 
  
  <TouchableOpacity className="w-full bg-white  dark:bg-neutral-800 rounded-2xl p-4  " onPress={() => {
    router.navigate(`/orders`)
  }}>
 
    <View className="flex-row items-center">  
       {/* Thumbnail */}
    <Image
      source={shop.image}
      className="w-16 h-16 rounded-full mr-4"
    />

    {/* Order Info */}
    <View className="flex-1">
     
      <Text className="font-bold text-gray-800 dark:text-neutral-100">{shop.name}</Text>

      <View className="flex-row items-center mt-1">
        <Text className="text-gray-500 dark:text-neutral-500 text-sm">{bag.date}</Text>

       
        
      </View>
       <View className={`ml-2 px-2 py-0.5 rounded-full }`}>
          <Text className={`text-xs font-medium `}>
            {bag.status}
          </Text>
        </View>
      <View className="absolute right-0 top-0 ml-auto p-2   rounded-xl bg-primary">
          <Text className="font-bold m-auto text-neutral-100 ">{bag.total}</Text>
        </View>
    </View>
    </View>

    <View className="flex-row items-center h-16 w-full mt-3 rounded-2xl bg-neutral-100 dark:bg-neutral-700">
     {orders.map((order) => (
        <Image
          key={order.id}
          source={order.thumbnail}
          className="w-12 h-12 rounded-xl ml-3"
        />
     ))}
    </View>
  </TouchableOpacity>
</View>
)}
export default Bag;