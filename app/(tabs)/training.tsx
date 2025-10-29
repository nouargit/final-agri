import CategoryCard from '@/components/CategorysCard';
import ItemCard from '@/components/ItemCard';
import { config } from '@/config';
import categoriesEN from '@/constants/categories';
import { images } from '@/constants/imports';
import { Item } from '@/constants/items';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MasonryList from "@react-native-seoul/masonry-list";
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react-native';
import { Dimensions, ScrollView, StatusBar, Text, View } from 'react-native';




const Training = () => {

const getProducts = async () => {
  try {
     const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

    const response = await fetch(`${config.baseUrl}/api/products`,{
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
  console.log('fetching from')
  const data = await response.json();

  //ensure data is an array
  return Array.isArray(data) ? data : data.data || [];

  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array on error
  }
  
}

const {data: productsData, isLoading, error} = useQuery({
  queryKey: ['products'],
  queryFn: getProducts,
});

  if (isLoading) {
    return (
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-950 justify-center items-center">
        <Text className="text-neutral-500">Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-950 justify-center items-center">
        <Text className="text-red-500">Error loading products</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View className="flex-row justify-between px-6 pt-5 pb-4 rounded-b-3xl  dark:bg-neutral-900 ">
        <Text className="text-4xl font-malika text-primary dark:text-red-300">Mysweet.</Text>
        <View className="justify-end w-10 h-10 bg-slate-200 dark:bg-neutral-700 rounded-full p-2 items-center">
          <Search size={24} color="#ff6370" strokeWidth={2} />
        </View>
      </View>
      
     
      <MasonryList
        data={productsData || []}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8}}
        style={{ gap: 10 }}
        renderItem={({ item }) => <ItemCard item={item as Item} />}
        ListHeaderComponent={
          <View className="px-1 py-3 mb-3">
            {/* Paginated horizontal promo cards */}
           {/* <FlatList
              data={promoImages}
              horizontal
              pagingEnabled
              snapToInterval={cardWidth}
              snapToAlignment="end"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => `promo-${idx}`}
              renderItem={({ item }) => (
                <View style={{ width: cardWidth, marginRight: 9 }}>
                  <AddsCard image={item} />
                </View>
              )}
            />*/}
            {/* Categories Section */}
            <View className="mt-1 mb-2">
              <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                Categories
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                className="flex-row w-full"
              >
                {(categoriesEN || []).map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </ScrollView>
            </View>

            <Text className="text-lg font-bold text-neutral-900 dark:text-white mt-6 mb-1">
              Popular products
            </Text>
          </View>
        }
      />
      
    </View>
  )
}

export default Training

const promoImages = [images.cake, images.cake2, images.panCake, images.patesry];
const { width } = Dimensions.get('window');
const cardWidth = width - 42; // match list horizontal padding
