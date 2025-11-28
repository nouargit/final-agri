import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Camera, Truck } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function TransporterDetails() {
  const params = useLocalSearchParams();
  const fullname = params.fullname as string || "";
  const phone = params.phone as string || "";

  const [vehicleType, setVehicleType] = useState<"truck" | "van" | "motorcycle" | "other">("truck");
  const [plateNumber, setPlateNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefrigerated, setIsRefrigerated] = useState(false);
  const [vehiclePhoto, setVehiclePhoto] = useState<any | null>(null);
  const [licensePhoto, setLicensePhoto] = useState<any | null>(null);

  const vehicleTypes = [
    { value: "truck", label: "Truck" },
    { value: "van", label: "Van" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "other", label: "Other" },
  ];

  const pickImage = async (setter: (asset: any | null) => void) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant gallery permissions to select a photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      } as any);
      if (!result.canceled && result.assets && result.assets[0]) {
        setter(result.assets[0]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleSubmit = async () => {
    if (!plateNumber.trim()) {
      Alert.alert("Error", "Please enter your vehicle plate number");
      return;
    }

    if (!capacity.trim()) {
      Alert.alert("Error", "Please enter your vehicle capacity");
      return;
    }
    if (!vehiclePhoto) {
      Alert.alert('Error', 'Please select your vehicle photo');
      return;
    }
    if (!licensePhoto) {
      Alert.alert('Error', 'Please select your license photo');
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert('Error', 'You must be signed in.');
        setIsLoading(false);
        return;
      }

      const fd = new FormData();
      fd.append('plateNumber', plateNumber.trim());
      fd.append('loadCapacityInKg', String(Number(capacity)));
      fd.append('isRefrigerated', isRefrigerated ? 'true' : 'false');

      const toFile = (asset: any) => {
        const uri: string = asset.uri;
        const name: string = asset.fileName || asset.name || 'photo.jpg';
        const type: string = asset.mimeType || asset.type || 'image/jpeg';
        return { uri, name, type } as any;
      };

      fd.append('vehiclePhoto', toFile(vehiclePhoto));
      fd.append('licensePhoto', toFile(licensePhoto));

      const res = await fetch(`${config.baseUrl}${config.transporterOnboardingStep2Url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          // Do not set Content-Type, RN will set boundary for multipart
        },
        body: fd,
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`Onboarding step 2 failed (${res.status}): ${text.substring(0, 200)}`);
      }

      Alert.alert('Success', 'Transporter profile completed!');
      router.replace('/(tabs)');
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 pt-16">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="bg-primary/10 p-6 rounded-full mb-4">
                <Truck size={48} color="#22680C" />
              </View>
              <Text className="text-3xl font-gilroy-bold text-neutral-900 text-center">
                Vehicle Information
              </Text>
              <Text className="text-base text-neutral-600 text-center mt-3 px-4">
                Tell us about your transportation service
              </Text>
            </View>

            {/* Vehicle Type Selection */}
            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Vehicle Type
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {vehicleTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    onPress={() => setVehicleType(type.value as any)}
                    className={`px-6 py-3 rounded-xl border-2 ${
                      vehicleType === type.value 
                        ? "border-primary bg-primary/10" 
                        : "border-neutral-200 bg-white"
                    }`}
                  >
                    <Text className={`font-gilroy-semibold ${
                      vehicleType === type.value ? "text-primary" : "text-neutral-700"
                    }`}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Form Inputs */}
            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Vehicle Plate Number
              </Text>
              <CustomInput
                placeholder="e.g., ABC-1234-56"
                value={plateNumber}
                onChangeText={(text) => setPlateNumber(text.toUpperCase())}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Capacity (kg)
              </Text>
              <CustomInput
                placeholder="e.g., 500"
                value={capacity}
                onChangeText={setCapacity}
               
              />
            </View>

            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-sm font-gilroy-semibold text-neutral-700">
                Refrigerated Vehicle
              </Text>
              <Switch value={isRefrigerated} onValueChange={setIsRefrigerated} />
            </View>

            {/* Photos */}
            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Vehicle Photo
              </Text>
              {vehiclePhoto ? (
                <View className="flex-row items-center gap-3">
                  <Image source={{ uri: vehiclePhoto.uri }} style={{ width: 80, height: 80, borderRadius: 12 }} />
                  <TouchableOpacity className="px-4 py-2 rounded-xl bg-primary" onPress={() => pickImage(setVehiclePhoto)}>
                    <Text className="text-white">Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity className="px-4 py-3 rounded-xl border-2 border-dashed border-neutral-300 flex-row items-center gap-2" onPress={() => pickImage(setVehiclePhoto)}>
                  <Camera size={20} color="#22680C" />
                  <Text className="text-neutral-700">Select vehicle photo</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="mb-8">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                License Photo
              </Text>
              {licensePhoto ? (
                <View className="flex-row items-center gap-3">
                  <Image source={{ uri: licensePhoto.uri }} style={{ width: 80, height: 80, borderRadius: 12 }} />
                  <TouchableOpacity className="px-4 py-2 rounded-xl bg-primary" onPress={() => pickImage(setLicensePhoto)}>
                    <Text className="text-white">Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity className="px-4 py-3 rounded-xl border-2 border-dashed border-neutral-300 flex-row items-center gap-2" onPress={() => pickImage(setLicensePhoto)}>
                  <Camera size={20} color="#22680C" />
                  <Text className="text-neutral-700">Select license photo</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="mb-8">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Service Area
              </Text>
              <CustomInput
                placeholder="e.g., Algiers, Blida, Boumerdes"
                value={serviceArea}
                onChangeText={setServiceArea}
              />
              <Text className="text-xs text-neutral-500 mt-1">
                Separate multiple areas with commas
              </Text>
            </View>

            {/* Submit Button */}
            <CustomButton 
              title="Complete Registration" 
              isLoading={isLoading} 
              onPress={handleSubmit} 
            />

            {/* Info Text */}
            <View className="mt-6 mb-8">
              <Text className="text-sm text-neutral-600 text-center">
                You can update these details later in your profile
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
