import React from 'react';
import { Store, Phone, MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { language, setActiveTab, setIsTermsModalOpen } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Presentation */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                Y
              </div>
              <div>
                <span className="text-xl font-black text-white font-['Outfit'] tracking-tight">
                  Mache Yogann <span className="text-red-500">🇭🇹</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium leading-none">
                  Boutik sou Entènèt Leyogàn
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ht'
                ? 'Premye platfòm e-commerce multi-vandè nan komin Leyogàn ak zòn vwazen yo. Nou konekte machann ak achtè ak yon sistèm livrezon rapid motosiklèt ak peman MonCash, NatCash & Kripto.'
                : 'La marketplace multi-vendeurs de référence pour Léogâne. Achat, vente, livraison sécurisée et paiements MonCash, NatCash & Crypto.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin size={14} className="text-red-500 shrink-0" />
              <span>Leyogàn, Depatman Lwès, Ayiti</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'ht' ? 'Navigasyon' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'ht' ? 'Akèy & Pwodwi' : 'Accueil & Produits'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'ht' ? 'Swiv Kòmand Ou' : 'Suivre une commande'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('vendor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'ht' ? 'Vann sou Mache Yogann' : 'Vendre sur Mache Yogann'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'ht' ? 'Règ & Kondisyon Vandè (10%)' : 'Conditions Vendeur'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'ht' ? 'Peman Sekirize' : 'Paiements Sécurisés'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ht'
                ? 'Nou verifye chak tranzaksyon anvan nenpòt livrezon kòmanse.'
                : 'Vérification manuelle et automatique des transactions.'}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="font-bold text-white">MonCash:</span>
                <span className="text-amber-300 font-mono text-xs">+509 47703814</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="font-bold text-white">NatCash:</span>
                <span className="text-blue-300 font-mono text-xs">+509 35100438</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-white">Kripto (USDT):</span>
                <span className="text-slate-400 text-[11px] ml-auto">TRC-20</span>
              </div>
            </div>
          </div>

          {/* Col 4: Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'ht' ? 'Sipò & Kontak' : 'Contact & Support'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'ht'
                ? 'Ou bezwen èd pou pase yon kòmand oswa pou w vin yon ajan livrezon?'
                : 'Une question ou besoin d\'assistance ?'}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone size={14} className="text-red-400 shrink-0" />
                <span>+509 47703814 (WhatsApp &amp; Apèl)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail size={14} className="text-red-400 shrink-0" />
                <a href="mailto:macheyogann@gmail.com" className="hover:text-white underline">
                  macheyogann@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>{language === 'ht' ? 'Sèvis Kliyan 7j/7 nan Leyogàn' : 'Service client 7j/7'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Mache Yogann 🇭🇹. Tout dwa rezève.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Kreye avèk</span>
            <Heart size={12} className="text-red-500 fill-red-500" />
            <span>pou kominote ak komès nan Leyogàn</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
