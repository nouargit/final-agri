import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View, ImageSourcePropType } from 'react-native';
import { images } from '@/constants/imports';
import { useState } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
  images: Array<{ url: string }>; // <-- exact shape from API
}

type ItemCardProps = {
  item: Item;
};

const CARD_IMAGE_HEIGHT = 250; // fixed height → Masonry loves it

const ItemCard = ({ item }: ItemCardProps) => {
  const [imageSource, setImageSource] = useState<ImageSourcePropType>(images.cake);
  let remoteUrl = item.images?.[0]?.url;
  const fallback = images.cake;

 
  

 

  // Validate URL format
  const isValidUrl = (url: string) => {
    try {
      // Check if it's a valid URL format
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        console.warn('URL does not start with http:// or https://:', url);
        return false;
      }
      
      // Check if URL contains valid domain and path structure
      
      // Additional validation - check for common image extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasImageExtension = imageExtensions.some(ext => 
        url.toLowerCase().includes(ext)
      );
      

     
      
     
      return true;
    } catch (error) {
    
      return false;
    }
  };

  // Set initial image source
  useState(() => {
    const source = remoteUrl && isValidUrl(remoteUrl) ? { uri: remoteUrl } : fallback;
    setImageSource(source);
    
    
  });

  

  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="mb-3" // vertical gap between cards
      onPress={() => router.push(`../product?id=${item.id}`)}
    >
      <View className="rounded-3xl">
        {/* ---------- IMAGE ---------- */}
        <Image
          source={imageSource}
          style={{ width: '100%', height: CARD_IMAGE_HEIGHT, borderRadius: 20 }}
          resizeMode="cover"
         
         
          
         />

        {/* subtle gradient */}
        <View
          pointerEvents="none"
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent"
        />

        {/* ---------- CONTENT ---------- */}
        <View className="p-4">
          <Text className="text-2xl font-gilroy-semibold text-neutral-800 dark:text-white">
            {item.name}
          </Text>
         
          <Text className="text-md font-gilroy-light text-neutral-500 dark:text-neutral-400">
          Tap to explore
          </Text>

          <Text className="mt-1 text-xl font-gilroy-bold text-primary dark:text-primary">
            DZD {item.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;