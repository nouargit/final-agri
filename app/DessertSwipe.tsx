import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const desserts = [
  { id: 1, name: "Chocolate Cake", image: require("@/assets/images/beghrir.jpg") },
  { id: 2, name: "Strawberry Tart", image: require("@/assets/images/panCake.jpg") },
  { id: 3, name: "Vanilla Cupcake", image: require("@/assets/images/baklawa.jpg") },
];

export default function DessertSwipe() {
  const [index, setIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const handleNext = () => {
    if (index < desserts.length - 1) setIndex(index + 1);
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotate.value = event.translationX / 20;
    })
    .onEnd(() => {
      if (translateX.value > 120) {
        console.log("🍴 أكل!");
        runOnJS(handleNext)();
      } else if (translateX.value < -120) {
        console.log("⏩ تخطي!");
        runOnJS(handleNext)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const dessert = desserts[index];

  return (
    <View style={styles.container}>
      {dessert ? (
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.card, style]}>
            <Image source={dessert.image} style={styles.image} />
            <Text style={styles.name}>{dessert.name}</Text>
          </Animated.View>
        </GestureDetector>
      ) : (
        <Text style={styles.end}>🎉 انتهت التحليات!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  card: {
    width: width * 0.95,
    height: height * 0.8,
    borderRadius: 20,
    backgroundColor: "#fafafa",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  image: {
    width: "100%",
    height: "80%",
  },
  name: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    paddingVertical: 10,
  },
  end: {
    fontSize: 24,
    color: "#888",
  },
});


