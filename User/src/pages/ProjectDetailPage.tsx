import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  FolderCode,
} from 'lucide-react';
import { publicApi } from '../services/publicApi.js';
import { Navbar } from '../components/common/Navbar.js';
import { Footer } from '../components/common/Footer.js';
import { ScrollProgress } from '../components/common/ScrollProgress.js';
import { CustomCursor } from '../components/common/CustomCursor.js';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Load project by slug
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['project-detail', slug],
    queryFn: () => publicApi.getProjectBySlug(slug!),
    enabled: !!slug,
  });

  // Fetch site settings for Navbar and Footer
  const { data: portfolioData } = useQuery({
    queryKey: ['portfolio-public'],
    queryFn: () => publicApi.getPortfolio(),
  });

  // Dynamically update document title for SEO
  useEffect(() => {
    if (project?.title) {
      document.title = `${project.title} | Case Study`;
    } else {
      document.title = 'Project Details | Ayush Parekh';
    }
  }, [project]);

  // Scroll to top upon page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-3">
        <ScrollProgress />
        <Loader2 className="w-8 h-8 text-[#e91010] animate-spin" />
        <p className="text-xs font-mono text-neutral-400 tracking-wider">
          LOADING CASE STUDY...
        </p>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
        <p className="text-sm text-neutral-400 max-w-md mb-6">
          {(error as Error)?.message ||
            'The requested case study does not exist or may have been unlisted.'}
        </p>
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold tracking-wide transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] light:bg-[#EAE0D0] light:text-[#1a1a1a] transition-colors">
      <ScrollProgress />
      <CustomCursor />
      <Navbar settings={portfolioData?.settings} />

      <main className="max-w-4xl mx-auto px-6 sm:px-8 pt-32 pb-24">
        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-neutral-400 light:text-neutral-600 hover:text-[#e91010] light:hover:text-[#e91010] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO SHOWCASE</span>
          </Link>
        </motion.div>

        {/* Hero Header */}
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 mb-10"
        >
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e91010]/20 text-[#e91010] border border-[#e91010]/30">
                <Sparkles className="w-3 h-3" />
                Featured Project
              </span>
            )}
            {project.createdAt && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 light:text-neutral-600">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(project.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white light:text-black">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 light:text-neutral-700 leading-relaxed max-w-3xl">
            {project.summary}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold tracking-wide transition-colors shadow-lg shadow-[#e91010]/25"
              >
                <ExternalLink className="w-4 h-4" />
                Launch Live App
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#D5C8B4] hover:border-neutral-500 text-white light:text-black text-xs font-semibold tracking-wide transition-colors"
              >
                <Github className="w-4 h-4" />
                View Repository
              </a>
            )}
          </div>

          {/* Tech Stack Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#262626] light:border-[#C6B7A0]">
              <span className="text-xs font-mono text-neutral-400 light:text-neutral-600 mr-1">
                STACK:
              </span>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[#141414] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] text-neutral-300 light:text-neutral-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        {/* Hero Thumbnail Banner */}
        {project.thumbnailUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 rounded-xl overflow-hidden border border-[#262626] light:border-[#C6B7A0] shadow-2xl bg-neutral-900"
          >
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-auto max-h-[500px] object-cover object-top"
            />
          </motion.div>
        )}

        {/* Detailed Case Study (Markdown) */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-invert light:prose-neutral max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-neutral-300 light:text-neutral-800"
        >
          {project.description ? (
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
              {project.description}
            </ReactMarkdown>
          ) : (
            <p className="italic text-neutral-500">
              No detailed documentation has been published for this project yet.
            </p>
          )}
        </motion.article>

        {/* Gallery Section */}
        {project.galleryUrls && project.galleryUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-14 pt-8 border-t border-[#262626] light:border-[#C6B7A0]"
          >
            <h3 className="text-lg font-bold text-white light:text-black mb-4 flex items-center gap-2">
              <FolderCode className="w-5 h-5 text-[#e91010]" />
              Project Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.galleryUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden border border-[#262626] light:border-[#C6B7A0] bg-neutral-900 group"
                >
                  <img
                    src={url}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom CTA / Return */}
        <div className="mt-16 pt-8 border-t border-[#262626] light:border-[#C6B7A0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 light:text-neutral-600 hover:text-white light:hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Showcase
          </Link>

          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold tracking-wide transition-colors"
          >
            Discuss a Similar Project
          </Link>
        </div>
      </main>

      <Footer settings={portfolioData?.settings} socialLinks={portfolioData?.socialLinks} />
    </div>
  );
};

