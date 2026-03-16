import { useState, useMemo, useCallback } from 'react'
import type { Product } from '../types'

export interface SearchFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStockOnly?: boolean
}

export function useSearch(products: Product[]) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})

  const suggestions = useMemo((): string[] => {
    if (query.trim().length < 2) return []
    const lower = query.toLowerCase()
    const nameMatches = products
      .filter(p => p.name.toLowerCase().includes(lower))
      .map(p => p.name)
    const categoryMatches = [...new Set(products.map(p => p.category))].filter(c =>
      c.toLowerCase().includes(lower)
    )
    return [...new Set([...nameMatches, ...categoryMatches])].slice(0, 6)
  }, [products, query])

  const filteredProducts = useMemo((): Product[] => {
    const lower = query.toLowerCase().trim()
    return products.filter(product => {
      // Text search
      const matchesQuery =
        lower.length === 0 ||
        product.name.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower) ||
        product.category.toLowerCase().includes(lower)

      if (!matchesQuery) return false

      // Category filter
      if (filters.category && filters.category !== 'All' && product.category !== filters.category)
        return false

      // Price range
      if (filters.minPrice !== undefined && product.price < filters.minPrice) return false
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false

      // Rating
      if (filters.minRating !== undefined && (product.rating ?? 0) < filters.minRating) return false

      // In-stock
      if (filters.inStockOnly && !product.inStock) return false

      return true
    })
  }, [products, query, filters])

  const setFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({})
  }, [])

  const resetAll = useCallback(() => {
    setQuery('')
    setFilters({})
  }, [])

  return {
    query,
    setQuery,
    suggestions,
    filters,
    setFilter,
    resetFilters,
    resetAll,
    filteredProducts,
  }
}
