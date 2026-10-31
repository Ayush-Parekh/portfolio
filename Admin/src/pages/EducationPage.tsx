import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Education } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/ui/Modal.js';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  Calendar,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';

export const EducationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    description: '',
    isVisible: true,
  });

  const { data: educationList = [], isLoading } = useQuery({
    queryKey: ['education'],
    queryFn: () => api.education.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.education.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      success('Education entry added!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.education.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      success('Education entry updated!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.education.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      success('Education entry deleted!');
    },
    onError: (err: any) => error(err.message),
  });

  const reorderMutation = useMutation({
    mutationFn: (items: Array<{ id: string; displayOrder: number }>) =>
      api.education.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      success('Order saved');
    },
    onError: (err: any) => error(err.message),
  });

  const visibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      api.education.setVisibility(id, isVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      success('Visibility updated');
    },
    onError: (err: any) => error(err.message),
  });

  const openCreateModal = () => {
    setEditingEdu(null);
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEdu(edu);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      grade: edu.grade || '',
      description: edu.description || '',
      isVisible: edu.isVisible,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      endDate: formData.endDate || null,
      grade: formData.grade || null,
      description: formData.description || null,
    };

    if (editingEdu) {
      updateMutation.mutate({ id: editingEdu.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= educationList.length) return;

    const reordered = [...educationList];
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Education History</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Degrees, academic programs, and universities.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
            <span className="text-xs">Loading education records...</span>
          </div>
        ) : educationList.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No education records added yet. Click &ldquo;Add Education&rdquo; to insert your academic background.
          </div>
        ) : (
          <div className="divide-y divide-[#262626] light:divide-[#C6B7A0]">
            {educationList.map((edu, idx) => (
              <div
                key={edu.id}
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
                      disabled={idx === educationList.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white light:text-black">
                        {edu.degree} in {edu.fieldOfStudy}
                      </span>
                      {edu.grade && (
                        <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] rounded font-mono">
                          {edu.grade}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#e91010] font-semibold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{edu.institution}</span>
                    </p>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </p>
                    {edu.description && (
                      <p className="text-xs text-neutral-400 pt-1 line-clamp-2">{edu.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <button
                    onClick={() =>
                      visibilityMutation.mutate({
                        id: edu.id,
                        isVisible: !edu.isVisible,
                      })
                    }
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${
                      edu.isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {edu.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{edu.isVisible ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(edu)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete education at ${edu.institution}?`)) {
                        deleteMutation.mutate(edu.id);
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
        title={editingEdu ? 'Edit Education' : 'Add Education Record'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Institution / University *
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData((prev) => ({ ...prev, institution: e.target.value }))}
              placeholder="e.g. Gujarat Technological University"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Degree *</label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
                placeholder="e.g. Bachelor of Engineering"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Field of Study *
              </label>
              <input
                type="text"
                required
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData((prev) => ({ ...prev, fieldOfStudy: e.target.value }))}
                placeholder="e.g. Computer Science"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Start Date *</label>
              <input
                type="text"
                required
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                placeholder="e.g. 2022"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">End Date</label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                placeholder="e.g. 2026 or Present"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Grade / CGPA</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData((prev) => ({ ...prev, grade: e.target.value }))}
                placeholder="e.g. 8.5 CGPA"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Specialized coursework, honors, or thesis topic"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="eduVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))}
              className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
            />
            <label htmlFor="eduVisible" className="text-xs font-medium text-neutral-300 cursor-pointer">
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
              {editingEdu ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
