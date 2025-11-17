import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderCard from '@/components/OrderCard'; // make sure this path matches where you saved it

const ShopOrdersManagement = () => {
  const { shop_id, order_id } = useLocalSearchParams();

  // Temporary local states for demo
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const getOrderItems = async (): Promise<any[]> => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) return [];

    try {
      const response = await fetch(
        `${config.baseUrl}/api/order/items?order_id=${order_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching order items:', error);
      return [];
    }
  };

  const {
    data: orderItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['items', order_id],
    queryFn: getOrderItems,
    enabled: !!order_id,
  });

  // Set default quantities when data loads
  useEffect(() => {
    if (orderItems?.length > 0) {
      const initialQuantities = orderItems.reduce((acc, item) => {
        acc[item.id] = item.quantity || 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [orderItems]);

  // Mock utility functions
  const updateQuantity = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const deleteOrder = (id: number) => {
    console.log(`Delete order item ${id}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  const calculateTotal = (price: number, quantity: number) => {
    return `$${(price * quantity).toFixed(2)}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900 px-4 pt-2">
      {/* Header */}
      <View className="mb-4 mt-2">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
          Order Details
        </Text>
        <Text className="text-sm text-neutral-500">Shop ID: {shop_id}</Text>
      </View>

      {/* Loading */}
      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-neutral-500 mt-3">Loading...</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-base font-medium">
            Failed to load order items.
          </Text>
        </View>
      )}

      {/* Empty */}
      {!isLoading && !error && orderItems.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-neutral-500 text-base">
            No items found for this order.
          </Text>
        </View>
      )}

      {/* Orders List */}
      {!isLoading && orderItems.length > 0 && (
        <FlatList
          data={orderItems}
          keyExtractor={(item) => item.id?.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              image={item.product?.images?.[0]} cart={undefined} refetch={function (): void {
                throw new Error('Function not implemented.');
              } }             
              
              
            
            
              
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ShopOrdersManagement;
