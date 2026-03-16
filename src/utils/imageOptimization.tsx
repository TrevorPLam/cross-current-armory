/**
 * Image optimization utilities for enhanced product experience
 * Supports WebP/AVIF formats, lazy loading, and responsive images
 */

import React, { useState, useEffect, useRef } from 'react'
import { generateImageSources } from './imageUtils'

export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

/**
 * Custom hook for lazy loading images with Intersection Observer
 */
export const useLazyImage = (src: string, threshold: number = 0.1) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  useEffect(() => {
    if (isInView && !isLoaded) {
      const img = new Image()
      img.src = src
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setError('Failed to load image')
    }
  }, [isInView, src, isLoaded])

  return { imgRef, isLoaded, isInView, error }
}

/**
 * Optimized Image component with modern formats and lazy loading
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false
}) => {
  const { imgRef, isLoaded, error } = useLazyImage(src, priority ? 0 : 0.1)
  const sources = generateImageSources(src)

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <picture>
        {sources.map((source, index) => (
          <source
            key={`${source.type}-${source.width}-${index}`}
            srcSet={source.src}
            type={source.type}
            media={source.width ? `(max-width: ${source.width}px)` : undefined}
          />
        ))}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </picture>
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

