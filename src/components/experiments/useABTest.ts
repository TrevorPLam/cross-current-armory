import { useState, useEffect, useMemo, useRef } from 'react'
import { analytics } from '../../analytics/tracking'
import type { ABVariant } from './ABTest'

function pickVariant<T extends string>(variants: ABVariant<T>[]): T {
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 1), 0)
  let rand = Math.random() * totalWeight
  for (const v of variants) {
    rand -= v.weight ?? 1
    if (rand <= 0) return v.name
  }
  return variants[variants.length - 1].name
}

function getStorageKey(testName: string) {
  return `abtest_${testName}`
}

/**
 * useABTest — deterministically assigns a variant for the given test name,
 * persisting the assignment to localStorage so the same user always gets
 * the same variant.
 */
export function useABTest<T extends string>(
  testName: string,
  variants: ABVariant<T>[],
  onAssign?: (variant: T) => void
): T | null {
  const variantNames = useMemo(() => variants.map(v => v.name), [variants])

  // Keep onAssign in a ref so the effect always calls the latest version
  // without needing it in the dependency array (assignment runs once per testName)
  const onAssignRef = useRef(onAssign)
  useEffect(() => {
    onAssignRef.current = onAssign
  })

  const [variant, setVariant] = useState<T | null>(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(testName))
      if (stored && variantNames.includes(stored as T)) return stored as T
    } catch {
      // localStorage unavailable (e.g. private browsing or SSR)
    }
    return null
  })

  useEffect(() => {
    if (variant !== null) return

    const selected = pickVariant(variants)
    try {
      localStorage.setItem(getStorageKey(testName), selected)
    } catch {
      // ignore
    }
    setVariant(selected)
    analytics.track('ab_test_assigned', { testName, variant: selected })
    onAssignRef.current?.(selected)
    // This effect intentionally runs only when testName changes (i.e. once per test)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testName])

  return variant
}

/** Utility: clear a stored variant assignment (e.g. for testing). */
export function clearABVariant(testName: string) {
  try {
    localStorage.removeItem(getStorageKey(testName))
  } catch {
    // ignore
  }
}
