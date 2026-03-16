import { useParams, Link } from 'react-router-dom'
import { ProductCard } from '@/components/molecules/ProductCard'
import { SearchBox } from '@/components/ui/SearchBox'
import { FilterPanel } from '@/components/ui/FilterPanel'
import { Recommendations } from '@/components/ui/Recommendations'
import { SEOMeta } from '@/components/seo/SEOMeta'
import { useSearch } from '@/hooks/useSearch'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { useShopifyCollection, useShopifyNavigation } from '@/hooks/useShopify'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { Category } from '@/types'

export function CollectionPage() {
  const { handle } = useParams<{ handle: string }>()
  const isAll = !handle || handle === 'all'

  // Get collection data from Shopify or fallback to static
  const { products, loading, error } = useShopifyCollection(isAll ? 'all' : handle || 'all')
  const { navigationItems } = useShopifyNavigation()

  const categories: Category[] = ['All', 'Body Armor', 'Plate Carriers', 'Equipment']
  
  // Use search hook with the products we got from Shopify/static
  const { query, setQuery, suggestions, filters, setFilter, resetFilters, resetAll, filteredProducts } =
    useSearch(products)

  const { viewedIds } = useRecentlyViewed()

  if (loading) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading collection...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage 
            title="Collection Error" 
            message={error}
            action={() => window.location.reload()}
            actionText="Try Again"
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOMeta
        title={isAll ? 'Products - Cross-Current Precision Armory' : `${(handle ?? 'Collection').replace(/-/g, ' ')} - Cross-Current Precision Armory`}
        description={isAll ? 'Browse our curated selection of tactical gear, body armor, and outdoor equipment.' : 'Browse products in this category.'}
        keywords={['tactical gear', 'body armor', 'outdoor equipment', 'survival gear', isAll ? 'products' : handle || 'collection']}
      />
      <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {isAll ? 'All Products' : (handle ?? 'Collection').replace(/-/g, ' ')}
        </h1>
        <p className="text-gray-600 mb-8">
          {isAll ? 'Browse our full selection of tactical gear and equipment.' : 'Products in this category.'}
        </p>

        {/* Category nav links */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {navigationItems.map((item) => {
            if (item.handle === 'all') return null // Skip "All" since we already have it
            return (
              <Link
                key={item.handle}
                to={item.url}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  !isAll && handle === item.handle ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {item.title}
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
    </>
  )
}
