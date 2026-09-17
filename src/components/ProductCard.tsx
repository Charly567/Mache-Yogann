import React, { useState } from 'react';
import { ShoppingBag, Eye, MapPin, Star, PlayCircle, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { AnimatedHeart } from './animations/AnimatedHeart';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, addToCart, setSelectedProductForDetail, toggleWishlist, isWishlisted } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const isSoldOut = product.quantity <= 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  const favorite = isWishlisted(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-25px' }}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-300/40 hover:border-slate-300 transition-shadow duration-300 flex flex-col overflow-hidden will-change-transform"
    >
      {/* Product Image Container */}
      <div
        className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => setSelectedProductForDetail(product)}
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          onError={(e) => {
            // fallback placeholder if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback pattern if image is missing/broken */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 text-orange-800 font-bold text-2xl">
          {product.title.slice(0, 2).toUpperCase()}
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-900/90 text-white backdrop-blur">
              {language === 'ht' ? 'Vann Tout' : 'Épuisé'}
            </span>
          ) : (
            <>
              {hasDiscount && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-600 text-white shadow-xs">
                  -{discountPercent}%
                </span>
              )}
              {product.freeShipping && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-600 text-white shadow-xs">
                  {language === 'ht' ? 'Livrezon Gratis' : 'Livraison Gratuite'}
                </span>
              )}
              {(product.category === 'LivPDF' || product.bookFormat === 'pdf') && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                  📄 Ebook PDF
                </span>
              )}
              {(product.category === 'LivFizik' || (product.bookFormat === 'physical' && product.category.includes('Liv'))) && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-600 text-white shadow-xs">
                  📚 Liv Fizik
                </span>
              )}
              {product.hasVideo && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-600 text-white shadow-xs flex items-center gap-1">
                  <PlayCircle size={12} />
                  <span>Videyo</span>
                </span>
              )}
            </>
          )}
        </div>

        {/* Favorite Heart Button (Top-Right) */}
        <div className="absolute top-2 right-2 z-20">
          <AnimatedHeart
            isFavorite={favorite}
            onToggle={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            size={16}
          />
        </div>

        {/* Hover Quick Action */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 pointer-events-none sm:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForDetail(product);
            }}
            className="p-2.5 rounded-full bg-white text-slate-800 hover:bg-slate-100 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
            title={language === 'ht' ? 'Gade detay' : 'Voir détails'}
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Seller & Location */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium truncate max-w-[150px] text-slate-700" title={product.sellerBusiness || product.sellerName}>
              {product.sellerBusiness || product.sellerName}
            </span>
            <span className="inline-flex items-center gap-0.5 text-slate-500 truncate" title={product.sellerLocation}>
              <MapPin size={11} className="text-red-500 shrink-0" />
              <span className="text-[11px]">{product.sellerLocation.split(',')[0]}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProductForDetail(product)}
            className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-red-600 transition-colors cursor-pointer leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {product.author && (
            <p className="text-[11px] text-amber-800 font-semibold truncate">
              ✍️ {product.author}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                />
              ))}
            </div>
            <span className="font-semibold text-slate-700 text-[11px] ml-0.5">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-slate-400 text-[11px]">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            {hasDiscount && (
              <p className="text-xs text-slate-400 line-through leading-none font-medium">
                {product.originalPrice?.toLocaleString()} HTG
              </p>
            )}
            <p className="text-base sm:text-lg font-black text-slate-900 font-['Outfit'] leading-tight">
              {product.price.toLocaleString()} <span className="text-xs font-bold text-red-600">HTG</span>
            </p>
          </div>

          {isSoldOut ? (
            <span className="text-xs text-slate-400 font-semibold px-2.5 py-1 bg-slate-100 rounded-lg">
              {language === 'ht' ? 'Fini' : 'Épuisé'}
            </span>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer shrink-0 ${
                justAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
              }`}
              title={language === 'ht' ? 'Ajoute nan panye' : 'Ajouter au panier'}
            >
              {justAdded ? (
                <>
                  <Check size={14} className="animate-in zoom-in" />
                  <span className="text-xs font-bold">
                    {language === 'ht' ? 'Ajoute!' : 'Ajouté!'}
                  </span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span className="hidden sm:inline">
                    {language === 'ht' ? 'Achte' : 'Ajouter'}
                  </span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
};
