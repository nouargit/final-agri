import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, RotateCcw, Save, Share2, Palette, Cake, Cherry, Circle, Sparkles, Star } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle as SvgCircle, Rect, Path, Ellipse, Polygon } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CAKE_SIZE = screenWidth * 0.6;
const PLATE_SIZE = CAKE_SIZE * 1.2;

// Mock data for cake customization options
const cakeOptions = {
  bases: [
    { id: 'round', name: 'Round', shape: 'circle' },
    { id: 'square', name: 'Square', shape: 'square' },
    { id: 'heart', name: 'Heart', shape: 'heart' },
    { id: 'star', name: 'Star', shape: 'star' },
  ],
  flavors: [
    { id: 'vanilla', name: 'Vanilla', color: '#F5DEB3' },
    { id: 'chocolate', name: 'Chocolate', color: '#8B4513' },
    { id: 'strawberry', name: 'Strawberry', color: '#FFB6C1' },
    { id: 'lemon', name: 'Lemon', color: '#FFFACD' },
    { id: 'red-velvet', name: 'Red Velvet', color: '#DC143C' },
  ],
  frostings: [
    { id: 'white', name: 'White', color: '#FFFFFF' },
    { id: 'pink', name: 'Pink', color: '#FFB6C1' },
    { id: 'blue', name: 'Blue', color: '#87CEEB' },
    { id: 'yellow', name: 'Yellow', color: '#FFFFE0' },
    { id: 'green', name: 'Green', color: '#98FB98' },
    { id: 'purple', name: 'Purple', color: '#DDA0DD' },
    { id: 'orange', name: 'Orange', color: '#FFE4B5' },
  ],
  toppings: [
    { id: 'strawberry', name: '🍓', emoji: '🍓', size: 20 },
    { id: 'cherry', name: '🍒', emoji: '🍒', size: 18 },
    { id: 'candle', name: '🕯️', emoji: '🕯️', size: 25 },
    { id: 'flower', name: '🌸', emoji: '🌸', size: 22 },
    { id: 'star-topping', name: '⭐', emoji: '⭐', size: 20 },
    { id: 'heart-topping', name: '💖', emoji: '💖', size: 18 },
    { id: 'sprinkles', name: '🎊', emoji: '🎊', size: 16 },
    { id: 'chocolate-chip', name: '🍫', emoji: '🍫', size: 15 },
  ],
};

interface Topping {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

interface CakeDesign {
  base: string;
  flavor: string;
  frosting: string;
  toppings: Topping[];
}

interface CategoryType {
  id: 'base' | 'flavor' | 'frosting' | 'toppings';
  name: string;
  icon: React.ReactNode;
}

const CakeDesigner = () => {
  const [activeCategory, setActiveCategory] = useState<'base' | 'flavor' | 'frosting' | 'toppings'>('base');
  const [cakeDesign, setCakeDesign] = useState<CakeDesign>({
    base: 'round',
    flavor: 'vanilla',
    frosting: 'white',
    toppings: [],
  });
  const [selectedTopping, setSelectedTopping] = useState<string | null>(null);

  // Animation values
  const cakeRotation = useRef(new Animated.Value(0)).current;
  const frostingAnimation = useRef(new Animated.Value(0)).current;
  const categorySlide = useRef(new Animated.Value(0)).current;
  const sparkleAnimation = useRef(new Animated.Value(0)).current;
  const [showSprinkles, setShowSprinkles] = useState(false);

  const categories: CategoryType[] = [
    { id: 'base', name: 'Base', icon: <Cake size={20} color="#ff6370" /> },
    { id: 'flavor', name: 'Flavor', icon: <Palette size={20} color="#ff6370" /> },
    { id: 'frosting', name: 'Frosting', icon: <Sparkles size={20} color="#ff6370" /> },
    { id: 'toppings', name: 'Toppings', icon: <Cherry size={20} color="#ff6370" /> },
  ];

  useEffect(() => {
    // Continuous sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animation functions
  const rotateCake = () => {
    Animated.sequence([
      Animated.timing(cakeRotation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cakeRotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateFrosting = () => {
    Animated.sequence([
      Animated.timing(frostingAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(frostingAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showSprinkleEffect = () => {
    setShowSprinkles(true);
    setTimeout(() => setShowSprinkles(false), 1000);
  };

  const switchCategory = (category: typeof activeCategory) => {
    setActiveCategory(category);
    Animated.timing(categorySlide, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      categorySlide.setValue(0);
    });
  };

  const updateCakeDesign = (key: keyof CakeDesign, value: any) => {
    setCakeDesign(prev => ({ ...prev, [key]: value }));
    rotateCake();
    if (key === 'frosting') {
      animateFrosting();
    }
  };

  // Handle cake press for topping placement
  const handleCakePress = (event: any) => {
    if (selectedTopping && activeCategory === 'toppings') {
      const { locationX, locationY } = event.nativeEvent;
      const newTopping = {
        id: Date.now().toString(),
        emoji: selectedTopping,
        x: locationX - 15,
        y: locationY - 15,
        size: 20 + Math.random() * 10,
      };
      
      setCakeDesign(prev => ({
        ...prev,
        toppings: [...prev.toppings, newTopping]
      }));
      
      showSprinkleEffect();
      rotateCake();
    }
  };

  const resetCake = () => {
    Alert.alert(
      'Reset Cake',
      'Are you sure you want to start over?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setCakeDesign({
              base: 'round',
              flavor: 'vanilla',
              frosting: 'white',
              toppings: [],
            });
            setSelectedTopping(null);
          },
        },
      ]
    );
  };

  const saveCake = async () => {
    try {
      const savedCakes = await AsyncStorage.getItem('savedCakes');
      const cakes = savedCakes ? JSON.parse(savedCakes) : [];
      const newCake = {
        ...cakeDesign,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      cakes.push(newCake);
      await AsyncStorage.setItem('savedCakes', JSON.stringify(cakes));
      Alert.alert('Success!', 'Your cake design has been saved! 🎂');
    } catch (error) {
      Alert.alert('Error', 'Failed to save your cake design');
    }
  };

  const renderCakeShape = () => {
    const baseShape = cakeOptions.bases.find(b => b.id === cakeDesign.base);
    const flavorColor = cakeOptions.flavors.find(f => f.id === cakeDesign.flavor)?.color || '#F5DEB3';
    const frostingColor = cakeOptions.frostings.find(f => f.id === cakeDesign.frosting)?.color || '#FFFFFF';

    const centerX = CAKE_SIZE / 2;
    const centerY = CAKE_SIZE / 2;
    const radius = CAKE_SIZE * 0.35;

    switch (baseShape?.shape) {
      case 'circle':
        return (
          <Svg width={CAKE_SIZE} height={CAKE_SIZE}>
            {/* Base cake layer */}
            <SvgCircle cx={centerX} cy={centerY + 10} r={radius} fill={flavorColor} stroke="#8B4513" strokeWidth="2" />
            {/* Animated frosting layer */}
            <Animated.View style={{
              opacity: frostingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
              transform: [{
                scale: frostingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                })
              }]
            }}>
              <SvgCircle cx={centerX} cy={centerY} r={radius * 0.9} fill={frostingColor} stroke="#E0E0E0" strokeWidth="1" />
            </Animated.View>
          </Svg>
        );

      case 'square':
        return (
          <Svg width={CAKE_SIZE} height={CAKE_SIZE}>
            {/* Base cake layer */}
            <Rect 
              x={centerX - radius} 
              y={centerY - radius + 10} 
              width={radius * 2} 
              height={radius * 2} 
              fill={flavorColor} 
              stroke="#8B4513" 
              strokeWidth="2" 
              rx={10} 
            />
            {/* Animated frosting layer */}
            <Animated.View style={{
              opacity: frostingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
              transform: [{
                scale: frostingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                })
              }]
            }}>
              <Rect 
                x={centerX - radius * 0.9} 
                y={centerY - radius * 0.9} 
                width={radius * 1.8} 
                height={radius * 1.8} 
                fill={frostingColor} 
                stroke="#E0E0E0" 
                strokeWidth="1" 
                rx={8} 
              />
            </Animated.View>
          </Svg>
        );

      case 'heart':
        return (
          <Svg width={CAKE_SIZE} height={CAKE_SIZE}>
            {/* Base cake layer */}
            <Path
              d={`M${centerX},${centerY + radius * 0.3} 
                  C${centerX},${centerY - radius * 0.3} ${centerX - radius * 0.8},${centerY - radius * 0.8} ${centerX - radius * 0.4},${centerY - radius * 0.4}
                  C${centerX - radius * 0.2},${centerY - radius * 0.6} ${centerX + radius * 0.2},${centerY - radius * 0.6} ${centerX + radius * 0.4},${centerY - radius * 0.4}
                  C${centerX + radius * 0.8},${centerY - radius * 0.8} ${centerX},${centerY - radius * 0.2} ${centerX},${centerY + radius * 0.3} Z`}
              fill={flavorColor}
              stroke="#8B4513"
              strokeWidth="2"
            />
            {/* Animated frosting layer */}
            <Animated.View style={{
              opacity: frostingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
              transform: [{
                scale: frostingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                })
              }]
            }}>
              <Path
                d={`M${centerX},${centerY + radius * 0.2} 
                    C${centerX},${centerY - radius * 0.3} ${centerX - radius * 0.7},${centerY - radius * 0.7} ${centerX - radius * 0.3},${centerY - radius * 0.3}
                    C${centerX - radius * 0.1},${centerY - radius * 0.5} ${centerX + radius * 0.1},${centerY - radius * 0.5} ${centerX + radius * 0.3},${centerY - radius * 0.3}
                    C${centerX + radius * 0.7},${centerY - radius * 0.7} ${centerX},${centerY - radius * 0.3} ${centerX},${centerY + radius * 0.2} Z`}
                fill={frostingColor}
                stroke="#E0E0E0"
                strokeWidth="1"
              />
            </Animated.View>
          </Svg>
        );

      case 'star':
        const starPoints = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 144 - 90) * (Math.PI / 180);
          const outerRadius = radius;
          const innerRadius = radius * 0.5;
          
          // Outer point
          starPoints.push(`${centerX + outerRadius * Math.cos(angle)},${centerY + outerRadius * Math.sin(angle)}`);
          
          // Inner point
          const innerAngle = ((i * 144 + 36) - 90) * (Math.PI / 180);
          starPoints.push(`${centerX + innerRadius * Math.cos(innerAngle)},${centerY + innerRadius * Math.sin(innerAngle)}`);
        }
        
        return (
          <Svg width={CAKE_SIZE} height={CAKE_SIZE}>
            {/* Base cake layer */}
            <Polygon
              points={starPoints.join(' ')}
              fill={flavorColor}
              stroke="#8B4513"
              strokeWidth="2"
            />
            {/* Animated frosting layer */}
            <Animated.View style={{
              opacity: frostingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
              transform: [{
                scale: frostingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                })
              }]
            }}>
              <Polygon
                points={starPoints.map(point => {
                  const [x, y] = point.split(',').map(Number);
                  const adjustedX = centerX + (x - centerX) * 0.9;
                  const adjustedY = centerY + (y - centerY) * 0.9 - 5;
                  return `${adjustedX},${adjustedY}`;
                }).join(' ')}
                fill={frostingColor}
                stroke="#E0E0E0"
                strokeWidth="1"
              />
            </Animated.View>
          </Svg>
        );

      default:
        return (
          <Svg width={CAKE_SIZE} height={CAKE_SIZE}>
            <SvgCircle cx={centerX} cy={centerY + 10} r={radius} fill={flavorColor} stroke="#8B4513" strokeWidth="2" />
            <SvgCircle cx={centerX} cy={centerY} r={radius * 0.9} fill={frostingColor} stroke="#E0E0E0" strokeWidth="1" />
          </Svg>
        );
    }
  };

  const renderCategoryOptions = () => {
    const slideTransform = {
      transform: [
        {
          translateX: categorySlide.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
          }),
        },
      ],
      opacity: categorySlide.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0.5, 1],
      }),
    };

    return (
      <Animated.View style={slideTransform}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {activeCategory === 'base' &&
            cakeOptions.bases.map(base => (
              <TouchableOpacity
                key={base.id}
                onPress={() => updateCakeDesign('base', base.id)}
                className={`mr-3 p-4 rounded-2xl ${
                  cakeDesign.base === base.id ? 'bg-pink-100 border-2 border-pink-400' : 'bg-white'
                }`}
                style={{ minWidth: 80 }}
              >
                <Text className="text-center text-2xl mb-2">
                  {base.shape === 'circle' && '⭕'}
                  {base.shape === 'square' && '⬜'}
                  {base.shape === 'heart' && '💖'}
                  {base.shape === 'star' && '⭐'}
                </Text>
                <Text className="text-center text-sm font-medium">{base.name}</Text>
              </TouchableOpacity>
            ))}

          {activeCategory === 'flavor' &&
            cakeOptions.flavors.map(flavor => (
              <TouchableOpacity
                key={flavor.id}
                onPress={() => updateCakeDesign('flavor', flavor.id)}
                className={`mr-3 p-4 rounded-2xl ${
                  cakeDesign.flavor === flavor.id ? 'bg-pink-100 border-2 border-pink-400' : 'bg-white'
                }`}
                style={{ minWidth: 80 }}
              >
                <View
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: flavor.color }}
                />
                <Text className="text-center text-sm font-medium">{flavor.name}</Text>
              </TouchableOpacity>
            ))}

          {activeCategory === 'frosting' &&
            cakeOptions.frostings.map(frosting => (
              <TouchableOpacity
                key={frosting.id}
                onPress={() => {
                  updateCakeDesign('frosting', frosting.id);
                  animateFrosting();
                }}
                className={`mr-3 p-4 rounded-2xl ${
                  cakeDesign.frosting === frosting.id ? 'bg-pink-100 border-2 border-pink-400' : 'bg-white'
                }`}
                style={{ minWidth: 80 }}
              >
                <View
                  className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-gray-300"
                  style={{ backgroundColor: frosting.color }}
                />
                <Text className="text-center text-sm font-medium">{frosting.name}</Text>
              </TouchableOpacity>
            ))}

          {activeCategory === 'toppings' &&
            cakeOptions.toppings.map(topping => (
              <TouchableOpacity
                key={topping.id}
                onPress={() => setSelectedTopping(topping.emoji)}
                className={`mr-3 p-4 rounded-2xl ${
                  selectedTopping === topping.emoji ? 'bg-pink-100 border-2 border-pink-400' : 'bg-white'
                }`}
                style={{ minWidth: 80 }}
              >
                <Text className="text-center text-3xl mb-2">{topping.emoji}</Text>
                <Text className="text-center text-sm font-medium">{topping.name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#FFE4E6', '#FFF0F5', '#F8F4FF']}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#FF6B7A" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">Design Your Cake</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={resetCake} className="p-2">
              <RotateCcw size={20} color="#FF6B7A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveCake} className="p-2">
              <Save size={20} color="#FF6B7A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cake Display Area */}
        <View className="flex-1 justify-center items-center">
          {/* Plate */}
          <View className="relative">
            <Animated.View
              style={{
                opacity: sparkleAnimation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 1, 0.3],
                }),
              }}
            >
              <Svg width={PLATE_SIZE} height={40} style={{ position: 'absolute', bottom: -20, left: -(PLATE_SIZE - CAKE_SIZE) / 2 }}>
                <Ellipse cx={PLATE_SIZE / 2} cy={20} rx={PLATE_SIZE / 2 - 10} ry={15} fill="#E5E7EB" />
                <Ellipse cx={PLATE_SIZE / 2} cy={18} rx={PLATE_SIZE / 2 - 15} ry={12} fill="#F3F4F6" />
              </Svg>
            </Animated.View>
            
            {/* Cake */}
            <View 
              className="bg-white rounded-full shadow-lg" 
              style={{ 
                elevation: 10,
                width: CAKE_SIZE + 40,
                height: CAKE_SIZE + 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: cakeRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '5deg'],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={handleCakePress}
                  style={{ position: 'relative' }}
                >
                  {renderCakeShape()}
                  
                  {/* Toppings */}
                  {cakeDesign.toppings.map((topping) => (
                    <View
                      key={topping.id}
                      style={{
                        position: 'absolute',
                        left: topping.x,
                        top: topping.y,
                        transform: [{ scale: topping.size / 20 }],
                      }}
                    >
                      <Text style={{ fontSize: topping.size }}>{topping.emoji}</Text>
                    </View>
                  ))}
                  
                  {/* Sprinkle Effect */}
                  {showSprinkles && (
                    <View className="absolute inset-0 pointer-events-none">
                      {[...Array(10)].map((_, i) => (
                        <Text
                          key={i}
                          className="absolute text-yellow-400"
                          style={{
                            left: Math.random() * CAKE_SIZE,
                            top: Math.random() * CAKE_SIZE,
                            fontSize: 16,
                          }}
                        >
                          ✨
                        </Text>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Category Tabs */}
        <View className="px-6 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                onPress={() => switchCategory(category.id)}
                className={`mr-4 px-6 py-3 rounded-full flex-row items-center gap-2 ${
                  activeCategory === category.id ? 'bg-pink-400' : 'bg-white'
                }`}
              >
                {category.icon}
                <Text
                  className={`font-medium ${
                    activeCategory === category.id ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Options */}
        <View className="pb-8">
          {renderCategoryOptions()}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CakeDesigner;