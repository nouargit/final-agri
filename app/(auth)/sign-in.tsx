import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { config } from "@/config";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${config.baseUrl}${config.sendOtpUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from API
        if (data && data.code === 'VALIDATION_ERROR' && data.issues) {
          const emailError = data.issues?.email?.[0];
          Alert.alert("Error", emailError || "Failed to send OTP");
        } else {
          Alert.alert("Error", data.message || "Failed to send OTP. Please try again.");
        }
        return;
      }

      // Success!
      router.push({
        pathname: "/verifyOtp",
        params: { email: email.trim() },
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white justify-center px-6">
        {/* Title */}
        <Text className="text-6xl font-gilroy-bold text-primary mb-56 text-center">
          agro
        </Text>

        {/* Email Input */}
        <CustomInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
         
        
        />

        {/* Submit Button */}
        <CustomButton
          title="Sign in"
          onPress={handleSubmit}
          isLoading={isLoading}
        />

      
        
      </View>
    </TouchableWithoutFeedback>
  );
}