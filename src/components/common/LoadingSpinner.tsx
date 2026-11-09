import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3" role="status">
      <div className="w-10 h-10 border-2 border-sage/30 border-t-forest rounded-full animate-spin" />
      <span className="text-sm text-charcoal/70 font-medium tracking-wide">{label}</span>
    </div>
  );
};
