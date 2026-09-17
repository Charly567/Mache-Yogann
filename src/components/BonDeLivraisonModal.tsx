import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle, Package, Truck, User, MapPin } from 'lucide-react';
import { Order } from '../types';

interface BonDeLivraisonModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const BonDeLivraisonModal: React.FC<BonDeLivraisonModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const bdlNumber = order.bonDeLivraison?.documentId || `BDL-${order.id.replace('#', '')}`;
  const verificationRef = order.bonDeLivraison?.verificationReference || `MY-VRF-${order.deliveryCode}-SEC`;
  const dateFormatted = new Date(order.createdAt).toLocaleDateString('fr-HT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base">Bon de Livraison Ofisyèl • {order.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Enprime / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="bon-de-livraison-print" className="p-6 sm:p-10 space-y-6 text-slate-800 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-950 font-serif">
                  MACHÈ <span className="text-emerald-700">YOGANN</span> 🇭🇹
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Premye Platfòm E-Commerce & Rezo Livrezon Lokal • Leyogàn, Ayiti
              </p>
              <p className="text-[11px] text-slate-500">
                Tel/WhatsApp: +509 47 70 38 14 • Imel: machechyogann@gmail.com
              </p>
            </div>

            <div className="sm:text-right border-l-2 sm:border-l-0 pl-3 sm:pl-0 border-emerald-600">
              <span className="inline-block bg-slate-900 text-white text-[10px] font-mono px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                BON DE LIVRAISON
              </span>
              <p className="font-mono font-bold text-sm text-slate-900 mt-1">{bdlNumber}</p>
              <p className="text-[11px] text-slate-500">Kòmand: {order.id}</p>
              <p className="text-[11px] text-slate-500">Dat: {dateFormatted}</p>
            </div>
          </div>

          {/* Key Parties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Destinataire / Achtè */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>KLIYAN / ACHTÈ</span>
              </div>
              <p className="font-bold text-slate-900">{order.buyerName}</p>
              <p className="text-slate-600 font-mono">{order.buyerPhone}</p>
              <p className="text-slate-600">{order.buyerAddress}</p>
              <p className="text-slate-600 font-semibold">{order.buyerZone}, {order.buyerCommune}</p>
            </div>

            {/* Expéditeur / Vandè */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-1.5">
                <Package className="w-3.5 h-3.5 text-amber-600" />
                <span>VANDÈ / BOUTIK</span>
              </div>
              <p className="font-bold text-slate-900">{order.items[0]?.sellerName || 'Vandè Mache Yogann'}</p>
              <p className="text-slate-600 font-mono">{order.items[0]?.sellerPhone || '+509 47 70 38 14'}</p>
              <p className="text-slate-600">{order.items[0]?.sellerLocation || 'Leyogàn'}</p>
            </div>

            {/* Transporteur / Livrè */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>LIVRÈ OFISYÈL</span>
              </div>
              <p className="font-bold text-slate-900">
                {order.assignedAgentName ? order.assignedAgentName : 'Livrè an kou d\'asiman'}
              </p>
              <p className="text-slate-600 font-mono">{order.assignedAgentPhone || 'Sèvis Livrezon Santral'}</p>
              <p className="text-emerald-700 font-semibold">
                Kòd Sekirite Achtè: <span className="font-mono bg-emerald-100 px-1 py-0.5 rounded">{order.deliveryCode}</span>
              </p>
            </div>
          </div>

          {/* Table of Items */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Atik / Pwodwi</th>
                  <th className="py-2.5 px-3 text-center">Kantite</th>
                  <th className="py-2.5 px-3 text-right">Pri Inite</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-900">{item.productTitle}</p>
                      <p className="text-[10px] text-slate-500">Vandè: {item.sellerName}</p>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-medium">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{item.price.toLocaleString()} HTG</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {(item.price * item.quantity).toLocaleString()} HTG
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-medium">
                <tr>
                  <td colSpan={3} className="py-2 px-3 text-right text-slate-600">Sou-total machandiz:</td>
                  <td className="py-2 px-3 text-right font-mono">{order.subtotal.toLocaleString()} HTG</td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 px-3 text-right text-slate-600">Frè Livrezon:</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {order.deliveryFee === 0 ? 'GRATIS' : `${order.deliveryFee.toLocaleString()} HTG`}
                  </td>
                </tr>
                <tr className="border-t-2 border-slate-900 text-sm font-bold text-slate-950">
                  <td colSpan={3} className="py-2.5 px-3 text-right">MONTAN TOTAL PEYE:</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                    {order.total.toLocaleString()} HTG
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment & Security Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-950">
                  Peman: {order.paymentMethod.toUpperCase()} (Ref: {order.paymentRef})
                </p>
                <p className="text-emerald-800 text-[11px]">
                  Estati: {order.paymentStatus === 'PAYMENT_CONFIRMED' ? 'PEMAN KONFIME PA PWOPRIYETÈ A (ESCROW)' : 'AP TANN VERIFIKASYON'}
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-emerald-900 bg-white border border-emerald-200 px-2 py-1 rounded">
              Ref Sekirite: {verificationRef}
            </div>
          </div>

          {/* Signatures Dual Proof Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* 1. Remise Colis (Vandè -> Livrè) */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                  <span className="font-bold text-xs text-slate-900">1. REMIZ COLIS LA (Vandè → Livrè)</span>
                  {order.sellerSignature && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Siyen
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  Vandè a ateste li remèt pake sa a nan bon eta bay livrè ofisyèl Mache Yogann nan.
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-dashed border-slate-300 min-h-[90px] flex items-center justify-center">
                {order.sellerSignature?.signatureDataUri ? (
                  <div className="text-center">
                    <img
                      src={order.sellerSignature.signatureDataUri}
                      alt="Siyati Vandè"
                      className="max-h-16 mx-auto object-contain"
                    />
                    <p className="text-[10px] font-semibold text-slate-800 mt-1">
                      {order.sellerSignature.signerName} • {new Date(order.sellerSignature.signedAt).toLocaleTimeString('fr-HT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 text-xs italic">
                    [Siyati Vandè a sou aplikasyon an nan moman pickup la]
                  </div>
                )}
              </div>
            </div>

            {/* 2. Réception Colis (Livrè -> Kliyan) */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                  <span className="font-bold text-xs text-slate-900">2. RESEPSYON COLIS LA (Livrè → Achtè)</span>
                  {order.customerSignature && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Siyen
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  Kliyan an ateste li resevwa pake sa a an bon eta epi li bay kòd sekirite l bay livrè a.
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-dashed border-slate-300 min-h-[90px] flex items-center justify-center">
                {order.customerSignature?.signatureDataUri ? (
                  <div className="text-center">
                    <img
                      src={order.customerSignature.signatureDataUri}
                      alt="Siyati Kliyan"
                      className="max-h-16 mx-auto object-contain"
                    />
                    <p className="text-[10px] font-semibold text-slate-800 mt-1">
                      {order.customerSignature.signerName} • {new Date(order.customerSignature.signedAt).toLocaleTimeString('fr-HT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 text-xs italic">
                    [Siyati Kliyan an sou ekran an lè livrè a rive]
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 text-center space-y-0.5">
            <p className="font-semibold text-slate-700">Mache Yogann • Platfòm E-Commerce Ofisyèl Leyogàn & Tout Ayiti</p>
            <p>Dokiman sa a gen valè prèv legal livrezon ak akseptasyon machandiz konfòm ak kondisyon jeneral Mache Yogann.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
