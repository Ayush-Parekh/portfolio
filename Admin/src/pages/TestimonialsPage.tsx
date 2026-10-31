import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Testimonial } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/ui/Modal.js';
import { MediaUploader } from '../components/ui/MediaUploader.js';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Quote,
  Loader2,
} from 'lucide-react';

export const TestimonialsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    authorName: '',
    authorRole: '',
    authorCompany: '',
    avatarUrl: '',
    quote: '',
    rating: 5,
    isVisible: true,
  });

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.testimonials.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.testimonials.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      success('Testimonial added!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.testimonials.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      success('Testimonial updated!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.testimonials.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      success('Testimonial deleted!');
    },
    onError: (err: any) => error(err.message),
  });

  const visibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      api.testimonials.setVisibility(id, isVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      success('Visibility updated');
    },
    onError: (err: any) => error(err.message),
  });

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      authorName: '',
      authorRole: '',
      authorCompany: '',
      avatarUrl: '',
      quote: '',
      rating: 5,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({
      authorName: t.authorName,
      authorRole: t.authorRole,
      authorCompany: t.authorCompany || '',
      avatarUrl: t.avatarUrl || '',
      quote: t.quote,
      rating: t.rating,
      isVisible: t.isVisible,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      authorCompany: formData.authorCompany || null,
      avatarUrl: formData.avatarUrl || null,
    };

    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Client & Peer Testimonials</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Endorsements from engineering leaders, clients, and collaborators.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
            <span className="text-xs">Loading testimonials...</span>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No testimonials added yet. (The testimonials section will automatically hide from the visitor site when empty).
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-xl p-5 flex flex-col justify-between gap-4 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        visibilityMutation.mutate({
                          id: t.id,
                          isVisible: !t.isVisible,
                        })
                      }
                      className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        t.isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {t.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{t.isVisible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-neutral-300 light:text-neutral-800 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
                  <div className="flex items-center gap-2.5">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={t.authorName}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                        {t.authorName[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-white light:text-black">{t.authorName}</p>
                      <p className="text-[10px] text-neutral-400">
                        {t.authorRole} {t.authorCompany && `• ${t.authorCompany}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-1 text-neutral-400 hover:text-white rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete testimonial from ${t.authorName}?`)) {
                          deleteMutation.mutate(t.id);
                        }
                      }}
                      className="p-1 text-neutral-400 hover:text-[#e91010] rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Author Name *
              </label>
              <input
                type="text"
                required
                value={formData.authorName}
                onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                placeholder="e.g. Sarah Connor"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Author Role *
              </label>
              <input
                type="text"
                required
                value={formData.authorRole}
                onChange={(e) => setFormData((prev) => ({ ...prev, authorRole: e.target.value }))}
                placeholder="e.g. VP of Engineering"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={formData.authorCompany}
                onChange={(e) => setFormData((prev) => ({ ...prev, authorCompany: e.target.value }))}
                placeholder="e.g. Stripe, Acme Corp"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Rating (1 - 5 Stars)
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: parseInt(e.target.value, 10) }))}
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>
          </div>

          <MediaUploader
            label="Author Photo / Avatar"
            value={formData.avatarUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, avatarUrl: url || '' }))}
          />

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Quote *</label>
            <textarea
              required
              rows={4}
              value={formData.quote}
              onChange={(e) => setFormData((prev) => ({ ...prev, quote: e.target.value }))}
              placeholder="Ayush engineered a robust API and delivered with exceptional velocity..."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="testVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))}
              className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
            />
            <label htmlFor="testVisible" className="text-xs font-medium text-neutral-300 cursor-pointer">
              Visible on Portfolio
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-[#262626] rounded-lg text-xs font-medium text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold rounded-lg shadow-md shadow-[#e91010]/20"
            >
              {editingTestimonial ? 'Save Changes' : 'Create Testimonial'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
