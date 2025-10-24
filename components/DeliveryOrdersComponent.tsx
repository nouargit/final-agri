import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface Shop {
  id: string;
  name: string;
  image: any;
  address: string;
  phoneNumber: string;
}

interface DeliveryLocation {
  address: string;
  customerName: string;
  phoneNumber: string;
  notes?: string;
}

interface DeliveryOrder {
  id: string;
  shop: Shop;
  deliveryLocation: DeliveryLocation;
  orderDate: string;
  deliveryTime: string;
  totalAmount: string;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  items: number;
  distance: string;
  estimatedTime: string;
}

interface DeliveryOrdersComponentProps {
  orders: DeliveryOrder[];
  onOrderPress?: (order: DeliveryOrder) => void;
  onNavigatePress?: (order: DeliveryOrder) => void;
}

const statusColors = {
  assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-white",
  picked_up: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  in_transit: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const DeliveryOrdersComponent: React.FC<DeliveryOrdersComponentProps> = ({ 
  orders, 
  onOrderPress, 
  onNavigatePress 
}) => {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Delivery Orders
        </Text>
        
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            onPress={() => onOrderPress?.(order)}
            className="bg-white dark:bg-neutral-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            {/* Order Header */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                Delivery #{order.id}
              </Text>
              <View className={`px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                <Text className="text-xs font-medium capitalize">
                  {order.status.replace('_', ' ')}
                </Text>
              </View>
            </View>

            {/* Shop Info */}
            <View className="flex-row items-center mb-4 p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <Image
                source={order.shop.image}
                className="w-12 h-12 rounded-full mr-3"
                resizeMode="cover"
              />
              
              <View className="flex-1">
                <View className="flex-row items-center">
                  <IconSymbol name="store" size={16} color="#6B7280" />
                  <Text className="text-base font-medium text-gray-900 dark:text-white ml-2">
                    {order.shop.name}
                  </Text>
                </View>
                
                <View className="flex-row items-center mt-1">
                  <IconSymbol name="location" size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {order.shop.address}
                  </Text>
                </View>
              </View>
            </View>

            {/* Delivery Location */}
            <View className="mb-4 p-3 bg-primary/20 dark:bg-primary/20 rounded-lg">
              <View className="flex-row items-center mb-2">
                <IconSymbol name="location" size={16} color="#ff6370" />
                <Text className="text-base font-medium text-black dark:text-white ml-2">
                  Delivery to: {order.deliveryLocation.customerName}
                </Text>
              </View>
              
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {order.deliveryLocation.address}
              </Text>
              
              <View className="flex-row items-center">
                <IconSymbol name="phone" size={14} color="#6B7280" />
                <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {order.deliveryLocation.phoneNumber}
                </Text>
              </View>
              
              {order.deliveryLocation.notes && (
                <Text className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
                  Note: {order.deliveryLocation.notes}
                </Text>
              )}
            </View>

            {/* Order Details & Actions */}
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <IconSymbol name="bag" size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {order.items} items • {order.distance}
                  </Text>
                </View>
                
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    ETA: {order.estimatedTime}
                  </Text>
                  <Text className="text-lg font-bold text-gray-900 dark:text-white ml-3">
                    {order.totalAmount}
                  </Text>
                </View>
              </View>
              
              {/* Navigate Button */}
              <TouchableOpacity
                onPress={() => onNavigatePress?.(order)}
                className="bg-primary px-4 py-2 rounded-lg ml-3"
              >
                <View className="flex-row items-center">
                  <IconSymbol name="location" size={16} color="white" />
                  <Text className="text-white font-medium ml-1">Navigate</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default DeliveryOrdersComponent;