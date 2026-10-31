import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import { MediaUploader } from '../components/ui/MediaUploader.js';
import { Settings, Save, Loader2, Sparkles, Globe, UserCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => api.getSettings(),
  });

  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    tagline: '',
    bio: '',
    avatarUrl: '',
    resumeUrl: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    primaryAccent: '#e91010',
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        fullName: settings.fullName || '',
        title: settings.title || '',
        tagline: settings.tagline || '',
        bio: settings.bio || '',
        avatarUrl: settings.avatarUrl || '',
        resumeUrl: settings.resumeUrl || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        location: settings.location || '',
        primaryAccent: settings.primaryAccent || '#e91010',
        seoTitle: settings.seoTitle || '',
        seoDescription: settings.seoDescription || '',
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      success('Portfolio settings updated successfully!');
    },
    onError: (err: any) => error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      avatarUrl: formData.avatarUrl || null,
      resumeUrl: formData.resumeUrl || null,
      contactPhone: formData.contactPhone || null,
      location: formData.location || null,
      seoTitle: formData.seoTitle || null,
      seoDescription: formData.seoDescription || null,
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
        <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
        <span className="text-xs">Loading site configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Site Settings & Profile</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Control personal bio, assets, contact information, accent theme, and SEO metadata.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20 disabled:opacity-50 cursor-pointer"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#262626]">
            <UserCheck className="w-4 h-4 text-[#e91010]" />
            <h2 className="text-sm font-bold tracking-wide">Personal Details & Hero Copy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Professional Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              Hero Tagline / Subtitle *
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              About Bio *
            </label>
            <textarea
              required
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <MediaUploader
              label="Profile Photo (Avatar)"
              value={formData.avatarUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, avatarUrl: url || '' }))}
              accept="image/*"
            />
            <MediaUploader
              label="Resume PDF Document"
              value={formData.resumeUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, resumeUrl: url || '' }))}
              accept="application/pdf"
              helperText="PDF document up to 10MB"
            />
          </div>
        </div>

        {/* Contact & Branding Card */}
        <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#262626]">
            <Sparkles className="w-4 h-4 text-[#e91010]" />
            <h2 className="text-sm font-bold tracking-wide">Contact Details & Theme Accent</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="+91 7567633863"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                Primary Brand Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryAccent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, primaryAccent: e.target.value }))}
                  className="w-9 h-9 rounded border border-[#262626] bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryAccent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, primaryAccent: e.target.value }))}
                  className="w-full font-mono bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Gandhinagar, Gujarat, India"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>
        </div>

        {/* SEO Metadata Card */}
        <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#262626]">
            <Globe className="w-4 h-4 text-[#e91010]" />
            <h2 className="text-sm font-bold tracking-wide">SEO & OpenGraph Tags</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              SEO Meta Title
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
              placeholder="Ayush Parekh | Creative Technologist & Full-Stack Developer"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
              SEO Meta Description
            </label>
            <textarea
              rows={2}
              value={formData.seoDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
              placeholder="Personal portfolio showcasing dynamic web applications, engineering projects, and technical writing."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs text-white outline-none focus:border-[#e91010]"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
