import React, { useState, useCallback } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  
  StatusBar,
} from 'react-native';
import { Heart, ArrowLeft, Star, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, MapPin, Clock, Award } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/config';
import { router, useLocalSearchParams } from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');
 const temp={images: [
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop"
    ],
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla Ice Cream"],
    sizes: ["Small", "Medium", "Large"],
    allergens: ["Eggs", "Dairy", "Gluten"],}
const ProductScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const handleBack = () => {
    navigation.goBack();
  };

  const getProducts = useCallback(async () => {
  try {
     const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }
     
    const response = await fetch(`${config.baseUrl}/api/products/${id}`,{
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
  //console.log('fetching from')
  const cart = await response.json();
  //console.log('Raw API response:', cart);

  // Return the actual product cart, not an array
  return cart.cart || cart;

  } catch (error) {
    
    throw error; // Throw the error instead of returning empty array
  }
  
}, [id]);

  const {data: productTemp, isLoading, error} = useQuery({
  queryKey: ['products', id],
  queryFn: getProducts,
   enabled: !!id, // Only run query when id is available
});
const product = {
    id: productTemp?.id || 1,
    shop_id: productTemp?.shop_id || 1,
    name: productTemp?.name || "chokolate cake" ,
    price: productTemp?.price || 12.99,
    originalPrice: productTemp?.originalPrice || 15.99,
    rating: productTemp?.rating || 4.8,
    reviews: productTemp?.reviews || 124,
    description: productTemp?.description ||
      "Indulgent warm chocolate cake with a molten chocolate center. Served with vanilla ice cream and fresh berries. Perfect for chocolate lovers!",
    preparationTime: productTemp?.preparationTime || "15-20 min",
    calories: productTemp?.calories || "580 cal",
    images: productTemp?.images || [
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop"
    ],
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla Ice Cream"],
    sizes: ["Small", "Medium", "Large"],
    allergens: ["Eggs", "Dairy", "Gluten"],
  };

  const seller = {
    name: productTemp?.shop?.name || "Sweet Delights Bakery",
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
  const addProductToCart = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const user_data = await AsyncStorage.getItem('user_data');
      const user_id = user_data ? JSON.parse(user_data).id : null;
     // console.log('User ID:', user_id);
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

      // First, try to get existing cart
      const cartResponse = await fetch(`${config.baseUrl}/api/carts/${product.shop_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }

      });

      let cart;
      
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        cart = cartData.data || cartData;
       
      }

      // If no cart exists or cart is empty/null, create a new one
      if (!cart || (Array.isArray(cart) && cart.length === 0)) {
       
       
     
        const newCartResponse = await fetch(`${config.baseUrl}/api/carts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            
            shop_id: product.shop_id,   
            status: 'open' 
          })
        });

        if (!newCartResponse.ok) {
          throw new Error('Failed to create new cart');
        }
        
        const newCartData = await newCartResponse.json();
        cart = newCartData.data || newCartData;
      
      }

      // Ensure cart has cart_items array
      if (!cart.cart_items) {
       
        cart.cart_items = [];
      }

     

      // Check if item already exists in cart
      const existingItem = cart.cart_items.find((item: any) => 
        item.product_id === parseInt(product.id || '0')
      );
      

      if (existingItem) {
        // Update existing item quantity
        const updateResponse = await fetch(`${config.baseUrl}/api/carts/${cart.id}/items/${existingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            quantity: existingItem.quantity + quantity,
            note: '',
            options: []
          })
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update cart item');
        }

        const result = await updateResponse.json();
        
        alert('Item quantity updated in cart!');
      } else {
        // Add new item to cart
        
        const addResponse = await fetch(`${config.baseUrl}/api/carts/${cart.id}/items`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: quantity,
            note: null,
            options: []
          })
        });

        if (!addResponse.ok) {
          const errorText = await addResponse.text();
         
          throw new Error(`Failed to add item to cart: ${addResponse.status} - ${errorText}`);
        }

        const result = await addResponse.json();
      
        alert('Item added to cart successfully!');
      }

    } catch (error) {
     
      alert('Failed to add item to cart. Please try again.');
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

  // Add loading and error states
  if (isLoading) {
    return (
      <SafeAreaView className="bg-gray-50 flex-1 dark:bg-neutral-900 pt-7 justify-center items-center">
        <Text className="text-gray-600 dark:text-gray-400">Loading product...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-gray-50 flex-1 dark:bg-neutral-900 pt-7 justify-center items-center">
        <Text className="text-red-600 dark:text-red-400">Error loading product</Text>
        <Text className="text-gray-600 dark:text-gray-400 mt-2">{error.message}</Text>
      </SafeAreaView>
    );
  }


  

  return (
    <View className="bg-gray-50 flex-1 dark:bg-neutral-900 pt-3">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* Header */}
      <View className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
        <View className="px-4 py-4 flex-row items-center justify-between">
          <TouchableOpacity className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800" onPress={handleBack}>
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-neutral-900 dark:text-white">Product Details</Text>
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View className="bg-white dark:bg-neutral-800">
          <View className="relative" style={{ height: 360 }}>
            <Image
              source={{ uri: product.images[currentImageIndex] }}
              className="w-full h-full rounded-b-3xl"
              resizeMode="cover"
            />
            
            {/* Discount Badge */}
            <View className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full">
              <Text className="text-white text-sm font-medium">20% OFF</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4">
            <View className="flex-row gap-2 ">
              {product.images.map((img: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Product Details */}
        <View className="bg-white dark:bg-neutral-800 mt-2 p-4">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">{product.name}</Text>

          <View className="flex-row items-center mb-4 flex-wrap">
            <View className="flex-row items-center gap-1 mr-4">
              <Star size={18} color="#F59E0B" fill="#F59E0B" />
              <Text className="text-neutral-900 dark:text-white font-medium">{product.rating}</Text>
              <Text className="text-neutral-500 dark:text-neutral-400">({product.reviews} reviews)</Text>
            </View>
            <View className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-lg">
              <Text className="text-green-800 dark:text-green-200 text-sm font-medium">
                {product.preparationTime}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6">
            <Text className="text-5xl font-bold text-primary">${product.price}</Text>
            <Text className="text-xl text-gray-400 dark:text-neutral-500 line-through ml-3">
              ${product.originalPrice}
            </Text>
            <View className="bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-lg ml-auto">
              <Text className="text-gray-600 dark:text-neutral-400 text-sm">{product.calories}</Text>
            </View>
          </View>

          <Text className="text-gray-600 dark:text-neutral-300 leading-relaxed mb-6">
            {product.description}
          </Text>

          {/* Size Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">Size</Text>
            <View className="flex-row gap-3">
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  className={`px-6 py-2 rounded-xl border-2 ${
                    selectedSize === size
                      ? "border-primary bg-orange-50 dark:bg-orange-900/20"
                      : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      selectedSize === size ? "text-orange-600" : "text-gray-700 dark:text-neutral-200"
                    }`}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ingredients */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">Ingredients</Text>
            <View className="flex-row flex-wrap gap-2">
              {product.ingredients.map((ingredient, index) => (
                <View key={index} className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  <Text className="text-blue-800 dark:text-blue-200 text-sm">{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Allergen Info */}
         <View className="mb-6">
            <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
              Allergen Information
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {product.allergens.map((allergen, index) => (
                <View
                  key={index}
                  className="bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 px-3 py-1 rounded-full"
                >
                  <Text className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                    Contains {allergen}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quantity and Add to Cart */}
          <View className="border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-neutral-900 dark:text-white">Quantity</Text>
              <View className="flex-row items-center bg-gray-100 dark:bg-neutral-700 rounded-full">
                <TouchableOpacity onPress={decrementQuantity} className="p-3">
                  <Minus size={18} color="#ACB0B2" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-neutral-900 dark:text-white mx-6">
                  {quantity}
                </Text>
                <TouchableOpacity onPress={incrementQuantity} className="p-3">
                  <Plus size={18} color="#ACB0B2" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              className="w-full bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2"
              onPress={addProductToCart}
            >
              <ShoppingCart size={22} color="white" />
              <Text className="text-white font-semibold text-lg">
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seller Profile Card */}
        <View className="bg-white dark:bg-neutral-800 mt-2 p-4">
          <Text className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Seller Information</Text>
          <View className="flex-row gap-4">
            <Image
              source={{ uri: seller.avatar }}
              className="w-16 h-16 rounded-full"
              resizeMode="cover"
            />
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-lg font-semibold text-neutral-900 dark:text-white">{seller.name}</Text>
                {seller.verified && (
                  <Award size={16} color="#3B82F6" fill="#3B82F6" />
                )}
              </View>
              <View className="flex-row items-center gap-1 mb-2">
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-sm font-medium text-gray-700 dark:text-neutral-300">{seller.rating}</Text>
                <Text className="text-sm text-gray-500 dark:text-neutral-400">({seller.reviews} reviews)</Text>
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
              <Text className="text-xs text-gray-500 dark:text-neutral-500 mt-2">Member since {seller.memberSince}</Text>
            </View>
          </View>
          <TouchableOpacity className="mt-4 w-full bg-gray-100 dark:bg-neutral-800 py-3 rounded-xl items-center" onPress={() => router.push(`/productShop?shop_id=${product.shop_id}`)}>
            <Text className="text-gray-900 dark:text-white font-medium">Visit Store</Text>
          </TouchableOpacity>
        </View>

        {/* Comments and Ratings Section */}
        <View className="bg-white dark:bg-neutral-800 mt-2 p-4 mb-4">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-neutral-900 dark:text-white">Customer Reviews</Text>
            <TouchableOpacity className="bg-primary px-1 py-2 rounded-xl">
              <Text className="text-white font-medium">Write Review</Text>
            </TouchableOpacity>
          </View>

          {/* Rating Summary */}
          <View className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 mb-6">
            <View className="flex-row gap-8">
              <View className="items-center">
                <Text className="text-5xl font-bold text-neutral-900 dark:text-white mb-2">{product.rating}</Text>
                <View className="flex-row gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={20} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </View>
                <Text className="text-sm text-gray-600 dark:text-neutral-400">{product.reviews} reviews</Text>
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
                        <Text className="font-semibold text-neutral-900 dark:text-white">{comment.user}</Text>
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
                        👍 Helpful ({comment.helpful})
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity className="mt-6 w-full border-2 border-gray-200 dark:border-neutral-700 py-3 rounded-xl items-center">
            <Text className="text-gray-700 dark:text-neutral-300 font-medium">Load More Reviews</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </View>
  );
};

export default ProductScreen;