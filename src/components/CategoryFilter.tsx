import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seedData';
import { motion } from 'motion/react';
import { Sparkles, Layers, ArrowRight } from 'lucide-react';

export const CategoryFilter: React.FC = () => {
  const { language, selectedCategory, setSelectedCategory, products } = useApp();

  const allCount = products.filter((p) => p.status === 'published').length;

  return (
    <section id="kategori-section" className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Layers size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit'] leading-tight">
              {language === 'ht' ? 'Eksplore pa Kategori' : 'Explorer par Catégorie'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {language === 'ht'
                ? 'Klike sou yon kategori pou w jwenn sa w bezwen pi vit'
                : 'Sélectionnez une catégorie pour filtrer vos produits'}
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0">
          {allCount} {language === 'ht' ? 'pwodwi' : 'produits'}
        </span>
      </div>

      {/* Horizontal Scrollable Categories Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none sm:scrollbar-thin sm:scrollbar-thumb-slate-200">
        {/* All Products pill */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setSelectedCategory('Tout')}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
            selectedCategory === 'Tout'
              ? 'bg-slate-900 text-white shadow-slate-900/20 shadow-md ring-2 ring-slate-900'
              : 'bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80'
          }`}
        >
          <Sparkles size={14} className={selectedCategory === 'Tout' ? 'text-amber-400' : 'text-slate-400'} />
          <span>{language === 'ht' ? 'Tout Kategori' : 'Toutes Catégories'}</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
              selectedCategory === 'Tout'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
            }`}
          >
            {allCount}
          </span>
        </motion.button>

        {/* Digital Services Jump Chip */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            document.getElementById('services-numeriques-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 text-amber-900 border border-amber-300 hover:border-amber-400 hover:bg-amber-100/50"
        >
          <span className="text-base leading-none">⚡</span>
          <span>{language === 'ht' ? 'Sèvis Dijital' : 'Services Numériques'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
            Ofisyèl
          </span>
        </motion.button>

        {CATEGORIES.map((cat) => {
          const count = products.filter(
            (p) => p.status === 'published' && p.category === cat.id
          ).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-red-600 text-white shadow-red-600/25 shadow-md ring-2 ring-red-600'
                  : 'bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{language === 'ht' ? cat.nameHt : cat.nameFr}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected
                    ? 'bg-red-700 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
