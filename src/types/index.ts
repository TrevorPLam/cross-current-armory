export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  inStock: boolean
  rating?: number
  reviews?: number
  image: string
  images?: string[]
  video?: ProductVideo
  specs?: ProductSpecs
  comparison?: ComparisonData
  /** Shopify GID (gid://shopify/ProductVariant/...) for checkout; required for Shopify checkout */
  shopifyVariantId?: string
  /** Shopify product handle for URLs (e.g. a2-level-iii-alloy-body-armor) */
  handle?: string
}

export interface ProductVideo {
  url: string
  thumbnail: string
  duration?: number
  title?: string
}

export interface ProductSpecs {
  [key: string]: string | number | boolean
}

export interface ComparisonData {
  features: string[]
  specifications: Record<string, string | number>
}

export interface CartItem extends Product {
  quantity: number
}

export interface ContactForm {
  name: string
  email: string
  message: string
}

export type Category = 'All' | 'Body Armor' | 'Plate Carriers' | 'Equipment'
