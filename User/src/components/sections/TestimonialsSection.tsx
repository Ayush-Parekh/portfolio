import React from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '../../types/index.js';
import { Quote, Star } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials = [] }) => {
  // Hide section automatically when it has no visible items
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 border-t border-[#262626] light:border-[#C6B7A0] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e91010] uppercase tracking-wider">
            <Quote className="w-4 h-4" />
            <span>Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-black">
            What Collaborators Say
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 max-w-xl mx-auto">
            Feedback from engineers, project leads, and clients I have worked with.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                {/* 5-star rating */}
                <div
                  className="flex items-center gap-1"
                  role="img"
                  aria-label={`Rating: ${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 light:text-neutral-800 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#262626] light:border-[#C6B7A0]/50">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={`Portrait of ${t.authorName}`}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#181818] border border-neutral-700 flex items-center justify-center font-bold text-xs text-[#e91010]">
                    {t.authorName[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold text-xs sm:text-sm text-white light:text-black">
                    {t.authorName}
                  </p>
                  <p className="text-[11px] text-neutral-400 light:text-neutral-600">
                    {t.authorRole} {t.authorCompany && `• ${t.authorCompany}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
