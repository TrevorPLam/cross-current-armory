import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { analytics } from '../analytics/tracking'
import type { ConversionEvent } from '../analytics/tracking'

/**
 * useAnalytics — convenience hook that wraps the analytics tracker.
 * Provides page-context-aware helpers pre-filled with the current path.
 */
export function useAnalytics() {
  const location = useLocation()

  const trackPageView = useCallback(
    (title?: string) => {
      analytics.trackPageView(location.pathname, title)
    },
    [location.pathname]
  )

  const trackProductView = useCallback(
    (productId: string, productName: string, price?: number, category?: string) => {
      analytics.trackProductView(productId, productName, price, category)
    },
    []
  )

  const trackAddToCart = useCallback(
    (productId: string, productName: string, price: number, quantity: number) => {
      analytics.trackAddToCart(productId, productName, price, quantity)
    },
    []
  )

  const trackRemoveFromCart = useCallback(
    (productId: string, productName: string) => {
      analytics.trackRemoveFromCart(productId, productName)
    },
    []
  )

  const trackCheckoutStep = useCallback(
    (step: 'cart' | 'shipping' | 'payment' | 'complete', orderTotal?: number) => {
      analytics.trackCheckoutStep(step, orderTotal)
    },
    []
  )

  const trackConversion = useCallback((conversion: ConversionEvent) => {
    analytics.trackConversion(conversion)
  }, [])

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    analytics.trackSearch(query, resultsCount)
  }, [])

  const trackFilterApply = useCallback((filters: Record<string, unknown>) => {
    analytics.trackFilterApply(filters)
  }, [])

  const trackContactFormSubmit = useCallback((success: boolean) => {
    analytics.trackContactFormSubmit(success)
  }, [])

  const track = useCallback(
    (name: string, properties?: Record<string, unknown>) => {
      analytics.track(name, properties)
    },
    []
  )

  return {
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckoutStep,
    trackConversion,
    trackSearch,
    trackFilterApply,
    trackContactFormSubmit,
    track,
  }
}
