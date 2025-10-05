import { View, Text, TouchableOpacity } from "react-native";
import { Link, router } from 'expo-router';
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { signIn } from "@/lib/appwrite";
import { useState } from "react";
import useAuthStore from "@/stors/Auth";

export default function SignInScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchAuthenticatedUser } = useAuthStore();
  
  const submit = async () => {
    setIsSubmitting(true);
    try {
      await signIn({
        email: form.email,
        password: form.password,
      });
      
      // Fetch the authenticated user to update the auth state
      await fetchAuthenticatedUser();
      
      // Add a small delay to ensure state is updated before navigation
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error) {
      setError("Failed to sign in");
      console.log(error);
    }
    setIsSubmitting(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <View className="flex-1 bg-white justify-center px-6">
      {/* Title */}
      <Text className="text-2xl font-bold mb-8 text-center">Sign In</Text>

      {/* Input fields */}
      <CustomInput
  placeholder="Email"
  value={form.email}
  onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
/>

<CustomInput
  placeholder="Password"
  value={form.password}
  secureTextEntry
  onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
/>
    <CustomButton title="Sign in" onPress={submit} isLoading={isSubmitting}/>
  


   <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text className="text-[#ff6370] font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
    </TouchableWithoutFeedback>

  );
}
