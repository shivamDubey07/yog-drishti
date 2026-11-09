import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};