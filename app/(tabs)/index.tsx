import { Grid, Heart, Home, Leaf, Menu, Search, ShoppingBag, Star } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FarmMarketplaceHome() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const categories = ['All', 'Fresh', 'Vegetables', 'Fruits', 'Dairy'];

  const promosBanners = [
    { id: 1, title: 'Fresh Harvest', subtitle: '30% OFF', description: 'Organic Vegetables', emoji: '🥬', color: 'bg-green-400' },
    { id: 2, title: 'Farm Fresh', subtitle: 'Buy 2 Get 1', description: 'Premium Fruits', emoji: '🍎', color: 'bg-red-400' },
    { id: 3, title: 'Free Delivery', subtitle: 'Orders $50+', description: 'Limited Time', emoji: '🚚', color: 'bg-blue-400' },
    { id: 4, title: 'Dairy Delight', subtitle: '20% OFF', description: 'Fresh From Farm', emoji: '🥛', color: 'bg-yellow-400' },
  ];

  const products = [
    { id: 1, name: 'Fresh Tomatoes', originalPrice: 4, price: 3, unit: 'kg', image: '🍅', rating: 4.5 },
    { id: 2, name: 'Organic Carrots', originalPrice: 3, price: 2, unit: 'kg', image: '🥕', rating: 4.8 },
    { id: 3, name: 'Farm Eggs', originalPrice: 6, price: 5, unit: 'dozen', image: '🥚', rating: 4.9 },
    { id: 4, name: 'Fresh Apples', originalPrice: 8, price: 6, unit: 'kg', image: '🍎', rating: 4.7 },
    { id: 5, name: 'Sweet Corn', originalPrice: 5, price: 4, unit: 'kg', image: '🌽', rating: 4.6 },
    { id: 6, name: 'Fresh Milk', originalPrice: 4, price: 3, unit: 'liter', image: '🥛', rating: 4.8 },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-gray-600 text-sm">Fresh From</Text>
            <Text className="text-xl font-bold text-gray-900">Local Farms</Text>
          </View>
          <View className="w-12 h-12 bg-green-600 rounded-full items-center justify-center">
            <Leaf size={24} color="white" />
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900"
          />
        </View>

        {/* Menu Button */}
        <TouchableOpacity className="absolute right-4 top-14 bg-gray-900 p-3 rounded-xl">
          <Menu size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Promo Banners - Horizontal Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4 mt-4"
          snapToInterval={300}
          decelerationRate="fast"
        >
          {promosBanners.map((promo) => (
            <View key={promo.id} className={`${promo.color} rounded-3xl p-6 mr-4 w-72`}>
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold mb-1">{promo.title}</Text>
                  <Text className="text-white text-3xl font-bold mb-2">{promo.subtitle}</Text>
                  <Text className="text-white text-sm opacity-90">{promo.description}</Text>
                </View>
                <View className="ml-4">
                  <Text className="text-6xl">{promo.emoji}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4 mt-6 mb-4"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setActiveCategory(category)}
              className={`mr-3 px-5 py-2.5 rounded-full ${
                activeCategory === category
                  ? 'bg-white border-2 border-gray-900'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <Text
                className={`${
                  activeCategory === category
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-500'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View className="px-4 flex-row flex-wrap justify-between pb-24">
          {products.map((product) => (
            <View key={product.id} className="w-[48%] mb-4">
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                {/* Product Image */}
                <View className="bg-green-50 rounded-2xl h-36 items-center justify-center mb-3 relative">
                  <Text className="text-6xl">{product.image}</Text>
                  
                  {/* Favorite Button */}
                  <TouchableOpacity
                    onPress={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm"
                  >
                    <Heart
                      size={18}
                      color={favorites[product.id] ? '#EF4444' : '#9CA3AF'}
                      fill={favorites[product.id] ? '#EF4444' : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Product Info */}
                <Text className="text-gray-900 font-semibold mb-1">{product.name}</Text>
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center">
                    
                    <Text className="text-green-600 font-bold">${product.price}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Star size={14} color="#FCD34D" fill="#FCD34D" />
                    <Text className="text-gray-600 text-xs ml-1">{product.rating}</Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-xs">per {product.unit}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <View className="flex-row justify-around items-center">
          <TouchableOpacity className="items-center">
            <View className="bg-green-600 p-3 rounded-xl">
              <Home size={24} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Grid size={24} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Heart size={24} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <ShoppingBag size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}