# Full Storefront Replacement Plan

**Goal:** This React/Vite site becomes the only storefront for [cross-currentprecisionarmory.com](https://cross-currentprecisionarmory.com/). Shopify remains the backend for catalog, checkout, and orders.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  New storefront (this repo)                                      │
│  • Home, collections, product pages, cart UI                     │
│  • Product/catalog data from Shopify Storefront API              │
│  • Cart state in React + localStorage                           │
│  • "Checkout" → create Shopify cart via API → redirect to        │
│    Shopify Checkout URL (payment, fulfillment, orders in Shopify)│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Shopify (existing)                                              │
│  • Products, variants, collections, inventory                   │
│  • Checkout (payment, shipping, orders)                          │
│  • Customer accounts (optional login from our site or checkout)  │
└─────────────────────────────────────────────────────────────────┘
```

- **Storefront:** This app (deployed at the store’s domain or subdomain).
- **Catalog:** Fetched from Shopify Storefront API (products, collections, variants).
- **Cart:** Held in this app; at “Checkout” we call Storefront API `cartCreate` with line items (variant ID + quantity), then redirect the user to the returned `checkoutUrl`.
- **Checkout & orders:** Entirely on Shopify (no custom payment or order management in this app).

---

## Implementation Phases

### Phase 1 — Foundation (done in this pass)
- [x] Plan doc (this file).
- [x] React Router: `/`, `/collections`, `/collections/:handle`, `/products/:handle`.
- [x] Shopify Storefront API client + env (`VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`).
- [x] Cart → Shopify: `createShopifyCheckout(cartItems)` creates cart with variant IDs, returns `checkoutUrl`; “Proceed to Checkout” redirects.
- [x] Product type extended with optional `shopifyVariantId` (GID) so cart can send correct variant to Shopify.
- [ ] When env is missing, app still runs (static/fallback data); checkout disabled or banner shown.

### Phase 2 — Shopify as catalog source
- [ ] Fetch products and collections from Storefront API (home, collection list, product list).
- [ ] Product listing page(s) use Shopify data; support all 43 products and live categories (ARMOR, ARMOR PLATES, KIT ACCESSORIES, SURVIVAL/CAMPING).
- [ ] Product detail page (`/products/:handle`) loads from Shopify (title, description, images, variants, price).
- [ ] “Add to cart” stores Shopify variant GID; cart can create Shopify checkout for all items.

### Phase 3 — Navigation and IA
- [ ] Nav: Home, Shop (or Shop by Category) → `/collections/all`, category links to `/collections/armor`, etc.
- [ ] Footer categories match live site or mapped clearly.
- [ ] Optional: “Account” link to Shopify customer login (same as current live site).

### Phase 4 — Polish and go-live
- [ ] SEO: per-page meta (product, collection) using existing `seo.ts` / Helmet.
- [ ] Replace static `data/index.ts` products with API (or remove and use API only).
- [ ] Deploy at store domain; DNS/domain cutover so this app is the storefront.
- [ ] Old Shopify theme can be unpublished or redirected.

---

## Env and Shopify setup

1. **Storefront API token**
   - Shopify Admin → Settings → Apps and sales channels → Develop apps → Create app (or use existing).
   - Configure Storefront API scopes: `unauthenticated_read_product_listings`, `unauthenticated_read_checkouts`, `unauthenticated_write_checkouts`.
   - Install app, copy **Storefront API access token**.

2. **Env in this repo**
   - `.env.example`: `VITE_SHOPIFY_STORE_DOMAIN=cross-currentprecisionarmory`, `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...`
   - `.env` (gitignored): real values. Build uses these for API calls and checkout.

3. **Store domain**
   - Use the store’s myshopify domain (e.g. `cross-currentprecisionarmory.myshopify.com`) for API; `VITE_SHOPIFY_STORE_DOMAIN` is the subdomain only (e.g. `cross-currentprecisionarmory`).

---

## Cart and checkout flow

1. User adds to cart on our site → we store `{ product, quantity, shopifyVariantId }` (variant GID from Shopify).
2. Cart drawer shows items; “Proceed to Checkout” (or “Guest Checkout” that goes to Shopify) calls `createShopifyCheckout(cartItems)`.
3. `createShopifyCheckout`:
   - Maps cart items to `{ merchandiseId: variantGid, quantity }`.
   - Calls Storefront API `cartCreate` with those lines.
   - Reads `cart.checkoutUrl` from response.
   - Returns that URL (or throws if any item has no `shopifyVariantId` / API error).
4. App redirects: `window.location.href = checkoutUrl`. User completes payment and order on Shopify.

Items that don’t have a `shopifyVariantId` (e.g. from old static data) can’t be sent to Shopify; we either exclude them and show a message or require all items to be from Shopify.

---

## Success criteria

- [ ] All product and collection pages are served by this app.
- [ ] Catalog (products and collections) comes from Shopify (or synced).
- [ ] Add to cart and cart UI work on this app.
- [ ] “Checkout” sends the cart to Shopify and redirects to Shopify Checkout; orders appear in Shopify admin.
- [ ] Domain points to this app; customers see only this storefront until they hit “Checkout” (then Shopify’s hosted checkout).
