import { useState } from 'react'
import Bag from '@/components/Bag'
import { config } from '@/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery } from '@tanstack/react-query'
import { Search, ShoppingCart, AlertCircle, Package, Clock } from 'lucide-react-native'
import { 
  FlatList, 
  Text, 
  TextInput, 
  View, 
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Animated
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

const Cart = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'bags' | 'orders'>('bags')
  const { t } = useTranslation()

  const getCarts = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await fetch(`${config.baseUrl}/api/carts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status}`)
      }

      const data = await response.json()
      //console.log('Fetched cart :', data)
      return data.data || []
    } catch (error) {
      console.error('Error fetching cart:', error)
      throw error
    }
  }

  const getOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await fetch(`${config.baseUrl}/api/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`)
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }

  const { data: carts = [], isLoading: isLoadingCarts, error: cartsError, refetch: refetchCarts } = useQuery({
    queryKey: ['carts'],
    queryFn: getCarts,
    enabled: activeTab === 'bags',
  })

  const { data: orders = [], isLoading: isLoadingOrders, error: ordersError, refetch: refetchOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    enabled: activeTab === 'orders',
  })

  const isLoading = activeTab === 'bags' ? isLoadingCarts : isLoadingOrders
  const error = activeTab === 'bags' ? cartsError : ordersError
  const refetch = activeTab === 'bags' ? refetchCarts : refetchOrders

  // Filter data based on search query
  const currentData = activeTab === 'bags' ? carts : orders
  const filteredData = currentData.filter((item: any) => {
    if (!searchQuery) return true
    const shopName = item?.shop?.name?.toLowerCase() || ''
    return shopName.includes(searchQuery.toLowerCase())
  })

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      {activeTab === 'bags' ? (
        <ShoppingCart size={72} color="#D1D5DB" strokeWidth={1.5} />
      ) : (
        <Package size={72} color="#D1D5DB" strokeWidth={1.5} />
      )}
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-6">
        {activeTab === 'bags' ? t('cart.emptyCartTitle') : t('cart.emptyOrdersTitle')}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center mt-3 text-base max-w-sm">
        {activeTab === 'bags' 
          ? t('cart.emptyCartDesc') 
          : t('cart.emptyOrdersDesc')}
      </Text>
    </View>
  )

  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <View className="bg-red-50 dark:bg-red-900/20 rounded-full p-6">
        <AlertCircle size={64} color="#EF4444" strokeWidth={1.5} />
      </View>
      <Text className="text-xl font-bold text-gray-900 dark:text-white mt-6">
        {t('cart.oops')}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center mt-3 text-base max-w-sm">
        {error?.message || t('cart.unableToLoad')}
      </Text>
      <TouchableOpacity 
        onPress={() => refetch()}
        className="mt-6 bg-primary px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold">{t('common.tryAgain')}</Text>
      </TouchableOpacity>
    </View>
  )

  const renderLoadingState = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-gray-500 dark:text-gray-400 mt-4 text-base">
        {t('common.loading')}
      </Text>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      {/* Header */}
      <View className="px-6 pt-2 pb-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('cart.header')}
        </Text>
        {filteredData.length > 0 && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('cart.itemsFound', { count: filteredData.length, unit: filteredData.length === 1 ? t('common.item') : t('common.items') })}
          </Text>
        )}
      </View>

      {/* Tabs */}
      <View className="px-6 pb-4">
        <View className="flex-row bg-gray-100 dark:bg-neutral-800 rounded-2xl p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('bags')}
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
              activeTab === 'bags' 
                ? 'bg-white dark:bg-neutral-700 shadow-sm' 
                : ''
            }`}
          >
            <ShoppingCart 
              size={20} 
              color={activeTab === 'bags' ? '#FF6F61' : '#FF6F61'} 
              strokeWidth={2}
            />
            <Text className={`ml-2 font-semibold ${
              activeTab === 'bags'
                ? 'text-primary dark:text-primary'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {t('cart.tabCart')}
            </Text>
            {carts.length > 0 && activeTab === 'bags' && (
              <View className="ml-2 bg-primary rounded-full px-2 py-0.5 min-w-[24px] items-center">
                <Text className="text-white text-xs font-bold">{carts.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('orders')}
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
              activeTab === 'orders' 
                ? 'bg-white dark:bg-neutral-700 shadow-sm' 
                : ''
            }`}
          >
            <Clock 
              size={20} 
              color={activeTab === 'orders' ? '#3B82F6' : '#9CA3AF'} 
              strokeWidth={2}
            />
            <Text className={`ml-2 font-semibold ${
              activeTab === 'orders'
                ? 'text-primary dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {t('cart.tabOrders')}
            </Text>
            {orders.length > 0 && activeTab === 'orders' && (
              <View className="ml-2 bg-primary rounded-full px-2 py-0.5 min-w-[24px] items-center">
                <Text className="text-white text-xs font-bold">{orders.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center bg-white dark:bg-neutral-800 rounded-2xl px-5 py-4 border border-gray-200 dark:border-neutral-700 shadow-sm">
          <Search size={10} color="#9CA3AF" strokeWidth={2} />
          <TextInput
            className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
            placeholder={t('cart.searchPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : filteredData.length === 0 ? (
        searchQuery ? (
          <View className="flex-1 items-center justify-center px-6">
            <Search size={64} color="#D1D5DB" strokeWidth={1.5} />
            <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
              {t('common.noResultsFound')}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
              {t('common.trySearching')}
            </Text>
          </View>
        ) : (
          renderEmptyState()
        )
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <Bag 
              bag={item} 
              shop={item.shop} 
              type={activeTab}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#3B82F6"
            />
          }
        />
      )}
    </SafeAreaView>
  )
}

export default Cart