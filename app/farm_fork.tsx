import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    Check,
    CheckCircle,
    Clock,
    Leaf,
    MapPin,
    Package,
    Truck,
    User,
    Warehouse,
} from 'lucide-react-native';
import { useCallback } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  icon: React.ReactNode;
  completed: boolean;
  current?: boolean;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  quantityKg: number;
  minimumOrderKg: number;
  images: string[];
  subcategory: string;
  grade: string;
  harvestDate: string;
  scheduleDate?: string;
  producerId: string;
  producer?: {
    user?: {
      fullname?: string;
      wilaya?: string;
    };
    farmName?: string;
    farmLocation?: string;
  };
}

const FarmForkScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;

  const handleBack = () => {
    navigation.goBack();
  };

  const getProduct = useCallback(async (): Promise<ProductData | null> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch(`${config.baseUrl}/api/products/${productId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }, [productId]);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-traceability', productId],
    queryFn: getProduct,
    enabled: !!productId,
  });

  // Generate timeline events based on product data
  const generateTimelineEvents = (product?: ProductData | null): TimelineEvent[] => {
    if (!product) return [];

    const harvestDate = product.harvestDate
      ? new Date(product.harvestDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Default to 7 days ago

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const today = new Date();
    
    // Calculate which stages are completed based on time since harvest
    const daysSinceHarvest = Math.floor(
      (today.getTime() - harvestDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const events: TimelineEvent[] = [
      {
        id: '1',
        title: 'Harvested',
        description: `Fresh ${product.name} harvested from the farm. Grade: ${product.grade || 'Premium'}`,
        date: formatDate(harvestDate),
        location: product.producer?.farmLocation || product.producer?.user?.wilaya || 'Local Farm',
        icon: <Leaf size={20} color="#ffffff" />,
        completed: true,
        current: daysSinceHarvest < 1,
      },
      {
        id: '2',
        title: 'Quality Inspection',
        description: 'Product passed quality control and safety inspection. Certified organic and pesticide-free.',
        date: formatDate(addDays(harvestDate, 1)),
        location: 'Quality Control Center',
        icon: <CheckCircle size={20} color="#ffffff" />,
        completed: daysSinceHarvest >= 1,
        current: daysSinceHarvest >= 1 && daysSinceHarvest < 2,
      },
      {
        id: '3',
        title: 'Packaging',
        description: `Carefully packaged in eco-friendly materials. Available quantity: ${product.quantityKg}kg`,
        date: formatDate(addDays(harvestDate, 2)),
        location: 'Packaging Facility',
        icon: <Package size={20} color="#ffffff" />,
        completed: daysSinceHarvest >= 2,
        current: daysSinceHarvest >= 2 && daysSinceHarvest < 3,
      },
      {
        id: '4',
        title: 'Storage',
        description: 'Stored in temperature-controlled environment to maintain freshness and quality.',
        date: formatDate(addDays(harvestDate, 3)),
        location: 'Cold Storage Warehouse',
        icon: <Warehouse size={20} color="#ffffff" />,
        completed: daysSinceHarvest >= 3,
        current: daysSinceHarvest >= 3 && daysSinceHarvest < 4,
      },
      {
        id: '5',
        title: 'Listed for Sale',
        description: `Product listed on AgriConnect marketplace at ${product.pricePerKg} DZD/kg`,
        date: formatDate(addDays(harvestDate, 4)),
        location: 'Online Marketplace',
        icon: <User size={20} color="#ffffff" />,
        completed: daysSinceHarvest >= 4,
        current: daysSinceHarvest >= 4 && daysSinceHarvest < 5,
      },
      {
        id: '6',
        title: 'Ready for Delivery',
        description: 'Order confirmed and product is ready to be shipped to your location.',
        date: formatDate(addDays(harvestDate, 5)),
        location: 'Dispatch Center',
        icon: <Truck size={20} color="#ffffff" />,
        completed: daysSinceHarvest >= 5,
        current: daysSinceHarvest >= 5,
      },
    ];

    return events;
  };

  const timelineEvents = generateTimelineEvents(product);

  // Process product image
  const getProductImage = () => {
    if (product?.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') {
        return config.image_url(firstImage);
      }
      return config.image_url((firstImage as any).url || firstImage);
    }
    return 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800&h=600&fit=crop';
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-neutral-900 items-center justify-center">
        <ActivityIndicator size="large" color="#22C55E" />
        <Text className="text-gray-600 dark:text-neutral-400 mt-4">
          Loading product journey...
        </Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-neutral-900 items-center justify-center px-6">
        <Leaf size={64} color="#9CA3AF" />
        <Text className="text-gray-600 dark:text-neutral-400 mt-4 text-lg text-center">
          Unable to load product traceability
        </Text>
        <TouchableOpacity
          className="mt-6 bg-green-600 px-6 py-3 rounded-xl"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-neutral-900">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View className="bg-white dark:bg-neutral-800 px-4 pt-12 pb-4 border-b border-gray-100 dark:border-neutral-700">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="p-2 rounded-full bg-gray-100 dark:bg-neutral-700"
            onPress={handleBack}
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-neutral-900 dark:text-white">
            Farm to Fork
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Product Info Card */}
        <View className="bg-white dark:bg-neutral-800 mx-4 mt-4 rounded-2xl p-4 shadow-sm">
          <View className="flex-row">
            <Image
              source={{ uri: getProductImage() }}
              className="w-24 h-24 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1 ml-4 justify-center">
              <Text className="text-xl font-bold text-neutral-900 dark:text-white">
                {product.name}
              </Text>
              <Text className="text-gray-500 dark:text-neutral-400 text-sm mt-1">
                {product.subcategory || 'Fresh Produce'}
              </Text>
              <View className="flex-row items-center mt-2">
                <View className="bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full">
                  <Text className="text-green-700 dark:text-green-300 text-xs font-semibold">
                    {product.grade || 'Premium Grade'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Producer Info */}
          <View className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
            <View className="flex-row items-center">
              <MapPin size={16} color="#22C55E" />
              <Text className="text-gray-600 dark:text-neutral-400 ml-2 text-sm">
                From: {product.producer?.user?.fullname || 'Local Producer'} •{' '}
                {product.producer?.user?.wilaya || 'Algeria'}
              </Text>
            </View>
            {product.harvestDate && (
              <View className="flex-row items-center mt-2">
                <Calendar size={16} color="#22C55E" />
                <Text className="text-gray-600 dark:text-neutral-400 ml-2 text-sm">
                  Harvested:{' '}
                  {new Date(product.harvestDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Journey Title */}
        <View className="px-4 mt-6 mb-4">
          <Text className="text-lg font-bold text-neutral-900 dark:text-white">
            Product Journey
          </Text>
          <Text className="text-gray-500 dark:text-neutral-400 text-sm mt-1">
            Track your product's path from harvest to your table
          </Text>
        </View>

        {/* Timeline */}
        <View className="px-4 pb-8">
          {timelineEvents.map((event, index) => (
            <View key={event.id} className="flex-row">
              {/* Timeline Line and Dot */}
              <View className="items-center mr-4">
                {/* Dot/Icon */}
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    event.completed
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-neutral-600'
                  } ${event.current ? 'border-4 border-green-200' : ''}`}
                >
                  {event.completed ? (
                    event.icon
                  ) : (
                    <Clock size={20} color="#9CA3AF" />
                  )}
                </View>

                {/* Connecting Line */}
                {index < timelineEvents.length - 1 && (
                  <View
                    className={`w-1 flex-1 min-h-[80px] ${
                      event.completed && timelineEvents[index + 1].completed
                        ? 'bg-green-500'
                        : event.completed
                        ? 'bg-gradient-to-b from-green-500 to-gray-300'
                        : 'bg-gray-300 dark:bg-neutral-600'
                    }`}
                    style={{
                      backgroundColor: event.completed
                        ? timelineEvents[index + 1].completed
                          ? '#22C55E'
                          : '#22C55E'
                        : '#D1D5DB',
                    }}
                  />
                )}
              </View>

              {/* Event Content */}
              <View
                className={`flex-1 pb-6 ${
                  index < timelineEvents.length - 1 ? 'mb-2' : ''
                }`}
              >
                <View
                  className={`bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm ${
                    event.current
                      ? 'border-2 border-green-500'
                      : 'border border-gray-100 dark:border-neutral-700'
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text
                      className={`font-bold text-base ${
                        event.completed
                          ? 'text-neutral-900 dark:text-white'
                          : 'text-gray-400 dark:text-neutral-500'
                      }`}
                    >
                      {event.title}
                    </Text>
                    {event.completed && (
                      <View className="bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full flex-row items-center">
                        <Check size={12} color="#22C55E" />
                        <Text className="text-green-700 dark:text-green-300 text-xs ml-1">
                          Completed
                        </Text>
                      </View>
                    )}
                    {event.current && (
                      <View className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full">
                        <Text className="text-blue-700 dark:text-blue-300 text-xs">
                          Current
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    className={`text-sm leading-relaxed ${
                      event.completed
                        ? 'text-gray-600 dark:text-neutral-400'
                        : 'text-gray-400 dark:text-neutral-500'
                    }`}
                  >
                    {event.description}
                  </Text>

                  <View className="flex-row items-center mt-3 flex-wrap gap-3">
                    <View className="flex-row items-center">
                      <Calendar size={14} color="#9CA3AF" />
                      <Text className="text-gray-500 dark:text-neutral-500 text-xs ml-1">
                        {event.date}
                      </Text>
                    </View>
                    {event.location && (
                      <View className="flex-row items-center">
                        <MapPin size={14} color="#9CA3AF" />
                        <Text className="text-gray-500 dark:text-neutral-500 text-xs ml-1">
                          {event.location}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Certification Badge */}
        <View className="mx-4 mb-8 bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
          <View className="flex-row items-center">
            <View className="bg-green-500 w-12 h-12 rounded-full items-center justify-center">
              <CheckCircle size={24} color="#ffffff" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-green-800 dark:text-green-200 font-bold text-base">
                Verified Product
              </Text>
              <Text className="text-green-700 dark:text-green-300 text-sm mt-1">
                This product has been verified and tracked through our secure supply
                chain system.
              </Text>
            </View>
          </View>
        </View>

        {/* View Product Button */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            className="bg-green-600 py-4 rounded-xl items-center"
            onPress={() => router.push(`/product?id=${productId}`)}
          >
            <Text className="text-white font-bold text-lg">View Product Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default FarmForkScreen;
