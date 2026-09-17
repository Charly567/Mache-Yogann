import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Package,
  Navigation,
  ArrowRight,
  Clock,
  FileText,
  RefreshCw,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';

export const AgentDashboard: React.FC = () => {
  const {
    language,
    currentUser,
    orders,
    courierPickupBackend,
    courierOutForDeliveryBackend,
    courierCompleteDeliveryBackend,
    viewBonDeLivraison,
    refreshOrders,
    reportProblemBackend,
  } = useApp();

  const [deliveryCodeInput, setDeliveryCodeInput] = useState<{ [orderId: string]: string }>({});
  const [proofNoteInput, setProofNoteInput] = useState<{ [orderId: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Filter orders for courier: show orders assigned to this agent, or ready for courier in the fleet
  const agentOrders = orders.filter(
    (o) =>
      o.assignedAgentId === currentUser?.id ||
      currentUser?.role === 'agent' ||
      o.status === 'READY_FOR_PICKUP' ||
      o.status === 'COURIER_ASSIGNED' ||
      o.status === 'PICKUP_PENDING' ||
      o.status === 'PICKED_UP_FROM_SELLER' ||
      o.status === 'IN_TRANSIT' ||
      o.status === 'OUT_FOR_DELIVERY' ||
      o.status === 'DELIVERED_PENDING_CUSTOMER_CONFIRMATION' ||
      o.status === 'agent_assigned' ||
      o.status === 'product_picked_up' ||
      o.status === 'out_for_delivery'
  );

  const activeDeliveries = agentOrders.filter(
    (o) =>
      o.status !== 'completed' &&
      o.status !== 'cancelled' &&
      o.status !== 'DELIVERED' &&
      o.status !== 'delivered'
  );
  const completedDeliveries = agentOrders.filter(
    (o) => o.status === 'completed' || o.status === 'DELIVERED' || o.status === 'delivered'
  );

  const handlePickup = async (order: Order) => {
    setIsProcessing(order.id);
    const note = proofNoteInput[order.id] || 'Pake rekipere nan men vandè a.';
    await courierPickupBackend(order.id, note);
    setIsProcessing(null);
  };

  const handleOutForDelivery = async (order: Order) => {
    setIsProcessing(order.id);
    const note = proofNoteInput[order.id] || 'Livrè a sou motosiklèt an wout pou adrès la.';
    await courierOutForDeliveryBackend(order.id, note);
    setIsProcessing(null);
  };

  const handleCompleteDelivery = async (order: Order) => {
    const entered = (deliveryCodeInput[order.id] || '').trim();
    if (!entered) {
      alert(
        language === 'ht'
          ? 'Tanpri mande achtè a kòd sekirite 4 chif li te resevwa a.'
          : 'Veuillez saisir le code de sécurité à 4 chiffres du client.'
      );
      return;
    }

    setIsProcessing(order.id);
    const note = proofNoteInput[order.id] || 'Kòmand remèt kliyan an an pèson.';
    const res = await courierCompleteDeliveryBackend(order.id, entered, note);
    setIsProcessing(null);
    if (!res.success) {
      alert(res.error || 'Erè pandan validasyon kòd la');
    }
  };

  const handleReportProblem = async (order: Order) => {
    const reason = prompt(
      language === 'ht'
        ? 'Ki pwoblèm ou rankontre ak livrezon sa a? (Adrès pa bon, kliyan pa reponn, elatriye)'
        : 'Indiquez le problème rencontré avec cette livraison :'
    );
    if (!reason || !reason.trim()) return;

    setIsProcessing(order.id);
    await reportProblemBackend(order.id, reason.trim());
    setIsProcessing(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Agent Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-xs font-semibold text-blue-300 border border-blue-400/30">
            <Truck size={14} />
            <span>{language === 'ht' ? 'Espas Ajan Livrezon Motosiklèt' : 'Espace Agent de Livraison'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit']">
            {currentUser?.name || 'Ajan Livrezon Mache Yogann'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 flex items-center gap-1.5">
            <span>Sektè: Leyogàn, Gresye, Gran Gwav</span>
            <span>·</span>
            <span>Telefòn: {currentUser?.phone || '+509 47703814'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshOrders()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Rafrechi</span>
          </button>
          <div className="text-right bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur">
            <span className="text-[11px] text-blue-200 block">Livrezon an kour</span>
            <span className="text-xl font-black">{activeDeliveries.length}</span>
          </div>
          <div className="text-right bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur">
            <span className="text-[11px] text-blue-200 block">Livrezon reyisi</span>
            <span className="text-xl font-black">{completedDeliveries.length}</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center justify-between">
          <span>
            {language === 'ht' ? 'Kòmand Ki Asiyen Ba Ou Yo' : 'Courses et Livraisons Assignées'} ({agentOrders.length})
          </span>
          <span className="text-xs font-normal text-slate-500">Mache Yogann Express</span>
        </h2>

        {agentOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 border border-slate-200 space-y-2">
            <Package size={36} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">
              {language === 'ht' ? 'Pa gen kòmand asiyen kounye a.' : 'Aucune course en attente.'}
            </p>
            <p className="text-xs text-slate-400">
              Lè yon kòmand pare pou livrezon nan zòn Leyogàn, li pral parèt isit la otomatikman.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {agentOrders.map((order) => {
              const currentCode = deliveryCodeInput[order.id] || '';
              const firstItem = order.items[0];

              const isPickupPending =
                order.status === 'READY_FOR_PICKUP' ||
                order.status === 'COURIER_ASSIGNED' ||
                order.status === 'PICKUP_PENDING' ||
                order.status === 'pickup_pending' ||
                order.status === 'agent_assigned';

              const isPickedUp =
                order.status === 'PICKED_UP_FROM_SELLER' ||
                order.status === 'product_picked_up' ||
                order.status === 'IN_TRANSIT';

              const isOutForDelivery =
                order.status === 'OUT_FOR_DELIVERY' ||
                order.status === 'out_for_delivery' ||
                order.status === 'DELIVERED_PENDING_CUSTOMER_CONFIRMATION';

              const isDelivered =
                order.status === 'DELIVERED' ||
                order.status === 'delivered' ||
                order.status === 'completed';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kòmand</span>
                        <h3 className="text-lg font-black font-mono text-slate-900">{order.id}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 uppercase">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kominote: Leyogàn ({order.buyerZone}) · Peman: {order.paymentMethod.toUpperCase()} (Verifye)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewBonDeLivraison(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        <FileText size={12} />
                        <span>Bon de Livraison</span>
                      </button>

                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl">
                        {order.total.toLocaleString()} HTG
                      </span>
                    </div>
                  </div>

                  {/* Signatures Status Bar */}
                  <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700">Verifikasyon Siyati:</span>
                    {order.sellerSignature ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>Vandè a Siyen Remiz ({new Date(order.sellerSignature.signedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Vandè poko siyen remiz la
                      </span>
                    )}

                    {order.customerSignature ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>Achtè a Siyen Resepsyon ({new Date(order.customerSignature.signedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                        Achtè ap siyen lè w remèt li l
                      </span>
                    )}
                  </div>

                  {/* Two Step Logistics Columns: Vendor Pickup vs Buyer Delivery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Step A: Vendor Pickup Point */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <MapPin size={14} className="text-amber-700" />
                          <span>1. KOTE POU W PRAN L (VANDÈ)</span>
                        </span>
                        <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                          {firstItem?.sellerLocation || 'Leyogàn'}
                        </span>
                      </div>
                      <p className="text-slate-800 font-bold text-sm">
                        {firstItem?.sellerName || 'Vandè'}
                      </p>
                      <p className="text-slate-600">
                        Atik pou w pran: <strong>{firstItem?.productTitle}</strong> (×{firstItem?.quantity})
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={`tel:${firstItem?.sellerPhone}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                        >
                          <Phone size={12} />
                          <span>Rele Vandè ({firstItem?.sellerPhone})</span>
                        </a>
                        {firstItem?.sellerPhone && (
                          <a
                            href={`https://wa.me/${firstItem.sellerPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                          >
                            <MessageSquare size={12} />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Step B: Buyer Delivery Point */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <Navigation size={14} className="text-emerald-700" />
                          <span>2. KOTE POU W LIVRE L (KLIYAN)</span>
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                          {order.buyerZone}, {order.buyerCommune.split('(')[0]}
                        </span>
                      </div>
                      <p className="text-slate-800 font-bold text-sm">
                        {order.buyerName}
                      </p>
                      <p className="text-slate-600">
                        Adrès: <strong>{order.buyerAddress}</strong>
                      </p>
                      {order.buyerNotes && (
                        <p className="text-slate-500 italic text-[11px]">"{order.buyerNotes}"</p>
                      )}
                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={`tel:${order.buyerPhone}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                        >
                          <Phone size={12} />
                          <span>Rele Kliyan ({order.buyerPhone})</span>
                        </a>
                        <a
                          href={`https://wa.me/${order.buyerPhone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                        >
                          <MessageSquare size={12} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Note Input */}
                  {!isDelivered && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        Nòt Ajan / Livrè (si gen detay patikilye pou rapò a):
                      </label>
                      <input
                        type="text"
                        value={proofNoteInput[order.id] || ''}
                        onChange={(e) =>
                          setProofNoteInput({ ...proofNoteInput, [order.id]: e.target.value })
                        }
                        placeholder="Egz: Mwen devan lakou a, kliyan an sòti pran l..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  {/* Agent Action Transitions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {isPickupPending && (
                        <button
                          disabled={isProcessing === order.id}
                          onClick={() => handlePickup(order)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        >
                          <Package size={14} />
                          <span>{isProcessing === order.id ? 'Ap trete...' : 'Mwen pran pake a nan men vandè a'}</span>
                        </button>
                      )}

                      {isPickedUp && (
                        <button
                          disabled={isProcessing === order.id}
                          onClick={() => handleOutForDelivery(order)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        >
                          <Truck size={14} />
                          <span>{isProcessing === order.id ? 'Ap trete...' : 'Mwen sou wout pou m ale livre kliyan an'}</span>
                        </button>
                      )}

                      {isOutForDelivery && (
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={currentCode}
                            onChange={(e) =>
                              setDeliveryCodeInput({ ...deliveryCodeInput, [order.id]: e.target.value })
                            }
                            placeholder="Kòd 4 chif achtè a"
                            className="w-40 px-3 py-2 border border-slate-300 rounded-xl font-mono text-center text-sm font-black focus:outline-none focus:border-emerald-600 shadow-2xs"
                          />
                          <button
                            disabled={isProcessing === order.id}
                            onClick={() => handleCompleteDelivery(order)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                          >
                            <ShieldCheck size={14} />
                            <span>{isProcessing === order.id ? 'Validasyon...' : 'Valide Livrezon & Remèt'}</span>
                          </button>
                        </div>
                      )}

                      {isDelivered && (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 font-bold rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 size={15} className="text-emerald-700" />
                          <span>Kòmand sa a livre epi kloure avèk siksè</span>
                        </span>
                      )}

                      {/* Report Problem Button */}
                      {!isDelivered && (
                        <button
                          type="button"
                          onClick={() => handleReportProblem(order)}
                          className="px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                          title="Siyale yon pwoblèm ak livrezon sa a"
                        >
                          <AlertCircle size={13} />
                          <span>Siyale Pwoblèm</span>
                        </button>
                      )}
                    </div>

                    <span className="text-slate-400 text-[11px]">
                      {isDelivered
                        ? 'Tout pati yo siyen epi dokiman an disponib.'
                        : 'Mete ajou estati a lè w fin egzekite chak etap.'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
