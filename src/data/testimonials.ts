export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar?: string
  rating: number
  content: string
  result: string
  date: string
  verified: boolean
  product?: string
  location?: string
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    role: 'Security Professional',
    company: 'Elite Protection Services',
    avatar: '/avatars/sarah-martinez.jpg',
    rating: 5,
    content: 'The Level III+ Alloy Body Armor exceeded my expectations. The quality is exceptional and it fits perfectly. I feel completely protected during my shifts.',
    result: 'Increased confidence by 95% during high-risk operations',
    date: '2024-02-15',
    verified: true,
    product: 'A2 – Level III+ Alloy Body Armor',
    location: 'Houston, TX'
  },
  {
    id: '2',
    name: 'Mike Thompson',
    role: 'Tactical Instructor',
    company: 'Texas Defense Academy',
    avatar: '/avatars/mike-thompson.jpg',
    rating: 5,
    content: 'I\'ve been using Cross-Current Precision Armory gear for over 6 months now. The side plates provide excellent coverage without restricting movement. Highly recommend!',
    result: 'Zero equipment failures during 200+ training sessions',
    date: '2024-01-28',
    verified: true,
    product: 'A4 Side Plates',
    location: 'Dallas, TX'
  },
  {
    id: '3',
    name: 'Jennifer Chen',
    role: 'Private Security Contractor',
    company: 'SecureGuard Solutions',
    avatar: '/avatars/jennifer-chen.jpg',
    rating: 4,
    content: 'The A4 Level III++ armor is top-notch. It\'s lightweight yet provides maximum protection. Customer service was outstanding and shipping was fast.',
    result: 'Reduced fatigue during 12-hour shifts by 40%',
    date: '2024-02-20',
    verified: true,
    product: 'A4 – Level III++ Alloy Body Armor',
    location: 'Austin, TX'
  },
  {
    id: '4',
    name: 'David Rodriguez',
    role: 'Law Enforcement Officer',
    company: 'Metro Police Department',
    avatar: '/avatars/david-rodriguez.jpg',
    rating: 5,
    content: 'As a police officer, I need reliable gear. Cross-Current delivers every time. The body armor has saved my life twice. Can\'t thank them enough.',
    result: 'Life-saving protection during critical incidents',
    date: '2024-01-10',
    verified: true,
    product: 'A2 – Level III+ Alloy Body Armor',
    location: 'San Antonio, TX'
  },
  {
    id: '5',
    name: 'Amanda Foster',
    role: 'Security Team Lead',
    company: 'Corporate Security Group',
    avatar: '/avatars/amanda-foster.jpg',
    rating: 5,
    content: 'Outstanding quality and customer service. The team helped me choose the right armor for my team\'s needs. Everyone loves the comfort and protection.',
    result: 'Team satisfaction increased from 75% to 98%',
    date: '2024-02-08',
    verified: true,
    product: 'A4 – Level III++ Alloy Body Armor',
    location: 'Fort Worth, TX'
  },
  {
    id: '6',
    name: 'James Wilson',
    role: 'Veteran & Security Consultant',
    company: 'Wilson Security Consulting',
    avatar: '/avatars/james-wilson.jpg',
    rating: 5,
    content: 'Being a veteran, I\'m very particular about my gear. Cross-Current Precision Armory meets military-grade standards. Exceptional quality and Texas proud!',
    result: 'Client trust and safety ratings improved by 85%',
    date: '2024-01-25',
    verified: true,
    product: 'A4 Side Plates',
    location: 'El Paso, TX'
  }
]
