import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native';
import { router } from 'expo-router';

const sign_in = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Button title='sign up' onPress={() => router.push("/sign-up" as any)}/>
        
    </View>
  )
}

export default sign_in