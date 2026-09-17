import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Percent, Truck, AlertOctagon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VendorTermsModal: React.FC = () => {
  const { language, isTermsModalOpen, setIsTermsModalOpen } = useApp();

  if (!isTermsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-amber-800" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit']">
              {language === 'ht'
                ? 'Règleman & Gid Ofisyèl Vandè · Mache Yogann'
                : 'Règlement et Conditions Générales Vendeur'}
            </h2>
          </div>
          <button
            onClick={() => setIsTermsModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-start gap-3">
            <Percent size={24} className="text-amber-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 text-sm">
                {language === 'ht' ? 'Règ Komisyon 10% an' : 'Règle de Commission 10%'}
              </h4>
              <p className="text-xs text-amber-900 mt-1">
                {language === 'ht'
                  ? 'Mache Yogann pran egzakteman 10% komisyon sou chak atik ou vann pou kouvri jesyon sit la, sipò klyan, ak òganizasyon livrezon an. Vandè a resevwa 90% pri vant lan nèt sou kont MonCash oswa NatCash li.'
                  : 'Mache Yogann prélève une commission transparente de 10% sur chaque vente. Vous percevez 90% du montant net via MonCash ou NatCash.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>1. Admisibilite ak Lokalizasyon</span>
            </h3>
            <p className="text-xs text-slate-600 pl-6">
              Tout machann, atizan, kiltivatè ak boutik ki nan komin Leyogàn ak zòn vwazen yo (Gresye, Ti Rivyè, Gran Gwav, Kafou...) ka poste pwodwi yo gratis. Vandè a dwe bay yon nimewo telefòn (WhatsApp) ki fonksyone nòmalman.
            </p>

            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Truck size={16} className="text-blue-600" />
              <span>2. Prensip Rekipirasyon Machandiz</span>
            </h3>
            <p className="text-xs text-slate-600 pl-6">
              Vandè a pa bezwen deplase pou pote machandiz la bay kliyan an. Yon ajan livrezon motosiklèt Mache Yogann ap pase dirèkteman kote w ye a pou pran pwodwi a yon fwa peman kliyan an fin valide pa administrasyon an.
            </p>

            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>3. Kalite Pwodwi ak Garanti</span>
            </h3>
            <p className="text-xs text-slate-600 pl-6">
              Pwodwi ou bay ajan an dwe egzakteman sa ki sou foto a ak nan deskripsyon an. Li dwe nèf oswa nan bon kondisyon fonksyonèl. Si gen yon fo pwodwi oswa machandiz domaje, vandè a ap oblije ranbouse epi li ka pran sanksyon.
            </p>

            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <AlertOctagon size={16} className="text-red-600" />
              <span>4. Règleman Peman Vandè</span>
            </h3>
            <p className="text-xs text-slate-600 pl-6">
              Peman 90% pou vandè a fèt imedyatman lè ajan an fin pran pake a oswa nan mwens pase 24 trèdtan sou nimewo MonCash/NatCash ki sou pwofil ou a.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={() => setIsTermsModalOpen(false)}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer"
          >
            {language === 'ht' ? 'Mwen Konprann epi Aksepte' : 'J\'ai Compris'}
          </button>
        </div>
      </div>
    </div>
  );
};
