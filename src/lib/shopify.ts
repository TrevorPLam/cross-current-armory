/**
 * Shopify Storefront API client for full storefront replacement.
 * Used for catalog (optional) and cart → checkout redirect.
 */

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN

const storefrontUrl = STORE_DOMAIN && ACCESS_TOKEN
  ? `https://${STORE_DOMAIN}.myshopify.com/api/2024-10/graphql.json`
  : null

export function isShopifyConfigured(): boolean {
  return Boolean(storefrontUrl && ACCESS_TOKEN)
}

export interface CartLineInput {
  merchandiseId: string
  quantity: number
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
