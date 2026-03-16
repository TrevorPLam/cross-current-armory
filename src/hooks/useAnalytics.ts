// User behavior analytics hook for comprehensive interaction tracking
// Tracks scroll depth, time on page, form interactions, and user engagement patterns

import { useEffect, useRef, useState, useCallback } from 'react'
import { analytics, ecommerceAnalytics } from '../analytics/tracking'

export interface UserBehaviorMetrics {
  timeOnPage: number
  scrollDepth: number
  clicksCount: number
  formInteractions: number
  searchQueries: string[]
  productsViewed: string[]
  exitIntent: boolean
  idleTime: number
  engagementScore: number
}

export interface UseAnalyticsOptions {
  trackScrollDepth?: boolean
  trackClicks?: boolean
  trackFormInteractions?: boolean
  trackSearchQueries?: boolean
  trackProductViews?: boolean
  trackExitIntent?: boolean
  trackIdleTime?: boolean
  scrollDepthThresholds?: number[]
}

const DEFAULT_OPTIONS: UseAnalyticsOptions = {
  trackScrollDepth: true,
  trackClicks: true,
  trackFormInteractions: true,
  trackSearchQueries: true,
  trackProductViews: true,
  trackExitIntent: true,
  trackIdleTime: true,
  scrollDepthThresholds: [25, 50, 75, 90]
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  // State for tracking metrics
  const [metrics, setMetrics] = useState<UserBehaviorMetrics>({
    timeOnPage: 0,
    scrollDepth: 0,
    clicksCount: 0,
    formInteractions: 0,
    searchQueries: [],
    productsViewed: [],
    exitIntent: false,
    idleTime: 0,
    engagementScore: 0
  })

  // Refs for tracking
  const startTime = useRef(Date.now())
  const lastActiveTime = useRef(Date.now())
  const maxScrollDepth = useRef(0)
  const trackedScrollDepths = useRef(new Set<number>())
  const clickTargets = useRef(new Set<string>())
  const formFields = useRef(new Set<string>())
  const searchQueries = useRef<string[]>([])
  const productsViewed = useRef<string[]>([])
  const idleTimer = useRef<NodeJS.Timeout>()

  // Calculate engagement score based on user activity
  const calculateEngagementScore = useCallback(() => {
    const timeScore = Math.min(metrics.timeOnPage / 60000, 1) * 25 // Max 25 points for time (1 min)
    const scrollScore = (metrics.scrollDepth / 100) * 25 // Max 25 points for scrolling
    const clickScore = Math.min(metrics.clicksCount / 10, 1) * 25 // Max 25 points for clicks
    const interactionScore = Math.min(metrics.formInteractions / 5, 1) * 25 // Max 25 points for forms
    
    return timeScore + scrollScore + clickScore + interactionScore
  }, [metrics])

  // Track time on page
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now()
      const timeOnPage = currentTime - startTime.current
      const idleTime = currentTime - lastActiveTime.current
      
      setMetrics(prev => ({
        ...prev,
        timeOnPage,
        idleTime,
        engagementScore: calculateEngagementScore()
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [calculateEngagementScore])

  // Track scroll depth
  useEffect(() => {
    if (!opts.trackScrollDepth) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const scrollPercentage = Math.round((currentScroll / scrollHeight) * 100)
      
      maxScrollDepth.current = Math.max(maxScrollDepth.current, scrollPercentage)
      
      // Track scroll depth milestones
      opts.scrollDepthThresholds?.forEach(threshold => {
        if (scrollPercentage >= threshold && !trackedScrollDepths.current.has(threshold)) {
          trackedScrollDepths.current.add(threshold)
          
          analytics.track({
            name: 'scroll_depth',
            properties: {
              depth_percentage: threshold,
              page_path: window.location.pathname
            }
          })
        }
      })
      
      setMetrics(prev => ({
        ...prev,
        scrollDepth: maxScrollDepth.current,
        engagementScore: calculateEngagementScore()
      }))
      
      lastActiveTime.current = Date.now()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [opts.trackScrollDepth, opts.scrollDepthThresholds, calculateEngagementScore])

  // Track clicks
  useEffect(() => {
    if (!opts.trackClicks) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const targetInfo = {
        tagName: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 50),
        href: (target as HTMLAnchorElement).href,
        pagePath: window.location.pathname
      }
      
      const targetKey = `${target.tagName}-${target.className}-${target.id}`
      
      if (!clickTargets.current.has(targetKey)) {
        clickTargets.current.add(targetKey)
        
        analytics.track({
          name: 'click',
          properties: targetInfo
        })
      }
      
      setMetrics(prev => ({
        ...prev,
        clicksCount: prev.clicksCount + 1,
        engagementScore: calculateEngagementScore()
      }))
      
      lastActiveTime.current = Date.now()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [opts.trackClicks, calculateEngagementScore])

  // Track form interactions
  useEffect(() => {
    if (!opts.trackFormInteractions) return

    const handleFormFocus = (event: FocusEvent) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement
      if (target.form) {
        const fieldKey = `${target.form.id || 'unnamed'}-${target.name || target.type}`
        
        if (!formFields.current.has(fieldKey)) {
          formFields.current.add(fieldKey)
          
          analytics.track({
            name: 'form_interaction',
            properties: {
              form_id: target.form.id || 'unnamed',
              field_name: target.name || target.type,
              field_type: target.type,
              page_path: window.location.pathname
            }
          })
          
          setMetrics(prev => ({
            ...prev,
            formInteractions: prev.formInteractions + 1,
            engagementScore: calculateEngagementScore()
          }))
        }
        
        lastActiveTime.current = Date.now()
      }
    }

    document.addEventListener('focus', handleFormFocus, true)
    return () => document.removeEventListener('focus', handleFormFocus, true)
  }, [opts.trackFormInteractions, calculateEngagementScore])

  // Track search queries
  useEffect(() => {
    if (!opts.trackSearchQueries) return

    const handleSearch = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.type === 'search' || target.name?.toLowerCase().includes('search')) {
        const query = target.value.trim()
        
        if (query && query.length >= 2 && !searchQueries.current.includes(query)) {
          searchQueries.current.push(query)
          
          analytics.track({
            name: 'search_query',
            properties: {
              query,
              search_type: target.type === 'search' ? 'search_input' : 'named_field',
              page_path: window.location.pathname
            }
          })
          
          setMetrics(prev => ({
            ...prev,
            searchQueries: [...prev.searchQueries, query],
            engagementScore: calculateEngagementScore()
          }))
        }
        
        lastActiveTime.current = Date.now()
      }
    }

    // Handle search input changes
    const handleSearchInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.type === 'search' || target.name?.toLowerCase().includes('search')) {
        lastActiveTime.current = Date.now()
      }
    }

    document.addEventListener('change', handleSearch)
    document.addEventListener('input', handleSearchInput)
    
    return () => {
      document.removeEventListener('change', handleSearch)
      document.removeEventListener('input', handleSearchInput)
    }
  }, [opts.trackSearchQueries, calculateEngagementScore])

  // Track product views
  const trackProductView = useCallback((productId: string, productName: string, price: number, category: string) => {
    if (!opts.trackProductViews) return

    if (!productsViewed.current.includes(productId)) {
      productsViewed.current.push(productId)
      
      ecommerceAnalytics.productView({
        id: productId,
        name: productName,
        price,
        category
      })
      
      setMetrics(prev => ({
        ...prev,
        productsViewed: [...prev.productsViewed, productId],
        engagementScore: calculateEngagementScore()
      }))
      
      lastActiveTime.current = Date.now()
    }
  }, [opts.trackProductViews, calculateEngagementScore])

  // Track exit intent
  useEffect(() => {
    if (!opts.trackExitIntent) return

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0 && !metrics.exitIntent) {
        setMetrics(prev => ({
          ...prev,
          exitIntent: true
        }))
        
        analytics.track({
          name: 'exit_intent',
          properties: {
            page_path: window.location.pathname,
            time_on_page: metrics.timeOnPage,
            scroll_depth: metrics.scrollDepth,
            engagement_score: metrics.engagementScore
          }
        })
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [opts.trackExitIntent, metrics])

  // Track idle time
  useEffect(() => {
    if (!opts.trackIdleTime) return

    const resetIdleTimer = () => {
      clearTimeout(idleTimer.current)
      lastActiveTime.current = Date.now()
      
      idleTimer.current = setTimeout(() => {
        analytics.track({
          name: 'user_idle',
          properties: {
            idle_duration: 30000, // 30 seconds
            page_path: window.location.pathname,
            time_on_page: metrics.timeOnPage
          }
        })
      }, 30000) // 30 seconds of inactivity
    }

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    activityEvents.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true)
    })

    resetIdleTimer() // Initialize timer

    return () => {
      clearTimeout(idleTimer.current)
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true)
      })
    }
  }, [opts.trackIdleTime, metrics.timeOnPage])

  // Track page unload
  useEffect(() => {
    const handleUnload = () => {
      analytics.track({
        name: 'page_unload',
        properties: {
          page_path: window.location.pathname,
          time_on_page: metrics.timeOnPage,
          scroll_depth: metrics.scrollDepth,
          clicks_count: metrics.clicksCount,
          form_interactions: metrics.formInteractions,
          engagement_score: metrics.engagementScore,
          exit_intent: metrics.exitIntent
        }
      })
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [metrics])

  // Manual tracking functions
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    analytics.track({
      name: eventName,
      properties: {
        ...properties,
        page_path: window.location.pathname,
        time_on_page: metrics.timeOnPage,
        engagement_score: metrics.engagementScore
      }
    })
    
    lastActiveTime.current = Date.now()
  }, [metrics])

  const trackConversion = useCallback((conversionType: string, value?: number, properties?: Record<string, any>) => {
    analytics.conversion({
      type: conversionType as any,
      value,
      properties: {
        ...properties,
        page_path: window.location.pathname,
        time_on_page: metrics.timeOnPage,
        engagement_score: metrics.engagementScore
      }
    })
    
    lastActiveTime.current = Date.now()
  }, [metrics])

  return {
    metrics,
    trackEvent,
    trackConversion,
    trackProductView,
    // Additional utility functions
    resetMetrics: () => {
      startTime.current = Date.now()
      lastActiveTime.current = Date.now()
      maxScrollDepth.current = 0
      trackedScrollDepths.current.clear()
      clickTargets.current.clear()
      formFields.current.clear()
      searchQueries.current = []
      productsViewed.current = []
      
      setMetrics({
        timeOnPage: 0,
        scrollDepth: 0,
        clicksCount: 0,
        formInteractions: 0,
        searchQueries: [],
        productsViewed: [],
        exitIntent: false,
        idleTime: 0,
        engagementScore: 0
      })
    }
  }
}
