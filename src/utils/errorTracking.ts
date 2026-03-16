// Error tracking and logging utility
// Captures unhandled errors, promise rejections, and component-level errors

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  extra?: Record<string, unknown>
}

export interface TrackedError {
  id: string
  message: string
  stack?: string
  type: 'error' | 'unhandledRejection' | 'componentError' | 'manual'
  context?: ErrorContext
  timestamp: number
  url: string
  userAgent: string
}

type ErrorListener = (error: TrackedError) => void

const listeners: ErrorListener[] = []
const errorLog: TrackedError[] = []
const MAX_ERROR_LOG = 50

let errorIdCounter = 0

function createTrackedError(
  message: string,
  stack: string | undefined,
  type: TrackedError['type'],
  context?: ErrorContext
): TrackedError {
  errorIdCounter += 1
  return {
    id: String(errorIdCounter),
    message,
    stack,
    type,
    context,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  }
}

function record(tracked: TrackedError) {
  errorLog.unshift(tracked)
  if (errorLog.length > MAX_ERROR_LOG) errorLog.splice(MAX_ERROR_LOG)
  listeners.forEach(fn => fn(tracked))

  if (import.meta.env.DEV) {
    console.error(`[ErrorTracking] ${tracked.type}:`, tracked.message, tracked.context ?? '')
  }
}

export const errorTracking = {
  /** Manually track an error with optional context */
  trackError(error: Error | string, context?: ErrorContext) {
    const message = error instanceof Error ? error.message : error
    const stack = error instanceof Error ? error.stack : undefined
    record(createTrackedError(message, stack, 'manual', context))
  },

  /** Track a user action for debugging; non-blocking */
  trackUserAction(action: string, properties?: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      console.log(`[UserAction] ${action}`, properties ?? '')
    }
  },

  /** Subscribe to error events (returns unsubscribe fn) */
  onError(listener: ErrorListener): () => void {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx !== -1) listeners.splice(idx, 1)
    }
  },

  /** Get all tracked errors (newest first) */
  getErrors(): TrackedError[] {
    return [...errorLog]
  },

  /** Clear the in-memory error log */
  clearErrors() {
    errorLog.splice(0)
  },

  /** Install global window error + unhandledrejection handlers */
  init() {
    if (typeof window === 'undefined') return

    window.addEventListener('error', (event) => {
      record(
        createTrackedError(
          event.message,
          event.error instanceof Error ? event.error.stack : undefined,
          'error'
        )
      )
    })

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
          ? reason
          : 'Unhandled promise rejection'
      const stack = reason instanceof Error ? reason.stack : undefined
      record(createTrackedError(message, stack, 'unhandledRejection'))
    })
  },
}
