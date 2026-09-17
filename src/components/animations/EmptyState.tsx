import React from 'react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`text-center py-12 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-4 ${className}`}
    >
      {/* Floating icon illustration */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto shadow-inner border border-slate-200/60"
      >
        {icon}
      </motion.div>

      {/* Text message */}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
          {title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {/* CTA Button with micro-interaction */}
      {actionText && onAction && (
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          onClick={onAction}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-red-600/20 cursor-pointer"
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};
