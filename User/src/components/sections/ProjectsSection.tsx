import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types/index.js';
import { FolderGit2, ExternalLink, Github, ArrowRight, Star, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectsSectionProps {
  projects?: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects = [] }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  if (projects.length === 0) return null;

  // Extract unique tags across projects
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags || []))
  );

  const filteredProjects =
    selectedTag === 'All'
      ? projects
      : projects.filter((p) => p.tags?.includes(selectedTag));

  return (
    <section id="projects" className="py-24 border-t border-[#262626] light:border-[#C6B7A0] relative">
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
            <FolderGit2 className="w-4 h-4" />
            <span>Showcase of Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-black">
            Featured Projects
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 max-w-xl mx-auto">
            Deep dive into selected case studies, web applications, and architectural experiments.
          </p>
        </motion.div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Project category filters">
            <button
              onClick={() => setSelectedTag('All')}
              aria-label="Show all projects"
              aria-pressed={selectedTag === 'All'}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] ${
                selectedTag === 'All'
                  ? 'bg-[#e91010] text-white shadow-md shadow-[#e91010]/20'
                  : 'bg-[#141414] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] text-neutral-400 light:text-neutral-700 hover:text-white light:hover:text-black'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                aria-label={`Filter projects by ${tag}`}
                aria-pressed={selectedTag === tag}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] ${
                  selectedTag === tag
                    ? 'bg-[#e91010] text-white shadow-md shadow-[#e91010]/20'
                    : 'bg-[#141414] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] text-neutral-400 light:text-neutral-700 hover:text-white light:hover:text-black'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-[#141414] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-2xl max-w-md mx-auto p-6">
            <Layers className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-sm font-semibold text-neutral-300 light:text-neutral-800">
              No projects match the #{selectedTag} filter
            </p>
            <button
              onClick={() => setSelectedTag('All')}
              className="text-xs text-[#e91010] underline underline-offset-4 hover:text-[#c80c0c]"
            >
              Reset to view all projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-[#141414] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#e91010]/50 transition-all duration-300 shadow-sm"
              >
                <div>
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 border-b border-[#262626] light:border-[#C6B7A0]">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={`Screenshot of ${project.title}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
                        [Case Study Preview]
                      </div>
                    )}

                    {/* Featured Badge */}
                    {project.isFeatured && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#e91010] text-white text-[10px] font-bold shadow-md">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-white light:text-black group-hover:text-[#e91010] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-400 light:text-neutral-700 line-clamp-2 leading-relaxed">
                      {project.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags?.map((tag) => (
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

                {/* Card Footer */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-[#262626]/50 light:border-[#C6B7A0]/50 mt-4">
                  <Link
                    to={`/projects/${project.slug}`}
                    aria-label={`Read case study for ${project.title}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white light:text-black group-hover:text-[#e91010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] rounded p-1"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${project.title} source code on GitHub`}
                        title="GitHub Repository"
                        className="p-2 rounded-lg border border-[#262626] light:border-[#C6B7A0] bg-[#1a1a1a] light:bg-[#D5C8B4] text-neutral-400 light:text-neutral-700 hover:text-[#e91010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Launch live demo of ${project.title}`}
                        title="Live Demo"
                        className="p-2 rounded-lg border border-[#262626] light:border-[#C6B7A0] bg-[#1a1a1a] light:bg-[#D5C8B4] text-neutral-400 light:text-neutral-700 hover:text-[#e91010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
