import React from 'react';
import { motion } from 'framer-motion';
import { Experience } from '../../types/index.js';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface ExperienceSectionProps {
  experiences?: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences = [] }) => {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-24 border-t border-[#262626] light:border-[#C6B7A0] relative">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e91010] uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>Career Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-black">
            Work Experience
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 max-w-xl mx-auto">
            Professional roles, contributions, and engineering milestones.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#262626] light:border-[#C6B7A0] space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline Pin Indicator */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#121212] light:bg-[#DFD4C2] border-2 border-[#e91010] shadow-[0_0_8px_#e91010] group-hover:scale-125 transition-transform" />

              <div className="bg-[#141414] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl p-6 space-y-4 hover:border-neutral-600 light:hover:border-neutral-400 transition-colors shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white light:text-black">
                      {exp.role}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#e91010]">
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 light:text-neutral-600 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        • <MapPin className="w-3.5 h-3.5" /> {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-xs sm:text-sm text-neutral-300 light:text-neutral-700 leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {/* Achievements Bullet List */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-2 pt-2 border-t border-[#262626] light:border-[#C6B7A0]/50 text-xs text-neutral-300 light:text-neutral-700">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#e91010] shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

