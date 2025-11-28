import CustomButton from '@/components/CustomButton';
import { config } from '@/config';
import { useColorScheme } from '@/hooks/useColorScheme';
import jsonToFormData, { defaultDetectFile } from '@/lib/jsonToFormData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Category {
  key: string;
  name: string;
  subcategories?: string[];
}

interface SubcategoryOption {
  label: string;
  value: string;
  parentKey: string;
}

interface ProductFormData {
  name: string;
  description: string;
  pricePerKg: string;
  quantityKg: string;
  minimumOrderKg: string;
  harvestDate: string;
  grade: string;
  scheduleDate: string;
  category_key: string;
  subcategory: string;
  images: any[];
}

const AddProductScreen = () => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    pricePerKg: '',
    quantityKg: '0',
    minimumOrderKg: '5',
    harvestDate: new Date().toISOString().split('T')[0],
    grade: 'A',
    scheduleDate: '',
    category_key: '',
    subcategory: '',
    images: [],
  });

  // Fetch categories
  const getCategories = async (): Promise<Category[]> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${config.baseUrl}${config.categoriesUrl}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      console.log('Fetched ,,,,,,,,, categories:', data);
      
      // Handle the nested structure: { categories: [...] }
      if (data.categories && Array.isArray(data.categories)) {
        return data.categories;
      }
      
      // Fallback if data is already an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const { data: categories = [], isLoading: categoriesLoading, refetch, isRefetching } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    console.log('[AddProduct] Pull-to-refresh triggered');
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Get subcategories for selected category
  const getSubcategories = (): SubcategoryOption[] => {
    if (!formData.category_key) return [];
    
    const selectedCategory = categories.find(cat => cat.key === formData.category_key);
    if (!selectedCategory || !selectedCategory.subcategories) return [];
    
    return selectedCategory.subcategories.map(sub => ({
      label: sub,
      value: sub,
      parentKey: selectedCategory.key,
    }));
  };
  const updateFormData = (field: keyof ProductFormData, value: string | any[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('addProduct.permissionNeeded') || 'Permission Needed', 
          t('addProduct.grantCameraRoll') || 'We need camera roll permissions to add product images'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImages = [...formData.images, result.assets[0]];
        updateFormData('images', newImages);
      }
    } catch (error) {
      Alert.alert(
        t('addProduct.error') || 'Error', 
        t('addProduct.failedPickImage') || 'Failed to pick image'
      );
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData('images', newImages);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        t('addProduct.productNameRequired') || 'Product name is required'
      );
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        t('addProduct.productDescriptionRequired') || 'Product description is required'
      );
      return false;
    }
    if (!formData.pricePerKg.trim() || isNaN(Number(formData.pricePerKg)) || Number(formData.pricePerKg) <= 0) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        'Valid price per kg is required'
      );
      return false;
    }
    if (!formData.quantityKg.trim() || isNaN(Number(formData.quantityKg)) || Number(formData.quantityKg) <= 0) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        'Valid quantity in kg is required'
      );
      return false;
    }
    if (!formData.minimumOrderKg.trim() || isNaN(Number(formData.minimumOrderKg)) || Number(formData.minimumOrderKg) <= 0) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        'Valid minimum order quantity is required'
      );
      return false;
    }
    // Business rules
    const qty = Number(formData.quantityKg);
    const minOrder = Number(formData.minimumOrderKg);
    if (minOrder > qty) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error',
        'Minimum order (kg) cannot exceed available quantity (kg)'
      );
      return false;
    }
    if (!formData.harvestDate) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        'Harvest date is required'
      );
      return false;
    }
    // Harvest date should not be in the future
    const today = new Date();
    const harvest = new Date(formData.harvestDate);
    if (!isNaN(harvest.getTime()) && harvest > new Date(today.toISOString().split('T')[0])) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error',
        'Harvest date cannot be in the future'
      );
      return false;
    }
    // If scheduleDate provided, ensure it's not before harvestDate
    if (formData.scheduleDate) {
      const schedule = new Date(formData.scheduleDate);
      if (!isNaN(schedule.getTime()) && !isNaN(harvest.getTime()) && schedule < harvest) {
        Alert.alert(
          t('addProduct.validationError') || 'Validation Error',
          'Schedule date cannot be before the harvest date'
        );
        return false;
      }
    }
    if (!formData.grade) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        'Product grade is required'
      );
      return false;
    }
    if (!formData.category_key) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        t('addProduct.categoryRequiredAlert') || 'Please select a category'
      );
      return false;
    }
    if (!formData.subcategory) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        'Please select a subcategory'
      );
      return false;
    }
    if (formData.images.length === 0) {
      Alert.alert(
        t('addProduct.validationError') || 'Validation Error', 
        t('addProduct.imageRequired') || 'At least one product image is required'
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('auth_token');
      Alert.alert('Debug', `Token: ${token}`);
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please sign in again.');
        router.replace('/sign-in');
        return;
      }

      const productData: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        pricePerKg: parseFloat(formData.pricePerKg.trim()),
        quantityKg: parseFloat(formData.quantityKg.trim()),
        minimumOrderKg: parseFloat(formData.minimumOrderKg.trim()),
        harvestDate: formData.harvestDate,
        grade: formData.grade,
        subcategory: formData.subcategory,
      };
      
      if (formData.scheduleDate) {
        productData.scheduleDate = formData.scheduleDate;
      }

      console.log('Sending product data:', productData);
      console.log('URL:', `${config.baseUrl}${config.producerProductsUrl}`);
      console.log('Token:', token ? 'Present' : 'Missing');

      // Build multipart form data including images
      const fd = jsonToFormData(productData);
      formData.images.forEach((asset) => {
        const file = defaultDetectFile(asset);
        if (file) {
          // Use images[] so backend receives an array
          fd.append('images', file as any);
        }
      });

      const response = await fetch(`${config.baseUrl}${config.producerProductsUrl}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do NOT set Content-Type; RN sets the multipart boundary automatically
        },
        body: fd,
      });

      console.log('Response status:', response.status);

      // Get response text first
      const responseText = await response.text();
      console.log('Response body:', responseText);

      // Check for success (201 Created is the expected success status)
      if (response.status === 201) {
        Alert.alert(
          t('addProduct.success') || 'Success', 
          t('addProduct.productAddedSuccessfully') || 'Product added successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            }
          ]
        );
        return;
      }

      // Try to parse error response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was:', responseText);
        throw new Error(`Server error (${response.status}): ${responseText.substring(0, 100)}`);
      }

      // Handle specific error codes
      if (response.status === 401) {
        Alert.alert('Session Expired', 'Please sign in again.');
        router.replace('/sign-in');
        return;
      }

      if (response.status === 403) {
        if (data.code === 'ONBOARDING_INCOMPLETE') {
          Alert.alert('Profile Incomplete', 'Please complete your producer profile first.');
          return;
        }
        throw new Error('You do not have permission to add products.');
      }

      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check if the server is updated.');
      }

      // Generic error handling
      throw new Error(data.message || `Server error: ${response.status}`);
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert(
        t('addProduct.error') || 'Error', 
        t('addProduct.failedAddProduct') || 'Failed to add product. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      

      

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || !!isRefetching}
            onRefresh={onRefresh}
            tintColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
        }
      >
        <View className="p-6">
          {/* Product Images */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t('addProduct.productImages') || 'Product Images'}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Add at least one image of your product
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              <View className="flex-row gap-3">
                {formData.images.map((imageAsset, index) => (
                  <View key={index} className="relative">
                    <Image
                      source={{ uri: imageAsset.uri }}
                      className="w-28 h-28 rounded-2xl"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 shadow-lg"
                    >
                      <X size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={pickImage}
                  className="w-28 h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl items-center justify-center bg-gray-50 dark:bg-neutral-900"
                >
                  <Camera size={28} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t('addProduct.addPhoto') || 'Add Photo'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Basic Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('addProduct.basicInformation') || 'Basic Information'}
            </Text>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('addProduct.productName') || 'Product Name'} *
              </Text>
              <TextInput
                placeholder="e.g., Fresh Organic Tomatoes"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('addProduct.categoryLabel') || 'Category'} *
              </Text>
              <Dropdown
                data={categories.map(cat => ({ label: cat.name, value: cat.key }))}
                labelField="label"
                valueField="value"
                placeholder={t('addProduct.selectCategory') || 'Select Category'}
                placeholderStyle={{ 
                  color: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
                  fontSize: 16
                }}
                selectedTextStyle={{ 
                  color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
                  fontSize: 16
                }}
                containerStyle={{
                  backgroundColor: colorScheme === "dark" ? "#171717" : "#FFFFFF",
                  borderRadius: 12,
                  borderWidth: 0,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                itemTextStyle={{ 
                  color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
                  fontSize: 16,
                  paddingVertical: 8,
                }}
                style={{
                  height: 50,
                  borderColor: colorScheme === "dark" ? "#404040" : "#E5E7EB",
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  backgroundColor: colorScheme === "dark" ? "#0A0A0A" : "#F9FAFB",
                }}
                value={formData.category_key}
                onChange={(item) => {
                  updateFormData('category_key', item.value);
                  updateFormData('subcategory', ''); // Reset subcategory when category changes
                }}
                disable={categoriesLoading}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategory *
              </Text>
              <Dropdown
                data={getSubcategories()}
                labelField="label"
                valueField="value"
                placeholder={formData.category_key ? 'Select Subcategory' : 'Select category first'}
                placeholderStyle={{ 
                  color: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
                  fontSize: 16
                }}
                selectedTextStyle={{ 
                  color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
                  fontSize: 16
                }}
                containerStyle={{
                  backgroundColor: colorScheme === "dark" ? "#171717" : "#FFFFFF",
                  borderRadius: 12,
                  borderWidth: 0,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                itemTextStyle={{ 
                  color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
                  fontSize: 16,
                  paddingVertical: 8,
                }}
                style={{
                  height: 50,
                  borderColor: colorScheme === "dark" ? "#404040" : "#E5E7EB",
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  backgroundColor: !formData.category_key 
                    ? (colorScheme === "dark" ? "#262626" : "#E5E7EB")
                    : (colorScheme === "dark" ? "#0A0A0A" : "#F9FAFB"),
                  opacity: !formData.category_key ? 0.6 : 1,
                }}
                value={formData.subcategory}
                onChange={(item) => updateFormData('subcategory', item.value)}
                disable={!formData.category_key || categoriesLoading}
              />
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price per Kg ($) *
                </Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  value={formData.pricePerKg}
                  onChangeText={(text) => updateFormData('pricePerKg', text)}
                  keyboardType="decimal-pad"
                  className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity (Kg) *
                </Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  value={formData.quantityKg}
                  onChangeText={(text) => updateFormData('quantityKg', text)}
                  keyboardType="decimal-pad"
                  className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
                />
              </View>
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Order (Kg) *
                </Text>
                <TextInput
                  placeholder="5"
                  placeholderTextColor="#9CA3AF"
                  value={formData.minimumOrderKg}
                  onChangeText={(text) => updateFormData('minimumOrderKg', text)}
                  keyboardType="decimal-pad"
                  className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade *
                </Text>
                <Dropdown
                  style={{
                    backgroundColor: colorScheme === 'dark' ? '#171717' : '#F9FAFB',
                    borderColor: colorScheme === 'dark' ? '#404040' : '#E5E7EB',
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                  placeholderStyle={{ color: '#9CA3AF', fontSize: 16 }}
                  selectedTextStyle={{
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
                    fontSize: 16,
                  }}
                  containerStyle={{
                    backgroundColor: colorScheme === 'dark' ? '#262626' : '#FFFFFF',
                    borderColor: colorScheme === 'dark' ? '#404040' : '#E5E7EB',
                    borderRadius: 12,
                  }}
                  itemTextStyle={{
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
                  }}
                  data={[{ label: 'Grade A', value: 'A' }, { label: 'Grade B', value: 'B' }, { label: 'Grade C', value: 'C' }]}
                  labelField="label"
                  valueField="value"
                  placeholder="Select grade"
                  value={formData.grade}
                  onChange={(item) => updateFormData('grade', item.value)}
                />
              </View>
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Harvest Date *
                </Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                  value={formData.harvestDate}
                  onChangeText={(text) => updateFormData('harvestDate', text)}
                  className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schedule Date
                </Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                  value={formData.scheduleDate}
                  onChangeText={(text) => updateFormData('scheduleDate', text)}
                  className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('addProduct.descriptionLabel') || 'Description'} *
              </Text>
              <TextInput
                placeholder={t('addProduct.descriptionPlaceholder') || 'Describe your product...'}
                placeholderTextColor="#9CA3AF"
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base min-h-[100px]"
              />
            </View>
          </View>

          {/* Submit Button */}
          <CustomButton
            title={t('addProduct.addProductBtn') || 'Add Product'}
            onPress={handleSubmit}
            isLoading={isLoading}
            style="mb-8"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductScreen;