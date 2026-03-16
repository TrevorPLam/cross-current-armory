# Assets Organization

This directory contains all static assets for the Cross-Current Precision Armory website.

## Structure

```
src/assets/
├── products/
│   ├── body-armor/          # Body armor product images
│   ├── plate-carriers/      # Plate carrier product images
│   ├── side-plates/         # Side plates product images
│   └── equipment/           # Equipment and gear images
├── hero.png                 # Hero section background
├── react.svg               # React logo
├── vite.svg                # Vite logo
├── index.ts                # Asset exports and types
└── README.md               # This file
```

## Usage

Import assets from the index file for type safety and easy access:

```typescript
import { bodyArmorAssets, plateCarrierAssets } from '../assets'

// Use in components
<img src={bodyArmorAssets.a2LevelIIIPlusAlloy} alt="A2 Level III+ Body Armor" />
```

## Asset Categories

### Body Armor
- A2 Level III+ Alloy Body Armor (multiple variants)
- A4 Level III++ Alloy Body Armor
- Heritage Level III AR500 Steel Body Armor (multiple variants)

### Plate Carriers
- The Concealment Plate Carrier (multiple views)
- The Concealment Plate Carrier - White (front and side views)

### Side Plates
- A4 Side Plates (multiple variants)

### Equipment
- Coleman Perfect Flow 2-Burner Stove (multiple views)

## Image Formats

All product images are in WebP format for optimal performance and compression. The WebP format provides:

- Better compression than JPEG/PNG
- Support for transparency
- Excellent quality-to-size ratio
- Wide browser support

## Best Practices

1. **Import from index.ts** - Use the centralized exports for type safety
2. **Alt text** - Always provide descriptive alt text for accessibility
3. **Lazy loading** - Implement lazy loading for product images
4. **Responsive images** - Use appropriate image sizes for different viewports
5. **Optimization** - WebP format is already optimized for web use

## Adding New Assets

1. Place images in the appropriate category subdirectory
2. Add export to `index.ts` in the relevant category
3. Update product data in `src/data/index.ts` if needed
4. Update types if new categories are added
