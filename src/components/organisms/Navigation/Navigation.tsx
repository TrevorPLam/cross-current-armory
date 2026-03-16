import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X, Search, ShoppingCart, User, ChevronDown } from 'lucide-react'
import { useCart } from '@/hooks'
import { useTouchGestures } from '@/hooks/useTouchGestures'
import { useShopifyNavigation } from '@/hooks/useShopify'
import { companyInfo } from '@/data'

interface NavigationProps {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  isScrolled: boolean
  cartItemsCount?: number
}

export function Navigation({ isMenuOpen, setIsMenuOpen, isScrolled, cartItemsCount = 0 }: NavigationProps) {
  const { setIsOpen } = useCart()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { swipeDirection } = useTouchGestures(mobileMenuRef, { threshold: 60, enabled: isMenuOpen })
  const { navigationItems } = useShopifyNavigation()

  // Swipe-left or swipe-up on the open mobile menu closes it
  useEffect(() => {
    if (swipeDirection === 'left' || swipeDirection === 'up') {
      setIsMenuOpen(false)
    }
  }, [swipeDirection, setIsMenuOpen])

  // Close dropdown when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isDropdownOpen])

  // Build navigation links with Shopify collections or fallback
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/collections/all', label: 'Products' },
    ...navigationItems.slice(0, 3).map(item => ({ to: item.url, label: item.title })), // Show first 3 collections
    { to: '/blog', label: 'Blog' },
    { to: '/#about', label: 'About' },
    { to: '/#contact', label: 'Contact' },
  ]

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-gray-900/95 backdrop-blur-sm'
      }`}
      role="navigation"
      aria-label="Primary navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-red-600 p-2 rounded-lg mr-3" aria-hidden="true">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl">{companyInfo.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
            >
              Home
            </Link>
            
            {/* Shop by Category Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
                aria-label="Shop by category"
                aria-expanded={isDropdownOpen}
              >
                Shop
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
                    role="menu"
                  >
                    <div className="py-2">
                      <Link
                        to="/collections/all"
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        All Products
                      </Link>
                      {navigationItems.slice(0, 4).map(item => (
                        <Link
                          key={item.handle}
                          to={item.url}
                          className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                          role="menuitem"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link
              to="/blog"
              className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
            >
              Blog
            </Link>
            <Link
              to="/#about"
              className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
            >
              About
            </Link>
            <Link
              to="/#contact"
              className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
            >
              Contact
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <a 
              href="https://cross-currentprecisionarmory.com/account"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="User account"
            >
              <User className="h-5 w-5" />
            </a>
            <button 
              onClick={() => setIsOpen(true)}
              className="relative text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label={`Shopping cart with ${cartItemsCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
                  aria-label={`${cartItemsCount} items in cart`}
                >
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={() => setIsOpen(true)}
              className="relative text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label={`Shopping cart with ${cartItemsCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
                  aria-label={`${cartItemsCount} items in cart`}
                >
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        ref={mobileMenuRef}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
        className="md:hidden bg-gray-800 overflow-hidden"
        role="menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:text-white focus:bg-gray-700"
            role="menuitem"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          
          {/* Mobile Categories */}
          <div className="border-t border-gray-700 pt-2 mt-2">
            <div className="px-3 py-2 text-gray-400 text-sm font-medium">Shop by Category</div>
            <Link
              to="/collections/all"
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:text-white focus:bg-gray-700"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            {navigationItems.slice(0, 4).map(item => (
              <Link
                key={item.handle}
                to={item.url}
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:text-white focus:bg-gray-700"
                role="menuitem"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
          
          <Link
            to="/blog"
            className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:text-white focus:bg-gray-700"
            role="menuitem"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            to="/#about"
            className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:text-white focus:bg-gray-700"
            role="menuitem"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/#contact"
            className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:text-white focus:bg-gray-700"
            role="menuitem"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <a
            href="https://cross-currentprecisionarmory.com/account"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:text-white focus:bg-gray-700"
            role="menuitem"
            onClick={() => setIsMenuOpen(false)}
          >
            Account
          </a>
        </div>
      </motion.div>
    </nav>
  )
}

export default Navigation
