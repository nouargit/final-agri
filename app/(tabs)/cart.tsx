import { useState } from 'react'
import Bag from '@/components/Bag'
import { config } from '@/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery } from '@tanstack/react-query'
import { Search, ShoppingCart, AlertCircle } from 'lucide-react-native'
import { 
  FlatList, 
  Text, 
  TextInput, 
  View, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Cart = () => {
  const [searchQuery, setSearchQuery] = useState('')

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
      return data.data || []
    } catch (error) {
      console.error('Error fetching cart:', error)
      throw error
    }
  }

  const { data: carts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['carts'],
    queryFn: getCarts,
  })

  // Filter carts based on search query
  const filteredCarts = carts.filter((cart: { shop: { name: string } }) => {
    if (!searchQuery) return true
    const shopName = cart?.shop?.name?.toLowerCase() || ''
    return shopName.includes(searchQuery.toLowerCase())
  })

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <ShoppingCart size={64} color="#9CA3AF" />
      <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
        Your cart is empty
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
        Start adding items to your cart to see them here
      </Text>
    </View>
  )

  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <AlertCircle size={64} color="#EF4444" />
      <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
        Something went wrong
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
        {error?.message || 'Unable to load your cart'}
      </Text>
    </View>
  )

  const renderLoadingState = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-gray-500 dark:text-gray-400 mt-4">
        Loading your cart...
      </Text>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Shopping Cart
        </Text>
        {carts.length > 0 && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {carts.length} {carts.length === 1 ? 'item' : 'items'} in your cart
          </Text>
        )}
      </View>

      {/* Search Bar */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center bg-white dark:bg-neutral-900 rounded-xl px-4 py-1 border border-gray-200 dark:border-neutral-800 shadow-sm">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
            placeholder="Search by shop name..."
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
      ) : filteredCarts.length === 0 ? (
        searchQuery ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-lg text-gray-500 dark:text-gray-400">
              No results found for "{searchQuery}"
            </Text>
          </View>
        ) : (
          renderEmptyState()
        )
      ) : (
        <View className="flex-1 mb-4">
        <FlatList
          data={filteredCarts}
          renderItem={({ item }) => (
            <Bag bag={item} shop={item.shop} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="px-6 pb-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#3B82F6"
            />
          }
        />
    </View>
      )}
    </SafeAreaView>
  )
}

export default Cart