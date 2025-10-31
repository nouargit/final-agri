import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';



function shopCreationForm() {

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [shopDiscreption, setShopDiscreption] = useState('');
    const [wilaya, setWilaya] = useState('');
    const [daira, setDaira] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shopImage, setShopImage] = useState<string | null>(null);

    // Configuration - matching your Laravel setup
    
    const pickImage = async () => {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "Permission to access camera roll is required!");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for shop logo
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setShopImage(result.assets[0].uri);
      }
    };

    const createShop = async () => {
      if (!name || !number || !shopDiscreption || !wilaya || !daira) {
        Alert.alert("Error", "Please fill in all fields including Wilaya and Daira");
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
        
        // Step 3: Create shop with FormData for image upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', shopDiscreption);
        formData.append('phone', number);
        formData.append('wilaya', wilaya);
        formData.append('daira', daira);

        // Add image if selected
        if (shopImage) {
          const imageUri = shopImage;
          const filename = imageUri.split('/').pop() || 'shop-image.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          formData.append('logo_image', {
            uri: imageUri,
            name: filename,
            type: type,
          } as any);
        }

        console.log("Shop data being sent with image:", { name, shopDiscreption, number, wilaya, daira, hasImage: !!shopImage });

        const response = await fetch(`${config.baseUrl}${config.shopsUrl}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        console.log("Request sent to:", `${config.baseUrl}${config.shopsUrl}`);
        //console.log("Request body:", JSON.stringify(shopData));
        console.log("Response status:", response.status);

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
                  setWilaya('');
                  setDaira('');
                  setShopImage(null);
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
      
      {/* Image Picker Section */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Shop Image
        </Text>
        <TouchableOpacity 
          onPress={pickImage}
          className="bg-white dark:bg-neutral-800 rounded-2xl p-4 mb-3 shadow-sm border-2 border-dashed border-gray-300 dark:border-neutral-600 items-center justify-center"
          style={{ minHeight: 120 }}
        >
          {shopImage ? (
            <View className="items-center">
              <Image 
                source={{ uri: shopImage }} 
                className="w-20 h-20 rounded-xl mb-2"
                resizeMode="cover"
              />
              <Text className="text-sm text-neutral-600 dark:text-neutral-400">
                Tap to change image
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <Text className="text-4xl text-neutral-400 mb-2">📷</Text>
              <Text className="text-sm text-neutral-600 dark:text-neutral-400">
                Tap to select shop image
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

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
      <TextInput
        placeholder="Wilaya"
        className="bg-white dark:bg-neutral-800 dark:text-white rounded-2xl p-4 mb-3 shadow-sm"
        value={wilaya}
        onChangeText={setWilaya}
      />
      <TextInput
        placeholder="Daira"
        className="bg-white dark:bg-neutral-800  dark:text-white rounded-2xl p-4 mb-3 shadow-sm"
        value={daira}
        onChangeText={setDaira}
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