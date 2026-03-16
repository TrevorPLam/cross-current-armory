// Conversion tracking and funnel analysis
// Tracks page views, product interactions, cart events, and checkout steps

export type EventName =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'cart_open'
  | 'checkout_start'
  | 'checkout_step'
  | 'checkout_complete'
  | 'search'
  | 'filter_apply'
  | 'contact_form_submit'
  | string

export interface AnalyticsEvent {
  name: EventName
  properties?: Record<string, unknown>
  timestamp?: number
}

export interface ConversionEvent {
  value: number
  currency?: string
  productId?: string
  orderId?: string
}

export interface FunnelStep {
  step: string
  timestamp: number
  properties?: Record<string, unknown>
}

type EventListener = (event: AnalyticsEvent & { timestamp: number }) => void

const eventLog: Array<AnalyticsEvent & { timestamp: number }> = []
const funnelSessions: Record<string, FunnelStep[]> = {}
const listeners: EventListener[] = []
const MAX_EVENT_LOG = 200

// ─── Core tracking ───────────────────────────────────────────────────────────

function dispatch(name: EventName, properties?: Record<string, unknown>) {
  const event = { name, properties, timestamp: Date.now() }
  eventLog.unshift(event)
  if (eventLog.length > MAX_EVENT_LOG) eventLog.splice(MAX_EVENT_LOG)
  listeners.forEach(fn => fn(event))

  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${name}`, properties ?? '')
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const analytics = {
  /** Fire a generic analytics event */
  track(name: EventName, properties?: Record<string, unknown>) {
    dispatch(name, properties)
  },

  /** Track a page view */
  trackPageView(path: string, title?: string) {
    dispatch('page_view', { path, title: title ?? document.title })
  },

  /** Track a product detail view */
  trackProductView(productId: string, productName: string, price?: number, category?: string) {
    dispatch('product_view', { productId, productName, price, category })
  },

  /** Track add-to-cart */
  trackAddToCart(productId: string, productName: string, price: number, quantity: number) {
    dispatch('add_to_cart', { productId, productName, price, quantity, value: price * quantity })
  },

  /** Track remove-from-cart */
  trackRemoveFromCart(productId: string, productName: string) {
    dispatch('remove_from_cart', { productId, productName })
  },

  /** Track checkout funnel steps */
  trackCheckoutStep(step: 'cart' | 'shipping' | 'payment' | 'complete', orderTotal?: number) {
    dispatch('checkout_step', { step, orderTotal })
    analytics.recordFunnelStep('checkout', step, { orderTotal })
  },

  /** Track a conversion (purchase complete) */
  trackConversion(conversion: ConversionEvent) {
    dispatch('checkout_complete', {
      value: conversion.value,
      currency: conversion.currency ?? 'USD',
      productId: conversion.productId,
      orderId: conversion.orderId,
    })
  },

  /** Track a search query */
  trackSearch(query: string, resultsCount: number) {
    dispatch('search', { query, resultsCount })
  },

  /** Track filter application */
  trackFilterApply(filters: Record<string, unknown>) {
    dispatch('filter_apply', { filters })
  },

  /** Track contact form submission */
  trackContactFormSubmit(success: boolean) {
    dispatch('contact_form_submit', { success })
  },

  // ─── Funnel analysis ───────────────────────────────────────────────────────

  /** Record a step in a named funnel */
  recordFunnelStep(funnelName: string, step: string, properties?: Record<string, unknown>) {
    if (!funnelSessions[funnelName]) funnelSessions[funnelName] = []
    funnelSessions[funnelName].push({ step, timestamp: Date.now(), properties })
  },

  /** Get funnel steps for a named funnel */
  getFunnelSteps(funnelName: string): FunnelStep[] {
    return funnelSessions[funnelName] ? [...funnelSessions[funnelName]] : []
  },

  /** Reset a funnel session */
  resetFunnel(funnelName: string) {
    delete funnelSessions[funnelName]
  },

  // ─── Event log ─────────────────────────────────────────────────────────────

  /** Get all tracked events (newest first) */
  getEvents(): Array<AnalyticsEvent & { timestamp: number }> {
    return [...eventLog]
  },

  /** Subscribe to analytics events (returns unsubscribe fn) */
  onEvent(listener: EventListener): () => void {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx !== -1) listeners.splice(idx, 1)
    }
  },

  /** Clear in-memory event log */
  clearEvents() {
    eventLog.splice(0)
  },
}
