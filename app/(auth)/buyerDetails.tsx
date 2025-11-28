import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { router, useLocalSearchParams } from 'expo-router';
import { ShoppingBag } from "lucide-react-native";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function BuyerDetails() {
  const params = useLocalSearchParams();
  const fullname = params.fullname as string || "";
  const phone = params.phone as string || "";

  const [address, setAddress] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [preferredCategories, setPreferredCategories] = useState("");
  const [businessType, setBusinessType] = useState<"individual" | "business">("individual");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!address.trim()) {
      Alert.alert("Error", "Please enter your delivery address");
      return;
    }

    if (!wilaya.trim()) {
      Alert.alert("Error", "Please enter your wilaya");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Send complete buyer registration data to API
      const buyerData = {
        fullname,
        phone,
        role: "buyer",
        address,
        wilaya,
        preferredCategories,
        businessType,
      };
      
      console.log("Buyer registration data:", buyerData);
      
      Alert.alert("Success", "Buyer profile created successfully!");
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
                <ShoppingBag size={48} color="#22680C" />
              </View>
              <Text className="text-3xl font-gilroy-bold text-neutral-900 text-center">
                Setup your profile
              </Text>
              <Text className="text-base text-neutral-600 text-center mt-3 px-4">
                Help us personalize your shopping experience
              </Text>
            </View>

            {/* Business Type Selection */}
            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Account Type
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setBusinessType("individual")}
                  className={`flex-1 p-4 rounded-xl border-2 ${
                    businessType === "individual" 
                      ? "border-primary bg-primary/10" 
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  <Text className={`text-center font-gilroy-semibold ${
                    businessType === "individual" ? "text-primary" : "text-neutral-700"
                  }`}>
                    Individual
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBusinessType("business")}
                  className={`flex-1 p-4 rounded-xl border-2 ${
                    businessType === "business" 
                      ? "border-primary bg-primary/10" 
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  <Text className={`text-center font-gilroy-semibold ${
                    businessType === "business" ? "text-primary" : "text-neutral-700"
                  }`}>
                    Business
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Inputs */}
            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Delivery Address
              </Text>
              <CustomInput
                placeholder="e.g., Street name, Building number"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Wilaya
              </Text>
              <CustomInput
                placeholder="e.g., Algiers, Oran, Constantine"
                value={wilaya}
                onChangeText={setWilaya}
              />
            </View>

            <View className="mb-8">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Preferred Categories (Optional)
              </Text>
              <CustomInput
                placeholder="e.g., Vegetables, Fruits, Dairy"
                value={preferredCategories}
                onChangeText={setPreferredCategories}
              />
              <Text className="text-xs text-neutral-500 mt-1">
                Separate multiple categories with commas
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
