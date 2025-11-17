import { config } from '@/config';
import { images } from '@/constants/imports';
import { Order } from '@/type';
import { useActionSheet } from '@expo/react-native-action-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Minus, Plus, X } from "lucide-react-native";
import { useState } from "react";

import { Image, ImageSourcePropType, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/lib/i18n';

// Status color mapping
const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Preparing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "On the way": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

// Order Card Component
const OrderCard = ({ order, cart, image, refetch }: { order: any, cart: any, image: {url: string, id: number,} | null, refetch: () => void }) => {
  const [quantity, setQuantity] = useState<number>(order.quantity || 1);
  const colorScheme = useColorScheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation();

  //console.log('0000000000000000000000000',image);

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, (prev || 1) + change));
  };

  const calculateTotal = () => {
    return `${(quantity * parseFloat(order.product.price || '0')).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(getDateLocale(), { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const openSheet = () => {
    const options = ['Edit', 'Delete', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) console.log('Edit pressed');
        if (buttonIndex === 1) console.log('Delete pressed');
      }
    );
  };
  const deleteOrder = async (item_id: any) => {
    const token = await AsyncStorage.getItem('auth_token');
    try {
      if (!cart.id) {
        console.error('Cart ID is undefined');
        return;
      }
       const cartId = cart.id;
      const itemId = item_id || order.id;
      
      const response = await fetch(`${config.baseUrl}/api/carts/${cartId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('Order deleted successfully');

         if (refetch) await refetch(); 
      } else {
        console.error('Failed to delete order',response.status);
        // Optionally, show an error message
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      // Optionally, show an error message
    }
  }

    

  return (
    <View className="mb-2">
      <TouchableOpacity className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700">
        <View>
            <TouchableOpacity onPress={() => deleteOrder(order.id)}  className="flex-row items-center justify-end">
                <X size={18} color="#9CA3AF" />
            </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          {/* Product Image */}
          <Image
            source={{uri: image?.url}}
            className="w-24 h-24 rounded-xl mr-4"
            resizeMode="cover"
          />

          {/* Order Details */}
          <View className="flex-1">
            {/* Order ID */}
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {order.product.name}
            </Text>

            {/* Date and Status Row */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-500 dark:text-neutral-400">
                {formatDate(order.date)}
              </Text>
              
              <View className={`px-3 py-1 rounded-full ${statusColors[order.status]}`}>
               
              </View>
            </View>

            {/* Quantity Controls */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => updateQuantity(-1)}
                  className="w-8 h-8 bg-gray-100 dark:bg-neutral-700 rounded-full items-center justify-center mr-3"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} color={quantity <= 1 ? "#9CA3AF" : "#6B7280"} />
                </TouchableOpacity>
                
                <Text className="text-base font-semibold text-gray-900 dark:text-white min-w-[24px] text-center">
                  {quantity}
                </Text>
                
                <TouchableOpacity
                  onPress={() => updateQuantity(1)}
                  className="w-8 h-8 bg-blue-50 dark:bg-primary/40 rounded-full items-center justify-center ml-3"
                >
                  <Plus size={16} color="#ff6370" />
                </TouchableOpacity>
              </View>

              {/* Price */}
              <View className="items-end">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  {calculateTotal()}
                </Text>
                {quantity > 1 && (
                  <Text className="text-xs text-gray-500 dark:text-neutral-400">
                    ${order.product.price} {t('common.each')}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;