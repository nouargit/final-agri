import Bag from '@/components/Bag'
import { images } from '@/constants/imports'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Clock, Package, Search, ShoppingCart } from 'lucide-react-native'
import { useCallback, useState } from 'react'
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

  // Storage keys for persistence
  const CARTS_KEY = 'persisted_carts'
  const ORDERS_KEY = 'persisted_orders'

  // Initial (fallback) cart data used only if nothing is stored yet
  const initialCartSeed = [
    {
      id: 1,
      shop_id: 1,
      user_id: 1,
      total: 29.97,
      status: 'pending',
      created_at: '2024-11-20T10:30:00',
      updated_at: '2024-11-20T10:30:00',
      shop: {
        id: 1,
        name: 'Green Valley Farm',
        logo_url: undefined,
      },
      items: [
        {
          id: 1,
          cart_id: 1,
          product_id: 1,
          quantity: 2,
          price: 4.99,
          created_at: '2024-11-20T10:30:00',
          updated_at: '2024-11-20T10:30:00',
          product: {
            id: 1,
            name: 'Fresh Organic Tomatoes',
            price: 4.99,
            images: [images.potato],
          },
        },
        {
          id: 2,
          cart_id: 1,
          product_id: 2,
          quantity: 3,
          price: 6.99,
          created_at: '2024-11-20T10:30:00',
          updated_at: '2024-11-20T10:30:00',
          product: {
            id: 2,
            name: 'Fresh Carrots',
            price: 6.99,
            images: [images.orange],
          },
        },
      ],
    },
    {
      id: 2,
      shop_id: 2,
      user_id: 1,
      total: 12.99,
      status: 'pending',
      created_at: '2024-11-21T14:20:00',
      updated_at: '2024-11-21T14:20:00',
      shop: {
        id: 2,
        name: 'Sunny Farm',
        logo_url: undefined,
      },
      items: [
        {
          id: 3,
          cart_id: 2,
          product_id: 3,
          quantity: 1,
          price: 12.99,
          created_at: '2024-11-21T14:20:00',
          updated_at: '2024-11-21T14:20:00',
          product: {
            id: 3,
            name: 'Fresh Salad Mix',
            price: 12.99,
            images: [images.salad],
          },
        },
      ],
    },
  ]

  // Fake orders data (still static; server-backed could be added later)
  const orders = [
    {
      id: 101,
      shop_id: 1,
      user_id: 1,
      total: 45.50,
      status: 'delivered',
      created_at: '2024-11-15T09:00:00',
      updated_at: '2024-11-20T16:30:00',
      shop: {
        id: 1,
        name: 'Green Valley Farm',
        logo_url: undefined,
      },
      items: [
        {
          id: 101,
          cart_id: 101,
          product_id: 1,
          quantity: 5,
          price: 4.99,
          created_at: '2024-11-15T09:00:00',
          updated_at: '2024-11-15T09:00:00',
          product: {
            id: 1,
            name: 'Fresh Organic Tomatoes',
            price: 4.99,
            images: [images.potato],
          },
        },
        {
          id: 102,
          cart_id: 101,
          product_id: 4,
          quantity: 3,
          price: 8.99,
          created_at: '2024-11-15T09:00:00',
          updated_at: '2024-11-15T09:00:00',
          product: {
            id: 4,
            name: 'Fresh Wheat',
            price: 8.99,
            images: [images.kameh],
          },
        },
      ],
    },
    {
      id: 102,
      shop_id: 2,
      user_id: 1,
      total: 32.99,
      status: 'on_delivery',
      created_at: '2024-11-18T11:00:00',
      updated_at: '2024-11-22T14:00:00',
      shop: {
        id: 2,
        name: 'Sunny Farm',
        logo_url: undefined,
      },
      items: [
        {
          id: 201,
          cart_id: 102,
          product_id: 3,
          quantity: 2,
          price: 12.99,
          created_at: '2024-11-18T11:00:00',
          updated_at: '2024-11-18T11:00:00',
          product: {
            id: 3,
            name: 'Fresh Salad Mix',
            price: 12.99,
            images: [images.salad],
          },
        },
        {
          id: 202,
          cart_id: 102,
          product_id: 2,
          quantity: 1,
          price: 6.99,
          created_at: '2024-11-18T11:00:00',
          updated_at: '2024-11-18T11:00:00',
          product: {
            id: 2,
            name: 'Fresh Carrots',
            price: 6.99,
            images: [images.orange],
          },
        },
      ],
    },
    {
      id: 103,
      shop_id: 3,
      user_id: 1,
      total: 78.50,
      status: 'confirmed',
      created_at: '2024-11-22T08:30:00',
      updated_at: '2024-11-22T10:00:00',
      shop: {
        id: 3,
        name: 'Harvest Haven',
        logo_url: undefined,
      },
      items: [
        {
          id: 301,
          cart_id: 103,
          product_id: 1,
          quantity: 4,
          price: 4.99,
          created_at: '2024-11-22T08:30:00',
          updated_at: '2024-11-22T08:30:00',
          product: {
            id: 1,
            name: 'Fresh Organic Tomatoes',
            price: 4.99,
            images: [images.potato],
          },
        },
        {
          id: 302,
          cart_id: 103,
          product_id: 2,
          quantity: 6,
          price: 6.99,
          created_at: '2024-11-22T08:30:00',
          updated_at: '2024-11-22T08:30:00',
          product: {
            id: 2,
            name: 'Fresh Carrots',
            price: 6.99,
            images: [images.orange],
          },
        },
        {
          id: 303,
          cart_id: 103,
          product_id: 4,
          quantity: 2,
          price: 8.99,
          created_at: '2024-11-22T08:30:00',
          updated_at: '2024-11-22T08:30:00',
          product: {
            id: 4,
            name: 'Fresh Wheat',
            price: 8.99,
            images: [images.kameh],
          },
        },
      ],
    },
  ]

  // Load carts from storage (seed if empty)
  const loadCarts = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(CARTS_KEY)
      if (!raw) {
        // Seed storage with initial cart if missing
        await AsyncStorage.setItem(CARTS_KEY, JSON.stringify(initialCartSeed))
        return initialCartSeed
      }
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
      return []
    } catch (e) {
      return []
    }
  }, [])

  // Load orders from storage
  const loadOrders = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(ORDERS_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  }, [])

  const queryClient = useQueryClient()

  const { data: ordersData = [], refetch: refetchOrders, isLoading, error, isRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: loadOrders,
    staleTime: 1000 * 30,
  })

  // Helper to persist updates (example usage for future add/remove actions)
  const saveCarts = async (_next: any[]) => {
    // Deprecated: using orders only now
    return
  }

  const saveOrders = async (next: any[]) => {
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(next))
    queryClient.setQueryData(['orders'], next)
  }

  // Example remove item function (not wired into UI yet)
  // Recompute totals for a cart
  const recomputeCartTotals = (cart: any) => {
    const total = (cart.items || []).reduce((sum: number, it: any) => {
      const line = (it.price ?? 0) * (it.quantity ?? 0)
      return sum + line
    }, 0)
    return { ...cart, total: Number(total.toFixed(2)) }
  }

  // Upsert a product into a per-shop pending order (acts as cart)
  const upsertItemToCart = async (shop: any, product: any, quantity: number = 1) => {
    const existing = await loadOrders()
    let cart = existing.find((c: any) => c.shop?.id === shop.id && (c.status || '').toLowerCase() === 'pending')

    if (!cart) {
      cart = {
        id: Date.now(),
        shop_id: shop.id,
        user_id: 1,
        total: 0,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        shop,
        items: [],
      }
      existing.push(cart)
    }

    const idx = cart.items.findIndex((it: any) => it.product_id === product.id)
    if (idx >= 0) {
      const current = cart.items[idx]
      cart.items[idx] = {
        ...current,
        quantity: (current.quantity ?? 0) + quantity,
        price: product.price ?? current.price ?? 0,
        updated_at: new Date().toISOString(),
      }
    } else {
      cart.items.push({
        id: Date.now(),
        cart_id: cart.id,
        product_id: product.id,
        quantity: quantity,
        price: product.price ?? 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product,
      })
    }

    const updated = existing.map((c: any) =>
      c.id === cart.id ? recomputeCartTotals({ ...cart, updated_at: new Date().toISOString() }) : c
    )
    await saveOrders(updated)
  }

  // Remove a product from a pending order (cart view)
  const removeCartItem = async (cartId: number, productId: number) => {
    const orders = await loadOrders()
    const next = orders
      .map((c: any) => {
        if (c.id !== cartId) return c
        const items = (c.items || []).filter((it: any) => it.product_id !== productId)
        const updated = recomputeCartTotals({ ...c, items })
        return updated
      })
      .filter((c: any) => (c.items || []).length > 0)
    await saveOrders(next)
    queryClient.setQueryData(['orders'], next)
  }

  // Submit a cart: mark pending order as confirmed
  const submitCart = async (cartId: number) => {
    const orders = await loadOrders()
    const nextOrders = orders.map((o: any) =>
      o.id === cartId ? { ...o, status: 'confirmed', submitted_at: new Date().toISOString() } : o
    )
    await saveOrders(nextOrders)
    queryClient.setQueryData(['orders'], nextOrders)
    refetchOrders()
  }

  // Filter data based on search query
  // Use orders only; if 'bags' tab selected, show pending orders as carts
  const currentData = activeTab === 'bags'
    ? ordersData.filter((o: any) => (o.status || '').toLowerCase() === 'pending')
    : ordersData
  const filteredData = currentData.filter((item: any) => {
    if (!searchQuery) return true
    const shopName = item?.shop?.name?.toLowerCase() || ''
    return shopName.includes(searchQuery.toLowerCase())
  })

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className={`rounded-full p-8 mb-6 ${
        activeTab === 'bags' ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
      }`}>
        {activeTab === 'bags' ? (
          <ShoppingCart size={72} color="#FF6F61" strokeWidth={1.5} />
        ) : (
          <Package size={72} color="#3B82F6" strokeWidth={1.5} />
        )}
      </View>
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {activeTab === 'bags' 
          ? (t('cart.emptyCartTitle') || 'Your cart is empty') 
          : (t('cart.emptyOrdersTitle') || 'No orders yet')}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center text-base max-w-sm leading-6">
        {activeTab === 'bags' 
          ? (t('cart.emptyCartDesc') || 'Start shopping to add items to your cart') 
          : (t('cart.emptyOrdersDesc') || 'Your order history will appear here')}
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
        onPress={() => refetchOrders()}
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
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950">
      {/* Header */}
      <View className="px-6 pt-2 pb-4 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('cart.header') || 'My Cart & Orders'}
        </Text>
        {filteredData.length > 0 && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filteredData.length} {filteredData.length === 1 ? (t('common.item') || 'item') : (t('common.items') || 'items')} {t('cart.found') || 'found'}
          </Text>
        )}
      </View>

      {/* Tabs */}
      <View className="px-6 py-4 bg-white dark:bg-neutral-900">
        <View className="flex-row bg-gray-100 dark:bg-neutral-800 rounded-2xl p-1.5">
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
              color={activeTab === 'bags' ? '#FF6F61' : '#9CA3AF'} 
              strokeWidth={2}
            />
            <Text className={`ml-2 font-semibold ${
              activeTab === 'bags'
                ? 'text-primary dark:text-primary'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {t('cart.tabCart') || 'Cart'}
            </Text>
            {currentData.length > 0 && activeTab === 'bags' && (
              <View className="ml-2 bg-primary rounded-full px-2.5 py-0.5 min-w-[24px] items-center">
                <Text className="text-white text-xs font-bold">{currentData.length}</Text>
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
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {t('cart.tabOrders') || 'Orders'}
            </Text>
            {activeTab === 'orders' && currentData.length > 0 && (
              <View className="ml-2 bg-blue-600 rounded-full px-2.5 py-0.5 min-w-[24px] items-center">
                <Text className="text-white text-xs font-bold">{currentData.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 pb-4 bg-white dark:bg-neutral-900">
        <View className="flex-row items-center bg-gray-100 dark:bg-neutral-800 rounded-xl px-4 py-3">
          <Search size={20} color="#9CA3AF" strokeWidth={2} />
          <TextInput
            className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
            placeholder={t('cart.searchPlaceholder') || 'Search by shop name...'}
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
            <View className="bg-gray-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
              <Search size={64} color="#9CA3AF" strokeWidth={1.5} />
            </View>
            <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('common.noResultsFound') || 'No results found'}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              {t('common.trySearching') || 'Try adjusting your search terms'}
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
              onSubmitCart={() => submitCart(item.id)}
            />
          )}
          keyExtractor={(item) => `${activeTab}-${item.id}`}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading || isRefetching}
              onRefresh={() => refetchOrders()}
              tintColor="#FF6F61"
              colors={['#FF6F61']}
            />
          }
        />
      )}
    </SafeAreaView>
  )
}

export default Cart