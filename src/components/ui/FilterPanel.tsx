import { useState } from 'react'
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react'
import type { SearchFilters } from '../../hooks/useSearch'
import type { Category } from '../../types'

interface FilterPanelProps {
  filters: SearchFilters
  onFilterChange: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void
  onReset: () => void
  categories: Category[]
  className?: string
}

interface RangeSliderProps {
  label: string
  min: number
  max: number
  value: number | undefined
  onChange: (v: number | undefined) => void
  prefix?: string
}

function RangeSlider({ label, min, max, value, onChange, prefix = '' }: RangeSliderProps) {
  const current = value ?? max
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span className="font-medium text-gray-700">
          {(() => { const val = current === max ? `${max}+` : String(current); return `${prefix}${val}` })()}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={prefix === '$' ? 25 : 0.5}
        value={current}
        onChange={e => {
          const v = Number(e.target.value)
          onChange(v === max ? undefined : v)
        }}
        className="w-full accent-red-600"
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{prefix}{min}</span>
        <span>{prefix}{max}+</span>
      </div>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between py-3 text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors"
        aria-expanded={open}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
      </button>
      {open && <div className="space-y-2 mt-1">{children}</div>}
    </div>
  )
}

export function FilterPanel({ filters, onFilterChange, onReset, categories, className = '' }: FilterPanelProps) {
  const hasActiveFilters =
    (filters.category && filters.category !== 'All') ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined ||
    filters.inStockOnly

  return (
    <aside
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${className}`}
      aria-label="Product filters"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal className="h-4 w-4 text-red-600" aria-hidden="true" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
            aria-label="Clear all filters"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-1">
        {/* Category */}
        <FilterSection title="Category">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={(filters.category ?? 'All') === cat}
                onChange={() => onFilterChange('category', cat === 'All' ? undefined : cat)}
                className="accent-red-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors">{cat}</span>
            </label>
          ))}
        </FilterSection>

        {/* Price */}
        <FilterSection title="Max Price">
          <RangeSlider
            label="Up to"
            min={50}
            max={300}
            value={filters.maxPrice}
            onChange={v => onFilterChange('maxPrice', v)}
            prefix="$"
          />
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Minimum Rating">
          <RangeSlider
            label="At least"
            min={1}
            max={5}
            value={filters.minRating}
            onChange={v => onFilterChange('minRating', v)}
          />
        </FilterSection>

        {/* In stock */}
        <FilterSection title="Availability">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStockOnly ?? false}
              onChange={e => onFilterChange('inStockOnly', e.target.checked || undefined)}
              className="accent-red-600 w-4 h-4"
            />
            <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors">In stock only</span>
          </label>
        </FilterSection>
      </div>
    </aside>
  )
}
