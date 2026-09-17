import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface AnimatedHeartProps {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export const AnimatedHeart: React.FC<AnimatedHeartProps> = ({
  isFavorite,
  onToggle,
  size = 18,
  className = '',
  ariaLabel = 'Ajoute nan favori',
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={onToggle}
      aria-label={ariaLabel}
      className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer flex items-center justify-center ${
        isFavorite
          ? 'bg-rose-50 text-rose-600 shadow-sm'
          : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-xs'
      } ${className}`}
    >
      <motion.div
        animate={
          isFavorite
            ? {
                scale: [1, 1.35, 0.95, 1.1, 1],
                rotate: [0, -12, 10, -5, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Heart
          size={size}
          className={
            isFavorite
              ? 'fill-rose-500 text-rose-500'
              : 'fill-transparent text-current'
          }
        />
      </motion.div>
    </motion.button>
  );
};
