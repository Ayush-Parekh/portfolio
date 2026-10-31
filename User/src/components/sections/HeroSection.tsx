import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteSettings, SocialLink } from '../../types/index.js';
import { ArrowRight, FileDown, Mail, Github, Linkedin, Twitter, Globe, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  settings?: SiteSettings;
  socialLinks?: SocialLink[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, socialLinks = [] }) => {
  const roles = [
    'Creative Technologist',
    'Product-Driven Developer',
    'Full-Stack Architect',
    'React & Node.js Specialist',
  ];

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [roles.length]);

  const getSocialIcon = (iconKey: string) => {
    switch (iconKey.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-4 h-4" />;
      case 'mail':
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e91010]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#e91010]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#262626] light:border-[#C6B7A0] bg-[#141414]/80 light:bg-[#DFD4C2]/80 backdrop-blur-md shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-neutral-300 light:text-neutral-800">
            Available for Engineering Roles & Projects
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#e91010]" />
        </motion.div>

        {/* Headline & Dynamic Role Rotator */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white light:text-black"
          >
            Hi, I&apos;m{' '}
            <span className="text-[#e91010] relative inline-block">
              {settings?.fullName || 'Ayush Parekh'}
            </span>
          </motion.h1>

          {/* Animated Role Text */}
          <div className="h-10 sm:h-12 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentRoleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-neutral-400 light:text-neutral-700 tracking-wide font-mono"
              >
                &lt;{roles[currentRoleIndex]} /&gt;
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Short Tagline Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base text-neutral-400 light:text-neutral-700 max-w-2xl mx-auto leading-relaxed"
        >
          {settings?.tagline ||
            'Architecting scalable systems, performant web applications, and intuitive user experiences with clean code.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <a
            href="#projects"
            className="px-6 py-3 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center gap-2 shadow-lg shadow-[#e91010]/25 hover:shadow-[#e91010]/40 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          {settings?.resumeUrl && (
            <a
              href={settings.resumeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Download Resume (PDF)"
              className="px-6 py-3 border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] hover:border-[#e91010] text-neutral-200 light:text-neutral-800 hover:text-[#e91010] font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
          )}

          <a
            href="#contact"
            className="px-6 py-3 border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] hover:border-[#e91010] text-neutral-200 light:text-neutral-800 hover:text-[#e91010] font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Me</span>
          </a>
        </motion.div>

        {/* Social Icons Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-2.5 pt-4"
        >
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit my ${social.platform} profile`}
              title={social.platform}
              className="p-3 rounded-xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] text-neutral-400 light:text-neutral-700 hover:text-[#e91010] hover:border-[#e91010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
            >
              {getSocialIcon(social.iconKey)}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
