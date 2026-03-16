import { Hero } from '../components/organisms/Hero'
import { Features } from '../components/organisms/Features'
import { ProductCard } from '../components/molecules/ProductCard'
import { ContactForm } from '../components/ui/ContactForm'
import { TrustBadges } from '../components/ui/TrustBadges'
import { Testimonials } from '../components/sections/Testimonials'
import { Media } from '../components/sections/Media'
import { FAQ } from '../components/sections/FAQ'
import { Education } from '../components/sections/Education'
import { Gallery } from '../components/ugc/Gallery'
import { LiveCounter } from '../components/ui/LiveCounter'
import { ReviewSystem } from '../components/ui/ReviewSystem'
import { SearchBox } from '../components/ui/SearchBox'
import { useSearch } from '../hooks/useSearch'
import { products, categories, companyInfo } from '../data'

export function HomePage() {
  const { query, setQuery, suggestions, filters, setFilter, resetAll, filteredProducts } = useSearch(products)

  return (
    <>
      <Hero />
      <Features />

      {/* Live activity counter */}
      <section className="py-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LiveCounter showStats={true} showNotifications={true} />
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Testimonials featured={3} showResults={true} />
        </div>
      </section>

      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our curated selection of tactical gear, body armor, and outdoor equipment
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter('category', category === 'All' ? undefined : category)}
                className={`px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
                  (filters.category ?? 'All') === category
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="max-w-md mx-auto mb-8">
            <SearchBox
              query={query}
              onQueryChange={setQuery}
              suggestions={suggestions}
              placeholder="Search products..."
            />
          </div>

          <div className="mb-8">
            <TrustBadges variant="compact" badges={['ssl', 'security', 'payment', 'shipping']} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button
                onClick={resetAll}
                className="mt-4 text-red-600 hover:text-red-700 font-semibold"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Reviews section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewSystem />
        </div>
      </section>

      {/* As Seen In */}
      <Media />

      {/* Tactical Gear Education */}
      <Education />

      {/* Customer Photo Gallery */}
      <Gallery limit={8} />

      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {companyInfo.story}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We appreciate your time and hope you find exactly what you're looking for with us.
                Enjoy your day and make everyday feel like its Friday if you can!!!
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-red-50 px-4 py-2 rounded-lg">
                  <svg className="h-6 w-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                  </svg>
                  <span className="font-semibold text-red-900">Vet Owned</span>
                </div>
                <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="font-semibold text-blue-900">Family Operated</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-96 rounded-lg flex items-center justify-center shadow-inner">
              <svg className="h-24 w-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions? Need help finding the right gear? Our expert team is here to help.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <ContactForm />
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Phone</h3>
                </div>
                <p className="text-gray-600">Call us for immediate assistance</p>
                <p className="text-red-600 font-semibold">{companyInfo.contact.phone}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Email</h3>
                </div>
                <p className="text-gray-600">Send us a message anytime</p>
                <p className="text-red-600 font-semibold">{companyInfo.contact.email}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Location</h3>
                </div>
                <p className="text-gray-600">Proudly serving customers nationwide</p>
                <p className="text-red-600 font-semibold">{companyInfo.contact.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
