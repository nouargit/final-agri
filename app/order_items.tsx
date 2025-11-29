import { config } from '@/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'

interface OrderDetailItem {
  id?: string | number
  productId?: string | number
  quantity?: number
  price?: number
  product?: {
    id?: string | number
    name?: string
    images?: Array<{ url?: string; id?: string }>
  }
}

interface OrderPayload {
  id?: string
  status?: string
  createdAt?: string
  producer?: {
    a_address?: string
    a_latitude?: number
    a_longitude?: number
    user?: {
      name?: string
    }
  }
  b_address?: string
  b_latitude?: number
  b_longitude?: number
  transportFee?: number
  orderDetails?: OrderDetailItem[]
}

async function fetchOrder(orderId: string) {
  const token = await AsyncStorage.getItem('auth_token')
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${config.baseUrl}${config.orderItemsUrl}/${orderId}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  })
  if (!res.ok) throw new Error(`Failed ${res.status}`)  
  const data = await res.json()
  const order: OrderPayload | undefined = (data as any)?.order || data
  const details: OrderDetailItem[] = Array.isArray(order?.orderDetails) ? order!.orderDetails : []
  return { order, details }
}

async function submitOrder(
  orderId: string, 
  delivery: { longitude: number; latitude: number; address: string; cityId: string }
) {
  const token = await AsyncStorage.getItem('auth_token')
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${config.baseUrl}/api/buyer/orders/${orderId}/submit`, {
    method: 'PATCH',
    headers: { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json',
      Accept: 'application/json' 
    },
    body: JSON.stringify({
      delivery,
    }),
  })
  if (!res.ok) throw new Error(`Failed ${res.status}`)
  return res.json()
}


const mySubmitOrder = async (
  orderId: string,
  delivery: { longitude: number; latitude: number; address: string; cityId: string }
) => {
  const token = await AsyncStorage.getItem('auth_token')
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${config.baseUrl}/api/buyer/orders/${orderId}/submit`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json',
      Accept: 'application/json' 
    },
    body: JSON.stringify({ delivery }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    const errorMsg = errorData?.message || `Failed ${res.status}`
    throw new Error(errorMsg)
  }
  return res.json()
}


export default function OrderCheckoutScreen() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const orderId = String(params.id || '')

  const [showMap, setShowMap] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'cash'>('card')
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [cityId, setCityId] = useState(Math.random() > 0.5 ? 'bousaada' : 'bouainan') // مثال على تعيين معرف المدينة

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders:items', orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
    staleTime: 30_000,
  })

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!selectedLocation) throw new Error('Please select a delivery location on the map')
      if (!cityId) throw new Error('Please provide a city ID')
      return submitOrder(orderId, {
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude,
        address: deliveryAddress,
        cityId,
      })
    },
    onSuccess: () => {
      Alert.alert(
        'Order Placed Successfully!',
        `Your order #${orderId.slice(0, 8)} has been submitted.`,
        [{ text: 'OK', onPress: () => router.back() }]
      )
    },
    onError: (err: Error) => {
      Alert.alert('Error', err.message || 'Failed to submit order')
    }
  })

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (itemToRemove: OrderDetailItem) => {
      const token = await AsyncStorage.getItem('auth_token')
      if (!token) throw new Error('Not authenticated')

      // Get current items and filter out the one to remove
      const currentItems = data?.details ?? []
      const updatedItems = currentItems
        .filter((item) => {
          // Match by id or productId
          const itemId = item.id || item.productId
          const removeId = itemToRemove.id || itemToRemove.productId
          return itemId !== removeId
        })
        .map((item) => ({
          productId: String(item.productId || item.product?.id || item.id),
          quantityKg: Number(item.quantity || 0),
        }))

      // If no items left, delete the entire order
      if (updatedItems.length === 0) {
        const deleteRes = await fetch(
          `${config.baseUrl}${config.buyerOrderDeleteUrl(orderId)}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        )
        if (!deleteRes.ok) {
          const errorText = await deleteRes.text()
          throw new Error(`Failed to delete order: ${deleteRes.status} - ${errorText}`)
        }
        return { deleted: true }
      }

      // PATCH to update order items (removing the item)
      const res = await fetch(
        `${config.baseUrl}${config.buyerOrderItemsUrl(orderId)}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: updatedItems }),
        }
      )

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to remove item: ${res.status} - ${errorText}`)
      }

      return res.json()
    },
    onSuccess: (result) => {
      if (result?.deleted) {
        Alert.alert('Cart Empty', 'Your cart is now empty.', [
          { text: 'OK', onPress: () => router.back() },
        ])
      } else {
        // Refresh the order data
        queryClient.invalidateQueries({ queryKey: ['orders:items', orderId] })
        Alert.alert('Item Removed', 'The item has been removed from your order.')
      }
    },
    onError: (err: Error) => {
      Alert.alert('Error', err.message || 'Failed to remove item')
    },
  })

  const handleRemoveItem = (item: OrderDetailItem) => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.product?.name || 'this item'} from order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItemMutation.mutate(item),
        },
      ]
    )
  }

  const order: OrderPayload | undefined = data?.order
  const items: OrderDetailItem[] = data?.details ?? []
  
  const producerLat = order?.producer?.a_latitude ?? 0
  const producerLng = order?.producer?.a_longitude ?? 0
  const buyerLat = order?.b_latitude ?? 0
  const buyerLng = order?.b_longitude ?? 0

  const subtotal = items.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0)
  const transportFee = order?.transportFee ?? 0
  const tax = subtotal * 0.08
  const total = subtotal + transportFee + tax

  

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-gray-500 dark:text-gray-400 mt-2">Loading checkout...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950 items-center justify-center px-6">
        <Text className="text-red-600 dark:text-red-400">Failed to load order details.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-neutral-950">
      <ScrollView 
      contentContainerStyle={{ paddingBottom: 140 }}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  nestedScrollEnabled
       >
        {/* Header */}
        <View className="px-5 pt-4 pb-5 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Order #{orderId.slice(0, 8)}
          </Text>
        </View>

        {/* Delivery Address */}
        <View className="mt-3 px-5 py-5 bg-white dark:bg-neutral-900 border-y border-gray-100 dark:border-neutral-800">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
             Delivery Address
          </Text>
          <TextInput
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            placeholder="Enter your full delivery address"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
            className="bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700"
          />
          <TouchableOpacity
            onPress={() => setShowMap(v => !v)}
            className="mt-3 flex-row items-center"
          >
            <Text className="text-sm text-primary font-medium">
              {showMap ? ' Hide Map' : ' View Route Map'}
            </Text>
          </TouchableOpacity>
          
          {order?.producer?.a_address && (
            <View className="mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Shipping from: {order.producer.a_address}
              </Text>
            </View>
          )}
        </View>

        {/* Map */}
        {showMap && (
          <View className="mx-4 my-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800" style={{ height: 256 }}>
            <MapView
              style={{ width: '100%', height: '100%' }}
              initialRegion={{
                latitude: producerLat || 36.7538,
                longitude: producerLng || 3.0588,
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
              }}
              onPress={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate
                setSelectedLocation({ latitude, longitude })
               
              }}
            >
              <Marker 
                coordinate={{ latitude: producerLat || 36.7538, longitude: producerLng || 3.0588 }} 
                title="Producer" 
                pinColor="green"
                description={order?.producer?.a_address || 'Producer location'} 
              />
              {selectedLocation && (
                <Marker 
                  coordinate={selectedLocation} 
                  title="Delivery Location" 
                  pinColor="red"
                  description={deliveryAddress || 'Your selected location'}
                  draggable
                  onDragEnd={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate
                    setSelectedLocation({ latitude, longitude })
                    setDeliveryAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
                  }}
                />
              )}
              {!selectedLocation && (buyerLat !== 0 && buyerLng !== 0) && (
                <Marker 
                  coordinate={{ latitude: buyerLat, longitude: buyerLng }} 
                  title="Delivery Location" 
                  description={deliveryAddress || order?.b_address || 'Buyer location'}
                />
              )}
            </MapView>
          </View>
        )}
        
        {/* Map Instructions */}
        {showMap && (
          <View className="mx-4 mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Text className="text-sm text-blue-700 dark:text-blue-300 text-center">
               Tap on the map to select your delivery location. You can also drag the marker to adjust.
            </Text>
          </View>
        )}

        {/* Order Items */}
        <View className="mt-3 px-5 py-5 bg-white dark:bg-neutral-900 border-y border-gray-100 dark:border-neutral-800">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
             Order Items ({items.length})
          </Text>
          {items.map((item, idx) => (
            <View 
              key={item.id}
              className={`bg-gray-50 dark:bg-neutral-800 rounded-2xl p-4 flex-row items-center ${idx > 0 ? 'mt-3' : ''}`}
            >
              {/* Product Icon/Image */}
              <View className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 items-center justify-center">
                {item.product?.images?.[0]?.url ? (
                  <Image 
                    source={{ uri: `${config.baseUrl}${item.product.images[0].url}` }}
                    style={{ width: 64, height: 64, borderRadius: 16 }}
                  />
                ) : (
                  <Text style={{ fontSize: 32 }}>📦</Text>
                )}
              </View>

              {/* Product Details */}
              <View className="flex-1 ml-3">
                <Text className="text-right text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {item.product?.name || 'Product'}
                </Text>
                <View className="flex-row items-center justify-end gap-2">
                  {/* Quantity Badge */}
                  <View className="bg-gray-200 dark:bg-neutral-700 px-3 py-1 rounded-full flex-row items-center">
                  
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                      {item.quantity}و 
                    </Text>   
                  </View>
                  
                  {/* Price Badge */}
                  <View className="bg-cyan-100 dark:bg-cyan-900/30 px-3 py-1 rounded-full flex-row items-center">
                    <Text style={{ fontSize: 14 }}>DZD</Text>
                    <Text className="text-sm font-bold text-cyan-600 dark:text-cyan-400 ml-1">
                      {((item.quantity ?? 0) * (item.price ?? 0)).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Delete Button */}
              <TouchableOpacity 
                className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 items-center justify-center ml-3"
                onPress={() => handleRemoveItem(item)}
                disabled={removeItemMutation.isPending}
              >
                <Text style={{ fontSize: 20 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View className="mt-3 px-5 py-5 bg-white dark:bg-neutral-900 border-y border-gray-100 dark:border-neutral-800">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💳 Payment Method
          </Text>
          
          <TouchableOpacity
            onPress={() => setSelectedPayment('card')}
            className={`flex-row items-center p-4 rounded-xl mb-3 border-2 ${
              selectedPayment === 'card' 
                ? 'border-primary bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
            }`}
          >
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              selectedPayment === 'card' 
                ? 'border-primary bg-primary' 
                : 'border-gray-300 dark:border-neutral-600'
            }`}>
              {selectedPayment === 'card' && (
                <Text className="text-white text-xs">✓</Text>
              )}
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                Credit Card
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Visa, Mastercard, Amex
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedPayment('cash')}
            className={`flex-row items-center p-4 rounded-xl border-2 ${
              selectedPayment === 'cash' 
                ? 'border-primary bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
            }`}
          >
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              selectedPayment === 'cash' 
                ? 'border-primary bg-primary' 
                : 'border-gray-300 dark:border-neutral-600'
            }`}>
              {selectedPayment === 'cash' && (
                <Text className="text-white text-xs">✓</Text>
              )}
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                Cash on Delivery
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Pay when you receive
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View className="mt-3 px-5 py-5 bg-white dark:bg-neutral-900 border-y border-gray-100 dark:border-neutral-800">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💰 Order Summary
          </Text>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm text-gray-600 dark:text-gray-400">Subtotal</Text>
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              ${subtotal.toFixed(2)}
            </Text>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm text-gray-600 dark:text-gray-400">🚚 Transport Fee</Text>
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              ${transportFee.toFixed(2)}
            </Text>
          </View>
          
          <View className="flex-row justify-between mb-4">
            <Text className="text-sm text-gray-600 dark:text-gray-400">Tax (8%)</Text>
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              ${tax.toFixed(2)}
            </Text>
          </View>
          
          <View className="flex-row justify-between pt-4 border-t-2 border-gray-200 dark:border-neutral-700">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">Total</Text>
            <Text className="text-xl font-bold text-primary">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Button */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 px-5 py-5 border-t border-gray-200 dark:border-neutral-800"
        style={{ 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            if (!selectedLocation) {
              Alert.alert('Error', 'Please select a delivery location on the map')
              return
            }
            try {
              await mySubmitOrder(orderId, {
                longitude: selectedLocation.longitude,
                latitude: selectedLocation.latitude,
                address: deliveryAddress,
                cityId: cityId || 'default-city',
              })
              Alert.alert('Order Placed Successfully!', `Your order #${orderId.slice(0, 8)} has been submitted.`, [
                { text: 'OK', onPress: () => router.back() }
              ])
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to submit order')
            }
          }}
          className="py-4 rounded-xl flex-row items-center justify-center bg-primary"
        >
          <Text className="text-white text-base font-semibold mr-2">
            Place Order • ${total.toFixed(2)}
          </Text>
          <Text className="text-white text-lg">→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}