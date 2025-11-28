import AsyncStorage from '@react-native-async-storage/async-storage';

const CARTS_KEY = 'persisted_carts'
const ORDERS_KEY = 'persisted_orders'

export type Shop = { id: number; name: string; logo_url?: string }
export type Product = { id: number; name: string; price: number; images?: any[] }

export async function loadCarts(): Promise<any[]> {
  try {
    const raw = await AsyncStorage.getItem(CARTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function saveCarts(next: any[]) {
  await AsyncStorage.setItem(CARTS_KEY, JSON.stringify(next))
}

export async function loadOrders(): Promise<any[]> {
  try {
    const raw = await AsyncStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function saveOrders(next: any[]) {
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(next))
}

function recomputeCartTotals(cart: any) {
  const total = (cart.items || []).reduce((sum: number, it: any) => {
    const line = (it.price ?? 0) * (it.quantity ?? 0)
    return sum + line
  }, 0)
  return { ...cart, total: Number(total.toFixed(2)) }
}

export async function upsertItemToCart(shop: Shop, product: Product, quantity: number = 1) {
  const carts = await loadCarts()
  let cart = carts.find((c: any) => c.shop?.id === shop.id)

  if (!cart) {
    cart = {
      id: Date.now(),
      shop_id: shop.id,
      user_id: 1,
      total: 0,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shop,
      items: [],
    }
    carts.push(cart)
  }

  const idx = cart.items.findIndex((it: any) => it.product_id === product.id)
  if (idx >= 0) {
    const current = cart.items[idx]
    cart.items[idx] = {
      ...current,
      quantity: (current.quantity ?? 0) + quantity,
      price: product.price ?? current.price ?? 0,
      updated_at: new Date().toISOString(),
      product,
    }
  } else {
    cart.items.push({
      id: Date.now(),
      cart_id: cart.id,
      product_id: product.id,
      quantity,
      price: product.price ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product,
    })
  }

  const updated = carts.map((c: any) =>
    c.id === cart.id ? recomputeCartTotals({ ...cart, updated_at: new Date().toISOString() }) : c
  )
  await saveCarts(updated)
  return updated
}

export async function submitCart(cartId: number) {
  const carts = await loadCarts()
  const cart = carts.find((c: any) => c.id === cartId)
  if (!cart) return { carts, orders: await loadOrders() }

  const orders = await loadOrders()
  const newOrder = {
    ...cart,
    id: Date.now(),
    status: 'confirmed',
    submitted_at: new Date().toISOString(),
  }
  const nextOrders = [newOrder, ...orders]
  const nextCarts = carts.filter((c: any) => c.id !== cartId)

  await saveOrders(nextOrders)
  await saveCarts(nextCarts)
  return { carts: nextCarts, orders: nextOrders }
}
