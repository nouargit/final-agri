import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { config } from "@/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import { ShoppingBag, Star, Zap } from "lucide-react-native";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function Buyer() {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const role = "buyer"; // Backend expects "buyer" for this screen

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

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please sign in again.');
        router.replace('/sign-in');
        return;
      }

      const response = await fetch(`${config.baseUrl}${config.onboardingStep1Url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullname.trim(),
          phone: phone.trim(),
          role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'VALIDATION_ERROR' && data.issues) {
          const errors = Object.values(data.issues).flat().join('\n');
          Alert.alert('Validation Error', errors);
        } else if (data.code === 'ON_BOARDING_STEP_1_ALREADY_COMPLETED') {
          Alert.alert('Info', 'You have already completed this step.');
          router.replace('/buyerDetails');
        } else {
          Alert.alert('Error', data.message || 'Failed to complete onboarding');
        }
        return;
      }

      // Success - consumers don't need step 2, go to main app
      Alert.alert('Success', 'Welcome! Your account has been created.');
      router.replace('/buyerDetails');
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
              <Text className="text-4xl font-gilroy-bold text-neutral-900 text-center">
                Join as a Buyer
              </Text>
              <Text className="text-base text-neutral-600 text-center mt-3 px-4">
                Discover fresh products directly from local producers
              </Text>
            </View>

            {/* Benefits */}
            <View className="mb-8">
              <View className="flex-row items-start mb-4">
                <View className="bg-primary/10 p-2 rounded-lg mr-3">
                  <Zap size={20} color="#22680C" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-gilroy-semibold text-neutral-900">
                    Fast & Fresh
                  </Text>
                  <Text className="text-sm text-neutral-600 mt-1">
                    Get fresh products delivered directly from the source
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start mb-4">
                <View className="bg-primary/10 p-2 rounded-lg mr-3">
                  <Star size={20} color="#22680C" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-gilroy-semibold text-neutral-900">
                    Quality Guaranteed
                  </Text>
                  <Text className="text-sm text-neutral-600 mt-1">
                    Browse verified products from trusted producers
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="bg-primary/10 p-2 rounded-lg mr-3">
                  <ShoppingBag size={20} color="#22680C" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-gilroy-semibold text-neutral-900">
                    Easy Shopping
                  </Text>
                  <Text className="text-sm text-neutral-600 mt-1">
                    Simple ordering and secure payment options
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
