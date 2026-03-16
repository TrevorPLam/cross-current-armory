import type { Product, Category } from '../types'
import { bodyArmorAssets, plateCarrierAssets, sidePlatesAssets, equipmentAssets } from '../assets'

export const products: Product[] = [
  { 
    id: '1', 
    name: 'A2 – Level III+ Alloy Body Armor', 
    price: 125.99, 
    category: 'Body Armor', 
    description: 'Advanced alloy body armor providing superior protection', 
    inStock: true, 
    rating: 4.8,
    reviews: 127,
    image: bodyArmorAssets.a2LevelIIIPlusAlloy,
    images: [
      bodyArmorAssets.a2LevelIIIPlusAlloy,
      bodyArmorAssets.a2LevelIIIPlusAlloyAlt
    ]
  },
  { 
    id: '2', 
    name: 'A4 Side Plates', 
    price: 125.99, 
    category: 'Body Armor', 
    description: 'Protective side plates for complete coverage', 
    inStock: true, 
    rating: 4.7,
    reviews: 89,
    image: sidePlatesAssets.a4SidePlates,
    images: [
      sidePlatesAssets.a4SidePlates,
      sidePlatesAssets.a4SidePlatesSpace
    ]
  },
  { 
    id: '3', 
    name: 'A4 – Level III++ Alloy Body Armor', 
    price: 239.99, 
    category: 'Body Armor', 
    description: 'Premium level III++ alloy body armor', 
    inStock: true, 
    rating: 4.9,
    reviews: 203,
    image: bodyArmorAssets.a4LevelIIIPlusPlusAlloy,
    images: [bodyArmorAssets.a4LevelIIIPlusPlusAlloy]
  },
  { 
    id: '4', 
    name: 'Heritage – Level III AR500 Steel Body Armor', 
    price: 189.99, 
    category: 'Body Armor', 
    description: 'Traditional AR500 steel body armor with heritage design', 
    inStock: true, 
    rating: 4.6,
    reviews: 156,
    image: bodyArmorAssets.heritageLevelIIIAR500,
    images: [
      bodyArmorAssets.heritageLevelIIIAR500,
      bodyArmorAssets.heritageLevelIIIAR500Alt
    ]
  },
  { 
    id: '5', 
    name: 'The Concealment Plate Carrier', 
    price: 89.99, 
    category: 'Plate Carriers', 
    description: 'Discreet plate carrier for everyday carry', 
    inStock: true, 
    rating: 4.8,
    reviews: 92,
    image: plateCarrierAssets.concealmentPlateCarrier,
    images: [
      plateCarrierAssets.concealmentPlateCarrier,
      plateCarrierAssets.concealmentPlateCarrier2,
      plateCarrierAssets.concealmentPlateCarrier3,
      plateCarrierAssets.concealmentPlateCarrier4
    ]
  },
  { 
    id: '6', 
    name: 'The Concealment Plate Carrier - White', 
    price: 94.99, 
    category: 'Plate Carriers', 
    description: 'White concealment plate carrier for low-profile operations', 
    inStock: true, 
    rating: 4.7,
    reviews: 67,
    image: plateCarrierAssets.concealmentPlateCarrierWhiteFront,
    images: [
      plateCarrierAssets.concealmentPlateCarrierWhiteFront,
      plateCarrierAssets.concealmentPlateCarrierWhiteSide
    ]
  },
  { 
    id: '7', 
    name: 'Coleman Perfect Flow 2-Burner Stove', 
    price: 79.99, 
    category: 'Equipment', 
    description: 'Reliable 2-burner camping stove with perfect flow technology', 
    inStock: true, 
    rating: 4.5,
    reviews: 124,
    image: equipmentAssets.colemanBurnerFrontClosed,
    images: [
      equipmentAssets.colemanBurnerFrontClosed,
      equipmentAssets.colemanBurnerFrontOpen,
      equipmentAssets.colemanBurnerTopOpen
    ]
  }
]

export const categories: Category[] = ['All', 'Body Armor', 'Plate Carriers', 'Equipment']

export const companyInfo = {
  name: 'Cross-Current Precision Armory',
  tagline: 'Texas Proud, Family Strong',
  description: 'Providing top-notch customer service alongside high-quality tactical gear and apparel.',
  founded: 'January 2026',
  mission: 'Established with the hopes of becoming the go-to, one stop shop for the warrior within.',
  story: 'We are a small town, small business with big dreams for tomorrow. Our plan is to carry all your tactical, survival or just everyday warrior wants or needs. We take pride in what we do and believe that if you give, you get.',
  contact: {
    phone: '(555) 123-4567',
    email: 'info@crosscurrentarmory.com',
    location: 'Texas, USA'
  }
}
