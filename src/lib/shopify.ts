/**
 * Shopify Storefront API client for full storefront replacement.
 * Used for catalog (optional) and cart → checkout redirect.
 */

import type {
  ShopifyGraphQLResponse,
  ShopifyProductsResponse,
  ShopifyCollectionsResponse,
  ShopifyProductResponse,
  ShopifyCollectionResponse,
  ShopifyProductsQueryVars,
  ShopifyCollectionsQueryVars,
  ShopifyProductQueryVars,
  ShopifyCollectionByHandleQueryVars
} from '../types/shopify'

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN

const storefrontUrl = STORE_DOMAIN && ACCESS_TOKEN
  ? `https://${STORE_DOMAIN}.myshopify.com/api/2026-01/graphql.json`
  : null

export function isShopifyConfigured(): boolean {
  return Boolean(storefrontUrl && ACCESS_TOKEN)
}

export interface CartLineInput {
  merchandiseId: string
  quantity: number
}

/**
 * Generic GraphQL query executor for Shopify Storefront API
 */
async function executeGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  if (!storefrontUrl || !ACCESS_TOKEN) {
    throw new Error('Shopify Storefront API is not configured. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN.')
  }

  const response = await fetch(storefrontUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
  }

  const json: ShopifyGraphQLResponse<T> = await response.json()

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }

  if (!json.data) {
    throw new Error('No data returned from Shopify API.')
  }

  return json.data
}

/**
 * Create a Shopify cart with the given lines and return the checkout URL.
 * Redirect the buyer to this URL to complete payment on Shopify.
 */
export async function createCartCheckoutUrl(lines: CartLineInput[]): Promise<string> {
  if (!storefrontUrl || !ACCESS_TOKEN) {
    throw new Error('Shopify Storefront API is not configured. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN.')
  }
  if (lines.length === 0) {
    throw new Error('Cart is empty.')
  }

  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      lines: lines.map(({ merchandiseId, quantity }) => ({ merchandiseId, quantity })),
    },
  }

  const res = await fetch(storefrontUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
    },
    body: JSON.stringify({ query: mutation, variables }),
  })

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json() as {
    data?: { cartCreate?: { cart?: { checkoutUrl?: string }; userErrors?: { message: string }[] } }
    errors?: { message: string }[]
  }

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }

  const userErrors = json.data?.cartCreate?.userErrors
  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join('; '))
  }

  const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl
  if (!checkoutUrl) {
    throw new Error('No checkout URL returned from Shopify.')
  }

  return checkoutUrl
}

// GraphQL query fragments
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    vendor
    tags
    availableForSale
    createdAt
    updatedAt
    publishedAt
    requiresSellingPlan
    totalInventory
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          sku
          availableForSale
          currentlyNotInStock
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          weight
          weightUnit
          requiresShipping
          taxable
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    seo {
      title
      description
    }
  }
`

const COLLECTION_FRAGMENT = `
  fragment CollectionFields on Collection {
    id
    title
    handle
    description
    descriptionHtml
    image {
      id
      url
      altText
      width
      height
    }
    updatedAt
    seo {
      title
      description
    }
  }
`

/**
 * Fetch products from Shopify Storefront API
 */
export async function fetchProducts(
  variables: ShopifyProductsQueryVars = { first: 50 }
): Promise<ShopifyProductsResponse> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query getProducts($first: Int, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `

  return executeGraphQL<ShopifyProductsResponse>(query, variables)
}

/**
 * Fetch collections from Shopify Storefront API
 */
export async function fetchCollections(
  variables: ShopifyCollectionsQueryVars = { first: 50 }
): Promise<ShopifyCollectionsResponse> {
  const query = `
    ${COLLECTION_FRAGMENT}
    query getCollections($first: Int, $after: String, $sortKey: CollectionSortKeys, $reverse: Boolean) {
      collections(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...CollectionFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `

  return executeGraphQL<ShopifyCollectionsResponse>(query, variables)
}

/**
 * Fetch a single product by ID
 */
export async function fetchProduct(
  variables: ShopifyProductQueryVars
): Promise<ShopifyProductResponse> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query getProduct($id: ID!) {
      product(id: $id) {
        ...ProductFields
      }
    }
  `

  return executeGraphQL<ShopifyProductResponse>(query, variables)
}

/**
 * Fetch a collection by handle with products
 */
export async function fetchCollectionByHandle(
  variables: ShopifyCollectionByHandleQueryVars
): Promise<ShopifyCollectionResponse> {
  const query = `
    ${COLLECTION_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    query getCollectionByHandle($handle: String!, $first: Int, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
      collectionByHandle(handle: $handle) {
        ...CollectionFields
        products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
          edges {
            node {
              ...ProductFields
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    }
  `

  return executeGraphQL<ShopifyCollectionResponse>(query, variables)
}

/**
 * Fetch all products (handles pagination)
 */
export async function fetchAllProducts(): Promise<ShopifyProductsResponse> {
  let allProducts: ShopifyProductsResponse = {
    products: {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  }

  let cursor: string | undefined
  let hasNextPage = true

  while (hasNextPage) {
    const response: ShopifyProductsResponse = await fetchProducts({
      first: 250,
      after: cursor
    })

    allProducts.products.edges.push(...response.products.edges)
    hasNextPage = response.products.pageInfo.hasNextPage
    cursor = response.products.pageInfo.endCursor
  }

  return allProducts
}

/**
 * Fetch all collections (handles pagination)
 */
export async function fetchAllCollections(): Promise<ShopifyCollectionsResponse> {
  let allCollections: ShopifyCollectionsResponse = {
    collections: {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  }

  let cursor: string | undefined
  let hasNextPage = true

  while (hasNextPage) {
    const response: ShopifyCollectionsResponse = await fetchCollections({
      first: 250,
      after: cursor
    })

    allCollections.collections.edges.push(...response.collections.edges)
    hasNextPage = response.collections.pageInfo.hasNextPage
    cursor = response.collections.pageInfo.endCursor
  }

  return allCollections
}
