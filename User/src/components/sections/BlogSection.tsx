import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '../../types/index.js';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogSectionProps {
  posts?: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts = [] }) => {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 border-t border-[#262626] light:border-[#C6B7A0] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e91010] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Technical Writing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-black">
            Articles & Insights
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 max-w-xl mx-auto">
            Deep architectural reflections, lessons learned, and system design explorations.
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-[#141414] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#e91010]/50 transition-all duration-300 shadow-sm"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 border-b border-[#262626] light:border-[#C6B7A0]">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={`Cover art for article ${post.title}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600">
                      <BookOpen className="w-8 h-8 text-neutral-700 mb-1" />
                      <span className="font-mono text-[11px]">[Article Cover]</span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  {/* Metadata (Reading time + Date) */}
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 light:text-neutral-600 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#e91010]" />
                      {post.readingTimeMinutes} min read
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white light:text-black group-hover:text-[#e91010] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-neutral-400 light:text-neutral-700 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#1f1f1f] light:bg-[#C6B7A0] text-[10px] font-medium text-neutral-300 light:text-neutral-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 mt-4 border-t border-[#262626]/50 light:border-[#C6B7A0]/50 pt-3">
                <Link
                  to={`/blog/${post.slug}`}
                  aria-label={`Read full article: ${post.title}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white light:text-black group-hover:text-[#e91010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] rounded p-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
