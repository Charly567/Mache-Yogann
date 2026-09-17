import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    language,
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    setIsCheckoutOpen,
  } = useApp();

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
          >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-red-600" size={20} />
            <h2 className="font-bold text-slate-900 font-['Outfit'] text-base sm:text-lg">
              {language === 'ht' ? 'Panye Ou a' : 'Votre Panier'} ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
            aria-label="Fèmen"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4"
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner"
              >
                <ShoppingBag size={30} />
              </motion.div>
              <div>
                <p className="font-bold text-slate-800 text-base">
                  {language === 'ht' ? 'Panye ou vid' : 'Votre panier est vide'}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {language === 'ht'
                    ? 'Chwazi pwodwi nan boutik la pou w mete yo nan panye ou.'
                    : 'Découvrez nos produits locaux et commencez vos achats.'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                {language === 'ht' ? 'Eksplore Boutik la' : 'Explorer la boutique'}
              </motion.button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {cart.map((item) => (
                  <motion.div
                    layout
                    key={item.product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate" title={item.product.title}>
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin size={10} className="text-red-500" />
                        <span>{item.product.sellerBusiness || item.product.sellerName} · {item.product.sellerLocation.split(',')[0]}</span>
                      </p>
                      <p className="text-xs font-black text-slate-900">
                        {item.product.price.toLocaleString()} HTG
                      </p>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold cursor-pointer"
                          >
                            -
                          </motion.button>
                          <span className="px-2 py-0.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateCartQuantity(item.product.id, Math.min(item.product.quantity, item.quantity + 1))}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold cursor-pointer"
                          >
                            +
                          </motion.button>
                        </div>

                        <span className="text-[11px] text-slate-400">
                          = {(item.product.price * item.quantity).toLocaleString()} HTG
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title={language === 'ht' ? 'Retire' : 'Supprimer'}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  onClick={clearCart}
                  className="text-slate-400 hover:text-red-600 underline cursor-pointer"
                >
                  {language === 'ht' ? 'Vide tout panye a' : 'Vider le panier'}
                </button>
                <span className="text-slate-500 text-[11px]">
                  {language === 'ht' ? 'Livrezon kalkile nan kès' : 'Livraison calculée à la caisse'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{language === 'ht' ? 'Sous-total:' : 'Sous-total:'}</span>
                <span className="font-semibold text-slate-900">{cartTotal.toLocaleString()} HTG</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'ht' ? 'Livrezon Leyogàn:' : 'Livraison Léogâne:'}</span>
                <span className="font-semibold text-emerald-600">
                  {language === 'ht' ? 'Estanda (Gratis oswa 150 HTG)' : 'Standard'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total:</span>
                <motion.span
                  key={cartTotal}
                  initial={{ scale: 1.1, color: '#dc2626' }}
                  animate={{ scale: 1, color: '#dc2626' }}
                  transition={{ duration: 0.25 }}
                  className="text-base font-black font-['Outfit']"
                >
                  {cartTotal.toLocaleString()} HTG
                </motion.span>
              </div>
            </div>

            <motion.button
              id="cart-checkout-btn"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={handleCheckout}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-600/30 transition-colors cursor-pointer text-sm"
            >
              <span>{language === 'ht' ? 'Pase Kòmand lan' : 'Passer la commande'}</span>
              <ArrowRight size={16} />
            </motion.button>

            <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>{language === 'ht' ? 'Peman sekirize MonCash, NatCash & Kripto' : 'Paiements MonCash, NatCash & Crypto sécurisés'}</span>
            </p>
          </div>
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
