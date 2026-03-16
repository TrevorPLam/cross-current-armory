import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { blogPosts } from '../../data/blog'

interface BlogPostProps {
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
      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full capitalize ${colors[category] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {category}
    </span>
  )
}

/** Renders a Markdown-lite blog post (bold, headings, lists via simple parsing) */
function MarkdownBody({ content }: { content: string }) {
  const blocks = content.split('\n\n')

  return (
    <div className="prose prose-gray max-w-none">
      {blocks.map((block, i) => {
        // H2 heading
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              {block.slice(3)}
            </h2>
          )
        }
        // H3 heading
        if (block.startsWith('### ')) {
          return (
            <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">
              {block.slice(4)}
            </h3>
          )
        }
        // Unordered list
        if (block.split('\n').every(line => line.startsWith('- '))) {
          return (
            <ul key={i} className="list-disc list-inside space-y-1.5 mb-4 text-gray-600">
              {block.split('\n').map((line, j) => {
                const text = line.slice(2)
                return (
                  <li key={j} className="leading-relaxed">
                    {renderInline(text)}
                  </li>
                )
              })}
            </ul>
          )
        }
        // Ordered list
        if (block.split('\n').every(line => /^\d+\.\s/.test(line))) {
          return (
            <ol key={i} className="list-decimal list-inside space-y-1.5 mb-4 text-gray-600">
              {block.split('\n').map((line, j) => {
                const text = line.replace(/^\d+\.\s/, '')
                return (
                  <li key={j} className="leading-relaxed">
                    {renderInline(text)}
                  </li>
                )
              })}
            </ol>
          )
        }
        // Checklist
        if (block.split('\n').every(line => line.startsWith('- [ ] ') || line.startsWith('- [x] ') || line.startsWith('- [X] '))) {
          return (
            <ul key={i} className="space-y-1.5 mb-4 text-gray-600 list-none pl-0">
              {block.split('\n').map((line, j) => {
                const checked = line.startsWith('- [x] ') || line.startsWith('- [X] ')
                const text = line.replace(/^- \[.?\] /, '')
                return (
                  <li key={j} className="flex items-start gap-2 leading-relaxed">
                    <span className={`mt-0.5 flex-shrink-0 ${checked ? 'text-green-600' : 'text-gray-400'}`}>
                      {checked ? '✓' : '○'}
                    </span>
                    {renderInline(text)}
                  </li>
                )
              })}
            </ul>
          )
        }
        // Default paragraph
        return (
          <p key={i} className="text-gray-600 leading-relaxed mb-4">
            {renderInline(block)}
          </p>
        )
      })}
    </div>
  )
}

/** Renders inline bold and link patterns */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-800">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

/** Standalone BlogPost used both as a page and embeddable component */
export function BlogPost({ className = '' }: BlogPostProps) {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find(p => p.slug === slug)

  // Scroll to top when a new post loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const related = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 2)

  return (
    <article className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors mb-8 focus:outline-none focus:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Blog
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Category & meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <CategoryBadge category={post.category} />
          <div className="flex items-center text-sm text-gray-400 gap-1">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="flex items-center text-sm text-gray-400 gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt / lead */}
        <p className="text-lg text-gray-500 mb-8 leading-relaxed border-l-4 border-red-600 pl-4 italic">
          {post.excerpt}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mb-10 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-red-600 font-bold flex-shrink-0">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{post.author}</p>
            <p className="text-xs text-gray-500">{post.authorRole}</p>
          </div>
        </div>

        {/* Hero image placeholder */}
        <div
          className="w-full h-52 md:h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg className="h-16 w-16 text-gray-600 opacity-30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>

        {/* Content */}
        <MarkdownBody content={post.content} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-gray-100">
            <Tag className="h-4 w-4 text-gray-400" aria-hidden="true" />
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Related posts */}
      {related.length > 0 && (
        <aside className="mt-16 pt-10 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map(p => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="group block p-5 bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CategoryBadge category={p.category} />
                  <span className="text-xs text-gray-400">{p.readTime} min</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors text-sm leading-snug">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </aside>
      )}

      {/* Back CTA */}
      <div className="mt-12 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All Articles
        </Link>
      </div>
    </article>
  )
}
