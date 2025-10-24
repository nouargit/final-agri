import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeliveryOrdersComponent from '@/components/DeliveryOrdersComponent';
import { images } from '@/constants/imports';

// Sample delivery orders data
const sampleDeliveryOrders = [
  {
    id: "DEL-001",
    shop: {
      id: "shop-1",
      name: "Sweet Delights Bakery",
      image: images.shopAvatar,
      address: "123 Main Street, Downtown",
      phoneNumber: "+1 234-567-8901"
    },
    deliveryLocation: {
      address: "456 Oak Avenue, Apartment 2B, Uptown",
      customerName: "Sarah Johnson",
      phoneNumber: "+1 234-567-8902",
      notes: "Ring doorbell twice, leave at door if no answer"
    },
    orderDate: "2024-01-15",
    deliveryTime: "2:30 PM",
    totalAmount: "$45.50",
    status: "assigned" as const,
    items: 3,
    distance: "2.5 km",
    estimatedTime: "15 mins"
  },
  {
    id: "DEL-002",
    shop: {
      id: "shop-2",
      name: "Golden Bakes",
      image: images.shopAvatar,
      address: "789 Baker Street, Midtown",
      phoneNumber: "+1 234-567-8903"
    },
    deliveryLocation: {
      address: "321 Pine Road, House #15, Suburbs",
      customerName: "Mike Chen",
      phoneNumber: "+1 234-567-8904",
      notes: "Call upon arrival"
    },
    orderDate: "2024-01-15",
    deliveryTime: "3:15 PM",
    totalAmount: "$32.75",
    status: "picked_up" as const,
    items: 2,
    distance: "4.1 km",
    estimatedTime: "25 mins"
  },
  {
    id: "DEL-003",
    shop: {
      id: "shop-3",
      name: "Cake Heaven",
      image: images.shopAvatar,
      address: "555 Sweet Lane, Old Town",
      phoneNumber: "+1 234-567-8905"
    },
    deliveryLocation: {
      address: "888 Elm Street, Office Building Floor 3",
      customerName: "Emma Wilson",
      phoneNumber: "+1 234-567-8906",
      notes: "Business delivery - ask for Emma at reception"
    },
    orderDate: "2024-01-15",
    deliveryTime: "4:00 PM",
    totalAmount: "$67.25",
    status: "in_transit" as const,
    items: 5,
    distance: "1.8 km",
    estimatedTime: "12 mins"
  }
];

const DeliveryOrdersScreen = () => {
  const handleOrderPress = (order: any) => {
    console.log('Order pressed:', order.id);
    // Handle order details navigation
  };

  const handleNavigatePress = (order: any) => {
    console.log('Navigate to:', order.deliveryLocation.address);
    // Handle navigation to delivery location
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <DeliveryOrdersComponent
        orders={sampleDeliveryOrders}
        onOrderPress={handleOrderPress}
        onNavigatePress={handleNavigatePress}
      />
    </SafeAreaView>
  );
};

export default DeliveryOrdersScreen;