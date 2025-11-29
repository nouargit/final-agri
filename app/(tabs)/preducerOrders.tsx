import { IconSymbol } from '@/components/ui/IconSymbol';
import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'delivered';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product?: {
    name?: string;
    images?: Array<{ url?: string }>;
  };
}

interface Customer {
  id: string;
  name: string;
  phoneNumber?: string;
}

interface ProducerOrder {
  id: string;
  order_number?: number;
  customer?: Customer;
  buyer?: Customer;
  orderDate?: string;
  created_at?: string;
  totalAmount?: number;
  subtotal?: number;
  status: OrderStatus;
  items?: OrderItem[];
  itemsCount?: number;
  delivery_address?: string;
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  preparing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  ready: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  delivered: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
};

const filterTabs: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
];

// Fetch producer orders
async function fetchProducerOrders(): Promise<ProducerOrder[]> {
  const token = await AsyncStorage.getItem('auth_token');
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${config.baseUrl}${config.producerOrdersUrl}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  const data = await response.json();
  console.log('Fetched producer ordersssssssssssssssssssssssssssssssssss:', data);
  return data.data || data.orders || data || [];
}

// Update order status
async function updateOrderStatus(orderId: string, status: 'confirmed' | 'rejected'): Promise<void> {
  const token = await AsyncStorage.getItem('auth_token');
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${config.baseUrl}${config.producerOrderStatusUrl(orderId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || `Failed to update order: ${response.status}`);
  }
}

const ProducerOrders = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | OrderStatus>('all');
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['producer:orders'],
    queryFn: fetchProducerOrders,
    staleTime: 30_000,
  });

  const acceptMutation = useMutation({
    mutationFn: (orderId: string) => updateOrderStatus(orderId, 'confirmed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producer:orders'] });
      Alert.alert('Success', 'Order accepted successfully');
    },
    onError: (err: Error) => {
      Alert.alert('Error', err.message || 'Failed to accept order');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (orderId: string) => updateOrderStatus(orderId, 'rejected'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producer:orders'] });
      Alert.alert('Success', 'Order rejected');
    },
    onError: (err: Error) => {
      Alert.alert('Error', err.message || 'Failed to reject order');
    },
  });

  const handleAccept = (order: ProducerOrder) => {
    Alert.alert(
      'Accept Order',
      `Are you sure you want to accept Order #${order.order_number || order.id.slice(0, 8)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'default',
          onPress: () => acceptMutation.mutate(order.id),
        },
      ]
    );
  };

  const handleReject = (order: ProducerOrder) => {
    Alert.alert(
      'Reject Order',
      `Are you sure you want to reject Order #${order.order_number || order.id.slice(0, 8)}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => rejectMutation.mutate(order.id),
        },
      ]
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderOrderCard = ({ item: order }: { item: ProducerOrder }) => {
    const customerName = order.customer?.name || order.buyer?.name || 'Customer';
    const customerPhone = order.customer?.phoneNumber || order.buyer?.phoneNumber;
    const orderDate = order.orderDate || order.created_at;
    const totalAmount = order.totalAmount || order.subtotal || 0;
    const itemsCount = order.itemsCount || order.items?.length || 0;
    const isPending = order.status === 'pending';
    const isProcessing = acceptMutation.isPending || rejectMutation.isPending;

    return (
      <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-neutral-700">
        {/* Order Header */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Order #{order.order_number || order.id.slice(0, 8)}
          </Text>
          <View className={`px-3 py-1 rounded-full ${statusColors[order.status]}`}>
            <Text className="text-xs font-medium capitalize">{order.status}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View className="mb-4 p-3 bg-gray-50 dark:bg-neutral-700 rounded-xl">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
              <IconSymbol name="user" size={20} color="#ff6370" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900 dark:text-white">
                {customerName}
              </Text>
              {customerPhone && (
                <View className="flex-row items-center mt-1">
                  <IconSymbol name="phone" size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {customerPhone}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {order.delivery_address && (
            <View className="flex-row items-start mt-2 pt-2 border-t border-gray-200 dark:border-neutral-600">
              <IconSymbol name="location" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1 flex-1">
                {order.delivery_address}
              </Text>
            </View>
          )}
        </View>

        {/* Order Details */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <IconSymbol name="bag" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {itemsCount} item{itemsCount !== 1 ? 's' : ''}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500 dark:text-gray-400 mr-3">
              {formatDate(orderDate)}
            </Text>
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {typeof totalAmount === 'number' ? `${totalAmount.toFixed(2)} DZD` : totalAmount}
            </Text>
          </View>
        </View>

        {/* Action Buttons - Only for pending orders */}
        {isPending && (
          <View className="flex-row gap-3 pt-3 border-t border-gray-100 dark:border-neutral-700">
            <TouchableOpacity
              onPress={() => handleReject(order)}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-xl items-center justify-center"
              style={{ backgroundColor: '#EF4444', opacity: isProcessing ? 0.6 : 1 }}
            >
              {rejectMutation.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View className="flex-row items-center">
                  <Text className="text-white text-lg font-bold">✕</Text>
                  <Text className="text-white font-semibold ml-2">Reject</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAccept(order)}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-xl items-center justify-center"
              style={{ backgroundColor: '#22C55E', opacity: isProcessing ? 0.6 : 1 }}
            >
              {acceptMutation.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View className="flex-row items-center">
                  <Text className="text-white text-lg font-bold">✓</Text>
                  <Text className="text-white font-semibold ml-2">Accept</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* View Details for non-pending orders */}
        {!isPending && (
          <TouchableOpacity
            onPress={() => router.push(`/order_items?id=${order.id}`)}
            className="flex-row items-center justify-center pt-3 border-t border-gray-100 dark:border-neutral-700"
          >
            <Text className="text-primary font-medium mr-1">View Details</Text>
            <IconSymbol name="chevron.right" size={16} color="#ff6370" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950 items-center justify-center">
        <ActivityIndicator size="large" color="#ff6370" />
        <Text className="text-gray-500 dark:text-gray-400 mt-3">Loading orders...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950 items-center justify-center px-6">
        <View className="items-center">
          <View className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-4">
            <IconSymbol name="info.circle" size={32} color="#ef4444" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load orders
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mb-4">
            {(error as Error).message || 'Something went wrong'}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950">
      {/* Header */}
      <View className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <View className="px-5 pt-4 pb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              Orders
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your incoming orders
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => refetch()}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 items-center justify-center"
          >
            <Text style={{ fontSize: 18, color: isRefetching ? '#ff6370' : '#6B7280' }}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row px-5 pb-3">
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-full mr-2 ${
                activeFilter === tab.key
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeFilter === tab.key
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-gray-100 dark:bg-neutral-800 items-center justify-center mb-4">
            <IconSymbol name="bag" size={40} color="#9ca3af" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No orders found
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            {activeFilter === 'all'
              ? "You don't have any orders yet"
              : `No ${activeFilter} orders at the moment`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#ff6370"
              colors={['#ff6370']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ProducerOrders;