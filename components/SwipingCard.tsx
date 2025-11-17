import { images } from "@/constants/imports";
import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

interface Product {
  name: string;
  price: number;
  image: any;
}

interface SwipingCardProps {
  products: Product[];
}

const THRESHOLD = 80; // px
const MAX_ROT = 180; // degrees

const SwipingCard = ({ products }: SwipingCardProps) => {
  const { width, height } = useWindowDimensions();
  const CARD_WIDTH = width * 0.92;
  const CARD_HEIGHT = Math.min(height * 0.6, 600);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProduct = products[currentIndex];

  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;

  const clamp = (v: number, a = -MAX_ROT, b = MAX_ROT) =>
    Math.max(a, Math.min(b, v));

  const resetCard = () => {
    Animated.parallel([
      Animated.spring(rotateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }),
      Animated.spring(rotateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }),
    ]).start();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const completeFlip = (axisValue: Animated.Value, target: number, callback: () => void) => {
    Animated.spring(axisValue, {
      toValue: target,
      useNativeDriver: true,
      friction: 6,
      tension: 60,
    }).start(() => {
      callback();
      setTimeout(() => resetCard(), 220);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8,

      onPanResponderMove: (_, gesture) => {
        const absDx = Math.abs(gesture.dx);
        const absDy = Math.abs(gesture.dy);

        if (absDx > absDy) {
          // horizontal → rotateY
          const value = clamp((-gesture.dx / CARD_WIDTH) * MAX_ROT);
          rotateY.setValue(value);
          rotateX.setValue(0);
        } else {
          // vertical → rotateX
          const value = clamp((-gesture.dy / CARD_HEIGHT) * MAX_ROT);
          rotateX.setValue(value);
          rotateY.setValue(0);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        const dx = gesture.dx;
        const dy = gesture.dy;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx < -THRESHOLD) completeFlip(rotateY, MAX_ROT, handleNext); // left → eat
          else if (dx > THRESHOLD) completeFlip(rotateY, -MAX_ROT, handleNext); // right → throw
          else resetCard();
        } else {
          if (dy < -THRESHOLD) completeFlip(rotateX, MAX_ROT, handleNext); // up → skip
          else resetCard();
        }
      },

      onPanResponderTerminate: () => resetCard(),
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  const animatedStyle = {
    transform: [
      { perspective: 1000 },
      {
        rotateY: rotateY.interpolate({
          inputRange: [-MAX_ROT, MAX_ROT],
          outputRange: ["-180deg", "180deg"],
        }),
      },
      {
        rotateX: rotateX.interpolate({
          inputRange: [-MAX_ROT, MAX_ROT],
          outputRange: ["-180deg", "180deg"],
        }),
      },
    ],
  };

  return (
    <View style={[styles.container, { height: CARD_HEIGHT * 1.2 }]}>
      <Animated.View {...panResponder.panHandlers} style={[styles.card, animatedStyle]}>
        <Image source={currentProduct.image} style={styles.img} />

        <View style={styles.info}>
          <Text style={styles.title}>{currentProduct.name}</Text>
          <Text style={styles.price}>${currentProduct.price}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default SwipingCard;

const styles = StyleSheet.create({
  container: {
    width: "92%",
    alignSelf: "center",
    marginBottom: 79,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  img: {
    width: "100%",
    height: "100%",
  },
  info: {
    position: "absolute",
    bottom: 18,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  price: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
