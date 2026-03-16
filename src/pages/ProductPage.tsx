import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useShopifyProduct } from '../hooks/useShopify'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { Recommendations } from '../components/ui/Recommendations'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { ProductGallery } from '../components/ui/ProductGallery'
import { Button } from '../components/atoms/Button/Button'
import { useCart } from '../hooks'
import { getProductOptions, findVariantByOptions } from '../utils/shopifyMapper'

export function ProductPage() {
  const { handle } = useParams<{ handle: string }>()
  const { product, shopifyProduct, loading, error } = useShopifyProduct(handle || '')
  const { products: allProducts } = useShopifyProducts()
  const { addToViewed, viewedIds } = useRecentlyViewed()
  const { addToCart } = useCart()
  
  // State for variant selection
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)

  // Initialize selected options when product loads
  useEffect(() => {
    if (shopifyProduct) {
      const options = getProductOptions(shopifyProduct)
      const initialOptions: Record<string, string> = {}
      
      Object.entries(options).forEach(([optionName, values]) => {
        initialOptions[optionName] = values[0] // Select first option by default
      })
      
      setSelectedOptions(initialOptions)
    }
  }, [shopifyProduct])

  // Update selected variant when options change
  useEffect(() => {
    if (shopifyProduct && selectedOptions) {
      const variant = findVariantByOptions(shopifyProduct, selectedOptions)
      setSelectedVariant(variant)
    }
  }, [selectedOptions, shopifyProduct])

  useEffect(() => {
    if (product) addToViewed(product.id)
  }, [product, addToViewed])

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }))
  }

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      // Create a product object with the selected variant's ID
      const productWithVariant = {
        ...product,
        shopifyVariantId: selectedVariant.shopifyVariantId,
        price: selectedVariant.price,
      }
      addToCart(productWithVariant, quantity)
    }
  }

  if (loading) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage 
            title="Product Not Found" 
            message={error || "The product you're looking for doesn't exist."}
            action={() => window.location.href = '/collections/all'}
            actionText="Browse Products"
          />
        </div>
      </div>
    )
  }

  const productOptions = shopifyProduct ? getProductOptions(shopifyProduct) : {}
  const hasVariants = Object.keys(productOptions).length > 0
  const isAvailable = selectedVariant?.available ?? product.inStock

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/collections/all" className="text-red-600 hover:text-red-700 text-sm font-medium mb-6 inline-block">
          ← Back to products
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <ProductGallery 
              images={product.images || [product.image]}
              alt={product.name}
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Price */}
            <div className="text-2xl font-bold text-gray-900 mb-4">
              ${selectedVariant?.price.toFixed(2) || product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div className="prose prose-gray mb-6">
              <p>{product.description}</p>
            </div>

            {/* Variant Options */}
            {hasVariants && (
              <div className="mb-6 space-y-4">
                {Object.entries(productOptions).map(([optionName, values]) => (
                  <div key={optionName}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {optionName}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {values.map(value => (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(optionName, value)}
                          className={`px-4 py-2 border rounded-md transition-colors ${
                            selectedOptions[optionName] === value
                              ? 'border-red-600 bg-red-50 text-red-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  -
                </button>
                <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  +
                </button>
              </div>
              
              <Button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                variant="primary"
                size="md"
                className="flex-1"
              >
                {isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Product Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <dl className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="font-medium text-gray-900 w-1/3">{key}:</dt>
                      <dd className="text-gray-600">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Stock Status */}
            <div className="text-sm text-gray-600">
              {isAvailable ? '✓ In Stock' : '✗ Out of Stock'}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <Recommendations 
            currentProduct={product}
            recentlyViewedIds={viewedIds}
            allProducts={allProducts}
            maxItems={4}
          />
        </div>
      </div>
    </div>
  )
}
