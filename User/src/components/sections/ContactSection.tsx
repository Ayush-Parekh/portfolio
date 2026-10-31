import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SiteSettings, ContactPayload } from '../../types/index.js';
import { publicApi } from '../../services/publicApi.js';
import {
  Mail,
  Send,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
} from 'lucide-react';

interface ContactSectionProps {
  settings?: SiteSettings;
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(2, 'Subject must be at least 2 characters long'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await publicApi.submitContact(data as ContactPayload);
      setSubmitStatus('success');
      reset();
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Failed to deliver message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-[#262626] light:border-[#C6B7A0] relative">
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
            <Mail className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-black">
            Let&apos;s Build Together
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 max-w-xl mx-auto">
            Have a project in mind, an engineering role open, or an architectural problem to solve? Drop a line below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Direct Contact Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white light:text-black flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#e91010]" />
                Direct Communication
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 light:text-neutral-700 leading-relaxed">
                Messages sent via this verified channel are saved directly to my database and dispatched via real-time email notification.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {settings?.contactEmail && (
                <div className="p-4 rounded-xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#e91010]/10 border border-[#e91010]/30 text-[#e91010]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-400 font-semibold uppercase">Email</p>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      aria-label={`Send direct email to ${settings.contactEmail}`}
                      className="text-xs sm:text-sm font-bold text-white light:text-black hover:text-[#e91010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] rounded"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {settings?.contactPhone && (
                <div className="p-4 rounded-xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#e91010]/10 border border-[#e91010]/30 text-[#e91010]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-400 font-semibold uppercase">Phone</p>
                    <a
                      href={`tel:${settings.contactPhone}`}
                      aria-label={`Call direct phone number ${settings.contactPhone}`}
                      className="text-xs sm:text-sm font-bold text-white light:text-black hover:text-[#e91010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010] rounded"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {settings?.location && (
                <div className="p-4 rounded-xl border border-[#262626] light:border-[#C6B7A0] bg-[#141414] light:bg-[#DFD4C2] flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#e91010]/10 border border-[#e91010]/30 text-[#e91010]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-400 font-semibold uppercase">Location</p>
                    <p className="text-xs sm:text-sm font-bold text-white light:text-black">
                      {settings.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Interactive Form Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-[#141414] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {submitStatus === 'success' && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Your message has been sent successfully! I will reply shortly.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    {...register('name')}
                    placeholder="e.g. Jane Doe"
                    aria-required="true"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-xl px-3.5 py-2.5 text-xs text-white light:text-black outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
                  />
                  {errors.name && (
                    <p id="name-error" className="text-[11px] text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1"
                  >
                    Your Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    {...register('email')}
                    placeholder="jane@example.com"
                    aria-required="true"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-xl px-3.5 py-2.5 text-xs text-white light:text-black outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
                  />
                  {errors.email && (
                    <p id="email-error" className="text-[11px] text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1"
                >
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  {...register('subject')}
                  placeholder="e.g. Full-Stack Project Collaboration"
                  aria-required="true"
                  aria-invalid={errors.subject ? 'true' : 'false'}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-xl px-3.5 py-2.5 text-xs text-white light:text-black outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
                />
                {errors.subject && (
                  <p id="subject-error" className="text-[11px] text-red-500 mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase mb-1"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  {...register('message')}
                  placeholder="Describe your inquiry, project scope, or opportunity..."
                  aria-required="true"
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] rounded-xl p-3.5 text-xs text-white light:text-black outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]"
                />
                {errors.message && (
                  <p id="message-error" className="text-[11px] text-red-500 mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-[#e91010]/20 disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
