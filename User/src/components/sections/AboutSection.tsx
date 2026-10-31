import React from 'react';
import { motion } from 'framer-motion';
import { SiteSettings } from '../../types/index.js';
import { User, MapPin, Mail, Code2 } from 'lucide-react';

interface AboutSectionProps {
  settings?: SiteSettings;
  projectCount?: number;
  experienceYears?: number;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  projectCount = 8,
  experienceYears = 2,
}) => {
  const stats = [
    { label: 'Years of Experience', value: `${experienceYears}+` },
    { label: 'Completed Projects', value: `${projectCount}+` },
    { label: 'Core Technologies', value: '15+' },
    { label: 'Commitment to Code', value: '100%' },
  ];

  return (
    <section id="about" className="py-24 border-t border-[#262626] light:border-[#C6B7A0] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2 mb-16"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e91010] uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Get To Know Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-black">
            About Me
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 max-w-xl mx-auto">
            A glance into my engineering background, technical principles, and core values.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Avatar / Profile Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#e91010] to-neutral-700 opacity-40 blur group-hover:opacity-75 transition duration-500" />

              <div className="relative w-64 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden border border-[#262626] light:border-[#C6B7A0] bg-[#141414] shadow-2xl">
                {settings?.avatarUrl ? (
                  <img
                    src={settings.avatarUrl}
                    alt={settings.fullName ? `Portrait of ${settings.fullName}` : 'Ayush Parekh'}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] to-[#0f0f0f] text-neutral-400 p-6 text-center">
                    <Code2 className="w-16 h-16 text-[#e91010] mb-3" />
                    <span className="font-bold text-white text-lg">{settings?.fullName || 'Ayush Parekh'}</span>
                    <span className="text-xs text-neutral-500 mt-1">{settings?.title}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bio & Key Facts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white light:text-black">
                Architecting modern software with a focus on precision, speed, and elegance.
              </h3>
              <p className="text-sm text-neutral-300 light:text-neutral-700 leading-relaxed whitespace-pre-line">
                {settings?.bio ||
                  "I'm a passionate Full-Stack Developer with deep proficiency in React, Node.js, Express, PostgreSQL, and modern motion design. I engineer secure, high-speed, and responsive applications with clean, modular architecture."}
              </p>
            </div>

            {/* Quick Metadata badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              {settings?.location && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2]">
                  <MapPin className="w-4 h-4 text-[#e91010]" />
                  <span className="text-neutral-300 light:text-neutral-800 font-medium">
                    {settings.location}
                  </span>
                </div>
              )}
              {settings?.contactEmail && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2]">
                  <Mail className="w-4 h-4 text-[#e91010]" />
                  <span className="text-neutral-300 light:text-neutral-800 font-medium truncate">
                    {settings.contactEmail}
                  </span>
                </div>
              )}
            </div>

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] text-center"
                >
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#e91010] font-mono">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-neutral-400 light:text-neutral-600 font-medium mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
