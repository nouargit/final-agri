import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView,Image } from 'react-native';
import { images } from '../../constants/imports';
import cn from 'clsx';
import { router } from 'expo-router';
export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'producer',
      icon: '🌱',
      title: 'Producer',
      description: 'Sells crops and agricultural goods.',
    },
    {
      id: 'buyer',
      icon: '📦',
      title: 'Buyer',
      description: 'Purchases goods directly from producers.',
    },
    {
      id: 'transporter',
      icon: '🚚',
      title: 'Transporter',
      description: 'Delivers goods between parties.',
    },
  ];
  
 
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-5 pt-8">
        {/* Header */}
        <View className="items-center mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-1">
            Your Role
          </Text>
        </View>

        {/* Illustration Area */}
        <View className="bg-green-100 rounded-2xl p-8 mb-6 items-center justify-center" style={{ minHeight: 180 }}>
          <Image source={images.frame} resizeMode='contain' className='w-40 h-40' />
          
        </View>

        {/* Title and Description */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 text-center mb-2">
            Who Are You on AgriConnect?
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            Choose your role to tailor your experience.
          </Text>
        </View>

        {/* Role Options */}
        <View className="mb-6 border border-gray-200 rounded-3xl">
          {roles.map((role, index) => (

            <TouchableOpacity
              key={role.id}
              onPress={() => setSelectedRole(role.id)}
              className={cn(`flex-row items-center p-4 border ${
  selectedRole === role.id
    ? 'border-green-700 bg-green-50'
    : 'border-gray-200 bg-white'
} ${
  index === 0 ? 'rounded-t-3xl' : 
  index === 2 ? 'rounded-b-3xl' : 
  ''
}`)}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View className={`w-12 h-12 rounded-lg items-center justify-center mr-4 ${
                role.id === 'producer' ? 'bg-green-100' : 
                role.id === 'buyer' ? 'bg-green-100' : 
                'bg-green-100'
              }`}>
                <Text className="text-2xl">{role.icon}</Text>
              </View>
              
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  {role.title}
                </Text>
                <Text className="text-sm text-gray-500">
                  {role.description}
                </Text>
              </View>
              
             <View className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
  selectedRole === role.id
    ? 'border-green-700 bg-green-700'
    : 'border-gray-300'
}`}>
  {selectedRole === role.id && (
    <Text className="text-white text-xs font-bold">✓</Text>
  )}
</View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${
            selectedRole ? 'bg-green-700' : 'bg-gray-300'
          }`}
          disabled={!selectedRole}
          onPress={() => {
            if (selectedRole === 'producer') {
              router.push('/producer');
            } else if (selectedRole === 'buyer') {
              router.push('/buyer');
            } else if (selectedRole === 'transporter') {
              router.push('/transporter');
            }
          }}
        >
          <Text className="text-white text-base font-semibold">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}