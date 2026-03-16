# Cross Current Armory

A modern React + TypeScript **storefront** for [Cross-Current Precision Armory](https://cross-currentprecisionarmory.com/). This app replaces the live Shopify theme: customers browse and add to cart here, then complete payment on Shopify Checkout.

Built with Vite, TailwindCSS, and the Shopify Storefront API.

## 🚀 Features

- **Full storefront replacement**: Home, collections, product pages, cart; checkout redirects to Shopify
- **Modern Tech Stack**: React 19, TypeScript, Vite for fast development
- **Styling**: TailwindCSS for responsive and beautiful UI
- **Component Architecture**: Atomic design pattern with organized components
- **Performance**: Optimized build with tree-shaking and code splitting
- **Accessibility**: WCAG compliant components
- **SEO Ready**: Built-in SEO optimization

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Routing**: React Router (/, /collections/:handle, /products/:handle)
- **Build**: Vite 8
- **Styling**: TailwindCSS 4.2
- **Icons**: Lucide React + Heroicons
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Commerce**: Shopify Storefront API (catalog + cart → checkout redirect)
- **Linting**: ESLint with TypeScript support

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/TrevorPLam/cross-current-armory.git
cd cross-current-armory

# Install dependencies
npm install

# Copy env example and add your Shopify Storefront API token (see below)
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Enabling Shopify checkout

To send customers from the cart to Shopify Checkout, set:

- `VITE_SHOPIFY_STORE_DOMAIN` — store subdomain (e.g. `cross-currentprecisionarmory`)
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` — from Shopify Admin → Settings → Apps → Develop apps → Storefront API (scopes: read/write checkouts, read product listings)

See `.env.example` and [docs/STOREFRONT-REPLACEMENT-PLAN.md](docs/STOREFRONT-REPLACEMENT-PLAN.md) for details. Without these, the site runs with static product data and “Proceed to Checkout” will show a setup message.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── atoms/          # Button, Input
│   ├── molecules/      # ProductCard
│   ├── organisms/      # Navigation, Hero, Features
│   ├── templates/      # MarketingLayout
│   ├── sections/       # Cart, Testimonials
│   ├── ui/             # ContactForm, TrustBadges, ProductGallery, etc.
│   └── seo/            # SEOMeta
├── pages/              # HomePage, CollectionPage, ProductPage (routes)
├── hooks/              # useCart, useProductFilter, useScrollPosition
├── lib/                # Shopify Storefront API client
├── utils/              # performance, seo, accessibility, imageOptimization
├── types/              # TypeScript type definitions
├── data/               # Products, companyInfo, testimonials
└── assets/             # Images and asset path exports
```

**Routes:** `/` (home), `/collections/all`, `/collections/:handle`, `/products/:handle`.

## 🎯 Development

This project follows atomic design principles and TypeScript best practices. All components are properly typed and include accessibility features.

- **Roadmap:** [TODO.md](TODO.md) — tasks, phases, and tech debt.
- **Storefront plan:** [docs/STOREFRONT-REPLACEMENT-PLAN.md](docs/STOREFRONT-REPLACEMENT-PLAN.md).
- **Live site analysis:** [docs/LIVE-SITE-ANALYSIS.md](docs/LIVE-SITE-ANALYSIS.md).

## 📄 License

This project is private and proprietary.
