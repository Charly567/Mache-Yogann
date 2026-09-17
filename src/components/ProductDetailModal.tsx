import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Zap,
  MapPin,
  Store,
  Phone,
  ShieldCheck,
  Truck,
  Star,
  Share2,
  Check,
  AlertCircle,
  BookOpen,
  FileText,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { AnimatedHeart } from './animations/AnimatedHeart';

export const ProductDetailModal: React.FC = () => {
  const {
    language,
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    setIsCheckoutOpen,
    showNotification,
    toggleWishlist,
    isWishlisted,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const isSoldOut = product.quantity <= 0;
  const allImages = [product.image, ...(product.additionalImages || [])];
  const favorite = isWishlisted(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setSelectedProductForDetail(null);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Gade ${product.title} sou Mache Yogann: ${product.price} HTG`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showNotification(language === 'ht' ? 'Lyen kopye!' : 'Lien copié!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={() => setSelectedProductForDetail(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 z-10"
      >
        {/* Close & Favorite Buttons */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <AnimatedHeart
            isFavorite={favorite}
            onToggle={() => toggleWishlist(product.id)}
            size={18}
          />
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="p-2 rounded-full bg-white/90 hover:bg-slate-100 text-slate-700 shadow-md transition-colors cursor-pointer"
            aria-label="Fèmen"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left Column: Photos Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={allImages[activeImageIndex] || product.image}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {product.freeShipping && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-md">
                  {language === 'ht' ? 'Livrezon Gratis' : 'Livraison Gratuite'}
                </span>
              )}
            </div>

            {/* Thumbnails if multiple */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx ? 'border-red-600 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="pt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>{language === 'ht' ? 'Peman Garanti' : 'Paiement Garanti'}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Truck size={16} className="text-blue-600 shrink-0" />
                <span>{language === 'ht' ? 'Koli Verifié' : 'Colis Vérifié'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Actions */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({product.reviewCount} {language === 'ht' ? 'evalyasyon' : 'avis'})</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                  {product.price.toLocaleString()} <span className="text-base font-bold text-red-600">HTG</span>
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
                    {product.originalPrice.toLocaleString()} HTG
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm text-slate-600 leading-relaxed text-sm bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <p>{product.description}</p>
              </div>

              {/* Book Information Section if applicable */}
              {(product.category === 'LivFizik' || product.category === 'LivPDF' || product.bookFormat || product.author) && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <BookOpen size={16} className="text-amber-800" />
                      <span>{language === 'ht' ? 'Enfòmasyon sou Liv la' : 'Détails du Livre'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-200 text-amber-900">
                      {product.bookFormat === 'pdf' || product.category === 'LivPDF' ? '📄 Dijital PDF (Ebook)' : '📚 Liv Fizik (Papye)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    {product.author && (
                      <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
                        <span className="text-slate-500 block">{language === 'ht' ? 'Otè / Ekriven:' : 'Auteur:'}</span>
                        <span className="font-bold text-slate-900">{product.author}</span>
                      </div>
                    )}
                    {product.pageCount && (
                      <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
                        <span className="text-slate-500 block">{language === 'ht' ? 'Nonb de Paj:' : 'Pages:'}</span>
                        <span className="font-bold text-slate-900">{product.pageCount} paj</span>
                      </div>
                    )}
                    {(product.fileSize || product.bookFormat === 'pdf' || product.category === 'LivPDF') && (
                      <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
                        <span className="text-slate-500 block">{language === 'ht' ? 'Fòma / Gwosè:' : 'Format / Taille:'}</span>
                        <span className="font-bold text-slate-900">{product.fileSize || 'PDF'}</span>
                      </div>
                    )}
                    <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
                      <span className="text-slate-500 block">{language === 'ht' ? 'Livrezon:' : 'Livraison:'}</span>
                      <span className="font-bold text-slate-900">
                        {product.bookFormat === 'pdf' || product.category === 'LivPDF'
                          ? (language === 'ht' ? '⚡ Imedya (Telechajman)' : '⚡ Téléchargement immédiat')
                          : (language === 'ht' ? '🏍️ Ajan Livrè Yogann' : '🏍️ Livreur')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Seller Profile Card */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Store size={14} className="text-amber-700" />
                    <span>{product.sellerBusiness || product.sellerName}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {language === 'ht' ? 'Vandè Verifye' : 'Vendeur Vérifié'}
                  </span>
                </div>
                <p className="text-slate-600 flex items-center gap-1">
                  <MapPin size={13} className="text-red-500 shrink-0" />
                  <span>{product.sellerLocation}</span>
                </p>
                <p className="text-slate-600 flex items-center gap-1">
                  <Phone size={13} className="text-slate-400 shrink-0" />
                  <span>WhatsApp: {product.sellerPhone}</span>
                </p>
              </div>

              {/* Stock availability */}
              <div className="text-xs">
                {isSoldOut ? (
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <AlertCircle size={14} />
                    <span>{language === 'ht' ? 'Pwodwi sa a vann tout kounye a.' : 'Ce produit est actuellement en rupture.'}</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check size={14} />
                    <span>{product.quantity} {language === 'ht' ? 'disponib nan stòk' : 'disponibles en stock'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Quantity & Buttons */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              {!isSoldOut && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">
                    {language === 'ht' ? 'Kantite:' : 'Quantité:'}
                  </span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 ml-auto">
                    Total: <strong className="text-slate-900">{(product.price * quantity).toLocaleString()} HTG</strong>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <motion.button
                  disabled={isSoldOut}
                  whileHover={!isSoldOut ? { scale: 1.02, y: -1 } : undefined}
                  whileTap={!isSoldOut ? { scale: 0.98 } : undefined}
                  onClick={() => {
                    addToCart(product, quantity);
                    setSelectedProductForDetail(null);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isSoldOut
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                  }`}
                >
                  <ShoppingBag size={16} />
                  <span>{language === 'ht' ? 'Ajoute nan Panye' : 'Ajouter au Panier'}</span>
                </motion.button>

                <motion.button
                  disabled={isSoldOut}
                  whileHover={!isSoldOut ? { scale: 1.02, y: -1 } : undefined}
                  whileTap={!isSoldOut ? { scale: 0.98 } : undefined}
                  onClick={handleBuyNow}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer ${
                    isSoldOut
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                  }`}
                >
                  <Zap size={16} />
                  <span>{language === 'ht' ? 'Achte Kounye a' : 'Acheter Maintenant'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleShare}
                  className="p-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                  title="Pataje"
                >
                  {copied ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
