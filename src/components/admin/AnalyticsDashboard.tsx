// Comprehensive Analytics Dashboard with Data Visualization
// Displays user behavior, conversion metrics, and business analytics

import React, { useState, useEffect } from 'react'
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { 
  Users, ShoppingCart, TrendingUp, Eye, MousePointer, Clock,
  DollarSign, Target, Activity, AlertCircle, CheckCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react'

// Analytics data interfaces
interface UserMetrics {
  date: string
  visitors: number
  pageViews: number
  sessions: number
  bounceRate: number
  avgSessionDuration: number
  newUsers: number
  returningUsers: number
}

interface ConversionMetrics {
  date: string
  addToCart: number
  checkoutStarted: number
  purchases: number
  revenue: number
  conversionRate: number
  cartAbandonmentRate: number
}

interface TrafficMetrics {
  source: string
  visitors: number
  revenue: number
  conversionRate: number
  avgOrderValue: number
}

interface ProductMetrics {
  id: string
  name: string
  views: number
  addToCart: number
  purchases: number
  revenue: number
  conversionRate: number
}

interface BehaviorMetrics {
  category: string
  metric: string
  value: number
  benchmark: number
}

// Sample data generation (in real implementation, this would come from analytics API)
const generateSampleData = () => {
  const userMetrics: UserMetrics[] = []
  const conversionMetrics: ConversionMetrics[] = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString()
    
    userMetrics.push({
      date: dateStr,
      visitors: Math.floor(800 + Math.random() * 400),
      pageViews: Math.floor(2000 + Math.random() * 1000),
      sessions: Math.floor(600 + Math.random() * 300),
      bounceRate: 30 + Math.random() * 20,
      avgSessionDuration: 120 + Math.random() * 180,
      newUsers: Math.floor(400 + Math.random() * 200),
      returningUsers: Math.floor(200 + Math.random() * 150)
    })
    
    conversionMetrics.push({
      date: dateStr,
      addToCart: Math.floor(40 + Math.random() * 30),
      checkoutStarted: Math.floor(25 + Math.random() * 20),
      purchases: Math.floor(15 + Math.random() * 15),
      revenue: Math.floor(1500 + Math.random() * 2000),
      conversionRate: 2 + Math.random() * 3,
      cartAbandonmentRate: 35 + Math.random() * 20
    })
  }
  
  const trafficMetrics: TrafficMetrics[] = [
    { source: 'Organic Search', visitors: 1250, revenue: 8500, conversionRate: 3.2, avgOrderValue: 212 },
    { source: 'Direct', visitors: 890, revenue: 6200, conversionRate: 4.1, avgOrderValue: 169 },
    { source: 'Social Media', visitors: 450, revenue: 2800, conversionRate: 2.8, avgOrderValue: 222 },
    { source: 'Email', visitors: 320, revenue: 4100, conversionRate: 5.5, avgOrderValue: 233 },
    { source: 'Referral', visitors: 180, revenue: 1200, conversionRate: 2.1, avgOrderValue: 317 }
  ]
  
  const productMetrics: ProductMetrics[] = [
    { id: '1', name: 'Level III Body Armor', views: 450, addToCart: 78, purchases: 32, revenue: 12800, conversionRate: 7.1 },
    { id: '2', name: 'Plate Carrier', views: 380, addToCart: 65, purchases: 28, revenue: 8400, conversionRate: 7.4 },
    { id: '3', name: 'Tactical Helmet', views: 290, addToCart: 42, purchases: 15, revenue: 4500, conversionRate: 5.2 },
    { id: '4', name: 'Armor Plates', views: 220, addToCart: 35, purchases: 18, revenue: 7200, conversionRate: 8.2 },
    { id: '5', name: 'Tactical Vest', views: 180, addToCart: 28, purchases: 12, revenue: 3600, conversionRate: 6.7 }
  ]
  
  const behaviorMetrics: BehaviorMetrics[] = [
    { category: 'Engagement', metric: 'Avg Session Duration', value: 180, benchmark: 150 },
    { category: 'Engagement', metric: 'Pages per Session', value: 3.2, benchmark: 2.8 },
    { category: 'Engagement', metric: 'Scroll Depth', value: 65, benchmark: 60 },
    { category: 'Conversion', metric: 'Add to Cart Rate', value: 4.8, benchmark: 4.2 },
    { category: 'Conversion', metric: 'Checkout Rate', value: 3.1, benchmark: 2.8 },
    { category: 'Conversion', metric: 'Purchase Rate', value: 2.4, benchmark: 2.2 }
  ]
  
  return { userMetrics, conversionMetrics, trafficMetrics, productMetrics, behaviorMetrics }
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<ReturnType<typeof generateSampleData> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'conversions' | 'products' | 'behavior'>('overview')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setData(generateSampleData())
      setIsLoading(false)
    }
    
    fetchData()
  }, [timeRange])

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  // Calculate KPIs
  const totalVisitors = data.userMetrics.reduce((sum, day) => sum + day.visitors, 0)
  const totalRevenue = data.conversionMetrics.reduce((sum, day) => sum + day.revenue, 0)
  const totalPurchases = data.conversionMetrics.reduce((sum, day) => sum + day.purchases, 0)
  const avgConversionRate = data.conversionMetrics.reduce((sum, day) => sum + day.conversionRate, 0) / data.conversionMetrics.length

  // Traffic source colors
  const trafficColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitor your business performance and user behavior</p>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'traffic', label: 'Traffic', icon: Users },
              { id: 'conversions', label: 'Conversions', icon: ShoppingCart },
              { id: 'products', label: 'Products', icon: Target },
              { id: 'behavior', label: 'Behavior', icon: Eye }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Visitors</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+18.2%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${(totalRevenue / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 text-red-600" />
              <span className="text-sm text-green-600 font-medium">+8.7%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalPurchases}</div>
            <div className="text-sm text-gray-600">Total Purchases</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-600" />
              <span className="text-sm text-green-600 font-medium">+2.3%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{avgConversionRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Visitor Trends */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Visitor Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.userMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="visitors" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                  <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#10b981" fill="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Conversion Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { stage: 'Visitors', value: totalVisitors },
                    { stage: 'Add to Cart', value: data.conversionMetrics.reduce((sum, day) => sum + day.addToCart, 0) },
                    { stage: 'Checkout', value: data.conversionMetrics.reduce((sum, day) => sum + day.checkoutStarted, 0) },
                    { stage: 'Purchase', value: totalPurchases }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.trafficMetrics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, visitors }) => `${source}: ${visitors}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                    >
                      {data.trafficMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={trafficColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Traffic Tab */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources Performance</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.trafficMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visitors" fill="#3b82f6" />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Conversions Tab */}
        {activeTab === 'conversions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.conversionMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="purchases" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="addToCart" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Performance</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.productMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#3b82f6" />
                  <Bar dataKey="addToCart" fill="#f59e0b" />
                  <Bar dataKey="purchases" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Behavior Tab */}
        {activeTab === 'behavior' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Behavior Metrics</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={data.behaviorMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Radar name="Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsDashboard
