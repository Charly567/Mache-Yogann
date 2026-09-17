import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Store,
  Truck,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Languages,
  Package,
  Sparkles,
  Crown,
  Bot,
  Lock,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { NotificationCenter } from './NotificationCenter';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currentUser,
    logout,
    switchDemoUser,
    activeTab,
    setActiveTab,
    cartCount,
    cartBouncing,
    products,
    setSelectedProductForDetail,
    setIsCartOpen,
    setIsAuthModalOpen,
    setAuthMode,
    searchQuery,
    setSearchQuery,
    siteSettings,
    isOwner,
    verifyOwnerPin,
    setIsChatOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setTrackingOrderId,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleOpenOwnerSpace = () => {
    if (currentUser?.role === 'owner') {
      setActiveTab('owner');
    } else {
      setIsPinModalOpen(true);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyOwnerPin(pinInput);
    if (success) {
      setIsPinModalOpen(false);
      setPinInput('');
    }
  };

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter top matches for real-time search suggestions dropdown
  const searchMatches = searchQuery.trim().length > 1
    ? products
        .filter((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const t = {
    ht: {
      slogan: 'Marketplace Ayisyen',
      searchPlaceholder: 'Chèche telefòn, diri, rad, mango, elektwonik...',
      home: 'Akèy',
      products: 'Boutik',
      trackOrder: 'Swiv Kòmand',
      sellOn: 'Vann sou Mache Yogann',
      login: 'Konekte',
      register: 'Enskri',
      myAccount: 'Kont Mwen',
      vendorSpace: 'Tablo Vandè',
      agentSpace: 'Espas Ajan',
      adminSpace: 'Administrasyon',
      logout: 'Dekonekte',
      rolePreview: 'Chanje Wòl (Tès)',
      buyer: 'Achtè',
      seller: 'Vandè',
      agent: 'Ajan Livrezon',
      admin: 'Administratè',
    },
    fr: {
      slogan: 'Marketplace Haïtienne',
      searchPlaceholder: 'Rechercher téléphones, riz, vêtements, mangues...',
      home: 'Accueil',
      products: 'Boutique',
      trackOrder: 'Suivre Commande',
      sellOn: 'Vendre sur Mache Yogann',
      login: 'Connexion',
      register: 'Inscription',
      myAccount: 'Mon Compte',
      vendorSpace: 'Espace Vendeur',
      agentSpace: 'Espace Agent',
      adminSpace: 'Administration',
      logout: 'Déconnexion',
      rolePreview: 'Tester un rôle',
      buyer: 'Acheteur',
      seller: 'Vendeur',
      agent: 'Agent de Livraison',
      admin: 'Administrateur',
    },
  }[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs">
      {/* Top micro bar: Notice & Quick Role Tester */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              🇭🇹 Leyogàn &amp; Tout Ayiti
            </span>
            <span className="hidden sm:inline text-slate-400">
              {siteSettings.topBannerNotice || 'Peman MonCash, NatCash & Kripto | Livrezon garanti pa Mache Yogann'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Owner Space button - ONLY VISIBLE IF LOGGED IN AS OWNER */}
            {(currentUser?.role === 'owner' || isOwner) && (
              <button
                onClick={handleOpenOwnerSpace}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Aksè dirèk nan Espas Pwopriyetè a"
              >
                <Crown size={13} />
                <span>Espas Pwopriyetè</span>
              </button>
            )}

            {/* Quick Demo Role Switcher - Strictly Buyer & Seller visible for users */}
            <div className="relative">
              <button
                id="role-switch-button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer border border-amber-400/30"
                title="Chanje wòl tès (Achtè oswa Vandè)"
              >
                <span>{language === 'ht' ? 'Kont' : 'Compte'}:</span>
                <strong className="text-white">
                  {currentUser ? (
                    currentUser.role === 'owner' ? 'Pwopriyetè' :
                    currentUser.role === 'seller' ? t.seller : t.buyer
                  ) : t.buyer}
                </strong>
                <ChevronDown size={13} />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'ht' ? 'Chwazi Wòl Ou' : 'Choisir votre rôle'}
                  </div>
                  <button
                    onClick={() => { switchDemoUser('buyer'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span className="font-semibold">🛒 {t.buyer} (Marie)</span>
                    {currentUser?.role === 'buyer' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchDemoUser('seller'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span className="font-semibold">🏪 {t.seller} (Jak Pierre)</span>
                    {currentUser?.role === 'seller' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                  {(currentUser?.role === 'owner' || isOwner) && (
                    <button
                      onClick={() => { switchDemoUser('owner'); setRoleDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 flex items-center justify-between font-bold text-amber-900 border-t border-slate-100"
                    >
                      <span>👑 Pwopriyetè Mache Yogann</span>
                      {currentUser?.role === 'owner' && <span className="text-amber-600 font-bold">✓</span>}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Language toggle */}
            <button
              id="language-toggle-btn"
              onClick={() => setLanguage(language === 'ht' ? 'fr' : 'ht')}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Chanje Lang (Kreyòl / Français)"
            >
              <Languages size={13} />
              <span className="font-semibold uppercase">{language}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo with Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => { setActiveTab('home'); }}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-red-500/20 group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300">
            MY
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Outfit']">
                {siteSettings.siteName}
              </span>
              <span className="text-base" title="Haïti">🇭🇹</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
              {siteSettings.sloganHt || t.slogan} · Leyogàn
            </p>
          </div>
        </motion.div>

        {/* Search Bar with Focus Expansion & Real-Time Suggestions Dropdown */}
        <div ref={searchContainerRef} className="flex-1 max-w-xl mx-2 hidden md:block relative z-30">
          <motion.div
            animate={{
              scale: isSearchFocused ? 1.01 : 1,
            }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`relative rounded-full transition-shadow duration-200 ${
              isSearchFocused
                ? 'ring-3 ring-red-500/20 shadow-md border-red-500'
                : 'shadow-xs'
            }`}
          >
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-sm text-slate-900 rounded-full border border-slate-200 focus:border-red-500 focus:outline-none transition-colors duration-200"
            />
            <Search
              className={`absolute left-3.5 top-2.5 transition-colors duration-200 ${
                isSearchFocused ? 'text-red-600' : 'text-slate-400'
              }`}
              size={17}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-200/60"
              >
                ✕
              </button>
            )}
          </motion.div>

          {/* Real-time Search Suggestions Dropdown with Staggered Fade */}
          <AnimatePresence>
            {isSearchFocused && searchMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-2"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{language === 'ht' ? 'Rezilta rapid' : 'Résultats rapides'}</span>
                  <Sparkles size={12} className="text-amber-500" />
                </div>
                <div className="divide-y divide-slate-100">
                  {searchMatches.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.2 }}
                      onClick={() => {
                        setSelectedProductForDetail(product);
                        setIsSearchFocused(false);
                      }}
                      className="p-2 flex items-center gap-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {product.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {product.category} · {product.sellerLocation}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-red-600 font-['Outfit'] shrink-0">
                        {product.price.toLocaleString()} HTG
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'home' ? 'text-red-600 bg-red-50 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              {t.home}
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('track')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'track' ? 'text-red-600 bg-red-50 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              <Package size={15} />
              <span>{t.trackOrder}</span>
            </motion.button>

            {/* Services Numériques Direct Link */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab('home');
                setTimeout(() => {
                  document.getElementById('services-numeriques-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 hover:bg-amber-50/70 text-slate-800"
            >
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <span>Sèvis Dijital</span>
            </motion.button>

            {/* Seller dashboard quick button */}
            {currentUser?.role === 'seller' && (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('vendor')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'vendor' ? 'text-amber-700 bg-amber-50 font-semibold' : 'hover:bg-amber-50/60 text-amber-800'
                }`}
              >
                <Store size={15} />
                <span>{t.vendorSpace}</span>
              </motion.button>
            )}

            {/* Agent portal quick button */}
            {currentUser?.role === 'agent' && (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('agent')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'agent' ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:bg-blue-50/60 text-blue-800'
                }`}
              >
                <Truck size={15} />
                <span>{t.agentSpace}</span>
              </motion.button>
            )}

            {/* Admin portal quick button */}
            {currentUser?.role === 'admin' && (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'admin' ? 'text-indigo-700 bg-indigo-50 font-semibold' : 'hover:bg-indigo-50/60 text-indigo-800'
                }`}
              >
                <ShieldCheck size={15} />
                <span>{t.adminSpace}</span>
              </motion.button>
            )}

            {/* Owner space quick button */}
            {(currentUser?.role === 'owner' || isOwner) && (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('owner')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'owner' ? 'text-amber-900 bg-amber-100 font-bold border border-amber-300' : 'hover:bg-amber-50 text-amber-800 font-semibold'
                }`}
              >
                <Crown size={15} />
                <span>Espas Pwopriyetè</span>
              </motion.button>
            )}
          </nav>

          {/* Ti Yogann AI Assistant Quick Launcher */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Louvri Ti Yogann AI (Chatbot)"
          >
            <Bot size={16} className="text-indigo-600" />
            <span className="hidden sm:inline">Ti Yogann AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </motion.button>

          {/* Sell CTA button */}
          <motion.button
            id="header-sell-btn"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (currentUser?.role === 'seller') {
                setActiveTab('vendor');
              } else {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }
            }}
            className="hidden sm:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
          >
            <Store size={16} />
            <span>{t.sellOn}</span>
          </motion.button>

          {/* Notification Center */}
          <NotificationCenter
            notifications={notifications}
            onMarkRead={markNotificationRead}
            onMarkAllRead={markAllNotificationsRead}
            onSelectOrder={(orderId) => {
              setTrackingOrderId(orderId);
              setActiveTab('track');
            }}
          />

          {/* Cart Button with Micro-Interaction Bounce */}
          <motion.button
            id="header-cart-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={cartBouncing ? { scale: [1, 1.15, 0.95, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Panye acha"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={
                  cartBouncing
                    ? { scale: [1, 1.45, 0.85, 1.2, 1], opacity: 1 }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {/* User Auth / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 sm:border-l sm:border-slate-200">
              <div className="hidden xl:block text-right">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 capitalize">
                  {currentUser.role === 'buyer' ? t.buyer :
                   currentUser.role === 'seller' ? t.seller :
                   currentUser.role === 'agent' ? t.agent : t.admin}
                </p>
              </div>

              <button
                id="header-logout-btn"
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title={t.logout}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="header-login-btn"
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <UserIcon size={16} />
                <span>{t.login}</span>
              </button>
              <button
                id="header-register-btn"
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                {t.register}
              </button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Meni mobil"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (under header on small screens) */}
      <div className="p-2 border-t border-slate-100 md:hidden bg-white">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-red-500"
          />
          <Search className="absolute left-3 top-2 text-slate-400" size={15} />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'home' ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-700'
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => { setActiveTab('track'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeTab === 'track' ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-700'
            }`}
          >
            <Package size={16} />
            <span>{t.trackOrder}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
              setTimeout(() => {
                document.getElementById('services-numeriques-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-100"
          >
            <Zap size={16} className="text-amber-500 fill-amber-500" />
            <span>Sèvis Dijital (Free Fire, Netflix, Digicel...)</span>
          </button>

          {currentUser?.role === 'seller' && (
            <button
              onClick={() => { setActiveTab('vendor'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-800 bg-amber-50 flex items-center gap-2"
            >
              <Store size={16} />
              <span>{t.vendorSpace}</span>
            </button>
          )}

          {currentUser?.role === 'agent' && (
            <button
              onClick={() => { setActiveTab('agent'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-blue-800 bg-blue-50 flex items-center gap-2"
            >
              <Truck size={16} />
              <span>{t.agentSpace}</span>
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-indigo-800 bg-indigo-50 flex items-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>{t.adminSpace}</span>
            </button>
          )}

          {/* Owner space in mobile menu - ONLY for Owner */}
          {(currentUser?.role === 'owner' || isOwner) && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenOwnerSpace();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-amber-950 bg-amber-100 flex items-center gap-2 border border-amber-300"
            >
              <Crown size={16} className="text-amber-600" />
              <span>Espas Pwopriyetè (Kontwòl Sit la)</span>
            </button>
          )}

          {/* ChatBot trigger in mobile menu */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsChatOpen(true);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-indigo-800 bg-indigo-50 flex items-center gap-2 border border-indigo-200"
          >
            <Bot size={16} className="text-indigo-600" />
            <span>Ti Yogann AI (Chatbot Asistan)</span>
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-center rounded-lg text-sm"
            >
              {t.sellOn}
            </button>
          </div>
        </div>
      )}

      {/* Owner PIN Security Modal */}
      <AnimatePresence>
        {isPinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 p-6 text-white text-center relative">
                <button
                  onClick={() => {
                    setIsPinModalOpen(false);
                    setPinInput('');
                  }}
                  className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Crown size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Espas Pwopriyetè a</h3>
                <p className="text-xs text-amber-100 mt-1">
                  Mete Kòd Sekirite (PIN) ou pou jere tout sit la san limit.
                </p>
              </div>

              <form onSubmit={handleVerifyPin} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Kòd PIN Pwopriyetè (Defo: 2026)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      autoFocus
                      maxLength={8}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Mete PIN la..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-center text-xl font-mono tracking-widest text-slate-900 focus:outline-none transition-all"
                    />
                    <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 text-center">
                    Kòd defo pou tès la se: <strong className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">2026</strong>. Ou ka chanje l nan panèl la.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPinModalOpen(false);
                      setPinInput('');
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
                  >
                    Anile
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm cursor-pointer shadow-md shadow-amber-500/20 transition-transform active:scale-98"
                  >
                    Debloke Espas la 👑
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
