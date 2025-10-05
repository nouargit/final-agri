import { View, Text, TouchableOpacity,Platform } from "react-native";
import { Link } from 'expo-router';
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { KeyboardAvoidingView } from "react-native";
import { TouchableWithoutFeedback, Keyboard } from 'react-native';


import { createUser } from "@/lib/appwrite";
import { useState } from "react";
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const[form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async () => {
    setIsSubmitting(true);
    console.log("hello");
   
    try {
      await createUser(form.email, form.password, form.name);
      router.push("/");
    } catch (error) {
      setError("faild to create user");
    }
    setIsSubmitting(false);
  };


  
  return (
     <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // adjust if you have a header
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <View className="flex-1 bg-white justify-center px-6">
      {/* Title */}
      <Text className=" h1-bold mb-10">Create Account</Text>


      {/* Input fields */}
       <CustomInput
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
               
            />
            <CustomInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
               
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
               
                secureTextEntry={true}
            />

            <CustomButton
                title="Sign Up"
                isLoading={isSubmitting}
                onPress={submit}
            />

      {/* Secondary Button */}
      <View className="flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <Link href="/sign-in" asChild>
          <TouchableOpacity>
            <Text className="text-primary font-semibold">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
    </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
  );
}
