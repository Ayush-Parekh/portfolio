import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';
import { CustomCursor } from '../components/common/CustomCursor.js';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] light:bg-[#EAE0D0] light:text-[#1a1a1a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-colors">
      <CustomCursor />

      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e91010]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-md space-y-6"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#141414] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] flex items-center justify-center text-[#e91010] shadow-xl">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono font-semibold text-[#e91010] tracking-widest uppercase">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-black">
            Lost in the Digital Void
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 leading-relaxed">
            The page, case study, or article you are searching for does not exist or has been relocated to another route.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold tracking-wide transition-colors shadow-lg shadow-[#e91010]/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Portfolio Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

