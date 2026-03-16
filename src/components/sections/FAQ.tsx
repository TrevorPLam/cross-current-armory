import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { faqs, faqCategories, type FAQ, type FAQCategory } from '../../data/faq'

interface FAQProps {
  className?: string
  defaultCategory?: FAQCategory
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-inset"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-red-600 flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 py-4 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ({ className = '', defaultCategory = 'All' }: FAQProps) {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>(defaultCategory)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory
      if (!matchesCategory) return false
      if (!q) return true
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      )
    })
  }, [activeCategory, searchQuery])

  return (
    <section
      id="faq"
      className={`py-16 bg-gray-50 ${className}`}
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-600 mb-2">
            Support
          </p>
          <h2
            id="faq-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our products, shipping, and policies.
            Can't find an answer?{' '}
            <a href="#contact" className="text-red-600 hover:underline font-medium">
              Contact us
            </a>
            .
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            aria-label="Search FAQ"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="FAQ categories">
          {faqCategories.map(category => (
            <button
              key={category}
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        {filtered.length > 0 ? (
          <div className="space-y-3" role="tabpanel">
            {filtered.map(faq => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No results found for "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Our team is available Monday–Friday, 9 AM–6 PM CT.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:info@crosscurrentarmory.com"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              Email Us
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
