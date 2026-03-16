// Asset paths for Cross-Current Precision Armory
// Export organized product image paths for easy importing
// Using Vite's new URL() pattern for production build compatibility

// Helper function to get correct asset URLs in both dev and production
const getAssetUrl = (path: string) => new URL(path, import.meta.url).href

// Body Armor Assets
export const bodyArmorAssets = {
  a2LevelIIIPlusAlloy: getAssetUrl('./products/body-armor/A2–Level-III+-Alloy-Body-Armor.webp'),
  a2LevelIIIPlusAlloyAlt: getAssetUrl('./products/body-armor/A2–Level-III+Alloy-Body-Armor.webp'),
  a4LevelIIIPlusPlusAlloy: getAssetUrl('./products/body-armor/A4-Level-III++-Alloy-Body-Armor.webp'),
  heritageLevelIIIAR500: getAssetUrl('./products/body-armor/Heritage–Level-III-AR500-Steel-Body-Armor.webp'),
  heritageLevelIIIAR500Alt: getAssetUrl('./products/body-armor/Heritage–Level-III-AR500-Steel-Body-Armor(2).webp'),
} as const

// Plate Carrier Assets
export const plateCarrierAssets = {
  concealmentPlateCarrier: getAssetUrl('./products/plate-carriers/The-Concealment-Plate-Carrier.webp'),
  concealmentPlateCarrier2: getAssetUrl('./products/plate-carriers/The-Concealment-Plate-Carrier(2).webp'),
  concealmentPlateCarrier3: getAssetUrl('./products/plate-carriers/The-Concealment-Plate-Carrier(3).webp'),
  concealmentPlateCarrier4: getAssetUrl('./products/plate-carriers/The-Concealment-Plate-Carrier(4).webp'),
  concealmentPlateCarrierWhiteFront: getAssetUrl('./products/plate-carriers/The-Concealment-Plate-Carrier-White-Front.webp'),
  concealmentPlateCarrierWhiteSide: getAssetUrl('./products/plate-carriers/The-Concealment-Plate-Carrier-White-Side.webp'),
} as const

// Side Plates Assets
export const sidePlatesAssets = {
  a4SidePlates: getAssetUrl('./products/side-plates/A4-Side-Plates.webp'),
  a4SidePlatesSpace: getAssetUrl('./products/side-plates/A4-Side -Plates.webp'),
} as const

// Equipment Assets
export const equipmentAssets = {
  colemanBurnerFrontClosed: getAssetUrl('./products/equipment/Coleman-Perfect-Flow-2-Burner-Front-Closed.webp'),
  colemanBurnerFrontOpen: getAssetUrl('./products/equipment/Coleman-Perfect-Flow-2-Burner-Front-Open.webp'),
  colemanBurnerTopOpen: getAssetUrl('./products/equipment/Coleman-Perfect-Flow-2-Burner-Top-Open.webp'),
} as const

// General Assets
export const generalAssets = {
  hero: getAssetUrl('./hero.png'),
  react: getAssetUrl('./react.svg'),
  vite: getAssetUrl('./vite.svg'),
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
