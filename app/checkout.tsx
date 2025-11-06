import * as Location from "expo-location";
import { Dropdown } from "react-native-element-dropdown";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "react-native";
import { getDistance } from 'geolib';
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import cart from "./(tabs)/cart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images } from "@/constants/imports";
import { config } from "@/config";
interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<LocationCoordinate | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinate | null>(userLocation);
  const { shopLocation: shopLocationStr } = useLocalSearchParams();
  const shopLocation = shopLocationStr ? JSON.parse(shopLocationStr as string) : null;
  const { cart } = useLocalSearchParams();
  const cartString = Array.isArray(cart) ? cart[0] : cart;
  const parsedCart = cartString ? JSON.parse(cartString) : null
 const [selectedType, setSelectedType] = useState('delivery');
  //const cartItems = cart && typeof cart === 'string' ? JSON.parse(cart).items?.[0] : null;
  
 const { total } = useLocalSearchParams();
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        alert("Error getting your location. Please try again.");
      }
    })();
  }, []);
  
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    // callback removed – onLocationSelected is not defined in scope
  }
  const order=async ()=>{
  const token =await AsyncStorage.getItem('auth_token');
  if(!token){
   alert('Please login first');
  }

  console.log('shop_id',parsedCart.items[0].product.shop.id)
  console.log('items',parsedCart.items.map((item: { product: { id: number; }; quantity: number; }) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),)
        console.log('total',parseFloat(Array.isArray(total) ? total[0] : total))
        console.log( 'location', selectedLocation)
        console.log( 'type', selectedType)







  try{
    const response = await fetch(`${config.baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        shop_id: parsedCart.items[0].product.shop.id,
        items: parsedCart.items.map((item: { product: { id: number; }; quantity: number; }) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        total: parseFloat(Array.isArray(total) ? total[0] : total),
        subtotal:parseFloat(Array.isArray(total) ? total[0] : total),
        delivery_fee: selectedLocation && shopLocation
          ? parseFloat(((getDistance(shopLocation, selectedLocation) / 1000) * 200).toFixed(3))
          : 0,
        location: JSON.stringify(selectedLocation),
        type: selectedType,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!response.ok) {
      alert('sucsessfull order')
    }
    const data = await response.json();
    console.log('Raw API response:', data);
    return data.data || data;
  } catch (error) {
    console.error('Error placing order:', error);

  }

  

  };

  if (!userLocation) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="bg-white dark:bg-neutral-900 pt-12 pb-4 px-4 shadow-sm">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white text-center">
          Shop Location
        </Text>
        <Text className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
          Tap on the map to select your shop's location
        </Text>
      </View>
      
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: shopLocation.latitude,
          longitude: shopLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        userLocationAnnotationTitle="You are here"
        showsMyLocationButton={true}
        onPress={handleMapPress}
      >
         <Marker
            coordinate={shopLocation}
            title="Shop Location"
            description="This will be your shop's position"
            
            image={images.shopMarker}
        
          />
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Shop Location"
            description="This will be your shop's position"
           
          >
           
              </Marker>
        )}
      </MapView>

      {selectedLocation && (
        <View className="absolute bottom-0  bg-white p-4 w-full min-h-44 rounded-3xl shadow-md">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Delevery: {((getDistance(shopLocation, selectedLocation) / 1000)*200).toFixed(2)} DZD
          </Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Total: {(parseFloat(Array.isArray(total) ? total[0] : total)) + (parseFloat(((getDistance(shopLocation, selectedLocation) / 1000)*200).toFixed(3)))} DZD
          </Text>
          <Dropdown
            data={[
              { label: 'Delivery', value: 'delivery' },
              { label: 'Pickup', value: 'pickup' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select payment method"
            value={selectedType}
            onChange={setSelectedType}
          />
          

          <TouchableOpacity
            className="bg-primary rounded-full mt-3 p-3"
            onPress={order}
          >
            <Text className="text-center text-white font-bold">
              order
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
