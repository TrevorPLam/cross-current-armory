import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CollectionPage } from './pages/CollectionPage'
import { ProductPage } from './pages/ProductPage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { coreWebVitals } from './utils/performance'
import './App.css'

function App() {
  useEffect(() => {
    coreWebVitals.initWebVitalsMonitoring()
  }, [])

  return (
    <BrowserRouter>
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
