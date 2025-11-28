// app/signin.tsx (or wherever your SignInScreen is)
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { Alert, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useState } from "react";
import { api } from "@/api";

// New API client (the one we generated)


export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await api.postAuthSendOtp({ email });

      if (error) {
        const msg =  "Failed to send OTP";
        Alert.alert("Error", msg);
        return;
      }

      // Success!
      Alert.alert("Success", "OTP sent to your email!");
      router.push({
        pathname: "/verifyOtp",
        params: { email }, // Pass email to verify screen
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "Something went wrong. Try again.");
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

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/agriRole" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}