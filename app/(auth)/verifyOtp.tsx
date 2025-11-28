import { config } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import type { TextInput as TextInputType } from 'react-native';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const EmailVerificationScreen = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(TextInputType | null)[]>([]);
  
  // Get email from route params
  const params = useLocalSearchParams();
  const email = params.email as string || '';

  useEffect(() => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please sign in again.');
      router.replace('/sign-in');
    }
  }, [email]);

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
  useEffect(() => {
    const otp = code.join('');
    if (otp.length === 6) {
      handleVerifyOTP();
    }
  }, [code]);

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found');
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch(`${config.baseUrl}${config.sendOtpUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        return;
      }

      // Reset code and focus first input
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      Alert.alert('Success', 'OTP has been resent to your email');
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };
  

  const handleVerifyOTP = async () => {
    const otp = code.join('');
    
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email not found');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(`${config.baseUrl}${config.verifyOtpUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error types
        if (data && data.code === 'INVALID_OTP') {
          Alert.alert('Error', 'Invalid OTP code. Please try again.');
          setCode(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        } else if (data && data.code === 'VALIDATION_ERROR' && data.issues) {
          const codeError = data.issues?.code?.[0];
          Alert.alert('Error', codeError || 'Validation error');
        } else {
          Alert.alert('Error', data.message || 'OTP verification failed');
        }
        return;
      }

      if (data && data.token) {
        // Store authentication token
        await AsyncStorage.setItem('auth_token', String(data.token));
        
        // Fetch and store user data
        try {
          const userResponse = await fetch(`${config.baseUrl}${config.meUrl}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${data.token}`,
              'Accept': 'application/json',
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log(userData);
            if (userData && userData.session) {
              await AsyncStorage.setItem('user_data', JSON.stringify(userData.session));
            }
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          // Continue to app even if user data fetch fails
        }
        
        // Navigate to main app
        router.replace('/agriRole');
   

      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
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
            Check your email
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
                  w-14 h-16 border-2 rounded-xl justify-center items-center 
                  ${digit ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white'}
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
                  editable={!isVerifying}
                />
              </View>
            ))}
          </View>

          {/* Verifying Indicator */}
          {isVerifying && (
            <View className="items-center mb-6">
              <ActivityIndicator size="small" color="#22680C" />
              <Text className="text-gray-600 mt-2">Verifying...</Text>
            </View>
          )}

          {/* Resend Code */}
          <View className="items-center">
            <Text className="text-gray-600 mb-3 text-base">
              Didn't receive the code?
            </Text>
            <TouchableOpacity 
              onPress={handleResend}
              className="active:opacity-70"
              disabled={isResending || isVerifying}
            >
              {isResending ? (
                <ActivityIndicator size="small" color="#22680C" />
              ) : (
                <Text className="text-primary font-semibold text-lg">
                  Resend
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmailVerificationScreen;