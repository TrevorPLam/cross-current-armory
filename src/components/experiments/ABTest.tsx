import { type ReactNode } from 'react'
import { useABTest } from './useABTest'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ABVariant<T extends string = string> {
  name: T
  /** Weight (relative probability); defaults to 1 for even split */
  weight?: number
  children: ReactNode
}

export interface ABTestProps<T extends string = string> {
  /** Unique test identifier used for storage + analytics */
  testName: string
  variants: ABVariant<T>[]
  /** Called when a variant is first assigned */
  onAssign?: (variant: T) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ABTest — renders the assigned variant for a given test.
 *
 * @example
 * <ABTest
 *   testName="hero_cta"
 *   variants={[
 *     { name: 'control', children: <Button>Shop Now</Button> },
 *     { name: 'treatment', children: <Button>Browse Armor</Button> },
 *   ]}
 * />
 */
export function ABTest<T extends string = string>({
  testName,
  variants,
  onAssign,
}: ABTestProps<T>) {
  const assignedVariant = useABTest(testName, variants, onAssign)

  if (assignedVariant === null) return null

  const matched = variants.find(v => v.name === assignedVariant)
  return matched ? <>{matched.children}</> : null
}

