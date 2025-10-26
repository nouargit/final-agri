import { ImageSourcePropType } from "react-native";

interface Category {
    id: number;
    name: string;
    image: ImageSourcePropType;
    bgColor: string;
    pp:number;  
}

const categoriesEN: Category[] = [
  {
    id: 1,
    name: 'Cakes',
    image: require('@/assets/images/pngwing.com (1).png'),
    bgColor: '#ba6545',
    pp:-35
  },
  {
    id: 2,
    name: 'Gatou',
    image: require('@/assets/images/bakion.png'),
    bgColor: '#f1d44d',
    pp:-20
  },
  {
    id: 3,
    name: 'Macaron',
    image: require('@/assets/images/macaron.png'),
    bgColor: '#c23dba',
    pp:-35
  },
  {
    id: 4,
    name: 'Snacks',
    image: require('@/assets/images/pngwing.com.png'),
    bgColor: '#3bc465',
    pp:-40
  },
]

export default categoriesEN;