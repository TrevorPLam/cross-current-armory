import { useParams, Link } from 'react-router-dom'
import { ProductCard } from '../components/molecules/ProductCard'
import { SearchBox } from '../components/ui/SearchBox'
import { FilterPanel } from '../components/ui/FilterPanel'
import { Recommendations } from '../components/ui/Recommendations'
import { useSearch } from '../hooks/useSearch'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { products, categories } from '../data'

function categoryToSlug(cat: string) {
  return cat.toLowerCase().replace(/\s+/g, '-')
}

export function CollectionPage() {
  const { handle } = useParams<{ handle: string }>()
  const isAll = !handle || handle === 'all'

  // Pre-filter by URL handle so the filter panel starts in sync
  const baseProducts = isAll
    ? products
    : products.filter((p) => categoryToSlug(p.category) === handle)

  const { query, setQuery, suggestions, filters, setFilter, resetFilters, resetAll, filteredProducts } =
    useSearch(baseProducts)

  const { viewedIds } = useRecentlyViewed()

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {isAll ? 'All Products' : (handle ?? 'Collection').replace(/-/g, ' ')}
        </h1>
        <p className="text-gray-600 mb-8">
          {isAll ? 'Browse our full selection of tactical gear and equipment.' : 'Products in this category.'}
        </p>

        {/* Category nav links */}
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
                  !isAll && handle === slug ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </Link>
            )
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filter panel */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilter}
              onReset={resetFilters}
              categories={categories}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <SearchBox
                query={query}
                onQueryChange={setQuery}
                suggestions={suggestions}
                placeholder="Search products..."
              />
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
                <button
                  onClick={resetAll}
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recently viewed / recommendations */}
        {(viewedIds.length > 0 || filteredProducts.length > 0) && (
          <div className="mt-16">
            <Recommendations
              recentlyViewedIds={viewedIds}
              allProducts={products}
              maxItems={4}
            />
          </div>
        )}
      </div>
    </div>
  )
}
