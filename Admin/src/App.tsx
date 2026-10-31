import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from './context/ThemeContext.js';
import { ToastProvider } from './context/ToastContext.js';
import { AuthProvider } from './context/AuthContext.js';

import { ProtectedRoute } from './components/layout/ProtectedRoute.js';
import { AdminLayout } from './components/layout/AdminLayout.js';

import { LoginPage } from './pages/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProjectsPage } from './pages/ProjectsPage.js';
import { BlogPage } from './pages/BlogPage.js';
import { SkillsPage } from './pages/SkillsPage.js';
import { ExperiencesPage } from './pages/ExperiencesPage.js';
import { EducationPage } from './pages/EducationPage.js';
import { CertificationsPage } from './pages/CertificationsPage.js';
import { TestimonialsPage } from './pages/TestimonialsPage.js';
import { SocialLinksPage } from './pages/SocialLinksPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { MessagesPage } from './pages/MessagesPage.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Auth Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Admin Console Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/skills" element={<SkillsPage />} />
                    <Route path="/experiences" element={<ExperiencesPage />} />
                    <Route path="/education" element={<EducationPage />} />
                    <Route path="/certifications" element={<CertificationsPage />} />
                    <Route path="/testimonials" element={<TestimonialsPage />} />
                    <Route path="/social-links" element={<SocialLinksPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                  </Route>
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

