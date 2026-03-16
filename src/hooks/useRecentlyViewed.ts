import { useState, useEffect, useCallback } from 'react'
import type { Product } from '../types'

const STORAGE_KEY = 'recentlyViewed'
const MAX_ITEMS = 10

export function useRecentlyViewed() {
  // Lazy initializer reads localStorage once on mount — avoids set-state-in-effect
  const [viewedIds, setViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as string[]) : []
    } catch {
      return []
    }
  })

  // Persist whenever list changes
  useEffect(() => {
    if (viewedIds.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedIds))
    }
  }, [viewedIds])

  const addToViewed = useCallback((productId: string) => {
    setViewedIds(prev => {
      const deduped = [productId, ...prev.filter(id => id !== productId)]
      return deduped.slice(0, MAX_ITEMS)
    })
  }, [])

  const clearViewed = useCallback(() => {
    setViewedIds([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getViewedProducts = useCallback(
    (allProducts: Product[]): Product[] => {
      return viewedIds
        .map(id => allProducts.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined)
    },
    [viewedIds]
  )

  return { viewedIds, addToViewed, clearViewed, getViewedProducts }
}
