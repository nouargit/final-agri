import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View, ImageSourcePropType } from 'react-native';
import { images } from '@/constants/imports';

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
  const remoteUrl = item.images?.[0]?.url?.trim();
  const fallback = images.cake;

  

  const source = remoteUrl ? { uri: remoteUrl } : fallback;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="mb-3" // vertical gap between cards
      onPress={() => router.push(`../product?id=${item.id}`)}
    >
      <View className="rounded-3xl">
        {/* ---------- IMAGE ---------- */}
        <Image
          source={source}
          style={{ width: '100%', height: CARD_IMAGE_HEIGHT, borderRadius: 20 }}
          resizeMode="cover"
          // optional: show placeholder while loading
          // defaultSource={fallback} // works only with local assets
         
        />

        {/* subtle gradient */}
        <View
          pointerEvents="none"
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent"
        />

        {/* ---------- CONTENT ---------- */}
        <View className="p-4">
          <Text className="text-lg font-quicksand-semibold text-neutral-900 dark:text-white">
            {item.name}
          </Text>

          <Text className="text-sm font-quicksand text-neutral-500 dark:text-neutral-400">
            Tap to explore
          </Text>

          <Text className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
            DZD {item.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;