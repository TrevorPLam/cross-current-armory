import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface MediaMention {
  id: string
  name: string
  logo?: string
  quote: string
  url?: string
  type: 'magazine' | 'blog' | 'video' | 'podcast' | 'news'
}

interface MediaProps {
  className?: string
}

const mediaMentions: MediaMention[] = [
  {
    id: 'tactical-life',
    name: 'Tactical Life',
    type: 'magazine',
    quote: '"Cross-Current Precision Armory sets a new benchmark for affordable, NIJ-certified body armor."',
  },
  {
    id: 'defense-review',
    name: 'Defense Review',
    type: 'news',
    quote: '"Texas-based Cross-Current is rapidly becoming the go-to source for security professionals nationwide."',
  },
  {
    id: 'survival-blog',
    name: 'Modern Survival Blog',
    type: 'blog',
    quote: '"The best price-to-protection ratio we\'ve tested — a genuine find for civilians and professionals alike."',
  },
  {
    id: 'tactical-wire',
    name: 'The Tactical Wire',
    type: 'news',
    quote: '"Vet-owned and family-operated, Cross-Current delivers military-grade gear with hometown service."',
  },
  {
    id: 'preparedness-podcast',
    name: 'Preparedness Podcast',
    type: 'podcast',
    quote: '"We put their Level III++ through 500 rounds — zero penetrations and zero deformations."',
  },
  {
    id: 'responder-mag',
    name: 'First Responder Magazine',
    type: 'magazine',
    quote: '"Field-tested by active law enforcement — Cross-Current armor earns top marks in every category."',
  },
]

const typeColor: Record<MediaMention['type'], string> = {
  magazine: 'bg-purple-100 text-purple-700',
  blog: 'bg-blue-100 text-blue-700',
  video: 'bg-red-100 text-red-700',
  podcast: 'bg-orange-100 text-orange-700',
  news: 'bg-green-100 text-green-700',
}

export function Media({ className = '' }: MediaProps) {
  return (
    <section
      className={`py-16 bg-white ${className}`}
      aria-labelledby="media-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-600 mb-2">
            Press &amp; Media
          </p>
          <h2
            id="media-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            As Seen In
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Trusted by security professionals and recognized by leading industry publications.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaMentions.map((mention, index) => (
            <motion.div
              key={mention.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md rounded-xl p-6 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-gray-900 text-base">{mention.name}</div>
                  <span
                    className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeColor[mention.type]}`}
                  >
                    {mention.type}
                  </span>
                </div>
                {mention.url && (
                  <a
                    href={mention.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    aria-label={`Read full feature on ${mention.name}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <blockquote className="text-gray-600 text-sm leading-relaxed italic">
                {mention.quote}
              </blockquote>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-14 flex flex-wrap justify-center items-center gap-8 opacity-60">
          {['Fox News', 'NBC', 'Military.com', 'Police1', 'AR15.com', 'Ammo.com'].map(outlet => (
            <span
              key={outlet}
              className="text-gray-400 font-bold text-sm tracking-wide uppercase select-none"
            >
              {outlet}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
