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
  
  // Producer - Orders
  producerOrdersUrl: '/api/producer/orders',
  producerOrderUrl: (id: string) => `/api/producer/orders/${id}`,
  producerOrderStatusUrl: (id: string) => `/api/producer/orders/${id}/status`,
  
  // Legacy endpoints (to be deprecated)
  shopsUrl: '/api/shops',
  userUrl: '/api/user',
  productsUrl: '/api/products',
  logoutUrl: '/api/logout',
  profileUrl: '/api/profile',
  ordersUrl: '/api/orders',
  orderUrl: '/api/order',
  orderItemsUrl: '/api/order-items',
  cartUrl: '/api/cart',
  cartItemsUrl: '/api/cart-items',
};