import { useState } from 'react'
import { Star, CheckCircle, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials, type Testimonial } from '../../data/testimonials'

interface ReviewSystemProps {
  productId?: string
  className?: string
  maxVisible?: number
}

type SortKey = 'recent' | 'highest' | 'lowest' | 'helpful'

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : 'img'} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = interactive ? (hovered || rating) > i : rating > i
        return (
          <Star
            key={i}
            className={`h-4 w-4 transition-colors ${filled ? 'text-yellow-400 fill-current' : 'text-gray-300'} ${interactive ? 'cursor-pointer' : ''}`}
            aria-hidden={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
          />
        )
      })}
    </div>
  )
}

function RatingBreakdown({ reviews }: { reviews: Testimonial[] }) {
  const total = reviews.length
  const counts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }))
  const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 bg-gray-50 rounded-xl mb-8">
      <div className="text-center flex-shrink-0">
        <div className="text-5xl font-bold text-gray-900">{average.toFixed(1)}</div>
        <StarRating rating={Math.round(average)} />
        <p className="text-sm text-gray-500 mt-1">{total} reviews</p>
      </div>
      <div className="flex-1 w-full space-y-1.5">
        {counts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="w-4 text-right text-gray-600 font-medium">{star}</span>
            <Star className="h-3 w-3 text-yellow-400 fill-current flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
              />
            </div>
            <span className="w-6 text-gray-500">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Testimonial }) {
  const [expanded, setExpanded] = useState(false)
  const [helpful, setHelpful] = useState(0)
  const SHORT_LIMIT = 160
  const isLong = review.content.length > SHORT_LIMIT

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-red-700 font-bold text-sm select-none">
          {review.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{review.name}</span>
            {review.verified && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle className="h-3 w-3" aria-hidden="true" />
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} />
            <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {review.product && (
            <p className="text-xs text-gray-500 mb-2">
              Product: <span className="text-gray-700 font-medium">{review.product}</span>
            </p>
          )}

          <blockquote className="text-gray-700 text-sm leading-relaxed">
            {isLong && !expanded ? `${review.content.slice(0, SHORT_LIMIT)}…` : review.content}
          </blockquote>

          {isLong && (
            <button
              onClick={() => setExpanded(prev => !prev)}
              className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              aria-expanded={expanded}
            >
              {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> Read more</>}
            </button>
          )}

          {review.result && (
            <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 font-medium">
              🎯 {review.result}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-400">Helpful?</span>
            <button
              onClick={() => setHelpful(h => h + 1)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-400 rounded px-2 py-0.5 transition-colors"
              aria-label="Mark review as helpful"
            >
              <ThumbsUp className="h-3 w-3" aria-hidden="true" />
              Yes {helpful > 0 && <span className="font-medium">({helpful})</span>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ReviewSystem({ productId, className = '', maxVisible = 4 }: ReviewSystemProps) {
  const [sortKey, setSortKey] = useState<SortKey>('recent')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const filtered = testimonials.filter(r => {
    if (productId && r.product) {
      const productMatch = r.product.toLowerCase().includes(productId.toLowerCase())
      if (!productMatch) return false
    }
    if (filterRating !== null && r.rating !== filterRating) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'highest') return b.rating - a.rating
    if (sortKey === 'lowest') return a.rating - b.rating
    // 'recent' and 'helpful' both default to date desc
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const visible = showAll ? sorted : sorted.slice(0, maxVisible)

  return (
    <section className={`review-system ${className}`} aria-label="Customer Reviews">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      <RatingBreakdown reviews={testimonials} />

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-reviews" className="text-sm text-gray-600 font-medium">Sort by:</label>
          <select
            id="sort-reviews"
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600 font-medium mr-1">Filter:</span>
          {[null, 5, 4, 3, 2, 1].map(rating => (
            <button
              key={String(rating)}
              onClick={() => setFilterRating(rating)}
              className={`flex items-center gap-0.5 text-xs px-2 py-1 rounded-full border transition-colors ${
                filterRating === rating
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {rating === null ? 'All' : <><span>{rating}</span><Star className="h-2.5 w-2.5 fill-current" aria-hidden="true" /></>}
            </button>
          ))}
        </div>
      </div>

      {/* Review list */}
      <AnimatePresence mode="popLayout">
        {visible.length > 0 ? (
          <div className="space-y-4">
            {visible.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 text-center py-8"
          >
            No reviews match the selected filter.
          </motion.p>
        )}
      </AnimatePresence>

      {sorted.length > maxVisible && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="text-red-600 hover:text-red-700 font-semibold text-sm"
          >
            {showAll ? 'Show fewer reviews' : `Show all ${sorted.length} reviews`}
          </button>
        </div>
      )}
    </section>
  )
}
