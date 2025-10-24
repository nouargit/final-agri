import { View, Text, TouchableOpacity } from "react-native";
import { Link, router } from 'expo-router';
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useState } from "react";

export default function SignInScreen() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuration - matching your Laravel setup
  const config = {
    baseUrl: 'http://10.142.232.194:8000',
    csrfTokenUrl: '/sanctum/csrf-cookie',
    loginUrl: '/api/auth/login',
    userUrl: '/api/user',
  };
  
  const submit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("Step 1: Fetching CSRF token...");
      
      // Step 1: Get CSRF token
      const csrfResponse = await fetch(`${config.baseUrl}${config.csrfTokenUrl}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      console.log("CSRF Response status:", csrfResponse.status);
      
      if (!csrfResponse.ok) {
        throw new Error(`CSRF fetch failed: ${csrfResponse.status}`);
      }

      console.log("Step 2: Attempting login...");
      
      // Step 2: Login request
      const loginResponse = await fetch(`${config.baseUrl}${config.loginUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // crucial for cookies!
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      console.log("Login Response status:", loginResponse.status);
      const loginData = await loginResponse.json();
      console.log("Login Response data:", loginData);

      if (loginResponse.ok && loginData.data && loginData.data.token) {
        console.log("Step 3: Login successful, storing token...");
        
        // Store the token
        await AsyncStorage.setItem('auth_token', loginData.data.token);
        
        console.log("Step 4: Fetching user data...");
        
        // Step 3: Get user data
        const userResponse = await fetch(`${config.baseUrl}${config.userUrl}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginData.data.token}`,
            'Accept': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("User data fetched successfully:", userData);
          
          // Store user data
          await AsyncStorage.setItem('user_data', JSON.stringify(userData));
          
          // Navigate to main app
          router.replace('/(tabs)');
        } else {
          setError("Failed to get user information");
        }
      } else {
        console.log("Login failed:", loginData.message || "Invalid credentials");
        setError(loginData.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <View className="flex-1 bg-white justify-center px-6">
      {/* Title */}
      <Text className="text-2xl font-bold mb-8 text-center">Sign In</Text>

      {/* Error message */}
      {error ? (
        <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <Text className="text-red-700">{error}</Text>
        </View>
      ) : null}

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
