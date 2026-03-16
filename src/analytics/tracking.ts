// Analytics tracking system for comprehensive user behavior and conversion tracking
// Supports Google Analytics 4, custom events, and privacy-compliant tracking

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void
    dataLayer?: any[]
  }
}

// Analytics event interfaces
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  value?: number
  currency?: string
}

export interface ConversionEvent extends AnalyticsEvent {
  type: 'purchase' | 'add_to_cart' | 'begin_checkout' | 'sign_up' | 'contact_form'
  userId?: string
  sessionId?: string
}

export interface PageViewEvent {
  path: string
  title: string
  referrer?: string
  userId?: string
  sessionId?: string
}

export interface UserProperties {
  userId?: string
  email?: string
  sessionId: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  browser: string
  source?: string
  medium?: string
  campaign?: string
}

// Analytics configuration
const ANALYTICS_CONFIG = {
  GA4_MEASUREMENT_ID: import.meta.env.VITE_GA4_MEASUREMENT_ID || '',
  TRACKING_ENABLED: import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  SAMPLE_RATE: import.meta.env.PROD ? 0.1 : 1.0, // 10% sampling in production
}

// Device and browser detection
const getDeviceInfo = () => {
  const ua = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua)
  
  return {
    deviceType: isMobile ? 'mobile' as const : isTablet ? 'tablet' as const : 'desktop' as const,
    browser: (() => {
      if (ua.includes('Chrome')) return 'Chrome'
      if (ua.includes('Firefox')) return 'Firefox'
      if (ua.includes('Safari')) return 'Safari'
      if (ua.includes('Edge')) return 'Edge'
      return 'Other'
    })()
  }
}

// Session management
let sessionId: string
let userId: string | null = null

const initializeSession = () => {
  // Check for existing session
  const storedSession = sessionStorage.getItem('analytics_session')
  const storedUserId = localStorage.getItem('analytics_user_id')
  
  if (storedSession) {
    sessionId = storedSession
  } else {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session', sessionId)
  }
  
  if (storedUserId) {
    userId = storedUserId
  }
}

// Google Analytics 4 initialization
export const initializeGA4 = () => {
  if (!ANALYTICS_CONFIG.TRACKING_ENABLED || !ANALYTICS_CONFIG.GA4_MEASUREMENT_ID) {
    console.warn('Analytics disabled or GA4 measurement ID not configured')
    return
  }

  // Load gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments)
  }
  
  window.gtag('js', new Date())
  window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually
    custom_map: {
      custom_parameter_1: 'user_id',
      custom_parameter_2: 'session_id'
    },
    anonymize_ip: true,
    cookie_flags: 'SameSite=Lax;Secure'
  })

  console.log('GA4 initialized with measurement ID:', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID)
}

// Core analytics functions
export const analytics = {
  // Track page views
  pageView: (event: PageViewEvent) => {
    if (!ANALYTICS_CONFIG.TRACKING_ENABLED) return

    const pageInfo = {
      page_path: event.path,
      page_title: event.title,
      page_referrer: event.referrer || document.referrer
    }

    // Send to GA4
    if (window.gtag) {
      window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, pageInfo)
    }

    // Send to custom endpoint for internal analytics
    if (Math.random() < ANALYTICS_CONFIG.SAMPLE_RATE) {
      sendToCustomEndpoint({
        type: 'page_view',
        data: {
          ...event,
          ...getDeviceInfo(),
          timestamp: Date.now()
        }
      })
    }

    console.log('Page view tracked:', event.path)
  },

  // Track custom events
  track: (event: AnalyticsEvent) => {
    if (!ANALYTICS_CONFIG.TRACKING_ENABLED) return

    const eventData = {
      event_name: event.name,
      event_properties: event.properties || {},
      value: event.value,
      currency: event.currency,
      ...getDeviceInfo(),
      timestamp: Date.now(),
      sessionId,
      userId
    }

    // Send to GA4
    if (window.gtag) {
      window.gtag('event', event.name, {
        ...event.properties,
        value: event.value,
        currency: event.currency,
        custom_parameter_1: userId,
        custom_parameter_2: sessionId
      })
    }

    // Send to custom endpoint
    if (Math.random() < ANALYTICS_CONFIG.SAMPLE_RATE) {
      sendToCustomEndpoint({
        type: 'event',
        data: eventData
      })
    }

    console.log('Event tracked:', event.name, event.properties)
  },

  // Track conversion events
  conversion: (event: ConversionEvent) => {
    if (!ANALYTICS_CONFIG.TRACKING_ENABLED) return

    const conversionData = {
      transaction_id: `${event.type}_${Date.now()}`,
      value: event.value || 0,
      currency: event.currency || 'USD',
      items: event.properties?.items || [],
      ...getDeviceInfo(),
      timestamp: Date.now(),
      sessionId,
      userId
    }

    // Send to GA4
    if (window.gtag) {
      window.gtag('event', event.type, {
        transaction_id: conversionData.transaction_id,
        value: event.value,
        currency: event.currency,
        items: event.properties?.items,
        custom_parameter_1: userId,
        custom_parameter_2: sessionId
      })
    }

    // Send to custom endpoint (always for conversions)
    sendToCustomEndpoint({
      type: 'conversion',
      data: conversionData
    })

    console.log('Conversion tracked:', event.type, event.value)
  },

  // Set user properties
  setUser: (userProperties: Partial<UserProperties>) => {
    if (!ANALYTICS_CONFIG.TRACKING_ENABLED) return

    if (userProperties.userId) {
      userId = userProperties.userId
      localStorage.setItem('analytics_user_id', userProperties.userId)
    }

    // Send to GA4
    if (window.gtag) {
      window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
        user_id: userProperties.userId,
        custom_parameter_1: userProperties.userId,
        custom_parameter_2: sessionId
      })
    }

    console.log('User properties set:', userProperties)
  }
}

// Send data to custom analytics endpoint
const sendToCustomEndpoint = async (payload: {
  type: 'page_view' | 'event' | 'conversion'
  data: any
}) => {
  try {
    // Use sendBeacon for reliable delivery on page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(payload))
    } else {
      // Fallback to fetch for regular events
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    }
  } catch (error) {
    console.warn('Failed to send analytics data:', error)
  }
}

// E-commerce specific tracking functions
export const ecommerceAnalytics = {
  // Track product views
  productView: (product: { id: string; name: string; price: number; category: string }) => {
    analytics.track({
      name: 'view_item',
      properties: {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category
      },
      value: product.price,
      currency: 'USD'
    })
  },

  // Track add to cart
  addToCart: (product: { id: string; name: string; price: number; quantity: number }) => {
    analytics.conversion({
      type: 'add_to_cart',
      value: product.price * product.quantity,
      currency: 'USD',
      properties: {
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity
        }]
      }
    })
  },

  // Track purchase
  purchase: (order: {
    orderId: string
    total: number
    items: Array<{
      id: string
      name: string
      price: number
      quantity: number
      category?: string
    }>
  }) => {
    analytics.conversion({
      type: 'purchase',
      value: order.total,
      currency: 'USD',
      properties: {
        transaction_id: order.orderId,
        items: order.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: item.category
        }))
      }
    })
  },

  // Track checkout initiation
  beginCheckout: (cart: {
    total: number
    items: Array<{
      id: string
      name: string
      price: number
      quantity: number
    }>
  }) => {
    analytics.conversion({
      type: 'begin_checkout',
      value: cart.total,
      currency: 'USD',
      properties: {
        items: cart.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      }
    })
  }
}

// Initialize analytics on module import
initializeSession()

export default analytics
