import { ImageSourcePropType } from "react-native";
import {CakeSlice,CupSoda} from 'lucide-react-native'
interface Category {
  id: number;
  name: string;
  image: ImageSourcePropType;
  bgColor: string;
icon:any;
  pp: number;
}

const categoriesEN: Category[] = [
  {
    id: 1,
    name: 'Cakes',
    image: require('@/assets/images/pngwing.com (1).png'),
    bgColor: '#E48C6B', // warm caramel-orange

    pp: -35,
    icon: CakeSlice as any
  },
  {
    id: 2,
    name: 'Bevergerge',
    image: require('@/assets/images/bakion.png'),
    bgColor: '#F7D96E', // butter yellow
    pp: -20,
    icon: CupSoda
  },
  {
    id: 3,
    name: 'Macaron',
    image: require('@/assets/images/macaron.png'),
    bgColor: '#D980C7', // lavender-pink
    pp: -35,
    icon: CakeSlice
  },
  {
    id: 4,
    name: 'Snacks',
    image: require('@/assets/images/pngwing.com.png'),
    bgColor: '#7AD47A', // mint green
    pp: -40,
    icon: CakeSlice
  },
];

export default categoriesEN;
