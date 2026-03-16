# Component Guide - Cross-Current Precision Armory

## Atomic Design Structure

This project follows the **Atomic Design** methodology for component organization, ensuring scalability, maintainability, and reusability.

### 🏗️ Component Hierarchy

```
src/components/
├── atoms/          # Smallest building blocks
├── molecules/      # Groups of atoms
├── organisms/      # Complex UI sections
├── templates/      # Page layouts
└── seo/           # SEO components
```

---

## 🧬 Atoms

### Button
**Location**: `src/components/atoms/Button/Button.tsx`

A versatile button component with multiple variants and accessibility features.

**Props**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  'aria-label'?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
}
```

**Usage**:
```tsx
import { Button } from './components/atoms/Button'

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

<Button variant="outline" size="sm" disabled aria-label="Disabled action">
  Disabled
</Button>
```

**Features**:
- WCAG 2.1 AA compliant
- Focus management
- Keyboard navigation
- ARIA attributes support
- Multiple visual variants

---

### Input
**Location**: `src/components/atoms/Input/Input.tsx`

Accessible input field with validation states.

**Props**:
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'search' | 'tel'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
  error?: boolean
  className?: string
}
```

**Usage**:
```tsx
import { Input } from './components/atoms/Input'

<Input
  type="email"
  placeholder="Enter your email"
  required
  error={hasError}
  aria-label="Email address"
  onChange={handleChange}
/>
```

**Features**:
- Built-in validation states
- Accessibility attributes
- Error handling
- Multiple input types

---

## 🔗 Molecules

### ProductCard
**Location**: `src/components/molecules/ProductCard/ProductCard.tsx`

Product display card with rating, pricing, and cart functionality.

**Props**:
```typescript
interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    description: string
    rating?: number
    reviews?: number
  }
  index: number
}
```

**Usage**:
```tsx
import { ProductCard } from './components/molecules/ProductCard'

<ProductCard 
  product={productData}
  index={0}
/>
```

**Features**:
- Animated hover effects
- Accessibility labels
- Rating display
- Add to cart functionality
- Responsive design

---

## 🏢 Organisms

### Navigation
**Location**: `src/components/organisms/Navigation/Navigation.tsx`

Main site navigation with mobile menu and cart integration.

**Props**:
```typescript
interface NavigationProps {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  isScrolled: boolean
}
```

**Usage**:
```tsx
import { Navigation } from './components/organisms/Navigation'

<Navigation 
  isMenuOpen={isMenuOpen}
  setIsMenuOpen={setIsMenuOpen}
  isScrolled={isScrolled}
/>
```

**Features**:
- Responsive design
- Mobile menu with animations
- Cart item counter
- Accessibility navigation
- Scroll-based styling

---

### Hero
**Location**: `src/components/organisms/Hero/Hero.tsx`

Hero section with animated content and trust badges.

**Usage**:
```tsx
import { Hero } from './components/organisms/Hero'

<Hero />
```

**Features**:
- Framer Motion animations
- Trust indicators
- Call-to-action buttons
- Accessibility landmarks
- Responsive typography

---

### Features
**Location**: `src/components/organisms/Features/Features.tsx`

Features showcase section with animated cards.

**Components**:
- `Features`: Main container
- `FeatureCard`: Individual feature display

**Usage**:
```tsx
import { Features } from './components/organisms/Features'

<Features />
```

**Features**:
- Animated entrance effects
- Icon integration
- Responsive grid layout
- Accessibility support

---

## 📋 Templates

### MarketingLayout
**Location**: `src/components/templates/MarketingLayout/MarketingLayout.tsx`

Base layout for marketing pages with SEO integration.

**Props**:
```typescript
interface MarketingLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
}
```

**Usage**:
```tsx
import { MarketingLayout } from './components/templates/MarketingLayout'

<MarketingLayout 
  title="Page Title"
  description="Page description"
  keywords={['keyword1', 'keyword2']}
>
  <PageContent />
</MarketingLayout>
```

**Features**:
- SEO metadata management
- Consistent layout structure
- Navigation integration
- Responsive design

---

## 🎯 SEO Components

### SEOMeta
**Location**: `src/components/seo/SEOMeta.tsx`

Comprehensive SEO metadata component using react-helmet-async.

**Props**:
```typescript
interface SEOMetaProps {
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
```

**Usage**:
```tsx
import { SEOMeta } from './components/seo/SEOMeta'

<SEOMeta
  title="Product Name"
  description="Product description"
  keywords={['product', 'tactical', 'gear']}
  ogType="product"
  structuredData={productStructuredData}
/>
```

**Features**:
- Open Graph tags
- Twitter Cards
- Structured data
- Canonical URLs
- Meta robots

---

## 🛠️ Utilities

### Accessibility
**Location**: `src/utils/accessibility.ts`

Comprehensive accessibility utilities for WCAG 2.1 AA compliance.

**Key Functions**:
- `generateId()` - Generate unique IDs
- `trapFocus()` - Focus management for modals
- `announceToScreenReader()` - Screen reader announcements
- `validateHeadingHierarchy()` - Heading structure validation
- `keyboardNavigation` - Keyboard event handlers

**Usage**:
```tsx
import { 
  generateId, 
  trapFocus, 
  announceToScreenReader,
  keyboardNavigation 
} from './utils/accessibility'

// Generate unique ID
const buttonId = generateId('button')

// Trap focus in modal
const cleanup = trapFocus(modalElement)

// Announce to screen readers
announceToScreenReader('Form submitted successfully', 'polite')

// Handle keyboard navigation
const handleKeyDown = keyboardNavigation.onEscape(handleClose)
```

---

### Performance
**Location**: `src/utils/performance.ts`

Performance monitoring and optimization utilities using web-vitals.

**Key Functions**:
- `coreWebVitals.initWebVitalsMonitoring()` - Monitor Core Web Vitals
- `createPerformanceHook()` - Custom hook for performance metrics
- `performanceStrategies.optimizeImages()` - Image optimization
- `devPerformanceMonitoring.logMetrics()` - Development monitoring

**Usage**:
```tsx
import { coreWebVitals, createPerformanceHook } from './utils/performance'

// Initialize monitoring
useEffect(() => {
  coreWebVitals.initWebVitalsMonitoring()
}, [])

// Custom hook
const { getMetrics, initMonitoring } = createPerformanceHook()
```

---

### SEO
**Location**: `src/utils/seo.ts`

SEO optimization utilities and structured data generation.

**Key Functions**:
- `seoOptimization.createMetadata()` - Create SEO metadata
- `seoOptimization.generateProductStructuredData()` - Product schema
- `seoOptimization.generatePageMetadata()` - Page-specific metadata
- `seoValidation.validateTitleLength()` - SEO validation

**Usage**:
```tsx
import { seoOptimization, seoHooks } from './utils/seo'

// Generate product metadata
const metadata = seoHooks.useProductSEO(product)

// Create custom metadata
const seoData = seoOptimization.createMetadata({
  title: 'Page Title',
  description: 'Page description',
  keywords: ['keyword1', 'keyword2']
})
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `red-600` (Brand color)
- **Secondary**: `gray-600` (Neutral)
- **Success**: `green-600`
- **Warning**: `yellow-600`
- **Error**: `red-600`

### Typography
- **Headings**: Font-bold, responsive sizing
- **Body**: Font-normal, text-gray-600
- **Small**: Text-sm, text-gray-500

### Spacing
- Uses Tailwind's spacing scale
- Consistent padding/margins
- Responsive breakpoints

---

## ♿ Accessibility Guidelines

### WCAG 2.1 AA Compliance
1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Reader Support**: Proper ARIA labels and landmarks
3. **Focus Management**: Visible focus indicators and logical tab order
4. **Color Contrast**: Minimum 4.5:1 ratio for normal text
5. **Semantic HTML**: Use appropriate HTML elements for structure

### Testing
- Use browser accessibility tools
- Test with screen readers
- Keyboard-only navigation testing
- Color contrast validation

---

## 📊 Performance Guidelines

### Core Web Vitals Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Strategies
- Image lazy loading and WebP format
- Code splitting and tree shaking
- Font optimization and preloading
- Critical CSS inlining
- Bundle size optimization

---

## 🔧 Development Guidelines

### Component Development
1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Build complex components from simple ones
3. **Props Interface**: Always define TypeScript interfaces
4. **Accessibility First**: Include accessibility from the start
5. **Performance Aware**: Consider performance implications

### File Structure
```
ComponentName/
├── ComponentName.tsx    # Main component
├── index.ts            # Exports
└── ComponentName.test.tsx # Tests (when applicable)
```

### Naming Conventions
- **Components**: PascalCase
- **Files**: PascalCase matching component name
- **Props**: camelCase with descriptive names
- **Functions**: camelCase with action verbs

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Performance Monitoring
Performance metrics are automatically tracked in development. Check the console for Core Web Vitals data.

---

## 📚 Resources

### Atomic Design
- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [Component-Driven Development](https://www.componentdriven.org/)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Performance
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://reactjs.org/docs/optimizing-performance.html)

### SEO
- [Structured Data](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)

---

## 🤝 Contributing

When adding new components:

1. Follow the Atomic Design hierarchy
2. Include TypeScript interfaces
3. Add accessibility attributes
4. Consider performance implications
5. Update this documentation
6. Test across devices and browsers

---

*Last Updated: March 15, 2026*
*Next Review: March 22, 2026*
