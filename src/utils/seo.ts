// SEO optimization utilities for React applications
import type { Product } from '../types'

// SEO metadata interface
export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'product' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  structuredData?: Record<string, any>
  noIndex?: boolean
  noFollow?: boolean
}

// Enhanced SEO utilities with react-helmet-async support
export const seoOptimization = {
  // Generate structured data for products (use real image URL; 2026 favors shippingDetails/hasMerchantReturnPolicy)
  generateProductStructuredData: (product: Product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: !product.image ? undefined : product.image.startsWith('http') ? product.image : `${window.location.origin}${product.image.startsWith('/') ? '' : '/'}${product.image}`,
    brand: {
      '@type': 'Brand',
      name: 'Cross-Current Precision Armory'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Cross-Current Precision Armory'
      },
      // 2026 shipping details enhancement
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '9.99',
          currency: 'USD'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['https://schema.org/Monday', 'https://schema.org/Tuesday', 'https://schema.org/Wednesday', 'https://schema.org/Thursday', 'https://schema.org/Friday']
          },
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 5,
            unitCode: 'DAY'
          }
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US'
        }
      },
      // 2026 merchant return policy enhancement
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/RestockingFees'
      }
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews || 0,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    // Additional 2026 enhancements
    sku: product.id,
    category: 'Tactical Gear',
    material: 'High-strength materials',
    weight: {
      '@type': 'QuantitativeValue',
      value: 'Varies by product',
      unitCode: 'KG'
    }
  }),

  // Generate organization structured data
  generateOrganizationStructuredData: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cross-Current Precision Armory',
    description: 'Texas Proud, Family Strong - Your trusted source for tactical gear and equipment',
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '(555) 123-4567',
      contactType: 'customer service',
      availableLanguage: 'English'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Texas',
      addressCountry: 'US'
    },
    sameAs: [
      'https://facebook.com/crosscurrentarmory',
      'https://twitter.com/crosscurrentarmory'
    ]
  }),

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData: (breadcrumbs: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }),

  // Generate website structured data
  generateWebsiteStructuredData: () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cross-Current Precision Armory',
    url: window.location.origin,
    description: 'Texas Proud, Family Strong - Your trusted source for tactical gear and equipment',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }),

  // Create comprehensive SEO metadata
  createMetadata: (config: SEOMetadata) => {
    const baseUrl = window.location.origin
    const fullUrl = config.canonical || `${baseUrl}${window.location.pathname}`
    
    return {
      // Basic meta tags
      title: config.title,
      description: config.description,
      
      // Open Graph tags
      'og:title': config.title,
      'og:description': config.description,
      'og:type': config.ogType || 'website',
      'og:url': fullUrl,
      'og:image': config.ogImage || `${baseUrl}/og-default.jpg`,
      'og:site_name': 'Cross-Current Precision Armory',
      
      // Twitter Card tags
      'twitter:card': config.twitterCard || 'summary_large_image',
      'twitter:title': config.title,
      'twitter:description': config.description,
      'twitter:image': config.ogImage || `${baseUrl}/og-default.jpg`,
      
      // Additional meta tags
      'keywords': config.keywords?.join(', '),
      'robots': config.noIndex || config.noFollow 
        ? `${config.noIndex ? 'noindex' : ''}${config.noIndex && config.noFollow ? ', ' : ''}${config.noFollow ? 'nofollow' : ''}`
        : 'index, follow',
      
      // Canonical URL
      'canonical': fullUrl,
      
      // Structured data
      'structuredData': config.structuredData
    }
  },

  // Legacy method for direct DOM manipulation (fallback)
  setMetaTags: (title: string, description: string, image?: string) => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    
    // Open Graph tags
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', image || '')
    
    // Twitter Card tags
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', image || '')
  },

  // Generate page-specific metadata
  generatePageMetadata: (page: string, data?: any): SEOMetadata => {
    const baseMetadata = {
      title: 'Cross-Current Precision Armory',
      description: 'Texas Proud, Family Strong - Your trusted source for tactical gear and equipment.',
      keywords: ['tactical gear', 'body armor', 'outdoor equipment', 'survival gear', 'veteran owned'],
      ogType: 'website' as const,
      twitterCard: 'summary_large_image' as const
    }

    switch (page) {
      case 'home':
        return {
          ...baseMetadata,
          title: 'Cross-Current Precision Armory - Texas Proud, Family Strong',
          description: 'Texas Proud, Family Strong - Providing top-notch customer service alongside high-quality tactical gear and apparel.',
          structuredData: seoOptimization.generateWebsiteStructuredData()
        }
      
      case 'products':
        return {
          ...baseMetadata,
          title: 'Products - Cross-Current Precision Armory',
          description: 'Browse our curated selection of tactical gear, body armor, and outdoor equipment.',
          keywords: [...baseMetadata.keywords!, 'products', 'body armor', 'tactical equipment'],
          structuredData: seoOptimization.generateWebsiteStructuredData()
        }
      
      case 'product':
        return {
          ...baseMetadata,
          title: `${data?.product?.name} - Cross-Current Precision Armory`,
          description: data?.product?.description || baseMetadata.description,
          ogType: 'product' as const,
          ogImage: data?.product?.image,
          structuredData: data?.product ? seoOptimization.generateProductStructuredData(data.product) : undefined
        }
      
      case 'about':
        return {
          ...baseMetadata,
          title: 'About Us - Cross-Current Precision Armory',
          description: 'Learn about our story, mission, and commitment to providing quality tactical gear and exceptional service.',
          structuredData: seoOptimization.generateOrganizationStructuredData()
        }
      
      case 'contact':
        return {
          ...baseMetadata,
          title: 'Contact Us - Cross-Current Precision Armory',
          description: 'Get in touch with our expert team for questions about our tactical gear and equipment.',
          keywords: [...baseMetadata.keywords!, 'contact', 'support', 'customer service']
        }
      
      default:
        return baseMetadata
    }
  }
}

// SEO hooks and utilities
export const seoHooks = {
  // Hook for managing page SEO
  usePageSEO: (page: string, data?: any) => {
    return seoOptimization.generatePageMetadata(page, data)
  },

  // Hook for product SEO
  useProductSEO: (product: Product) => {
    return seoOptimization.createMetadata({
      title: `${product.name} - Cross-Current Precision Armory`,
      description: product.description,
      keywords: [product.name, 'tactical gear', 'body armor', 'outdoor equipment'],
      ogType: 'product',
      structuredData: seoOptimization.generateProductStructuredData(product)
    })
  }
}

// SEO validation utilities
export const seoValidation = {
  // Validate meta tag length
  validateTitleLength: (title: string) => {
    const length = title.length
    if (length < 30) return { valid: false, message: 'Title too short (min 30 chars)' }
    if (length > 60) return { valid: false, message: 'Title too long (max 60 chars)' }
    return { valid: true, message: 'Title length optimal' }
  },

  validateDescriptionLength: (description: string) => {
    const length = description.length
    if (length < 120) return { valid: false, message: 'Description too short (min 120 chars)' }
    if (length > 160) return { valid: false, message: 'Description too long (max 160 chars)' }
    return { valid: true, message: 'Description length optimal' }
  },

  // Check for required meta tags
  validateRequiredTags: (metadata: SEOMetadata) => {
    const required = ['title', 'description']
    const missing = required.filter(tag => !metadata[tag as keyof SEOMetadata])
    return {
      valid: missing.length === 0,
      missing
    }
  }
}
