import { useParams, Link } from 'react-router-dom'
import { ProductCard } from '../components/molecules/ProductCard'
import { products, categories } from '../data'

function categoryToSlug(cat: string) {
  return cat.toLowerCase().replace(/\s+/g, '-')
}

export function CollectionPage() {
  const { handle } = useParams<{ handle: string }>()
  const isAll = !handle || handle === 'all'
  const displayProducts = isAll
    ? products
    : products.filter((p) => categoryToSlug(p.category) === handle)

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {isAll ? 'All Products' : (handle ?? 'Collection').replace(/-/g, ' ')}
        </h1>
        <p className="text-gray-600 mb-8">
          {isAll ? 'Browse our full selection of tactical gear and equipment.' : `Products in this category.`}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            to="/collections/all"
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              isAll ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All
          </Link>
          {categories.filter((c) => c !== 'All').map((category) => {
            const slug = category.toLowerCase().replace(/\s+/g, '-')
            return (
              <Link
                key={category}
                to={`/collections/${slug}`}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  !isAll && (handle === slug) ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </Link>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {displayProducts.length === 0 && (
          <p className="text-gray-500 text-center py-12">No products in this collection.</p>
        )}
      </div>
    </div>
  )
}
