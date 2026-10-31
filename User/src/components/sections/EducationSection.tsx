import React from 'react';
import { motion } from 'framer-motion';
import { Education, Certification } from '../../types/index.js';
import { GraduationCap, Award, Calendar, ExternalLink } from 'lucide-react';

interface EducationSectionProps {
  education?: Education[];
  certifications?: Certification[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education = [],
  certifications = [],
}) => {
  if (education.length === 0 && certifications.length === 0) return null;

  return (
    <section id="education" className="py-24 border-t border-[#262626] light:border-[#C6B7A0] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e91010] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Academic & Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-black">
            Education & Certifications
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 max-w-xl mx-auto">
            Formal engineering foundations and verified industry credentials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Education Column */}
          {education.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-[#262626] light:border-[#C6B7A0]">
                <GraduationCap className="w-5 h-5 text-[#e91010]" />
                <h3 className="text-lg font-bold text-white light:text-black">Education</h3>
              </div>

              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="p-6 rounded-2xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-bold text-sm sm:text-base text-white light:text-black">
                        {edu.degree} in {edu.fieldOfStudy}
                      </h4>
                      {edu.grade && (
                        <span className="px-2 py-0.5 rounded-md bg-[#1f1f1f] light:bg-[#C6B7A0] text-[#e91010] text-[11px] font-mono font-bold self-start sm:self-auto">
                          {edu.grade}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-[#e91010]">{edu.institution}</p>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 light:text-neutral-600 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
                    </div>

                    {edu.description && (
                      <p className="text-xs text-neutral-300 light:text-neutral-700 leading-relaxed pt-1">
                        {edu.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Column */}
          {certifications.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-[#262626] light:border-[#C6B7A0]">
                <Award className="w-5 h-5 text-[#e91010]" />
                <h3 className="text-lg font-bold text-white light:text-black">Certifications</h3>
              </div>

              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="p-6 rounded-2xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm sm:text-base text-white light:text-black">
                        {cert.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#e91010]">{cert.issuer}</p>
                      <p className="text-[11px] text-neutral-400 light:text-neutral-600 font-mono">Issued: {cert.issueDate}</p>
                    </div>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Verify credential for ${cert.name}`}
                        title="Verify Credential"
                        className="p-2.5 rounded-xl border border-[#262626] light:border-[#C6B7A0] bg-[#181818] light:bg-[#D5C8B4] text-neutral-300 light:text-neutral-700 hover:text-[#e91010] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
