import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build for better mobile performance
    target: 'es2020',
    minify: 'terser',
    sourcemap: false, // Disable sourcemaps for production to reduce bundle size
    
    // Advanced chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor'
          }
          
          // Animation libraries
          if (id.includes('framer-motion')) {
            return 'animations'
          }
          
          // Icons
          if (id.includes('lucide-react')) {
            return 'icons'
          }
          
          // Form libraries
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform/resolvers')) {
            return 'forms'
          }
          
          // Utility libraries
          if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'utils'
          }
          
          // Node modules fallback
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        
        // Optimize chunk names for better caching
        chunkFileNames: () => `js/[name]-[hash].js`,
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name].[ext]'
          
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name)) {
            return `media/[name]-[hash][extname]`
          }
          
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`
          }
          
          return `assets/[name]-[hash][extname]`
        }
      },
    },
    
    // Reduce chunk size warning limit for better mobile performance
    chunkSizeWarningLimit: 500,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Optimize for mobile
    cssTarget: 'chrome80'
  },
  
  server: {
    // Development server optimizations
    hmr: {
      overlay: true,
    }
  },
  
  preview: {
    // Preview server optimizations
    port: 3000,
  },
  
  // Dependency optimization for faster builds
  optimizeDeps: {
    // Pre-bundle dependencies for faster development
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      'react-hook-form',
      'zod',
      '@hookform/resolvers'
    ],
    
    // Exclude large dependencies from pre-bundling
    exclude: ['@types/react']
  },
  
  // Resolve paths for better tree-shaking
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@data': resolve(__dirname, 'src/data'),
      '@types': resolve(__dirname, 'src/types'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // Define global constants for build optimization
  define: {
    // Enable production optimizations
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  },
  
  // CSS optimizations
  css: {
    devSourcemap: false, // Disable CSS sourcemaps in development for faster builds
    preprocessorOptions: {
      scss: {
        // Optimize SCSS compilation
        api: 'modern-compiler'
      }
    }
  }
})
