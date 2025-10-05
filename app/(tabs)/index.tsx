import HomeScreenCards from '@/app/home';
import cn from 'clsx';
import { FlatList, Image, Pressable, Text, View, TouchableOpacity } from 'react-native';
import CartButton from '@/components/CartButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import {icons} from '@/constants/imports';
import useAuthStore from '@/stors/Auth';
export default function HomeScreen() {
  const {user} = useAuthStore();

  return (
    <SafeAreaView className="flex-1">
      <View className='flex-between flex-row my-5 px-5 w-full '>
        <View className='flex-start'>
          <Text className='small-bold text-primary'>
           DELIVER TO
          </Text>
          <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                              <Text className="paragraph-bold text-dark-100">Croatia</Text>
                              <Image source={icons.downArrow} className="size-3" resizeMode="contain" />
                          </TouchableOpacity>

        </View>
        <Text >
          <CartButton/>
        </Text>
      </View>
      <FlatList
        data={HomeScreenCards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <Pressable
              className={cn(
                "offer-card",
                isEven ? "flex-row" : "flex-row-reverse"
              )}
              style={{ backgroundColor: item.color }}
              android_ripple={{ color: "#ffffff22" }}
            >
              <View className={cn("flex-1", isEven ? "flex-row" : "flex-row-reverse")}>
                {/* Image Section */}
                <View className="w-1/2 h-full">
                  <Image
                    source={item.image}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>

                {/* Info Section */}
                <View className="w-1/2 h-full flex justify-center px-4">
                  <Text className="text-white text-2xl font-quicksand-bold leading-tight">
                    {item.title}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 20,
        }}
      />
    </SafeAreaView>
  );
}
