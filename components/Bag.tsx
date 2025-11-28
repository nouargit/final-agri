import { config } from '@/config';
import { getDateLocale } from '@/lib/i18n';
import { router } from 'expo-router';
import { Calendar, ChevronRight, Package } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
  },
  rejected: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-800',
  },
  confirmed: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800',
  },
  on_delivery: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
  },
  preparing: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-800',
  },
  'on the way': {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
  },
  delivered: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-800',
  },
  cancelled: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-800',
  },
  'in-transit': {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
  },
  processing: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-800',
  },
  active: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800',
  },
};

interface CartItem {
  id: number;
  product: {
    images: any;
    id: number;
    name: string;
    image_url?: string;
  };
  quantity: number;
  price: number;
}

interface BagProps {
  bag: {
    id: number;
    shop_id: number;
    user_id: number;
    total: number;
    status: string;
    created_at: string;
    updated_at: string;
    items?: CartItem[];
  };
  shop: {
    id: number;
    name: string;
    logo_url?: string;
  };
  type: 'bags' | 'orders';
  onSubmitCart?: () => void;
  onRemoveItem?: (productId: number) => void;
}

const Bag = ({ bag, shop, type, onSubmitCart, onRemoveItem }: BagProps) => {
  const { t } = useTranslation();
  const statusKey = bag.status.toLowerCase();
  const statusStyle = statusColors[statusKey] || statusColors.active;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('common.today');
    if (diffDays === 1) return t('common.yesterday');
    if (diffDays < 7) return t('common.daysAgo', { count: diffDays });

    return date.toLocaleDateString(getDateLocale(), {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatPrice = (price: number) => `$${price}`;

  const itemsCount = bag.items?.length || 0;
  const totalQuantity = bag.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        router.navigate(`/order_items?id=${bag.id}`)
      }}
      className="mb-5 rounded-3xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-md shadow-gray-300/40 dark:shadow-black/40 active:scale-[0.98]"
    >
      <View className="p-5">
        {/* Header */}
        <View className="flex-row items-start mb-5">
          {/* Logo */}
          <View className="w-16 h-16 rounded-full bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 items-center justify-center mr-4 overflow-hidden">
            {shop.logo_url ? (
               <Image source={{ uri: `${config.baseUrl}${shop.logo_url}` }} style={{ height: '100%', width: '100%' }}  resizeMode="cover" />
            ) : (
              <Package size={30} color="#22680C" strokeWidth={1.5} />
            )}
          </View>

          {/* Shop Info */}
          <View className="flex-1">
            <Text
              className="font-gilroy-bold text-gray-900 dark:text-white text-lg mb-1"
              numberOfLines={1}
            >
              {shop.name}
            </Text>

            <View className="flex-row items-center mb-2">
              <Calendar size={14} color="#22680C" strokeWidth={2} />
              <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1.5">
                {formatDate(bag.created_at)}
              </Text>
            </View>

            <View
              className={`self-start px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}
            >
              <Text className={`text-xs font-bold capitalize ${statusStyle.text}`}>
                {bag.status.replace('_', ' ')}
              </Text>
            </View>
          </View>

          {/* Total */}
          <View className="ml-3 rounded-2xl py-2">
            <Text className="font-gilroy-bold text-green-600 dark:text-green-400 text-lg">{formatPrice(bag.total)}</Text>
          </View>
        </View>

        {/* Items */}
        {bag.items && bag.items.length > 0 ? (
          <View className="mt-1">
            <View className="flex-row items-center justify-between mb-3">
              <View className="bg-gray-100 dark:bg-neutral-700 rounded-full px-3 py-1.5">
                <Text className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                  {itemsCount} {itemsCount === 1 ? t('common.item') : t('common.items')} • {totalQuantity} {t('common.total')}
                </Text>
              </View>
              <ChevronRight size={20} color="#22680C" strokeWidth={2} />
            </View>

            <View className="flex-row flex-wrap gap-2 rounded-2xl bg-gray-50 dark:bg-neutral-700/40 p-3 border border-gray-100 dark:border-neutral-600">
              {bag.items.slice(0, 4).map((item) => (
                
                <View key={item.id} className="relative w-16 h-16 rounded-xl overflow-hidden">
                  {item.product.images?.[0] ? (
                    <Image
                      source={ item.product.images[0] }
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full bg-gray-100 dark:bg-neutral-600 items-center justify-center">
                      <Package size={24} color="#FF6F61" strokeWidth={1.5} />
                    </View>
                  )}

                  {item.quantity > 1 && (
                    <View className="absolute -top-1.5 -right-1.5 bg-primary rounded-full w-6 h-6 items-center justify-center border-2 border-white dark:border-neutral-800">
                      <Text className="text-white text-xs font-bold">{item.quantity}</Text>
                    </View>
                  )}
                </View>
              ))}

              {bag.items.length > 4 && (
                <View className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-neutral-600 items-center justify-center border border-gray-300 dark:border-neutral-500">
                  <Text className="text-gray-600 dark:text-gray-300 font-bold text-sm">
                    +{bag.items.length - 4}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View className="rounded-2xl bg-gray-50 dark:bg-neutral-700/40 p-4 border border-gray-100 dark:border-neutral-600">
            <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">
              {type === 'orders' ? t('bag.noItemsOrder') : t('bag.noItemsCart')}
            </Text>
          </View>
        )}

        {type === 'bags' && (
          <View className="mt-4 flex-row justify-end gap-3">
            {onSubmitCart && (
              <TouchableOpacity
                onPress={onSubmitCart}
                className="px-4 py-2 rounded-full bg-primary"
              >
                <Text className="text-white font-semibold">{t('cart.submitCart') || 'Submit Cart'}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Bottom accent */}
      <View className={`h-1 ${statusStyle.bg.replace('100', '200').replace('30', '40')}`} />
    </TouchableOpacity>
  );
};

export default Bag;
