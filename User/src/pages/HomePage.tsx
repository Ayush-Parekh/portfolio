import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Lenis from 'lenis';
import { publicApi } from '../services/publicApi.js';
import { Navbar } from '../components/common/Navbar.js';
import { Footer } from '../components/common/Footer.js';
import { ScrollProgress } from '../components/common/ScrollProgress.js';
import { CustomCursor } from '../components/common/CustomCursor.js';
import { HeroSection } from '../components/sections/HeroSection.js';
import { AboutSection } from '../components/sections/AboutSection.js';
import { SkillsSection } from '../components/sections/SkillsSection.js';
import { ExperienceSection } from '../components/sections/ExperienceSection.js';
import { ProjectsSection } from '../components/sections/ProjectsSection.js';
import { BlogSection } from '../components/sections/BlogSection.js';
import { EducationSection } from '../components/sections/EducationSection.js';
import { TestimonialsSection } from '../components/sections/TestimonialsSection.js';
import { ContactSection } from '../components/sections/ContactSection.js';
import { Loader2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['portfolio-public'],
    queryFn: () => publicApi.getPortfolio(),
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['blog-posts-public'],
    queryFn: () => publicApi.getBlogPosts(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white gap-3">
        <ScrollProgress />
        <Loader2 className="w-8 h-8 text-[#e91010] animate-spin" />
        <p className="text-xs font-mono text-neutral-400 tracking-wider">
          INITIALIZING PORTFOLIO...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Unable to load portfolio content</h2>
        <p className="text-xs text-neutral-400 max-w-md mb-6">
          {(error as Error)?.message || 'Could not connect to the backend REST API.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold rounded-lg"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] light:bg-[#EAE0D0] light:text-[#1a1a1a]">
      <ScrollProgress />
      <CustomCursor />
      <Navbar settings={data?.settings} />

      <main>
        <HeroSection settings={data?.settings} socialLinks={data?.socialLinks} />
        <AboutSection
          settings={data?.settings}
          projectCount={data?.projects?.length}
          experienceYears={data?.experiences?.length}
        />
        <SkillsSection categories={data?.skillCategories} />
        <ExperienceSection experiences={data?.experiences} />
        <ProjectsSection projects={data?.projects} />
        <BlogSection posts={blogPosts} />
        <EducationSection education={data?.education} certifications={data?.certifications} />
        <TestimonialsSection testimonials={data?.testimonials} />
        <ContactSection settings={data?.settings} />
      </main>

      <Footer settings={data?.settings} socialLinks={data?.socialLinks} />
    </div>
  );
};

