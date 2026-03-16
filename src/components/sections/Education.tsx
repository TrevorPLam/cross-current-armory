import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Shield, ChevronRight, ChevronDown } from 'lucide-react'

interface EducationArticle {
  id: string
  title: string
  summary: string
  content: string
  icon: React.ReactNode
  category: string
  readTime: number
}

const articles: EducationArticle[] = [
  {
    id: 'armor-levels',
    category: 'Protection Levels',
    icon: <Shield className="h-6 w-6" />,
    title: 'Understanding NIJ Body Armor Protection Levels',
    readTime: 4,
    summary:
      'Learn what Level II, IIIA, III, III+, and IV mean and which level is right for your threat environment.',
    content: `The National Institute of Justice (NIJ) sets the standard for body armor protection in the United States. Here's what each level stops:

**Level II** – Stops 9 mm FMJ and .357 Magnum JSP. Lighter and more flexible; suitable for plainclothes officers.

**Level IIIA** – Stops .357 SIG FMJ and .44 Magnum SJHP. The highest protection available in soft armor; still flexible.

**Level III** – Hard armor that stops 6 rounds of 7.62×51 mm NATO FMJ (M80 ball). Suitable for rifle threats.

**Level III+** – A manufacturer designation (not official NIJ) indicating enhanced Level III protection, usually adding defeat of M855 (.223 green tip) and M193 rounds.

**Level IV** – Hard armor that stops a single .30 caliber armor-piercing (AP) M2 round. Heaviest protection level.

**Choosing the right level:** For most civilians and security professionals, Level III or III+ hard armor in a plate carrier offers the best balance of protection, weight, and cost. If your threat environment includes armor-piercing rifle rounds, consider Level IV.`,
  },
  {
    id: 'plate-materials',
    category: 'Materials & Construction',
    icon: <Shield className="h-6 w-6" />,
    title: 'Steel vs. Alloy vs. Ceramic: Which Plate Is Best?',
    readTime: 5,
    summary:
      'A side-by-side look at AR500 steel, alloy (UHMWPE/Dyneema), and ceramic plates — weight, cost, and durability compared.',
    content: `**AR500 Steel Plates**
- *Pros:* Highly durable, multi-hit capable, affordable, long service life (10+ years)
- *Cons:* Heavy (~8–9 lbs per plate), produces spall (fragmentation) on impact — a spall coating is recommended
- *Best for:* Budget-conscious buyers, range use, those who prioritize durability over weight

**Alloy / Ultra-High-Molecular-Weight Polyethylene (UHMWPE)**
- *Pros:* Much lighter (~3–5 lbs per plate), no spall, floats in water
- *Cons:* More expensive, can degrade in high heat (>160°F)
- *Best for:* Daily wear, warm climates, operators who move frequently

**Ceramic (with or without composite backer)**
- *Pros:* Lightest option for Level IV protection, excellent energy absorption
- *Cons:* More fragile than steel — can crack if dropped; single-hit for some designs
- *Best for:* Military and law-enforcement facing rifle-caliber AP threats

**Our recommendation:** Our A2 (Level III+) and A4 (Level III++) alloy plates offer the best combination of protection, weight, and value for most users. For those on a tighter budget, our Heritage AR500 steel plate is an excellent entry point.`,
  },
  {
    id: 'fit-and-sizing',
    category: 'Fit & Sizing',
    icon: <BookOpen className="h-6 w-6" />,
    title: 'How to Properly Fit Body Armor',
    readTime: 3,
    summary:
      'Proper fit is critical for both protection and mobility. Learn how to measure yourself and position plates correctly.',
    content: `**Why fit matters:** A plate that sits too high or too low leaves vital organs exposed. An overly loose carrier reduces the plate's effectiveness and comfort.

**Measuring for plates:**
1. Measure your chest circumference at the widest point.
2. Measure from the top of your sternum to just above your navel (front plate height).
3. Most adult males fit a 10″×12″ plate (SAPI Medium). Smaller frames may use 8″×10″ (SAPI Small).

**Positioning front plates:**
- The top edge of the front plate should sit 2–3 finger-widths below the collar bone (sternal notch).
- The bottom edge should cover to just above the navel.
- The plate should cover your heart and lungs — your vital organ box.

**Back plates:**
- Center the back plate on your spine.
- The top edge should be at about shoulder-blade level.
- The bottom should reach the small of your back.

**Side plates (when used):**
- Position to bridge the gap between front and back plates along your ribs.
- Ensure no large gaps on your flanks.

**Adjusting your carrier:**
- Shoulder straps: snug but not restrictive; you should be able to raise your arms fully.
- Cummerbund: firm enough that plates don't shift during movement.`,
  },
  {
    id: 'care-and-maintenance',
    category: 'Care & Maintenance',
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Body Armor Care and Storage Guide',
    readTime: 3,
    summary:
      'Proper maintenance extends the life of your armor and ensures it performs when you need it most.',
    content: `**Storage guidelines:**
- Store plates in a cool, dry environment — ideally between 50°F and 80°F.
- Avoid direct sunlight for extended periods; UV exposure degrades polymer-based materials.
- Do not store in a car trunk in summer; temperatures can exceed 130°F, which damages UHMWPE plates.
- Store flat or on edge — never stack heavy objects on top of plates.

**Cleaning:**
- Wipe hard plates with a damp cloth. Mild soap is fine for the outer surface.
- Do not submerge plates in water for extended periods.
- For plate carriers: follow the fabric care label; most can be hand-washed or machine-washed on a gentle cycle without plates inside.

**Inspection checklist (before every use):**
- [ ] No visible cracks, dents, or deformations in hard plates
- [ ] Spall coating (on steel plates) is intact with no peeling or cracking
- [ ] Carrier straps and buckles are undamaged and function correctly
- [ ] No unusual odors (can indicate moisture damage inside soft armor)

**When to replace:**
- After any ballistic impact — even if the plate appears intact
- If dropped hard onto concrete (inspect carefully for cracks)
- After 5–10 years (follow manufacturer guidelines; check date stamps)
- If soft armor shows discoloration, delamination, or moisture damage`,
  },
  {
    id: 'legal-guide',
    category: 'Legal',
    icon: <Shield className="h-6 w-6" />,
    title: 'Body Armor Ownership Laws in the U.S.',
    readTime: 4,
    summary:
      'A state-by-state overview of body armor purchase and ownership regulations every buyer should know.',
    content: `**Federal law:** Under federal law (18 U.S.C. § 931), it is a felony for a convicted felon to purchase, own, or possess body armor. No other federal restrictions apply to law-abiding adults.

**State-by-state highlights:**
- **Connecticut:** Requires in-person purchase — online and mail-order sales to CT residents are prohibited.
- **Kentucky:** Wearing body armor during the commission of a crime carries enhanced penalties.
- **All other states:** No additional restrictions beyond federal law for purchase or ownership by adults.

**Important notes:**
- Laws change. Always verify current regulations in your state and locality.
- Wearing body armor in certain public locations may be restricted by local ordinance.
- Military and law enforcement personnel should consult their agency's policy.

**Disclaimer:** This educational content is for informational purposes only and does not constitute legal advice. Consult a qualified attorney for guidance specific to your jurisdiction.`,
  },
]

interface ArticleCardProps {
  article: EducationArticle
  isExpanded: boolean
  onToggle: () => void
  index: number
}

function ArticleCard({ article, isExpanded, onToggle, index }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-inset"
        aria-expanded={isExpanded}
      >
        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mt-0.5">
          {article.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wide text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-gray-400">{article.readTime} min read</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{article.summary}</p>
        </div>
        <div className="flex-shrink-0 ml-2 mt-1">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-red-600" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
          )}
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-8 pt-2 border-t border-gray-100">
          {article.content.split('\n\n').map((block, i) => {
            if (block.startsWith('**') && block.endsWith('**') && !block.slice(2).includes('**')) {
              return (
                <h4 key={i} className="font-bold text-gray-900 mt-6 mb-2 first:mt-0">
                  {block.replace(/\*\*/g, '')}
                </h4>
              )
            }
            // Render bold inline
            const parts = block.split(/(\*\*[^*]+\*\*)/)
            return (
              <p key={i} className="text-gray-600 leading-relaxed mb-3">
                {parts.map((part, j) =>
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={j} className="text-gray-800">
                      {part.replace(/\*\*/g, '')}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Education({ className = '' }: { className?: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id))

  return (
    <section
      id="education"
      className={`py-16 bg-white ${className}`}
      aria-labelledby="education-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-600 mb-2">
            Knowledge Base
          </p>
          <h2
            id="education-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Tactical Gear Education
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Make informed decisions with our expert guides covering armor ratings, materials,
            sizing, maintenance, and legal considerations.
          </p>
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              isExpanded={expandedId === article.id}
              onToggle={() => toggle(article.id)}
              index={index}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Have a specific question?{' '}
            <a href="#faq" className="text-red-600 hover:underline font-medium">
              Browse our FAQ
            </a>{' '}
            or{' '}
            <a href="#contact" className="text-red-600 hover:underline font-medium">
              contact our experts
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
