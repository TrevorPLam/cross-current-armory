import { useState } from 'react'
import { Camera, Heart, MessageCircle, Share2, Star, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UGCPhoto {
  id: string
  src: string
  alt: string
  author: string
  location?: string
  caption?: string
  product?: string
  likes: number
  rating?: number
  date: string
}

// ---------------------------------------------------------------------------
// Static gallery data
// ---------------------------------------------------------------------------

const galleryPhotos: UGCPhoto[] = [
  {
    id: '1',
    src: '/ugc/customer-1.jpg',
    alt: 'Customer wearing Concealment Plate Carrier on range',
    author: 'Mike T.',
    location: 'San Antonio, TX',
    caption: 'Perfect fit right out of the box. Running it at every class now.',
    product: 'Concealment Plate Carrier',
    likes: 42,
    rating: 5,
    date: '2026-01-20',
  },
  {
    id: '2',
    src: '/ugc/customer-2.jpg',
    alt: 'A4 Side Plates unboxing',
    author: 'Sarah M.',
    location: 'Houston, TX',
    caption: 'Fast shipping and packaging was solid. Armor feels bomber quality.',
    product: 'A4 Side Plates',
    likes: 31,
    rating: 5,
    date: '2026-01-28',
  },
  {
    id: '3',
    src: '/ugc/customer-3.jpg',
    alt: 'Customer range training with full kit',
    author: 'James R.',
    location: 'Dallas, TX',
    caption: 'Shot 500 rounds in this kit. Plates stayed put the entire time. Impressed.',
    product: 'A2 – Level III+ Alloy Body Armor',
    likes: 58,
    rating: 5,
    date: '2026-02-05',
  },
  {
    id: '4',
    src: '/ugc/customer-4.jpg',
    alt: 'Concealment Plate Carrier White side profile',
    author: 'Lisa K.',
    location: 'Austin, TX',
    caption: 'Love the white. Low profile enough for my work. Great piece of kit.',
    product: 'Concealment Plate Carrier – White',
    likes: 27,
    rating: 4,
    date: '2026-02-12',
  },
  {
    id: '5',
    src: '/ugc/customer-5.jpg',
    alt: 'Heritage AR500 plates with carrier setup',
    author: 'David C.',
    location: 'Fort Worth, TX',
    caption: 'Heritage plates are solid. Coating looks great, no spall worries.',
    product: 'Heritage – Level III AR500 Steel Body Armor',
    likes: 19,
    rating: 5,
    date: '2026-02-18',
  },
  {
    id: '6',
    src: '/ugc/customer-6.jpg',
    alt: 'Gear laid out for inspection',
    author: 'Alex P.',
    location: 'Lubbock, TX',
    caption: 'Everything I ordered arrived in great condition. Will be ordering again.',
    likes: 14,
    rating: 5,
    date: '2026-03-01',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface GalleryCardProps {
  photo: UGCPhoto
  onClick: (photo: UGCPhoto) => void
}

function GalleryCard({ photo, onClick }: GalleryCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(photo.likes)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!liked) {
      setLiked(true)
      setLikeCount((c) => c + 1)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onClick(photo)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(photo)}
      aria-label={`View photo by ${photo.author}`}
    >
      {/* Image */}
      <div className="relative bg-gray-100 h-52 flex items-center justify-center overflow-hidden">
        <img
          src={photo.src}
          alt={photo.alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback placeholder when image 404s in development
            const target = e.currentTarget
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('.ugc-placeholder')) {
              const placeholder = document.createElement('div')
              placeholder.className =
                'ugc-placeholder absolute inset-0 flex flex-col items-center justify-center gap-2'
              placeholder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span class="text-gray-400 text-xs">Customer Photo</span>`
              parent.appendChild(placeholder)
            }
          }}
        />
        {photo.rating && (
          <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 flex items-center gap-0.5 text-xs font-semibold text-yellow-600 shadow">
            <Star className="h-3 w-3 fill-current" />
            {photo.rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-semibold text-sm text-gray-900">{photo.author}</span>
            {photo.location && (
              <span className="text-xs text-gray-400 ml-1.5">· {photo.location}</span>
            )}
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-colors ${
              liked ? 'text-red-600' : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label={liked ? 'Liked' : 'Like this photo'}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </button>
        </div>
        {photo.caption && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{photo.caption}</p>
        )}
        {photo.product && (
          <p className="text-xs text-red-600 font-medium mt-2 truncate">{photo.product}</p>
        )}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

interface LightboxProps {
  photo: UGCPhoto
  onClose: () => void
}

function Lightbox({ photo, onClose }: LightboxProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-100 h-72 relative flex items-center justify-center">
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="font-bold text-gray-900">{photo.author}</span>
              {photo.location && (
                <span className="text-sm text-gray-500 ml-1.5">· {photo.location}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <button aria-label="Share" className="hover:text-gray-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button aria-label="Comment" className="hover:text-gray-600 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
          {photo.caption && (
            <p className="text-gray-700 leading-relaxed mb-3">{photo.caption}</p>
          )}
          {photo.product && (
            <p className="text-sm font-medium text-red-600">Product: {photo.product}</p>
          )}
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main Gallery component
// ---------------------------------------------------------------------------

interface GalleryProps {
  className?: string
}

export function Gallery({ className = '' }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<UGCPhoto | null>(null)

  return (
    <section id="community" className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Camera className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl md:text-4xl font-bold">Community Gallery</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real customers, real gear. Share your setup and inspire the community.
          </p>
        </div>

        {/* Photo grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryPhotos.map((photo) => (
            <GalleryCard key={photo.id} photo={photo} onClick={setSelectedPhoto} />
          ))}
        </div>

        {/* Submit CTA */}
        <div className="mt-12 text-center bg-white border border-gray-200 rounded-xl p-8">
          <Upload className="h-10 w-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">Share Your Setup</h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Tag us on Instagram <strong>@CrossCurrentArmory</strong> or email your photos to{' '}
            <a
              href="mailto:info@crosscurrentarmory.com"
              className="text-red-600 underline hover:text-red-700"
            >
              info@crosscurrentarmory.com
            </a>{' '}
            to be featured in the gallery.
          </p>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
