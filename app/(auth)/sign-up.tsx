import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native';
import { router } from 'expo-router';

const sign_up = () => {
  return (
    <View>
      <Text>sign up</Text>
         <Button title='sign in' onPress={() => router.push("/sign-in" as any)}/>
    </View>
  )
}

export default sign_up