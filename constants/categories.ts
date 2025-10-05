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
    bgColor: '#ece0d9',
    pp:-35
  },
  {
    id: 2,
    name: 'Gatou',
    image: require('@/assets/images/bakion.png'),
    bgColor: '#fce0be',
    pp:-20
  },
  {
    id: 3,
    name: 'Macaron',
    image: require('@/assets/images/macaron.png'),
    bgColor: '#f7deee',
    pp:-35
  },
  {
    id: 4,
    name: 'Snacks',
    image: require('@/assets/images/pngwing.com.png'),
    bgColor: '#E2FCE2',
    pp:-40
  },
]

export default categoriesEN;