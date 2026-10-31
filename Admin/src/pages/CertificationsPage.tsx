import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Certification } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/ui/Modal.js';
import { MediaUploader } from '../components/ui/MediaUploader.js';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Award,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';

export const CertificationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    certificateImageUrl: '',
    isVisible: true,
  });

  const { data: certifications = [], isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: () => api.certifications.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.certifications.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      success('Certification created!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.certifications.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      success('Certification updated!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.certifications.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      success('Certification deleted!');
    },
    onError: (err: any) => error(err.message),
  });

  const reorderMutation = useMutation({
    mutationFn: (items: Array<{ id: string; displayOrder: number }>) =>
      api.certifications.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      success('Order saved');
    },
    onError: (err: any) => error(err.message),
  });

  const visibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      api.certifications.setVisibility(id, isVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      success('Visibility updated');
    },
    onError: (err: any) => error(err.message),
  });

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      name: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
      certificateImageUrl: '',
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      credentialUrl: cert.credentialUrl || '',
      certificateImageUrl: cert.certificateImageUrl || '',
      isVisible: cert.isVisible,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      credentialUrl: formData.credentialUrl || null,
      certificateImageUrl: formData.certificateImageUrl || null,
    };

    if (editingCert) {
      updateMutation.mutate({ id: editingCert.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certifications.length) return;

    const reordered = [...certifications];
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
          <h1 className="text-xl font-bold tracking-tight">Certifications & Credentials</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Showcase verified industry licenses, certificates, and badges.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
            <span className="text-xs">Loading certifications...</span>
          </div>
        ) : certifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No certifications added yet. Click &ldquo;Add Certification&rdquo; to showcase your credentials.
          </div>
        ) : (
          <div className="divide-y divide-[#262626] light:divide-[#C6B7A0]">
            {certifications.map((cert, idx) => (
              <div
                key={cert.id}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#161616] light:hover:bg-[#D8CABE] transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="flex flex-col items-center gap-0.5 pt-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[10px] text-neutral-500 font-bold">{idx + 1}</span>
                    <button
                      disabled={idx === certifications.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white light:text-black">{cert.name}</span>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-400 hover:text-[#e91010]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-[#e91010] font-semibold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>{cert.issuer}</span>
                      <span className="text-neutral-500">• {cert.issueDate}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <button
                    onClick={() =>
                      visibilityMutation.mutate({
                        id: cert.id,
                        isVisible: !cert.isVisible,
                      })
                    }
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${
                      cert.isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {cert.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{cert.isVisible ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete certification "${cert.name}"?`)) {
                        deleteMutation.mutate(cert.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-[#e91010] rounded"
                  >
                    <Trash2 className="w-4 h-4" />
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
        title={editingCert ? 'Edit Certification' : 'Add Certification'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Certificate Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={formData.issuer}
                onChange={(e) => setFormData((prev) => ({ ...prev, issuer: e.target.value }))}
                placeholder="e.g. Amazon Web Services, Google"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Issue Date *
              </label>
              <input
                type="text"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: e.target.value }))}
                placeholder="e.g. 2024"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Verification / Credential URL
            </label>
            <input
              type="url"
              value={formData.credentialUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, credentialUrl: e.target.value }))}
              placeholder="https://credly.com/..."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <MediaUploader
            label="Certificate Badge / Image (Cloudinary)"
            value={formData.certificateImageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, certificateImageUrl: url || '' }))}
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="certVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))}
              className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
            />
            <label htmlFor="certVisible" className="text-xs font-medium text-neutral-300 cursor-pointer">
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
              {editingCert ? 'Save Changes' : 'Create Certificate'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
