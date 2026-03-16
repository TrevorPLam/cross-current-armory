import { motion } from 'framer-motion'
import { Shield, Star, Images } from 'lucide-react'
import { useCart } from '../../../hooks'
import { ProductGallery } from '../../ui/ProductGallery'
import { useState } from 'react'
import type { Product } from '../../../types'

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart()
  const [showGallery, setShowGallery] = useState(false)

  const hasMultipleImages = product.images && product.images.length > 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group"
      role="article"
      aria-labelledby={`product-${product.id}-name`}
      aria-describedby={`product-${product.id}-description`}
    >
      <div className="p-4">
        {/* Product Image Section */}
        <div className="relative mb-4">
          {product.images && product.images.length > 0 ? (
            <div 
              className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setShowGallery(true)}
            >
              <img
                src={product.images[0]}
                alt={`${product.name} - Main image`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Gallery Overlay */}
              {hasMultipleImages && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <Images className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-sm font-medium">View {product.images.length} images</span>
                  </div>
                </div>
              )}
              
              {/* Multiple Images Indicator */}
              {hasMultipleImages && (
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  +{product.images.length - 1} more
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              <Shield className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        <h3 
          id={`product-${product.id}-name`}
          className="font-semibold text-lg mb-2"
        >
          {product.name}
        </h3>
        <p 
          id={`product-${product.id}-description`}
          className="text-gray-600 text-sm mb-3"
        >
          {product.description}
        </p>
        
        <div className="flex items-center mb-3" role="img" aria-label={`Rating: ${product.rating || 0} out of 5 stars, ${product.reviews || 0} reviews`}>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">{product.rating}</span>
          <span className="text-xs text-gray-500 ml-2">({product.reviews} reviews)</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-red-600" aria-label={`Price: $${product.price}`}>
            ${product.price}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-white"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
        
        {/* Product Gallery Modal */}
        {showGallery && product.images && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full w-full">
              <button
                onClick={() => setShowGallery(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
                aria-label="Close gallery"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <ProductGallery
                images={product.images}
                alt={product.name}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard
