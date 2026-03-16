#!/usr/bin/env node

/**
 * Dynamic Sitemap Generation Script
 * 
 * This script fetches products and collections from Shopify Storefront API
 * and generates a comprehensive sitemap.xml file for SEO purposes.
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Shopify Storefront API configuration
const SHOPIFY_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'cross-currentprecisionarmory'
const SHOPIFY_ACCESS_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const BASE_URL = 'https://cross-currentprecisionarmory.com'

// GraphQL queries for Shopify
const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          handle
          title
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const COLLECTIONS_QUERY = `
  query getCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          handle
          title
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

/**
 * Make a GraphQL request to Shopify Storefront API
 */
async function shopifyRequest(query, variables = {}) {
  if (!SHOPIFY_ACCESS_TOKEN) {
    console.warn('Shopify access token not found. Using fallback data.')
    return getFallbackData()
  }

  const response = await fetch(`https://${SHOPIFY_DOMAIN}.myshopify.com/api/2026-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`)
  }

  const result = await response.json()
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
  }

  return result.data
}

/**
 * Get fallback data when Shopify API is not available
 */
function getFallbackData() {
  return {
    products: {
      edges: [
        { node: { handle: 'tactical-plate-carrier', title: 'Tactical Plate Carrier', updatedAt: '2024-01-15T10:00:00Z' } },
        { node: { handle: 'level-iv-body-armor', title: 'Level IV Body Armor', updatedAt: '2024-01-10T14:30:00Z' } },
        { node: { handle: 'combat-helmet', title: 'Combat Helmet', updatedAt: '2024-01-08T09:15:00Z' } },
      ]
    },
    collections: {
      edges: [
        { node: { handle: 'armor', title: 'Armor', updatedAt: '2024-01-12T11:20:00Z' } },
        { node: { handle: 'armor-plates', title: 'Armor Plates', updatedAt: '2024-01-11T16:45:00Z' } },
        { node: { handle: 'kit-accessories', title: 'Kit Accessories', updatedAt: '2024-01-09T13:30:00Z' } },
      ]
    }
  }
}

/**
 * Fetch all products with pagination
 */
async function getAllProducts() {
  const products = []
  let hasNextPage = true
  let after = null

  while (hasNextPage) {
    try {
      const data = await shopifyRequest(PRODUCTS_QUERY, { first: 50, after })
      
      if (data && data.products) {
        products.push(...data.products.edges)
        hasNextPage = data.products.pageInfo?.hasNextPage
        after = data.products.pageInfo?.endCursor
      } else {
        hasNextPage = false
      }
    } catch (error) {
      console.warn('Error fetching products:', error.message)
      hasNextPage = false
    }
  }

  return products
}

/**
 * Fetch all collections with pagination
 */
async function getAllCollections() {
  const collections = []
  let hasNextPage = true
  let after = null

  while (hasNextPage) {
    try {
      const data = await shopifyRequest(COLLECTIONS_QUERY, { first: 50, after })
      
      if (data && data.collections) {
        collections.push(...data.collections.edges)
        hasNextPage = data.collections.pageInfo?.hasNextPage
        after = data.collections.pageInfo?.endCursor
      } else {
        hasNextPage = false
      }
    } catch (error) {
      console.warn('Error fetching collections:', error.message)
      hasNextPage = false
    }
  }

  return collections
}

/**
 * Format date for sitemap (ISO 8601)
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toISOString()
}

/**
 * Generate sitemap XML content
 */
function generateSitemapXML(products, collections) {
  const urls = []

  // Static pages
  urls.push({
    loc: BASE_URL,
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: new Date().toISOString()
  })

  urls.push({
    loc: `${BASE_URL}/collections/all`,
    changefreq: 'daily',
    priority: '0.9',
    lastmod: new Date().toISOString()
  })

  // Additional static pages
  urls.push({
    loc: `${BASE_URL}/blog`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: new Date().toISOString()
  })

  // Contact and About pages (anchor links on homepage)
  urls.push({
    loc: `${BASE_URL}/#contact`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString()
  })

  urls.push({
    loc: `${BASE_URL}/#about`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString()
  })

  // Collection pages
  collections.forEach(collection => {
    urls.push({
      loc: `${BASE_URL}/collections/${collection.node.handle}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: formatDate(collection.node.updatedAt)
    })
  })

  // Product pages
  products.forEach(product => {
    urls.push({
      loc: `${BASE_URL}/products/${product.node.handle}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: formatDate(product.node.updatedAt)
    })
  })

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  urls.forEach(url => {
    xml += '  <url>\n'
    xml += `    <loc>${url.loc}</loc>\n`
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`
    xml += `    <priority>${url.priority}</priority>\n`
    xml += '  </url>\n'
  })

  xml += '</urlset>\n'

  return xml
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('🗺️  Generating sitemap...')
    
    // Fetch data from Shopify
    console.log('📦 Fetching products...')
    const products = await getAllProducts()
    console.log(`✅ Found ${products.length} products`)

    console.log('📚 Fetching collections...')
    const collections = await getAllCollections()
    console.log(`✅ Found ${collections.length} collections`)

    // Generate sitemap
    console.log('🔧 Generating sitemap XML...')
    const sitemapXML = generateSitemapXML(products, collections)

    // Write to public directory
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml')
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8')

    console.log(`✅ Sitemap generated successfully!`)
    console.log(`📍 Location: ${sitemapPath}`)
    console.log(`📊 ${products.length} products + ${collections.length} collections + 3 static pages`)
    console.log(`🌐 Access at: ${BASE_URL}/sitemap.xml`)

  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message)
    process.exit(1)
  }
}

// Run the script
main()

export { main, generateSitemapXML, getAllProducts, getAllCollections }
