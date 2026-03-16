import { useState } from 'react'
import { BlogPost, BlogCard } from './BlogPost'
import { blogPosts, type BlogPostData } from '../../data/blogPosts'

/**
 * BlogEditor provides a simple in-app blog listing and reader.
 *
 * It renders the static `blogPosts` data defined in BlogPost.tsx.
 * When a future CMS backend is available, replace `blogPosts` with an API
 * call and pass the data down as props.
 */

interface BlogEditorProps {
  className?: string
}

export function BlogEditor({ className = '' }: BlogEditorProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPostData | null>(null)

  if (selectedPost) {
    return (
      <section className={`py-16 bg-white ${className}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPost post={selectedPost} onBack={() => setSelectedPost(null)} />
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className={`py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Articles &amp; Resources</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Guides, how-tos, and company updates from the Cross-Current Precision Armory team.
          </p>
        </div>

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} onClick={setSelectedPost} />
          ))}
        </div>
      </div>
    </section>
  )
}
