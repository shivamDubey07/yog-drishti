import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { isDialablePhone } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { settings } = useSiteSettings();
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Classes', path: '/classes' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-soft py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Text Logo */}
        <Link to="/" className="group flex flex-col">
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-forest transition-colors group-hover:text-gold">
            {settings.business_name}
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-charcoal/60 font-sans -mt-1">
            Gomti Nagar • Lucknow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm tracking-wide font-medium transition-colors hover:text-gold ${
                  isActive ? 'text-forest font-semibold' : 'text-charcoal/80'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-xs bg-forest/10 text-forest px-3 py-1.5 rounded-full hover:bg-forest hover:text-cream transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Desktop Quick Contact CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {isDialablePhone(settings.phone_number) ? (
            <a
              href={`tel:${settings.phone_number}`}
              className="btn-primary py-2.5 px-5 text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone_number}</span>
            </a>
          ) : (
            <Link to="/contact" className="btn-primary py-2.5 px-5 text-xs">
              Enquire Now
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-lg text-forest hover:bg-sage/20 transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-cream border-b border-sage/20 px-6 py-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-base tracking-wide font-medium py-1 transition-colors ${
                    isActive ? 'text-forest font-bold' : 'text-charcoal/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm text-forest font-semibold py-1"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            )}
            <div className="pt-4 border-t border-sage/20 flex flex-col gap-3">
              {isDialablePhone(settings.phone_number) && (
                <a
                  href={`tel:${settings.phone_number}`}
                  className="btn-secondary w-full text-center py-3 text-sm justify-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {settings.phone_number}</span>
                </a>
              )}
              <Link to="/contact" className="btn-primary w-full text-center py-3 text-sm justify-center">
                Send an Enquiry
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};