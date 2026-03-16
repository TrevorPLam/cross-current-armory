/**
 * React hooks for fetching and managing Shopify data
 * Used for Phase 2: Shopify as catalog source
 */

import { useState, useEffect, useCallback } from 'react'
import type { Product } from '../types'
import type { ShopifyProduct, ShopifyCollection } from '../types/shopify'
import { 
  isShopifyConfigured,
  fetchAllProducts,
  fetchAllCollections,
  fetchCollectionByHandle,
  fetchProduct
} from '../lib/shopify'
import { mapShopifyProduct } from '../utils/shopifyMapper'
import { products as staticProducts } from '../data'

/**
 * Hook for fetching all products from Shopify or falling back to static data
 */
export function useShopifyProducts() {
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingShopify, setUsingShopify] = useState(false)

  const fetchProducts = useCallback(async () => {
    if (!isShopifyConfigured()) {
      console.log('Shopify not configured, using static products')
      setProducts(staticProducts)
      setUsingShopify(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetchAllProducts()
      const mappedProducts = response.products.edges
        .map(edge => mapShopifyProduct(edge.node))
        .filter(product => product.inStock) // Only show available products
      
      setProducts(mappedProducts)
      setUsingShopify(true)
      console.log(`Loaded ${mappedProducts.length} products from Shopify`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
      console.error('Shopify product fetch error:', errorMessage)
      setError(errorMessage)
      
      // Fallback to static products
      console.log('Falling back to static products due to error')
      setProducts(staticProducts)
      setUsingShopify(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    usingShopify,
    refetch: fetchProducts,
  }
}

/**
 * Hook for fetching all collections from Shopify or falling back to static categories
 */
export function useShopifyCollections() {
  const [collections, setCollections] = useState<ShopifyCollection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingShopify, setUsingShopify] = useState(false)

  const fetchCollectionsData = useCallback(async () => {
    if (!isShopifyConfigured()) {
      console.log('Shopify not configured, no collections available')
      setCollections([])
      setUsingShopify(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetchAllCollections()
      setCollections(response.collections.edges.map(edge => edge.node))
      setUsingShopify(true)
      console.log(`Loaded ${response.collections.edges.length} collections from Shopify`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch collections'
      console.error('Shopify collection fetch error:', errorMessage)
      setError(errorMessage)
      setCollections([])
      setUsingShopify(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCollectionsData()
  }, [fetchCollectionsData])

  return {
    collections,
    loading,
    error,
    usingShopify,
    refetch: fetchCollectionsData,
  }
}

/**
 * Hook for fetching a single collection by handle
 */
export function useShopifyCollection(handle: string) {
  const [collection, setCollection] = useState<ShopifyCollection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCollection = useCallback(async () => {
    if (!handle) return
    if (!isShopifyConfigured()) {
      // Fallback to static data filtering using live site collection handles
      const filteredProducts = staticProducts.filter(product => {
        const productHandle = product.category.toLowerCase().replace(/\s+/g, '-').replace(/[–—]/g, '-')
        return handle === 'all' || 
               (handle === 'armor' && product.category.toLowerCase().includes('armor')) ||
               (handle === 'armor-plates' && product.category.toLowerCase().includes('plate')) ||
               (handle === 'kit-accessories' && !product.category.toLowerCase().includes('armor') && !product.category.toLowerCase().includes('plate')) ||
               productHandle === handle
      })
      setProducts(filteredProducts)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetchCollectionByHandle({ 
        handle,
        first: 250 // Get all products in the collection
      })
      
      if (response.collectionByHandle) {
        setCollection(response.collectionByHandle)
        
        const mappedProducts = response.collectionByHandle.products.edges
          .map(edge => mapShopifyProduct(edge.node))
          .filter(product => product.inStock)
        
        setProducts(mappedProducts)
        console.log(`Loaded collection "${handle}" with ${mappedProducts.length} products`)
      } else {
        throw new Error(`Collection "${handle}" not found`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch collection'
      console.error('Shopify collection fetch error:', errorMessage)
      setError(errorMessage)
      
      // Fallback to static data using live site collection handles
      const filteredProducts = staticProducts.filter(product => {
        const productHandle = product.category.toLowerCase().replace(/\s+/g, '-').replace(/[–—]/g, '-')
        return handle === 'all' || 
               (handle === 'armor' && product.category.toLowerCase().includes('armor')) ||
               (handle === 'armor-plates' && product.category.toLowerCase().includes('plate')) ||
               (handle === 'kit-accessories' && !product.category.toLowerCase().includes('armor') && !product.category.toLowerCase().includes('plate')) ||
               productHandle === handle
      })
      setProducts(filteredProducts)
    } finally {
      setLoading(false)
    }
  }, [handle])

  useEffect(() => {
    fetchCollection()
  }, [fetchCollection])

  return {
    collection,
    products,
    loading,
    error,
    refetch: fetchCollection,
  }
}

/**
 * Hook for fetching a single product by handle or ID
 */
export function useShopifyProduct(handleOrId: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProductData = useCallback(async () => {
    if (!handleOrId) return

    // First try to find in static data
    const staticProduct = staticProducts.find(p => 
      p.handle === handleOrId || 
      p.id === handleOrId || 
      p.name.toLowerCase().replace(/\s+/g, '-').replace(/[–—]/g, '-') === handleOrId
    )

    if (staticProduct) {
      setProduct(staticProduct)
      return
    }

    // If not found in static data and Shopify is configured, try Shopify
    if (isShopifyConfigured()) {
      setLoading(true)
      setError(null)

      try {
        // Try to fetch by handle first (more common for product pages)
        try {
          // We need to implement a query to get product by handle
          // For now, we'll search all products and find the matching one
          const allProductsResponse = await fetchAllProducts()
          const foundProduct = allProductsResponse.products.edges.find(edge => 
            edge.node.handle === handleOrId
          )

          if (foundProduct) {
            const mappedProduct = mapShopifyProduct(foundProduct.node)
            setProduct(mappedProduct)
            setShopifyProduct(foundProduct.node)
            console.log(`Loaded product "${handleOrId}" from Shopify`)
            return
          }
        } catch (searchError) {
          // If handle search fails, try ID search
          const response = await fetchProduct({ id: handleOrId })
          if (response.product) {
            const mappedProduct = mapShopifyProduct(response.product)
            setProduct(mappedProduct)
            setShopifyProduct(response.product)
            console.log(`Loaded product "${handleOrId}" from Shopify by ID`)
            return
          }
        }

        throw new Error(`Product "${handleOrId}" not found`)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product'
        console.error('Shopify product fetch error:', errorMessage)
        setError(errorMessage)
        setProduct(null)
        setShopifyProduct(null)
      } finally {
        setLoading(false)
      }
    } else {
      // Shopify not configured and product not found in static data
      setProduct(null)
      setError('Product not found and Shopify not configured')
    }
  }, [handleOrId])

  useEffect(() => {
    fetchProductData()
  }, [fetchProductData])

  return {
    product,
    shopifyProduct,
    loading,
    error,
    refetch: fetchProductData,
  }
}

/**
 * Hook for getting category navigation that works with both Shopify and static data
 */
export function useShopifyNavigation() {
  const { collections, usingShopify } = useShopifyCollections()
  
  const navigationItems = usingShopify && collections.length > 0
    ? collections
        .filter(collection => collection.handle !== 'frontpage') // Exclude frontpage
        .map(collection => ({
          title: collection.title,
          handle: collection.handle,
          url: `/collections/${collection.handle}`,
        }))
        .sort((a, b) => a.title.localeCompare(b.title))
    : [
        { title: 'All', handle: 'all', url: '/collections/all' },
        { title: 'Armor', handle: 'armor', url: '/collections/armor' },
        { title: 'Armor Plates', handle: 'armor-plates', url: '/collections/armor-plates' },
        { title: 'Kit Accessories', handle: 'kit-accessories', url: '/collections/kit-accessories' },
      ]

  return {
    navigationItems,
    usingShopify,
  }
}

/**
 * Check if Shopify is properly configured
 */
export function useShopifyConfig() {
  const [configured, setConfigured] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check configuration on mount
    const isConfigured = isShopifyConfigured()
    setConfigured(isConfigured)
    setChecking(false)
    
    if (isConfigured) {
      console.log('Shopify Storefront API is configured')
    } else {
      console.log('Shopify Storefront API is not configured - using static data')
    }
  }, [])

  return {
    configured,
    checking,
  }
}
