import { Redirect, Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';
import { useAuth } from '@/stors/Auth';

export default function AuthLayout() {
  const {isAuthenticated} = useAuth();
  if (isAuthenticated) return <Redirect href="/(tabs)" />;


  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-white"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </Stack>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
