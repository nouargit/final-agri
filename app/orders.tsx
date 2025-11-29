import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  Package,
  RotateCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react-native';

const orders = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) throw new Error('No auth token found');

    const response = await fetch(`${config.baseUrl}${config.ordersUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
  };

  const { data = [], isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['orders:list'],
    queryFn: fetchOrders,
    staleTime: 30_000,
  });

  const filtered = data.filter((o: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const shopName = o?.shop?.name?.toLowerCase() || '';
    const orderId = String(o?.id || '');
    return shopName.includes(query) || orderId.includes(query);
  });

  const getStatusStyle = (status: string) => {
    const s = String(status || 'pending').toLowerCase();
    switch (s) {
      case 'completed':
      case 'delivered':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          border: 'border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-800 dark:text-emerald-300',
          icon: CheckCircle,
          iconColor: '#059669', // emerald-600
        };
      case 'processing':
      case 'confirmed':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-300',
          icon: Package,
          iconColor: '#2563EB',
        };
      case 'cancelled':
      case 'rejected':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-300',
          icon: XCircle,
          iconColor: '#DC2626',
        };
      case 'pending':
      default:
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-800 dark:text-amber-300',
          icon: Clock,
          iconColor: '#D97706',
        };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950">
      {/* Header */}
      <View className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <View className="px-5 pt-4 pb-3">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('orders.header') || 'My Orders'}
              </Text>
              {filtered.length > 0 && (
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {filtered.length} {filtered.length === 1 ? 'order' : 'orders'}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => refetch()}
              className="p-3 rounded-xl bg-gray-100 dark:bg-neutral-800 active:opacity-70"
            >
              <RotateCw
                size={20}
                color="#6B7280"
                className={isRefetching ? 'animate-spin' : ''}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {data.length > 0 && (
          <View className="px-5 pb-4">
            <View className="flex-row items-center bg-gray-100 dark:bg-neutral-800 rounded-2xl px-4 py-4">
              <Search size={20} color="#9CA3AF" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('orders.search') || 'Search orders...'}
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-base text-gray-900 dark:text-white font-medium"
                autoCapitalize="none"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
                  <Text className="text-xl text-gray-400">×</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
      </View>

      {/* States */}
      {isLoading && !isRefetching ? (
        <View className="flex-1 justify-center items-center px-8">
          <View className="bg-white dark:bg-neutral-900 rounded-3xl p-10 shadow-2xl">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">
              {t('common.loading') || 'Loading your orders...'}
            </Text>
          </View>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-8">
          <View className="bg-white dark:bg-neutral-900 rounded-3xl p-10 shadow-2xl border border-red-200 dark:border-red-900/50">
            <AlertTriangle size={56} color="#EF4444" />
            <Text className="mt-6 text-xl font-bold text-center text-gray-900 dark:text-white">
              {t('orders.errorTitle') || 'Something went wrong'}
            </Text>
            <Text className="mt-3 text-center text-gray-600 dark:text-gray-400">
              {error.message || 'Please check your connection and try again.'}
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="mt-8 bg-blue-600 rounded-2xl px-8 py-4"
            >
              <Text className="text-white font-bold text-center">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <ShoppingBag size={90} color="#9CA3AF" />
          <Text className="mt-8 text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
            {searchQuery ? 'No orders found' : 'No orders yet'}
          </Text>
          <Text className="mt-4 text-center text-gray-500 dark:text-gray-400 max-w-xs">
            {searchQuery
              ? 'Try a different shop name or order number.'
              : 'Your orders will appear here when you make a purchase.'}
          </Text>
          {searchQuery && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              className="mt-8 px-8 py-4 bg-gray-200 dark:bg-neutral-800 rounded-2xl"
            >
              <Text className="font-semibold text-gray-700 dark:text-gray-300">
                Clear Search
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="px-5 pt-4 pb-8"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          renderItem={({ item }) => {
            const status = getStatusStyle(item.status);
            const StatusIcon = status.icon;
            const statusLower = String(item.status || 'pending').toLowerCase();
            const isGreenStatus = statusLower === 'completed' || statusLower === 'delivered' || statusLower === 'accepted' || statusLower === 'ready';
const isBlueStatus = statusLower === 'processing' || statusLower === 'confirmed';
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  router.push({ pathname: '/order_items', params: { id: String(item.id) } })
                }
                className="mb-4 overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-lg shadow-black/5"
              >
                <View className="p-5">
                  {/* Shop & Order ID */}
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.shop?.name || 'Unknown Shop'}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Order #{item.id}
                      </Text>
                    </View>

                    {/* Status Badge */}
                    <View className="items-end">
                      <View
                        className={`flex-row items-center gap-2 px-3 py-2 rounded-full ${status.bg} border ${status.border}`}
                      >
                        <StatusIcon size={16} color={status.iconColor} />
                        <Text className={`text-xs font-bold uppercase ${status.text}`}>
                          {item.status || 'Pending'}
                        </Text>
                      </View>
                      
                      {/* Ask for Delivery Button - only for green status */}
                      {isBlueStatus && (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push({ pathname: '/deleveryMap', params: { orderId: String(item.id) } });
                          }}
                          className="flex-row items-center gap-1 mt-2 px-3 py-2 rounded-full"
                          style={{ backgroundColor: '#22C55E' }}
                        >
                          <Truck size={14} color="white" />
                          <Text className="text-xs font-bold text-white">
                            Ask for Delivery
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Date & Total */}
                  <View className="flex-row justify-between items-end pt-4 border-t border-gray-100 dark:border-neutral-800">
                    <View>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Ordered on
                      </Text>
                      <Text className="text-base font-semibold text-gray-700 dark:text-gray-300 mt-1">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Total
                      </Text>
                      <Text className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        ${Number(item.total ?? 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Chevron */}
                <View className="absolute right-4 top-1/2 -translate-y-3">
                  <ChevronRight size={24} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default orders;