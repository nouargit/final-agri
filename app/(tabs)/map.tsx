import { useLocationStore } from "@/stors/locationStore";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useTranslation } from 'react-i18next';
import MapView, { Marker, Polyline } from "react-native-maps";
import { getDistance } from 'geolib';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<LocationCoordinate | null>(null);
  const { selectedLocation, setSelectedLocation } = useLocationStore();

  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // ===============================
  // NEW: route coordinates from Mapbox
  // ===============================
  const [routeCoords, setRouteCoords] = useState([]);

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoiYWJkZW5vdWFyNzkwIiwiYSI6ImNtaWJ2NWxweTA2MGYybHF6NWRodnhhNm8ifQ.Uk_R5vbpYNeDx7E8HIWbJg";

  // FETCH ROUTE FROM MAPBOX
  const fetchRoute = async () => {
    if (!userLocation || !selectedLocation) return;

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${selectedLocation.longitude},${selectedLocation.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || !data.routes[0]) return;

      const coords = data.routes[0].geometry.coordinates.map(
        ([lng, lat]: number[]) => ({
          latitude: lat,
          longitude: lng,
        })
      );

      setRouteCoords(coords);
    } catch (err) {
      console.log("Error fetching route:", err);
    }
  };

  // كل مرة المستخدم يختار مكان → ارسم له الطريق
  useEffect(() => {
    fetchRoute();
  }, [selectedLocation]);

  const seller = {
    name: "Zaoui islam",
    avatar: "https://your-image-url.com/avatar.jpg",
    locationName: "Central Market",
  };

  const product = {
    title: "Potato",
    price: 350,
  };

  const buyer = {
    locationName: "Your Address",
  };

  const distance =
    userLocation && selectedLocation
      ? getDistance(userLocation, selectedLocation) / 1000
      : null;

  const startTransport = () => {
    console.log("Transport Started!");
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert(t("map.permissionDenied"));
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        alert(t("map.errorLocation"));
      }
    })();
  }, []);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  if (!userLocation) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{t("map.loadingMap")}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Map */}
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          onPress={handleMapPress}
        >
          {/* Marker */}
          {selectedLocation && <Marker  coordinate={selectedLocation} />}

          {/* Polyline of the route from MAPBOX */}
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeWidth={4}
              strokeColor="#4bc03f"
            />
          )}
        </MapView>

        {/* BottomSheet */}
       <BottomSheet
  ref={bottomSheetRef}
  onChange={handleSheetChanges}
 snapPoints={[200, '50%']}

  backgroundStyle={{ backgroundColor: '#fff' }}
>
  <BottomSheetScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
    {/* Drag Handle */}
    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
      <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }} />
    </View>

    <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
      {/* Route Summary Card */}
      <View style={{ 
        backgroundColor: '#F8F9FA', 
        borderRadius: 16, 
        padding: 16,
        marginBottom: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', marginRight: 12 }} />
              <Text style={{ fontSize: 14, color: '#6B7280', flex: 1 }} numberOfLines={1}>
                {seller.locationName}
              </Text>
            </View>
            
            <View style={{ width: 2, height: 20, backgroundColor: '#D1D5DB', marginLeft: 4, marginBottom: 12 }} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#EF4444', marginRight: 12 }} />
              <Text style={{ fontSize: 14, color: '#6B7280', flex: 1 }} numberOfLines={1}>
                {buyer.locationName}
              </Text>
            </View>
          </View>
          
          <View style={{ alignItems: 'flex-end', marginLeft: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
              {distance?.toFixed(1)} km
            </Text>
            <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>15-20 min</Text>
          </View>
        </View>
      </View>

      {/* Seller Info */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
      }}>
        <Image
          source={require('@/assets/images/agro.png')}
          style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 28,
            borderWidth: 2,
            borderColor: '#10B981'
          }}
        />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 2 }}>
            {seller.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#10B981', marginRight: 8 }}>★ 4.8</Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF' }}>• Verified Seller</Text>
          </View>
        </View>
        <TouchableOpacity style={{
          backgroundColor: '#F3F4F6',
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ fontSize: 18 }}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Product Card */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 10, letterSpacing: 0.5 }}>
          DELIVERY ITEM
        </Text>
        <View style={{ 
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB'
        }}>
          <View style={{ 
            width: 70, 
            height: 70, 
            borderRadius: 8,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{ fontSize: 24 }}>📦</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
            <Text style={{ 
              fontSize: 15, 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: 4
            }} numberOfLines={2}>
              {product.title}
            </Text>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#10B981' }}>
              {product.price} DA
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Summary */}
      <View style={{ 
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20
      }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 12, letterSpacing: 0.5 }}>
          PAYMENT DETAILS
        </Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Item price</Text>
          <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>{product.price} DA</Text>
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Delivery fee</Text>
          <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>350 DA</Text>
        </View>
        
        <View style={{ 
          borderTopWidth: 1, 
          borderTopColor: '#E5E7EB',
          paddingTop: 12,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>Total</Text>
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827' }}>
            {(parseInt("500") + 350).toLocaleString()} DA
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
      className="bg-primary "
        style={{
          
          paddingVertical: 16,
          borderRadius: 12,
          marginBottom: 10
        }}
        onPress={startTransport}
      >
        <Text style={{ 
          color: '#FFFFFF', 
          textAlign: 'center', 
          fontSize: 16, 
          fontWeight: '700',
          letterSpacing: 0.5
        }}>
          Accept for 6000da
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
      className="bg-white"
        style={{
          
          paddingVertical: 16,
          borderRadius: 12,
          marginBottom: 10
        }}
        onPress={startTransport}
      >
        <Text style={{ 
          color: '#FFFFFF', 
          textAlign: 'center', 
          fontSize: 16, 
          fontWeight: '700',
          letterSpacing: 0.5
        }}>
          Decline
        </Text>
      </TouchableOpacity>

     
    </View>
  </BottomSheetScrollView>
</BottomSheet>
   
  </View> </GestureHandlerRootView>
);

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1000,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
