/**
 * TypeScript interfaces for Shopify Storefront API GraphQL responses
 * Used for Phase 2: Shopify as catalog source
 */

// Base Shopify GraphQL response structure
export interface ShopifyGraphQLResponse<T> {
  data?: T
  errors?: ShopifyGraphQLError[]
  extensions?: Record<string, any>
}

export interface ShopifyGraphQLError {
  message: string
  field?: string[]
  code?: string
  locations?: Array<{
    line: number
    column: number
  }>
}

// Product-related types
export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  productType: string
  vendor: string
  tags: string[]
  availableForSale: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  requiresSellingPlan: boolean
  totalInventory: number
  featuredImage?: ShopifyImage
  images: ShopifyImageConnection
  media: ShopifyMediaConnection
  variants: ShopifyProductVariantConnection
  options: ShopifyProductOption[]
  priceRange: ShopifyProductPriceRange
  compareAtPriceRange: ShopifyProductPriceRange
  seo: ShopifySEO
  collections: ShopifyCollectionConnection
  selectedOrFirstAvailableVariant?: ShopifyProductVariant
}

export interface ShopifyImage {
  id: string
  url: string
  altText?: string
  width: number
  height: number
}

export interface ShopifyImageConnection {
  edges: ShopifyImageEdge[]
  pageInfo: ShopifyPageInfo
}

export interface ShopifyImageEdge {
  node: ShopifyImage
  cursor: string
}

export interface ShopifyMediaConnection {
  edges: ShopifyMediaEdge[]
  pageInfo: ShopifyPageInfo
}

export interface ShopifyMediaEdge {
  node: ShopifyMedia
  cursor: string
}

export interface ShopifyMedia {
  id: string
  mediaType: 'IMAGE' | 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D'
  image?: ShopifyImage
  video?: ShopifyVideo
  externalVideo?: ShopifyExternalVideo
  model3d?: ShopifyModel3D
}

export interface ShopifyVideo {
  id: string
  previewImageUrl: string
  url: string
  mimeType: string
  sources: ShopifyVideoSource[]
}

export interface ShopifyVideoSource {
  url: string
  mimeType: string
  format: string
  height: number
  width: number
}

export interface ShopifyExternalVideo {
  id: string
  embeddedUrl: string
  host: string
  videoId: string
}

export interface ShopifyModel3D {
  id: string
  alt: string
  sources: ShopifyModel3DSource[]
}

export interface ShopifyModel3DSource {
  url: string
  mimeType: string
  format: string
  fileSize: number
}

export interface ShopifyProductVariant {
  id: string
  title: string
  sku?: string
  availableForSale: boolean
  currentlyNotInStock: boolean
  quantityAvailable: number
  price: ShopifyMoney
  compareAtPrice?: ShopifyMoney
  weight?: number
  weightUnit?: string
  requiresShipping: boolean
  taxable: boolean
  selectedOptions: ShopifySelectedOption[]
  image?: ShopifyImage
  product: ShopifyProduct
}

export interface ShopifyProductVariantConnection {
  edges: ShopifyProductVariantEdge[]
  pageInfo: ShopifyPageInfo
}

export interface ShopifyProductVariantEdge {
  node: ShopifyProductVariant
  cursor: string
}

export interface ShopifySelectedOption {
  name: string
  value: string
}

export interface ShopifyProductOption {
  id: string
  name: string
  values: string[]
}

export interface ShopifyProductPriceRange {
  minVariantPrice: ShopifyMoney
  maxVariantPrice: ShopifyMoney
}

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifySEO {
  title: string
  description: string
}

// Collection-related types
export interface ShopifyCollection {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  image?: ShopifyImage
  products: ShopifyProductConnection
  updatedAt: string
  seo: ShopifySEO
}

export interface ShopifyCollectionConnection {
  edges: ShopifyCollectionEdge[]
  pageInfo: ShopifyPageInfo
}

export interface ShopifyCollectionEdge {
  node: ShopifyCollection
  cursor: string
}

export interface ShopifyProductConnection {
  edges: ShopifyProductEdge[]
  pageInfo: ShopifyPageInfo
}

export interface ShopifyProductEdge {
  node: ShopifyProduct
  cursor: string
}

export interface ShopifyPageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

// Query response types
export interface ShopifyProductsResponse {
  products: ShopifyProductConnection
}

export interface ShopifyCollectionsResponse {
  collections: ShopifyCollectionConnection
}

export interface ShopifyProductResponse {
  product: ShopifyProduct
}

export interface ShopifyCollectionResponse {
  collection: ShopifyCollection
  collectionByHandle: ShopifyCollection
}

// Query variables types
export interface ShopifyProductsQueryVars {
  first?: number
  after?: string
  query?: string
  sortKey?: 'TITLE' | 'PRODUCT_TYPE' | 'VENDOR' | 'INVENTORY_TOTAL' | 'PRICE' | 'CREATED_AT' | 'UPDATED_AT' | 'BEST_SELLING' | 'MANUAL'
  reverse?: boolean
}

export interface ShopifyCollectionsQueryVars {
  first?: number
  after?: string
  sortKey?: 'TITLE' | 'UPDATED_AT' | 'COLLECTION_TYPE' | 'BEST_SELLING' | 'MANUAL'
  reverse?: boolean
}

export interface ShopifyProductQueryVars {
  id: string
}

export interface ShopifyCollectionByHandleQueryVars {
  handle: string
  first?: number
  after?: string
  sortKey?: 'TITLE' | 'PRODUCT_TYPE' | 'VENDOR' | 'INVENTORY_TOTAL' | 'PRICE' | 'CREATED_AT' | 'UPDATED_AT' | 'BEST_SELLING' | 'MANUAL'
  reverse?: boolean
}
