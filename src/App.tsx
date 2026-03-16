import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CollectionPage } from './pages/CollectionPage'
import { ProductPage } from './pages/ProductPage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { coreWebVitals, realUserMonitoring, performanceBudget } from './utils/performance'
import { initializeErrorTracking, setupGlobalErrorHandlers, ErrorBoundary } from './utils/errorTracking'
import { initializeGA4, analytics } from './analytics/tracking'
import { ABTestProvider } from './components/experiments/ABTest'
import './App.css'

function App() {
  useEffect(() => {
    // Initialize all monitoring and analytics systems
    const initializeSystems = async () => {
      try {
        // 1. Initialize error tracking first
        initializeErrorTracking()
        setupGlobalErrorHandlers()
        
        // 2. Initialize analytics
        initializeGA4()
        
        // 3. Initialize performance monitoring
        coreWebVitals.initWebVitalsMonitoring()
        realUserMonitoring.init()
        
        // 4. Track initial page view
        analytics.pageView({
          path: window.location.pathname,
          title: document.title,
          referrer: document.referrer
        })
        
        // 5. Check performance budget after page load
        window.addEventListener('load', () => {
          setTimeout(() => {
            performanceBudget.checkBudget()
          }, 2000)
        })
        
        console.log('Analytics and monitoring systems initialized')
      } catch (error) {
        console.error('Failed to initialize monitoring systems:', error)
      }
    }
    
    initializeSystems()
  }, [])

  return (
    <ErrorBoundary>
      <ABTestProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} handle={{ crumb: {} }} />
              <Route path="collections/:handle" element={<CollectionPage />} handle={{ crumb: {} }} />
              <Route path="products/:handle" element={<ProductPage />} handle={{ crumb: {} }} />
              <Route path="blog" element={<BlogPage />} handle={{ crumb: {} }} />
              <Route path="blog/:slug" element={<BlogPostPage />} handle={{ crumb: {} }} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ABTestProvider>
    </ErrorBoundary>
  )
}

export default App
