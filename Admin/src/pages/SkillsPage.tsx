import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Skill, SkillCategory } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/ui/Modal.js';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Cpu,
  FolderPlus,
  Loader2,
  Percent,
} from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [categoryName, setCategoryName] = useState('');
  const [skillForm, setSkillForm] = useState({
    name: '',
    proficiencyPercentage: 85,
    iconKey: '',
    categoryId: '',
    isVisible: true,
  });

  const { data: categorizedData = [], isLoading } = useQuery({
    queryKey: ['categorized-skills'],
    queryFn: () => api.skills.getCategorized(),
  });

  // Category Mutations
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => api.skillCategories.create({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorized-skills'] });
      success('Category added!');
      setIsCategoryModalOpen(false);
      setCategoryName('');
    },
    onError: (err: any) => error(err.message),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => api.skillCategories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorized-skills'] });
      success('Category deleted!');
    },
    onError: (err: any) => error(err.message),
  });

  // Skill Mutations
  const createSkillMutation = useMutation({
    mutationFn: (data: any) => api.skills.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorized-skills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Skill created!');
      setIsSkillModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const updateSkillMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.skills.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorized-skills'] });
      success('Skill updated!');
      setIsSkillModalOpen(false);
    },
    onError: (err: any) => error(err.message),
  });

  const deleteSkillMutation = useMutation({
    mutationFn: (id: string) => api.skills.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorized-skills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Skill removed!');
    },
    onError: (err: any) => error(err.message),
  });

  const visibilitySkillMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      api.skills.setVisibility(id, isVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorized-skills'] });
      success('Visibility updated');
    },
    onError: (err: any) => error(err.message),
  });

  const openAddSkillModal = (catId: string) => {
    setSelectedCategoryId(catId);
    setEditingSkill(null);
    setSkillForm({
      name: '',
      proficiencyPercentage: 85,
      iconKey: '',
      categoryId: catId,
      isVisible: true,
    });
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: Skill) => {
    setEditingSkill(skill);
    setSelectedCategoryId(skill.categoryId);
    setSkillForm({
      name: skill.name,
      proficiencyPercentage: skill.proficiencyPercentage,
      iconKey: skill.iconKey || '',
      categoryId: skill.categoryId,
      isVisible: skill.isVisible,
    });
    setIsSkillModalOpen(true);
  };

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...skillForm,
      categoryId: selectedCategoryId,
      iconKey: skillForm.iconKey || null,
    };

    if (editingSkill) {
      updateSkillMutation.mutate({ id: editingSkill.id, data: payload });
    } else {
      createSkillMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Technical Skills & Competencies</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Organize skills by categories with proficiency levels and icon references.
          </p>
        </div>

        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 shrink-0 cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
          <span className="text-xs">Loading skills...</span>
        </div>
      ) : categorizedData.length === 0 ? (
        <div className="p-12 text-center text-xs text-neutral-400 border border-[#262626] rounded-xl bg-[#121212]">
          No skill categories found. Click &ldquo;Add Category&rdquo; to begin organizing your skills.
        </div>
      ) : (
        <div className="space-y-6">
          {categorizedData.map((category) => (
            <div
              key={category.id}
              className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden shadow-sm"
            >
              {/* Category Header */}
              <div className="px-6 py-3.5 bg-[#181818] light:bg-[#D5C8B4] border-b border-[#262626] light:border-[#C6B7A0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#e91010]" />
                  <h2 className="font-bold text-xs text-white light:text-black uppercase tracking-wider">
                    {category.name}
                  </h2>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    ({category.skills.length} skills)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAddSkillModal(category.id)}
                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold rounded flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Skill</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${category.name}" and all its skills?`)) {
                        deleteCategoryMutation.mutate(category.id);
                      }
                    }}
                    className="p-1 text-neutral-400 hover:text-[#e91010] transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="p-4">
                {category.skills.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-3 text-center">
                    No skills in this category yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-lg p-3 flex flex-col justify-between gap-3 group hover:border-neutral-600 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-white light:text-black">
                              {skill.name}
                            </span>
                            {skill.iconKey && (
                              <span className="font-mono text-[10px] text-neutral-500 block">
                                icon: {skill.iconKey}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs font-bold text-[#e91010]">
                            {skill.proficiencyPercentage}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#e91010] h-full rounded-full transition-all duration-300"
                            style={{ width: `${skill.proficiencyPercentage}%` }}
                          />
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#262626]/50">
                          <button
                            onClick={() =>
                              visibilitySkillMutation.mutate({
                                id: skill.id,
                                isVisible: !skill.isVisible,
                              })
                            }
                            className={`flex items-center gap-1 text-[10px] font-semibold ${
                              skill.isVisible ? 'text-emerald-400' : 'text-neutral-500'
                            }`}
                          >
                            {skill.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{skill.isVisible ? 'Visible' : 'Hidden'}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditSkillModal(skill)}
                              className="p-1 text-neutral-400 hover:text-white"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove skill "${skill.name}"?`)) {
                                  deleteSkillMutation.mutate(skill.id);
                                }
                              }}
                              className="p-1 text-neutral-400 hover:text-[#e91010]"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Add Skill Category"
        maxWidth="sm"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCategoryMutation.mutate(categoryName);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Frontend Engineering, Databases"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-3 py-1.5 border border-[#262626] rounded-md text-xs text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCategoryMutation.isPending}
              className="px-3 py-1.5 bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold rounded-md shadow-md"
            >
              {createCategoryMutation.isPending ? 'Saving...' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        maxWidth="md"
      >
        <form onSubmit={handleSkillSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Skill / Technology Name *
            </label>
            <input
              type="text"
              required
              value={skillForm.name}
              onChange={(e) => setSkillForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. React.js, PostgreSQL, Docker"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-300 uppercase flex items-center gap-1">
                <Percent className="w-3 h-3 text-[#e91010]" />
                <span>Proficiency Level: {skillForm.proficiencyPercentage}%</span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={skillForm.proficiencyPercentage}
              onChange={(e) =>
                setSkillForm((prev) => ({ ...prev, proficiencyPercentage: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-[#e91010] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Icon Key (Lucide icon identifier)
            </label>
            <input
              type="text"
              value={skillForm.iconKey}
              onChange={(e) => setSkillForm((prev) => ({ ...prev, iconKey: e.target.value }))}
              placeholder="e.g. react, nodejs, database, git"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="skillVisible"
              checked={skillForm.isVisible}
              onChange={(e) => setSkillForm((prev) => ({ ...prev, isVisible: e.target.checked }))}
              className="w-4 h-4 rounded text-[#e91010] focus:ring-0 bg-[#181818] border-[#262626]"
            />
            <label htmlFor="skillVisible" className="text-xs font-medium text-neutral-300 cursor-pointer">
              Visible on Portfolio
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => setIsSkillModalOpen(false)}
              className="px-3 py-1.5 border border-[#262626] rounded-md text-xs text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSkillMutation.isPending || updateSkillMutation.isPending}
              className="px-4 py-1.5 bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold rounded-md shadow-md"
            >
              {editingSkill ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
