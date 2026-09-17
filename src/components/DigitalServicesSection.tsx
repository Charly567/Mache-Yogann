import React, { useState } from 'react';
import {
  Zap,
  Gamepad2,
  Smartphone,
  Tv,
  Gift,
  Shield,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { DigitalService } from '../types';

export const DigitalServicesSection: React.FC = () => {
  const {
    language,
    digitalServices,
    setSelectedDigitalService,
    setIsDigitalOrderModalOpen,
    setSelectedDigitalPackageId,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Only published and active services are visible to public buyers
  const publicServices = digitalServices.filter((s) => s.isPublished && s.isActive);

  const filtered = publicServices.filter((s) => {
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenService = (service: DigitalService, packageId?: string) => {
    setSelectedDigitalService(service);
    if (packageId) {
      setSelectedDigitalPackageId(packageId);
    } else if (service.packages && service.packages.length > 0) {
      setSelectedDigitalPackageId(service.packages[0].id);
    }
    setIsDigitalOrderModalOpen(true);
  };

  const categories = [
    { id: 'all', label: language === 'ht' ? 'Tout Sèvis yo' : 'Tous les Services', icon: Zap },
    { id: 'gaming', label: 'Gaming & Dyaman', icon: Gamepad2 },
    { id: 'telecom', label: 'Rechaj Digicel / Natcom', icon: Smartphone },
    { id: 'streaming', label: 'Streaming & Sinema', icon: Tv },
    { id: 'giftcard', label: 'Kat Kado & Gift Cards', icon: Gift },
    { id: 'vpn', label: 'VPN & Sekirite', icon: Shield },
  ];

  return (
    <section id="services-numeriques-section" className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Official Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/30 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-400" />
              <span>Sèvis Numériques Mache Yogann (Ofisyèl)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight text-white">
              {language === 'ht'
                ? 'Rechaj Gaming, Kat Kado, Minut & Streaming Imedya'
                : 'Recharges Jeux, Cartes Cadeaux, Télécom & Streaming'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ht'
                ? 'Peye fasilman ak MonCash, NatCash oswa Kripto USDT. Livrezon an sekirite fèt nan 5 a 15 minit dirèkteman pa ekip ofisyèl Mache Yogann lan.'
                : 'Paiement sécurisé par MonCash, NatCash ou USDT. Traitement instantané et garanti sous 5 à 15 minutes.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 text-center">
              <span className="text-[11px] text-slate-300 block">Sèvis Disponib</span>
              <span className="text-xl font-black text-amber-400 font-['Outfit']">{publicServices.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 text-center">
              <span className="text-[11px] text-slate-300 block">Délai Livrezon</span>
              <span className="text-xl font-black text-emerald-400 font-['Outfit']">5 - 15 min</span>
            </div>
          </div>
        </div>

        {/* Category Pills inside Banner */}
        <div className="relative z-10 flex items-center gap-2 mt-6 overflow-x-auto pb-1 border-t border-white/10 pt-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ht'
                ? 'Chèche Free Fire, Digicel, Netflix, Roblox, Steam...'
                : 'Rechercher un jeu, carte cadeau, opérateur...'
            }
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-600 shadow-2xs"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          {filtered.length} {language === 'ht' ? 'sèvis dijital jwenn' : 'services trouvés'}
        </span>
      </div>

      {/* Grid of Digital Services */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((service) => {
            const lowestPrice =
              service.packages && service.packages.length > 0
                ? Math.min(...service.packages.map((p) => p.sellingPrice))
                : service.defaultSellingPrice;

            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                {/* Image and Badge */}
                <div>
                  <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 uppercase tracking-wide">
                        {service.category}
                      </span>
                      {service.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-[10px] font-black text-slate-950 uppercase tracking-wider">
                          Popilè
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-950/80 backdrop-blur px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-300">
                        <Clock size={12} />
                        <span>{service.minDeliveryMinutes} - {service.maxDeliveryMinutes} min</span>
                      </div>
                      <span className="text-[10px] text-slate-300 font-medium">
                        {service.packages?.length || 1} opsyon
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base font-['Outfit'] line-clamp-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Available Packages Chips Preview */}
                    {service.packages && service.packages.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {service.packages.slice(0, 3).map((pkg) => (
                          <span
                            key={pkg.id}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-700"
                          >
                            {pkg.name}
                          </span>
                        ))}
                        {service.packages.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                            +{service.packages.length - 3} plis
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer and Call to Action */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Kòmanse a</span>
                    <span className="text-base font-black text-red-600 font-['Outfit']">
                      {lowestPrice.toLocaleString()} {service.currency || 'HTG'}
                    </span>
                  </div>

                  <button
                    id={`buy-digital-${service.id}`}
                    type="button"
                    onClick={() => handleOpenService(service)}
                    className="px-4 py-2 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Kòmande</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
          <Zap size={32} className="mx-auto text-slate-400" />
          <h4 className="font-bold text-slate-800 text-sm">Pa gen sèvis dijital nan rechèch sa a</h4>
          <p className="text-xs text-slate-500">Eseye chanje kategori a oswa mo rechèch la.</p>
        </div>
      )}
    </section>
  );
};
