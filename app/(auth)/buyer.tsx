import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";


export default function Buyer() {
  const router = useRouter();

  // Manual authentication configuration
  const baseUrl = config.baseUrl;
  const csrfTokenUrl = `${baseUrl}${config.csrfTokenUrl}`;
  const loginUrl = `${baseUrl}${config.loginUrl}`;
  const userUrl = `${baseUrl}${config.userUrl}`;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 🌐 Register user manually via Laravel API
      const response = await fetch("http://10.142.232.194:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setError(data.message || "Registration failed");
        return;
      }

      // ✅ Automatically log in after successful registration
      console.log('Registration successful, attempting login...');
      
      // Step 1: Get CSRF token
      await fetch(csrfTokenUrl, {
        method: 'GET',
        credentials: 'include',
      });
      
      // Step 2: Login
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          device_name: 'Test-Device',
        }),
      });

      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);

      if (loginResponse.ok && loginData.data && loginData.data.token) {
        // Step 3: Store token and get user data
        await AsyncStorage.setItem('auth_token', loginData.data.token);
        
        const userResponse = await fetch(userUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginData.data.token}`,
            'Accept': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          await AsyncStorage.setItem('user_data', JSON.stringify(userData));
          console.log('User data stored:', userData);
          
          router.replace('/(tabs)'); // Redirect to tabs
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-white justify-center px-6">
          <Text className="text-6xl text-primary font-gilroy-bold mb-10 text-center">buyer</Text>

          {error ? <Text className="text-red-500 text-center mb-3">{error}</Text> : null}

          <CustomInput
            placeholder="Full Name"
            value={form.name}
            onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
          />
          <CustomInput
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
            keyboardType="email-address"
          />
          <CustomInput
            placeholder="Password"
            value={form.password}
            onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
            secureTextEntry
          />
          <CustomInput
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChangeText={(text) => setForm((prev) => ({ ...prev, confirmPassword: text }))}
            secureTextEntry
          />

          <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

          <View className="flex-row justify-center mt-4">
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
