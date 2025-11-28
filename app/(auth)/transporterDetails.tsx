import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { router, useLocalSearchParams } from 'expo-router';
import { Truck } from "lucide-react-native";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function TransporterDetails() {
  const params = useLocalSearchParams();
  const fullname = params.fullname as string || "";
  const phone = params.phone as string || "";

  const [vehicleType, setVehicleType] = useState<"truck" | "van" | "motorcycle" | "other">("truck");
  const [plateNumber, setPlateNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const vehicleTypes = [
    { value: "truck", label: "Truck" },
    { value: "van", label: "Van" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async () => {
    if (!plateNumber.trim()) {
      Alert.alert("Error", "Please enter your vehicle plate number");
      return;
    }

    if (!capacity.trim()) {
      Alert.alert("Error", "Please enter your vehicle capacity");
      return;
    }

    if (!serviceArea.trim()) {
      Alert.alert("Error", "Please enter your service area");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Send complete transporter registration data to API
      const transporterData = {
        fullname,
        phone,
        role: "transporter",
        vehicleType,
        plateNumber: plateNumber.toUpperCase(),
        capacity,
        serviceArea,
      };
      
      console.log("Transporter registration data:", transporterData);
      
      Alert.alert("Success", "Transporter profile created successfully!");
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
