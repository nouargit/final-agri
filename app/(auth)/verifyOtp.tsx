import React, { useState, useRef,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import type { TextInput as TextInputType } from 'react-native';
import { Colors } from '@/constants/Colors';
import { authVerifyOTP } from '@/src/api/orval-client'; 
import { AuthVerifyOTP200, AuthVerifyOTPBody } from '@/src/api/model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import {api} from '@/api';

const EmailVerificationScreen = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInputType | null)[]>([]);
  const email = 'some-email@gmail.com';

  const handleCodeChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericText;
      setCode(newCode);

      // Auto-focus next input
      if (numericText !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    // Auto-focus previous input on backspace
    if (numericText === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  useEffect(()=>{
    const otp = code.join('');
    if(otp.length === 6){
        console.log(otp);
      handleVerifyOTP();
    }
  },[code])

  const handleResend = () => {
    // Reset code and focus first input
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    console.log('Resend code requested');
  };
  

  const handleVerifyOTP = async () => {
    const otp = code.join('');
    const email='abdenouar790@gmail.com';
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
 
    try {
      const response = await api.postAuthVerifyOtp({ email:email, code: otp });


 console.log(response);
 if (response && response.data && response.data.token) {
        // Store token and navigate to home
        await AsyncStorage.setItem('auth_token', String(response.data.token));
        router.push('/(tabs)');
      } else {
        Alert.alert('Error OTP verification failed');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-8 justify-center">
          {/* Title */}
          <Text className="text-3xl font-bold text-center text-gray-900 mb-4">
            Check out your email
          </Text>
          
          {/* Description */}
          <Text className="text-lg text-gray-600 text-center mb-12 leading-6">
            We've sent a 6 digit code to{'\n'}
            <Text className="font-semibold text-gray-900">{email}</Text>
          </Text>

          {/* Code Inputs */}
          <View className="flex-row justify-between mb-12">
            {code.map((digit, index) => (
              <View
                key={index}
                className={`
                  w-14 h-16 border-2 rounded-xl  justify-center items-center 
                  ${digit ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}
                `}
              >
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  className="text-2xl font-bold text-center text-gray-900 w-full"
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </View>
            ))}
          </View>

          {/* Resend Code */}
          <View className="items-center">
            <Text className="text-gray-600 mb-3 text-base">
              Didn't receive the code?
            </Text>
            <TouchableOpacity 
              onPress={handleResend}
              className="active:opacity-70"
            >
              <Text className="text-primary font-semibold text-lg">
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmailVerificationScreen;