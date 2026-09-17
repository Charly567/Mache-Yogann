import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  ArrowRight,
  FileText,
  PenTool,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, Order, OrderEvent } from '../types';
import { SignaturePad } from './SignaturePad';

export const OrderTrackingView: React.FC = () => {
  const {
    language,
    orders,
    currentUser,
    setIsDisputeModalOpen,
    setDisputeOrderId,
    trackingOrderId,
    viewBonDeLivraison,
    customerConfirmReceiptBackend,
    reportProblemBackend,
    refreshOrders,
  } = useApp();

  const [searchKey, setSearchKey] = useState<string>('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (trackingOrderId) {
      const match = orders.find((o) => o.id === trackingOrderId);
      if (match) return match;
    }
    if (currentUser) {
      const userOrder = orders.find((o) => o.buyerId === currentUser.id || o.buyerPhone === currentUser.phone);
      if (userOrder) return userOrder;
    }
    return orders[0] || null;
  });

  const [isSigning, setIsSigning] = useState(false);
  const [isSubmittingSignature, setIsSubmittingSignature] = useState(false);
  const [orderEvents, setOrderEvents] = useState<OrderEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Sync activeOrder if trackingOrderId changes or orders list updates
  useEffect(() => {
    if (trackingOrderId) {
      const match = orders.find((o) => o.id === trackingOrderId);
      if (match) {
        setActiveOrder(match);
        return;
      }
    }
    if (activeOrder) {
      const updated = orders.find((o) => o.id === activeOrder.id);
      if (updated) {
        setActiveOrder(updated);
      }
    }
  }, [trackingOrderId, orders]);

  // Fetch audit trail events for the active order
  useEffect(() => {
    if (!activeOrder) {
      setOrderEvents([]);
      return;
    }
    setLoadingEvents(true);
    fetch(`/api/orders/${encodeURIComponent(activeOrder.id)}/events`)
      .then((res) => (res.ok ? res.json() : { events: [] }))
      .then((data) => {
        if (data.events) {
          setOrderEvents(data.events);
        }
      })
      .catch((err) => console.error('Failed to fetch events', err))
      .finally(() => setLoadingEvents(false));
  }, [activeOrder?.id, activeOrder?.status]);

  const stages: { key: string; labelHt: string; labelFr: string; descHt: string; descFr: string }[] = [
    {
      key: 'created',
      labelHt: 'Kòmand Kreye',
      labelFr: 'Commande créée',
      descHt: 'Kòmand anrejistre sou sèvè Mache Yogann',
      descFr: 'La commande a été enregistrée',
    },
    {
      key: 'payment_confirmed',
      labelHt: 'Peman Konfime',
      labelFr: 'Paiement confirmé',
      descHt: 'Peman verifye pa Mache Yogann',
      descFr: 'Paiement vérifié avec succès',
    },
    {
      key: 'ready_for_pickup',
      labelHt: 'Pake Pare pou Livrezon',
      labelFr: 'Prêt pour ramassage',
      descHt: 'Vandè a fin anbalaje kòmand lan',
      descFr: 'Le colis est préparé par le vendeur',
    },
    {
      key: 'courier_assigned',
      labelHt: 'Livrè Asiyen',
      labelFr: 'Livreur assigné',
      descHt: 'Yon livrè motosiklèt deziyen',
      descFr: 'Un coursier a pris en charge la course',
    },
    {
      key: 'picked_up_from_seller',
      labelHt: 'Pwodwi Rekipere',
      labelFr: 'Récupéré chez le vendeur',
      descHt: 'Livrè a gen pake a nan men l',
      descFr: 'Colis récupéré et contresigné',
    },
    {
      key: 'out_for_delivery',
      labelHt: 'An wout pou Livrezon',
      labelFr: 'En cours de livraison',
      descHt: 'Livrè a ap deplase nan zòn ou an',
      descFr: 'En route vers votre adresse',
    },
    {
      key: 'delivered',
      labelHt: 'Kòmand Livre & Fini',
      labelFr: 'Commande livrée',
      descHt: 'Pake remèt ak siyati konfimasyon',
      descFr: 'Colis remis et contresigné',
    },
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'ORDER_CREATED':
      case 'created':
      case 'PAYMENT_PENDING':
      case 'payment_pending':
      case 'PAYMENT_VERIFICATION':
        return 0;

      case 'PAYMENT_CONFIRMED':
      case 'payment_confirmed':
      case 'PREPARING_ORDER':
        return 1;

      case 'READY_FOR_PICKUP':
      case 'pickup_pending':
        return 2;

      case 'COURIER_ASSIGNED':
      case 'agent_assigned':
      case 'PICKUP_PENDING':
        return 3;

      case 'PICKED_UP_FROM_SELLER':
      case 'product_picked_up':
      case 'IN_TRANSIT':
        return 4;

      case 'OUT_FOR_DELIVERY':
      case 'out_for_delivery':
      case 'DELIVERED_PENDING_CUSTOMER_CONFIRMATION':
        return 5;

      case 'DELIVERED':
      case 'delivered':
      case 'completed':
        return 6;

      default:
        return 1;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchKey.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.buyerPhone.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) ||
        o.paymentRef.toLowerCase().includes(query)
    );

    if (found) {
      setActiveOrder(found);
    } else {
      alert(
        language === 'ht'
          ? 'Nou pa jwenn okenn kòmand ak nimewo sa a.'
          : 'Aucune commande trouvée avec cette référence.'
      );
    }
  };

  const handleCustomerSign = async (signatureDataUri: string) => {
    if (!activeOrder) return;
    setIsSubmittingSignature(true);
    try {
      const res = await customerConfirmReceiptBackend(activeOrder.id, signatureDataUri);
      if (res.success && res.order) {
        setActiveOrder(res.order);
        setIsSigning(false);
      }
    } finally {
      setIsSubmittingSignature(false);
    }
  };

  const currentStageIndex = activeOrder ? getStageIndex(activeOrder.status) : 0;
  const isDeliveredOrReadyForConfirmation =
    activeOrder &&
    (activeOrder.status === 'DELIVERED_PENDING_CUSTOMER_CONFIRMATION' ||
      activeOrder.status === 'OUT_FOR_DELIVERY' ||
      activeOrder.status === 'out_for_delivery' ||
      activeOrder.status === 'delivered');

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Search bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Package className="text-red-600" size={24} />
              <span>{language === 'ht' ? 'Swiv Kòmand Ou An Direk' : 'Suivi de Commande en Temps Réel'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'ht'
                ? 'Sistèm ofisyèl Mache Yogann: tout etap soti nan depo vandè rive devan pòt ou an sekirite.'
                : 'Suivez le statut de votre commande depuis le vendeur jusqu’à votre porte.'}
            </p>
          </div>

          <button
            onClick={() => refreshOrders()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            title="Rafrechi enfòmasyon yo"
          >
            <RefreshCw size={13} />
            <span>{language === 'ht' ? 'Rafrechi' : 'Actualiser'}</span>
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Ex: #MY-2026-0001 oswa 37123456"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-red-500 focus:outline-none font-mono"
            />
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {language === 'ht' ? 'Chèche' : 'Rechercher'}
          </button>
        </form>

        {/* Quick select list of user's orders */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap">
              {language === 'ht' ? 'Dènye kòmand:' : 'Dernières commandes:'}
            </span>
            {orders.slice(0, 5).map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrder(o)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeOrder?.id === o.id
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {o.id} ({o.total.toLocaleString()} HTG)
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Order Details */}
      {activeOrder ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
          {/* Header Summary & BDL button */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'ht' ? 'Detay Kòmand' : 'Détails de la commande'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] font-mono">
                  {activeOrder.id}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 uppercase">
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ht' ? 'Pase le:' : 'Date:'}{' '}
                {new Date(activeOrder.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <div>
                <span className="text-xs text-slate-400 block sm:text-right">
                  {language === 'ht' ? 'Total Peye:' : 'Total Payé:'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                  {activeOrder.total.toLocaleString()} <span className="text-xs font-bold text-red-600">HTG</span>
                </span>
              </div>

              {/* View Bon de Livraison Button */}
              <button
                onClick={() => viewBonDeLivraison(activeOrder)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <FileText size={13} />
                <span>{language === 'ht' ? 'Gade Bon de Livraison' : 'Bon de Livraison (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'ht' ? 'Evolisyon Livrezon Mache Yogann' : 'Progression de la livraison'}</span>
              <span className="text-xs font-normal text-slate-500 font-mono">
                Etap {currentStageIndex + 1} / {stages.length}
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {stages.map((st, idx) => {
                const isDone = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-red-50/80 border-red-500 shadow-xs ring-1 ring-red-500/20'
                        : isDone
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCurrent
                            ? 'bg-red-600 text-white'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {isDone && !isCurrent ? '✓' : idx + 1}
                      </span>
                      {isCurrent && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-[11px] font-bold leading-tight ${
                        isCurrent ? 'text-red-950' : isDone ? 'text-emerald-950' : 'text-slate-600'
                      }`}
                    >
                      {language === 'ht' ? st.labelHt : st.labelFr}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Details & Courier Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Delivery Destination Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin size={15} className="text-red-600" />
                  <span>{language === 'ht' ? 'Destinasyon Livrezon' : 'Adresse de Livraison'}</span>
                </span>
                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  {activeOrder.buyerZone}, {activeOrder.buyerCommune.split('(')[0]}
                </span>
              </div>
              <p className="text-slate-700">
                <strong>{activeOrder.buyerName}</strong> · {activeOrder.buyerPhone}
              </p>
              <p className="text-slate-600">{activeOrder.buyerAddress}</p>
              {activeOrder.buyerNotes && (
                <p className="text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200">
                  "{activeOrder.buyerNotes}"
                </p>
              )}
            </div>

            {/* Assigned Courier Card */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Truck size={15} className="text-blue-700" />
                  <span>{language === 'ht' ? 'Livrè Motosiklèt Mache Yogann' : 'Coursier Dédié'}</span>
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {activeOrder.assignedAgentName ? 'Asiyen' : 'Nan seleksyon'}
                </span>
              </div>

              {activeOrder.assignedAgentName ? (
                <div className="space-y-1 text-slate-700">
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <UserCheck size={14} className="text-emerald-600" />
                    <span>{activeOrder.assignedAgentName}</span>
                  </p>
                  <p className="flex items-center gap-1 text-slate-600">
                    <Phone size={13} className="text-slate-400" />
                    <span>Telefòn: <strong>{activeOrder.assignedAgentPhone}</strong></span>
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <a
                      href={`tel:${activeOrder.assignedAgentPhone}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                    >
                      <Phone size={11} />
                      <span>Rele Livrè a</span>
                    </a>
                    {activeOrder.assignedAgentPhone && (
                      <a
                        href={`https://wa.me/${activeOrder.assignedAgentPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                      >
                        <MessageSquare size={11} />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-slate-600 leading-relaxed">
                  {language === 'ht'
                    ? 'Ekip Mache Yogann ap chwazi yon livrè motosiklèt nan zòn Leyogàn pou pran machandiz la.'
                    : 'Un coursier disponible à Léogâne sera désigné dès validation administrative du paiement.'}
                </p>
              )}
            </div>
          </div>

          {/* Delivery Verification Code Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 uppercase tracking-wider">
                <ShieldCheck size={16} className="text-amber-700" />
                <span>{language === 'ht' ? 'Kòd Sekirite Resepsyon' : 'Code de Réception Sécurisé'}</span>
              </div>
              <p className="text-xs text-amber-800 max-w-md">
                {language === 'ht'
                  ? 'Pa bay livrè a kòd sa a toutotan ou pa kenbe machandiz la nan men ou epi verifye li bon.'
                  : 'Ne communiquez ce code au coursier qu\'une fois votre colis vérifié en main propre.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-2xl text-amber-950 px-4 py-1.5 bg-white rounded-xl border border-amber-300 shadow-xs">
                {activeOrder.deliveryCode}
              </span>
            </div>
          </div>

          {/* Customer Signature Confirmation Panel */}
          {activeOrder.customerSignature ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">
                    {language === 'ht' ? 'Kòmand Konfime pa Achtè a' : 'Réception confirmée par le client'}
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Siyati anrejistre le {new Date(activeOrder.customerSignature.signedAt).toLocaleString('fr-FR')} pa {activeOrder.customerSignature.signerName}.
                  </p>
                </div>
              </div>
              <img
                src={activeOrder.customerSignature.signatureDataUri}
                alt="Siyati Achtè"
                className="h-10 bg-white border border-emerald-200 rounded-lg px-2 py-0.5 shadow-2xs"
              />
            </div>
          ) : isDeliveredOrReadyForConfirmation ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-amber-50 border border-red-200 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-red-950 uppercase tracking-wider">
                  <PenTool size={16} className="text-red-600" />
                  <span>{language === 'ht' ? 'Konfime Resepsyon Kòmand Ou An' : 'Confirmer la réception de votre commande'}</span>
                </div>
                <p className="text-xs text-slate-600 max-w-md">
                  {language === 'ht'
                    ? 'Èske w resevwa kòmand lan nan bon kondisyon? Mete siyati dijital ou pou w kloure livrezon an ofisyèlman.'
                    : 'Avez-vous bien reçu vos articles ? Signez électroniquement pour finaliser la transaction.'}
                </p>
              </div>

              <button
                onClick={() => setIsSigning(true)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PenTool size={15} />
                <span>{language === 'ht' ? 'Siyen Resepsyon an Kounye a' : 'Signer la réception'}</span>
              </button>
            </div>
          ) : null}

          {/* Ordered Items Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {language === 'ht' ? 'Atik ki nan kòmand lan' : 'Articles commandés'}
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{item.productTitle}</p>
                      <p className="text-slate-500 text-[11px]">
                        Vandè: {item.sellerName} · {item.sellerLocation}
                      </p>
                      <p className="text-slate-600 font-medium">
                        {item.quantity} × {item.price.toLocaleString()} HTG
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-slate-900 text-sm">
                    {(item.price * item.quantity).toLocaleString()} HTG
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Order Audit Events Timeline */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} className="text-slate-500" />
              <span>{language === 'ht' ? 'Istorik & Jounal Evènman (Audit Trail)' : 'Historique des Événements'}</span>
            </h4>

            {loadingEvents ? (
              <p className="text-xs text-slate-400">Chaje evènman kòmand lan...</p>
            ) : orderEvents.length === 0 ? (
              <p className="text-xs text-slate-400">Poko gen evènman anrejistre pou kòmand sa a.</p>
            ) : (
              <div className="space-y-2">
                {orderEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800">{evt.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(evt.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{evt.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Aksyon fèt pa: <strong>{evt.actorName}</strong> ({evt.actorRole})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dispute Action */}
          <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
            <span>
              {language === 'ht' ? 'Yon pwoblèm ak kòmand sa a?' : 'Un problème avec cette commande ?'}
            </span>
            <button
              onClick={() => {
                setDisputeOrderId(activeOrder.id);
                setIsDisputeModalOpen(true);
              }}
              className="text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
            >
              {language === 'ht' ? 'Siyale yon litij oswa ranbousman' : 'Ouvrir un litige / réclamation'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Package size={40} className="mx-auto text-slate-300" />
          <p className="font-bold text-slate-800 text-sm">
            {language === 'ht' ? 'Pa gen kòmand chwazi' : 'Aucune commande sélectionnée'}
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'ht'
              ? 'Chèche yon kòmand ak ba rechèch anwo a oswa pase yon premye kòmand nan boutik la.'
              : 'Recherchez une commande via la barre ci-dessus ou effectuez votre premier achat.'}
          </p>
        </div>
      )}

      {/* Signature Pad Modal for Customer Confirmation */}
      {isSigning && activeOrder && (
        <SignaturePad
          title={language === 'ht' ? 'Siyati Konfimasyon Resepsyon Achtè' : 'Signature de Réception Client'}
          signerName={activeOrder.buyerName}
          signerRole="buyer"
          onSave={handleCustomerSign}
          onCancel={() => setIsSigning(false)}
        />
      )}
    </div>
  );
};

