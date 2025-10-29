import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { config } from '@/config';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ArrowLeft, Camera, ChevronDown, Plus, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  images: string[];
  ingredients: string[];
  allergens: string[];
  preparationTime: string;
  calories: string;
  protein: string;
  shop_id: string;
  category_id: string; // Add category_id to the form data
}

// Static fallback categories (will be replaced by fetched categories)
const fallbackCategories = [
  { label: 'Traditional', value: 'Traditional' },
  { label: 'Cake', value: 'Cake' },
  { label: 'Pastry', value: 'Pastry' },
  { label: 'Cookies', value: 'Cookies' },
  { label: 'Beverages', value: 'Beverages' },
  { label: 'Other', value: 'Other' },
];

const commonAllergens = [
  'Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish'
];

const AddProductScreen = () => {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [shopSelectionVisible, setShopSelectionVisible] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [],
    ingredients: [],
    allergens: [],
    preparationTime: '',
    calories: '',
    protein: '',
    shop_id: '',
    category_id: '',
  });
  const getShopCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

      // Fetch categories for the selected shop
      const url = selectedShopId 
        ? `${config.baseUrl}/api/categories?shop_id=${selectedShopId}`
        : `${config.baseUrl}/api/categories`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
  const categories = await response.json();
  console.log('Shop categories:', categories);

  if (Array.isArray(categories.data)) {
    return categories.data.map((category: { name: string; id: string; }) => ({
      label: category.name,
      id: category.id
    }));
  }
  return [];
} else {
        throw new Error('Failed to fetch shop categories');
      }
    } catch (error) {
      console.error('Error fetching shop categories:', error);
      return fallbackCategories; // Return fallback categories on error
    }
  };
  const updateFormData = (field: keyof ProductFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to add images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImages = [...formData.images, result.assets[0].uri];
        updateFormData('images', newImages);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData('images', newImages);
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
      updateFormData('ingredients', [...formData.ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    const newIngredients = formData.ingredients.filter(item => item !== ingredient);
    updateFormData('ingredients', newIngredients);
  };

  const toggleAllergen = (allergen: string) => {
    const newAllergens = formData.allergens.includes(allergen)
      ? formData.allergens.filter(item => item !== allergen)
      : [...formData.allergens, allergen];
    updateFormData('allergens', newAllergens);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Product description is required');
      return false;
    }
    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      Alert.alert('Validation Error', 'Valid price is required');
      return false;
    }
    if (!formData.category_id) {
      Alert.alert('Validation Error', 'Category is required');
      return false;
    }
    if (formData.images.length === 0) {
      Alert.alert('Validation Error', 'At least one image is required');
      return false;
    }
    if (!selectedShopId) {
      Alert.alert('Validation Error', 'Please select a shop');
      return false;
    }
    return true;
  };


  

  

  // Fetch shops data
  const getShopData = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }
      
      const response = await fetch(`${config.baseUrl}${config.shopsUrl}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
  };

  // Fetch categories for the selected shop
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = useQuery({
    queryKey: ['categories', selectedShopId],
    queryFn: getShopCategories,
    enabled: !!selectedShopId, // Only fetch when a shop is selected
    retry: 1,
    retryDelay: 1000,
  });

  const { data: shopData, error: shopError, isLoading: shopsLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: getShopData,
    retry: 1,
    retryDelay: 1000,
  });

  // Update form data when shop is selected
  useEffect(() => {
    setFormData(prev => ({ ...prev, shop_id: selectedShopId }));
    // Refetch categories when shop changes
    if (selectedShopId) {
      refetchCategories();
    }
  }, [selectedShopId]);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
          const token = await AsyncStorage.getItem('auth_token');
         console.log('Product data:', formData);
      const response = await fetch(`${config.baseUrl}${config.productsUrl}`, {
        method: 'POST',
       headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
        body: JSON.stringify(formData),
      });
      console.log(formData.images);
      return await response.json();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
 
    finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">Add New Product</Text>
        <View className="w-10" />
      </View>

      {/* Shop Selection */}
      <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Shop *
        </Text>
        <TouchableOpacity
          onPress={() => setShopSelectionVisible(true)}
          className="bg-gray-100 dark:bg-neutral-800 rounded-2xl px-4 py-3 flex-row items-center justify-between"
        >
          <Text className={`${selectedShopId ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {selectedShopId 
              ? (Array.isArray(shopData) 
                  ? shopData.find(shop => shop.id === selectedShopId)?.name || 'Select Shop'
                  : shopData?.name || 'Select Shop')
              : 'Select Shop'
            }
          </Text>
          <ChevronDown size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Product Images */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Product Images *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              <View className="flex-row gap-3">
                {formData.images.map((uri, index) => (
                  <View key={index} className="relative">
                    <Image
                      source={{ uri }}
                      className="w-24 h-24 rounded-xl"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <X size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={pickImage}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl items-center justify-center"
                >
                  <Camera size={24} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add Photo</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Basic Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Basic Information
            </Text>
            
            <CustomInput
              placeholder="Product Name"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
            />

            <View className="mb-4">
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">Category *</Text>
              <Dropdown
                data={categories || []}//9999
                labelField="label"
                valueField="id"
                placeholder={!selectedShopId ? 'Select a shop first' : 'Select Category'}
                placeholderStyle={{ 
                  color: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
                  fontSize: 16
                }}
                selectedTextStyle={{ 
                  color: colorScheme === "dark" ? "#FFFFFF" : "#1F2937",
                  fontSize: 16
                }}
                containerStyle={{
                  backgroundColor: colorScheme === "dark" ? "#262626" : "#FFFFFF",
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
                  fontSize: 16
                }}
                style={{
                  height: 50,
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  backgroundColor: !selectedShopId ? (colorScheme === "dark" ? "#404040" : "#e5e5e5") : (colorScheme === "dark" ? "#262626" : "#f9f9f9"),
                  marginBottom: 16,
                  opacity: !selectedShopId ? 0.6 : 1,
                }}
                value={formData.category_id}
                onChange={(item) => updateFormData('category_id', item.id)}
                disable={!selectedShopId}
              />
            </View>

            <CustomInput
              placeholder="Price (USD)"
              value={formData.price}
              onChangeText={(text) => updateFormData('price', text)}
              keyboardType="number-pad"
            />

            <View className="mb-4">
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">Description *</Text>
              <View className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-neutral-800">
                <CustomInput
                  placeholder="Describe your product..."
                  value={formData.description}
                  onChangeText={(text) => updateFormData('description', text)}
                />
              </View>
            </View>
          </View>

          {/* Nutritional Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Nutritional Information
            </Text>
            
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <CustomInput
                  placeholder="Calories"
                  value={formData.calories}
                  onChangeText={(text) => updateFormData('calories', text)}
                  keyboardType="number-pad"
                />
              </View>
              <View className="flex-1">
                <CustomInput
                  placeholder="Protein (g)"
                  value={formData.protein}
                  onChangeText={(text) => updateFormData('protein', text)}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <CustomInput
              placeholder="Preparation Time (e.g., 15-20 mins)"
              value={formData.preparationTime}
              onChangeText={(text) => updateFormData('preparationTime', text)}
            />
          </View>

          {/* Ingredients */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Ingredients
            </Text>
            
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <CustomInput
                  placeholder="Add ingredient"
                  value={newIngredient}
                  onChangeText={setNewIngredient}
                />
              </View>
              <TouchableOpacity
                onPress={addIngredient}
                className="bg-primary rounded-xl px-4 justify-center"
              >
                <Plus size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {formData.ingredients.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => removeIngredient(ingredient)}
                  className="bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-full flex-row items-center gap-1"
                >
                  <Text className="text-blue-800 dark:text-blue-200 text-sm">{ingredient}</Text>
                  <X size={14} color={colorScheme === 'dark' ? '#93C5FD' : '#1E40AF'} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Allergens */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Allergen Information
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Select all allergens that apply to your product
            </Text>
            
            <View className="flex-row flex-wrap gap-2">
              {commonAllergens.map((allergen) => (
                <TouchableOpacity
                  key={allergen}
                  onPress={() => toggleAllergen(allergen)}
                  className={`px-4 py-2 rounded-full border-2 ${
                    formData.allergens.includes(allergen)
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500'
                      : 'bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      formData.allergens.includes(allergen)
                        ? 'text-yellow-800 dark:text-yellow-200'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {allergen}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <CustomButton
            title="Add Product"
            onPress={handleSubmit}
            isLoading={isLoading}
            style="mb-8"
          />
        </View>
      </ScrollView>

      {/* Shop Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={shopSelectionVisible}
        onRequestClose={() => setShopSelectionVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 pb-8">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">Select Shop</Text>
              <TouchableOpacity onPress={() => setShopSelectionVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-80">
              {shopsLoading ? (
                <View className="p-4">
                  <Text className="text-gray-600 dark:text-gray-400 text-center">Loading shops...</Text>
                </View>
              ) : shopError ? (
                <View className="p-4">
                  <Text className="text-red-600 dark:text-red-400 text-center">Error loading shops</Text>
                </View>
              ) : Array.isArray(shopData) && shopData.length > 0 ? (
                shopData.map((shop) => (
                  <TouchableOpacity
                    key={shop.id}
                    onPress={() => {
                      setSelectedShopId(shop.id);
                      setShopSelectionVisible(false);
                    }}
                    className={`p-4 rounded-xl mb-2 ${
                      selectedShopId === shop.id 
                        ? 'bg-gray-900 dark:bg-white' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <Text className={`font-semibold ${
                      selectedShopId === shop.id 
                        ? 'text-white dark:text-gray-900' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {shop.name}
                    </Text>
                    {shop.description && (
                      <Text className={`text-sm mt-1 ${
                        selectedShopId === shop.id 
                          ? 'text-gray-200 dark:text-gray-600' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {shop.description}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View className="p-4">
                  <Text className="text-gray-600 dark:text-gray-400 text-center">No shops available</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddProductScreen;