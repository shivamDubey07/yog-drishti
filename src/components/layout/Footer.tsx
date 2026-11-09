import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { isDialablePhone } from '../../utils/formatters';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-forest-dark text-cream border-t border-forest-light/30 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-wide text-cream">
              {settings.business_name}
            </h3>
            <p className="text-cream/70 text-sm leading-relaxed">
              {settings.tagline}
            </p>
            <p className="text-xs text-gold tracking-wide italic">
              A mindful yoga sanctuary nestled in Vikas Khand, Gomti Nagar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/75">
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  Our Philosophy & Story
                </Link>
              </li>
              <li>
                <Link to="/classes" className="hover:text-gold transition-colors">
                  Yoga Batches & Schedule
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold transition-colors">
                  Studio Atmosphere
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gold transition-colors">
                  Wellness & Articles
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">
                  Find & Reach Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">
              Studio Location
            </h4>
            <div className="space-y-3 text-sm text-cream/75">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                {isDialablePhone(settings.phone_number) ? (
                  <a href={`tel:${settings.phone_number}`} className="hover:text-gold">
                    {settings.phone_number}
                  </a>
                ) : (
                  <span>{settings.phone_number}</span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours & Directions */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">
              Timings
            </h4>
            <div className="space-y-3 text-sm text-cream/75">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-1" />
                <span className="leading-relaxed">{settings.opening_hours}</span>
              </div>
              <div className="pt-2">
                <a
                  href={settings.google_maps_directions_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
                >
                  <span>Get Driving Directions</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-forest/50 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} {settings.business_name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-cream/80">Support</Link>
            <Link to="/admin" className="hover:text-cream/80">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};