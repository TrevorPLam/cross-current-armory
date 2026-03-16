import { Calendar, User, Tag, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import type { BlogPostData } from '../../data/blogPosts'

// ---------------------------------------------------------------------------
// BlogPost display component
// ---------------------------------------------------------------------------

interface BlogPostProps {
  post: BlogPostData
  onBack?: () => void
}

export function BlogPost({ post, onBack }: BlogPostProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </button>
      )}

      {/* Cover image placeholder */}
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-xl mb-8"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-8 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Cross-Current Precision Armory</span>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          {post.author}
        </span>
        {post.readingTimeMinutes && (
          <span>{post.readingTimeMinutes} min read</span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-medium px-3 py-1 rounded-full"
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* Content — renders newlines as paragraphs */}
      <div className="prose prose-gray max-w-none">
        {post.content.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
            return (
              <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">
                {paragraph.replace(/\*\*/g, '')}
              </h3>
            )
          }
          return (
            <p key={i} className="text-gray-700 leading-relaxed mb-4">
              {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
            </p>
          )
        })}
      </div>
    </motion.article>
  )
}

// ---------------------------------------------------------------------------
// BlogCard — used in the blog listing
// ---------------------------------------------------------------------------

interface BlogCardProps {
  post: BlogPostData
  onClick: (post: BlogPostData) => void
}

export function BlogCard({ post, onClick }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onClick(post)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(post)}
      aria-label={`Read article: ${post.title}`}
    >
      {post.coverImage ? (
        <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <span className="text-gray-600 text-xs">Cross-Current Precision Armory</span>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Calendar className="h-3.5 w-3.5" />
          {formattedDate}
          {post.readingTimeMinutes && (
            <span className="ml-auto">{post.readingTimeMinutes} min read</span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 mb-2 leading-snug line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
