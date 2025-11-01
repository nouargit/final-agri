import { useLocationStore } from "@/stors/locationStore";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getDistance } from 'geolib';
interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<LocationCoordinate | null>(null);
  const { selectedLocation, setSelectedLocation } = useLocationStore();
  const { shopLocation } = useLocalSearchParams();
  
  
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
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        userLocationAnnotationTitle="You are here"
        showsMyLocationButton={true}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Shop Location"
            description="This will be your shop's position"
          />
        )}
      </MapView>

      {selectedLocation && (
        <View className="absolute bottom-0  bg-white p-4 w-full min-h-44 rounded-3xl shadow-md">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Delevery: {((getDistance(userLocation, selectedLocation) / 1000)*200).toFixed(2)} da
          </Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Total: {parseFloat(Array.isArray(total) ? total[0] : total) + parseFloat(((getDistance(userLocation, selectedLocation) / 1000)*100).toFixed(3))}
          </Text>

          <TouchableOpacity
            className="bg-primary rounded-full mt-3 p-3"
            onPress={() => {
              if (selectedLocation) {
                console.log("Selected location:", selectedLocation);
                // Navigate directly back to shop creation form
                router.push('/shopCreationForm');
              }
            }}
          >
            <Text className="text-center text-white font-bold">
              Save Location
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
