import { config } from "@/config";
import { images } from "@/constants/imports";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { getDistance } from 'geolib';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import MapView, { Marker } from "react-native-maps";
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
  const { t } = useTranslation();
  //const cartItems = cart && typeof cart === 'string' ? JSON.parse(cart).items?.[0] : null;
  
 const { total } = useLocalSearchParams();
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert(t('map.permissionDenied'));
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        alert(t('map.errorLocation'));
      }
    })();
  }, []);
  
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    // callback removed – onLocationSelected is not defined in scope
  }
  const order = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      alert(t('checkout.loginRequired'));
      return;
    }

    if (!selectedLocation) {
      alert(t('checkout.selectLocation') || 'Please select a delivery location');
      return;
    }

    try {
      // Step 1: Create cart/order with not_submitted status using POST /buyer/orders
      const createResponse = await fetch(`${config.baseUrl}/api/buyer/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          items: parsedCart.items.map((item: { product: { id: string | number }; quantity: number }) => ({
            productId: String(item.product.id),
            quantityKg: item.quantity,
          })),
          delivery: {
            longitude: selectedLocation.longitude,
            latitude: selectedLocation.latitude,
            address: `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`,
          },
        }),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(`Failed to create order: ${createResponse.status} - ${errorText}`);
      }

      const createData = await createResponse.json();
      const orderId = createData?.order?.id || createData?.id || createData?.data?.id;

      if (!orderId) {
        throw new Error('Order created but no ID returned');
      }

      console.log('Order created with ID:', orderId);

      // Step 2: Submit the order using POST /buyer/orders/:id/submit
      const submitResponse = await fetch(`${config.baseUrl}/api/buyer/orders/${orderId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: selectedType,
        }),
      });

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        throw new Error(`Failed to submit order: ${submitResponse.status} - ${errorText}`);
      }

      const submitData = await submitResponse.json();
      console.log('Order submitted successfully:', submitData);

      alert(t('checkout.successOrder') || 'Order placed successfully!');
      router.back();
      
      return submitData;
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`${t('checkout.errorOrder') || 'Failed to place order'}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!userLocation) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{t('map.loadingMap')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="bg-white dark:bg-neutral-900 pt-12 pb-4 px-4 shadow-sm">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white text-center">
          {t('map.title')}
        </Text>
        <Text className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
          {t('map.subtitle')}
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
        userLocationAnnotationTitle={t('map.youAreHere')}
        showsMyLocationButton={true}
        onPress={handleMapPress}
      >
         <Marker
            coordinate={shopLocation}
            title={t('map.markerTitle')}
            description={t('map.markerDesc')}
            
           
        
          />
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={t('map.markerTitle')}
            description={t('map.markerDesc')}
           
          >
           
              </Marker>
        )}
      </MapView>

      {selectedLocation && (
        <View className="absolute bottom-0  bg-white p-4 w-full min-h-44 rounded-3xl shadow-md">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {t('checkout.deliveryLabel', { amount: ((getDistance(shopLocation, selectedLocation) / 1000)*200).toFixed(2) })}
          </Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {t('checkout.totalLabel', { amount: (parseFloat(Array.isArray(total) ? total[0] : total)) + (parseFloat(((getDistance(shopLocation, selectedLocation) / 1000)*200).toFixed(3))) })}
          </Text>
          <Dropdown
            data={[
              { label: t('checkout.delivery'), value: 'delivery' },
              { label: t('checkout.pickup'), value: 'pickup' },
            ]}
            labelField="label"
            valueField="value"
            placeholder={t('checkout.paymentPlaceholder')}
            value={selectedType}
            onChange={setSelectedType}
          />
          

          <TouchableOpacity
            className="bg-primary rounded-full mt-3 p-3"
            onPress={order}
          >
            <Text className="text-center text-white font-bold">
              {t('checkout.order')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
