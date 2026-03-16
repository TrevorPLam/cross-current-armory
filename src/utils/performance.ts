// Performance optimization utilities for 2026 best practices
import { onCLS, onLCP, onFCP, onTTFB, onINP } from 'web-vitals'
import { analytics } from '../analytics/tracking'

// Extend Window interface for web vitals
declare global {
  interface Window {
    webVitals?: Record<string, {
      value: number
      rating: string
      timestamp: number
    }>
  }
}

export const performanceOptimizations = {
  // Lazy load images for better LCP
  lazyLoadImage: (src: string, alt: string) => {
    const img = new Image()
    img.src = src
    img.alt = alt
    img.loading = 'lazy'
    return img
  },

  // Debounce search for better INP
  debounce: <T extends (...args: unknown[]) => unknown>(func: T, delay: number) => {
    let timeoutId: number
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay) as unknown as number
    }
  },

  // Preload critical resources
  preloadCriticalResource: (href: string, as: string) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  },

  // Optimize images with WebP support
  getOptimizedImageUrl: (baseUrl: string, width: number) => {
    return `${baseUrl}?w=${width}&format=webp&quality=80`
  }
}

// Core Web Vitals monitoring with web-vitals library and attribution
export const coreWebVitals = {
  // Enhanced monitoring with web-vitals library and analytics integration
  initWebVitalsMonitoring: (onMetric?: (metric: any) => void) => {
    const handleMetric = (metric: any) => {
      // Log in development
      if (import.meta.env.DEV) {
        console.log(`${metric.name}:`, metric.value, metric.rating)
      }
      
      // Send to analytics with attribution data
      const metricData = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        page: window.location.pathname,
        timestamp: Date.now(),
        // Attribution data for debugging
        ...(metric.attribution && {
          element: metric.attribution.largestShiftTarget || // CLS
                 metric.attribution.interactionTarget || // INP
                 metric.attribution.element, // LCP
          url: metric.attribution.url,
          loadState: metric.attribution.loadState,
          navigationType: metric.attribution.navigationType
        })
      }
      
      // Track performance metric in analytics
      analytics.track({
        name: `performance_${metric.name.toLowerCase()}`,
        properties: metricData
      })
      
      // Custom handler
      onMetric?.(metric)
      
      // Store for debugging
      if (typeof window !== 'undefined') {
        window.webVitals = window.webVitals || {}
        window.webVitals[metric.name] = {
          value: metric.value,
          rating: metric.rating,
          timestamp: Date.now()
        }
      }
    }

    // Monitor all Core Web Vitals with attribution
    import('web-vitals/attribution').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      onCLS(handleMetric)
      onINP(handleMetric)
      onLCP(handleMetric)
      onFCP(handleMetric)
      onTTFB(handleMetric)
    }).catch(() => {
      // Fallback to regular web-vitals if attribution not available
      onCLS(handleMetric)
      onINP(handleMetric)
      onLCP(handleMetric)
      onFCP(handleMetric)
      onTTFB(handleMetric)
    })
  },

  // Monitor LCP (Largest Contentful Paint) - legacy method
  observeLCP: () => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      // Only log in development
      if (import.meta.env.DEV) {
        console.log('LCP:', lastEntry.startTime)
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] })
  },

  // Monitor INP (Interaction to Next Paint) - legacy method
  observeINP: () => {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Only log in development
        if (import.meta.env.DEV) {
          console.log('INP:', entry.duration)
        }
      }
    }).observe({ entryTypes: ['interaction-to-next-paint'] })
  },

  // Monitor CLS (Cumulative Layout Shift) - legacy method
  observeCLS: () => {
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value
        }
      }
      // Only log in development
      if (import.meta.env.DEV) {
        console.log('CLS:', clsValue)
      }
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Performance metrics interface
export interface PerformanceMetrics {
  LCP?: { value: number; rating: string; delta: number }
  CLS?: { value: number; rating: string; delta: number }
  FCP?: { value: number; rating: string; delta: number }
  TTFB?: { value: number; rating: string; delta: number }
  INP?: { value: number; rating: string; delta: number }
  [key: string]: { value: number; rating: string; delta: number } | undefined
}

// Performance monitoring hook utility
export const createPerformanceHook = () => {
  let metrics: PerformanceMetrics = {}
  
  const updateMetrics = (metric: any) => {
    metrics[metric.name] = {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta
    }
  }
  
  const getMetrics = () => metrics
  
  const initMonitoring = () => {
    coreWebVitals.initWebVitalsMonitoring(updateMetrics)
  }
  
  return { getMetrics, initMonitoring }
}

// Performance optimization strategies
export const performanceStrategies = {
  // Image optimization for better LCP
  optimizeImages: () => {
    // Add loading="lazy" to all images below the fold
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      })
    })
    
    images.forEach(img => imageObserver.observe(img))
  },
  
  // Preload critical resources
  preloadCriticalResources: () => {
    const criticalResources = [
      { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { href: '/hero-image.webp', as: 'image' }
    ]
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin
      document.head.appendChild(link)
    })
  },
  
  // Reduce JavaScript execution time for better INP
  optimizeJavaScript: () => {
    // Defer non-critical JavaScript
    const scripts = document.querySelectorAll('script[data-defer]')
    scripts.forEach(script => {
      const newScript = document.createElement('script')
      newScript.src = (script as HTMLScriptElement).src
      newScript.defer = true
      document.head.appendChild(newScript)
      script.remove()
    })
  }
}

// Performance monitoring for development
export const devPerformanceMonitoring = {
  // Log performance metrics in development
  logMetrics: () => {
    if (import.meta.env.DEV) {
      // Log navigation timing
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart, 'ms')
        console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms')
        
        // Track page load performance
        analytics.track({
          name: 'page_load_performance',
          properties: {
            loadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
          }
        })
      })
    }
  },
  
  // Monitor React render performance
  monitorReactPerformance: () => {
    if (import.meta.env.DEV) {
      // This would integrate with React DevTools Profiler
      console.log('React Performance Monitoring Active')
    }
  }
}

// Real User Monitoring (RUM) system
export const realUserMonitoring = {
  // Track resource loading performance
  trackResourceTiming: () => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    const slowResources = resources.filter(resource => 
      resource.duration > 1000 // Resources taking longer than 1 second
    )
    
    if (slowResources.length > 0) {
      analytics.track({
        name: 'slow_resources_detected',
        properties: {
          count: slowResources.length,
          resources: slowResources.map(r => ({
            name: r.name,
            duration: r.duration,
            size: r.transferSize,
            type: r.initiatorType
          }))
        }
      })
    }
  },
  
  // Track long tasks that affect INP
  trackLongTasks: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach(entry => {
          if (entry.duration > 50) { // Long tasks over 50ms
            analytics.track({
              name: 'long_task_detected',
              properties: {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              }
            })
          }
        })
      })
      
      try {
        observer.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        // Long task monitoring not supported
      }
    }
  },
  
  // Monitor memory usage
  trackMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      
      analytics.track({
        name: 'memory_usage',
        properties: {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        }
      })
    }
  },
  
  // Initialize all RUM tracking
  init: () => {
    // Track resources after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.trackResourceTiming()
        this.trackMemoryUsage()
      }, 1000)
    })
    
    this.trackLongTasks()
  }
}

// Performance budget monitoring
export const performanceBudget = {
  // Budget thresholds
  thresholds: {
    totalSize: 1500000, // 1.5MB total page size
    jsSize: 500000,    // 500KB JavaScript
    cssSize: 100000,    // 100KB CSS
    imageSize: 500000,  // 500KB images
    fontCount: 5,       // Maximum 5 fonts
    requestCount: 50    // Maximum 50 requests
  },
  
  // Check if performance budget is exceeded
  checkBudget: () => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    const metrics = {
      totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      jsSize: resources.filter(r => r.name.endsWith('.js')).reduce((sum, r) => sum + (r.transferSize || 0), 0),
      cssSize: resources.filter(r => r.name.endsWith('.css')).reduce((sum, r) => sum + (r.transferSize || 0), 0),
      imageSize: resources.filter(r => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(r.name)).reduce((sum, r) => sum + (r.transferSize || 0), 0),
      fontCount: resources.filter(r => r.name.endsWith('.woff') || r.name.endsWith('.woff2')).length,
      requestCount: resources.length
    }
    
    const violations = Object.entries(this.thresholds)
      .filter(([key, threshold]) => metrics[key as keyof typeof metrics] > threshold)
      .map(([key, threshold]) => ({
        metric: key,
        threshold,
        actual: metrics[key as keyof typeof metrics],
        exceeded: true
      }))
    
    if (violations.length > 0) {
      analytics.track({
        name: 'performance_budget_exceeded',
        properties: {
          violations,
          metrics
        }
      })
    }
    
    return { metrics, violations }
  }
}
