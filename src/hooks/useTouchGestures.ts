import { useState, useEffect, useRef, type RefObject } from 'react'

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null

export interface TouchGestureOptions {
  /** Minimum distance (px) to register a swipe. Default: 50 */
  threshold?: number
  /** Maximum time (ms) allowed for a swipe gesture. Default: 500 */
  maxDuration?: number
  /** Whether gesture detection is active. Default: true */
  enabled?: boolean
}

export interface TouchGestureResult {
  swipeDirection: SwipeDirection
  isSwiping: boolean
  deltaX: number
  deltaY: number
}

/**
 * useTouchGestures — detects swipe gestures on a referenced element.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const { swipeDirection } = useTouchGestures(ref)
 * useEffect(() => { if (swipeDirection === 'left') closeMenu() }, [swipeDirection])
 */
export function useTouchGestures(
  elementRef: RefObject<HTMLElement | null>,
  options: TouchGestureOptions = {}
): TouchGestureResult {
  const { threshold = 50, maxDuration = 500, enabled = true } = options

  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [deltaX, setDeltaX] = useState(0)
  const [deltaY, setDeltaY] = useState(0)

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el || !enabled) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() }
      setSwipeDirection(null)
      setIsSwiping(true)
      setDeltaX(0)
      setDeltaY(0)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current) return
      const touch = e.touches[0]
      setDeltaX(touch.clientX - touchStart.current.x)
      setDeltaY(touch.clientY - touchStart.current.y)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return

      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStart.current.x
      const dy = touch.clientY - touchStart.current.y
      const duration = Date.now() - touchStart.current.time
      const absX = Math.abs(dx)
      const absY = Math.abs(dy)

      setIsSwiping(false)

      if (duration <= maxDuration && Math.max(absX, absY) >= threshold) {
        if (absX >= absY) {
          setSwipeDirection(dx > 0 ? 'right' : 'left')
        } else {
          setSwipeDirection(dy > 0 ? 'down' : 'up')
        }
      } else {
        setSwipeDirection(null)
      }

      touchStart.current = null
    }

    const handleTouchCancel = () => {
      touchStart.current = null
      setIsSwiping(false)
      setSwipeDirection(null)
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    el.addEventListener('touchcancel', handleTouchCancel, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart, { passive: true } as EventListenerOptions)
      el.removeEventListener('touchmove', handleTouchMove, { passive: true } as EventListenerOptions)
      el.removeEventListener('touchend', handleTouchEnd, { passive: true } as EventListenerOptions)
      el.removeEventListener('touchcancel', handleTouchCancel, { passive: true } as EventListenerOptions)
    }
  }, [elementRef, enabled, threshold, maxDuration])

  return { swipeDirection, isSwiping, deltaX, deltaY }
}
