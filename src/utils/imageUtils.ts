/**
 * Image utility functions for optimization and processing
 * Separated from components to avoid react-refresh warnings
 */

export interface ImageSource {
  src: string
  type: string
  width?: number
}

/**
 * Generate responsive image sources with modern formats
 */
export const generateImageSources = (baseSrc: string, widths: number[] = [480, 800, 1200]): ImageSource[] => {
  const sources: ImageSource[] = []
  
  // Generate WebP sources
  widths.forEach(width => {
    sources.push({
      src: baseSrc.replace(/\.[^.]+$/, `-${width}.webp`),
      type: 'image/webp',
      width
    })
  })
  
  // Generate AVIF sources (if supported)
  widths.forEach(width => {
    sources.push({
      src: baseSrc.replace(/\.[^.]+$/, `-${width}.avif`),
      type: 'image/avif',
      width
    })
  })
  
  // Fallback to original format
  widths.forEach(width => {
    sources.push({
      src: baseSrc.replace(/\.[^.]+$/, `-${width}.jpg`),
      type: 'image/jpeg',
      width
    })
  })
  
  return sources
}

/**
 * Generate blur placeholder for better loading experience
 */
export const generateBlurPlaceholder = (src: string): string => {
  // This would typically integrate with a service like Cloudinary or Imgix
  // For now, return a low-quality version
  return `${src}?w=20&blur=10&auto=format`
}

/**
 * Preload critical images for better performance
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.onload = () => resolve()
    link.onerror = () => reject()
    document.head.appendChild(link)
  })
}

/**
 * Check if browser supports AVIF format
 */
export const supportsAVIF = (): boolean => {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
}

/**
 * Check if browser supports WebP format
 */
export const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}
