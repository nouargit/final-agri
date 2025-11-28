import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { router, useLocalSearchParams } from 'expo-router';
import { Leaf } from "lucide-react-native";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";

export default function ProducerDetails() {
  const params = useLocalSearchParams();
  const fullname = params.fullname as string || "";
  const phone = params.phone as string || "";

  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [productTypes, setProductTypes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!farmName.trim()) {
      Alert.alert("Error", "Please enter your farm name");
      return;
    }

    if (!farmLocation.trim()) {
      Alert.alert("Error", "Please enter your farm location");
      return;
    }

    if (!farmSize.trim()) {
      Alert.alert("Error", "Please enter your farm size");
      return;
    }

    if (!productTypes.trim()) {
      Alert.alert("Error", "Please enter the types of products you grow");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Send complete producer registration data to API
      const producerData = {
        fullname,
        phone,
        role: "producer",
        farmName,
        farmLocation,
        farmSize,
        productTypes,
      };
      
      console.log("Producer registration data:", producerData);
      
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 pt-16">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="bg-primary/10 p-6 rounded-full mb-4">
                <Leaf size={48} color="#22680C" />
              </View>
              <Text className="text-3xl font-gilroy-bold text-neutral-900 text-center">
                Tell us about your farm
              </Text>
              <Text className="text-base text-neutral-600 text-center mt-3 px-4">
                Help buyers find and connect with you
              </Text>
            </View>

            {/* Form Inputs */}
            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Farm Name
              </Text>
              <CustomInput
                placeholder="e.g., Green Valley Farm"
                value={farmName}
                onChangeText={setFarmName}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Farm Location
              </Text>
              <CustomInput
                placeholder="e.g., Wilaya, Daira"
                value={farmLocation}
                onChangeText={setFarmLocation}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Farm Size (hectares)
              </Text>
              <CustomInput
                placeholder="e.g., 5"
                value={farmSize}
                onChangeText={setFarmSize}
             
              />
            </View>

            <View className="mb-8">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Product Types
              </Text>
              <CustomInput
                placeholder="e.g., Vegetables, Fruits, Grains"
                value={productTypes}
                onChangeText={setProductTypes}
              />
              <Text className="text-xs text-neutral-500 mt-1">
                Separate multiple types with commas
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
