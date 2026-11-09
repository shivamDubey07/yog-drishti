import React from 'react';
import { SEO } from '../../components/common/SEO';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <>
      <SEO
        title="About Yog Drishti"
        description="Learn about the philosophy, studio environment, and mindful approach behind Yog Drishti in Gomti Nagar, Lucknow."
        canonicalUrl="https://yogdrishti.org/about"
      />

      <div className="py-16 md:py-24 bg-cream">
        <div className="container-custom max-w-4xl">
          <div className="mb-10 text-center">
            <span className="text-xs uppercase font-semibold tracking-widest text-gold">Our Story</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest mt-3 mb-4">
              A conscious space for mindful movement
            </h1>
          </div>

          <div className="bg-white border border-sage/30 rounded-3xl shadow-soft p-8 md:p-12 space-y-6 text-charcoal/80 leading-relaxed">
            <p className="text-base sm:text-lg">{settings.about_summary}</p>
            <p>{settings.about_full}</p>
            <p>{settings.philosophy_text}</p>
            <p>{settings.mission_vision}</p>
          </div>
        </div>
      </div>
    </>
  );
};
