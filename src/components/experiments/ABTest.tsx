// A/B Testing Framework for React Components
// Provides split testing capabilities with analytics integration and user segmentation

import React, { useState, useEffect, useCallback } from 'react'
import { analytics } from '@/analytics/tracking'

// A/B Test configuration interfaces
export interface ABTestConfig {
  id: string
  name: string
  description: string
  variants: ABTestVariant[]
  trafficSplit: number[] // Must sum to 1.0
  targeting?: {
    deviceTypes?: ('mobile' | 'tablet' | 'desktop')[]
    userSegments?: string[]
    customCriteria?: (user: ABTestUser) => boolean
  }
  startDate?: Date
  endDate?: Date
  sampleRate?: number // 0-1, percentage of users to include
}

export interface ABTestVariant {
  id: string
  name: string
  description: string
  weight: number // Traffic allocation
  component: React.ComponentType<any>
  props?: Record<string, any>
}

export interface ABTestUser {
  id: string
  sessionId: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  isNewUser: boolean
  customAttributes?: Record<string, any>
}

export interface ABTestResult {
  testId: string
  variantId: string
  userId: string
  sessionId: string
  timestamp: number
  converted: boolean
  conversionValue?: number
  metrics?: Record<string, number>
}

// A/B Test Provider Context
interface ABTestContextType {
  user: ABTestUser | null
  activeTests: Record<string, string> // testId -> variantId
  getVariant: (testId: string) => string | null
  trackConversion: (testId: string, conversionValue?: number, metrics?: Record<string, number>) => void
  forceVariant: (testId: string, variantId: string) => void
}

const ABTestContext = React.createContext<ABTestContextType | null>(null)

// A/B Test Provider Component
export const ABTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ABTestUser | null>(null)
  const [activeTests, setActiveTests] = useState<Record<string, string>>({})

  // Initialize user and load existing test assignments
  useEffect(() => {
    const initializeUser = () => {
      // Get or create user ID
      let userId = localStorage.getItem('ab_test_user_id')
      let isNewUser = !userId
      
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('ab_test_user_id', userId)
      }
      
      // Get session ID
      const sessionId = sessionStorage.getItem('analytics_session') || ''
      
      // Determine device type
      const ua = navigator.userAgent
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua)
      const deviceType = isMobile ? 'mobile' as const : isTablet ? 'tablet' as const : 'desktop' as const
      
      const userObj: ABTestUser = {
        id: userId,
        sessionId,
        deviceType,
        isNewUser,
        customAttributes: {}
      }
      
      setUser(userObj)
      
      // Load existing test assignments
      const savedTests = localStorage.getItem('ab_test_assignments')
      if (savedTests) {
        try {
          setActiveTests(JSON.parse(savedTests))
        } catch (error) {
          console.warn('Failed to load A/B test assignments:', error)
        }
      }
    }
    
    initializeUser()
  }, [])

  // Save test assignments to localStorage
  useEffect(() => {
    if (Object.keys(activeTests).length > 0) {
      localStorage.setItem('ab_test_assignments', JSON.stringify(activeTests))
    }
  }, [activeTests])

  // Get variant for a test
  const getVariant = useCallback((testId: string): string | null => {
    // Return existing assignment if available
    if (activeTests[testId]) {
      return activeTests[testId]
    }
    
    // Check if test exists and user is eligible
    const test = AB_TEST_REGISTRY[testId]
    if (!test || !user) {
      return null
    }
    
    // Check sample rate
    if (test.sampleRate && Math.random() > test.sampleRate) {
      return null
    }
    
    // Check targeting criteria
    if (test.targeting) {
      const { deviceTypes, userSegments, customCriteria } = test.targeting
      
      if (deviceTypes && !deviceTypes.includes(user.deviceType)) {
        return null
      }
      
      if (customCriteria && !customCriteria(user)) {
        return null
      }
    }
    
    // Check test dates
    const now = new Date()
    if (test.startDate && now < test.startDate) {
      return null
    }
    if (test.endDate && now > test.endDate) {
      return null
    }
    
    // Assign variant based on traffic split
    const random = Math.random()
    let cumulative = 0
    
    for (let i = 0; i < test.variants.length; i++) {
      cumulative += test.trafficSplit[i]
      if (random <= cumulative) {
        const variantId = test.variants[i].id
        
        // Save assignment
        setActiveTests(prev => ({ ...prev, [testId]: variantId }))
        
        // Track test assignment
        analytics.track({
          name: 'ab_test_assigned',
          properties: {
            testId,
            testName: test.name,
            variantId,
            variantName: test.variants[i].name,
            userId: user.id,
            sessionId: user.sessionId,
            deviceType: user.deviceType,
            isNewUser: user.isNewUser
          }
        })
        
        return variantId
      }
    }
    
    return null
  }, [activeTests, user])

  // Track conversion for a test
  const trackConversion = useCallback((
    testId: string, 
    conversionValue?: number, 
    metrics?: Record<string, number>
  ) => {
    const variantId = activeTests[testId]
    if (!variantId || !user) {
      return
    }
    
    const result: ABTestResult = {
      testId,
      variantId,
      userId: user.id,
      sessionId: user.sessionId,
      timestamp: Date.now(),
      converted: true,
      conversionValue,
      metrics
    }
    
    // Track conversion in analytics
    analytics.track({
      name: 'ab_test_conversion',
      properties: {
        testId,
        variantId,
        conversionValue,
        metrics,
        userId: user.id,
        sessionId: user.sessionId
      }
    })
    
    // Store conversion result (in real implementation, send to backend)
    const conversions = JSON.parse(localStorage.getItem('ab_test_conversions') || '[]')
    conversions.push(result)
    localStorage.setItem('ab_test_conversions', JSON.stringify(conversions))
  }, [activeTests, user])

  // Force a specific variant (for testing or admin overrides)
  const forceVariant = useCallback((testId: string, variantId: string) => {
    setActiveTests(prev => ({ ...prev, [testId]: variantId }))
    
    if (user) {
      analytics.track({
        name: 'ab_test_forced',
        properties: {
          testId,
          variantId,
          userId: user.id,
          sessionId: user.sessionId
        }
      })
    }
  }, [user])

  const contextValue: ABTestContextType = {
    user,
    activeTests,
    getVariant,
    trackConversion,
    forceVariant
  }

  return (
    <ABTestContext.Provider value={contextValue}>
      {children}
    </ABTestContext.Provider>
  )
}

// Hook to use A/B testing
export const useABTest = () => {
  const context = React.useContext(ABTestContext)
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider')
  }
  return context
}

// A/B Test Component
export const ABTest: React.FC<{
  testId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}> = ({ testId, children, fallback }) => {
  const { getVariant } = useABTest()
  const variantId = getVariant(testId)
  
  if (!variantId) {
    return <>{fallback || children}</>
  }
  
  // Find the variant component
  const test = AB_TEST_REGISTRY[testId]
  const variant = test?.variants.find(v => v.id === variantId)
  
  if (!variant || !variant.component) {
    return <>{fallback || children}</>
  }
  
  const VariantComponent = variant.component
  return <VariantComponent {...variant.props} />
}

// A/B Test Registry (in real implementation, this would come from a backend API)
const AB_TEST_REGISTRY: Record<string, ABTestConfig> = {}

// Register a new A/B test
export const registerABTest = (config: ABTestConfig) => {
  // Validate configuration
  if (!config.id || !config.variants || config.variants.length < 2) {
    throw new Error('Invalid A/B test configuration')
  }
  
  const totalWeight = config.trafficSplit.reduce((sum, weight) => sum + weight, 0)
  if (Math.abs(totalWeight - 1.0) > 0.001) {
    throw new Error('Traffic split must sum to 1.0')
  }
  
  AB_TEST_REGISTRY[config.id] = config
  
  // Track test registration
  analytics.track({
    name: 'ab_test_registered',
    properties: {
      testId: config.id,
      testName: config.name,
      variantCount: config.variants.length,
      sampleRate: config.sampleRate || 1.0
    }
  })
}

// Get all active tests
export const getActiveTests = (): ABTestConfig[] => {
  return Object.values(AB_TEST_REGISTRY).filter(test => {
    const now = new Date()
    const isActive = (!test.startDate || now >= test.startDate) &&
                    (!test.endDate || now <= test.endDate)
    return isActive
  })
}

// Get test results (in real implementation, this would fetch from backend API)
export const getTestResults = async (testId: string): Promise<{
  test: ABTestConfig
  results: ABTestResult[]
  stats: {
    totalParticipants: number
    conversions: number
    conversionRate: number
    variantStats: Record<string, {
      participants: number
      conversions: number
      conversionRate: number
      averageConversionValue?: number
    }>
  }
}> => {
  const test = AB_TEST_REGISTRY[testId]
  if (!test) {
    throw new Error('Test not found')
  }
  
  // In real implementation, fetch from backend
  const conversions = JSON.parse(localStorage.getItem('ab_test_conversions') || '[]')
  const testConversions = conversions.filter((c: ABTestResult) => c.testId === testId)
  
  // Calculate stats
  const variantStats: Record<string, any> = {}
  test.variants.forEach(variant => {
    const variantConversions = testConversions.filter((c: ABTestResult) => c.variantId === variant.id)
    const participants = Object.values(localStorage.getItem('ab_test_assignments') || '{}')
      .filter((assignment: any) => assignment[testId] === variant.id).length
    
    variantStats[variant.id] = {
      participants,
      conversions: variantConversions.length,
      conversionRate: participants > 0 ? variantConversions.length / participants : 0,
      averageConversionValue: variantConversions.length > 0
        ? variantConversions.reduce((sum: number, c: ABTestResult) => sum + (c.conversionValue || 0), 0) / variantConversions.length
        : undefined
    }
  })
  
  const totalParticipants = Object.values(variantStats).reduce((sum: number, stats: any) => sum + stats.participants, 0)
  const totalConversions = Object.values(variantStats).reduce((sum: number, stats: any) => sum + stats.conversions, 0)
  
  return {
    test,
    results: testConversions,
    stats: {
      totalParticipants,
      conversions: totalConversions,
      conversionRate: totalParticipants > 0 ? totalConversions / totalParticipants : 0,
      variantStats
    }
  }
}

// Example usage components
export const ABTestExample: React.FC = () => {
  // Register an example test
  useEffect(() => {
    registerABTest({
      id: 'button_color_test',
      name: 'Button Color Test',
      description: 'Test if red or green buttons get more clicks',
      variants: [
        {
          id: 'control',
          name: 'Red Button',
          description: 'Current red button design',
          weight: 0.5,
          component: ({ children, ...props }: any) => (
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors" {...props}>
              {children}
            </button>
          )
        },
        {
          id: 'variant',
          name: 'Green Button',
          description: 'New green button design',
          weight: 0.5,
          component: ({ children, ...props }: any) => (
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" {...props}>
              {children}
            </button>
          )
        }
      ],
      trafficSplit: [0.5, 0.5],
      sampleRate: 1.0
    })
  }, [])

  const { trackConversion } = useABTest()

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">A/B Test Example</h2>
      <ABTest testId="button_color_test" fallback={<button className="bg-gray-600 text-white px-6 py-3 rounded-lg">Default Button</button>}>
        <button onClick={() => trackConversion('button_color_test', 1)}>
          Click Me!
        </button>
      </ABTest>
    </div>
  )
}

export default ABTestProvider
