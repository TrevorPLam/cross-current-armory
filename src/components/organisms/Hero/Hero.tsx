import { motion } from 'framer-motion'
import { ChevronRight, Truck, Shield, Award } from 'lucide-react'
import { companyInfo } from '../../../data'

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background overlay with subtle pattern */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Veteran Owned Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="bg-red-600 text-white px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2 shadow-lg">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
              </svg>
              VETERAN OWNED & OPERATED
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {companyInfo.tagline}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {companyInfo.description}
            Your trusted source for body armor, outdoor equipment, and survival essentials.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#products"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Shop Now
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
            <a
              href="#about"
              className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 left-0 right-0"
        aria-label="Trust indicators"
      >
        <div className="flex justify-center space-x-8 text-gray-400">
          <div className="flex items-center group">
            <Truck className="h-5 w-5 mr-2 group-hover:text-white transition-colors" aria-hidden="true" />
            <span className="text-sm group-hover:text-white transition-colors">Free Shipping</span>
          </div>
          <div className="flex items-center group">
            <Shield className="h-5 w-5 mr-2 group-hover:text-white transition-colors" aria-hidden="true" />
            <span className="text-sm group-hover:text-white transition-colors">Premium Quality</span>
          </div>
          <div className="flex items-center group">
            <Award className="h-5 w-5 mr-2 group-hover:text-white transition-colors" aria-hidden="true" />
            <span className="text-sm group-hover:text-white transition-colors">Expert Service</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
