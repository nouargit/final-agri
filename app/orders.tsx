import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950">
      <View className="px-4 pt-2 pb-3 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">{t('orders.header') || 'Orders'}</Text>
        {filtered.length > 0 && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filtered.length} {t('common.items') || 'items'}</Text>
        )}
      </View>

      {isLoading && !isRefetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2">{t('common.loading') || 'Loading...'}</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 dark:text-red-400">{t('orders.failed') || 'Failed to load orders'}</Text>
          <TouchableOpacity onPress={() => refetch()} className="mt-4 bg-primary px-4 py-2 rounded-full">
            <Text className="text-white">{t('common.tryAgain') || 'Try Again'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="m-3 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700"
              onPress={() => router.push({ pathname: '/order_items', params: { id: String(item.id) } })}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">{t('orders.order')} #{item.id}</Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 capitalize">{String(item.status || 'pending')}</Text>
              </View>
              <Text className="mt-1 text-gray-600 dark:text-gray-300">{t('orders.shop') || 'Shop'}: {item.shop?.name || 'Unknown'}</Text>
              <Text className="mt-1 text-gray-600 dark:text-gray-300">{t('orders.total') || 'Total'}: ${Number(item.total ?? 0).toFixed(2)}</Text>
              <Text className="mt-1 text-gray-500 dark:text-gray-400">{new Date(item.created_at || Date.now()).toLocaleString()}</Text>
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;