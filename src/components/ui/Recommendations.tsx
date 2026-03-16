import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Clock } from 'lucide-react'
import { ProductCard } from '../molecules/ProductCard'
import type { Product } from '../../types'

interface RecommendationsProps {
  /** Product whose category drives "similar" recommendations */
  currentProduct?: Product
  /** IDs of recently viewed products (most recent first) */
  recentlyViewedIds?: string[]
  allProducts: Product[]
  className?: string
  maxItems?: number
}

function sectionTitle(currentProduct?: Product, recentlyViewedIds?: string[]): string {
  if (currentProduct) return 'Similar Products'
  if (recentlyViewedIds && recentlyViewedIds.length > 0) return 'Recently Viewed'
  return 'You May Also Like'
}

export function Recommendations({
  currentProduct,
  recentlyViewedIds = [],
  allProducts,
  className = '',
  maxItems = 4,
}: RecommendationsProps) {
  const recommendations = useMemo((): Product[] => {
    if (currentProduct) {
      // Products in same category, excluding the current one
      return allProducts
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, maxItems)
    }

    if (recentlyViewedIds.length > 0) {
      // Show recently viewed products
      return recentlyViewedIds
        .map(id => allProducts.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined)
        .slice(0, maxItems)
    }

    // Fallback: top-rated products
    return [...allProducts]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, maxItems)
  }, [currentProduct, recentlyViewedIds, allProducts, maxItems])

  if (recommendations.length === 0) return null

  const isRecentlyViewed = !currentProduct && recentlyViewedIds.length > 0

  return (
    <section className={`recommendations ${className}`} aria-labelledby="recommendations-heading">
      <div className="flex items-center gap-2 mb-6">
        {isRecentlyViewed ? (
          <Clock className="h-5 w-5 text-gray-500" aria-hidden="true" />
        ) : (
          <Sparkles className="h-5 w-5 text-red-600" aria-hidden="true" />
        )}
        <h2 id="recommendations-heading" className="text-xl font-bold text-gray-900">
          {sectionTitle(currentProduct, recentlyViewedIds)}
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <ProductCard product={product} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
