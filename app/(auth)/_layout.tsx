import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'

export default function _layout() {
  return (
    <View>
        <SafeAreaView>
            <Text>Auth Layout</Text>
            <Slot />
        </SafeAreaView>
    </View>
  )
}