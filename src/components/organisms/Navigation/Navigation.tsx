import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../../../hooks'
import { useTouchGestures } from '../../../hooks/useTouchGestures'
import { companyInfo } from '../../../data'

interface NavigationProps {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  isScrolled: boolean
  cartItemsCount?: number
}

export function Navigation({ isMenuOpen, setIsMenuOpen, isScrolled, cartItemsCount = 0 }: NavigationProps) {
  const { setIsOpen } = useCart()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { swipeDirection } = useTouchGestures(mobileMenuRef, { threshold: 60, enabled: isMenuOpen })

  // Swipe-left or swipe-up on the open mobile menu closes it
  useEffect(() => {
    if (swipeDirection === 'left' || swipeDirection === 'up') {
      setIsMenuOpen(false)
    }
  }, [swipeDirection, setIsMenuOpen])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/collections/all', label: 'Products' },
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
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button 
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="User account"
            >
              <User className="h-5 w-5" />
            </button>
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
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:text-white focus:bg-gray-700"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  )
}

export default Navigation
