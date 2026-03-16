/**
 * ProductComparison component for side-by-side product comparison
 * Features: Multi-product comparison, feature highlighting, responsive design
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, AlertCircle } from 'lucide-react'
import { OptimizedImage } from '../../../utils/imageOptimization.tsx'
import type { Product } from '../../../types'

interface ProductComparisonProps {
  products: Product[]
  maxProducts?: number
  className?: string
}

interface ComparisonFeature {
  name: string
  type: 'text' | 'boolean' | 'rating' | 'price'
  important?: boolean
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  maxProducts = 3,
  className = ''
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)

  // Define comparison features based on product data
  const comparisonFeatures: ComparisonFeature[] = useMemo(() => [
    { name: 'Price', type: 'price', important: true },
    { name: 'Rating', type: 'rating' },
    { name: 'Reviews', type: 'text' },
    { name: 'Category', type: 'text' },
    { name: 'In Stock', type: 'boolean', important: true },
    { name: 'Description', type: 'text' },
  ], [])

  const availableProducts = useMemo(() => {
    return products.filter(product => 
      !selectedProducts.some(selected => selected.id === product.id)
    )
  }, [products, selectedProducts])

  const addProduct = (product: Product) => {
    if (selectedProducts.length < maxProducts) {
      setSelectedProducts(prev => [...prev, product])
    }
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId))
  }

  const openComparison = () => {
    if (selectedProducts.length >= 2) {
      setShowModal(true)
    }
  }

  const closeComparison = () => {
    setShowModal(false)
  }

  const renderFeatureValue = (product: Product, feature: ComparisonFeature) => {
    switch (feature.type) {
      case 'price':
        return (
          <span className="font-bold text-red-600">
            ${product.price}
          </span>
        )
      
      case 'rating':
        return (
          <div className="flex items-center gap-1">
            <span className="font-medium">{product.rating || 'N/A'}</span>
            {product.rating && (
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < Math.floor(product.rating!)
                        ? 'bg-yellow-400'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )
      
      case 'boolean':
        if (feature.name === 'In Stock') {
          return product.inStock ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )
        }
        return <span>-</span>
      
      case 'text':
      default:
        if (feature.name === 'Category') return product.category
        if (feature.name === 'Reviews') return `${product.reviews || 0} reviews`
        if (feature.name === 'Description') {
          return (
            <span className="text-sm text-gray-600 line-clamp-3">
              {product.description}
            </span>
          )
        }
        return '-'
    }
  }

  const getBestValue = (feature: ComparisonFeature) => {
    if (feature.type !== 'price') return null
    
    const prices = selectedProducts.map(p => p.price)
    const minPrice = Math.min(...prices)
    
    return selectedProducts.find(p => p.price === minPrice)?.id
  }

  if (products.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No products available for comparison</p>
      </div>
    )
  }

  return (
    <div className={`product-comparison ${className}`}>
      {/* Product Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Compare Products</h3>
        
        {/* Selected Products */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3"
              >
                <OptimizedImage
                  src={product.image}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-red-600 font-bold">${product.price}</p>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label={`Remove ${product.name} from comparison`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {/* Add Product Slots */}
            {Array.from({ length: maxProducts - selectedProducts.length }).map((_, index) => (
              <div
                key={`slot-${index}`}
                className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center min-w-[200px]"
              >
                <div className="text-center text-gray-500">
                  <Plus className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-xs">Add Product</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Compare Button */}
          <button
            onClick={openComparison}
            disabled={selectedProducts.length < 2}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              selectedProducts.length >= 2
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Compare {selectedProducts.length} Products
          </button>
        </div>

        {/* Available Products */}
        {availableProducts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add more products:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableProducts.slice(0, 6).map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product)}
                  disabled={selectedProducts.length >= maxProducts}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-red-600 font-bold">${product.price}</p>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeComparison}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-6xl max-h-[90vh] w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Product Comparison</h2>
                <button
                  onClick={closeComparison}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close comparison"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-48">
                        Feature
                      </th>
                      {selectedProducts.map((product) => (
                        <th key={product.id} className="px-6 py-4 text-center">
                          <div className="space-y-2">
                            <OptimizedImage
                              src={product.image}
                              alt={product.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-lg mx-auto"
                            />
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-red-600 font-bold">${product.price}</p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => {
                      const bestProductId = getBestValue(feature)
                      
                      return (
                        <tr
                          key={feature.name}
                          className={`border-t border-gray-200 ${
                            feature.important ? 'bg-yellow-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">
                            <div className="flex items-center gap-2">
                              {feature.name}
                              {feature.important && (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </td>
                          {selectedProducts.map((product) => (
                            <td
                              key={product.id}
                              className={`px-6 py-4 text-center text-sm ${
                                bestProductId === product.id ? 'bg-green-100 font-medium' : ''
                              }`}
                            >
                              {renderFeatureValue(product, feature)}
                              {bestProductId === product.id && (
                                <div className="text-green-600 text-xs mt-1">Best Value</div>
                              )}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={closeComparison}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Here you could add functionality to save or share the comparison
                    alert('Comparison saved!')
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Save Comparison
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductComparison
