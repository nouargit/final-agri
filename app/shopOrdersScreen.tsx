import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShopOrderComponent from '@/components/ShopOrderComponent';
import { images } from '@/constants/imports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/config';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

// Sample shop orders data
const sampleShopOrders = [
  {
    id: "ORD-1001",
    customer: {
      id: "cust-1",
      name: "Sarah Johnson",
      profilePicture: images.avatar,
      phoneNumber: "+1 234-567-8901",
      acceptedOrders: 12,
      returnedOrders: 1
    },
    orderDate: "2024-01-15",
    totalAmount: "$45.50",
    status: "pending" as const,
    items: 3
  },
  {
    id: "ORD-1002",
    customer: {
      id: "cust-2",
      name: "Mike Chen",
      profilePicture: images.avatar,
      phoneNumber: "+1 234-567-8902",
      acceptedOrders: 8,
      returnedOrders: 0
    },
    orderDate: "2024-01-15",
    totalAmount: "$32.75",
    status: "accepted" as const,
    items: 2
  },
  {
    id: "ORD-1003",
    customer: {
      id: "cust-3",
      name: "Emma Wilson",
      profilePicture: images.avatar,
      phoneNumber: "+1 234-567-8903",
      acceptedOrders: 25,
      returnedOrders: 2
    },
    orderDate: "2024-01-15",
    totalAmount: "$67.25",
    status: "preparing" as const,
    items: 5
  },
  {
    id: "ORD-1004",
    customer: {
      id: "cust-4",
      name: "David Brown",
      profilePicture: images.avatar,
      phoneNumber: "+1 234-567-8904",
      acceptedOrders: 6,
      returnedOrders: 0
    },
    orderDate: "2024-01-14",
    totalAmount: "$28.90",
    status: "ready" as const,
    items: 1
  },
  {
    id: "ORD-1005",
    customer: {
      id: "cust-5",
      name: "Lisa Garcia",
      profilePicture: images.avatar,
      phoneNumber: "+1 234-567-8905",
      acceptedOrders: 15,
      returnedOrders: 3
    },
    orderDate: "2024-01-14",
    totalAmount: "$52.40",
    status: "delivered" as const,
    items: 4
  }
];

const ShopOrdersScreen = () => {

  const {shop_id}= useLocalSearchParams();
 
  const getOrders =async()=>{
    const token = await AsyncStorage.getItem('auth_token');
    try {
      const response = await fetch(`${config.baseUrl}/api/orders?shop_id=${shop_id}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',

        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Raw API response:', shop_id);
      return data.data || data;
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }
  const {data:orders}=useQuery({
    queryKey: ['orders', shop_id],
    queryFn: getOrders,
  });
  
  const handleOrderPress = (order: any) => {
    console.log('Order pressed:', order.id);
    // Handle order details navigation
  };

  const handleCustomerPress = (customer: any) => {
    console.log('Customer pressed:', customer.name);
    // Handle customer profile navigation
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <ShopOrderComponent
        
        orders={orders}
        onOrderPress={handleOrderPress}
        onCustomerPress={handleCustomerPress}
      />
    </SafeAreaView>
  );
};

export default ShopOrdersScreen;