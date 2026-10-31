import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api.js';
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Quote,
  Share2,
  Settings,
  Mail,
  Sun,
  Moon,
  ExternalLink,
  LogOut,
  User,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Fetch unread messages count for the inbox badge
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
    refetchInterval: 30000, // Refresh every 30s
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Site Settings', path: '/settings', icon: Settings },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Blog Posts', path: '/blog', icon: BookOpen },
    { label: 'Skills & Tech', path: '/skills', icon: Cpu },
    { label: 'Experience', path: '/experiences', icon: Briefcase },
    { label: 'Education', path: '/education', icon: GraduationCap },
    { label: 'Certifications', path: '/certifications', icon: Award },
    { label: 'Testimonials', path: '/testimonials', icon: Quote },
    { label: 'Social Links', path: '/social-links', icon: Share2 },
    {
      label: 'Inbox',
      path: '/messages',
      icon: Mail,
      badge: stats?.unreadMessages ? stats.unreadMessages : undefined,
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-[#f5f5f5] light:bg-[#EAE0D0] light:text-[#1a1a1a]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#262626] light:border-[#C6B7A0] bg-[#121212] light:bg-[#DFD4C2] flex flex-col shrink-0">
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#262626] light:border-[#C6B7A0] gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#e91010] flex items-center justify-center font-bold text-white shadow-md shadow-[#e91010]/20">
            A
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">PORTFOLIO ADMIN</h1>
            <p className="text-[11px] text-neutral-400 light:text-neutral-600">Ayush Parekh</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Admin Navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] ${
                  isActive
                    ? 'bg-[#e91010] text-white shadow-md shadow-[#e91010]/20 font-semibold'
                    : 'text-neutral-400 light:text-neutral-700 hover:text-white light:hover:text-black hover:bg-[#1f1f1f] light:hover:bg-[#D5C8B4]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  aria-label={`${item.badge} unread messages`}
                  className="px-2 py-0.5 text-xs font-bold bg-[#e91010] text-white rounded-full"
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Footer in Sidebar */}
        <div className="p-3 border-t border-[#262626] light:border-[#C6B7A0] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-neutral-800 light:bg-neutral-300 flex items-center justify-center text-xs font-medium">
              <User className="w-4 h-4 text-neutral-400 light:text-neutral-600" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold truncate">{user?.fullName || 'Admin'}</p>
              <p className="text-[10px] text-neutral-400 light:text-neutral-600 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Sign out of Admin Dashboard"
            title="Sign out"
            className="p-1.5 text-neutral-400 hover:text-[#e91010] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-[#262626] light:border-[#C6B7A0] bg-[#121212]/80 light:bg-[#DFD4C2]/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-400 light:text-neutral-600 uppercase tracking-wider">
              Management Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Live Portfolio Button */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              aria-label="Open public portfolio website in a new tab"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#262626] light:border-[#C6B7A0] hover:border-[#e91010] text-xs font-medium transition-colors bg-[#181818] light:bg-[#D5C8B4] hover:text-[#e91010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-lg border border-[#262626] light:border-[#C6B7A0] hover:border-[#e91010] text-neutral-300 light:text-neutral-700 hover:text-[#e91010] transition-colors bg-[#181818] light:bg-[#D5C8B4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
