import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CollectionPage } from './pages/CollectionPage'
import { ProductPage } from './pages/ProductPage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { coreWebVitals } from './utils/performance'
import { analytics } from './analytics/tracking'
import './App.css'

// Tracks page views on every route change
function PageViewTracker() {
  const location = useLocation()
  useEffect(() => {
    analytics.trackPageView(location.pathname)
  }, [location.pathname])
  return null
}

function App() {
  useEffect(() => {
    coreWebVitals.initWebVitalsMonitoring()
  }, [])

  return (
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="collections/:handle" element={<CollectionPage />} />
          <Route path="products/:handle" element={<ProductPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
