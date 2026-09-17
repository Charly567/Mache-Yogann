import React, { useState } from 'react';
import { X, AlertTriangle, Send, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DisputeModal: React.FC = () => {
  const {
    language,
    isDisputeModalOpen,
    setIsDisputeModalOpen,
    disputeOrderId,
    setDisputeOrderId,
    currentUser,
    addDispute,
  } = useApp();

  const [reason, setReason] = useState('Pwodwi domaje oswa pa konfòm');
  const [details, setDetails] = useState('');
  const [proofFile, setProofFile] = useState<string | null>(null);

  if (!isDisputeModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeOrderId || !details) return;

    addDispute({
      orderId: disputeOrderId,
      userId: currentUser?.id || 'anon_user',
      userName: currentUser?.name || 'Kliyan Mache Yogann',
      userRole: currentUser?.role || 'buyer',
      reason,
      details,
      proofPhotos: proofFile ? [proofFile] : [],
    });

    setIsDisputeModalOpen(false);
    setDetails('');
    setProofFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-red-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-900">
            <AlertTriangle size={20} className="text-red-600" />
            <h3 className="font-bold font-['Outfit'] text-base">
              {language === 'ht' ? 'Siyale yon Litij oswa Ranbousman' : 'Ouvrir un Litige'}
            </h3>
          </div>
          <button
            onClick={() => setIsDisputeModalOpen(false)}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ht' ? 'Nimewo Kòmand lan *' : 'Numéro de Commande *'}
            </label>
            <input
              type="text"
              required
              value={disputeOrderId || ''}
              onChange={(e) => setDisputeOrderId(e.target.value)}
              placeholder="MY-2026-XXXXXX"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ht' ? 'Rezon Reklamasyon an *' : 'Motif de la réclamation *'}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="Pwodwi domaje oswa pa konfòm">Pwodwi domaje oswa pa konfòm ak foto a</option>
              <option value="Atik manke nan pake a">Gen atik ki manke nan kòmand lan</option>
              <option value="Ajan an pa janm livre">Ajan an pa janm pase livre pake a</option>
              <option value="Erè nan peman MonCash/NatCash">Erè nan peman MonCash oswa NatCash</option>
              <option value="Lòt rezon">Lòt rezon espesyal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ht' ? 'Eksplike pwoblèm nan an detay *' : 'Détails du problème *'}
            </label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tanpri bay maksimòm enfòmasyon pou administrasyon Mache Yogann ka trete dosye ou pi rapid..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ht' ? 'Ajoute yon foto kòm prèv (opsyonèl)' : 'Photo de preuve (optionnel)'}
            </label>
            <label className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs text-slate-600 cursor-pointer">
              <Upload size={16} className="text-slate-400" />
              <span>{proofFile ? 'Foto anrejistre avèk siksè' : (language === 'ht' ? 'Chwazi yon foto' : 'Téléverser')}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setProofFile(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsDisputeModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              {language === 'ht' ? 'Anile' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
            >
              <Send size={14} />
              <span>{language === 'ht' ? 'Voye Reklamasyon an' : 'Soumettre le litige'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
