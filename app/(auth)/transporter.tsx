import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Link, router } from 'expo-router';
import { Clock, MapPin, Truck } from "lucide-react-native";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function Transporter() {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const role = "transporter"; // Fixed role for this screen

  const handleSubmit = async () => {
    if (!fullname.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    // Navigate to transporter details screen
    router.push({
      pathname: "/transporterDetails",
      params: { fullname: fullname.trim(), phone: phone.trim() },
    });
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
              <Text className="text-4xl font-gilroy-bold text-neutral-900 text-center">
                Join as a Transporter
              </Text>
              <Text className="text-base text-neutral-600 text-center mt-3 px-4">
                Connect producers with buyers through reliable delivery services
              </Text>
            </View>

            {/* Benefits */}
            <View className="mb-8">
              <View className="flex-row items-start mb-4">
                <View className="bg-primary/10 p-2 rounded-lg mr-3">
                  <MapPin size={20} color="#22680C" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-gilroy-semibold text-neutral-900">
                    Flexible Routes
                  </Text>
                  <Text className="text-sm text-neutral-600 mt-1">
                    Choose your delivery routes and optimize your schedule
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start mb-4">
                <View className="bg-primary/10 p-2 rounded-lg mr-3">
                  <Clock size={20} color="#22680C" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-gilroy-semibold text-neutral-900">
                    Earn More
                  </Text>
                  <Text className="text-sm text-neutral-600 mt-1">
                    Competitive rates and timely payments for your services
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="bg-primary/10 p-2 rounded-lg mr-3">
                  <Truck size={20} color="#22680C" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-gilroy-semibold text-neutral-900">
                    Grow Your Business
                  </Text>
                  <Text className="text-sm text-neutral-600 mt-1">
                    Access a wide network of producers and buyers
                  </Text>
                </View>
              </View>
            </View>

            {/* Form Inputs */}
            <View>
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Full Name
              </Text>
              <CustomInput
                placeholder="Enter your full name"
                value={fullname}
                onChangeText={setFullname}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-gilroy-semibold text-neutral-700 mb-2">
                Phone Number
              </Text>
              <CustomInput
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Submit Button */}
            <CustomButton title="Get Started" isLoading={isLoading} onPress={handleSubmit} />

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-6 mb-8">
              <Text className="text-neutral-600">Already have an account? </Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-gilroy-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
