import { images } from '@/constants/imports';
import { Order, OrderFilter } from '@/type';
import { Minus, Plus, Search, X } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import {SafeAreaView} from "react-native-safe-area-context"
// Sample orders data

const orders: Order[] = [
  {
    id: "ORD-1001",
    name: "Sweet Delights name",
    date: "2025-10-01",
    status: "Pending",
    price: 25.50,
    thumbnail: images.bluePudding,
  },
  {
    id: "ORD-1002",
    name: "Cake Heaven",
    date: "2025-09-28",
    status: "Delivered",
    price: 42.00,
    thumbnail: images.baklawa,
  },
  {
    id: "ORD-1003",
    name: "Golden Bakes",
    date: "2025-09-25",
    status: "On the way",
    price: 18.75,
    thumbnail: images.panCake,
  },
  {
    id: "ORD-1004",
    name: "Delightful Bakes",
    date: "2025-09-22",
    status: "Cancelled",
    price: 30.00,
    thumbnail: images.beghrir,
  },
];

// Filter options
const filters: OrderFilter[] = [
  { label: "All", value: '' },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "On the way", value: "on the way" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

// Status color mapping
const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Preparing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "On the way": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

// Order Card Component
const OrderCard = ({ order }: { order: Order }) => {
  const [quantity, setQuantity] = useState(1);
  const colorScheme = useColorScheme();
  const { showActionSheetWithOptions } = useActionSheet(); // Make sure this line is present

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const calculateTotal = () => {
    return `$${(quantity * order.price).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const openSheet = () => {
    const options = ['Edit', 'Delete', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) console.log('Edit pressed');
        if (buttonIndex === 1) console.log('Delete pressed');
      }
    );
  };
  return (

    <View className="mb-2">
      <TouchableOpacity className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700">
        <View className="flex-row items-center">
          {/* Product Image */}
          <Image
            source={order.thumbnail}
            className="w-24 h-24 rounded-xl mr-4"
            resizeMode="cover"
          />

          {/* Order Details */}
          <View className="flex-1">
            {/* Order ID */}
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {order.id}
            </Text>

            {/* Date and Status Row */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-500 dark:text-neutral-400">
                {formatDate(order.date)}
              </Text>
              
              <View className={`px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                <Text className={`text-xs font-medium ${statusColors[order.status].split(' ')[1]}`}>
                  {order.status}
                </Text>
              </View>
            </View>

            {/* Quantity Controls */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => updateQuantity(-1)}
                  className="w-8 h-8 bg-gray-100 dark:bg-neutral-700 rounded-full items-center justify-center mr-3"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} color={quantity <= 1 ? "#9CA3AF" : "#6B7280"} />
                </TouchableOpacity>
                
                <Text className="text-base font-semibold text-gray-900 dark:text-white min-w-[24px] text-center">
                  {quantity}
                </Text>
                
                <TouchableOpacity
                  onPress={() => updateQuantity(1)}
                  className="w-8 h-8 bg-blue-50 dark:bg-primary/40 rounded-full items-center justify-center ml-3"
                >
                  <Plus size={16} color="#ff6370" />
                </TouchableOpacity>
              </View>

              {/* Price */}
              <View className="items-end">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  {calculateTotal()}
                </Text>
                {quantity > 1 && (
                  <Text className="text-xs text-gray-500 dark:text-neutral-400">
                    ${order.price.toFixed(2)} each
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Search Bar Component
const SearchBar = ({ searchQuery, setSearchQuery }: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void; 
}) => (
  <View className="flex-row items-center bg-white dark:bg-neutral-800 rounded-2xl px-4 py-1 mx-4 mb-4 shadow-sm border border-gray-100 dark:border-neutral-700">
    <Search size={20} color="#9CA3AF" />
    <TextInput
      className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
      placeholder="Search orders..."
      placeholderTextColor="#9CA3AF"
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
    {searchQuery !== '' && (
      <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
        <X size={20} color="#9CA3AF" />
      </TouchableOpacity>
    )}
  </View>
);

// Filter Dropdown Component
const FilterDropdown = ({ value, setValue }: { 
  value: string; 
  setValue: (value: string) => void; 
}) => {
  const colorScheme = useColorScheme();
  
  return (
    <View className="mx-4 mb-4">
      <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700">
        <Dropdown
          data={filters}
          labelField="label"
          valueField="value"
          placeholder="Filter by status"
          placeholderStyle={{ 
            color: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
            fontSize: 16
          }}
          selectedTextStyle={{ 
            color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
            fontSize: 16
          }}
          containerStyle={{
            backgroundColor: colorScheme === "dark" ? "#262626" : "#FFFFFF",
            borderRadius: 16,
            borderWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          itemTextStyle={{ 
            color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
            fontSize: 16
          }}
          value={value}
          onChange={(item) => setValue(item.value)}
          activeColor={colorScheme === "dark" ? "#404040" : "#F3F4F6"}
          search
          searchPlaceholder="Search filters..."
          inputSearchStyle={{
            borderRadius: 12,   
            backgroundColor: colorScheme === "dark" ? "#404040" : "#F9FAFB",
            paddingHorizontal: 12,
            color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
            fontSize: 16,
          }}
        />
      </View>
    </View>
  );
};

// Main Orders List Component - wrap with ActionSheetProvider
const OrdersList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('');

  
  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterValue === '' || 
                         order.status.toLowerCase().includes(filterValue.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-gray-500 dark:text-neutral-400 text-lg mb-2">
        No orders found
      </Text>
      <Text className="text-gray-400 dark:text-neutral-500 text-center px-8">
        Try adjusting your search or filter criteria
      </Text>
    </View>
  );

  return (
    <ActionSheetProvider>
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
      {/* Header */}
      <View className="pt-4 pb-2">
        
        
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Filter Dropdown */}
        <FilterDropdown value={filterValue} setValue={setFilterValue} />
      </View>

      {/* Orders List */}
      <View className="flex-1 px-4">
        {filteredOrders.length > 0 ? (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <OrderCard order={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
      <View className='flex-2 rounded-2xl w-full h-1/5 bg-white dark:bg-neutral-800 p-4 shadow-sm border border-gray-100 dark:border-neutral-700'>
        <Text className='text-lg font-bold text-gray-900 dark:text-white mt-4'>
          Total: ${filteredOrders.reduce((sum, o) => sum + o.price, 0).toFixed(2)}
        </Text>
        <TouchableOpacity className='flex w-full p-4 items-center justify-center bg-primary rounded-2xl mt-10 '  >
          <Text className='text-white font-bold text-lg'>
            place order
          </Text>

        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ActionSheetProvider>
  );
};

export default OrdersList;

