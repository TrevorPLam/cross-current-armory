export interface FAQ {
  id: string
  question: string
  answer: string
  category: FAQCategory
}

export type FAQCategory =
  | 'all'
  | 'body-armor'
  | 'plate-carriers'
  | 'ordering'
  | 'shipping'
  | 'returns'
  | 'sizing'

export const faqCategories: { value: FAQCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'body-armor', label: 'Body Armor' },
  { value: 'plate-carriers', label: 'Plate Carriers' },
  { value: 'ordering', label: 'Ordering' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'returns', label: 'Returns' },
  { value: 'sizing', label: 'Sizing' },
]

export const faqs: FAQ[] = [
  // Body Armor
  {
    id: '1',
    question: 'What is the difference between Level III and Level III+ body armor?',
    answer:
      'Level III body armor is rated to stop six rounds of 7.62×51mm NATO (.308 Winchester) at 2,780 fps. Level III+ is a non-NIJ-standard rating used by manufacturers to indicate resistance to higher-velocity threats such as M855 "green tip" 5.56mm rounds. Our A2 Level III+ Alloy plates are engineered to defeat these enhanced threats while remaining lightweight.',
    category: 'body-armor',
  },
  {
    id: '2',
    question: 'What is AR500 steel body armor?',
    answer:
      'AR500 is a grade of abrasion-resistant steel commonly used in body armor manufacturing. It provides excellent multi-hit protection and long service life. Our Heritage Level III AR500 plates are coated with a spall-reducing fragmentation coating to mitigate secondary projectile fragmentation on impact.',
    category: 'body-armor',
  },
  {
    id: '3',
    question: 'How do I care for and maintain my body armor?',
    answer:
      'Store armor in a cool, dry location away from direct sunlight and extreme temperatures. Do not machine-wash hard plates; wipe clean with a damp cloth. Soft armor carriers may be hand-washed. Inspect your armor regularly for cracks, delamination, or damage. Replace immediately if damaged. Follow all manufacturer guidelines included with your product.',
    category: 'body-armor',
  },
  {
    id: '4',
    question: 'Is your body armor NIJ-certified?',
    answer:
      'Our armor products are tested to NIJ standards. Product listings include certification details. NIJ-certified products have been independently lab-tested and listed on the NIJ Compliant Products List. Check each product description for specific certification information.',
    category: 'body-armor',
  },
  // Plate Carriers
  {
    id: '5',
    question: 'What plate sizes do your plate carriers accept?',
    answer:
      'Our plate carriers are designed to accept standard 10"×12" SAPI-cut and Shooter-cut plates. Some models also support 11"×14" plates. Please check individual product listings for exact plate size compatibility.',
    category: 'plate-carriers',
  },
  {
    id: '6',
    question: 'Can I use the Concealment Plate Carrier for everyday carry?',
    answer:
      'Yes. The Concealment Plate Carrier is specifically designed for a low-profile, everyday-carry (EDC) profile. Its slim design can be worn discreetly under outer garments while still accepting standard armor plates for full protection.',
    category: 'plate-carriers',
  },
  // Ordering
  {
    id: '7',
    question: 'What payment methods do you accept?',
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, and Shop Pay. All transactions are secured with SSL encryption and processed through Shopify's PCI-DSS-compliant checkout.",
    category: 'ordering',
  },
  {
    id: '8',
    question: 'Can I modify or cancel my order after placing it?',
    answer:
      'Orders can be modified or cancelled within 1 hour of placement by contacting us directly at info@crosscurrentarmory.com or calling (555) 123-4567. After the 1-hour window, orders may already be in processing and changes cannot be guaranteed.',
    category: 'ordering',
  },
  {
    id: '9',
    question: 'Do I need an account to place an order?',
    answer:
      'No account is required. You can check out as a guest. Creating an account lets you track orders, save your shipping address, and view your order history.',
    category: 'ordering',
  },
  // Shipping
  {
    id: '10',
    question: 'How long does shipping take?',
    answer:
      'Standard shipping typically takes 5–7 business days. Expedited (2–3 business day) and overnight options are available at checkout. Orders placed before 2 PM CST on business days are processed same day.',
    category: 'shipping',
  },
  {
    id: '11',
    question: 'Do you ship internationally?',
    answer:
      'Currently we ship within the contiguous United States. International shipping and shipping to Alaska, Hawaii, and US territories is not available at this time. We are actively working to expand shipping options.',
    category: 'shipping',
  },
  {
    id: '12',
    question: 'How do I track my order?',
    answer:
      "You will receive a shipping confirmation email with a tracking number once your order ships. Use the tracking link in the email or visit the carrier's website and enter your tracking number directly.",
    category: 'shipping',
  },
  // Returns
  {
    id: '13',
    question: 'What is your return policy?',
    answer:
      'We accept returns within 30 days of delivery for unused items in original packaging. Body armor that has been worn, used, or damaged is not eligible for return due to safety regulations. To initiate a return, contact info@crosscurrentarmory.com with your order number.',
    category: 'returns',
  },
  {
    id: '14',
    question: 'What if my product arrives damaged?',
    answer:
      'If your order arrives damaged, please photograph the damage and contact us within 48 hours of delivery. We will arrange a replacement or full refund at no cost to you. Keep all original packaging until the claim is resolved.',
    category: 'returns',
  },
  // Sizing
  {
    id: '15',
    question: 'How do I choose the right size body armor?',
    answer:
      'Measure your chest at its widest point. Most standard plates cover the vital zone (heart and lungs) and should overlap the sternum by at least 2 inches on each side. Our Size Guide section below provides detailed measurement instructions and a size chart.',
    category: 'sizing',
  },
  {
    id: '16',
    question: 'How should body armor fit?',
    answer:
      'Body armor should sit high on the chest — the top of the plate should be roughly level with your collar bone. The bottom of the plate should not extend past your navel when standing. Plates that are too low leave the heart unprotected. Use the cummerbund and shoulder straps on your plate carrier to achieve a snug, secure fit.',
    category: 'sizing',
  },
]
