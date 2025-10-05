import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import { images } from '@/constants/imports'
import { useAuth } from '@/stors/Auth'

function profile() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Profile</Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-1">
            {user?.email || 'Welcome back'}
          </Text>
        </View>

        {/* Avatar & Name */}
        <View className="items-center mt-2">
          <Image
            source={user?.avatar ? { uri: user.avatar } : images.avatar}
            className="w-24 h-24 rounded-full border-2 border-neutral-200 dark:border-neutral-700"
          />
          <Text className="text-lg font-bold text-neutral-900 dark:text-white mt-2">
            {user?.name || 'Guest'}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between px-6 mt-6">
          <View className="flex-1 mx-1 bg-white dark:bg-neutral-800 rounded-2xl p-4 items-center">
            <Text className="text-neutral-900 dark:text-white font-bold text-lg">12</Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-xs">Orders</Text>
          </View>
          <View className="flex-1 mx-1 bg-white dark:bg-neutral-800 rounded-2xl p-4 items-center">
            <Text className="text-neutral-900 dark:text-white font-bold text-lg">4</Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-xs">Favorites</Text>
          </View>
          <View className="flex-1 mx-1 bg-white dark:bg-neutral-800 rounded-2xl p-4 items-center">
            <Text className="text-neutral-900 dark:text-white font-bold text-lg">3</Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-xs">In Cart</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="px-6 mt-6">
          <TouchableOpacity className="bg-gray-900 dark:bg-white rounded-xl py-3 items-center mb-3">
            <Text className="text-white dark:text-gray-900 font-semibold">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-100 dark:bg-neutral-800 rounded-xl py-3 items-center">
            <Text className="text-gray-900 dark:text-white font-semibold">Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default profile