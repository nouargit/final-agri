import Bag from '@/components/Bag'
import { AlertCircle, Clock, Package, Search, ShoppingCart } from 'lucide-react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Cart = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'bags' | 'orders'>('bags')
  const { t } = useTranslation()

  // Fake cart data
  const carts = [
    {
      id: 1,
      shop_id: 1,
      user_id: 1,
      total: 9.98,
      status: 'pending',
      created_at: '2024-11-20',
      updated_at: '2024-11-20',
      shop: {
        id: 1,
        name: 'Green Valley Farm',
        location: 'Algiers',
        rating: 4.8,
      },
      items: [
        {
          id: 1,
          cart_id: 1,
          product_id: 1,
          quantity: 2,
          price: 4.99,
          created_at: '2024-11-20',
          updated_at: '2024-11-20',
          product: {
            id: 1,
            name: 'Fresh Organic Tomatoes',
            price: 4.99,
            image: '🍅',
            images: [],
            unit: 'kg',
          },
        },
      ],
    },
    {
      id: 2,
      shop_id: 2,
      user_id: 1,
      total: 6.99,
      status: 'pending',
      created_at: '2024-11-21',
      updated_at: '2024-11-21',
      shop: {
        id: 2,
        name: 'Sunny Farm',
        location: 'Oran',
        rating: 4.5,
      },
      items: [
        {
          id: 2,
          cart_id: 2,
          product_id: 2,
          quantity: 1,
          price: 6.99,
          created_at: '2024-11-21',
          updated_at: '2024-11-21',
          product: {
            id: 2,
            name: 'Free Range Eggs',
            price: 6.99,
            image: '🥚',
            images: [],
            unit: 'dozen',
          },
        },
      ],
    },
    {
      id: 3,
      shop_id: 3,
      user_id: 1,
      total: 12.99,
      status: 'pending',
      created_at: '2024-11-22',
      updated_at: '2024-11-22',
      shop: {
        id: 3,
        name: 'Honey Haven',
        location: 'Constantine',
        rating: 4.9,
      },
      items: [
        {
          id: 3,
          cart_id: 3,
          product_id: 3,
          quantity: 1,
          price: 12.99,
          created_at: '2024-11-22',
          updated_at: '2024-11-22',
          product: {
            id: 3,
            name: 'Local Honey',
            price: 12.99,
            image: '🍯',
            images: [],
            unit: 'jar',
          },
        },
      ],
    },
  ]

  // Fake orders data
  const orders = [
    {
      id: 1,
      shop_id: 1,
      user_id: 1,
      order_number: 'ORD-001',
      created_at: '2024-11-20',
      updated_at: '2024-11-20',
      status: 'delivered',
      total: 45.50,
      items_count: 8,
      tracking: 'TRK123456',
      shop: {
        id: 1,
        name: 'Green Valley Farm',
        location: 'Algiers',
      },
    },
    {
      id: 2,
      shop_id: 2,
      user_id: 1,
      order_number: 'ORD-002',
      created_at: '2024-11-18',
      updated_at: '2024-11-18',
      status: 'in-transit',
      total: 32.99,
      items_count: 4,
      tracking: 'TRK123457',
      shop: {
        id: 2,
        name: 'Sunny Farm',
        location: 'Oran',
      },
    },
    {
      id: 3,
      shop_id: 3,
      user_id: 1,
      order_number: 'ORD-003',
      created_at: '2024-11-15',
      updated_at: '2024-11-15',
      status: 'processing',
      total: 78.50,
      items_count: 12,
      tracking: 'TRK123458',
      shop: {
        id: 3,
        name: 'Honey Haven',
        location: 'Constantine',
      },
    },
  ]

  const isLoading = false
  const error = null
  const refetch = () => {}

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
        {t('cart.unableToLoad')}
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