import { useState, useEffect } from 'react'
import type { Product } from '../types'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  addedAt: Date
}

export interface CheckoutState {
  step: 'cart' | 'shipping' | 'payment' | 'complete'
  isGuest: boolean
  customerInfo?: {
    email: string
    firstName: string
    lastName: string
    phone?: string
  }
  shippingAddress?: {
    address: string
    city: string
    state: string
    zip: string
  }
  paymentMethod?: string
  orderTotal: number
}

export function useScrollPosition(threshold = 20) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isScrolled
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'cart',
    isGuest: true,
    orderTotal: 0
  })
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        addedAt: new Date()
      }]
    })
    setIsOpen(true)
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const startGuestCheckout = () => {
    setCheckoutState(prev => ({
      ...prev,
      step: 'shipping',
      isGuest: true,
      orderTotal: getTotalPrice()
    }))
  }

  const updateCheckoutInfo = <K extends keyof CheckoutState>(
    field: K,
    value: CheckoutState[K]
  ) => {
    setCheckoutState(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    setCheckoutState(prev => {
      const steps: CheckoutState['step'][] = ['cart', 'shipping', 'payment', 'complete']
      const currentIndex = steps.indexOf(prev.step)
      const nextStep = steps[Math.min(currentIndex + 1, steps.length - 1)]
      return { ...prev, step: nextStep }
    })
  }

  const previousStep = () => {
    setCheckoutState(prev => {
      const steps: CheckoutState['step'][] = ['cart', 'shipping', 'payment', 'complete']
      const currentIndex = steps.indexOf(prev.step)
      const prevStep = steps[Math.max(currentIndex - 1, 0)]
      return { ...prev, step: prevStep }
    })
  }

  const resetCheckout = () => {
    setCheckoutState({
      step: 'cart',
      isGuest: true,
      orderTotal: 0
    })
  }

  return {
    cartItems,
    checkoutState,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    startGuestCheckout,
    updateCheckoutInfo,
    nextStep,
    previousStep,
    resetCheckout
  }
}

export function useProductFilter(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return { searchQuery, selectedCategory, filteredProducts, setSearchQuery, setSelectedCategory }
}
