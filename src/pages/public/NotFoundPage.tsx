import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO title="Page Not Found" noIndex />
      <div className="min-h-[70vh] flex items-center justify-center text-center px-4 py-24">
        <div>
          <span className="text-sm font-semibold text-gold tracking-widest uppercase">404 Error</span>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-forest mt-2 mb-4">
            Page Not Found
          </h1>
          <p className="text-charcoal/70 text-sm max-w-md mx-auto mb-8">
            The page you are looking for may have been moved or does not exist.
          </p>
          <Link to="/" className="btn-primary">
            Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};