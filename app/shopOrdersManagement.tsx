import React from 'react';
import ShopOrderComponent from '@/components/ShopOrderComponent';
import { images } from '@/constants/imports';

// Sample shop orders data
const sampleShopOrders = [
  {
    id: "ORD-001",
    customer: {
      id: "cust1",
      name: "Alice Johnson",
      profilePicture: images.avatar,
      phoneNumber: "+1234567890",
      acceptedOrders: 15,
      returnedOrders: 1
    },
    orderDate: "2024-01-15",
    totalAmount: "$42.50",
    status: "pending" as const,
    items: 3
  },
  {
    id: "ORD-002",
    customer: {
      id: "cust2",
      name: "Bob Smith",
      profilePicture: images.avatar,
      phoneNumber: "+1987654321",
      acceptedOrders: 8,
      returnedOrders: 0
    },
    orderDate: "2024-01-15",
    totalAmount: "$28.75",
    status: "accepted" as const,
    items: 2
  },
  {
    id: "ORD-003",
    customer: {
      id: "cust3",
      name: "Carol Davis",
      profilePicture: images.avatar,
      phoneNumber: "+1555666777",
      acceptedOrders: 22,
      returnedOrders: 3
    },
    orderDate: "2024-01-15",
    totalAmount: "$65.00",
    status: "preparing" as const,
    items: 4
  },
  {
    id: "ORD-004",
    customer: {
      id: "cust4",
      name: "David Wilson",
      profilePicture: images.avatar,
      phoneNumber: "+1444333222",
      acceptedOrders: 5,
      returnedOrders: 0
    },
    orderDate: "2024-01-15",
    totalAmount: "$19.25",
    status: "ready" as const,
    items: 1
  }
];

const ShopOrdersManagementScreen = () => {
  const handleOrderPress = (order: any) => {
    console.log('Order pressed:', order.id);
    // Handle order press - could navigate to order details
  };

  const handleCustomerPress = (customer: any) => {
    console.log('Customer pressed:', customer.name);
    // Handle customer press - could show customer details
  };

  return (
    <ShopOrderComponent
      orders={sampleShopOrders}
      onOrderPress={handleOrderPress}
      onCustomerPress={handleCustomerPress}
    />
  );
};

export default ShopOrdersManagementScreen;