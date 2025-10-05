import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'

import cn from 'clsx'

interface CustomButtonProps {
  onPress?: () => void;
  title?: string;
  style?: string;
  textStyle?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const CustomButton = ({onPress,title,style,textStyle,isLoading=false,leftIcon}: CustomButtonProps) => {


  return (
    <TouchableOpacity onPress={onPress} className={cn('h-[50px] bg-[#ff6370] rounded-xl justify-center items-center mb-4 pb-6',style)}>
{leftIcon}
<View className='flex-center flex-row'>
  {isLoading ? (
    <ActivityIndicator size="small" color="white" />
  ) : (
    <Text className={cn('text-white-100 paragraph-semibold', textStyle)}></Text>
  )}
</View>

      <Text className={cn('text-white text-center text-base font-quicksand-bold',textStyle)}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton