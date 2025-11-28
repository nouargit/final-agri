export const config = {
  baseUrl: 'https://agri-connect-api-six.vercel.app',
  
  // Authentication
  sendOtpUrl: '/api/auth/opt/send',
  verifyOtpUrl: '/api/auth/opt/verify',
  meUrl: '/api/me',
  
  // Onboarding
  onboardingStep1Url: '/api/on-boarding/step/1',
  onboardingStep2Url: '/api/on-boarding/step/2',
  
  // Location Data
  wilayasUrl: '/api/dz/wilayas',
  citiesUrl: '/api/dz/cities',
  
  // Categories
  categoriesUrl: '/api/categories',
  
  // Producer - Products
  producerProductsUrl: '/api/producer/products',
  producerProductUrl: (id: string) => `/api/producer/products/${id}`,
  producerProductUpdateUrl: (id: string) => `/api/producer/products/${id}`,
  producerProductDeleteUrl: (id: string) => `/api/producer/products/${id}`,
  
  // Producer - Orders
  producerOrdersUrl: '/api/producer/orders',
  producerOrderUrl: (id: string) => `/api/producer/orders/${id}`,
  producerOrderStatusUrl: (id: string) => `/api/producer/orders/${id}/status`,

  // Transporter - Onboarding
  transporterOnboardingStep1Url: '/api/on-boarding/step/1',
  transporterOnboardingStep2Url: '/api/on-boarding/step/2',
  transporterProfileUrl: '/api/transporter/profile',
  transporterVehiclesUrl: '/api/transporter/vehicles',
  transporterVehicleUrl: (id: string) => `/api/transporter/vehicles/${id}`,
  transporterOrdersUrl: '/api/transporter/orders',
  transporterOrderUrl: (id: string) => `/api/transporter/orders/${id}`,
  transporterOrderStatusUrl: (id: string) => `/api/transporter/orders/${id}/status`,

  // Consumer - Products
  consumerProductsUrl: '/api/products',
  consumerProductUrl: (id: string) => `/api/products/${id}`,

  // Carts (consumer)
  cartsUrl: '/api/carts',
  cartUrlById: (id: string) => `/api/carts/${id}`,
  cartItemsUrlByCart: (id: string) => `/api/carts/${id}/items`,
  cartItemUrlByIds: (cartId: string, itemId: string) => `/api/carts/${cartId}/items/${itemId}`,
  
  // Legacy endpoints (to be deprecated)
  shopsUrl: '/api/shops',
  userUrl: '/api/user',
  productsUrl: '/api/products',

  // Typo legacy alias (kept for backward compatibility in shop.tsx)
  preducerProductsUrl: '/api/producer/products',
  logoutUrl: '/api/logout',
  profileUrl: '/api/profile',
  ordersUrl: '/api/orders',
  orderUrl: '/api/order',
  orderItemsUrl: '/api/order-items',
  cartUrl: '/api/cart',
  cartItemsUrl: '/api/cart-items',
};