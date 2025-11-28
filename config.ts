
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
  
  // Buyer - Orders
  buyerOrdersUrl: '/api/buyer/orders',

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
  orderUrl: '/api/buyer/order',
  orderItemsUrl: '/api/order-items',
  cartUrl: '/api/cart',
  cartItemsUrl: '/api/cart-items',
  image_url: (id: string) => `${config.baseUrl}/api/images/${id}`,

};

export async function createBuyerOrder(token: string, payload: {
  items: Array<{ productId: string | number; quantityKg: number }>,
  delivery: { longitude: number; latitude: number; address: string }
}) {
  const res = await fetch(`${config.baseUrl}/buyer/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: payload.items.map(i => ({
        productId: String(i.productId),
        quantityKg: i.quantityKg
      })),
      delivery: payload.delivery
    })
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Buyer order failed (${res.status}): ${text.substring(0, 200)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}