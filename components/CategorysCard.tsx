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
      className="w-28  dark:border   rounded-3xl items-center justify-between mx-2 overflow-hidden "
      style={{  backgroundColor:`${category.bgColor}33`,
    borderColor: category.bgColor,
    borderWidth: 4 }}
    > 
     {/* category Name */}
    
    <Text className=" p-3 paragraph-bold text-black dark:text-white">
        {category.name}
      </Text> 
      {/* category Image */}
     

     
     
    </View>
  )
}

export default CategoryCard
