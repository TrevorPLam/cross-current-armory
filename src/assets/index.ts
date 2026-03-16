// Asset paths for Cross-Current Precision Armory
// Export organized product image paths for easy importing

// Body Armor Assets
export const bodyArmorAssets = {
  a2LevelIIIPlusAlloy: '/src/assets/products/body-armor/A2–Level-III+-Alloy-Body-Armor.webp',
  a2LevelIIIPlusAlloyAlt: '/src/assets/products/body-armor/A2–Level-III+Alloy-Body-Armor.webp',
  a4LevelIIIPlusPlusAlloy: '/src/assets/products/body-armor/A4-Level-III++-Alloy-Body-Armor.webp',
  heritageLevelIIIAR500: '/src/assets/products/body-armor/Heritage–Level-III-AR500-Steel-Body-Armor.webp',
  heritageLevelIIIAR500Alt: '/src/assets/products/body-armor/Heritage–Level-III-AR500-Steel-Body-Armor(2).webp',
} as const

// Plate Carrier Assets
export const plateCarrierAssets = {
  concealmentPlateCarrier: '/src/assets/products/plate-carriers/The-Concealment-Plate-Carrier.webp',
  concealmentPlateCarrier2: '/src/assets/products/plate-carriers/The-Concealment-Plate-Carrier(2).webp',
  concealmentPlateCarrier3: '/src/assets/products/plate-carriers/The-Concealment-Plate-Carrier(3).webp',
  concealmentPlateCarrier4: '/src/assets/products/plate-carriers/The-Concealment-Plate-Carrier(4).webp',
  concealmentPlateCarrierWhiteFront: '/src/assets/products/plate-carriers/The-Concealment-Plate-Carrier-White-Front.webp',
  concealmentPlateCarrierWhiteSide: '/src/assets/products/plate-carriers/The-Concealment-Plate-Carrier-White-Side.webp',
} as const

// Side Plates Assets
export const sidePlatesAssets = {
  a4SidePlates: '/src/assets/products/side-plates/A4-Side-Plates.webp',
  a4SidePlatesSpace: '/src/assets/products/side-plates/A4-Side -Plates.webp',
} as const

// Equipment Assets
export const equipmentAssets = {
  colemanBurnerFrontClosed: '/src/assets/products/equipment/Coleman-Perfect-Flow-2-Burner-Front-Closed.webp',
  colemanBurnerFrontOpen: '/src/assets/products/equipment/Coleman-Perfect-Flow-2-Burner-Front-Open.webp',
  colemanBurnerTopOpen: '/src/assets/products/equipment/Coleman-Perfect-Flow-2-Burner-Top-Open.webp',
} as const

// General Assets
export const generalAssets = {
  hero: '/src/assets/hero.png',
  react: '/src/assets/react.svg',
  vite: '/src/assets/vite.svg',
} as const

// Combined export for easy access
export const allAssets = {
  bodyArmor: bodyArmorAssets,
  plateCarriers: plateCarrierAssets,
  sidePlates: sidePlatesAssets,
  equipment: equipmentAssets,
  general: generalAssets,
} as const

// Type definitions for asset paths
export type AssetCategory = keyof typeof allAssets
export type BodyArmorAsset = keyof typeof bodyArmorAssets
export type PlateCarrierAsset = keyof typeof plateCarrierAssets
export type SidePlatesAsset = keyof typeof sidePlatesAssets
export type EquipmentAsset = keyof typeof equipmentAssets
export type GeneralAsset = keyof typeof generalAssets
