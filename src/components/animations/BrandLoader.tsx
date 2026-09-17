import React from 'react';
import { motion } from 'motion/react';

interface BrandLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const BrandLoader: React.FC<BrandLoaderProps> = ({
  size = 'md',
  label,
  className = '',
}) => {
  const dimensions = {
    sm: { box: 'w-8 h-8', text: 'text-[10px]', ring: 'w-8 h-8', border: 'border-2' },
    md: { box: 'w-12 h-12', text: 'text-xs', ring: 'w-12 h-12', border: 'border-2' },
    lg: { box: 'w-16 h-16', text: 'text-sm', ring: 'w-16 h-16', border: 'border-3' },
  }[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-2.5 ${className}`}>
      <div className={`relative ${dimensions.box} flex items-center justify-center`}>
        {/* Outer rotating dual ring (Haitian Red & Blue) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: 'linear',
          }}
          className={`absolute inset-0 rounded-full border-t-red-600 border-r-blue-600 border-b-transparent border-l-transparent ${dimensions.border}`}
        />

        {/* Inner subtle pulse glow */}
        <motion.div
          animate={{ scale: [0.92, 1.06, 0.92], opacity: [0.35, 0.7, 0.35] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="absolute inset-1 rounded-full bg-red-500/10 blur-xs pointer-events-none"
        />

        {/* Center brand monogram MY */}
        <div className="w-full h-full rounded-full bg-white shadow-xs flex items-center justify-center">
          <span className="font-black text-slate-900 font-['Outfit'] text-xs tracking-tighter">
            M<span className="text-red-600">Y</span>
          </span>
        </div>
      </div>

      {label && (
        <span className={`font-semibold text-slate-600 ${dimensions.text} animate-pulse`}>
          {label}
        </span>
      )}
    </div>
  );
};
