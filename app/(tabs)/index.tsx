import { icons, images } from "@/constants/imports";
import React, { useCallback, useRef } from "react";
import { Funnel } from "lucide-react-native";
import {
  Animated,
  Dimensions,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CartButton from "@/components/CartButton";
import { config } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

interface Product {
  images: { url: string }[];
  id: string;
  name: string;
  price: number;
  description: string;
}

const { height, width } = Dimensions.get("window");
const ITEM_HEIGHT = height * 0.78;
const CARD_WIDTH = width * 0.9;
const GAP = 18;

/* ---------------------------- CARD COMPONENT ---------------------------- */
/* ------------------------ HIGH PERFORMANCE VERSION ---------------------- */

const ProductCard = React.memo(
  ({ item, parallax }: { item: Product; parallax: any }) => {
    const imageUri = item.images?.[0]?.url;

    return (
      <View style={styles.page}>
        <View style={styles.card}>
          <Animated.Image
            source={{ uri: imageUri }}
            style={[styles.image, { transform: [{ translateY: parallax }] }]}
            resizeMode="cover"
          />

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1.6 }}
            style={styles.gradient}
          />

          <View
            style={styles.overlayContent}
            className="flex-row items-center"
          >
            <Image
              source={{ uri: imageUri }}
              style={{ width: 40, height: 40 }}
              className="rounded-full bg-white p-1 mx-2"
            />
            <Text
              className="text-white font-gilroy-bold text-sm"
              style={styles.name}
            >
              {item.name}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

/* ---------------------------- MAIN COMPONENT ---------------------------- */

const ProductCarousel = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const getProducts = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) throw new Error("Missing token");

      const res = await fetch(`${config.baseUrl}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      const products = Array.isArray(data) ? data : data.data || [];

      return products.map((p: any) => ({
        ...p,
        images:
          p.images?.map((img: any) => {
            let cleanUrl = img.uri || img.url || img;

            if (typeof cleanUrl === "string") {
              cleanUrl = cleanUrl.replace(/^`+/, "").replace(/`+$/, "");
            }

            return { url: cleanUrl };
          }) || (p.image_url ? [{ url: p.image_url }] : []),
      }));
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const { data: productsData = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  /* ---------------------------- RENDER ITEM ---------------------------- */

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      const inputRange = [
        (index - 1) * (ITEM_HEIGHT + GAP),
        index * (ITEM_HEIGHT + GAP),
        (index + 1) * (ITEM_HEIGHT + GAP),
      ];

      const parallax = scrollY.interpolate({
        inputRange,
        outputRange: [-15, 0, 60],
        extrapolate: "clamp",
      });

      return <ProductCard item={item} parallax={parallax} />;
    },
    [scrollY]
  );

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-5 py-3 bg-white dark:bg-zinc-900 z-10 relative">
        <TouchableOpacity className="rounded-full bg-[#ebebeb] dark:bg-[#000] p-2 items-center justify-center">
          <Funnel size={24} color="#ff6370" strokeWidth={2} />
        </TouchableOpacity>

        <View className="absolute pt-2 left-0 right-0 items-center justify-center">
          <Text className="text-4xl mt-2 font-gilroy-bold text-primary dark:text-primary">
            sweetr.
          </Text>
        </View>

        <CartButton />
      </View>

      {/* LIST */}
      <Animated.FlatList
        data={productsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        snapToInterval={ITEM_HEIGHT + GAP}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 12 }}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT + GAP,
          offset: (ITEM_HEIGHT + GAP) * index,
          index,
        })}
        bounces
      />
    </View>
  );
};

export default ProductCarousel;

/* ---------------------------- STYLES ---------------------------- */

const styles = StyleSheet.create({
  page: {
    height: ITEM_HEIGHT,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: "100%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    
  },
  image: { width: "100%", height: "100%" },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  overlayContent: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 20,
  },
  name: { fontSize: 15, color: "white" },
});
