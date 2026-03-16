// Error tracking and logging system with Sentry integration
// Provides comprehensive error monitoring, user feedback, and debugging capabilities

import * as Sentry from '@sentry/react'
import { analytics } from '../analytics/tracking'

// Error tracking configuration
const ERROR_CONFIG = {
  DSN: import.meta.env.VITE_SENTRY_DSN || '',
  ENVIRONMENT: import.meta.env.MODE,
  RELEASE: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENABLED: import.meta.env.PROD || import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
  SAMPLE_RATE: import.meta.env.PROD ? 0.1 : 1.0, // 10% error sampling in production
  TRACES_SAMPLE_RATE: import.meta.env.PROD ? 0.05 : 1.0 // 5% performance tracing in production
}

// Error context interface
export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  sessionId?: string
  route?: string
  userAgent?: string
  timestamp: number
  additionalData?: Record<string, any>
}

// Error severity levels
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info' | 'debug'

// Custom error classes for better categorization
export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: ErrorSeverity = 'error',
    public context?: Partial<ErrorContext>
  ) {
    super(message)
    this.name = 'ApplicationError'
  }
}

export class NetworkError extends ApplicationError {
  constructor(
    message: string,
    public statusCode?: number,
    public url?: string,
    context?: Partial<ErrorContext>
  ) {
    super(message, 'NETWORK_ERROR', 'error', context)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends ApplicationError {
  constructor(
    message: string,
    public field: string,
    public value?: any,
    context?: Partial<ErrorContext>
  ) {
    super(message, 'VALIDATION_ERROR', 'warning', context)
    this.name = 'ValidationError'
  }
}

// Initialize Sentry
export const initializeErrorTracking = () => {
  if (!ERROR_CONFIG.ENABLED || !ERROR_CONFIG.DSN) {
    console.warn('Error tracking disabled or Sentry DSN not configured')
    return
  }

  Sentry.init({
    dsn: ERROR_CONFIG.DSN,
    environment: ERROR_CONFIG.ENVIRONMENT,
    release: ERROR_CONFIG.RELEASE,
    
    // Performance monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        sessionSampleRate: 0.1, // 10% of sessions
        errorSampleRate: 1.0, // 100% of errors
      }),
      Sentry.feedbackIntegration({
        colorScheme: 'system',
      })
    ],
    
    tracesSampleRate: ERROR_CONFIG.TRACES_SAMPLE_RATE,
    
    // Error sampling
    sampleRate: ERROR_CONFIG.SAMPLE_RATE,
    
    // Before sending error, add custom context
    beforeSend: (event, hint) => {
      const error = hint?.originalException
      
      // Filter out certain errors in production
      if (import.meta.env.PROD) {
        // Don't send network errors that are expected
        if (error instanceof NetworkError && error.statusCode && error.statusCode < 500) {
          return null
        }
        
        // Don't send validation errors
        if (error instanceof ValidationError) {
          return null
        }
      }
      
      // Add custom context
      event.contexts = {
        ...event.contexts,
        app: {
          name: 'Cross-Current Precision Armory',
          version: ERROR_CONFIG.RELEASE,
          environment: ERROR_CONFIG.ENVIRONMENT
        },
        user: {
          id: getCurrentUserId(),
          session_id: getCurrentSessionId()
        }
      }
      
      // Track error in analytics
      analytics.track({
        name: 'error_occurred',
        properties: {
          errorType: error?.name || 'Unknown',
          errorMessage: error?.message || 'Unknown error',
          severity: getErrorSeverity(error),
          page: window.location.pathname
        }
      })
      
      return event
    }
  })

  console.log('Sentry error tracking initialized')
}

// Get current user ID from various sources
const getCurrentUserId = (): string | undefined => {
  return localStorage.getItem('analytics_user_id') || 
         sessionStorage.getItem('user_id') || 
         undefined
}

// Get current session ID
const getCurrentSessionId = (): string | undefined => {
  return sessionStorage.getItem('analytics_session') || 
         undefined
}

// Determine error severity for Sentry
const getErrorSeverity = (error?: any): string => {
  if (error instanceof ApplicationError) {
    return error.severity
  }
  
  if (error instanceof Error) {
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return 'warning' // Chunk loading errors are common and not critical
    }
  }
  
  return 'error'
}

// Enhanced error tracking functions
export const errorTracking = {
  // Track custom errors with context
  trackError: (error: Error | ApplicationError, context?: Partial<ErrorContext>) => {
    const errorContext: ErrorContext = {
      component: context?.component || 'Unknown',
      action: context?.action || 'Unknown',
      userId: getCurrentUserId(),
      sessionId: getCurrentSessionId(),
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      additionalData: context?.additionalData
    }

    // Add context to error if it's an ApplicationError
    if (error instanceof ApplicationError) {
      error.context = { ...errorContext, ...context }
    }

    // Send to Sentry
    if (ERROR_CONFIG.ENABLED) {
      Sentry.withScope((scope) => {
        scope.setTag('component', errorContext.component)
        scope.setTag('action', errorContext.action)
        scope.setTag('severity', error instanceof ApplicationError ? error.severity : 'error')
        scope.setContext('error_details', errorContext)
        
        if (errorContext.additionalData) {
          scope.setExtras(errorContext.additionalData)
        }
        
        Sentry.captureException(error)
      })
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.error('Tracked Error:', error, errorContext)
    }
  },

  // Track user actions for debugging
  trackUserAction: (action: string, properties?: Record<string, any>) => {
    const context = {
      action,
      userId: getCurrentUserId(),
      sessionId: getCurrentSessionId(),
      route: window.location.pathname,
      timestamp: Date.now(),
      properties
    }

    // Add breadcrumb to Sentry
    if (ERROR_CONFIG.ENABLED) {
      Sentry.addBreadcrumb({
        message: `User Action: ${action}`,
        category: 'user',
        level: 'info',
        data: context
      })
    }

    // Track in analytics
    analytics.track({
      name: 'user_action',
      properties: context
    })
  },

  // Track API errors
  trackApiError: (url: string, method: string, statusCode: number, responseText?: string, context?: Partial<ErrorContext>) => {
    const error = new NetworkError(
      `API Error: ${method} ${url} - ${statusCode}`,
      statusCode,
      url,
      context
    )

    this.trackError(error, {
      ...context,
      action: 'api_call',
      additionalData: {
        url,
        method,
        statusCode,
        responseText: responseText?.substring(0, 500) // Limit response text size
      }
    })
  },

  // Track validation errors
  trackValidationError: (field: string, value: any, message: string, context?: Partial<ErrorContext>) => {
    const error = new ValidationError(message, field, value, context)
    
    this.trackError(error, {
      ...context,
      action: 'validation',
      additionalData: {
        field,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      }
    })
  },

  // Track performance issues
  trackPerformanceIssue: (type: string, metric: number, threshold: number, context?: Partial<ErrorContext>) => {
    const message = `Performance Issue: ${type} (${metric}ms) exceeds threshold (${threshold}ms)`
    const error = new ApplicationError(message, 'PERFORMANCE_ISSUE', 'warning', context)
    
    this.trackError(error, {
      ...context,
      action: 'performance_monitoring',
      additionalData: {
        type,
        metric,
        threshold,
        exceededBy: metric - threshold
      }
    })
  },

  // Set user context for all future errors
  setUser: (user: { id: string; email?: string; name?: string }) => {
    if (ERROR_CONFIG.ENABLED) {
      Sentry.setUser(user)
    }
    
    // Store for error context
    localStorage.setItem('analytics_user_id', user.id)
    
    analytics.setUser({
      userId: user.id,
      email: user.email,
      sessionId: getCurrentSessionId()!,
      deviceType: 'desktop', // This should be determined dynamically
      browser: 'Unknown' // This should be determined dynamically
    })
  },

  // Clear user context
  clearUser: () => {
    if (ERROR_CONFIG.ENABLED) {
      Sentry.setUser(null)
    }
    
    localStorage.removeItem('analytics_user_id')
  },

  // Track feature usage
  trackFeatureUsage: (feature: string, properties?: Record<string, any>) => {
    this.trackUserAction(`feature_${feature}`, properties)
    
    analytics.track({
      name: 'feature_usage',
      properties: {
        feature,
        ...properties
      }
    })
  }
}

// Global error handlers
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    errorTracking.trackError(event.error || new Error(event.message), {
      component: 'GlobalErrorHandler',
      action: 'uncaught_error',
      additionalData: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    })
  })

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorTracking.trackError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        component: 'GlobalErrorHandler',
        action: 'unhandled_promise_rejection'
      }
    )
  })

  // Handle chunk loading errors (common in SPA)
  window.addEventListener('error', (event) => {
    if (event.message.includes('Loading chunk') || event.message.includes('ChunkLoadError')) {
      errorTracking.trackError(
        new ApplicationError(event.message, 'CHUNK_LOAD_ERROR', 'warning'),
        {
          component: 'GlobalErrorHandler',
          action: 'chunk_load_error'
        }
      )
    }
  }, true)
}

// React Error Boundary component
export const ErrorBoundary = Sentry.withErrorBoundary(({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}, {
  fallback: ({ error, resetError }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Our team has been notified.
        </p>
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Home
          </button>
        </div>
        {import.meta.env.DEV && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">Error Details (Dev Only)</summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
              {error?.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
})

export default errorTracking
