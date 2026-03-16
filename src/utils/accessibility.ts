// WCAG 2.1 AA Accessibility Utilities
// These utilities help ensure components meet accessibility standards

/**
 * Generates a unique ID for accessibility attributes
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Checks if an element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ]
  
  return focusableSelectors.some(selector => element.matches(selector))
}

/**
 * Traps focus within a container (for modals, dropdowns, etc.)
 */
export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
  ) as NodeListOf<HTMLElement>
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  container.addEventListener('keydown', handleTabKey)
  
  return () => {
    container.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Announces messages to screen readers using ARIA live regions
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.overflow = 'hidden'
  
  document.body.appendChild(announcement)
  announcement.textContent = message
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Validates color contrast for WCAG compliance
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  // This is a simplified version - in production, use a proper color contrast library
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g)
    if (!rgb) return 0
    
    const [r, g, b] = rgb.map(val => {
      const sRGB = parseInt(val) / 255
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Checks if color contrast meets WCAG AA standards
 */
export const meetsWCAGAA = (contrastRatio: number): boolean => {
  return contrastRatio >= 4.5 // WCAG AA standard for normal text
}

/**
 * Creates proper heading hierarchy validation
 */
export const validateHeadingHierarchy = (container: HTMLElement): boolean => {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let previousLevel = 0
  
  for (const heading of headings) {
    const currentLevel = parseInt(heading.tagName.charAt(1))
    
    // H1 should only appear once and be the first heading
    if (currentLevel === 1 && previousLevel > 0) {
      console.warn('Multiple H1 tags found - there should only be one H1 per page')
      return false
    }
    
    // Heading levels should not be skipped (e.g., H1 to H3)
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      console.warn(`Heading level skipped: H${previousLevel} to H${currentLevel}`)
      return false
    }
    
    previousLevel = currentLevel
  }
  
  return true
}

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  // Handle escape key
  onEscape: (callback: () => void) => (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback()
    }
  },
  
  // Handle enter key for buttons
  onEnter: (callback: () => void) => (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      callback()
    }
  },
  
  // Handle arrow key navigation
  onArrowKeys: (
    onUp: () => void,
    onDown: () => void,
    onLeft?: () => void,
    onRight?: () => void
  ) => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        onUp()
        break
      case 'ArrowDown':
        e.preventDefault()
        onDown()
        break
      case 'ArrowLeft':
        e.preventDefault()
        onLeft?.()
        break
      case 'ArrowRight':
        e.preventDefault()
        onRight?.()
        break
    }
  }
}

/**
 * ARIA attribute helpers
 */
export const ariaAttributes = {
  // Common ARIA attributes for interactive elements
  button: (label?: string, describedBy?: string, expanded?: boolean) => ({
    'role': 'button',
    'aria-label': label,
    'aria-describedby': describedBy,
    'aria-expanded': expanded,
    'tabIndex': 0
  }),
  
  // ARIA for modal dialogs
  modal: (label: string, labelledBy?: string) => ({
    'role': 'dialog',
    'aria-modal': 'true',
    'aria-label': label,
    'aria-labelledby': labelledBy
  }),
  
  // ARIA for loading states
  loading: (label = 'Loading content') => ({
    'role': 'status',
    'aria-live': 'polite',
    'aria-label': label
  }),
  
  // ARIA for form validation
  invalid: (message: string) => ({
    'aria-invalid': 'true',
    'aria-describedby': message
  })
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  // Set focus to an element with error handling
  setFocus: (element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      setTimeout(() => element.focus(), 100)
    }
  },
  
  // Store and restore focus (useful for modals)
  storeFocus: () => document.activeElement as HTMLElement,
  restoreFocus: (previousElement: HTMLElement) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus()
    }
  }
}
