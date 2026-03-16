import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote, CheckCircle, MapPin } from 'lucide-react'
import { testimonials, type Testimonial } from '../../data/testimonials'
import { motion, AnimatePresence } from 'framer-motion'

interface TestimonialsProps {
  className?: string
  featured?: number
  showResults?: boolean
}

export function Testimonials({ 
  className = '', 
  featured = 3,
  showResults = true 
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const displayTestimonials = testimonials.slice(0, featured)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, displayTestimonials.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className={`testimonials-section ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real reviews from security professionals who trust our gear with their lives every day
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Main Testimonial Display */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {/* Avatar and Info */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-red-600 font-bold text-xl">
                    {displayTestimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {displayTestimonials[currentIndex].verified && (
                    <div className="flex items-center justify-center mt-2 text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Verified</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <Quote className="h-8 w-8 text-red-600 mr-2" />
                    <div className="flex items-center">
                      {renderStars(displayTestimonials[currentIndex].rating)}
                    </div>
                  </div>

                  <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                    "{displayTestimonials[currentIndex].content}"
                  </blockquote>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <cite className="font-semibold text-gray-900 not-italic">
                          {displayTestimonials[currentIndex].name}
                        </cite>
                        <p className="text-sm text-gray-600">
                          {displayTestimonials[currentIndex].role} at {displayTestimonials[currentIndex].company}
                        </p>
                        {displayTestimonials[currentIndex].location && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {displayTestimonials[currentIndex].location}
                          </div>
                        )}
                      </div>
                      {displayTestimonials[currentIndex].product && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Product Reviewed</p>
                          <p className="text-sm font-medium text-gray-700">
                            {displayTestimonials[currentIndex].product}
                          </p>
                        </div>
                      )}
                    </div>

                    {showResults && displayTestimonials[currentIndex].result && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">
                          🎯 {displayTestimonials[currentIndex].result}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>

        {/* Dot Indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {displayTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute bottom-4 right-4 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isAutoPlaying ? 'Pause' : 'Play'} Auto-scroll
        </button>
      </div>

      {/* Stats Summary */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-1">4.9/5</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-1">500+</div>
          <div className="text-sm text-gray-600">Verified Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-1">98%</div>
          <div className="text-sm text-gray-600">Customer Satisfaction</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-1">24/7</div>
          <div className="text-sm text-gray-600">Support Available</div>
        </div>
      </div>
    </div>
  )
}

// Individual testimonial card for grid layouts
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-red-600 font-bold flex-shrink-0">
          {testimonial.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {renderStars(testimonial.rating)}
            {testimonial.verified && (
              <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
            )}
          </div>
          <blockquote className="text-gray-700 mb-3">
            "{testimonial.content}"
          </blockquote>
          <div>
            <cite className="font-semibold text-gray-900 not-italic">
              {testimonial.name}
            </cite>
            <p className="text-sm text-gray-600">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
