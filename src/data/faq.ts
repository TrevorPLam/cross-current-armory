export interface FAQ {
  id: string
  question: string
  answer: string
  category: FAQCategory
}

export type FAQCategory =
  | 'All'
  | 'Body Armor'
  | 'Plate Carriers'
  | 'Ordering & Shipping'
  | 'Returns & Warranty'
  | 'Safety & Legal'

export const faqCategories: FAQCategory[] = [
  'All',
  'Body Armor',
  'Plate Carriers',
  'Ordering & Shipping',
  'Returns & Warranty',
  'Safety & Legal',
]

export const faqs: FAQ[] = [
  // ── Body Armor ──────────────────────────────────────────────────────────────
  {
    id: 'ba-1',
    category: 'Body Armor',
    question: 'What is the difference between Level III and Level III+ body armor?',
    answer:
      'Level III armor is rated by the NIJ to stop 6 rounds of 7.62×51 mm NATO ball ammunition. Level III+ is a non-NIJ designation used by manufacturers to indicate enhanced protection beyond standard Level III — typically stopping common threats like M855 (green tip) and M193 rounds that standard Level III may not. Our A2 Level III+ Alloy and A4 Level III++ Alloy plates meet or exceed these standards.',
  },
  {
    id: 'ba-2',
    category: 'Body Armor',
    question: 'What is AR500 steel body armor?',
    answer:
      'AR500 is a specific grade of abrasion-resistant steel used to manufacture hard armor plates. Our Heritage Level III AR500 plates are made from this high-hardness steel, providing excellent durability and multi-hit capability at an affordable price point. They are heavier than alloy alternatives but extremely tough and long-lasting.',
  },
  {
    id: 'ba-3',
    category: 'Body Armor',
    question: 'Are your armor plates NIJ certified?',
    answer:
      'Our plates meet NIJ 0101.06 performance standards. Each product listing clearly states the protection level. We recommend verifying the NIJ compliance certificate for your specific use case, especially for law-enforcement or professional security applications.',
  },
  {
    id: 'ba-4',
    category: 'Body Armor',
    question: 'What is the lifespan of body armor plates?',
    answer:
      'Hard armor plates (steel and alloy) typically have a service life of 5–10 years when stored properly — away from extreme heat, moisture, and direct sunlight. Always inspect plates before each use for cracks, dents, or deformation. Follow the manufacturer\'s guidelines for your specific plate.',
  },
  {
    id: 'ba-5',
    category: 'Body Armor',
    question: 'How do I properly care for and store my armor plates?',
    answer:
      'Store plates in a cool, dry location out of direct sunlight. Avoid dropping them on hard surfaces, as impact damage can compromise integrity. For steel plates with a fragmentation-reducing coating, inspect the coating regularly. Clean with a damp cloth — avoid harsh chemicals that can degrade protective coatings.',
  },
  // ── Plate Carriers ──────────────────────────────────────────────────────────
  {
    id: 'pc-1',
    category: 'Plate Carriers',
    question: 'What plate size fits my plate carrier?',
    answer:
      'Most of our plate carriers are designed for 10″×12″ SAPI/ESAPI cut plates, which is the most common size for adults. The concealment carriers support up to 10″×12″ soft and hard plates. Check our Size Guide for exact dimensions and a fit guide based on chest size.',
  },
  {
    id: 'pc-2',
    category: 'Plate Carriers',
    question: 'What is the difference between the Concealment and standard plate carriers?',
    answer:
      'The Concealment Plate Carrier is designed to be worn discreetly under or over clothing with a lower-profile silhouette. It sacrifices some accessory real-estate (fewer MOLLE rows) in favour of a slimmer profile. Standard tactical carriers offer more modularity and ventilation, ideal for range and field use.',
  },
  {
    id: 'pc-3',
    category: 'Plate Carriers',
    question: 'Can I add pouches and accessories to the plate carriers?',
    answer:
      'Yes. All our plate carriers feature MOLLE (Modular Lightweight Load-carrying Equipment) webbing on the front, back, and sides, allowing you to attach compatible pouches, magazine holders, hydration packs, and other accessories.',
  },
  // ── Ordering & Shipping ─────────────────────────────────────────────────────
  {
    id: 'os-1',
    category: 'Ordering & Shipping',
    question: 'How long does shipping take?',
    answer:
      'Standard orders ship within 1–3 business days from our Texas warehouse. Domestic delivery typically takes 5–7 business days via standard shipping, or 2–3 business days with expedited shipping. You will receive a tracking number once your order ships.',
  },
  {
    id: 'os-2',
    category: 'Ordering & Shipping',
    question: 'Do you offer free shipping?',
    answer:
      'Yes — we offer free standard shipping on all domestic orders over $150. Orders under $150 have a flat shipping rate. Expedited shipping is available at checkout for an additional fee.',
  },
  {
    id: 'os-3',
    category: 'Ordering & Shipping',
    question: 'Do you ship internationally?',
    answer:
      'We currently ship within the United States only. International orders are not available at this time due to varying import regulations for defensive equipment. Sign up for our newsletter to be notified if this changes.',
  },
  {
    id: 'os-4',
    category: 'Ordering & Shipping',
    question: 'How do I track my order?',
    answer:
      'Once your order is shipped, you will receive an email with a tracking number and a direct link to the carrier\'s tracking page. You can also contact us at info@crosscurrentarmory.com with your order number for an update.',
  },
  // ── Returns & Warranty ──────────────────────────────────────────────────────
  {
    id: 'rw-1',
    category: 'Returns & Warranty',
    question: 'What is your return policy?',
    answer:
      'We accept returns within 30 days of delivery for items in their original, unused condition. Body armor and plates that have been worn or show signs of use cannot be returned for safety reasons. Please contact us at info@crosscurrentarmory.com to initiate a return.',
  },
  {
    id: 'rw-2',
    category: 'Returns & Warranty',
    question: 'What warranty do your products carry?',
    answer:
      'All armor plates carry a 1-year manufacturer\'s warranty against defects in materials and workmanship. Plate carriers carry a 90-day warranty. Warranties do not cover damage from misuse, normal wear and tear, or ballistic impact (which is expected use).',
  },
  {
    id: 'rw-3',
    category: 'Returns & Warranty',
    question: 'What should I do if my product arrives damaged?',
    answer:
      'Please photograph the damage and contact us within 48 hours of delivery at info@crosscurrentarmory.com. We will arrange a replacement or refund at no additional cost to you.',
  },
  // ── Safety & Legal ──────────────────────────────────────────────────────────
  {
    id: 'sl-1',
    category: 'Safety & Legal',
    question: 'Is it legal to own body armor?',
    answer:
      'In most U.S. states, adults can legally purchase and own body armor for personal protection. However, some states (e.g., Connecticut) require in-person purchases, and federal law prohibits convicted felons from owning body armor. It is your responsibility to verify applicable laws in your jurisdiction before purchasing.',
  },
  {
    id: 'sl-2',
    category: 'Safety & Legal',
    question: 'Can body armor stop all bullets?',
    answer:
      'No. Each armor rating stops specific threats as tested under NIJ standards. Level III stops rifle rounds up to 7.62×51 mm NATO under test conditions. No armor guarantees protection against all projectiles — factors like caliber, velocity, bullet construction, and angle of impact all affect performance.',
  },
  {
    id: 'sl-3',
    category: 'Safety & Legal',
    question: 'Should I wear body armor with a plate carrier?',
    answer:
      'Hard armor plates require a plate carrier or a vest with plate pockets to function properly. Wearing a plate without a carrier provides no meaningful protection and can be dangerous. Always use our plates inside an appropriately sized plate carrier.',
  },
]
