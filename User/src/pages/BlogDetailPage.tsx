import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { publicApi } from '../services/publicApi.js';
import { Navbar } from '../components/common/Navbar.js';
import { Footer } from '../components/common/Footer.js';
import { ScrollProgress } from '../components/common/ScrollProgress.js';
import { CustomCursor } from '../components/common/CustomCursor.js';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = React.useState(false);

  // Load article by slug
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['blog-detail', slug],
    queryFn: () => publicApi.getBlogPostBySlug(slug!),
    enabled: !!slug,
  });

  // Fetch site settings for Navbar and Footer
  const { data: portfolioData } = useQuery({
    queryKey: ['portfolio-public'],
    queryFn: () => publicApi.getPortfolio(),
  });

  // Update SEO document title
  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | Technical Blog`;
    } else {
      document.title = 'Article | Ayush Parekh';
    }
  }, [post]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-3">
        <ScrollProgress />
        <Loader2 className="w-8 h-8 text-[#e91010] animate-spin" />
        <p className="text-xs font-mono text-neutral-400 tracking-wider">
          LOADING ARTICLE...
        </p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
        <p className="text-sm text-neutral-400 max-w-md mb-6">
          {(error as Error)?.message ||
            'The requested article does not exist or may have been unpublished.'}
        </p>
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold tracking-wide transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] light:bg-[#EAE0D0] light:text-[#1a1a1a] transition-colors">
      <ScrollProgress />
      <CustomCursor />
      <Navbar settings={portfolioData?.settings} />

      <main className="max-w-3xl mx-auto px-6 sm:px-8 pt-32 pb-24">
        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-neutral-400 light:text-neutral-600 hover:text-[#e91010] light:hover:text-[#e91010] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ARTICLES</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#D5C8B4] hover:border-neutral-500 text-xs font-mono text-neutral-300 light:text-neutral-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span>LINK COPIED</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>SHARE ARTICLE</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 mb-10"
        >
          {/* Metadata pill badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 light:text-neutral-600">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#e91010]" />
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#e91010]" />
              {post.readingTimeMinutes || 3} MIN READ
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white light:text-black leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-lg text-neutral-300 light:text-neutral-700 leading-relaxed font-normal">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Tag className="w-3.5 h-3.5 text-neutral-500" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#141414] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] text-neutral-300 light:text-neutral-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 rounded-xl overflow-hidden border border-[#262626] light:border-[#C6B7A0] shadow-xl bg-neutral-900"
          >
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-auto max-h-[450px] object-cover"
            />
          </motion.div>
        )}

        {/* Article Body (Markdown) */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-invert light:prose-neutral max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-neutral-300 light:text-neutral-800"
        >
          {post.content ? (
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => (
                  <h2
                    className="text-2xl font-bold text-white light:text-black mt-8 mb-4 border-b border-[#262626] light:border-[#C6B7A0] pb-2"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h3
                    className="text-xl font-bold text-white light:text-black mt-6 mb-3"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h4
                    className="text-lg font-semibold text-white light:text-black mt-4 mb-2"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p
                    className="text-neutral-300 light:text-neutral-700 leading-relaxed mb-4 text-sm sm:text-base"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-neutral-300 light:text-neutral-700" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-neutral-300 light:text-neutral-700" {...props} />
                ),
                li: ({ ...props }) => <li className="text-sm sm:text-base" {...props} />,
                code: ({ inline, ...props }: any) =>
                  inline ? (
                    <code
                      className="px-1.5 py-0.5 rounded bg-neutral-800 light:bg-neutral-200 text-[#e91010] font-mono text-xs"
                      {...props}
                    />
                  ) : (
                    <pre className="p-4 rounded-lg bg-[#141414] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] overflow-x-auto text-xs font-mono my-4">
                      <code className="text-neutral-200 light:text-neutral-900" {...props} />
                    </pre>
                  ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-[#e91010] pl-4 italic text-neutral-400 light:text-neutral-600 my-4"
                    {...props}
                  />
                ),
                a: ({ ...props }) => (
                  <a
                    className="text-[#e91010] underline underline-offset-4 hover:text-[#c80c0c]"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          ) : (
            <p className="italic text-neutral-500">
              No content published for this article yet.
            </p>
          )}
        </motion.article>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-[#262626] light:border-[#C6B7A0] flex items-center justify-between">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 light:text-neutral-600 hover:text-white light:hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>

          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold tracking-wide transition-colors"
          >
            Have thoughts? Get in Touch
          </Link>
        </div>
      </main>

      <Footer settings={portfolioData?.settings} socialLinks={portfolioData?.socialLinks} />
    </div>
  );
};

