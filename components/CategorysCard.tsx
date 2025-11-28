import { View, Image,Text, ImageSourcePropType, TouchableOpacity } from 'react-native'


interface Category {
  icon: any
  id: number
  name: string
  
  bgColor: string
  pp:number
  
}

type CategoryCardProps = {
  category: Category
  vibration:()=>void
}

const CategoryCard = ({ category,vibration }: CategoryCardProps) => {
  return (
    
    <TouchableOpacity
      className="  dark:border   rounded-3xl  justify-between mx-2 overflow-hidden px-2 "
      style={{  backgroundColor:`${category.bgColor}30`,
    borderColor: category.bgColor,
    borderWidth: 4,shadowColor: category.bgColor,
     }}
     onPress={()=>vibration()}
    > 

     
     {/* category Name */}
    <View className="flex-row items-center" >
      {/* category Icon */}
       <category.icon color={category.bgColor} />
      <Text className=" p-2 paragraph-bold text-zinc-800 dark:text-white" >
       
      
        {category.name}
      </Text> 
     </View>
   
    
      
      
     

     
     
    </TouchableOpacity>
  )
}

export default CategoryCard
