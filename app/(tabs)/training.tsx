import { StyleSheet, Text, View, ScrollView, ImageBackground, Image, Button, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react'
const Training = () => {
  const [x, setX] = useState(0)
useEffect(()=>{
    
  console.log(x)
},[x])
  return (
    <View className='flex-1 bg-white '>
         <Button
          title='Training'
          
         onPress={() => {
            setX(x =>x+1)
            
          }} />
     { x >= 0 &&<TouchableOpacity onPress={()=>{
      setX(x =>x-1)
     }}>
      <View className='mx-auto mt-4 flex items-center justify-center h-60 w-full bg-red-600 rounded-xl'>
        <Text className='text-white text-2xl'>{x}</Text>
         
       
      </View>
     </TouchableOpacity>}
      <Text className='text-3xl'>{x}</Text>


      <ScrollView className='mt-10'>
     
        
      </ScrollView>
    </View>
  )
}

export default Training

/*const images = [
  require('../../assets/images/download (5).jpg'),
  require('../../assets/images/download (4).jpg'),
  require('../../assets/images/download (4).png'),
  require('../../assets/images/download (3).png')
];*/
