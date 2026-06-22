export const PUBLIC_ROUTES = {
  HOME: '/',
  CATALOG: '/catalogo',
  PRODUCT: (slug: string) => `/producto/${slug}`,
  CART: '/carrito',
  FAVORITES: '/favoritos',
  ORDERS: '/pedidos',
  ORDER_TRACK: '/pedidos/seguimiento',
  PROFILE: '/perfil',
  CONTACT: '/contacto',
  PROMOTIONS: '/promociones',
  CATEGORIES: '/categorias',
  LOGIN: '/login',
  REGISTER: '/registro',
  CHAT: '/chat',
} as const;

export const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001';
