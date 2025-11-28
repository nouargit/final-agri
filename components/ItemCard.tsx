import { router } from "expo-router";
import { Text, TouchableOpacity, View, Animated } from "react-native";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { images } from "@/constants/imports";

interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
}

type ItemCardProps = {
  item: Item;
};

const CARD_IMAGE_HEIGHT = 180;

const ItemCard = ({ item }: ItemCardProps) => {
  const fallback = images.fallback;

  const opacity = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);

  const fadeIn = () => {
    setLoading(false);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="mb-3"
      onPress={() => router.push(`../product?id=${item.id}`)}
    >
      <View className="rounded-3xl overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 ">
        
        {/* 🔥 Skeleton Loader */}
        {loading && (
          <View
            className="absolute inset-0 bg-neutral-300/40 dark:bg-neutral-700/40"
            style={{ height: CARD_IMAGE_HEIGHT }}
          >
            <Animated.View
              className="absolute inset-0"
              style={{
                backgroundColor: "#ffffff22",
                transform: [
                  {
                    translateX: opacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-300, 300],
                    }),
                  },
                ],
              }}
            />
          </View>
        )}

        {/* ✨ CACHED IMAGE WITH FADE-IN */}
        <Animated.View style={{ opacity }}>
          <Image
            source={item.image || fallback}
            style={{ width: "100%", height: CARD_IMAGE_HEIGHT }}
            contentFit="cover"
            transition={100}
            cachePolicy="disk"
            onLoad={fadeIn}
          />
        </Animated.View>

        {/* LUXURY GRADIENT */}
        <View className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

        {/* ✨ CONTENT */}
        <View className="p-4">
          <Text className="text-xl font-gilroy-semibold text-neutral-900 dark:text-white">
            {item.name}
          </Text>

          <Text className="text-md font-gilroy-light text-neutral-500 dark:text-neutral-400">
            Tap to explore
          </Text>

          <Text className="mt-1 text-lg font-gilroy-bold text-primary dark:text-neutral-200">
            DZD {item.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;
