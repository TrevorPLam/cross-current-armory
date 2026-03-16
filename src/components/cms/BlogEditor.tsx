import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ChevronRight, Rss } from 'lucide-react'
import { blogPosts, blogCategories, type BlogCategory } from '../../data/blog'

interface BlogEditorProps {
  className?: string
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    'Gear Reviews': 'bg-blue-100 text-blue-700',
    'Tactical Tips': 'bg-green-100 text-green-700',
    'Industry News': 'bg-purple-100 text-purple-700',
    'Company Updates': 'bg-orange-100 text-orange-700',
    'How-To Guides': 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${colors[category] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {category}
    </span>
  )
}

function PostCard({
  post,
  index,
  featured = false,
}: {
  post: (typeof blogPosts)[number]
  index: number
  featured?: boolean
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Placeholder hero area */}
      <div
        className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${
          featured ? 'h-48 md:h-64' : 'h-36'
        }`}
        aria-hidden="true"
      >
        <Rss className="h-10 w-10 text-gray-500 opacity-40" />
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <CategoryBadge category={post.category} />
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <h2
          className={`font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors ${
            featured ? 'text-xl md:text-2xl' : 'text-base'
          }`}
        >
          <Link to={`/blog/${post.slug}`} className="focus:outline-none focus:underline">
            {post.title}
          </Link>
        </h2>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{post.author}</span>
            {' · '}
            <span>{post.authorRole}</span>
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors focus:outline-none focus:underline"
            aria-label={`Read more about ${post.title}`}
          >
            Read more
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
            <Tag className="h-3 w-3 text-gray-400 mt-0.5" aria-hidden="true" />
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  )
}

export function BlogEditor({ className = '' }: BlogEditorProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All')

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return blogPosts
    return blogPosts.filter(p => p.category === activeCategory)
  }, [activeCategory])

  const featured = filtered.find(p => p.featured)
  const rest = filtered.filter(p => !p.featured || activeCategory !== 'All')

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-600 mb-2">
          News &amp; Resources
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Cross-Current Blog
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Gear reviews, tactical tips, industry news, and guides from our team of security
          professionals and veterans.
        </p>
      </div>

      {/* Category filter */}
      <div
        className="flex flex-wrap justify-center gap-2 mb-10"
        role="tablist"
        aria-label="Blog categories"
      >
        <button
          role="tab"
          aria-selected={activeCategory === 'All'}
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === 'All'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
          }`}
        >
          All
        </button>
        {blogCategories.map(category => (
          <button
            key={category}
            role="tab"
            aria-selected={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured post */}
      {activeCategory === 'All' && featured && (
        <div className="mb-10">
          <PostCard post={featured} index={0} featured={true} />
        </div>
      )}

      {/* Post grid */}
      {rest.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No posts in this category yet.</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            View all posts
          </button>
        </div>
      )}
    </div>
  )
}
