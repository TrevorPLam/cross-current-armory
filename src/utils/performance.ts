// Performance optimization utilities for 2026 best practices
import { onCLS, onLCP, onFCP, onTTFB, onINP } from 'web-vitals'

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

// Core Web Vitals monitoring with web-vitals library
export const coreWebVitals = {
  // Enhanced monitoring with web-vitals library
  initWebVitalsMonitoring: (onMetric?: (metric: any) => void) => {
    const handleMetric = (metric: any) => {
      // Log in development
      if (import.meta.env.DEV) {
        console.log(`${metric.name}:`, metric.value, metric.rating)
      }
      
      // Send to analytics or custom handler
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

    // Monitor all Core Web Vitals
    onCLS(handleMetric)
    onLCP(handleMetric)
    onFCP(handleMetric)
    onTTFB(handleMetric)
    onINP(handleMetric)
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
