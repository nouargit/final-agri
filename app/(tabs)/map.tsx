import { config } from '@/config';
import { useLocationStore } from "@/stors/locationStore";
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";
import { getDistance } from 'geolib';
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline } from "react-native-maps";

interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

// Order types based on API response
interface OrderProduct {
  id: string;
  name: string;
  pricePerKg: number;
}

interface OrderDetail {
  id: string;
  orderId: string;
  productId: string;
  quantityKg: number;
  product: OrderProduct;
}

interface Producer {
  id: string;
  cityId: number;
  a_longitude: number;
  a_latitude: number;
  a_address: string;
  user: {
    id: string;
    fullname: string;
    phone: string;
  };
}

interface Buyer {
  id: string;
  user: {
    id: string;
    fullname: string;
    phone: string;
  };
}

interface TransporterOrder {
  id: string;
  producerId: string;
  buyerId: string;
  transporterId: string | null;
  transportFee: number | null;
  b_longitude: number;
  b_latitude: number;
  b_address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  distanceToProducerMeters: number;
  distanceToProducerKm: number;
  orderDetails: OrderDetail[];
  producer: Producer;
  buyer: Buyer;
}

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<LocationCoordinate | null>(null);
  const { selectedLocation, setSelectedLocation } = useLocationStore();

  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // ===============================
  // Orders state
  // ===============================
  const [orders, setOrders] = useState<TransporterOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TransporterOrder | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  // ===============================
  // Route coordinates from Mapbox
  // ===============================
  const [routeCoords, setRouteCoords] = useState<LocationCoordinate[]>([]);

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoiYWJkZW5vdWFyNzkwIiwiYSI6ImNtaWJ2NWxweTA2MGYybHF6NWRodnhhNm8ifQ.Uk_R5vbpYNeDx7E8HIWbJg";

  // ===============================
  // Fetch available orders for transporter
  // ===============================
  const fetchAvailableOrders = async () => {
    if (!userLocation) return;

    setIsLoadingOrders(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.log('No auth token found');
        return;
      }

      const url = `${config.baseUrl}${config.transporterAvailableOrdersUrl}?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radiusKm=50`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      const availableOrders = data.orders || data || [];
      
      // Filter for confirmed orders only
      const confirmedOrders = availableOrders.filter(
        (order: TransporterOrder) => order.status?.toLowerCase() === 'confirmed'
      );
      
      setOrders(confirmedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // ===============================
  // Accept order
  // ===============================
  const acceptOrder = async () => {
    if (!selectedOrder) return;

    setIsAccepting(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert('Error', 'Not authenticated');
        return;
      }

      const url = `${config.baseUrl}${config.transporterOrderAcceptUrl(selectedOrder.id)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to accept order: ${errorText}`);
      }

      Alert.alert('Success', 'Order accepted successfully!');
      setSelectedOrder(null);
      setRouteCoords([]);
      // Refresh orders
      fetchAvailableOrders();
    } catch (error: any) {
      console.error('Error accepting order:', error);
      Alert.alert('Error', error.message || 'Failed to accept order');
    } finally {
      setIsAccepting(false);
    }
  };

  // ===============================
  // Decline/Clear selection
  // ===============================
  const declineOrder = () => {
    setSelectedOrder(null);
    setRouteCoords([]);
  };

  // FETCH ROUTE FROM MAPBOX (pickup to delivery)
  const fetchRoute = async () => {
    if (!selectedOrder) {
      setRouteCoords([]);
      return;
    }

    const pickup = {
      latitude: selectedOrder.producer.a_latitude,
      longitude: selectedOrder.producer.a_longitude,
    };
    const delivery = {
      latitude: selectedOrder.b_latitude,
      longitude: selectedOrder.b_longitude,
    };

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.longitude},${pickup.latitude};${delivery.longitude},${delivery.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

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

  // Fetch route when order is selected
  useEffect(() => {
    fetchRoute();
  }, [selectedOrder]);

  // Fetch orders when user location is available
  useEffect(() => {
    if (userLocation) {
      fetchAvailableOrders();
    }
  }, [userLocation]);

  // Handle order marker press
  const handleOrderPress = (order: TransporterOrder) => {
    setSelectedOrder(order);
    // Expand bottom sheet when order is selected
    bottomSheetRef.current?.snapToIndex(1);
  };

  // Calculate distance between pickup and delivery
  const getOrderDistance = () => {
    if (!selectedOrder) return null;
    
    const pickup = {
      latitude: selectedOrder.producer.a_latitude,
      longitude: selectedOrder.producer.a_longitude,
    };
    const delivery = {
      latitude: selectedOrder.b_latitude,
      longitude: selectedOrder.b_longitude,
    };
    
    return getDistance(pickup, delivery) / 1000;
  };

  // Calculate total order value
  const getOrderTotal = () => {
    if (!selectedOrder) return 0;
    return selectedOrder.orderDetails.reduce((total, detail) => {
      return total + (detail.product.pricePerKg * detail.quantityKg);
    }, 0);
  };

  // Estimated delivery fee (can be calculated based on distance)
  const getEstimatedFee = () => {
    const distance = getOrderDistance();
    if (!distance) return 350; // default
    // Example: 50 DA per km, minimum 350 DA
    return Math.max(350, Math.round(distance * 50));
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
        {/* Loading indicator for orders */}
        {isLoadingOrders && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#10B981" />
          </View>
        )}

        {/* Map */}
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
        >
          {/* Order pickup markers (green) */}
          {orders.map((order) => (
            <Marker
              key={`pickup-${order.id}`}
              coordinate={{
                latitude: order.producer.a_latitude,
                longitude: order.producer.a_longitude,
              }}
              pinColor="#10B981"
              title={`Pickup: ${order.producer.user.fullname}`}
              description={`${order.distanceToProducerKm?.toFixed(1)} km away`}
              onPress={() => handleOrderPress(order)}
            />
          ))}

          {/* Selected order delivery marker (red) */}
          {selectedOrder && (
            <Marker
              coordinate={{
                latitude: selectedOrder.b_latitude,
                longitude: selectedOrder.b_longitude,
              }}
              pinColor="#EF4444"
              title={`Delivery: ${selectedOrder.buyer.user.fullname}`}
              description={selectedOrder.b_address}
            />
          )}

          {/* Polyline of the route from pickup to delivery */}
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeWidth={4}
              strokeColor="#4bc03f"
            />
          )}
        </MapView>

        {/* Orders count badge */}
        <View style={styles.ordersBadge}>
          <Text style={styles.ordersBadgeText}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} available
          </Text>
        </View>

        {/* BottomSheet */}
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={[120, '60%']}
          backgroundStyle={{ backgroundColor: '#fff' }}
        >
          <BottomSheetScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* Drag Handle */}
            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }} />
            </View>

            {selectedOrder ? (
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
                          {selectedOrder.producer.a_address || 'Pickup Location'}
                        </Text>
                      </View>
                      
                      <View style={{ width: 2, height: 20, backgroundColor: '#D1D5DB', marginLeft: 4, marginBottom: 12 }} />
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#EF4444', marginRight: 12 }} />
                        <Text style={{ fontSize: 14, color: '#6B7280', flex: 1 }} numberOfLines={1}>
                          {selectedOrder.b_address || 'Delivery Location'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={{ alignItems: 'flex-end', marginLeft: 16 }}>
                      <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
                        {getOrderDistance()?.toFixed(1)} km
                      </Text>
                      <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                        ~{Math.round((getOrderDistance() || 0) * 3)} min
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Producer Info */}
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
                      {selectedOrder.producer.user.fullname}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, color: '#10B981', marginRight: 8 }}>★ 4.8</Text>
                      <Text style={{ fontSize: 13, color: '#9CA3AF' }}>• Producer</Text>
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
                    <Text style={{ fontSize: 18 }}>📞</Text>
                  </TouchableOpacity>
                </View>

                {/* Delivery Items */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 10, letterSpacing: 0.5 }}>
                    DELIVERY ITEMS ({selectedOrder.orderDetails.length})
                  </Text>
                  {selectedOrder.orderDetails.map((detail) => (
                    <View key={detail.id} style={{ 
                      flexDirection: 'row',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 12,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                      marginBottom: 8
                    }}>
                      <View style={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: 8,
                        backgroundColor: '#F3F4F6',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Text style={{ fontSize: 20 }}>📦</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
                        <Text style={{ 
                          fontSize: 14, 
                          fontWeight: '600', 
                          color: '#111827',
                          marginBottom: 2
                        }} numberOfLines={1}>
                          {detail.product.name}
                        </Text>
                        <Text style={{ fontSize: 13, color: '#6B7280' }}>
                          {detail.quantityKg} kg × {detail.product.pricePerKg} DA
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#10B981', alignSelf: 'center' }}>
                        {(detail.quantityKg * detail.product.pricePerKg).toFixed(0)} DA
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Buyer Info */}
                <View style={{ 
                  backgroundColor: '#FEF3C7',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 20, marginRight: 10 }}>🏠</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#92400E' }}>
                      Deliver to: {selectedOrder.buyer.user.fullname}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#B45309' }}>
                      {selectedOrder.buyer.user.phone}
                    </Text>
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
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>Items total</Text>
                    <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>{getOrderTotal().toFixed(0)} DA</Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>Distance from you</Text>
                    <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>{selectedOrder.distanceToProducerKm?.toFixed(1)} km</Text>
                  </View>
                  
                  <View style={{ 
                    borderTopWidth: 1, 
                    borderTopColor: '#E5E7EB',
                    paddingTop: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>Your earnings</Text>
                    <Text style={{ fontSize: 17, fontWeight: '700', color: '#10B981' }}>
                      {getEstimatedFee()} DA
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <TouchableOpacity
                  className="bg-primary"
                  style={{
                    paddingVertical: 16,
                    borderRadius: 12,
                    marginBottom: 10,
                    opacity: isAccepting ? 0.7 : 1
                  }}
                  onPress={acceptOrder}
                  disabled={isAccepting}
                >
                  {isAccepting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={{ 
                      color: '#FFFFFF', 
                      textAlign: 'center', 
                      fontSize: 16, 
                      fontWeight: '700',
                      letterSpacing: 0.5
                    }}>
                      Accept Order - Earn {getEstimatedFee()} DA
                    </Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: '#F3F4F6',
                    paddingVertical: 16,
                    borderRadius: 12,
                    marginBottom: 10
                  }}
                  onPress={declineOrder}
                >
                  <Text style={{ 
                    color: '#6B7280', 
                    textAlign: 'center', 
                    fontSize: 16, 
                    fontWeight: '600'
                  }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
                  Available Deliveries
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 16 }}>
                  Tap on a green marker on the map to see order details and accept deliveries
                </Text>
                
                {orders.length === 0 && !isLoadingOrders && (
                  <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <Text style={{ fontSize: 40, marginBottom: 12 }}>📭</Text>
                    <Text style={{ fontSize: 16, color: '#9CA3AF' }}>No orders available nearby</Text>
                    <TouchableOpacity 
                      onPress={fetchAvailableOrders}
                      style={{ marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#10B981', borderRadius: 8 }}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Refresh</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {orders.length > 0 && (
                  <View style={{ width: '100%' }}>
                    {orders.slice(0, 3).map((order) => (
                      <TouchableOpacity
                        key={order.id}
                        onPress={() => handleOrderPress(order)}
                        style={{
                          backgroundColor: '#F8F9FA',
                          borderRadius: 12,
                          padding: 14,
                          marginBottom: 10,
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 18 }}>📦</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                            {order.producer.user.fullname}
                          </Text>
                          <Text style={{ fontSize: 13, color: '#6B7280' }}>
                            {order.distanceToProducerKm?.toFixed(1)} km • {order.orderDetails.length} items
                          </Text>
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#10B981' }}>→</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
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
  loadingOverlay: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ordersBadge: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ordersBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
