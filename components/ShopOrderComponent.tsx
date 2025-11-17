import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface Customer {
  id: string;
  name: string;
  profilePicture: any;
  phoneNumber: string;
  acceptedOrders: number;
  returnedOrders: number;
}

interface Order {
  id: string;
  user_id:string;
  order_number: number;
  shop_id:string;
  customer: Customer;
  orderDate: string;
  totalAmount: string;
  delevery_fee:number;
  subtotal:number;

  location:string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered';
  created_at: string;
  items: number;
}

interface ShopOrderComponentProps {
  orders: Order[];
  onOrderPress?: (order: Order) => void;
  onCustomerPress?: (customer: Customer) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  preparing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  ready: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  delivered: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

const ShopOrderComponent: React.FC<ShopOrderComponentProps> = ({ 
  orders, 
  onOrderPress, 
  onCustomerPress 
}) => {
  if(!orders || orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-lg text-gray-500 dark:text-gray-400">
          No orders found
        </Text>
      </View>
    )
  }
  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="p-4">
        <Text className="text-2xl font-gilroy-bold text-gray-900 dark:text-white mb-6">
          Shop Orders
        </Text>
        
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            onPress={() => router.push(`/shopOrdersManagement?order_id=${order.id}`)}
            className="bg-white dark:bg-neutral-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            {/* Order Header */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-gilroy-semibold text-gray-900 dark:text-white">
                Order #{order.id}
              </Text>
              <View className={`px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                <Text className="text-xs font-gilroy-medium capitalize">
                  {order.status}
                </Text>
              </View>
            </View>

            {/* Customer Info */}
            {order.customer && (
              <TouchableOpacity
                onPress={() => onCustomerPress?.(order.customer)}
                className="flex-row items-center mb-4"
              >
                {/* Profile Picture */}
                
                
                <View className="flex-1">
                  {/* Customer Name */}
                  <Text className="text-base font-gilroy-medium text-gray-900 dark:text-white">
                    {order.customer?.name || 'Customer'}
                  </Text>
                  
                  {/* Phone Number */}
                  <View className="flex-row items-center mt-1">
                    <IconSymbol name="phone" size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {order.customer?.phoneNumber || 'No phone number'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            
            {!order.customer && (
              <View className="mb-4">
                <Text className="text-base font-gilroy-medium text-gray-900 dark:text-white">
                  Customer information not available
                </Text>
              </View>
            )}

            {/* Customer Stats Tags */}
            {order.customer && (
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row space-x-2">
                  {/* Accepted Orders Tag */}
                  <View className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    <Text className="text-xs font-gilroy-medium text-green-800 dark:text-green-300">
                      ✓ {order.customer?.acceptedOrders || 0} Accepted
                    </Text>
                  </View>
                  
                  {/* Returned Orders Tag */}
                  {order.customer?.returnedOrders > 0 && (
                    <View className="bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
                      <Text className="text-xs font-gilroy-medium text-red-800 dark:text-red-300">
                        ↩ {order.customer?.returnedOrders || 0} Returned
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Order Details */}
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <IconSymbol name="bag" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {order.items? order.items : 0} items
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-600 dark:text-gray-400 mr-3">
                  {order.created_at}
                </Text>
                <Text className="text-lg font-gilroy-medium text-gray-900 dark:text-white">
                  {order.subtotal}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ShopOrderComponent;