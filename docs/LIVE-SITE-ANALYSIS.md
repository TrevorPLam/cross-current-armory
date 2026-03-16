# Live Site Analysis: cross-currentprecisionarmory.com

**Purpose:** Thorough analysis of the current Shopify site to inform the new marketing site (this repo).  
**Live site:** [https://cross-currentprecisionarmory.com/](https://cross-currentprecisionarmory.com/)  
**Date:** March 2026

---

## 1. Live Site Overview

### 1.1 Platform & Tech

- **Platform:** Shopify (storefront + checkout).
- **URL structure:** Standard Shopify: `/`, `/collections/all`, `/collections/{handle}`, `/products/{handle}`, `/pages/contact`, `/policies/privacy-policy`.
- **Auth:** Shopify customer accounts (login/signup, “Have an account? Log in to check out faster” in cart).
- **Footer:** “Powered by Shopify” + Terms and Policies → Privacy policy.

### 1.2 Information Architecture

| Section | URL | Purpose |
|--------|-----|--------|
| Home | `/` | Hero, story, email signup, video |
| Shop by Category | (dropdown) | All Products, ARMOR, ARMOR PLATES, KIT ACCESSORIES, SURVIVAL/CAMPING |
| All Products | `/collections/all` | Full catalog (43 items) with sort/filter |
| Contact | `/pages/contact` | Contact form |
| Account | (drawer/modal) | Sign in, Orders, Profile |
| Cart | (drawer) | Cart contents, login CTA, continue shopping |

**Trust / urgency messaging:**

- “inventory updates daily”
- “!!!VET OWNED AND OPERATED!!!”

---

## 2. Home Page (Live)

### 2.1 Content

- **Headline:** “Texas Proud, Family Strong”
- **Subhead:** “Providing Top-Notch Customer Service Alongside High-Quality Tactical Gear and Apparel.”
- **Body:** Same “small town, small business…” story as in this repo’s `companyInfo.story` (including “Enjoy your day and make everyday feel like its Friday if you can!!!”).
- **CTA:** “Shop all” → `/collections/all`.
- **Video:** “Play video” (hero video).
- **Email signup:** “Join our email list” + email field (Shopify email capture).

### 2.2 Gaps / Observations

- No dedicated “About” page linked from main nav; story lives on the home hero.
- Categories live in a dropdown only; no visible category cards or featured products on home.
- No testimonials, reviews, or “As seen in” on the live home page.

---

## 3. Collections & Catalog (Live)

### 3.1 Catalog Size & Categories

- **43 products** in “All”.
- **Categories (live):**
  - All Products
  - ARMOR
  - ARMOR PLATES
  - KIT ACCESSORIES
  - SURVIVAL/CAMPING

**Sample products (from live site):**

- A2 – Level III+ Alloy Body Armor ($125.99)
- A4 Side Plates ($125.99)
- A4 – Level III++ Alloy Body Armor ($239.99)
- Heritage – Level III AR500 Steel Body Armor ($125.99 on live; repo has $189.99 — **price mismatch**)
- Coleman Perfect Flow 2 Burner ($149.99 on live; repo “Coleman Perfect Flow 2-Burner Stove” $79.99 — **name/price mismatch**)
- Plus: drones, tents, GPS, first aid kits, MREs, gloves, hydration, placards, gun cases, etc.

### 3.2 Collection UX (Live)

- **Sort:** Featured, Best selling, Alphabetically A–Z/Z–A, Price low–high/high–low, Date old–new/new–old.
- **Filter:** “Filter” UI present (facets not fully visible in fetch).
- **Grid:** Product cards with image, title, price; click → product page.
- **Count:** “See 43 items” / “Clear all”.

---

## 4. Product Page (Live) — A2 Level III+ Example

### 4.1 Structure

- **Title:** “A2 – Level III+ Alloy Body Armor”
- **Variant selector:** Size (8"×10", 10"×12", 11"×14") + Coating (Fraglock, Base Coat, Build Up).
- **Price:** $125.99 (can vary by variant).
- **CTA:** “Add to cart” (with quantity).
- **Specs:** BALLISTIC RATING (Level III+, round types), MATERIAL (thickness, weight), “SOLD INDIVIDUALLY”.
- **Copy:** “Multi-Hit Capability” paragraph (NIJ, caliber, alloy benefits, edge-to-edge).
- **Related:** “You may also like” (cross-sell).

### 4.2 What Works

- Clear variant selection and product details.
- Real checkout via Shopify (payments, fulfillment).
- SEO-friendly product URLs and structure.

---

## 5. Contact Page (Live)

### 5.1 Form

- **Fields:** Name, Email* (required), Phone, Comment.
- **Single button:** “Submit”.
- **No visible:** validation messages, success/error state, or “we’ll respond in 24 hours” copy in the fetched content.

### 5.2 vs. New Site (This Repo)

- Repo contact form: Name, Email, Phone (optional), Message; Zod validation; success/error UI; “Message sent successfully! We’ll respond within 24 hours.”
- Repo also has contact section with phone/email/location from `companyInfo` (live site does not surface these on the contact page in the same way).

---

## 6. Cross-Site Comparison

### 6.1 Content & Messaging

| Aspect | Live (Shopify) | New site (this repo) |
|--------|----------------|----------------------|
| Tagline | Texas Proud, Family Strong | Same |
| Story / about | Same paragraph on home | Same in About section |
| Vet owned | “!!!VET OWNED AND OPERATED!!!” | “VETERAN OWNED & OPERATED” badge + “Vet Owned” / “Family Operated” in About |
| Contact copy | Minimal (form only) | Form + phone, email, location |
| Email signup | Home + “Join our email list” | Footer CTA (not wired) |

Content is intentionally aligned; repo adds structure (About, Contact details, testimonials).

### 6.2 Navigation & IA

| Aspect | Live | New site |
|--------|------|----------|
| Main nav | Home, Shop by Category (dropdown), Contact, More (Account) | Home, Products, About, Contact (no shop dropdown) |
| Categories | All, ARMOR, ARMOR PLATES, KIT ACCESSORIES, SURVIVAL/CAMPING | All, Body Armor, Plate Carriers, Equipment |
| Products | 43, real Shopify catalog | 7 products, static data |
| Cart | Shopify cart drawer, login CTA | Custom slide-out cart + guest checkout flow (no real payment) |
| Account | Shopify login/account | No account (marketing-only) |

Live site is the real store; new site is a focused marketing/landing experience with a subset of products and different category names.

### 6.3 Product Data Alignment

- **Names/prices to reconcile:**
  - **Heritage – Level III AR500:** Live $125.99 vs repo $189.99.
  - **Coleman Perfect Flow 2 Burner:** Live $149.99, name “Coleman Perfect Flow 2 Burner”; repo “Coleman Perfect Flow 2-Burner Stove” $79.99.
- **Categories:** Live uses ARMOR / ARMOR PLATES / KIT ACCESSORIES / SURVIVAL/CAMPING; repo uses Body Armor / Plate Carriers / Equipment. Mapping (e.g. ARMOR → Body Armor, ARMOR PLATES → Body Armor or “Plate Carriers”, SURVIVAL/CAMPING → Equipment) should be explicit if the new site ever syncs with Shopify.
- **Catalog:** Repo has 7 products; live has 43. New site currently showcases a curated subset.

### 6.4 UX & Conversion (Live)

**Strengths:**

- Real checkout and payments.
- Account optional (“Log in to check out faster”).
- Clear product variants and specs.
- Sort and filter on collection.

**Weaknesses:**

- Contact form is minimal (no validation feedback, no “we’ll respond in 24 hours”).
- No testimonials or review snippets on home.
- No trust badges near checkout in the content we saw.
- “VET OWNED” is prominent but not paired with trust/social proof blocks.

### 6.5 UX & Conversion (New Site)

**Strengths:**

- Guest checkout flow (cart → shipping → payment → complete) reduces friction.
- Contact form with validation and success/error states.
- Testimonials with specific results.
- Trust badges (SSL, security, payment) in product/checkout areas.
- Performance and accessibility focus (Core Web Vitals, WCAG).
- Clear About and Contact sections with phone/email/location.

**Gaps vs. live:**

- No real payment or order placement (demo only).
- Fewer products and no variant selection (size/coating).
- No “inventory updates daily” or equivalent urgency.
- Footer email signup not wired.

---

## 7. Recommendations for the New Marketing Site

### 7.1 Clarify Role of the New Site

- **Option A — Replace storefront:** New site becomes the main face; “Add to cart” could link to Shopify product/checkout URLs (headless-style) so catalog and checkout stay in Shopify.
- **Option B — Landing/marketing only:** New site drives traffic and trust; “Shop now” / “View products” links to `cross-currentprecisionarmory.com/collections/all` (or category). No cart on new site.
- **Option C — Full replacement:** New site eventually gets its own cart + Shopify (or other) backend; requires product sync, variants, and real checkout.

Recommendation: Start with **Option B** (or A with “Add to cart” → Shopify). That preserves his existing Shopify orders and inventory while your site improves storytelling and trust.

### 7.2 Content & Data

1. **Align product subset:** Decide which of the 43 products to feature on the new site. Keep names and prices in `data/index.ts` in sync with Shopify (or document “as of” date and source).
2. **Fix known mismatches:** Update Heritage AR500 and Coleman 2-Burner name/price (and any others) to match live store.
3. **Category labels:** Either match live (ARMOR, ARMOR PLATES, KIT ACCESSORIES, SURVIVAL/CAMPING) or keep repo names and add a one-line mapping in docs for future sync.
4. **Copy from live:** Reuse “inventory updates daily” and “!!!VET OWNED AND OPERATED!!!” (or your refined version) if he likes that tone.
5. **Contact:** Keep your improved form; add a note that submissions go to the same place as the live contact form (or to a shared inbox).

### 7.3 CTAs and Links

1. **Primary CTA:** “Shop now” / “View all products” → `https://cross-currentprecisionarmory.com/collections/all` (or main collection).
2. **Per product:** “Add to cart” or “View on store” → `https://cross-currentprecisionarmory.com/products/{handle}` so customers can buy on the real store.
3. **Footer / nav:** Optional “Full store” or “Shop on Shopify” link to the live site so the relationship is clear.
4. **Email signup:** Wire footer “Join our email list” to the same Shopify audience or his email tool so he has one list.

### 7.4 Trust & Urgency

- Keep vet-owned and family-operated front and center.
- Add “inventory updates daily” (or similar) if he uses that on the live site.
- Keep testimonials and trust badges; consider pulling one or two review snippets from Shopify reviews (if he enables them) for product cards or a “What customers say” block.

### 7.5 Technical

1. **SEO:** Use your `seo.ts` and `SEOMeta` (or Helmet) so the new site has proper title/description/OG for sharing and search.
2. **Canonical / duplicate content:** If the new site will live on a different domain (e.g. `shop.cross-currentprecisionarmory.com` or a landing subdomain), keep canonical and internal links clear so search engines understand which is the main store vs. marketing.
3. **Analytics:** Ensure the new site sends events (e.g. “Shop now” clicks, contact submits) to the same analytics property he uses for the live site so he can see funnel from marketing → store.

---

## 8. Summary

- **Live site:** Shopify store with 43 products, 5 categories, real checkout, minimal contact form, strong vet-owned messaging, no testimonials or trust badges on the fetched pages.
- **New site:** Stronger storytelling (About, Contact details, testimonials, trust badges), better form UX and guest-checkout flow (demo), performance and a11y focus, but only 7 products, no real payment, and some product/category/price mismatches.
- **Best path:** Use the new site as the primary marketing/landing experience and send “Shop now” / “Add to cart” traffic to [cross-currentprecisionarmory.com](https://cross-currentprecisionarmory.com/). Sync product names and prices for the featured subset, align categories or document mapping, wire email signup and analytics, and fix the payment-step validation and SEO integration already noted in the main codebase analysis.

---

*Last updated: March 2026. Live site content and structure may change.*
