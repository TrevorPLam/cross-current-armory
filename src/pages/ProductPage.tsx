import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { products } from '../data'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { Recommendations } from '../components/ui/Recommendations'

export function ProductPage() {
  const { handle } = useParams<{ handle: string }>()
  const product = products.find(
    (p) => p.handle === handle || p.id === handle || p.name.toLowerCase().replace(/\s+/g, '-').replace(/[–—]/g, '-') === handle
  )

  const { addToViewed, viewedIds } = useRecentlyViewed()

  useEffect(() => {
    if (product) addToViewed(product.id)
  }, [product, addToViewed])

  if (!product) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/collections/all" className="text-red-600 hover:text-red-700 font-semibold">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/collections/all" className="text-red-600 hover:text-red-700 text-sm font-medium mb-6 inline-block">
          ← Back to products
        </Link>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-red-600 mb-6">${product.price}</p>
            <p className="text-gray-600 mb-8">{product.description}</p>
            <p className="text-sm text-gray-500 mb-8">
              Product detail page will be powered by Shopify in the next phase. For now, add to cart from the home or collection page.
            </p>
            <Link
              to="/collections/all"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View all products
            </Link>
          </div>
        </div>

        {/* Similar products */}
        <div className="mt-16">
          <Recommendations
            currentProduct={product}
            recentlyViewedIds={viewedIds}
            allProducts={products}
            maxItems={4}
          />
        </div>
      </div>
    </div>
  )
}
