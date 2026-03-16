import { BookOpen, Shield, Ruler, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface EducationArticle {
  id: string
  icon: React.ReactNode
  title: string
  summary: string
  bullets: string[]
}

const articles: EducationArticle[] = [
  {
    id: 'armor-levels',
    icon: <Shield className="h-8 w-8 text-red-600" />,
    title: 'Understanding NIJ Armor Protection Levels',
    summary:
      'The National Institute of Justice (NIJ) establishes the standard for body armor performance in the US. Knowing the levels helps you choose the right protection for your threat environment.',
    bullets: [
      'Level IIA — protects against 9mm and .40 S&W (soft armor, lowest weight)',
      'Level II — protects against 9mm and .357 Magnum',
      'Level IIIA — protects against .357 SIG and .44 Magnum (highest soft-armor rating)',
      'Level III — protects against 7.62×51mm NATO rifle rounds (requires hard plate)',
      'Level IV — protects against .30 caliber armor-piercing rifle rounds',
      'Level III+ (non-NIJ) — manufacturer designation for enhanced rifle-round resistance',
    ],
  },
  {
    id: 'plate-materials',
    icon: <Zap className="h-8 w-8 text-red-600" />,
    title: 'Steel vs. Ceramic vs. UHMWPE Plates',
    summary:
      'Hard armor plates come in several materials, each with distinct trade-offs in weight, multi-hit capability, and cost.',
    bullets: [
      'AR500 Steel — durable, multi-hit capable, heavier (~8 lbs/plate), spall coating required',
      'Ceramic — lighter than steel, excellent single-hit performance, can crack on multi-hit',
      'UHMWPE (Polyethylene) — lightest option, buoyant, NIJ Level III rated, cost premium',
      'Composite (ceramic + polyethylene) — combines stopping power and weight reduction',
      'Alloy plates — proprietary blends optimizing weight, protection, and price point',
    ],
  },
  {
    id: 'fit-and-wear',
    icon: <Ruler className="h-8 w-8 text-red-600" />,
    title: 'How to Properly Fit and Wear Body Armor',
    summary:
      'Even the best armor is ineffective if worn incorrectly. Follow these guidelines to ensure maximum protection.',
    bullets: [
      'Top of front plate should sit at or just below the collar bone',
      'Bottom of plate should not extend below the navel when standing',
      'Plate must cover the heart and lungs — the vital zone',
      'Side plates add protection for the liver, spleen, and kidneys',
      'Carrier straps should allow full arm range of motion without shifting plates',
      'Perform a "jump test" — plates should not shift noticeably when you jump',
    ],
  },
  {
    id: 'legal',
    icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
    title: 'Body Armor Laws & Regulations',
    summary:
      'Ownership and purchase of body armor is legal for most civilians in the United States, but some states and situations have specific restrictions.',
    bullets: [
      'Federal law prohibits possession of body armor by convicted violent felons (18 U.S.C. § 931)',
      'Connecticut requires in-person purchase — online sales are prohibited in CT',
      'Always verify your state and local laws before purchasing',
      'Active-duty military and law enforcement face no special civilian restrictions',
      'Body armor cannot be worn while committing a crime in most states',
    ],
  },
  {
    id: 'care',
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: 'Maintenance, Storage & Inspection',
    summary:
      'Proper care extends the service life of your armor and ensures it performs when you need it most.',
    bullets: [
      'Store in a cool, dry location — avoid temperatures above 120 °F or below -40 °F',
      'Keep away from prolonged direct sunlight (UV degrades UHMWPE)',
      'Inspect hard plates every 6 months for cracks, chips, or delamination',
      'Wipe hard plates with a damp cloth; do not submerge or machine-wash',
      'Soft armor carriers can often be hand-washed in cold water — check manufacturer label',
      'Replace armor if it shows signs of damage, deformation, or has been shot',
    ],
  },
  {
    id: 'selection',
    icon: <BookOpen className="h-8 w-8 text-blue-600" />,
    title: 'Choosing the Right Armor for Your Mission',
    summary:
      'The "best" body armor depends on your specific threat environment, activity, and required mobility.',
    bullets: [
      'EDC / Concealed: Level IIIA soft armor or Level III concealment plate + carrier',
      'Law enforcement patrol: Level IIIA soft with Level III+ hard inserts',
      'High-threat environments: Level III or IV ceramic/composite plates',
      'Training & range use: Steel plates provide cost-effective multi-hit durability',
      'Plate carrier weight matters — heavier armor causes fatigue that degrades performance',
      'Always pair armor level to the realistic threat — over-protection adds unnecessary weight',
    ],
  },
]

interface EducationProps {
  className?: string
}

export function Education({ className = '' }: EducationProps) {
  return (
    <section id="education" className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tactical Gear Education Center</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Make informed decisions. Learn about armor protection levels, materials, fit, legal
            requirements, and maintenance — straight from the source.
          </p>
        </div>

        {/* Article grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{article.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{article.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{article.summary}</p>
              <ul className="mt-auto space-y-2">
                {article.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-600 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
