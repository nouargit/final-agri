import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { images } from '@/constants/imports';

const PromoCard = () => {
  return (
    <View className="my-3">
      <View className="bg-red-500 dark:bg-red-600 rounded-3xl shadow-2xl overflow-visible">
        
        {/* تعديل الأبعاد لتكون أصغر */}
        <Image
          source={images.branche}
          className="absolute -top-6 -right-4 w-28 h-28 rounded-xl border-4 border-white shadow-lg z-10"
          resizeMode="contain"
        />

        <View className="p-6 pr-32"> {/* خفف المساحة الجانبية */}
          <Text className="text-white text-lg font-gilroy-semibold opacity-90">
            عرض خاص
          </Text>

          <Text className="text-white text-2xl font-gilroy-extrabold mt-2 leading-tight">
            خصم 30%{'\n'}على الخضروات
          </Text>

          <Text className="text-white/80 text-sm mt-3 font-gilroy-medium">
            استخدم الكود: خضروات30 • لفترة محدودة
          </Text>

          <TouchableOpacity className="mt-4 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full self-start">
            <Text className="text-white font-gilroy-bold text-sm">تسوق الآن</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PromoCard;