import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchBoxProps {
  query: string
  onQueryChange: (value: string) => void
  suggestions?: string[]
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchBox({
  query,
  onQueryChange,
  suggestions = [],
  placeholder = 'Search products...',
  className = '',
  autoFocus = false,
}: SearchBoxProps) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value)
    setOpen(true)
  }

  const handleSelect = (suggestion: string) => {
    onQueryChange(suggestion)
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    onQueryChange('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const showDropdown = open && suggestions.length > 0

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          placeholder={placeholder}
          value={query}
          autoFocus={autoFocus}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setOpen(false)
              inputRef.current?.blur()
            }
          }}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            id="search-suggestions"
            role="listbox"
            aria-label="Search suggestions"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-30 overflow-hidden"
          >
            {suggestions.map(suggestion => (
              <li key={suggestion} role="option">
                <button
                  onMouseDown={e => { e.preventDefault(); handleSelect(suggestion) }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(suggestion) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                  {suggestion}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
