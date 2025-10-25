import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

function shopCreationForm() {

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [shopDiscreption, setShopDiscreption] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Configuration - matching your Laravel setup
    const config = {
      baseUrl: 'http://10.142.232.194:8000',
      csrfTokenUrl: '/sanctum/csrf-cookie',
      shopsUrl: '/api/shops',
    };

    const createShop = async () => {
      if (!name || !number || !shopDiscreption) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      setIsSubmitting(true);

      try {
        console.log("Step 1: Fetching CSRF token...");
        
        // Step 1: Get CSRF token
        const csrfResponse = await fetch(`${config.baseUrl}${config.csrfTokenUrl}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!csrfResponse.ok) {
          throw new Error(`CSRF fetch failed: ${csrfResponse.status}`);
        }

        console.log("Step 2: Getting auth token...");
        
        // Step 2: Get stored auth token
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          Alert.alert("Error", "Please login first");
          router.replace('/(auth)/sign-in');
          return;
        }

        console.log("Step 3: Creating shop...");
        
        // Step 3: Create shop
        const shopData = {
          name: name,
          description: shopDiscreption, // Fixed typo: description instead of discreption
          phone: number,
        };

        const response = await fetch(`${config.baseUrl}${config.shopsUrl}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(shopData),
        });

        const responseData = await response.json();
        console.log("Shop creation response:", responseData);

        if (response.ok) {
          Alert.alert(
            "Success", 
            "Shop created successfully!",
            [
              {
                text: "OK",
                onPress: () => {
                  // Clear form
                  setName('');
                  setNumber('');
                  setShopDiscreption('');
                  // Navigate back or to shop management
                  router.back();
                }
              }
            ]
          );
        } else {
          // Handle validation errors
          if (responseData.errors) {
            const errorMessages = Object.values(responseData.errors).flat().join('\n');
            Alert.alert("Validation Error", errorMessages);
          } else {
            Alert.alert("Error", responseData.message || "Failed to create shop");
          }
        }
      } catch (error) {
        console.error("Shop creation error:", error);
        Alert.alert("Error", "Network error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <View className='mx-7'> 
    <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
        {name}
      </Text>
      <TextInput
        placeholder="Shop Name"
        className="bg-white dark:bg-neutral-800 dark:text-white rounded-2xl p-4 mb-3 shadow-sm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Shop Description"
        className="bg-white dark:bg-neutral-800 dark:text-white rounded-2xl p-4 mb-3 shadow-sm"
        value={shopDiscreption}
        onChangeText={setShopDiscreption}
        multiline
        numberOfLines={3}
      />
      <TextInput
        placeholder="Phone Number"
        className="bg-white dark:bg-neutral-800 dark:text-white rounded-2xl p-4  mb-3 shadow-sm"
        value={number}
        onChangeText={setNumber}
        keyboardType="phone-pad"
      />
    
    <TouchableOpacity 
      className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#FF6F61]'} dark:bg-[#FF6F61] rounded-2xl p-4 flex-row items-center justify-center shadow-lg`}
      onPress={createShop}
      disabled={isSubmitting}
    >
      <Text className="text-white font-bold text-lg">
        {isSubmitting ? 'Creating Shop...' : 'Create Shop'}
      </Text>
    </TouchableOpacity>
    </View>
  )
}

export default shopCreationForm