import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SkillCategory } from '../../types/index.js';
import { Cpu } from 'lucide-react';

interface SkillsSectionProps {
  categories?: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ categories = [] }) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('all');

  if (categories.length === 0) return null;

  // Filter skills based on tab
  const displayCategories =
    selectedCatId === 'all'
      ? categories
      : categories.filter((c) => c.id === selectedCatId);

  return (
    <section id="skills" className="py-24 border-t border-[#262626] light:border-[#C6B7A0] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e91010] uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-black">
            Skills & Technologies
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 max-w-xl mx-auto">
            Tools, frameworks, and architecture patterns I specialize in building with.
          </p>
        </motion.div>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Skill category filter tabs"
          >
            <button
              role="tab"
              aria-selected={selectedCatId === 'all'}
              aria-label="Show all skill categories"
              onClick={() => setSelectedCatId('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] ${
                selectedCatId === 'all'
                  ? 'bg-[#e91010] text-white shadow-md shadow-[#e91010]/20'
                  : 'bg-[#141414] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] text-neutral-400 light:text-neutral-700 hover:text-white light:hover:text-black'
              }`}
            >
              All Skills
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={selectedCatId === cat.id}
                aria-label={`Show ${cat.name} skills`}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] ${
                  selectedCatId === cat.id
                    ? 'bg-[#e91010] text-white shadow-md shadow-[#e91010]/20'
                    : 'bg-[#141414] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] text-neutral-400 light:text-neutral-700 hover:text-white light:hover:text-black'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Skills Display Grid */}
        <div className="space-y-10">
          {displayCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              {selectedCatId === 'all' && (
                <h3 className="text-sm font-bold text-neutral-400 light:text-neutral-600 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e91010]" />
                  <span>{category.name}</span>
                </h3>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.skills?.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="p-4 rounded-xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] hover:border-neutral-600 light:hover:border-neutral-400 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-white light:text-black">
                        {skill.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#e91010]">
                        {skill.proficiencyPercentage}%
                      </span>
                    </div>

                    {/* Animated Progress Bar */}
                    <div
                      role="progressbar"
                      aria-valuenow={skill.proficiencyPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.name} proficiency level`}
                      className="w-full bg-[#262626] light:bg-[#C6B7A0] h-1.5 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="bg-[#e91010] h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiencyPercentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
