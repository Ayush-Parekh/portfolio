import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { BlogPost } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/ui/Modal.js';
import { MediaUploader } from '../components/ui/MediaUploader.js';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Clock,
  Search,
  Loader2,
  FileText,
} from 'lucide-react';

export const BlogPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    tags: '',
    readingTimeMinutes: 5,
    isPublished: true,
  });

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => api.blog.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.blog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Article created successfully!');
      closeModal();
    },
    onError: (err: any) => error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.blog.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      success('Article updated successfully!');
      closeModal();
    },
    onError: (err: any) => error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.blog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Article deleted successfully!');
      setDeletingId(null);
    },
    onError: (err: any) => error(err.message),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      api.blog.togglePublish(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      success('Publication status updated');
    },
    onError: (err: any) => error(err.message),
  });

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '## Introduction\n\nWrite your technical article in Markdown here...',
      coverImageUrl: '',
      tags: '',
      readingTimeMinutes: 5,
      isPublished: true,
    });
    setActiveTab('editor');
    setIsModalOpen(true);
  };

  const openEditModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImageUrl: blog.coverImageUrl || '',
      tags: blog.tags?.join(', ') || '',
      readingTimeMinutes: blog.readingTimeMinutes,
      isPublished: blog.isPublished,
    });
    setActiveTab('editor');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      coverImageUrl: formData.coverImageUrl || null,
    };

    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredPosts = blogPosts.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Technical Blog & Articles</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Publish markdown articles, architecture write-ups, and engineering thoughts.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write Article</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] px-3.5 py-2 rounded-lg">
        <Search className="w-4 h-4 text-neutral-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter articles by title, excerpt, or tag..."
          className="w-full bg-transparent text-xs text-white light:text-black placeholder-neutral-500 outline-none"
        />
      </div>

      {/* Articles Table */}
      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
            <span className="text-xs">Loading articles...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No articles match your filter. Click &ldquo;Write Article&rdquo; to publish your first post.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] light:bg-[#D5C8B4] border-b border-[#262626] light:border-[#C6B7A0] text-neutral-400 light:text-neutral-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-16">Cover</th>
                  <th className="py-3 px-4">Title & Excerpt</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4 text-center">Reading Time</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] light:divide-[#C6B7A0]">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-[#161616] light:hover:bg-[#D8CABE] transition-colors"
                  >
                    <td className="py-3 px-4">
                      {post.coverImageUrl ? (
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-12 h-12 object-cover rounded-md border border-neutral-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-500 text-[10px]">
                          <BookOpen className="w-4 h-4" />
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <p className="font-bold text-white light:text-black">{post.title}</p>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{post.excerpt}</p>
                      <p className="font-mono text-[10px] text-neutral-500 mt-1">/blog/{post.slug}</p>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {post.tags?.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 bg-[#1f1f1f] light:bg-[#C6B7A0] text-neutral-300 light:text-neutral-800 text-[10px] rounded font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-neutral-400">
                        <Clock className="w-3 h-3" />
                        {post.readingTimeMinutes} min
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          publishMutation.mutate({
                            id: post.id,
                            isPublished: !post.isPublished,
                          })
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                          post.isPublished
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {post.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{post.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(post)}
                          className="p-1.5 text-neutral-400 hover:text-white light:hover:text-black hover:bg-neutral-800 rounded transition-colors"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(post.id)}
                          className="p-1.5 text-neutral-400 hover:text-[#e91010] hover:bg-neutral-800 rounded transition-colors"
                          title="Delete Article"
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

      {/* Create / Edit Article Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBlog ? 'Edit Technical Article' : 'Write New Article'}
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
                Article Title *
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
                    slug: !editingBlog
                      ? title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, '')
                      : prev.slug,
                  }));
                }}
                placeholder="e.g. Architecting a Full-Stack System"
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
                placeholder="architecting-full-stack-system"
                className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs font-mono text-white light:text-black outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
              Short Excerpt *
            </label>
            <input
              type="text"
              required
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="A concise summary of the article"
              className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
            />
          </div>

          <MediaUploader
            label="Cover Image (Cloudinary)"
            value={formData.coverImageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, coverImageUrl: url || '' }))}
          />

          {/* Markdown Content with Tab Switcher */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <label className="text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#e91010]" />
                <span>Markdown Body *</span>
              </label>
              <div className="flex items-center gap-1 bg-[#181818] p-0.5 rounded-lg border border-[#262626]">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
                    activeTab === 'editor' ? 'bg-[#e91010] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
                    activeTab === 'preview' ? 'bg-[#e91010] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {activeTab === 'editor' ? (
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Markdown formatted text..."
                className="w-full font-mono bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg p-3 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
              />
            ) : (
              <div className="p-4 bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] rounded-lg min-h-[200px] text-xs text-neutral-300 light:text-neutral-800 whitespace-pre-wrap font-sans">
                {formData.content}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="Architecture, Node.js, Performance"
                className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1">
                Estimated Reading Time (Minutes)
              </label>
              <input
                type="number"
                min={1}
                value={formData.readingTimeMinutes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, readingTimeMinutes: parseInt(e.target.value, 10) || 5 }))
                }
                className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg px-3 py-2 text-xs text-white light:text-black outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 light:text-neutral-700">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
              />
              <span>Publish immediately</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626] light:border-[#C6B7A0]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-[#262626] rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>{editingBlog ? 'Save Article' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Confirm Article Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-300 leading-relaxed">
            Are you sure you want to delete this article? This action cannot be undone.
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
