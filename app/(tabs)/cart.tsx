// app/(tabs)/shop.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ShoppingCart, Package, Clock, CheckCircle, XCircle } from 'lucide-react-native';

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState('carts');

  const cartItems = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 89.99,
      quantity: 1,
      image: '🎧',
      color: 'Black'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 249.99,
      quantity: 2,
      image: '⌚',
      color: 'Silver'
    },
    {
      id: 3,
      name: 'Phone Case',
      price: 19.99,
      quantity: 1,
      image: '📱',
      color: 'Blue'
    }
  ];

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-11-20',
      status: 'delivered',
      total: 156.99,
      items: 3,
      tracking: 'TRK123456'
    },
    {
      id: 'ORD-002',
      date: '2024-11-18',
      status: 'in-transit',
      total: 89.99,
      items: 1,
      tracking: 'TRK123457'
    },
    {
      id: 'ORD-003',
      date: '2024-11-15',
      status: 'processing',
      total: 320.50,
      items: 5,
      tracking: 'TRK123458'
    }
  ];

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100';
      case 'in-transit':
        return 'bg-blue-100';
      case 'processing':
        return 'bg-yellow-100';
      case 'cancelled':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusTextClasses = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-700';
      case 'in-transit':
        return 'text-blue-700';
      case 'processing':
        return 'text-yellow-700';
      case 'cancelled':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} color="#15803d" />;
      case 'in-transit':
        return <Package size={16} color="#1d4ed8" />;
      case 'processing':
        return <Clock size={16} color="#a16207" />;
      case 'cancelled':
        return <XCircle size={16} color="#b91c1c" />;
      default:
        return null;
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-6 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900 mb-4">My Orders</Text>
        
        {/* Tabs */}
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => setActiveTab('carts')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'carts' ? 'bg-primary' : 'bg-gray-100'
            }`}
          >
            <View className="flex-row items-center justify-center space-x-2">
              <ShoppingCart
                size={20}
                color={activeTab === 'carts' ? '#ffffff' : '#6b7280'}
              />
              <Text
                className={`font-semibold ${
                  activeTab === 'carts' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Cart ({cartItems.length})
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('orders')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'orders' ? 'bg-primary' : 'bg-gray-100'
            }`}
          >
            <View className="flex-row items-center justify-center space-x-2">
              <Package
                size={20}
                color={activeTab === 'orders' ? '#ffffff' : '#6b7280'}
              />
              <Text
                className={`font-semibold ${
                  activeTab === 'orders' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Orders ({orders.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {activeTab === 'carts' ? (
          <View className="p-4">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row space-x-4">
                  <View className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center">
                    <Text className="text-4xl">{item.image}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-gray-500 mb-2">
                      Color: {item.color}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-xl font-bold text-primary">
                        ${item.price}
                      </Text>
                      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-1 space-x-3">
                        <TouchableOpacity>
                          <Text className="text-lg font-bold text-gray-600">−</Text>
                        </TouchableOpacity>
                        <Text className="text-base font-semibold text-gray-900">
                          {item.quantity}
                        </Text>
                        <TouchableOpacity>
                          <Text className="text-lg font-bold text-gray-600">+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Cart Summary */}
            <View className="bg-white rounded-xl p-4 mt-2 shadow-sm border border-gray-100">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-semibold text-gray-900">
                  ${cartTotal.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Shipping</Text>
                <Text className="font-semibold text-gray-900">$5.00</Text>
              </View>
              <View className="border-t border-gray-200 pt-3 flex-row justify-between mb-4">
                <Text className="text-lg font-bold text-gray-900">Total</Text>
                <Text className="text-lg font-bold text-primary">
                  ${(cartTotal + 5).toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity className="bg-primary py-4 rounded-lg">
                <Text className="text-white text-center font-bold text-base">
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="p-4">
            {/* Orders List */}
            {orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-lg font-bold text-gray-900 mb-1">
                      {order.id}
                    </Text>
                    <Text className="text-sm text-gray-500">{order.date}</Text>
                  </View>
                  <View className={`flex-row items-center px-3 py-1 rounded-full ${getStatusClasses(order.status)} space-x-1`}>
                    {getStatusIcon(order.status)}
                    <Text className={`text-xs font-semibold capitalize ${getStatusTextClasses(order.status)}`}>
                      {order.status.replace('-', ' ')}
                    </Text>
                  </View>
                </View>

                <View className="border-t border-gray-100 pt-3">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Items</Text>
                    <Text className="font-medium text-gray-900">
                      {order.items} items
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Total Amount</Text>
                    <Text className="font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Tracking</Text>
                    <Text className="font-medium text-primary">
                      {order.tracking}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity className="mt-4 py-2 border border-primary rounded-lg">
                  <Text className="text-primary text-center font-semibold">
                    View Details
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}