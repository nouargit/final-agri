import { View, Text, Image, ImageSourcePropType } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AirbnbRating } from "react-native-ratings";
type CardProps = {
  src: ImageSourcePropType;
  title: string;
  desc: string;
  price: number;
};

export default function SwiperCard({ src, title, desc,price }: CardProps) {
  return (
    <View className="w-96 h-[480px] rounded-3xl overflow-hidden m-2">
      {/* Background image */}
      <Image
        source={src}
        className="w-full h-full"
        resizeMode="cover"

      />

      {/* Gradient overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        className="absolute bottom-0 left-0 right-0 h-[40%]"
      />

      {/* Text overlay */}
      <View className="absolute bottom-8 left-3">
        <Text className="text-white base-bold ">{title}</Text>
         {/* Rating */}
  <View className="mt-1">
    <AirbnbRating
      count={5}
      defaultRating={4}
      size={16}
      isDisabled
      showRating={false}
     
    />
  </View>
        <Text className="text-white text-sm mt-2">{desc}</Text>
      </View>
      {/* price overlay */}
      <View className="absolute top-3 right-3 p-3 bg-[#ff6370] rounded-3xl  items-center" >
            <Text className="text-slate-50 base-semibold">6520</Text>
      </View>
    </View>
  );
}
