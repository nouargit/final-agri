import CustomButton from "@/components/CustomButton";
import { config } from "@/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Camera, Map, MapPin } from "lucide-react-native";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function ProducerDetails() {
  const params = useLocalSearchParams();
  const fullname = params.fullname as string || "";
  const phone = params.phone as string || "";

  // Hardcoded values
  const hardcodedCityId = "1";
  const hardcodedAddress = "Farm Address, Algeria";

  // User input values
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 36.7538,
    longitude: 3.0588,
  });
  const [licensePhoto, setLicensePhoto] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const selectedFile = licensePhoto ? {
    uri: licensePhoto.uri,
    name: 'license.jpg',
    type: 'image/jpeg',
  } : null;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload your license photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLicensePhoto(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
   

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please sign in again.');
        router.replace('/sign-in');
        return;
      }
      console.log("Submitting picture", selectedLocation);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('cityId', '2');
      formData.append('address', hardcodedAddress.trim());
      formData.append('longitude', selectedLocation.longitude.toString().trim());
      formData.append('latitude', selectedLocation.latitude.toString().trim());
      
      // Note: File upload would require expo-image-picker or similar
      // For now, we'll skip the file in development
      formData.append('farmerLicensePhoto', selectedFile as any);

      const response = await fetch(`${config.baseUrl}${config.onboardingStep2Url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Don't set Content-Type, let browser set it with boundary for multipart
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'VALIDATION_ERROR' && data.issues) {
          const errors = Object.values(data.issues).flat().join('\n');
          Alert.alert('Validation Error', errors);
        } else if (data.code === 'ON_BOARDING_STEP_2_ALREADY_COMPLETED') {
          Alert.alert('Info', 'You have already completed onboarding.');
          router.replace('/(tabs)');
        } else {
          Alert.alert('Error', data.message || 'Failed to complete onboarding');
        }
        return;
      }

      Alert.alert("Success", "Producer profile created successfully!");
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
          {/* Header */}
          <View className="items-center px-6 pt-16 pb-4">
            <View className="bg-primary/10 p-6 rounded-full mb-4">
              <MapPin size={48} color="#22680C" />
            </View>
            <Text className="text-3xl font-gilroy-bold text-neutral-900 text-center">
              Select Farm Location
            </Text>
            <Text className="text-base text-neutral-600 text-center mt-3">
              Tap on the map to set your farm location
            </Text>
          </View>

          {/* Map */}
          <View className="mx-6 mb-4 rounded-2xl overflow-hidden border-2 border-gray-200" style={{ height: 300 }}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={selectedLocation}
                title="Farm Location"
                description={`Lat: ${selectedLocation.latitude.toFixed(6)}, Lng: ${selectedLocation.longitude.toFixed(6)}`}
              />
            </MapView>
            
            {/* Open Full Map Button Overlay */}
            <TouchableOpacity
              onPress={() => setShowMapModal(true)}
              className="absolute bottom-4 right-4 bg-primary px-4 py-3 rounded-xl shadow-lg flex-row items-center"
            >
              <Map size={20} color="white" />
              <Text className="text-white font-gilroy-bold ml-2">Open Map</Text>
            </TouchableOpacity>
          </View>

          {/* Coordinates Display */}
          <View className="mx-6 mb-4 p-4 bg-gray-50 rounded-xl">
            <Text className="text-sm font-gilroy-semibold text-gray-700 mb-2">
              Selected Coordinates
            </Text>
            <Text className="text-base text-gray-900">
              Latitude: {selectedLocation.latitude.toFixed(6)}
            </Text>
            <Text className="text-base text-gray-900">
              Longitude: {selectedLocation.longitude.toFixed(6)}
            </Text>
          </View>

          {/* License Photo Upload */}
          <View className="mx-6 mb-4">
            <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
              Farmer License Photo
            </Text>
            <TouchableOpacity
              onPress={pickImage}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center justify-center bg-gray-50"
            >
              {licensePhoto ? (
                <View className="items-center">
                  <Camera size={32} color="#22680C" />
                  <Text className="text-primary font-gilroy-semibold mt-2">
                    Photo Selected ✓
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    Tap to change
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Camera size={32} color="#9CA3AF" />
                  <Text className="text-gray-600 font-gilroy-semibold mt-2">
                    Upload License Photo
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    Required for verification
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <View className="mx-6 mb-6">
            <CustomButton 
              title="Complete Registration" 
              isLoading={isLoading} 
              onPress={handleSubmit} 
            />
          </View>

          {/* Info Text */}
          <View className="mx-6 mb-8">
            <Text className="text-sm text-neutral-600 text-center">
              You can update these details later in your profile
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Full Screen Map Modal */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <View className="flex-1 bg-white">
          {/* Map Header */}
          <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-gilroy-bold text-gray-900">
                  Select Farm Location
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Tap anywhere on the map
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowMapModal(false)}
                className="bg-primary px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-gilroy-semibold">Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Full Map */}
          <MapView
            provider={PROVIDER_GOOGLE}
            className="flex-1"
            initialRegion={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
          >
            <Marker
              coordinate={selectedLocation}
              title="Farm Location"
              description={`Lat: ${selectedLocation.latitude.toFixed(6)}, Lng: ${selectedLocation.longitude.toFixed(6)}`}
              draggable
              onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
            />
          </MapView>

          {/* Coordinates Display Bottom Sheet */}
          <View className="bg-white px-6 py-4 border-t border-gray-200">
            <Text className="text-sm font-gilroy-semibold text-gray-700 mb-2">
              Selected Coordinates
            </Text>
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-xs text-gray-500 mb-1">Latitude</Text>
                <Text className="text-base font-gilroy-semibold text-gray-900">
                  {selectedLocation.latitude.toFixed(6)}
                </Text>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-xs text-gray-500 mb-1">Longitude</Text>
                <Text className="text-base font-gilroy-semibold text-gray-900">
                  {selectedLocation.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
