import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  BookOpen,
  Cpu,
  Briefcase,
  Mail,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
  });

  const { data: messagesData } = useQuery({
    queryKey: ['recent-messages'],
    queryFn: () => api.getMessages(1, 5),
  });

  const statCards = [
    {
      title: 'Showcase Projects',
      count: stats?.projectCount ?? 0,
      icon: FolderGit2,
      path: '/projects',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Blog Articles',
      count: stats?.blogCount ?? 0,
      icon: BookOpen,
      path: '/blog',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Technical Skills',
      count: stats?.skillCount ?? 0,
      icon: Cpu,
      path: '/skills',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Experience Milestones',
      count: stats?.experienceCount ?? 0,
      icon: Briefcase,
      path: '/experiences',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Unread Inquiries',
      count: stats?.unreadMessages ?? 0,
      icon: Mail,
      path: '/messages',
      color: 'text-[#e91010]',
      bgColor: 'bg-[#e91010]/10',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e91010]" />
            <h1 className="text-xl font-bold tracking-tight">Welcome, Ayush!</h1>
          </div>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            All changes made here are instantly reflected across your public portfolio via the REST API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="px-3.5 py-2 bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] hover:border-[#e91010] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Edit Profile & SEO</span>
          </Link>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#e91010]/20"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] hover:border-[#e91010] light:hover:border-[#e91010] rounded-xl p-5 transition-all duration-150 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${card.bgColor} ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-[#e91010] group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">
                {isLoading ? '...' : card.count}
              </p>
              <p className="text-xs text-neutral-400 light:text-neutral-600 font-medium mt-0.5">
                {card.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Contact Inquiries */}
      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#262626] light:border-[#C6B7A0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#e91010]" />
            <h2 className="text-sm font-bold tracking-wide">Recent Inquiries</h2>
          </div>
          <Link
            to="/messages"
            className="text-xs text-[#e91010] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-[#262626] light:divide-[#C6B7A0]">
          {!messagesData?.items?.length ? (
            <div className="p-8 text-center text-xs text-neutral-400">
              No inquiries received yet. Visitors who submit the contact form will appear here.
            </div>
          ) : (
            messagesData.items.map((msg) => (
              <div
                key={msg.id}
                className="p-4 hover:bg-[#181818] light:hover:bg-[#D5C8B4] transition-colors flex items-center justify-between gap-4"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white light:text-black">
                      {msg.senderName}
                    </span>
                    <span className="text-[11px] text-neutral-400">({msg.senderEmail})</span>
                    {!msg.isRead && (
                      <span className="px-1.5 py-0.5 bg-[#e91010]/20 text-[#e91010] text-[10px] font-bold rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-neutral-300 light:text-neutral-800 truncate max-w-lg">
                    {msg.subject}
                  </p>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-neutral-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
