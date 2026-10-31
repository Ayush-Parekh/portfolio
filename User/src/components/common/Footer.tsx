import React from 'react';
import { SocialLink, SiteSettings } from '../../types/index.js';
import { ArrowUp, Github, Linkedin, Mail, Twitter, Globe } from 'lucide-react';

interface FooterProps {
  settings?: SiteSettings;
  socialLinks?: SocialLink[];
}

export const Footer: React.FC<FooterProps> = ({ settings, socialLinks = [] }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getIcon = (iconKey: string) => {
    switch (iconKey.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'mail':
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <footer className="border-t border-[#262626] light:border-[#C6B7A0] bg-[#0c0c0c] light:bg-[#DFD4C2] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Copyright */}
        <div className="space-y-1 text-center md:text-left">
          <p className="font-bold text-sm text-white light:text-black tracking-tight">
            {settings?.fullName || 'Ayush Parekh'}
          </p>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            &copy; {new Date().getFullYear()} {settings?.fullName || 'Ayush Parekh'}. Built with React, Express, Drizzle ORM & PostgreSQL.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-2">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit my ${social.platform} profile`}
              title={social.platform}
              className="p-2.5 rounded-full border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#D5C8B4] text-neutral-400 light:text-neutral-700 hover:text-[#e91010] hover:border-[#e91010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
            >
              {getIcon(social.iconKey)}
            </a>
          ))}

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
            title="Back to Top"
            className="p-2.5 rounded-full border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#D5C8B4] text-neutral-400 light:text-neutral-700 hover:text-[#e91010] hover:border-[#e91010] transition-colors ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
