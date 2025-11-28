import { config } from '@/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

async function fetchOrderItems(orderId: string) {
  const token = await AsyncStorage.getItem('auth_token')
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${config.baseUrl}${config.orderItemsUrl}?order_id=${orderId}`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    }
  )
  if (!res.ok) throw new Error(`Failed ${res.status}`)
  const data = await res.json()
  // API may return { items: [] } or []
  return Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
}

export default function OrderItemsScreen() {
  const params = useLocalSearchParams()
  const orderId = String(params.id || '')

  const { data = [], isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: ['orders:items', orderId],
    queryFn: () => fetchOrderItems(orderId),
    enabled: !!orderId,
    staleTime: 30_000,
  })

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950">
      <View className="px-4 pt-2 pb-3 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Order #{orderId}</Text>
        {data.length > 0 && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.length} items</Text>
        )}
      </View>

      {isLoading && !isRefetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2">Loading items…</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 dark:text-red-400">Failed to load order items.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View className="m-3 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
              <View className="flex-row items-center">
                {item.product?.images?.[0]?.url ? (
                  <Image source={{ uri: `${config.baseUrl}${item.product.images[0].url}` }} style={{ width: 56, height: 56, borderRadius: 12, marginRight: 12 }} />
                ) : (
                  <View style={{ width: 56, height: 56, borderRadius: 12, marginRight: 12 }} className="bg-gray-200 dark:bg-neutral-700" />
                )}
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">{item.product?.name || 'Product'}</Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity} • ${Number(item.price ?? 0).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  )
}
