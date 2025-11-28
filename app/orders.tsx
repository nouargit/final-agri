import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Search} from 'lucide-react-native';
import { RotateCw } from 'lucide-react-native';

const OrdersScreen = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) throw new Error('No auth token found');
    const response = await fetch(`${config.baseUrl}${config.ordersUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      console.error('Fetch orders failed:', response.status, await response.text())
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data?.orders) ? data.orders : (Array.isArray(data) ? data : []);
  };

  const { data = [], isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['orders:list'],
    queryFn: fetchOrders,
    staleTime: 30_000,
  });

  const filtered = data.filter((o: any) => {
    if (!searchQuery) return true;
    const name = o?.shop?.name?.toLowerCase() || '';
    const orderId = String(o?.id || '');
    return name.includes(searchQuery.toLowerCase()) || orderId.includes(searchQuery);
  });

  const getStatusColor = (status: string) => {
    const s = String(status || 'pending').toLowerCase();
    switch (s) {
      case 'completed':
      case 'delivered':
        return 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400';
      case 'processing':
      case 'confirmed':
        return 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400';
      default:
        return 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950">
      {/* Enhanced Header */}
      <View className="px-5 pt-3 pb-4 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('orders.header') || 'Orders'}
            </Text>
            {filtered.length > 0 && (
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {filtered.length} {filtered.length === 1 ? 'order' : 'orders'}
              </Text>
            )}
          </View>
          {data.length > 0 && (
            <TouchableOpacity 
              onPress={() => refetch()}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 items-center justify-center"
              activeOpacity={0.7}
            >
              <RotateCw size={24}  color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        {data.length > 0 && (
          <View className="bg-gray-100 dark:bg-neutral-800 rounded-xl px-4 py-3 flex-row items-center">
            <Search size={20} color="#9CA3AF" className="mr-2" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('orders.search') || 'Search by shop or order #...'}
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-gray-900 dark:text-white text-base"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
                <Text className="text-gray-500 dark:text-gray-400">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Loading State */}
      {isLoading && !isRefetching ? (
        <View className="flex-1 items-center justify-center">
          <View className="bg-white dark:bg-neutral-900 rounded-3xl p-8 items-center shadow-lg">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-600 dark:text-gray-400 mt-4 text-base font-medium">
              {t('common.loading') || 'Loading orders...'}
            </Text>
          </View>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-white dark:bg-neutral-900 rounded-3xl p-8 items-center shadow-lg max-w-sm">
            <Text className="text-6xl mb-4">⚠️</Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
              {t('orders.errorTitle') || 'Unable to Load Orders'}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {error.message || 'Failed to load orders'}
            </Text>
            <TouchableOpacity 
              onPress={() => refetch()} 
              className="bg-blue-600 dark:bg-blue-500 px-6 py-3 rounded-full shadow-sm"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">
                {t('common.tryAgain') || 'Try Again'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            <Text className="text-7xl mb-4">📦</Text>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? t('orders.noResults') || 'No Orders Found' : t('orders.empty') || 'No Orders Yet'}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              {searchQuery 
                ? t('orders.tryDifferent') || 'Try a different search term'
                : t('orders.startShopping') || 'Your orders will appear here'}
            </Text>
            {searchQuery && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                className="mt-4 bg-gray-200 dark:bg-neutral-800 px-5 py-2.5 rounded-full"
              >
                <Text className="text-gray-700 dark:text-gray-300 font-medium">Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mx-4 my-2 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 overflow-hidden"
              onPress={() => router.push({ pathname: '/order_items', params: { id: String(item.id) } })}
              activeOpacity={0.7}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              {/* Order Header */}
              <View className="p-4 pb-3 border-b border-gray-100 dark:border-neutral-800">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('orders.order') || 'Order'}
                      </Text>
                      <Text className="text-lg font-bold text-gray-900 dark:text-white ml-1.5">
                        #{item.id}
                      </Text>
                    </View>
                    {!!item.shop?.name && (
                      <View className="flex-row items-center mt-1">
                        <Text className="text-base text-gray-700 dark:text-gray-300 font-medium">
                          {item.shop.name}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className={`px-3 py-1.5 rounded-full ${getStatusColor(item.status)}`}>
                    <Text className="text-xs font-bold uppercase tracking-wide">
                      {String(item.status || 'pending')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Order Footer */}
              <View className="p-4 pt-3 bg-gray-50 dark:bg-neutral-800/50">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      {new Date(item.created_at || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                    <Text className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(item.created_at || Date.now()).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      {t('orders.total') || 'Total'}
                    </Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${Number(item.total ?? 0).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tap Indicator */}
              <View className="absolute right-4 top-1/2 -mt-3 opacity-30">
                <Text className="text-gray-400 dark:text-gray-600 text-xl">›</Text>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={isRefetching} 
              onRefresh={() => refetch()}
              tintColor="#3B82F6"
            />
          }
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;