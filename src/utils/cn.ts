/**
 * Utility function for merging Tailwind CSS classes
 * Simple replacement for clsx/cn libraries
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
