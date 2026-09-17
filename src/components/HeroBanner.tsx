import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Store,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Smartphone,
  Coins,
  Film,
  ListOrdered,
  Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroStoryAnimation } from './HeroStoryAnimation';

export const HeroBanner: React.FC = () => {
  const { language, setActiveTab, setAuthMode, setIsAuthModalOpen, currentUser, siteSettings } = useApp();

  const [activeSlide, setActiveSlide] = useState(0);
  const [rightPanelMode, setRightPanelMode] = useState<'story' | 'steps' | 'video'>('story');

  const slides = [
    {
      titleHt: siteSettings.heroTitleHt || 'Achte & Vann fasil nan Leyogàn ak tout Ayiti',
      titleFr: 'Achetez et vendez facilement à Léogâne et partout en Haïti',
      subtitleHt: siteSettings.heroSubtitleHt || 'Marketplace lokal kote vandè poste pwodwi yo, kliyan peye an sekirite pa MonCash, NatCash oswa Kripto, epi Mache Yogann okipe livrezon an.',
      subtitleFr: 'Marketplace locale où les vendeurs publient leurs produits, les clients paient par MonCash, NatCash ou Crypto, et Mache Yogann assure la livraison.',
      badgeHt: siteSettings.heroBadgeHt || 'Marketplace Haïtienne 🇭🇹',
      badgeFr: 'Marketplace Haïtienne 🇭🇹',
      image: siteSettings.heroImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      titleHt: 'Sistèm Livrezon Dirèk pa Ajan Mache Yogann',
      titleFr: 'Système de Livraison Direct par nos Agents Dédiés',
      subtitleHt: 'Nou ale pran machandiz la dirèkteman nan men vandè a nan Leyogàn, epi livre l san danje nan men kliyan an ak yon kòd konfimasyon.',
      subtitleFr: 'Nous récupérons le produit directement chez le vendeur à Léogâne et le livrons en main propre au client avec un code de sécurité.',
      badgeHt: 'Livrezon Garanti 🛵',
      badgeFr: 'Livraison Garantie 🛵',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      titleHt: `Peman Fasil: MonCash (${siteSettings.moncashNumber}), NatCash & Kripto`,
      titleFr: 'Paiements Sécurisés: MonCash, NatCash & Crypto',
      subtitleHt: 'Pa bezwen kat kredi entènasyonal. Peye dirèkteman ak telefòn ou oswa an USDT/BTC ak verifikasyon tranzaksyon an.',
      subtitleFr: 'Pas besoin de carte bancaire internationale. Payez directement avec votre compte mobile ou en USDT avec confirmation rapide.',
      badgeHt: 'Peman 100% Sekirize 🔒',
      badgeFr: 'Paiement 100% Sécurisé 🔒',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[activeSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl mx-4 my-4 shadow-xl border border-slate-700/50">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
        <img
          src={current.image}
          alt={siteSettings.siteName}
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
      </div>

      {/* Decorative gradient blur lights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Column: Hero Copy */}
        <div className="max-w-2xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur text-xs font-semibold text-amber-400">
            <Sparkles size={14} />
            <span>{language === 'ht' ? current.badgeHt : current.badgeFr}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] font-['Outfit']">
            {language === 'ht' ? current.titleHt : current.titleFr}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            {language === 'ht' ? current.subtitleHt : current.subtitleFr}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('pwodwi-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg shadow-red-600/30 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <ShoppingBag size={18} />
              <span>{language === 'ht' ? 'Kòmanse Achte' : 'Commencer à Acheter'}</span>
            </button>

            <button
              onClick={() => {
                if (currentUser?.role === 'seller') {
                  setActiveTab('vendor');
                } else {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }
              }}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-amber-400/30 font-semibold text-sm sm:text-base px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
              <Store size={18} />
              <span>{language === 'ht' ? 'Mwen Vle Vann' : 'Devenir Vendeur'}</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 hover:text-white px-3 py-2 underline underline-offset-4 cursor-pointer"
            >
              <span>{language === 'ht' ? 'Swiv kòmand mwen' : 'Suivre ma commande'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Core Trust Indicators */}
          <div className="pt-6 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <p className="text-xl sm:text-2xl font-black text-amber-400 font-['Outfit']">100%</p>
              <p className="text-xs text-slate-400 font-medium">{language === 'ht' ? 'Vandè Lokal' : 'Vendeurs Locaux'}</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 font-['Outfit']">{siteSettings.commissionPercent}%</p>
              <p className="text-xs text-slate-400 font-medium">{language === 'ht' ? 'Komisyon Sèlman' : 'Commission Fixe'}</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-red-400 font-['Outfit']">MonCash</p>
              <p className="text-xs text-slate-400 font-medium">&amp; NatCash / Crypto</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-blue-400 font-['Outfit']">Pòt-an-Pòt</p>
              <p className="text-xs text-slate-400 font-medium">{language === 'ht' ? 'Livrezon Yogann' : 'Livraison Directe'}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Process Showcase & 3D Animation Story */}
        <div className="w-full lg:w-[440px] xl:w-[480px] shrink-0 flex flex-col space-y-2">
          {/* Sub-toggle switch: Istwa 3D Anime vs 4 Etap vs Videyo */}
          <div className="flex items-center justify-between px-1">
            <div className="inline-flex p-1 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs">
              <button
                type="button"
                onClick={() => setRightPanelMode('story')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  rightPanelMode === 'story'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles size={13} className="text-amber-300" />
                <span>{language === 'ht' ? 'Istwa 3D Anime' : 'Histoire 3D Animée'}</span>
              </button>

              {siteSettings.heroVideoUrl && (
                <button
                  type="button"
                  onClick={() => setRightPanelMode('video')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    rightPanelMode === 'video'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Play size={13} />
                  <span>{language === 'ht' ? 'Videyo' : 'Vidéo'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setRightPanelMode('steps')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  rightPanelMode === 'steps'
                    ? 'bg-slate-800 text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListOrdered size={13} />
                <span>{language === 'ht' ? '4 Etap yo' : '4 Étapes'}</span>
              </button>
            </div>

            {/* Slide Indicators for background carousel */}
            <div className="flex items-center gap-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'w-5 bg-red-500' : 'w-1.5 bg-slate-700'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {rightPanelMode === 'story' ? (
            <HeroStoryAnimation />
          ) : rightPanelMode === 'video' && siteSettings.heroVideoUrl ? (
            <div className="w-full h-80 rounded-3xl overflow-hidden bg-slate-950 border border-slate-700 shadow-2xl flex items-center justify-center">
              {siteSettings.heroVideoUrl.includes('youtube.com') || siteSettings.heroVideoUrl.includes('youtu.be') ? (
                <iframe
                  src={siteSettings.heroVideoUrl}
                  title="Hero Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={siteSettings.heroVideoUrl} controls className="w-full h-full object-cover" />
              )}
            </div>
          ) : (
            <div className="w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ht' ? 'Kijan Mache Yogann Mache' : 'Comment ça fonctionne'}
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {language === 'ht' ? 'Vandè a poste pwodwi l' : 'Le vendeur publie son produit'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {language === 'ht' ? 'Pri an HTG, foto, kantite ak kote l ye nan Leyogàn.' : 'Prix en HTG, photos, stock et localisation.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {language === 'ht' ? 'Klyan an kòmande & peye' : 'Le client commande et paie'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {language === 'ht' ? `Pa MonCash (${siteSettings.moncashNumber}), NatCash oswa Kripto.` : 'Par MonCash, NatCash ou Crypto avec référence.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {language === 'ht' ? 'Ajan Mache Yogann rekipere l' : 'L\'agent récupère le produit'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {language === 'ht' ? `Nou peye vandè a (komisyon ${siteSettings.commissionPercent}% dedwi).` : 'Le vendeur est payé (commission prélevée).'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {language === 'ht' ? 'Livrezon & Kòd sekirite' : 'Livraison sécurisée avec code'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {language === 'ht' ? 'Kliyan an resevwa machandiz la epi konfime ak kòd li.' : 'Le client reçoit son colis et confirme avec son code.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
