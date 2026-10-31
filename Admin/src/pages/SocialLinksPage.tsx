import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { SocialLink } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/ui/Modal.js';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Share2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';

export const SocialLinksPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    iconKey: 'github',
    isVisible: true,
  });

  const { data: socialLinks = [], isLoading } = useQuery({
    queryKey: ['social-links'],
    queryFn: () => api.socialLinks.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.socialLinks.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      success('Social link added!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.socialLinks.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      success('Social link updated!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.socialLinks.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      success('Social link deleted!');
    },
    onError: (err: any) => error(err.message),
  });

  const reorderMutation = useMutation({
    mutationFn: (items: Array<{ id: string; displayOrder: number }>) =>
      api.socialLinks.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      success('Order saved');
    },
    onError: (err: any) => error(err.message),
  });

  const visibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      api.socialLinks.setVisibility(id, isVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      success('Visibility updated');
    },
    onError: (err: any) => error(err.message),
  });

  const openCreateModal = () => {
    setEditingSocial(null);
    setFormData({
      platform: '',
      url: '',
      iconKey: 'github',
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (social: SocialLink) => {
    setEditingSocial(social);
    setFormData({
      platform: social.platform,
      url: social.url,
      iconKey: social.iconKey,
      isVisible: social.isVisible,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSocial) {
      updateMutation.mutate({ id: editingSocial.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;

    const reordered = [...socialLinks];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const payload = reordered.map((item, idx) => ({
      id: item.id,
      displayOrder: idx + 1,
    }));

    reorderMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Social Profiles & Links</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            External platform handles displayed in the hero, contact, and footer sections.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Link</span>
        </button>
      </div>

      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
            <span className="text-xs">Loading social links...</span>
          </div>
        ) : socialLinks.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No social links added yet. Click &ldquo;Add Social Link&rdquo; to connect your profiles.
          </div>
        ) : (
          <div className="divide-y divide-[#262626] light:divide-[#C6B7A0]">
            {socialLinks.map((social, idx) => (
              <div
                key={social.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#161616] light:hover:bg-[#D8CABE] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex flex-col items-center gap-0.5">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[10px] text-neutral-500 font-bold">{idx + 1}</span>
                    <button
                      disabled={idx === socialLinks.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2 rounded-lg bg-[#181818] border border-[#262626] text-[#e91010]">
                    <Share2 className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white light:text-black">
                        {social.platform}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500">
                        ({social.iconKey})
                      </span>
                    </div>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-neutral-400 hover:text-[#e91010] flex items-center gap-1 truncate max-w-md"
                    >
                      <span>{social.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() =>
                      visibilityMutation.mutate({
                        id: social.id,
                        isVisible: !social.isVisible,
                      })
                    }
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      social.isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {social.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{social.isVisible ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(social)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${social.platform} link?`)) {
                        deleteMutation.mutate(social.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-[#e91010] rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
        title={editingSocial ? 'Edit Social Link' : 'Add Social Link'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Platform Name *
            </label>
            <input
              type="text"
              required
              value={formData.platform}
              onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
              placeholder="e.g. GitHub, LinkedIn, X, Medium"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Destination URL *
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Icon Key *
            </label>
            <input
              type="text"
              required
              value={formData.iconKey}
              onChange={(e) => setFormData((prev) => ({ ...prev, iconKey: e.target.value }))}
              placeholder="e.g. github, linkedin, twitter, mail"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="socVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))}
              className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
            />
            <label htmlFor="socVisible" className="text-xs font-medium text-neutral-300 cursor-pointer">
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
              {editingSocial ? 'Save Changes' : 'Create Link'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
