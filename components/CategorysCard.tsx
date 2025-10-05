import { View, Text, Image, ImageSourcePropType } from 'react-native'


interface Category {
  id: number
  name: string
  image: ImageSourcePropType
  bgColor: string
  pp:number
}

type CategoryCardProps = {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <View
      className="w-28 h-36 rounded-3xl items-center justify-between mx-2 p-3 overflow-hidden "
      style={{ backgroundColor: category.bgColor }}
    > 
     {/* category Name */}
    
    <Text className=" mt-4 paragraph-bold text-black">
        {category.name}
      </Text> 
      {/* category Image */}
      <Image
        source={category.image}
        className="absolute w-32 h-32 "
        resizeMode="contain"
        style={{ bottom: category.pp }}
        
      />

     
     
    </View>
  )
}

export default CategoryCard
