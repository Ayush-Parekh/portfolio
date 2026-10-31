import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Experience } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/ui/Modal.js';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Calendar,
  MapPin,
  Loader2,
} from 'lucide-react';

export const ExperiencesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    employmentType: 'Full-time',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievements: '',
    isVisible: true,
  });

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => api.experiences.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.experiences.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Experience milestone added!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.experiences.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      success('Experience updated!');
      setIsModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.experiences.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Experience milestone deleted!');
    },
    onError: (err: any) => error(err.message),
  });

  const reorderMutation = useMutation({
    mutationFn: (items: Array<{ id: string; displayOrder: number }>) =>
      api.experiences.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      success('Order saved');
    },
    onError: (err: any) => error(err.message),
  });

  const visibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      api.experiences.setVisibility(id, isVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      success('Visibility updated');
    },
    onError: (err: any) => error(err.message),
  });

  const openCreateModal = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      role: '',
      location: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: '',
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location || '',
      employmentType: exp.employmentType || 'Full-time',
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent,
      description: exp.description || '',
      achievements: exp.achievements?.join('\n') || '',
      isVisible: exp.isVisible,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      achievements: formData.achievements
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean),
      endDate: formData.isCurrent ? 'Present' : formData.endDate || null,
      location: formData.location || null,
      description: formData.description || null,
    };

    if (editingExp) {
      updateMutation.mutate({ id: editingExp.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const reordered = [...experiences];
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
          <h1 className="text-xl font-bold tracking-tight">Work Experience</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Professional timeline milestones shown with scroll-draw animation on the visitor site.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
            <span className="text-xs">Loading experience entries...</span>
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No experience entries yet. Click &ldquo;Add Experience&rdquo; to add your career history.
          </div>
        ) : (
          <div className="divide-y divide-[#262626] light:divide-[#C6B7A0]">
            {experiences.map((exp, idx) => (
              <div
                key={exp.id}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#161616] light:hover:bg-[#D8CABE] transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Rank buttons */}
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
                      disabled={idx === experiences.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white light:text-black">{exp.role}</span>
                      <span className="text-xs text-[#e91010] font-semibold">@ {exp.company}</span>
                      {exp.isCurrent && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      )}
                      {exp.employmentType && (
                        <span className="flex items-center gap-1 font-mono text-neutral-500">
                          <Briefcase className="w-3 h-3" />
                          {exp.employmentType}
                        </span>
                      )}
                    </div>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-neutral-300 light:text-neutral-700 pt-1 space-y-0.5">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="line-clamp-1">
                            {ach}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <button
                    onClick={() =>
                      visibilityMutation.mutate({
                        id: exp.id,
                        isVisible: !exp.isVisible,
                      })
                    }
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${
                      exp.isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {exp.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{exp.isVisible ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete experience at ${exp.company}?`)) {
                        deleteMutation.mutate(exp.id);
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Edit Experience' : 'Add Experience Milestone'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Company *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="e.g. Google, TechCorp"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Role / Job Title *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Remote / Gandhinagar, India"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData((prev) => ({ ...prev, employmentType: e.target.value }))}
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Start Date *</label>
              <input
                type="text"
                required
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                placeholder="e.g. Jan 2024"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">End Date</label>
              <input
                type="text"
                disabled={formData.isCurrent}
                value={formData.isCurrent ? 'Present' : formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                placeholder="e.g. Dec 2024 or Present"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010] disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
              <input
                type="checkbox"
                checked={formData.isCurrent}
                onChange={(e) => setFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))}
                className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
              />
              <span>I currently work here</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))}
                className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
              />
              <span>Visible on Portfolio</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Key Achievements / Bullet Points (One per line)
            </label>
            <textarea
              rows={4}
              value={formData.achievements}
              onChange={(e) => setFormData((prev) => ({ ...prev, achievements: e.target.value }))}
              placeholder="Architected microservices that improved throughput by 40%&#10;Mentored 4 junior engineers on React best practices"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs text-white outline-none focus:border-[#e91010]"
            />
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
              className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-[#e91010]/20"
            >
              {editingExp ? 'Save Changes' : 'Create Milestone'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
