import { Search, X } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, TextInput, useColorScheme } from "react-native";
import { images } from '@/constants/imports';
import { Dropdown } from "react-native-element-dropdown";
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

const OrderCard = ({ order }: { order: typeof orders[0] }) => {
  const [bg, text] = statusColors[order.status].split(" ");

  return (
    <View className="mb-3 ">
  {/* Shadow container - outside the touchable */}
 
  
  <TouchableOpacity className="bg-white dark:bg-neutral-800 rounded-2xl p-4 flex-row items-center ">
    {/* Thumbnail */}
    <Image
      source={order.thumbnail}
      className="w-16 h-16 rounded-xl mr-4"
    />

    {/* Order Info */}
    <View className="flex-1">
      <Text className="text-gray-800 dark:text-white font-bold">{order.id}</Text>
      <Text className="text-gray-600 dark:text-neutral-400">{order.bakery}</Text>

      <View className="flex-row items-center mt-1">
        <Text className="text-gray-500 dark:text-neutral-500 text-sm">{order.date}</Text>

        <View className={`ml-2 px-2 py-0.5 rounded-full ${bg}`}>
          <Text className={`text-xs font-medium ${text}`}>
            {order.status}
          </Text>
        </View>
      </View>
    </View>

    {/* Price */}
    <Text className="text-gray-800 dark:text-white font-bold">{order.total}</Text>
  </TouchableOpacity>
</View>)}

const OrdersList = () => {
    const [searchQuery, setSearchQuery] = useState('');
     const [value, setValue] = useState('');
       const colorScheme = useColorScheme();
       const filteredOrders = orders.filter(order => order.status.toLowerCase().includes(value.toLowerCase()));
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black mt-4 p-4">

         {/*search bar */}
        <View className="flex-row items-center bg-gray-100 dark:bg-neutral-800 rounded-full px-1 py-1 my-6 mx-3">
                <Search size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-2 text-gray-900 dark:text-white py-2"
                  placeholder="Search products..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
                {/*filters box */}
              <View className="flex-1 py-4 px-4 h-6 bg-gray-100 dark:bg-neutral-900 mx-2 rounded-3xl">
                <Dropdown
                  data={filters}
                  labelField="label"
                  valueField="value"
                  placeholder="Filter by status"
                  placeholderStyle={{ color: colorScheme === "dark" ? "#b5b6b6" : "#F3F4F6" }}
                  selectedTextStyle={{ color: colorScheme === "dark" ? "#b5b6b6" : "#1F2937" }}
                  containerStyle={{
                  backgroundColor: colorScheme === "dark" ? "#1e1f1e" : "#F3F4F6",
                   borderRadius: 16,
                   borderWidth: 0,
                 }}
                  itemTextStyle={{ color: colorScheme === "dark" ? "#b5b6b6" : "#202021"}}
                  value={value}
                  onChange={(item) => setValue(item.value)}
                  activeColor={colorScheme === "dark" ? "#585858" : "#E5E7EB"}
                  search
                  searchPlaceholder="Search filters..."
                 inputSearchStyle={{
                        borderRadius: 12,   
                        backgroundColor: colorScheme === "dark" ? "#1e1f1e" : "#F3F4F6",
                        paddingHorizontal: 12,
                      
                        color: colorScheme === "dark" ? "#b5b6b6" : "#202021",
                      }}
                />
                  {/*the list of orders */}
                <View className="flex-1 mt-4">
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        showsVerticalScrollIndicator={false}
      />
      </View></View>
    </SafeAreaView>
  );
};

export default OrdersList;
