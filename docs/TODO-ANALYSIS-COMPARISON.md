# TODO.md vs Analysis & Storefront Work — Comparison

**Purpose:** Align the roadmap in `TODO.md` with the current codebase, the earlier codebase analysis, and the full storefront replacement work.

---

## 1. What TODO.md Gets Right (and What’s Out of Date)

### Completed tasks (correctly marked ✅)

- **TASK-000** (Repository Foundation) — Matches reality: atomic design, a11y, performance, SEO utilities, build config.
- **TASK-001** (Conversion Rate Optimization) — Guest checkout, contact form, trust badges, testimonials, cart, Vite optimizations are in place.
- **TASK-002** (Enhanced Product Experience) — ProductGallery, ProductVideo, Product360, ProductComparison, image utils exist.

### Out-of-date references in TODO.md

| TODO.md says | Current reality |
|--------------|------------------|
| Hero at `src/components/sections/Hero.tsx` | Hero lives at `src/components/organisms/Hero/Hero.tsx` |
| Navigation at `src/components/layout/Navigation.tsx` | Navigation at `src/components/organisms/Navigation/Navigation.tsx` |
| “Target: Testimonials.tsx (create)” in TASK-004 | Testimonials.tsx and testimonials data already exist (TASK-001). |
| “Target: TrustBadges.tsx (create)” in TASK-004 | TrustBadges.tsx already exists (TASK-001). |
| “Target: ProductComparison.tsx (create)” in TASK-005 | ProductComparison exists (TASK-002). |
| “Next Priority: TASK-001, TASK-002, TASK-003” at bottom | TASK-001 and TASK-002 are done; next is TASK-003 (or storefront Phase 2). |
| “Current cart… startGuestCheckout” | Cart’s primary CTA is now “Proceed to Checkout” → Shopify redirect; in-app shipping/payment steps still in code but not the main path. |

So: completed tasks are accurate; **file paths and “create” targets** in open tasks need updating, and **“Next Priority”** should reflect current state.

---

## 2. Gaps Between TODO.md and the Codebase Analysis

The earlier **codebase analysis** called out several issues that **TODO.md does not mention**:

| Issue from analysis | In TODO.md? | Recommendation |
|---------------------|-------------|----------------|
| Path aliases (`@/`, `@components`, etc.) defined in Vite but unused | No | Add a small “Code quality” or “Tech debt” item: adopt path aliases and optionally enforce via ESLint. |
| Duplicate `CartItem` (in `types/index.ts` vs `hooks/index.ts`) | No | Add: unify cart types (single source in `types`, hooks use it). |
| Payment step in Cart: button uses `onClick` instead of form submit, so Zod validation can be bypassed | No | Either fix in code and document in TASK-001, or add a “TASK-001 follow-up” bullet. |
| SEO: `seo.ts` and SEOMeta exist but aren’t used in App/Layout | No | Add to TASK-000 or a “Polish” task: wire Helmet/SEOMeta in root layout with `seo.generatePageMetadata()`. |
| No tests (unit/integration) | No | Add TASK or “Quality” section: add tests for hooks, contact form, checkout redirect. |
| Asset paths in `assets/index.ts` use `/src/assets/...` (may break in build) | No | Add: verify production image paths and fix (imports or public). |

**Recommendation:** Add a short **“Tech debt / quality”** section to TODO.md (or a TASK-009) that references these so they’re tracked.

---

## 3. What the Storefront Work Added (Not in TODO.md)

The **full storefront replacement** work introduced scope that TODO.md doesn’t yet describe:

| Addition | Where it lives | TODO.md status |
|----------|----------------|----------------|
| **Replace whole storefront** (this app = storefront, Shopify = catalog + checkout) | `docs/STOREFRONT-REPLACEMENT-PLAN.md` | Not in TODO.md. |
| **React Router** (/, /collections/:handle, /products/:handle) | `App.tsx`, `Layout.tsx`, `pages/*` | TODO “Repository Structure” shows `pages/` but didn’t specify routing. |
| **Shopify Storefront API** (cartCreate → checkoutUrl, env vars) | `src/lib/shopify.ts`, `.env.example` | Not in TODO.md. |
| **Cart → Shopify Checkout** (“Proceed to Checkout” redirect) | `Cart.tsx`, `createCartCheckoutUrl` | TODO TASK-001 describes “guest checkout” as in-app flow; reality is now “redirect to Shopify” as primary. |
| **Product type** (`shopifyVariantId`, `handle`) for checkout and URLs | `src/types/index.ts` | Not in TODO.md. |
| **Live site analysis** (43 products, categories, contact, PDP) | `docs/LIVE-SITE-ANALYSIS.md` | Not in TODO.md. |

So: TODO.md is still **marketing/CRO/UX focused**; the **storefront replacement and Shopify integration** are a separate, higher-level goal that should be reflected in the roadmap.

---

## 4. Overlap and Conflicts

- **TASK-001 “Guest checkout”**  
  TODO describes a 4-step in-app flow (cart → shipping → payment → complete). The app now has:
  - **Primary:** “Proceed to Checkout” → Shopify (real checkout).
  - **Legacy:** In-app shipping/payment/complete UI still in `Cart.tsx` but no longer the main CTA.  
  **Suggestion:** In TODO.md, update TASK-001 to say checkout is “Proceed to Checkout → Shopify”; optionally note that in-app steps remain for fallback or removal later.

- **TASK-004 (Trust & Social Proof)**  
  Several items are already done: Testimonials, TrustBadges. TODO should mark those as done and only list what’s left (e.g. LiveCounter, ReviewSystem, “As Seen In”, etc.).

- **TASK-005 (Search & Filtering)**  
  ProductComparison is done (TASK-002). TODO should say “create” only for SearchBox, FilterPanel, useRecentlyViewed, Recommendations.

- **Repository structure**  
  TODO shows `pages/` under components. In code, **pages** live at `src/pages/` (HomePage, CollectionPage, ProductPage). Align the diagram with `src/pages/`.

---

## 5. Suggested TODO.md Updates

### 5.1 Add a “Storefront Replacement” section (or Phase 0)

- **Goal:** This app replaces the live Shopify theme; Shopify stays as catalog + checkout backend.
- **Phases:** Link or summarize `docs/STOREFRONT-REPLACEMENT-PLAN.md` (Phase 1 done: Router, Shopify client, cart → checkout; Phase 2: Shopify catalog; Phase 3: IA/nav; Phase 4: SEO, deploy).
- **Reference:** `docs/LIVE-SITE-ANALYSIS.md` for live site/product/category alignment.

### 5.2 Fix “Next Priority” and open tasks

- Set **Next Priority** to something like: **TASK-003** (Hero), **Storefront Phase 2** (Shopify catalog), then TASK-004/005.
- In **TASK-004**, mark Testimonials and TrustBadges as done; list only remaining trust/social proof work.
- In **TASK-005**, mark ProductComparison as done; list only SearchBox, FilterPanel, useRecentlyViewed, Recommendations.

### 5.3 Update file paths in task “Target” bullets

- Use current paths: `organisms/Hero`, `organisms/Navigation`, `molecules/ProductCard`, `sections/Cart`, etc.
- TASK-006 “Navigation” target: change to `organisms/Navigation/Navigation.tsx` (or “Layout/nav”).

### 5.4 Optional: Tech debt / quality

- Unify `CartItem` type; adopt path aliases; wire SEO (Helmet) in layout; fix Cart payment validation (form submit); add tests; verify asset paths in production.

---

## 6. Summary Table

| Source | Focus | Relation to TODO.md |
|--------|--------|----------------------|
| **TODO.md** | Marketing roadmap (CRO, product UX, hero, trust, search, mobile, CMS, analytics) | Master task list; needs path/status updates and a storefront section. |
| **Codebase analysis** | Code quality, types, SEO, tests, assets | Not in TODO; recommend adding a short “Tech debt / quality” list. |
| **Storefront replacement** | This app as sole storefront; Shopify for catalog + checkout | New strategic goal; Phase 1 done (Router, Shopify client, checkout redirect). Document in TODO as “Storefront Replacement” and link to STOREFRONT-REPLACEMENT-PLAN. |
| **Live site analysis** | 43 products, categories, contact, PDP on live site | Informs Storefront Phase 2 (catalog/collections) and content alignment; reference in TODO or storefront section. |

**Bottom line:** TODO.md is still the right place for the marketing and feature roadmap. It should be updated to: (1) reflect current structure and completed work, (2) add storefront replacement as a top-level goal with phases, and (3) optionally track the codebase-analysis items (SEO, types, tests, paths) so nothing is dropped.
