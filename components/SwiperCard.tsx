import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

interface SwiperCardProps {
  product : {
    image: any;
    name: string;
    description: string;
    price: number;
  };
}

const SwiperCard = ({ product }: SwiperCardProps) => {
  const windowWidth = Dimensions.get('window').width;

  return (
    <View>
      <View style={{ width: windowWidth * 0.93, height: windowWidth * 1.5, marginBottom: 12 }}>
        <Image
          source={product.image}
          resizeMode="cover"
          style={styles.image}
        />

        {/* 🔥 Bottom Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        {/* 🔥 Text on Gradient */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{product.name}</Text> 
          <Text style={styles.desc}>{product.description}</Text>
          <Text style={styles.price}>${product.price}</Text>
        </View>
      </View>
    </View>
  );
};

export default SwiperCard;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    height: '45%',
    width: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 16,
    width: '100%',
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  desc: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 4,
  },
  price: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
});
