import { config } from '@/config';
import { useLocationStore } from '@/stors/locationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Award, ChevronLeft, ChevronRight, Clock, Heart, MapPin, Minus, Plus, QrCode, ShoppingCart, Star } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
const { width } = Dimensions.get('window');
 const temp= {
    id:  1,
    shop_id: 1,
    name: "potato" ,
    price: 12.99,
    originalPrice: 15.99,
    rating:  4.8,
    reviews: 124,
    description: 
      "Pommes de terre biologiques fraîches de fermes locales dans la région de Chaouia. Cultivées naturellement sans pesticides chimiques, riches en vitamines et minéraux",
    preparationTime: "15-20 min",
    calories: "580 cal",
    images: [
      "https://images.unsplash.com/photo-1547514701-42782101795e?w=800&h=600&fit=crop", // Mixed fresh vegetables
  "https://images.unsplash.com/photo-1604719312566-4a44d5c36d5f?w=800&h=600&fit=crop", // Colorful bell peppers
  "https://images.unsplash.com/photo-1598170845058-32b9d6a5da03?w=800&h=600&fit=crop", // Fresh tomatoes & greens
  "https://images.unsplash.com/photo-1607305387299-c3e26e305a56?w=800&h=600&fit=crop", // Carrots, broccoli, cauliflower
  "https://images.unsplash.com/photo-1615485290382-1c792f195175?w=800&h=600&fit=crop", // Vibrant vegetable basket
  "https://images.unsplash.com/photo-1596049869095-8e8c13e09c43?w=800&h=600&fit=crop", // Farm-fresh produce close-up
  "https://images.unsplash.com/photo-1619566636858-029ced50d502?w=800&h=600&fit=crop", // Rainbow carrots
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", // Fresh salad ingredients
  "https://images.unsplash.com/photo-1518841124067-47d4c9c49177?w=800&h=600&fit=crop", // Heirloom tomatoes
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop", // Broccoli & greens
  "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800&h=600&fit=crop", // Avocado & veggies
  "https://images.unsplash.com/photo-1604902395341-1257e05d4448?w=800&h=600&fit=crop",
    ],


    allergens: ["vegetarian", "organic"],
  };

  const sellert = {
    name: "Sweet Delights Bakery",
    avatar: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&h=100&fit=crop",
    rating: 4.9,
    reviews: 2840,
    location: "New York, NY",
    memberSince: "2019",
    responseTime: "Within 1 hour",
    verified: true
  };

  const comments = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
      rating: 5,
      date: "2 days ago",
      comment: "Absolutely divine! The molten center was perfectly gooey and the ice cream complemented it beautifully. Will definitely order again!",
      helpful: 24
    },
    {
      id: 2,
      user: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      rating: 5,
      date: "1 week ago",
      comment: "Best chocolate lava cake I've ever had! Rich, decadent, and the portion size is generous. Highly recommend!",
      helpful: 18
    },
    {
      id: 3,
      user: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
      rating: 4,
      date: "2 weeks ago",
      comment: "Really good but a bit too sweet for my taste. The presentation was beautiful and delivery was quick.",
      helpful: 12
    }
  ];

// Helper function to process images from database
const processImages = (images: any) => {
  //console.log('Raw images from API:', images);
  
  // If no images, return fallback
  if (!images) {
    return [
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop"
    ];
  }

  // Handle your database format: array of objects with url property
  if (Array.isArray(images)) {
    const processedImages = images.map(img => img.url).filter(url => url);
   // console.log('Processed images:', processedImages);
    return processedImages;
  }

  // Fallback to default images
  return [
    "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop"
  ];
};
const ProductScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { selectedLocation } = useLocationStore();
  
  // Ensure id is a string, handle array case
  const productId = Array.isArray(id) ? id[0] : id;
  
  const handleBack = () => {
    navigation.goBack();
  };

  const getProducts = useCallback(async () => {
  try {
     const token = await AsyncStorage.getItem('auth_token');
      
     
    const response = await fetch(`${config.baseUrl}/api/products/${productId}`,{
      method:'GET',
      headers:{
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
  const product = await response.json();
  //console.log('Raw API response:', product);

  // Return the actual product data
  return product.data || product;

  } catch (error) {
    
    throw error; // Throw the error instead of returning empty array
  }
  
}, [productId]);

  const {data: productTemp, isLoading, error} = useQuery({
  queryKey: ['products', productId],
  queryFn: getProducts,
   enabled: !!productId, // Only run query when productId is available
});

// Helper function to safely process images
const processImages = (images: any) => {
  if (!images) {
    return [
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop"
    ];
  }

  // If images is a string, try to parse it as JSON
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.map(img => typeof img === 'string' ? img : img.url || img.src || '');
      }
    } catch (e) {
      console.log('Failed to parse images JSON:', e);
      return [images]; // If it's just a single image URL string
    }
  }

  // If images is already an array
  if (Array.isArray(images)) {
    return images.map(img => {
      if (typeof img === 'string') {
        return img;
      }
      // If it's an object, try to extract URL
      return img.url || img.src || img.image || img.path || '';
    }).filter(url => url); // Remove empty URLs
  }

  // If it's an object, try to extract URL
  if (typeof images === 'object') {
    return [images.url || images.src || images.image || images.path || ''].filter(url => url);
  }

  // Fallback to default images
  return [
    "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop"
  ];
};


const product = {
    id: productTemp?.id || '1',
    producerId: productTemp?.producerId || '',
    name: productTemp?.name || 'Product',
    description: productTemp?.description || 'No description provided',
    pricePerKg: productTemp?.pricePerKg ?? 0,
    quantityKg: productTemp?.quantityKg ?? 0,
    minimumOrderKg: productTemp?.minimumOrderKg ?? 1,
    subcategory: productTemp?.subcategory || '',
    grade: productTemp?.grade || '',
    harvestDate: productTemp?.harvestDate || '',
    scheduleDate: productTemp?.scheduleDate || '',
    images: processImages(productTemp?.images),
    rating: 4.8,
    reviews: 124,
    allergens: ["vegetarian", "organic"],
  };

  const seller = {
    name: productTemp?.producer?.user?.fullname || 'Producer',
    avatar: productTemp?.producer?.user?.avatar || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&h=100&fit=crop",
    rating: 4.9,
    reviews: 2840,
    location: productTemp?.producer?.user?.wilaya || 'Algeria',
    memberSince: '2019',
    responseTime: 'Within 1 hour',
    verified: true
  };

  const produceComments = [
  {
    id: 1,
    user: "Amira Bensalah",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
    rating: 5,
    date: "3 days ago",
    comment:
      "The strawberries were super fresh and sweet! Perfect for smoothies. Definitely ordering again.",
    helpful: 21,
  },
  {
    id: 2,
    user: "Youssef Karim",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
    rating: 4,
    date: "1 week ago",
    comment:
      "The tomatoes were very tasty and juicy. One or two were slightly soft, but overall great quality.",
    helpful: 14,
  },
  {
    id: 3,
    user: "Lina Haddad",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Loved the organic cucumbers! Crisp, clean, and perfect for salads. Delivery was quick too.",
    helpful: 10,
  },
];

  const addProductToCart = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const user_data = await AsyncStorage.getItem('user_data');
      const user_id = user_data ? JSON.parse(user_data).id : null;
      //console.log('User ID:', user_id);
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

      // Use Buyer endpoint: submit order with single item and current delivery
      const delivery = selectedLocation ? {
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude,
        address: 'Selected Location',
      } : {
        longitude: 0,
        latitude: 0,
        address: 'Unknown address',
      };

      const buyerRes = await fetch(`${config.baseUrl}${config.buyerOrdersUrl}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ productId: String(product.id), quantityKg: Number(quantity) }],
         
        }),
      });
      if (!buyerRes.ok) {
        const text = await buyerRes.text();
        throw new Error(`Buyer order failed: ${buyerRes.status} - ${text}`);
      }
      await buyerRes.json();

      alert('Order placed successfully!');

    } catch (error) {
      console.error('Add to order error:', error);
      alert(`Failed to add item to order. Please try again.`);
      
    }
  };



  

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };
  console.log("product",product.images[0])

  // Add loading and error states
  /*if (isLoading) {
    return (
      <SafeAreaView className="bg-gray-50 flex-1 dark:bg-neutral-900 pt-7 justify-center items-center">
        <Text className="text-gray-600 dark:text-gray-400">{t('product.loadingProduct')}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-gray-50 flex-1 dark:bg-neutral-900 pt-7 justify-center items-center">
        <Text className="text-red-600 dark:text-red-400">{t('product.errorLoadingProduct')}</Text>
        <Text className="text-gray-600 dark:text-gray-400 mt-2">{error.message}</Text>
      </SafeAreaView>
    );
  }*/


  

  return (
    <View className="bg-gray-50 flex-1 dark:bg-neutral-900 ">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* Header */}
      <View className="bg-white dark:bg-neutral-900 ">
        <View className="px-4 py-4 flex-row items-center justify-between">
          <TouchableOpacity className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800" onPress={handleBack}>
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-gilroy-bold text-neutral-900 dark:text-white">{t('product.productDetails')}</Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800"
              onPress={() => setShowQRCode(true)}
            >
              <QrCode size={20} color="#22C55E" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800"
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                size={20}
                color={isFavorite ? "#EF4444" : "#374151"}
                fill={isFavorite ? "#EF4444" : "none"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* QR Code Modal */}
      <Modal
        visible={showQRCode}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRCode(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 items-center justify-center"
          activeOpacity={1}
          onPress={() => setShowQRCode(false)}
        >
          <View className="bg-white dark:bg-neutral-800 p-6 rounded-3xl items-center mx-6">
            <Text className="text-xl font-gilroy-bold text-neutral-900 dark:text-white mb-4">
              Product QR Code
            </Text>
            <View className="bg-white p-4 rounded-2xl">
              <QRCode
                value={`product:${product.id}`}
                size={200}
                color="#22C55E"
                backgroundColor="white"
              />
            </View>
            <Text className="text-sm text-gray-500 dark:text-neutral-400 mt-4 text-center">
              Scan to view product details
            </Text>
            <Text className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
              ID: {product.id}
            </Text>
            <TouchableOpacity
              className="mt-4 bg-primary px-6 py-3 rounded-xl"
              onPress={() => setShowQRCode(false)}
            >
              <Text className="text-white font-gilroy-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View className="bg-white dark:bg-neutral-800 ">
          <View className="relative" style={{ height: 420, margin: 10 }}>
            <Image
              source={{ uri: config.image_url(product.images[currentImageIndex]) }}
              className="w-full h-full rounded-3xl"
              resizeMode="cover"
            />
            
            {/* Discount Badge */}
            <View className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full">
              <Text className="text-white text-sm font-gilroy-semibold">{t('product.discount')}</Text>
            </View>
            
            {/* Navigation Arrows */}
            <TouchableOpacity
              onPress={prevImage}
              className="absolute left-4 top-36 bg-white/90 p-2 rounded-full"
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextImage}
              className="absolute right-4 top-36 bg-white/90 p-2 rounded-full"
            >
              <ChevronRight size={24} color="#374151" />
            </TouchableOpacity>

            {/* Image Indicators */}
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2 ">
              {product.images.map((_: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white w-8' : 'bg-white/60 w-2'
                  }`}
                />
              ))}
            </View>
          </View>

          {/* Thumbnail Strip */}
         
        </View>

        {/* Product Details */}
        <View className="bg-white dark:bg-neutral-800 mt-2 p-4">
          <View className="flex-row items-center justify-between"></View>
          <View className="flex-row justify-between">
          <Text className="text-4xl font-gilroy-bold text-neutral-900 dark:text-white mb-3">{product.name}</Text>
            <Text className="text-4xl font-gilroy-bold text-primary">DZD {product.pricePerKg}/kg</Text>
          </View>
          <View className="flex-row items-center mb-4 flex-wrap">
            <View className="flex-row items-center gap-1 mr-4">
              <Star size={18} color="#F59E0B" fill="#F59E0B" />
              <Text className="text-neutral-900 dark:text-white font-gilroy-semibold">{product.rating}</Text>
              <Text className="text-neutral-500 dark:text-neutral-400">({product.reviews} reviews)</Text>
            </View>
            <View className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-lg">
              <Text className="text-green-800 dark:text-green-200 text-sm font-gilroy-semibold">
                {product.subcategory || 'Fresh Produce'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6">
            
           
           
          </View>

          <Text className="text-gray-600 dark:text-neutral-300 leading-relaxed mb-6">
            {product.description}
          </Text>

         
          

         

          {/* Allergen Info */}
         <View className="mb-6">
            <Text className="text-lg font-gilroy-semibold text-neutral-900 dark:text-white mb-3">
              {t('product.allergensHeader')}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {product.allergens.map((allergen, index) => (
                <View
                  key={index}
                  className="bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 px-3 py-1 rounded-full"
                >
                  <Text className="text-yellow-800 dark:text-yellow-200 text-sm font-gilroy-semibold">
                    {allergen}
                  </Text>
                </View>
              ))}
            </View>
          </View>

        
        </View>

        {/* Seller Profile Card */}
        <View className="bg-white dark:bg-neutral-800 mt-2 p-4">
          <Text className="text-xl font-gilroy-bold text-neutral-900 dark:text-white mb-4">{t('product.sellerInfo')}</Text>
          <View className="flex-row gap-4">
            <Image
              source={{ uri: seller.avatar }}
              className="w-16 h-16 rounded-full"
              resizeMode="cover"
            />
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-lg font-gilroy-bold text-neutral-900 dark:text-white">{seller.name}</Text>
                {seller.verified && (
                  <Award size={16} color="#3B82F6" fill="#3B82F6" />
                )}
              </View>
              <View className="flex-row items-center gap-1 mb-2">
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-sm font-gilroy-semibold text-gray-700 dark:text-neutral-300">{seller.rating}</Text>
                <Text className="text-sm text-gray-500 dark:text-neutral-400">{t('product.reviewsCount', { count: seller.reviews })}</Text>
              </View>
              <View className="flex-row items-center gap-4 mb-2">
                <View className="flex-row items-center gap-1">
                  <MapPin size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-600 dark:text-neutral-400">{seller.location}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1">
                <Clock size={14} color="#6B7280" />
                <Text className="text-sm text-gray-600 dark:text-neutral-400">{seller.responseTime}</Text>
              </View>
              <Text className="text-xs text-gray-500 dark:text-neutral-500 mt-2">{t('product.memberSince', { year: seller.memberSince })}</Text>
            </View>
          </View>
          <TouchableOpacity className="mt-4 w-full bg-gray-100 dark:bg-neutral-800 py-3 rounded-xl items-center" onPress={() => router.push(`/productShop?producerId=${product.producerId}`)}>
            <Text className="text-gray-900 dark:text-white font-gilroy-bold">{t('product.visitStore')}</Text>
          </TouchableOpacity>
        </View>

        {/* Comments and Ratings Section */}
        <View className="bg-white dark:bg-neutral-800 mt-2 p-4 mb-4">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-gilroy-bold text-neutral-900 dark:text-white">{t('product.customerReviews')}</Text>
            <TouchableOpacity className="bg-primary px-1 py-2 rounded-xl">
              <Text className="text-white font-gilroy-semibold">{t('product.writeReview')}</Text>
            </TouchableOpacity>
          </View>

          {/* Rating Summary */}
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 mb-6">
            <View className="flex-row gap-8">
              <View className="items-center">
                <Text className="text-5xl font-gilroy-bold text-neutral-900 dark:text-white mb-2">{temp.rating}</Text>
                <View className="flex-row gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={20} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </View>
                <Text className="text-sm text-gray-600 dark:text-neutral-400">{t('product.reviewsCount', { count: temp.reviews })}</Text>
              </View>
              <View className="flex-1 gap-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <View key={stars} className="flex-row items-center gap-3">
                    <Text className="text-sm text-gray-600 dark:text-neutral-400 w-12">{stars} star</Text>
                    <View className="flex-1 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                      <View
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: stars === 5 ? '75%' : stars === 4 ? '20%' : stars === 3 ? '3%' : '1%'
                        }}
                      />
                    </View>
                    <Text className="text-sm text-gray-600 dark:text-neutral-400 w-12 text-right">
                      {stars === 5 ? '93' : stars === 4 ? '25' : stars === 3 ? '4' : stars === 2 ? '1' : '1'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Comments List */}
          <View className="gap-6">
            {comments.map((comment, idx) => (
              <View 
                key={comment.id} 
                className={`pb-6 ${idx < comments.length - 1 ? 'border-b border-gray-100 dark:border-neutral-800' : ''}`}
              >
                <View className="flex-row gap-4">
                  <Image
                    source={{ uri: comment.avatar }}
                    className="w-12 h-12 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-2">
                      <View>
                        <Text className="font-gilroy-bold text-neutral-900 dark:text-white">{comment.user}</Text>
                        <Text className="text-sm text-gray-500 dark:text-neutral-400">{comment.date}</Text>
                      </View>
                      <View className="flex-row gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            color="#F59E0B"
                            fill={i < comment.rating ? "#F59E0B" : "none"}
                          />
                        ))}
                      </View>
                    </View>
                    <Text className="text-gray-700 dark:text-neutral-300 leading-relaxed mb-3">{comment.comment}</Text>
                    <TouchableOpacity>
                      <Text className="text-sm text-gray-600 dark:text-neutral-400">
                        👍 {t('product.helpful')} ({comment.helpful})
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity className="mt-6 w-full border-2 border-gray-200 dark:border-neutral-700 py-3 rounded-xl items-center">
            <Text className="text-gray-700 dark:text-neutral-300 font-gilroy-medium">{t('product.loadMoreReviews')}</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
        {/* Quantity and Add to Cart */}
          <View className=" rounded-t-3xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 mx-1 p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-gilroy-bold text-neutral-900 dark:text-white">{t('product.quantity')}</Text>
              <View className="flex-row items-center bg-gray-100 dark:bg-neutral-700 rounded-full">
                <TouchableOpacity onPress={decrementQuantity} className="p-3">
                  <Minus size={18} color="#ACB0B2" />
                </TouchableOpacity>
                <Text className="text-lg font-gilroy-bold text-neutral-900 dark:text-white mx-6">
                  {quantity}
                </Text>
                <TouchableOpacity onPress={incrementQuantity} className="p-3">
                  <Plus size={18} color="#ACB0B2" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              className="w-full bg-primary py-4 mb-4 rounded-xl flex-row items-center justify-center gap-2"
              onPress={addProductToCart}
            >
              <ShoppingCart size={22} color="white" />
              <Text className="text-white font-gilroy-bold text-lg">
                {t('product.addToCartTotal', { total: (product.pricePerKg * quantity).toFixed(2) })}
              </Text>
            </TouchableOpacity>
          </View>
    </View>
  );
};

export default ProductScreen;