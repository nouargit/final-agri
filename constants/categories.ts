import { ImageSourcePropType } from "react-native";
import {Carrot,Cherry,Sprout,Wheat,TextAlignJustify} from 'lucide-react-native'
interface Category {
  id: number;
  name: string;

  bgColor: string;
    icon:any;
  pp: number;
}

const categoriesEN: Category[] = [
  {
    id: 0,
    name: 'All',

    bgColor: '#7AD47A', // butter yellow
    pp: -20,
    icon: TextAlignJustify
  },
  {
    id: 1,
    name: 'vegetables',

    bgColor: '#ffc072', // warm caramel-orange

    pp: -35,
    icon: Carrot as any
  },
  {
    id: 2,
    name: 'Fruits',
       
    bgColor: '#e28a86', // butter yellow
    pp: -20,
    icon: Cherry
  },
  {
    id: 3,
    name: 'Seeds',

    bgColor: '#F7D96E', // lavender-pink
    pp: -35,
    icon: Sprout
  },
  {
    id: 4,
    name: 'Grains',
       
    bgColor: '#7AD47A', // mint green
    pp: -40,
    icon: Wheat 
  },
];

export default categoriesEN;
