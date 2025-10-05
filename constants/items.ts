import { images } from '@/constants/imports';
export type Item = {
  id: number;
  name: string;
  image: any;
  price: number;
  category: string;
}
const items = [
    {
        id:1,
        name:"Cake",
        image:require("../assets/images/macrot.jpg"),
        price:100,
        category:"Traditional",
    },
    {
        id:2,
        name:"Cake2",
        image:require("../assets/images/panCake (Custom) (1).jpg"),
        price:100,
        category:"Cake",
    },
    {
        id:3,
        name:"Cake2",
        image:require("../assets/images/patesry.jpg"),
        price:100,
        category:"Cake",
    },
    {
        id:4,
        name:"Cake2",
        image:require("../assets/images/jr-r-90HdOlGbjck-unsplash.jpg"),
        price:100, 
        category:"Cake",
    },
    {
        id:5,
        name:"Cake2",
        image:require("../assets/images/download.jpg"),
        price:100, 
        category:"Cake",
    },
     {
        id:6,
        name:"Cake2",
        image:require("../assets/images/pushpak-dsilva-2UeBOL7UD34-unsplash.jpg"),
        price:100, 
        category:"Cake",
    },
     {
        id:7,
        name:"Cake2",
        image:require("../assets/images/pexels-pixabay-461431.jpg"),
        price:100, 
        category:"Cake",
    },
     {
        id:8,
        name:"Cake2",
        image:require("../assets/images/20220224_220743.jpg"),
        price:100, 
        category:"Cake",
    },
     {
        id:9,
        name:"Cake2",
        image:require("../assets/images/pexels-suzyhazelwood-1126359.jpg"),
        price:100, 
        category:"Cake",
    },
     {
        id:10,
        name:"Cake2",
        image:require("../assets/images/koraibia.jpg"),
        price:100, 
        category:"Traditional",
    },
    {
        id:11,
        name:"Cake2",
        image:require("../assets/images/simpel.jpg"),
        price:100, 
        category:"Traditional",
    },
     {
        id:12,
        name:"Cake2",
        image:require("../assets/images/chrek.jpg"),
        price:100, 
        category:"Traditional",
    },
    
]
export default items;
