import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.js';
import { SiteSettings } from '../../types/index.js';
import { Menu, X, FileDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeSelector } from './ThemeSelector.js';

interface NavbarProps {
  settings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Scroll spy on sections
      const sections = ['home', 'about', 'skills', 'experience', 'projects', 'blog', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/#home', id: 'home' },
    { label: 'About', href: '/#about', id: 'about' },
    { label: 'Skills', href: '/#skills', id: 'skills' },
    { label: 'Experience', href: '/#experience', id: 'experience' },
    { label: 'Projects', href: '/#projects', id: 'projects' },
    { label: 'Blog', href: '/#blog', id: 'blog' },
    { label: 'Contact', href: '/#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      return; // Link component handles cross-page navigation
    }
    const targetId = href.replace('/#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0a0a0a]/90 light:bg-[#EAE0D0]/90 backdrop-blur-md border-b border-[#262626] light:border-[#C6B7A0] py-3 shadow-lg shadow-black/10'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          aria-label="Ayush Parekh Portfolio Home"
          className="flex items-center gap-2 group font-bold tracking-tight text-lg text-white light:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] rounded-md p-1"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#e91010] shadow-[0_0_8px_#e91010] group-hover:scale-125 transition-transform" />
          <span>{settings?.fullName || 'Ayush Parekh'}</span>
        </Link>

        {/* Desktop Nav Items */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 bg-[#141414]/70 light:bg-[#DFD4C2]/70 border border-[#262626] light:border-[#C6B7A0] px-3 py-1.5 rounded-full backdrop-blur-sm"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === '/' && activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] ${
                  isActive
                    ? 'bg-[#e91010] text-white shadow-md shadow-[#e91010]/20'
                    : 'text-neutral-400 light:text-neutral-700 hover:text-white light:hover:text-black'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Resume PDF Download */}
          {settings?.resumeUrl && (
            <a
              href={settings.resumeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Download Ayush Parekh's Resume (PDF)"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#262626] light:border-[#C6B7A0] hover:border-[#e91010] light:hover:border-[#e91010] text-xs font-semibold text-neutral-300 light:text-neutral-800 hover:text-[#e91010] transition-colors bg-[#141414] light:bg-[#DFD4C2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
          )}

          {/* Animated Theme Selector (System / Light / Dark) */}
          <ThemeSelector size="sm" />
        </div>

        {/* Mobile Header Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSelector size="sm" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
            className="p-2 rounded-lg border border-[#262626] light:border-[#C6B7A0] text-neutral-300 light:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] light:bg-[#EAE0D0] border-b border-[#262626] light:border-[#C6B7A0] px-6 py-6 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  handleNavClick(link.href);
                } else {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="block text-sm font-semibold text-neutral-300 light:text-neutral-800 hover:text-[#e91010] py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] rounded"
            >
              {link.label}
            </a>
          ))}
          {settings?.resumeUrl && (
            <a
              href={settings.resumeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Download Resume (PDF)"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 rounded-lg bg-[#e91010] text-white text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Resume PDF</span>
            </a>
          )}
        </div>
      )}
    </header>
  );
};
