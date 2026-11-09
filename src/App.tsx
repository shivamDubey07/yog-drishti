import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './pages/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ClassesPage } from './pages/public/ClassesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { BlogListingPage } from './pages/public/BlogListingPage';
import { BlogPostPage } from './pages/public/BlogPostPage';
import { ContactPage } from './pages/public/ContactPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminClassesPage } from './pages/admin/AdminClassesPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminBlogsPage } from './pages/admin/AdminBlogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SiteSettingsProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Website */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/blog" element={<BlogListingPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Portal */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="enquiries" element={<AdminEnquiriesPage />} />
                <Route path="classes" element={<AdminClassesPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="blogs" element={<AdminBlogsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SiteSettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;