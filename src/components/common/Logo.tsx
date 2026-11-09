import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Replaceable Brand Logo Component.
 * When your official SVG/PNG logo is ready, simply replace the inner markup
 * with <img src="/logo.svg" alt="Yog Drishti" className="h-10 w-auto" />
 */
export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '' }) => {
  const isLight = variant === 'light';

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}
      aria-label="Yog Drishti - Home"
    >
      {/* Minimalist Lotus / Sun Emblem */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${
          isLight
            ? 'border-gold/60 bg-forest-light text-gold'
            : 'border-forest/20 bg-forest text-gold'
        }`}
      >
        <span className="font-serif text-xl font-semibold tracking-wider select-none">
          YD
        </span>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif text-2xl sm:text-3xl font-semibold tracking-wide leading-none ${
            isLight ? 'text-cream' : 'text-forest'
          }`}
        >
          Yog Drishti
        </span>
        <span
          className={`text-[10px] uppercase tracking-[0.22em] mt-1 font-medium ${
            isLight ? 'text-sage-muted' : 'text-sage'
          }`}
        >
          Lucknow
        </span>
      </div>
    </Link>
  );
};
