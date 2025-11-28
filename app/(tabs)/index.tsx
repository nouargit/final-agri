import { Client } from "@/generated/openapi/client";
import { Bell, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

// API client configured with the new base URL
export const api = new Client({
  baseUrl: "https://agri-connect-api-six.vercel.app/api",
});

// Icon components as simple SVG replacements
const ChevronDown = () => <Text style={{ fontSize: 12 }}>▼</Text>;
const BellIcon = () => <Bell size={20} color="#4B5563" />;


const CategoryIcon = ({ emoji, label }:any) => (
  <View className="items-center mr-4">
    <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center mb-1">
      <Text className="text-2xl">{emoji}</Text>
    </View>
    <Text className="text-xs text-gray-600">{label}</Text>
  </View>
);



const ProductCard = ({ image, name, price, oldPrice, discount }: any) => (
  <View className="w-[48%] mb-5">
    {/* Image + Badges */}
    <View className="relative">
      <View className="h-36 bg-gray-100 rounded-2xl overflow-hidden">
        <Image
          source={{ uri: image }}
          className="w-full h-full rounded-2xl"
          resizeMode="cover"
        />
      </View>

      {/* Discount Badge */}
      {discount && (
        <View className="absolute top-2 left-2 bg-red-500/90 px-2 py-1 rounded-lg">
          <Text className="text-white text-xs font-bold">{discount}</Text>
        </View>
      )}

      {/* Wishlist Button */}
      <TouchableOpacity className="absolute top-2 right-2 bg-white/90 w-7 h-7 rounded-full items-center justify-center shadow-sm">
        <Text className="text-gray-600 text-base">♡</Text>
      </TouchableOpacity>
    </View>

    {/* Product Name */}
    <Text
      numberOfLines={1}
      className="mt-2 text-sm font-semibold text-gray-800"
    >
      {name}
    </Text>

    {/* Price + Add */}
    <View className="flex-row items-center justify-between mt-1">
      <View className="flex-row items-center">
        <Text className="text-lg font-bold text-gray-900">${price}</Text>

        {oldPrice && (
          <Text className="text-xs text-gray-400 line-through ml-2">
            ${oldPrice}
          </Text>
        )}
      </View>

      {/* Add to cart */}
      <TouchableOpacity className="w-8 h-8 rounded-full bg-green-500 items-center justify-center shadow-sm">
        <Text className="text-white text-lg font-bold ">+</Text>
      </TouchableOpacity>
    </View>
  </View>
);



export default function App() {
  const [activeTab, setActiveTab] = useState('today');

  const categories = [
    { emoji: '🥬', label: 'Vegetable' },
    { emoji: '🍎', label: 'Fruit' },
    { emoji: '🥩', label: 'Meat' },
    { emoji: '🦞', label: 'Seafood' },
    { emoji: '🍞', label: 'Proteins' },
    { emoji: '🍎', label: 'Fruit' },
  ];

  const products = [
    {
      id: 1,
      name: 'Chicken breast frozen',
      price: '22.40',
      oldPrice: '25.00',
      discount: '-30%',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400'
    },
    {
      id: 2,
      name: 'Chicken breast frozen',
      price: '13.00',
      oldPrice: '15.00',
      discount: '-20%',
      image: 'https://images.unsplash.com/photo-1588347818036-4c87e8c0e1f7?w=400'
    },
    {
      id: 3,
      name: 'Beef meat for soup',
      price: '20.00',
      discount: '-20%',
      image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400'
    },
  ];

  const todayChoices = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1583275479036-54a9c481c4f7?w=400',
      discount: '-20%'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400',
      discount: '-10%'
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-12 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Text className="text-green-600 text-lg mr-1">📍</Text>
              <Text className="text-base font-semibold">Dexter's Home</Text>
              <ChevronDown />
            </View>
            <View className="relative">
              <BellIcon />
              <View className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
            </View>
          </View>

          {/* Banner Images */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="w-80 h-40 bg-gray-900 rounded-2xl mr-3 overflow-hidden">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800' }}
                className="w-full h-full opacity-70"
                resizeMode="cover"
              />
              <View className="absolute bottom-4 left-4">
                <Text className="text-white text-xs">-40% Discount</Text>
                <Text className="text-white text-lg font-bold">On your first{'\n'}order</Text>
              </View>
            </View>
            <View className="w-80 h-40 bg-gray-800 rounded-2xl overflow-hidden">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800' }}
                className="w-full h-full opacity-70"
                resizeMode="cover"
              />
            </View>
          </ScrollView>

          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
           <Search />

            <TextInput 
              placeholder="What's your daily needs?"
              placeholderTextColor="#999"
              className="flex-1 ml-2 text-base"
            />
          </View>

          {/* Categories */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-bold">Categories</Text>
            <TouchableOpacity>
              <Text className="text-green-600 text-sm">See all →</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {categories.map((cat, idx) => (
              <CategoryIcon key={idx} emoji={cat.emoji} label={cat.label} />
            ))}
          </ScrollView>
        </View>

        {/* Flash Sale */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-base font-bold mr-2">Flash sale</Text>
              <Text className="text-red-500">🔥</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-green-600 text-sm">See all →</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {products.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </View>
        </View>

        {/* Flash Sale - Second Row */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-base font-bold mr-2">Flash sale</Text>
              <Text className="text-red-500">🔥</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-green-600 text-sm">See all →</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {products.map(product => (
              <ProductCard key={`second-${product.id}`} {...product} />
            ))}
          </View>
        </View>

        {/* Today's choices */}
        <View className="px-4 mb-20">
          <View className="flex-row border-b border-gray-200 mb-4">
            <TouchableOpacity 
              onPress={() => setActiveTab('today')}
              className={`mr-6 pb-2 ${activeTab === 'today' ? 'border-b-2 border-green-600' : ''}`}
            >
              <Text className={`${activeTab === 'today' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                Today's choices
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('limited')}
              className={`mr-6 pb-2 ${activeTab === 'limited' ? 'border-b-2 border-green-600' : ''}`}
            >
              <Text className={`${activeTab === 'limited' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                Limited discount
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('cheapest')}
              className={`pb-2 ${activeTab === 'cheapest' ? 'border-b-2 border-green-600' : ''}`}
            >
              <Text className={`${activeTab === 'cheapest' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                Cheapest
              </Text>
            </TouchableOpacity>  
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {todayChoices.map(item => (
               <View
      key={item.id}
      className="w-40 h-40 mr-3 rounded-2xl overflow-hidden relative"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded">
        <Text className="text-white text-xs font-bold">
          {item.discount}
        </Text>
      </View>
    </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}