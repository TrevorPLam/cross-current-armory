# Marketing Repository Best Practices (03/2026) — Research & Gap Analysis

**Purpose:** Align this repository with current (March 2026) marketing website and e‑commerce storefront best practices.  
**Scope:** Standards research → comparison with current setup → information gaps → targeted research to fill gaps.

---

## Part 1: Up-to-Date Best Practices (Research Summary)

### 1.1 Core Infrastructure & Content Operations

- **Content as code / Git-first:** Marketing sites should treat content as code in Git (e.g. Markdown, structured data) instead of copy-paste in a CMS only. This enables version history, review workflows, and rollbacks. [Content CI/CD – SteakHouse](https://blog.trysteakhouse.com/blog/contentops-as-code-ci-cd-pipeline-geo)
- **Content CI/CD:** Continuous integration and deployment for content (e.g. validate structured data, run tests on copy) can reduce errors and speed deployments. [CI/CD for Content – SteakHouse](https://blog.trysteakhouse.com/blog/ci-cd-pipeline-for-content-marketing-assets-as-software)
- **Repository pattern / brand truth:** Centralize “brand truth” (facts, positioning, product data) in one place (repo or database) so search, AI overviews, and multiple channels stay consistent. [Repository-Pattern Workflow – SteakHouse](https://blog.trysteakhouse.com/blog/repository-pattern-workflow-centralizing-brand-truth-multi-agent-distribution)
- **Template-based implementation:** Page-type templates (product, collection, home) should drive structured data and meta so new pages get correct schema and formatting by default. [Schema Markup Strategy 2026](https://schemavalidator.org/guides/schema-markup-seo-strategy-2026)

### 1.2 Technical SEO (Crawl → Render → Index)

- **Crawl:** Optimize `robots.txt`, XML sitemaps (e.g. by type), and internal linking. A proper sitemap can yield ~40% faster indexing. [Technical SEO 2026 – SEOsolved](https://www.seosolved.com/blog/technical-seo-2026-best-practices-playbook)
- **Render:** Prefer SSR or SSG for critical pages so crawlers receive full HTML; handle client-side-only content with care. [React and SEO – DEV](https://forem.com/polozhevets/react-js-and-seo-how-to-make-google-love-your-single-page-app-582n)
- **Index:** Control what gets indexed via canonicals, noindex, and parameter handling. [Technical SEO 2026 – SEOsolved](https://www.seosolved.com/blog/technical-seo-2026-best-practices-playbook)
- **Schema markup:** Organization + WebSite, BreadcrumbList, and per-page types (Product, FAQ, etc.) with pre-publish validation. [Schema Markup Strategy 2026](https://schemavalidator.org/guides/schema-markup-seo-strategy-2026)

### 1.3 E‑commerce Schema (Product & Rich Results)

- **Product schema:** Required for rich results: `name`, `image`, `offers.price`, `offers.priceCurrency`, `offers.availability`. Strongly recommended: `aggregateRating`, `brand`, `sku`/identifiers; in 2026, `shippingDetails` and `hasMerchantReturnPolicy` are heavily favored by Google. [Product Schema 2026 – schemavalidator](https://schemavalidator.org/guides/product-schema-markup); [Ecommerce Schema Guide 2026 – VJ SEO](https://www.vjseomarketing.com/blog/ecommerce-schema-guide/)
- **Format:** JSON-LD, `@context` `https://schema.org`. [Shopify Schema Gaps 2026](https://schemavalidator.org/guides/shopify-schema-markup)

### 1.4 Performance (Core Web Vitals — 2026 Benchmarks)

- **LCP (Largest Contentful Paint):** ≤ 2.5 s (75th percentile). [Ecommerce Site Speed 2026 – EcomHint](https://ecomhint.com/blog/ecommerce-site-speed-best-practices)
- **INP (Interaction to Next Paint):** ≤ 200 ms. INP replaced FID in March 2024 as the official CWV for interactivity; many sites still fail it, especially on mobile. [Ecommerce Site Speed 2026 – EcomHint](https://ecomhint.com/blog/ecommerce-site-speed-best-practices)
- **CLS (Cumulative Layout Shift):** ≤ 0.1. [Ecommerce Site Speed 2026 – EcomHint](https://ecomhint.com/blog/ecommerce-site-speed-best-practices)
- **Impact:** Image optimization (modern formats, lazy load, hero &lt; 200 KB, product &lt; 100–150 KB); audit third-party scripts; CDN and hosting. [Ecommerce Site Speed 2026 – EcomHint](https://ecomhint.com/blog/ecommerce-site-speed-best-practices); [Complete Guide 2026 – EcomHint](https://ecomhint.com/guides/ecommerce-site-speed-optimization)
- **Business:** ~4% conversion loss per 2 s delay; 0.1 s improvement can yield up to ~8.4% conversion gain. [EcomHint](https://ecomhint.com/guides/ecommerce-site-speed-optimization)

### 1.5 Accessibility (Legal & Standards)

- **WCAG 2.1 Level AA** is the baseline; WCAG 2.2 adds useful criteria. [EAA Compliance Guide – AllAccessible](https://www.allaccessible.org/blog/european-accessibility-act-eaa-compliance-guide)
- **European Accessibility Act (EAA):** In force from **June 28, 2025** in EU member states; applies to e‑commerce, websites, apps. Aligns with WCAG 2.1 AA / EN 301 549. Penalties can reach €100,000 or 4% of annual revenue. [EAA June 2025 – GetWCAG](https://getwcag.com/en/blog/european-accessibility-act-what-the-june-2025-deadline-means-for-digital-products); [EAA Regulations 2025 – GetWCAG](https://getwcag.com/en/blog/eaa-regulations-2025-what-your-business-must-do-now)
- **US ADA:** From **April 2026**, applicable to entities over a certain size (e.g. 50,000 population); thousands of ADA suits filed in 2024. [Ecommerce Accessibility – Storeis](https://store.is/ecommerce-tips/10-best-practice-for-accessible-ecommerce/)
- **Business case:** Forrester: every dollar invested in accessibility can yield on the order of $100 return via usability, SEO, and reach. [Ecommerce Accessibility – Marker.io](https://marker.io/blog/e-commerce-accessibility)

### 1.6 E‑commerce Checkout & Conversion

- **Guest checkout:** Forced account creation is a top abandonment driver; guest checkout as primary path is best practice. [Checkout Optimization 2026 – DigitalApplied](https://www.digitalapplied.com/blog/ecommerce-checkout-optimization-2026-ux-guide); [CRO Strategies 2026 – Mida](https://mida-app.io/blog/ecommerce-checkout-conversion-rate/)
- **Trust at payment:** Security badges, SSL, return policy near payment improve completion. [Checkout Optimization 2026 – DigitalApplied](https://www.digitalapplied.com/blog/ecommerce-checkout-optimization-2026-ux-guide)
- **Cost transparency:** Show shipping/tax early to reduce “unexpected cost” abandonment. [Checkout Optimization 2026 – DigitalApplied](https://www.digitalapplied.com/blog/ecommerce-checkout-optimization-2026-ux-guide)
- **Minimal fields:** Only necessary checkout fields; address autocomplete and smart defaults. [Checkout Forms 2026 – Orbit AI](https://orbitforms.ai/blog/best-practices-for-checkout-forms-that-convert)

### 1.7 SPA / React SEO (robots.txt & Sitemap)

- **SPA caveat:** Pure client-side React often serves crawlers a minimal HTML shell; SSR/SSG is the robust approach for indexation. [React and SEO – DEV](https://forem.com/polozhevets/react-js-and-seo-how-to-make-google-love-your-single-page-app-582n)
- **robots.txt:** Must be correct—misconfiguration can block indexing. [Next.js robots – Easton Dev](https://eastondev.com/blog/en/posts/dev/20251220-nextjs-sitemap-robots/)
- **Vite/React:** Use build-time generation for `sitemap.xml` and `robots.txt` (e.g. `vite-plugin-seo-files`, `vite-plugin-sitemap`) so product/collection URLs are included. [BrowserUX SEO Files](https://browserux.com/seo-files/); [Vite SEO – DEV](https://dev.to/ali_dz/optimizing-seo-in-a-react-vite-project-the-ultimate-guide-3mbh)

---

## Part 2: Current Repository Setup (Summary)

- **Stack:** React 19, TypeScript, Vite 8, Tailwind, React Router; Shopify Storefront API for cart → checkout redirect.
- **Principles (TODO.md):** Performance + accessibility + ROI intertwined; website as system; mobile-first; atomic design; accessibility as growth strategy.
- **SEO:** `src/utils/seo.ts` — Product, Organization, BreadcrumbList, WebSite schema; `createMetadata`; `SEOMeta` (Helmet); validation for title/description length.
- **Performance:** `src/utils/performance.ts` — `web-vitals` with **onINP**, onCLS, onLCP, onFCP, onTTFB; debounce for INP; lazy load; image optimization helpers; no explicit CWV targets documented.
- **Accessibility:** WCAG 2.1 AA target; `src/utils/accessibility.ts`; accessible Button/Input.
- **Conversion:** Guest checkout (Proceed to Checkout → Shopify); 4-field contact form with Zod; trust badges; testimonials.
- **Data:** Static `src/data/index.ts` (products, companyInfo); no content CI/CD; brand copy in code and data.
- **Crawl/index:** No `robots.txt` or `sitemap.xml` in repo; `index.html` minimal; no SSR/SSG (client-side SPA).

---

## Part 3: Gap Analysis

| Practice (2026) | Current state | Gap? |
|-----------------|---------------|------|
| **Content as code / brand truth** | Copy and product data in `src/data/` and components | **Partial.** Single source for products/company; no formal “brand truth” doc or CI checks. |
| **Content CI/CD** | None | **Yes.** No automated validation of structured data, meta, or copy. |
| **Template-based schema** | `seo.ts` has page-type metadata and Product/Org/Breadcrumb/WebSite | **Partial.** Product image URL uses `/products/${id}/image.jpg` (may not match Shopify handles); no `shippingDetails` / `hasMerchantReturnPolicy`. |
| **robots.txt** | Absent | **Yes.** No `robots.txt`. |
| **Sitemap** | Absent | **Yes.** No `sitemap.xml`; dynamic product/collection URLs not listed. |
| **CWV targets documented** | INP/CLS/LCP monitored via web-vitals | **Yes.** No doc stating targets (e.g. LCP ≤2.5s, INP ≤200ms, CLS ≤0.1). |
| **INP as primary interactivity metric** | Using `onINP` from web-vitals | **No gap.** Already correct. |
| **EAA / ADA 2026** | WCAG 2.1 AA stated | **Yes.** Legal deadlines (EAA June 2025, ADA April 2026) not referenced. |
| **Product schema 2026** | Product + Offer + optional AggregateRating | **Partial.** Missing `shippingDetails`, `hasMerchantReturnPolicy`; image URL pattern may be wrong for Shopify. |
| **Guest checkout / trust** | Guest checkout; trust badges | **No gap.** Aligned. |
| **SSR/SSG for SEO** | Client-side SPA only | **Acknowledged.** Full SSR/SSG is a larger change; sitemap/robots and correct meta/schema still improve crawlability and snippets. |

---

## Part 4: Targeted Research to Fill Gaps

### 4.1 Gap: robots.txt and sitemap for Vite SPA

- **Finding:** For Vite React SPAs, generate `robots.txt` and `sitemap.xml` at build time. Options: `vite-plugin-seo-files` (auto sitemap + robots), `vite-plugin-sitemap` (sitemap with custom routes). Sitemap should include base URL + known static routes + dynamic routes (e.g. `/collections/all`, `/collections/:handle`, `/products/:handle`). For dynamic product/collection URLs, either generate from API at build time or use a post-build script that fetches handles and writes sitemap. [BrowserUX SEO Files](https://browserux.com/seo-files/); [Vite Plugin Sitemap](https://github.com/jbaubree/vite-plugin-sitemap); [Include sitemap in Vite build – Stack Overflow](https://stackoverflow.com/questions/77463831/how-to-include-sitemap-xml-in-the-build-of-a-reactvite-project).
- **Recommendation:** Add a Vite plugin (or `public/` + build script) to emit `robots.txt` (allow /, point to sitemap) and `sitemap.xml`. Phase 2: when Storefront API is used, generate sitemap from collections and products (handles) at build or via a small serverless function.

### 4.2 Gap: Documented CWV targets and INP focus

- **Finding:** 2026 benchmarks: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at 75th percentile. INP is the main failure mode for many sites. [EcomHint](https://ecomhint.com/blog/ecommerce-site-speed-best-practices).
- **Recommendation:** Add a short “Performance” section to `TODO.md` or `docs/` stating these targets and that INP is the interactivity CWV. Optionally add a comment in `performance.ts` referencing these targets. Consider alerting or dashboards when metrics exceed thresholds.

### 4.3 Gap: Legal accessibility deadlines (EAA, ADA)

- **Finding:** EAA in force June 28, 2025 (EU); US ADA expansion April 2026. WCAG 2.1 AA is the practical standard for both. [GetWCAG EAA](https://getwcag.com/en/blog/european-accessibility-act-what-the-june-2025-deadline-means-for-digital-products); [AllAccessible EAA](https://www.allaccessible.org/blog/european-accessibility-act-eaa-compliance-guide).
- **Recommendation:** In `TODO.md` “Marketing Repository Fundamentals” or in `docs/`, add one paragraph: “Accessibility compliance: WCAG 2.1 AA (target). EU: European Accessibility Act in force June 2025. US: ADA requirements expand April 2026. Non-compliance can result in fines and litigation.” No code change required; clarifies why a11y is mandatory.

### 4.4 Gap: Product schema (2026) and image URLs

- **Finding:** Google favors `shippingDetails` and `hasMerchantReturnPolicy` for product rich results in 2026. Product `image` should be an absolute URL that resolves to the real product image (e.g. Shopify CDN or your CDN). [Product Schema 2026](https://schemavalidator.org/guides/product-schema-markup); [Ecommerce Schema 2026](https://www.vjseomarketing.com/blog/ecommerce-schema-guide/).
- **Recommendation:** In `seo.ts`: (1) Extend `generateProductStructuredData` to accept `image` (and optional `images[]`) from product data and use that instead of `/products/${product.id}/image.jpg`. (2) When Phase 2 uses Shopify, use Shopify image URLs. (3) Add optional `shippingDetails` and `hasMerchantReturnPolicy` (from company policy or config) so product pages can expose them in JSON-LD. (4) Keep `brand`, `offers`, `availability`, and `aggregateRating` as already implemented.

### 4.5 Gap: Content CI/CD and brand truth

- **Finding:** Content-as-code and CI/CD for content reduce errors and keep schema/copy consistent. Central “brand truth” improves consistency across site and channels. [ContentOps as Code – SteakHouse](https://blog.trysteakhouse.com/blog/contentops-as-code-ci-cd-pipeline-geo); [Repository-Pattern – SteakHouse](https://blog.trysteakhouse.com/blog/repository-pattern-workflow-centralizing-brand-truth-multi-agent-distribution).
- **Recommendation:** (1) Add a single “brand truth” doc (e.g. `docs/BRAND-TRUTH.md` or section in existing doc) listing: tagline, legal name, contact, social URLs, return/shipping policy summary. Reference it from `data/index.ts` and schema. (2) Optional: add a small CI step (e.g. Node script) that validates `seo.ts` output for required Product/Organization fields and title/description lengths so PRs fail if schema or meta break.

---

## Part 5: Actionable Checklist (Prioritized)

| Priority | Action | Owner / Phase |
|----------|--------|----------------|
| **P0** | Add `robots.txt` and `sitemap.xml` | **Done:** `public/robots.txt` and `public/sitemap.xml` added; update domain if not cross-currentprecisionarmory.com. Phase 2: generate sitemap from Storefront API (all product/collection URLs). |
| **P0** | Document CWV targets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) in `TODO.md` or `docs/` | Doc update |
| **P0** | Fix Product schema image URL to use real product image (and Shopify URLs in Phase 2) | `seo.ts` |
| **P1** | Add EAA/ADA 2025–2026 sentence to fundamentals / docs | Doc update |
| **P1** | Add optional `shippingDetails` and `hasMerchantReturnPolicy` to Product schema | `seo.ts` |
| **P2** | Create `docs/BRAND-TRUTH.md` (or equivalent) and link from data/schema | Doc + data |
| **P2** | CI check: validate structured data and meta (title/description length) on PR | CI |

---

## Summary

- The repo already aligns well with **performance** (INP monitored, CWV tooling), **accessibility** (WCAG 2.1 AA), and **conversion** (guest checkout, trust, minimal forms).  
- **Information gaps** are mainly: (1) no crawl/index basics (robots.txt, sitemap), (2) CWV targets and EAA/ADA not documented, (3) Product schema missing 2026-favored fields and correct image URLs, (4) no formal content CI or brand-truth doc.  
- Filling these with the actions above will bring the repository in line with current marketing and e‑commerce best practices as of 03/2026.

---

**Sources**

- [Technical SEO 2026 Best Practices Playbook – SEOsolved](https://www.seosolved.com/blog/technical-seo-2026-best-practices-playbook)
- [Schema Markup Strategy for SEO in 2026 – schemavalidator](https://schemavalidator.org/guides/schema-markup-seo-strategy-2026)
- [Content CI/CD Pipeline – SteakHouse](https://blog.trysteakhouse.com/blog/ci-cd-pipeline-for-content-marketing-assets-as-software)
- [ContentOps as Code – SteakHouse](https://blog.trysteakhouse.com/blog/contentops-as-code-ci-cd-pipeline-geo)
- [Repository-Pattern Workflow – SteakHouse](https://blog.trysteakhouse.com/blog/repository-pattern-workflow-centralizing-brand-truth-multi-agent-distribution)
- [Ecommerce Site Speed Best Practices 2026 – EcomHint](https://ecomhint.com/blog/ecommerce-site-speed-best-practices)
- [Ecommerce Site Speed Optimization Guide 2026 – EcomHint](https://ecomhint.com/guides/ecommerce-site-speed-optimization)
- [Ecommerce Accessibility – Inclusive Web](https://www.inclusiveweb.co/accessibility-resources/ecommerce-website-accessibility-what-every-retailer-must-know)
- [Ecommerce Accessibility Checklist – Marker.io](https://marker.io/blog/e-commerce-accessibility)
- [Ecommerce Accessibility Best Practices – Storeis](https://store.is/ecommerce-tips/10-best-practice-for-accessible-ecommerce/)
- [Product Schema Markup 2026 – schemavalidator](https://schemavalidator.org/guides/product-schema-markup)
- [Ecommerce Schema Guide 2026 – VJ SEO](https://www.vjseomarketing.com/blog/ecommerce-schema-guide/)
- [Shopify Schema Markup 2026 – schemavalidator](https://schemavalidator.org/guides/shopify-schema-markup)
- [European Accessibility Act 2025 – GetWCAG](https://getwcag.com/en/blog/european-accessibility-act-what-the-june-2025-deadline-means-for-digital-products)
- [EAA Regulations 2025 – GetWCAG](https://getwcag.com/en/blog/eaa-regulations-2025-what-your-business-must-do-now)
- [EAA Compliance Guide – AllAccessible](https://www.allaccessible.org/blog/european-accessibility-act-eaa-compliance-guide)
- [React and SEO – DEV](https://forem.com/polozhevets/react-js-and-seo-how-to-make-google-love-your-single-page-app-582n)
- [Next.js Sitemap & robots.txt – Easton Dev](https://eastondev.com/blog/en/posts/dev/20251220-nextjs-sitemap-robots/)
- [robots.txt in React Router 7 – Nikolai Lehbrink](https://www.nikolailehbr.ink/blog/robots-txt-react-router-7)
- [BrowserUX SEO Files for Vite](https://browserux.com/seo-files/)
- [SEO Optimization React + Vite – DEV](https://dev.to/ali_dz/optimizing-seo-in-a-react-vite-project-the-ultimate-guide-3mbh)
- [Vite Plugin Sitemap – GitHub](https://github.com/jbaubree/vite-plugin-sitemap)
- [Ecommerce Checkout Optimization 2026 – DigitalApplied](https://www.digitalapplied.com/blog/ecommerce-checkout-optimization-2026-ux-guide)
- [Checkout CRO Strategies 2026 – Mida](https://mida-app.io/blog/ecommerce-checkout-conversion-rate/)
- [Checkout Forms Best Practices 2026 – Orbit AI](https://orbitforms.ai/blog/best-practices-for-checkout-forms-that-convert)
