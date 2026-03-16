/**
 * Utility functions to map Shopify Storefront API data to our existing Product type
 * Used for Phase 2: Shopify as catalog source
 */

import type { Product, ProductVideo, ProductSpecs } from '../types'
import type { ShopifyProduct, ShopifyProductVariant } from '../types/shopify'

/**
 * Map a Shopify product to our internal Product type
 */
export function mapShopifyProduct(product: ShopifyProduct): Product {
  const images = product.images.edges.map(edge => edge.node.url)
  const featuredImage = product.featuredImage?.url || images[0] || ''
  
  // Get the first available variant for default pricing and variant ID
  const firstVariant = product.selectedOrFirstAvailableVariant || product.variants.edges[0]?.node
  
  // Extract price from the first variant
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0
  
  // Extract variant ID for cart functionality
  const shopifyVariantId = firstVariant?.id || ''
  
  // Determine category from product type or tags
  const category = mapShopifyCategory(product.productType, product.tags)
  
  // Extract specs from tags and metafields
  const specs = extractProductSpecs(product)
  
  // Check if product is available
  const inStock = product.availableForSale && (firstVariant?.availableForSale || false)
  
  return {
    id: product.id,
    name: product.title,
    price,
    category,
    description: product.description,
    inStock,
    image: featuredImage,
    images: images.length > 0 ? images : [featuredImage],
    shopifyVariantId,
    handle: product.handle,
    rating: 4.5, // Default rating - could be fetched from reviews app later
    reviews: 0, // Default review count - could be fetched from reviews app later
    specs,
  }
}

/**
 * Map Shopify product type/tags to our category system
 */
function mapShopifyCategory(productType: string, tags: string[]): string {
  // Normalize product type and tags for matching
  const normalizedProductType = productType.toLowerCase()
  const normalizedTags = tags.map(tag => tag.toLowerCase())
  
  // Map based on live site categories from FULL-SITE-ANALYSIS.md
  if (normalizedTags.includes('armor') || normalizedProductType.includes('armor')) {
    return 'Body Armor'
  }
  
  if (normalizedTags.includes('plate carrier') || normalizedProductType.includes('carrier')) {
    return 'Plate Carriers'
  }
  
  if (normalizedTags.includes('armor plates') || normalizedProductType.includes('plate')) {
    return 'Body Armor' // Armor plates are part of Body Armor category
  }
  
  if (normalizedTags.includes('kit accessories') || normalizedTags.includes('accessories')) {
    return 'Equipment'
  }
  
  // Default fallback
  return 'Equipment'
}

/**
 * Extract product specifications from Shopify product data
 */
function extractProductSpecs(product: ShopifyProduct): ProductSpecs {
  const specs: ProductSpecs = {}
  
  // Extract from tags (common pattern for tactical gear)
  product.tags.forEach(tag => {
    if (tag.includes('Level ')) {
      specs['Ballistic Rating'] = tag
    }
    if (tag.includes('III+') || tag.includes('III++')) {
      specs['Protection Level'] = tag
    }
  })
  
  // Extract from product description (look for common specs)
  const description = product.description.toLowerCase()
  
  // Weight detection
  const weightMatch = description.match(/(\d+\.?\d*)\s*(?:lbs|pounds|kg)/i)
  if (weightMatch) {
    specs['Weight'] = `${weightMatch[1]} lbs`
  }
  
  // Material detection
  if (description.includes('steel')) {
    specs['Material'] = 'AR500 Steel'
  } else if (description.includes('alloy')) {
    specs['Material'] = 'Advanced Alloy'
  } else if (description.includes('ceramic')) {
    specs['Material'] = 'Ceramic Composite'
  }
  
  // Size detection
  const sizeMatch = description.match(/(\d+"?\s*x\s*\d+"?)/i)
  if (sizeMatch) {
    specs['Size'] = sizeMatch[1]
  }
  
  return specs
}

/**
 * Map Shopify variant to our cart system
 */
export function mapShopifyVariant(variant: ShopifyProductVariant): {
  shopifyVariantId: string
  price: number
  available: boolean
  title: string
  options: Record<string, string>
} {
  const options: Record<string, string> = {}
  
  variant.selectedOptions.forEach(option => {
    options[option.name] = option.value
  })
  
  return {
    shopifyVariantId: variant.id,
    price: parseFloat(variant.price.amount),
    available: variant.availableForSale,
    title: variant.title,
    options,
  }
}

/**
 * Get all available variants for a product
 */
export function getProductVariants(product: ShopifyProduct) {
  return product.variants.edges.map(edge => mapShopifyVariant(edge.node))
}

/**
 * Find a specific variant by selected options
 */
export function findVariantByOptions(
  product: ShopifyProduct,
  selectedOptions: Record<string, string>
) {
  const variants = getProductVariants(product)
  
  return variants.find(variant => {
    // Check if all selected options match this variant
    return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
      return variant.options[optionName] === optionValue
    })
  })
}

/**
 * Extract product video information (if available)
 */
export function extractProductVideo(product: ShopifyProduct): ProductVideo | undefined {
  // Look for video media in the product's media
  const videoMedia = product.media.edges.find(edge => 
    edge.node.mediaType === 'VIDEO' || edge.node.mediaType === 'EXTERNAL_VIDEO'
  )
  
  if (videoMedia) {
    const media = videoMedia.node
    
    if (media.mediaType === 'VIDEO' && media.video) {
      return {
        url: media.video.sources[0]?.url || '',
        thumbnail: media.video.previewImageUrl || '',
        duration: undefined, // Duration might be available in some video sources
        title: product.title,
      }
    }
    
    if (media.mediaType === 'EXTERNAL_VIDEO' && media.externalVideo) {
      return {
        url: media.externalVideo.embeddedUrl,
        thumbnail: '', // External videos might not have thumbnails
        title: product.title,
      }
    }
  }
  
  return undefined
}

/**
 * Format price from Shopify Money object
 */
export function formatPrice(price: { amount: string; currencyCode: string }): string {
  const amount = parseFloat(price.amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(amount)
}

/**
 * Check if a product has multiple variants
 */
export function hasMultipleVariants(product: ShopifyProduct): boolean {
  return product.variants.edges.length > 1
}

/**
 * Get available options for a product (Size, Color, etc.)
 */
export function getProductOptions(product: ShopifyProduct): Record<string, string[]> {
  const options: Record<string, string[]> = {}
  
  product.options.forEach(option => {
    options[option.name] = option.values
  })
  
  return options
}
