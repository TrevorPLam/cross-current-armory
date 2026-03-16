// Performance Monitoring Dashboard Component
// Displays real-time performance metrics, Core Web Vitals, and system health

import React, { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Zap, Clock, Users, ShoppingCart } from 'lucide-react'

// Performance metrics interface
interface PerformanceMetrics {
  timestamp: number
  lcp: number
  inp: number
  cls: number
  fcp: number
  ttfb: number
  memoryUsage: number
  bundleSize: number
  requestCount: number
}

// Core Web Vitals thresholds
const CWV_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  INP: { good: 200, needsImprovement: 500 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 }
}

// Get status based on threshold
const getCWVStatus = (value: number, metric: keyof typeof CWV_THRESHOLDS): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = CWV_THRESHOLDS[metric]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}

// Get status color
const getStatusColor = (status: 'good' | 'needs-improvement' | 'poor') => {
  switch (status) {
    case 'good': return '#10b981'
    case 'needs-improvement': return '#f59e0b'
    case 'poor': return '#ef4444'
  }
}

export const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([])
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h')

  // Simulate fetching performance data
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true)
      
      // In a real implementation, this would fetch from your analytics API
      // For now, we'll generate sample data
      const sampleData: PerformanceMetrics[] = []
      const now = Date.now()
      
      for (let i = 0; i < 24; i++) {
        sampleData.push({
          timestamp: now - (23 - i) * 3600000, // Hourly data for 24 hours
          lcp: 1200 + Math.random() * 2000,
          inp: 50 + Math.random() * 300,
          cls: Math.random() * 0.3,
          fcp: 800 + Math.random() * 1500,
          ttfb: 200 + Math.random() * 800,
          memoryUsage: 30 + Math.random() * 40,
          bundleSize: 400000 + Math.random() * 200000,
          requestCount: 20 + Math.random() * 30
        })
      }
      
      setMetrics(sampleData)
      setCurrentMetrics(sampleData[sampleData.length - 1])
      setIsLoading(false)
    }

    fetchMetrics()
    
    // Set up real-time updates
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [timeRange])

  // Calculate averages and trends
  const calculateStats = (data: PerformanceMetrics[]) => {
    if (data.length === 0) return null
    
    const latest = data[data.length - 1]
    const previous = data[data.length - 2] || data[0]
    
    return {
      lcp: {
        current: latest.lcp,
        status: getCWVStatus(latest.lcp, 'LCP'),
        trend: latest.lcp > previous.lcp ? 'up' : 'down'
      },
      inp: {
        current: latest.inp,
        status: getCWVStatus(latest.inp, 'INP'),
        trend: latest.inp > previous.inp ? 'up' : 'down'
      },
      cls: {
        current: latest.cls,
        status: getCWVStatus(latest.cls, 'CLS'),
        trend: latest.cls > previous.cls ? 'up' : 'down'
      },
      fcp: {
        current: latest.fcp,
        status: getCWVStatus(latest.fcp, 'FCP'),
        trend: latest.fcp > previous.fcp ? 'up' : 'down'
      },
      ttfb: {
        current: latest.ttfb,
        status: getCWVStatus(latest.ttfb, 'TTFB'),
        trend: latest.ttfb > previous.ttfb ? 'up' : 'down'
      }
    }
  }

  const stats = calculateStats(metrics)

  // Prepare chart data
  const chartData = metrics.map(m => ({
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    LCP: Math.round(m.lcp),
    INP: Math.round(m.inp),
    CLS: Math.round(m.cls * 1000) / 1000,
    FCP: Math.round(m.fcp),
    TTFB: Math.round(m.ttfb)
  }))

  // CWV distribution data
  const cwvDistribution = [
    { name: 'Good', value: metrics.filter(m => getCWVStatus(m.lcp, 'LCP') === 'good').length, color: '#10b981' },
    { name: 'Needs Improvement', value: metrics.filter(m => getCWVStatus(m.lcp, 'LCP') === 'needs-improvement').length, color: '#f59e0b' },
    { name: 'Poor', value: metrics.filter(m => getCWVStatus(m.lcp, 'LCP') === 'poor').length, color: '#ef4444' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your application's performance and user experience metrics</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          {(['1h', '24h', '7d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range === '1h' ? 'Last Hour' : range === '24h' ? 'Last 24 Hours' : 'Last 7 Days'}
            </button>
          ))}
        </div>

        {/* Core Web Vitals Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {Object.entries(stats).map(([metric, data]) => (
              <div key={metric} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{metric}</h3>
                  {data.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric === 'CLS' ? data.current.toFixed(3) : Math.round(data.current)}
                  {metric !== 'CLS' && 'ms'}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(data.status) }}
                  />
                  <span className="text-sm text-gray-600 capitalize">
                    {data.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="LCP" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="INP" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="FCP" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="TTFB" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* CWV Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">LCP Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cwvDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cwvDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Memory Usage */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Memory Usage</h2>
            </div>
            {currentMetrics && (
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {Math.round(currentMetrics.memoryUsage)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${currentMetrics.memoryUsage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {currentMetrics.memoryUsage > 80 ? 'High memory usage detected' : 'Memory usage is normal'}
                </p>
              </div>
            )}
          </div>

          {/* Bundle Size */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Bundle Size</h2>
            </div>
            {currentMetrics && (
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {(currentMetrics.bundleSize / 1000000).toFixed(2)} MB
                </div>
                <p className="text-sm text-gray-600">
                  {currentMetrics.bundleSize > 1500000 ? 'Bundle exceeds recommended size' : 'Bundle size is optimal'}
                </p>
              </div>
            )}
          </div>

          {/* Request Count */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Request Count</h2>
            </div>
            {currentMetrics && (
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {Math.round(currentMetrics.requestCount)}
                </div>
                <p className="text-sm text-gray-600">
                  {currentMetrics.requestCount > 50 ? 'High number of requests' : 'Request count is normal'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Performance Alerts</h2>
          </div>
          <div className="space-y-3">
            {stats && Object.entries(stats).map(([metric, data]) => (
              data.status === 'poor' && (
                <div key={metric} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      {metric} is performing poorly
                    </p>
                    <p className="text-xs text-red-700">
                      Current value: {metric === 'CLS' ? data.current.toFixed(3) : Math.round(data.current)}
                      {metric !== 'CLS' && 'ms'}
                    </p>
                  </div>
                </div>
              )
            ))}
            {stats && Object.values(stats).every(data => data.status !== 'poor') && (
              <p className="text-sm text-gray-600">No performance alerts. All metrics are performing well!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
