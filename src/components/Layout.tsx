import { useState, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navigation } from '@/components/organisms/Navigation'
import { Cart } from '@/components/sections/Cart'
import { SEOMeta } from '@/components/seo/SEOMeta'
import { useScrollPosition, useCart } from '@/hooks'
import { seoOptimization } from '@/utils/seo'
import { companyInfo } from '@/data'

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isScrolled = useScrollPosition()
  const { getTotalItems } = useCart()
  const location = useLocation()

  // Generate SEO metadata based on current route
  const seoMetadata = useMemo(() => {
    const path = location.pathname
    
    // Extract page type from path
    if (path.startsWith('/products/')) {
      return seoOptimization.generatePageMetadata('product', { handle: path.replace('/products/', '') })
    } else if (path.startsWith('/collections/')) {
      return seoOptimization.generatePageMetadata('collection', { handle: path.replace('/collections/', '') })
    } else if (path.startsWith('/blog/')) {
      if (path === '/blog') {
        return seoOptimization.generatePageMetadata('blog')
      } else {
        return seoOptimization.generatePageMetadata('blog-post', { slug: path.replace('/blog/', '') })
      }
    } else if (path === '/' || path === '') {
      return seoOptimization.generatePageMetadata('home')
    } else if (path.includes('contact')) {
      return seoOptimization.generatePageMetadata('contact')
    } else {
      return seoOptimization.generatePageMetadata('home')
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Centralized SEO Management */}
      <SEOMeta {...seoMetadata} />
      
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isScrolled={isScrolled}
        cartItemsCount={getTotalItems()}
      />
      <main>
        <Outlet />
      </main>
      <Cart />

      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Email List</h2>
          <p className="text-red-100 mb-8">
            Get exclusive deals and early access to new products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-red-600 p-2 rounded-lg mr-3">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-lg">{companyInfo.name}</span>
              </div>
              <p className="text-sm">{companyInfo.tagline}</p>
              <p className="text-sm mt-2">Your trusted source for tactical gear and equipment.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/collections/all" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="/#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/collections/all" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="/collections/armor" className="hover:text-white transition-colors">Armor</a></li>
                <li><a href="/collections/armor-plates" className="hover:text-white transition-colors">Armor Plates</a></li>
                <li><a href="/collections/kit-accessories" className="hover:text-white transition-colors">Kit Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Policies</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://cross-currentprecisionarmory.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="https://cross-currentprecisionarmory.com/pages/data-sharing-opt-out" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Data Sharing Opt-Out</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 {companyInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
