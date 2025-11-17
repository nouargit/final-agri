import { useLocationStore } from "@/stors/locationStore";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from 'react-i18next';
import MapView, { Marker } from "react-native-maps";
import { getDistance } from 'geolib';
interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<LocationCoordinate | null>(null);
  const { selectedLocation, setSelectedLocation } = useLocationStore();
  const { t } = useTranslation();
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
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        userLocationAnnotationTitle={t('map.youAreHere')}
        showsMyLocationButton={true}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={t('map.markerTitle')}
            description={t('map.markerDesc')}
          />
        )}
      </MapView>

      {selectedLocation && (
        <View className="absolute bottom-20 left-5 right-5 bg-white p-4 rounded-2xl shadow-md">
          <Text>📍 Lat: {selectedLocation.latitude}</Text>
          <Text>📍 Lng: {selectedLocation.longitude}</Text>

          <TouchableOpacity
            className="bg-blue-500 rounded-full mt-3 p-3"
            onPress={() => {
              if (selectedLocation) {
                console.log("Selected location:", selectedLocation);
                // Navigate directly back to shop creation form
                router.push('/shopCreationForm');
              }
            }}
          >
            <Text className="text-center text-white font-bold">
              {t('map.saveLocation')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
