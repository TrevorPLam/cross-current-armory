import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Camera, CheckCircle, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Types & data ──────────────────────────────────────────────────────────────

interface UGCEntry {
  id: string
  userName: string
  location: string
  product: string
  rating: number
  caption: string
  verified: boolean
  /** placeholder colour gradient key */
  gradient: string
  date: string
}

const gradients = [
  'from-red-800 to-gray-900',
  'from-gray-800 to-gray-700',
  'from-slate-800 to-gray-900',
  'from-zinc-700 to-gray-800',
  'from-stone-700 to-gray-900',
  'from-neutral-700 to-stone-800',
  'from-red-900 to-gray-900',
  'from-gray-700 to-slate-900',
]

const ugcEntries: UGCEntry[] = [
  {
    id: '1',
    userName: 'TacticalMike88',
    location: 'Houston, TX',
    product: 'A2 – Level III+ Alloy Body Armor',
    rating: 5,
    caption: 'Been using this plate for 3 months of heavy training. Zero complaints — lightweight and solid protection.',
    verified: true,
    gradient: gradients[0],
    date: '2026-03-08',
  },
  {
    id: '2',
    userName: 'SarahProtects',
    location: 'Dallas, TX',
    product: 'The Concealment Plate Carrier',
    rating: 5,
    caption: 'Fits perfectly under my blazer for executive protection work. Incredibly discreet.',
    verified: true,
    gradient: gradients[1],
    date: '2026-03-05',
  },
  {
    id: '3',
    userName: 'VetOperator',
    location: 'San Antonio, TX',
    product: 'A4 – Level III++ Alloy Body Armor',
    rating: 5,
    caption: 'As a veteran, I hold gear to a high standard. Cross-Current delivers. This plate is light, comfortable, and built to last.',
    verified: true,
    gradient: gradients[2],
    date: '2026-02-28',
  },
  {
    id: '4',
    userName: 'RangeDay_Brent',
    location: 'Austin, TX',
    product: 'Heritage – Level III AR500 Steel Body Armor',
    rating: 4,
    caption: "Great value for the price. Heavy but very tough. Added a spall coat and it's perfect for range days.",
    verified: false,
    gradient: gradients[3],
    date: '2026-02-25',
  },
  {
    id: '5',
    userName: 'LEO_Fitness',
    location: 'Fort Worth, TX',
    product: 'A4 Side Plates',
    rating: 5,
    caption: 'Finally found side plates that actually cover without restricting arm movement. Worth every penny.',
    verified: true,
    gradient: gradients[4],
    date: '2026-02-20',
  },
  {
    id: '6',
    userName: 'PreparedFamilyTX',
    location: 'Plano, TX',
    product: 'The Concealment Plate Carrier – White',
    rating: 5,
    caption: 'Bought for my wife in law enforcement. She loves the fit and the fact it blends in on duty.',
    verified: true,
    gradient: gradients[5],
    date: '2026-02-18',
  },
  {
    id: '7',
    userName: 'SecurityPro_J',
    location: 'Nashville, TN',
    product: 'A2 – Level III+ Alloy Body Armor',
    rating: 5,
    caption: 'Ordered two sets for my team. Fast shipping, great packaging, and the plates exceeded expectations.',
    verified: true,
    gradient: gradients[6],
    date: '2026-02-14',
  },
  {
    id: '8',
    userName: 'OutdoorReady',
    location: 'Denver, CO',
    product: 'Coleman Perfect Flow 2-Burner Stove',
    rating: 4,
    caption: 'Solid stove for emergency prep kit. Lights first time every time. Perfect for the bug-out bag.',
    verified: false,
    gradient: gradients[7],
    date: '2026-02-10',
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function GalleryCard({
  entry,
  onClick,
}: {
  entry: UGCEntry
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full text-left focus:outline-none focus:ring-2 focus:ring-red-600 rounded-2xl overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      aria-label={`View photo by ${entry.userName}`}
    >
      {/* Photo placeholder */}
      <div
        className={`bg-gradient-to-br ${entry.gradient} aspect-square flex items-center justify-center`}
        aria-hidden="true"
      >
        <Camera className="h-10 w-10 text-white opacity-20" />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
        <StarRow rating={entry.rating} />
        <p className="text-white text-xs mt-1.5 line-clamp-2 leading-relaxed">
          {entry.caption}
        </p>
        <div className="flex items-center gap-1 mt-2 text-gray-300 text-xs">
          <span className="font-medium">@{entry.userName}</span>
          {entry.verified && (
            <CheckCircle className="h-3 w-3 text-green-400 ml-1 flex-shrink-0" aria-label="Verified purchase" />
          )}
        </div>
      </div>
    </motion.button>
  )
}

function LightboxModal({
  entry,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  entry: UGCEntry
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Photo lightbox"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full"
          onClick={e => e.stopPropagation()}
        >
          {/* Photo */}
          <div
            className={`bg-gradient-to-br ${entry.gradient} w-full aspect-video flex items-center justify-center`}
            aria-hidden="true"
          >
            <Camera className="h-16 w-16 text-white opacity-20" />
          </div>

          {/* Info */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">@{entry.userName}</span>
                  {entry.verified && (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" aria-label="Verified purchase" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {entry.location}
                </div>
              </div>
              <StarRow rating={entry.rating} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{entry.caption}</p>
            <span className="inline-block text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {entry.product}
            </span>
          </div>

          {/* Nav buttons */}
          {hasPrev && (
            <button
              onClick={onPrev}
              className="absolute left-3 top-1/3 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-3 top-1/3 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close lightbox"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

interface GalleryProps {
  className?: string
  limit?: number
}

export function Gallery({ className = '', limit }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const entries = limit ? ugcEntries.slice(0, limit) : ugcEntries

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex(i => (i !== null ? Math.max(0, i - 1) : null))
  const next = () =>
    setLightboxIndex(i => (i !== null ? Math.min(entries.length - 1, i + 1) : null))

  return (
    <section
      id="community"
      className={`py-16 bg-gray-50 ${className}`}
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-600 mb-2">
            Community
          </p>
          <h2
            id="gallery-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Customer Photos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real customers, real gear. Tag us{' '}
            <span className="font-semibold text-red-600">#CrossCurrentArmory</span> to be
            featured.
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          role="list"
          aria-label="Customer photo gallery"
        >
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              role="listitem"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <GalleryCard entry={entry} onClick={() => openLightbox(index)} />
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: '500+', label: 'Customer Photos' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '98%', label: 'Would Recommend' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-red-600">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <LightboxModal
          entry={entries[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < entries.length - 1}
        />
      )}
    </section>
  )
}
