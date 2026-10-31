import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Project } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/ui/Modal.js';
import { MediaUploader } from '../components/ui/MediaUploader.js';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Github,
  Star,
  Search,
  Loader2,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    thumbnailUrl: '',
    tags: '',
    liveUrl: '',
    githubUrl: '',
    isFeatured: false,
    isVisible: true,
  });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.projects.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.projects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Project created successfully!');
      closeModal();
    },
    onError: (err: any) => error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.projects.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      success('Project updated successfully!');
      closeModal();
    },
    onError: (err: any) => error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.projects.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Project removed successfully!');
      setDeletingId(null);
    },
    onError: (err: any) => error(err.message),
  });

  const visibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      api.projects.setVisibility(id, isVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      success('Visibility updated');
    },
    onError: (err: any) => error(err.message),
  });

  const reorderMutation = useMutation({
    mutationFn: (items: Array<{ id: string; displayOrder: number }>) =>
      api.projects.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      success('Order saved');
    },
    onError: (err: any) => error(err.message),
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      description: '',
      thumbnailUrl: '',
      tags: '',
      liveUrl: '',
      githubUrl: '',
      isFeatured: false,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      summary: proj.summary,
      description: proj.description,
      thumbnailUrl: proj.thumbnailUrl || '',
      tags: proj.tags?.join(', ') || '',
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      isFeatured: proj.isFeatured,
      isVisible: proj.isVisible,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      thumbnailUrl: formData.thumbnailUrl || null,
      liveUrl: formData.liveUrl || null,
      githubUrl: formData.githubUrl || null,
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const payload = reordered.map((item, idx) => ({
      id: item.id,
      displayOrder: idx + 1,
    }));

    reorderMutation.mutate(payload);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Showcase Projects</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Manage your project portfolio, case studies, technology badges, and display orders.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] px-3.5 py-2 rounded-lg">
        <Search className="w-4 h-4 text-neutral-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter projects by title, summary, or tag..."
          className="w-full bg-transparent text-xs text-white light:text-black placeholder-neutral-500 outline-none"
        />
      </div>

      {/* Projects Table / Card List */}
      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
            <span className="text-xs">Loading projects from PostgreSQL...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No projects match your filter. Click &ldquo;Add Project&rdquo; to create your first showcase item.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] light:bg-[#D5C8B4] border-b border-[#262626] light:border-[#C6B7A0] text-neutral-400 light:text-neutral-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Rank</th>
                  <th className="py-3 px-4 w-16">Preview</th>
                  <th className="py-3 px-4">Project Details</th>
                  <th className="py-3 px-4">Technologies</th>
                  <th className="py-3 px-4 text-center">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] light:divide-[#C6B7A0]">
                {filteredProjects.map((project, idx) => (
                  <tr
                    key={project.id}
                    className="hover:bg-[#161616] light:hover:bg-[#D8CABE] transition-colors"
                  >
                    {/* Rank Reordering */}
                    <td className="py-3 px-2 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 transition-opacity"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-[10px] text-neutral-500 font-bold">
                          {idx + 1}
                        </span>
                        <button
                          disabled={idx === filteredProjects.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 transition-opacity"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Thumbnail Preview */}
                    <td className="py-3 px-4">
                      {project.thumbnailUrl ? (
                        <img
                          src={project.thumbnailUrl}
                          alt={project.title}
                          className="w-12 h-12 object-cover rounded-md border border-neutral-700 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-500 text-[10px]">
                          No Media
                        </div>
                      )}
                    </td>

                    {/* Title & Summary */}
                    <td className="py-3 px-4 max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white light:text-black">{project.title}</span>
                        {project.isFeatured && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-semibold rounded">
                            <Star className="w-3 h-3 fill-amber-400" /> Featured
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 light:text-neutral-600 truncate mt-0.5">
                        {project.summary}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-neutral-500">
                          /projects/{project.slug}
                        </span>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-400 hover:text-[#e91010]"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-400 hover:text-[#e91010]"
                          >
                            <Github className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.tags?.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 bg-[#1f1f1f] light:bg-[#C6B7A0] text-neutral-300 light:text-neutral-800 text-[10px] rounded font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Visibility Switch */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          visibilityMutation.mutate({
                            id: project.id,
                            isVisible: !project.isVisible,
                          })
                        }
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                          project.isVisible
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {project.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{project.isVisible ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-1.5 text-neutral-400 hover:text-white light:hover:text-black hover:bg-neutral-800 light:hover:bg-neutral-300 rounded transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(project.id)}
                          className="p-1.5 text-neutral-400 hover:text-[#e91010] hover:bg-neutral-800 light:hover:bg-neutral-300 rounded transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit Showcase Project' : 'Add New Showcase Project'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    // Auto generate slug if creating
                    slug: !editingProject
                      ? title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, '')
                      : prev.slug,
                  }));
                }}
                placeholder="e.g. Dynamic Portfolio Platform"
                className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="dynamic-portfolio-platform"
                className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs font-mono text-white light:text-black outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
              Short Summary *
            </label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="A brief 1-2 sentence overview shown on the card"
              className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
              Deep Case Study / Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed architecture, engineering decisions, and metrics"
              className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
            />
          </div>

          {/* Media Uploader for Project Cover */}
          <MediaUploader
            label="Project Thumbnail (Cloudinary)"
            value={formData.thumbnailUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, thumbnailUrl: url || '' }))}
          />

          <div>
            <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
              Technologies / Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
              placeholder="React, TypeScript, Express, PostgreSQL, Tailwind"
              className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://myproject.com"
                className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/Ayush-Parekh/..."
                className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 light:text-neutral-700">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
              />
              <span>Mark as Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 light:text-neutral-700">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))}
                className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
              />
              <span>Visible on Portfolio</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626] light:border-[#C6B7A0]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-[#262626] light:border-[#C6B7A0] rounded-lg text-xs font-medium text-neutral-300 light:text-neutral-700 hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Confirm Project Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-300 light:text-neutral-700 leading-relaxed">
            Are you sure you want to delete this project? This will permanently remove its case study and details from the database.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setDeletingId(null)}
              className="px-3 py-1.5 border border-[#262626] rounded-md text-xs text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              disabled={deleteMutation.isPending}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-md"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
