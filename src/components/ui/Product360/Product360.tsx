/**
 * Product360 component for 360-degree product viewing
 * Features: Mouse/touch drag rotation, auto-rotation, zoom functionality
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { OptimizedImage } from '../../../utils/imageOptimization.tsx'

interface Product360Props {
  images: string[]
  alt: string
  className?: string
  autoRotate?: boolean
  autoRotateSpeed?: number
  zoomEnabled?: boolean
}

export const Product360: React.FC<Product360Props> = ({
  images,
  alt,
  className = '',
  autoRotate = false,
  autoRotateSpeed = 50,
  zoomEnabled = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const autoRotateIntervalRef = useRef<number | null>(null)

  // Auto-rotation effect
  useEffect(() => {
    if (isAutoRotating && images.length > 1) {
      autoRotateIntervalRef.current = window.setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length)
      }, 3600 / autoRotateSpeed) // Convert speed to interval
    } else {
      if (autoRotateIntervalRef.current) {
        window.clearInterval(autoRotateIntervalRef.current)
      }
    }

    return () => {
      if (autoRotateIntervalRef.current) {
        window.clearInterval(autoRotateIntervalRef.current)
      }
    }
  }, [isAutoRotating, images.length, autoRotateSpeed])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isZoomed) return
    setIsDragging(true)
    setStartX(e.clientX)
    setIsAutoRotating(false)
    e.preventDefault()
  }, [isZoomed])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || isZoomed) return
    
    const deltaX = e.clientX - startX
    const sensitivity = 2 // Adjust for rotation speed
    const imageChange = Math.floor(deltaX / sensitivity)
    
    if (imageChange !== 0) {
      const newIndex = (currentIndex - imageChange + images.length) % images.length
      setCurrentIndex(newIndex)
      setStartX(e.clientX)
    }
  }, [isDragging, startX, currentIndex, images.length, isZoomed])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isZoomed) return
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setIsAutoRotating(false)
    e.preventDefault()
  }, [isZoomed])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || isZoomed) return
    
    const deltaX = e.touches[0].clientX - startX
    const sensitivity = 2
    const imageChange = Math.floor(deltaX / sensitivity)
    
    if (imageChange !== 0) {
      const newIndex = (currentIndex - imageChange + images.length) % images.length
      setCurrentIndex(newIndex)
      setStartX(e.touches[0].clientX)
    }
  }, [isDragging, startX, currentIndex, images.length, isZoomed])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating(prev => !prev)
  }, [])

  const toggleZoom = useCallback(() => {
    if (!zoomEnabled) return
    setIsZoomed(prev => !prev)
    setZoomLevel(isZoomed ? 1 : 2)
    setPanPosition({ x: 0, y: 0 })
  }, [zoomEnabled, isZoomed])

  const handleZoomWheel = useCallback((e: React.WheelEvent) => {
    if (!zoomEnabled) return
    e.preventDefault()
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoomLevel(prev => Math.max(1, Math.min(3, prev + delta)))
  }, [zoomEnabled])

  const resetView = useCallback(() => {
    setCurrentIndex(0)
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
    setIsZoomed(false)
  }, [])

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No 360° images available</span>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleZoomWheel}
    >
      {/* 360 Image Display */}
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
      >
        <OptimizedImage
          src={images[currentIndex]}
          alt={`${alt} - 360° view ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          priority={currentIndex === 0}
        />
      </div>

      {/* Loading Indicator */}
      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        360° View
      </div>

      {/* Frame Counter */}
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
        {/* Auto-rotate Toggle */}
        <button
          onClick={toggleAutoRotate}
          className={`p-2 rounded-full transition-colors ${
            isAutoRotating 
              ? 'bg-red-600 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          aria-label={isAutoRotating ? 'Stop auto-rotation' : 'Start auto-rotation'}
        >
          <RotateCw className={`h-4 w-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
        </button>

        {/* Zoom Controls */}
        {zoomEnabled && (
          <>
            <button
              onClick={toggleZoom}
              className={`p-2 rounded-full transition-colors ${
                isZoomed 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </button>
          </>
        )}

        {/* Reset View */}
        <button
          onClick={resetView}
          className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors"
          aria-label="Reset view"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Instructions Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isDragging ? 0 : 1, y: isDragging ? 10 : 0 }}
          className="bg-black/60 text-white px-4 py-2 rounded-lg text-center"
        >
          <p className="text-sm">
            {isZoomed ? 'Scroll to zoom' : 'Drag to rotate'}
          </p>
        </motion.div>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-4' 
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Product360
