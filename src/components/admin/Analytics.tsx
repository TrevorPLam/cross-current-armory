import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, ShoppingCart, Eye, Search, AlertTriangle, RefreshCw, X } from 'lucide-react'
import { analytics, type AnalyticsEvent } from '../../analytics/tracking'
import { errorTracking, type TrackedError } from '../../utils/errorTracking'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricCard {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countEvents(
  events: Array<AnalyticsEvent & { timestamp: number }>,
  name: string
): number {
  return events.filter(e => e.name === name).length
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function getEventColor(name: string): string {
  if (name.includes('cart')) return 'text-green-600'
  if (name.includes('checkout')) return 'text-blue-600'
  if (name.includes('search') || name.includes('filter')) return 'text-purple-600'
  if (name.includes('error')) return 'text-red-600'
  return 'text-gray-600'
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AnalyticsDashboardProps {
  /** When true, renders as an overlay panel; default false renders inline */
  overlay?: boolean
  onClose?: () => void
}

/**
 * AnalyticsDashboard — dev/admin panel showing live analytics events,
 * Core Web Vitals, and captured errors.
 *
 * Mount only in non-production builds or behind an admin auth check.
 */
export function AnalyticsDashboard({ overlay = false, onClose }: AnalyticsDashboardProps) {
  const [events, setEvents] = useState<Array<AnalyticsEvent & { timestamp: number }>>(
    () => analytics.getEvents()
  )
  const [errors, setErrors] = useState<TrackedError[]>(() => errorTracking.getErrors())
  const [vitals, setVitals] = useState<Record<string, { value: number; rating: string }>>(
    () => (typeof window !== 'undefined' && window.webVitals ? { ...window.webVitals } : {})
  )
  const [activeTab, setActiveTab] = useState<'events' | 'errors' | 'vitals'>('events')

  const refresh = useCallback(() => {
    setEvents(analytics.getEvents())
    setErrors(errorTracking.getErrors())
    if (typeof window !== 'undefined' && window.webVitals) {
      setVitals({ ...window.webVitals })
    }
  }, [])

  // Live updates via subscriptions; initial state seeded by lazy initializers below
  useEffect(() => {
    const unsubAnalytics = analytics.onEvent(() => {
      setEvents(analytics.getEvents())
    })
    const unsubErrors = errorTracking.onError(() => {
      setErrors(errorTracking.getErrors())
    })
    return () => {
      unsubAnalytics()
      unsubErrors()
    }
  }, [])

  // Metrics derived from events
  const metrics: MetricCard[] = [
    {
      label: 'Page Views',
      value: countEvents(events, 'page_view'),
      icon: Eye,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Add to Cart',
      value: countEvents(events, 'add_to_cart'),
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Searches',
      value: countEvents(events, 'search'),
      icon: Search,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Errors',
      value: errors.length,
      icon: AlertTriangle,
      color: errors.length > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500',
    },
  ]

  const ratingColor = (rating: string) =>
    rating === 'good'
      ? 'text-green-600'
      : rating === 'needs-improvement'
      ? 'text-yellow-600'
      : 'text-red-600'

  const panel = (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden w-full max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-red-400" />
          <h2 className="font-bold text-lg">Analytics Dashboard</h2>
          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full ml-1">DEV</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="p-1.5 rounded hover:bg-gray-700 transition-colors"
            aria-label="Refresh metrics"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-700 transition-colors"
              aria-label="Close dashboard"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border-b border-gray-100">
        {metrics.map(m => (
          <div key={m.label} className={`flex items-center gap-3 rounded-lg p-3 ${m.color}`}>
            <m.icon className="h-5 w-5 shrink-0" />
            <div>
              <div className="text-2xl font-bold leading-none">{m.value}</div>
              <div className="text-xs mt-0.5 opacity-80">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['events', 'errors', 'vitals'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
            {tab === 'errors' && errors.length > 0 && (
              <span className="ml-1.5 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full">
                {errors.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="overflow-y-auto max-h-72">
        {activeTab === 'events' && (
          <ul className="divide-y divide-gray-50">
            {events.length === 0 ? (
              <li className="px-5 py-6 text-center text-sm text-gray-400">No events yet.</li>
            ) : (
              events.map((e, i) => (
                <li key={i} className="flex items-start gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                  <span className={`text-xs font-mono mt-0.5 shrink-0 ${getEventColor(e.name)}`}>
                    {e.name}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto shrink-0">{formatTime(e.timestamp)}</span>
                  {e.properties && Object.keys(e.properties).length > 0 && (
                    <span className="text-xs text-gray-500 truncate max-w-xs">
                      {JSON.stringify(e.properties)}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        )}

        {activeTab === 'errors' && (
          <ul className="divide-y divide-gray-50">
            {errors.length === 0 ? (
              <li className="px-5 py-6 text-center text-sm text-gray-400">No errors captured.</li>
            ) : (
              errors.map((err, i) => (
                <li key={i} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">{err.type}</span>
                    <span className="text-xs text-gray-400 shrink-0">{formatTime(err.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-800 mt-0.5 line-clamp-2">{err.message}</p>
                  {err.context?.component && (
                    <p className="text-xs text-gray-500 mt-0.5">Component: {err.context.component}</p>
                  )}
                </li>
              ))
            )}
          </ul>
        )}

        {activeTab === 'vitals' && (
          <div className="p-5">
            {Object.keys(vitals).length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">
                Core Web Vitals will appear after first interaction / page load.
              </p>
            ) : (
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(vitals).map(([key, v]) => {
                  const isCLS = key === 'CLS'
                  return (
                    <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                      <dt className="text-xs text-gray-500 uppercase tracking-wide">{key}</dt>
                      <dd className={`text-2xl font-bold mt-1 ${ratingColor(v.rating)}`}>
                        {isCLS ? v.value.toFixed(3) : `${Math.round(v.value)}`}
                        <span className="text-sm font-normal ml-0.5">{isCLS ? '' : 'ms'}</span>
                      </dd>
                      <dd className={`text-xs capitalize mt-0.5 ${ratingColor(v.rating)}`}>{v.rating}</dd>
                    </div>
                  )
                })}
              </dl>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (overlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={e => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-3xl"
        >
          {panel}
        </motion.div>
      </motion.div>
    )
  }

  return panel
}
