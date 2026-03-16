/**
 * QuickView — mobile-optimised product quick-view modal.
 * Slides up from the bottom on mobile, centred overlay on desktop.
 * Supports swipe-to-dismiss (swipe down) on touch devices.
 */

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Star, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTouchGestures } from '../../hooks/useTouchGestures'
import { useCart } from '../../hooks'
import type { Product } from '../../types'

export interface QuickViewProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const { addToCart } = useCart()
  const sheetRef = useRef<HTMLDivElement>(null)
  const { swipeDirection } = useTouchGestures(sheetRef, { threshold: 60 })

    // Swipe-down to dismiss on mobile; swipe-left or swipe-up covered in Navigation
  useEffect(() => {
    if (swipeDirection === 'down') onClose()
  }, [swipeDirection, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!product) return null

  const handleAddToCart = () => {
    addToCart(product, 1)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet — slides up on mobile, centred on desktop */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${product.name}`}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={[
              'fixed z-50 bg-white shadow-2xl overflow-y-auto',
              // Mobile: bottom sheet
              'bottom-0 left-0 right-0 rounded-t-2xl max-h-[90dvh]',
              // Desktop: centred dialog
              'md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
              'md:rounded-2xl md:max-h-[85vh] md:w-full md:max-w-2xl',
            ].join(' ')}
          >
            {/* Drag handle (mobile only) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden" aria-hidden="true">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 pr-2">
                {product.name}
              </h2>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
                aria-label="Close quick view"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 pb-6">
              {/* Product image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl mt-4 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="bg-white text-gray-900 font-semibold px-4 py-1.5 rounded-full text-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Rating */}
              {product.rating != null && (
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="flex items-center gap-0.5" aria-label={`Rating: ${product.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  {product.reviews != null && (
                    <span className="text-sm text-gray-500">({product.reviews.toLocaleString()})</span>
                  )}
                </div>
              )}

              {/* Price & category */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Specs preview */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</dt>
                      <dd className="text-sm font-medium text-gray-900">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={[
                    'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2',
                    product.inStock
                      ? 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed',
                  ].join(' ')}
                  aria-disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                {product.handle && (
                  <Link
                    to={`/products/${product.handle}`}
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-base hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                  >
                    View Full Details
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default QuickView
