import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { VendorDashboard } from './components/VendorDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AuthModal } from './components/AuthModal';
import { DisputeModal } from './components/DisputeModal';
import { VendorTermsModal } from './components/VendorTermsModal';
import { BonDeLivraisonModal } from './components/BonDeLivraisonModal';
import { DigitalServicesSection } from './components/DigitalServicesSection';
import { DigitalOrderModal } from './components/DigitalOrderModal';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from './components/animations/PageTransition';
import { RevealOnScroll } from './components/animations/RevealOnScroll';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Store,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    language,
    activeTab,
    setActiveTab,
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    notification,
    setNotification,
    setIsTermsModalOpen,
    setIsAuthModalOpen,
    currentUser,
    activeBonDeLivraisonOrder,
    isBonDeLivraisonOpen,
    setIsBonDeLivraisonOpen,
  } = useApp();

  // Filter products for the store view
  const publishedProducts = products.filter((p) => p.status === 'published');

  const filteredProducts = publishedProducts.filter((product) => {
    // Category filter
    const matchesCategory =
      selectedCategory === 'Tout' || product.category === selectedCategory;

    // Search query filter
    const matchesSearch =
      !searchQuery.trim() ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerLocation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-red-500 selection:text-white">
      {/* Toast Notification Banner with motion */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div
              className={`p-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-semibold backdrop-blur ${
                notification.type === 'success'
                  ? 'bg-emerald-50/95 border-emerald-300 text-emerald-900'
                  : notification.type === 'error'
                  ? 'bg-red-50/95 border-red-300 text-red-900'
                  : 'bg-blue-50/95 border-blue-300 text-blue-900'
              }`}
            >
              {notification.type === 'success' && <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />}
              {notification.type === 'error' && <AlertCircle size={18} className="text-red-600 shrink-0" />}
              {notification.type === 'info' && <Info size={18} className="text-blue-600 shrink-0" />}
              <span className="flex-1">{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="p-1 hover:bg-black/5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Application Header */}
      <Header />

      {/* Main View Switcher with smooth transition */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 pb-12"
            >
              {/* Dynamic Hero Banner */}
              <HeroBanner />

              {/* Category Filter */}
              <CategoryFilter />

              {/* Mache Yogann Official Digital Services Section */}
              <DigitalServicesSection />

              {/* Products Grid Section */}
              <section id="pwodwi-section" className="max-w-7xl mx-auto px-4 pt-2">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit']">
                      {selectedCategory === 'Tout'
                        ? (language === 'ht' ? 'Tout Katalòg Pwodwi yo' : 'Tout le Catalogue')
                        : (language === 'ht' ? `Koleksyon konplè: ${selectedCategory}` : `Collection complète : ${selectedCategory}`)}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === 'ht'
                        ? `${filteredProducts.length} pwodwi disponib pou livrezon rapid nan Leyogàn ak tout Ayiti`
                        : `${filteredProducts.length} produits disponibles pour livraison rapide`}
                    </p>
                  </div>

                  {selectedCategory !== 'Tout' && (
                    <button
                      onClick={() => setSelectedCategory('Tout')}
                      className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      <span>{language === 'ht' ? 'Wè tout pwodwi' : 'Voir tous les produits'}</span>
                    </button>
                  )}
                </div>
              {/* Filter / Search Feedback bar */}
              {(selectedCategory !== 'Tout' || searchQuery) && (
                <div className="mb-4 flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">
                      {language === 'ht' ? 'Rezilta pou:' : 'Résultats pour:'}
                    </span>
                    {selectedCategory !== 'Tout' && (
                      <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                        {selectedCategory}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                        "{searchQuery}"
                      </span>
                    )}
                    <span className="text-slate-400">({filteredProducts.length} pwodwi)</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory('Tout');
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-1 text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>{language === 'ht' ? 'Reyinisyalize' : 'Réinitialiser'}</span>
                  </button>
                </div>
              )}

              {/* Product Cards Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {language === 'ht' ? 'Pa gen pwodwi ki koresponn' : 'Aucun produit trouvé'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      {language === 'ht'
                        ? 'Eseye chanje mo rechèch la oswa chwazi yon lòt kategori nan lis anwo a.'
                        : 'Essayez de modifier votre recherche ou sélectionnez une autre catégorie.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('Tout');
                      setSearchQuery('');
                    }}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {language === 'ht' ? 'Afiche tout pwodwi yo' : 'Afficher tous les produits'}
                  </button>
                </div>
              )}
            </section>

            {/* Trust and How Mache Yogann Works Featurettes */}
            <section className="max-w-7xl mx-auto px-4 py-8">
              <RevealOnScroll>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm font-['Outfit']">
                        {language === 'ht' ? 'Peman MonCash & NatCash Sekirize' : 'Paiements Vérifiés'}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {language === 'ht'
                          ? 'Lajan ou an sekirite. Nou verifye chak peman epi nou peye vandè a sèlman lè pwodwi a pare.'
                          : 'Transactions sécurisées via MonCash, NatCash et USDT avec vérification administrative.'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Truck size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm font-['Outfit']">
                        {language === 'ht' ? 'Livrezon Rapid Motosiklèt' : 'Livraison Locale Rapide'}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {language === 'ht'
                          ? 'Ajan nou yo nan Leyogàn pran machandiz la nan men vandè a epi pote l dirèkteman kote w ye a.'
                          : 'Des agents de livraison dédiés sillonnent Léogâne et ses environs pour livrer chez vous.'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Store size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm font-['Outfit']">
                        {language === 'ht' ? 'Pouse Komès ak Pwodiktè Lokal' : 'Commerce Local Valorisé'}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {language === 'ht'
                          ? 'Komisyon 10% sèlman. Nou ede atizan, kiltivatè ak boutik nan Leyogàn vann pi plis.'
                          : 'Seulement 10% de commission. Encourageons ensemble l\'économie et l\'artisanat haïtien.'}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </RevealOnScroll>
            </section>
            </motion.div>
          )}

          {/* Track Order View */}
          {activeTab === 'track' && (
            <motion.div
              key="tab-track"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <OrderTrackingView />
            </motion.div>
          )}

          {/* Vendor Dashboard View */}
          {activeTab === 'vendor' && (
            <motion.div
              key="tab-vendor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <VendorDashboard />
            </motion.div>
          )}

          {/* Agent Dashboard View */}
          {activeTab === 'agent' && (
            <motion.div
              key="tab-agent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AgentDashboard />
            </motion.div>
          )}

          {/* Admin Dashboard View */}
          {activeTab === 'admin' && (
            <motion.div
              key="tab-admin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AdminDashboard />
            </motion.div>
          )}

          {/* Owner Dashboard View (Visible only to authenticated Owner) */}
          {activeTab === 'owner' && (
            <motion.div
              key="tab-owner"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <OwnerDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Application Footer */}
      <Footer />

      {/* Interactive Modals and Drawers */}
      <AuthModal />
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <DigitalOrderModal />
      <DisputeModal />
      <VendorTermsModal />
      <BonDeLivraisonModal
        isOpen={isBonDeLivraisonOpen}
        onClose={() => setIsBonDeLivraisonOpen(false)}
        order={activeBonDeLivraisonOrder}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
