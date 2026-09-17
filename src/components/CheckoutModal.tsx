import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Truck,
  Phone,
  Mail,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info,
  Download,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, OrderItem } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    language,
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    currentUser,
    createOrder,
    setActiveTab,
    showNotification,
  } = useApp();

  // Etap 1: Chwazi Platfòm Peman & Resevwa Nimewo
  // Etap 2: Konfime Kòmand, Enfòmasyon Achtè & Montan Tout Sa li Achte
  // Etap 3: Kòmand Konfime & Notifikasyon Gmail/WhatsApp/Vandè
  const [step, setStep] = useState<'payment_select' | 'confirm_details' | 'confirmed'>('payment_select');

  // Payment Platform Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('moncash');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedCrypto, setCopiedCrypto] = useState(false);

  // Buyer Information
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || '');
  const [paymentPhone, setPaymentPhone] = useState(currentUser?.phone || '');
  const [paymentRef, setPaymentRef] = useState('');
  const [buyerZone, setBuyerZone] = useState(currentUser?.zone || 'Bergeau');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');

  // Confirmation Results
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);
  const [createdDeliveryCode, setCreatedDeliveryCode] = useState<string | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  if (!isCheckoutOpen) return null;

  // Digital products check: if all items are PDF ebooks or digital services, no physical courier delivery fee
  const isAllDigital =
    cart.length > 0 &&
    cart.every(
      (item) =>
        item.product.category === 'LivPDF' ||
        item.product.bookFormat === 'pdf' ||
        (item.product as any).isDigital ||
        item.product.id?.startsWith('dig_svc_') ||
        item.product.category === 'gaming' ||
        item.product.category === 'telecom' ||
        item.product.category === 'streaming' ||
        item.product.category === 'giftcard' ||
        item.product.category === 'vpn'
    );
  const hasDigitalItem =
    cart.some(
      (item) =>
        item.product.category === 'LivPDF' ||
        item.product.bookFormat === 'pdf' ||
        (item.product as any).isDigital ||
        item.product.id?.startsWith('dig_svc_') ||
        item.product.category === 'gaming' ||
        item.product.category === 'telecom' ||
        item.product.category === 'streaming' ||
        item.product.category === 'giftcard' ||
        item.product.category === 'vpn'
    );

  // Delivery fee calculation (150 HTG for Léogâne or free if marked freeShipping or digital)
  const isAllFreeShipping = cart.every((item) => item.product.freeShipping);
  const deliveryFee = isAllDigital || isAllFreeShipping || cartTotal > 15000 ? 0 : 150;
  const grandTotal = cartTotal + deliveryFee;

  // Conversion for USDT: ~132 HTG per USDT
  const usdtEquivalent = (grandTotal / 132).toFixed(2);

  // Copy helper
  const handleCopy = (text: string, type: 'phone' | 'crypto') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedCrypto(true);
      setTimeout(() => setCopiedCrypto(false), 2000);
    }
  };

  const handleGoToConfirmation = () => {
    setStep('confirm_details');
  };

  const triggerErrorShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  const handleFinalizeOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!buyerName.trim() || !buyerPhone.trim()) {
      triggerErrorShake();
      showNotification(language === 'ht' ? 'Tanpri mete non ou ak telefòn ou.' : 'Veuillez entrer votre nom et téléphone.', 'error');
      return;
    }

    if (!paymentRef.trim()) {
      triggerErrorShake();
      showNotification(
        language === 'ht'
          ? 'Tanpri mete kòd tranzaksyon oswa referans peman an.'
          : 'Veuillez entrer le code de référence de paiement.',
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
        sellerPhone: item.product.sellerPhone,
        sellerLocation: item.product.sellerLocation,
      }));

      const newOrder = createOrder({
        buyerId: currentUser?.id || `buyer_${Date.now()}`,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
        buyerDepartment: 'Lwès (Ouest)',
        buyerCommune: 'Leyogàn (Léogâne)',
        buyerZone: buyerZone.trim() || 'Sant Vil Leyogàn',
        buyerAddress: buyerAddress.trim() || 'Kafou prensipal',
        buyerNotes: buyerNotes.trim(),
        items: orderItems,
        subtotal: cartTotal,
        deliveryFee,
        total: grandTotal,
        status: 'payment_pending',
        paymentMethod,
        paymentRef: paymentRef.trim(),
        paymentPhone: paymentPhone.trim() || buyerPhone.trim(),
        cryptoNetwork: paymentMethod === 'crypto' ? 'USDT (TRC-20)' : undefined,
        cryptoTxHash: paymentMethod === 'crypto' ? paymentRef.trim() : undefined,
        paymentStatus: 'pending',
        commissionRate: 0.10,
      });

      setCreatedOrderNumber(newOrder.id);
      setCreatedDeliveryCode(newOrder.deliveryCode);
      setLastCreatedOrder(newOrder);
      setIsSubmitting(false);
      setStep('confirmed');
    }, 600);
  };

  // WhatsApp message prefill
  const waText = encodeURIComponent(
    `Bonjou Mache Yogann 🇭🇹, mwen fèk pase kòmand ${createdOrderNumber || ''} sou sit la.\n\n` +
      `Non: ${buyerName}\n` +
      `Telefòn: ${buyerPhone}\n` +
      `Platfòm Peman: ${paymentMethod.toUpperCase()}\n` +
      `Kòd Tranzaksyon / Referans: ${paymentRef}\n` +
      `Total Peye: ${grandTotal.toLocaleString()} HTG\n` +
      `Zòn Livrezon: ${buyerZone}, Leyogàn\n\n` +
      `Tanpri verifye peman mwen an pou ajan an ka kòmanse livrezon an. Mèsi!`
  );

  const waLink = `https://wa.me/50947703814?text=${waText}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              MY
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit']">
                {step === 'payment_select' && (language === 'ht' ? 'Etap 1: Chwazi Platfòm Peman' : 'Étape 1 : Choisir le Mode de Paiement')}
                {step === 'confirm_details' && (language === 'ht' ? 'Etap 2: Detay Kòmand & Tout Pri an' : 'Étape 2 : Détails et Récapitulatif')}
                {step === 'confirmed' && (language === 'ht' ? '🎉 Kòmand Konfime avèk Siksè!' : '🎉 Commande Confirmée !')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Mache Yogann · Leyogàn 🇭🇹</p>
            </div>
          </div>

          {step !== 'confirmed' && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Step Progress Indicators */}
        <div className="px-5 pt-3 pb-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 'payment_select' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {step !== 'payment_select' ? '✓' : '1'}
            </span>
            <span className={`font-semibold ${step === 'payment_select' ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
              {language === 'ht' ? 'Peman' : 'Paiement'}
            </span>
          </div>

          <div className="flex-1 h-0.5 mx-3 bg-slate-200">
            <motion.div
              className="h-full bg-red-600"
              initial={{ width: '0%' }}
              animate={{
                width: step === 'payment_select' ? '0%' : step === 'confirm_details' ? '50%' : '100%'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 'confirm_details' ? 'bg-red-600 text-white' : step === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step === 'confirmed' ? '✓' : '2'}
            </span>
            <span className={`font-semibold ${step === 'confirm_details' ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
              {language === 'ht' ? 'Konfimasyon' : 'Confirmation'}
            </span>
          </div>

          <div className="flex-1 h-0.5 mx-3 bg-slate-200">
            <motion.div
              className="h-full bg-emerald-600"
              initial={{ width: '0%' }}
              animate={{
                width: step === 'confirmed' ? '100%' : '0%'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              3
            </span>
            <span className={`font-semibold ${step === 'confirmed' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
              {language === 'ht' ? 'Resi' : 'Reçu'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ETAP 1: Chwazi Platfòm Peman & Resevwa Nimewo */}
            {step === 'payment_select' && (
              <motion.div
                key="step-payment"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Total amount summary card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
                  <div>
                    <span className="text-xs text-slate-300 block">
                      {language === 'ht' ? 'Montan total pou w voye a:' : 'Montant total à envoyer :'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-amber-400">
                      {grandTotal.toLocaleString()} <span className="text-sm font-bold text-white">HTG</span>
                    </span>
                  </div>
                  <div className="text-right text-xs text-slate-300">
                    <p>{cart.length} {language === 'ht' ? 'atik nan panye' : 'articles au panier'}</p>
                    <p className="text-emerald-400 font-medium">
                      {deliveryFee === 0
                        ? (language === 'ht' ? 'Livrezon Gratis' : 'Livraison Gratuite')
                        : `+${deliveryFee} HTG Livrezon`}
                    </p>
                  </div>
                </div>

                {/* Instruction prompt */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                    {language === 'ht' ? 'Chwazi ki kote w ap voye kòb la:' : 'Choisissez la plateforme de paiement :'}
                  </h3>

                  {/* 3 Payment Platform Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* MonCash */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('moncash')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        paymentMethod === 'moncash'
                          ? 'border-red-600 bg-red-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-red-600 mx-auto mb-1" />
                      <span className="font-black text-xs sm:text-sm text-slate-900 block font-['Outfit']">
                        MonCash
                      </span>
                      <span className="text-[10px] text-red-600 font-bold">Digicel</span>
                    </button>

                    {/* NatCash */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('natcash')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        paymentMethod === 'natcash'
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-blue-600 mx-auto mb-1" />
                      <span className="font-black text-xs sm:text-sm text-slate-900 block font-['Outfit']">
                        NatCash
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold">Natcom</span>
                    </button>

                    {/* Kripto */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        paymentMethod === 'crypto'
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-emerald-600 mx-auto mb-1" />
                      <span className="font-black text-xs sm:text-sm text-slate-900 block font-['Outfit']">
                        Kripto
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">USDT (TRC-20)</span>
                    </button>
                  </div>
                </div>

                {/* Specific Platform Instructions & Official Phone Numbers */}
                <div className="p-4 rounded-2xl border bg-slate-50/80 space-y-4">
                  {/* MONCASH DETAILS */}
                  {paymentMethod === 'moncash' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                            Nimewo Ofisyèl MonCash Mache Yogann
                          </span>
                          <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                            +509 47703814
                          </span>
                          <p className="text-[11px] text-slate-500 font-medium">Non sou kont: <strong>Mache Yogann Ofisyèl</strong></p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('+509 47703814', 'phone')}
                          className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                        >
                          {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedPhone ? 'Kopye!' : 'Kopi Nimewo'}</span>
                        </button>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-red-200 text-xs text-slate-700 space-y-1.5">
                        <p className="font-bold text-slate-900">
                          {language === 'ht' ? 'Kijan pou w peye pa MonCash:' : 'Instructions MonCash :'}
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px]">
                          <li>Fè <strong>*202#</strong> sou telefòn ou oswa louvri <strong>MonCash App</strong></li>
                          <li>Chwazi <strong>"Voye Lajan / Transfè"</strong></li>
                          <li>Mete nimewo Mache Yogann nan: <strong className="text-red-600 font-mono">+509 47703814</strong></li>
                          <li>Mete montan egzak la: <strong className="text-slate-900">{grandTotal.toLocaleString()} HTG</strong></li>
                          <li>Konfime ak PIN sekrè ou epi <strong>kenbe kòd tranzaksyon an (Trans ID)</strong></li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* NATCASH DETAILS */}
                  {paymentMethod === 'natcash' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                            Nimewo Ofisyèl NatCash Mache Yogann
                          </span>
                          <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                            +509 35100438
                          </span>
                          <p className="text-[11px] text-slate-500 font-medium">Non sou kont: <strong>Mache Yogann Ofisyèl</strong></p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('+509 35100438', 'phone')}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                        >
                          {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedPhone ? 'Kopye!' : 'Kopi Nimewo'}</span>
                        </button>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-slate-700 space-y-1.5">
                        <p className="font-bold text-slate-900">
                          {language === 'ht' ? 'Kijan pou w peye pa NatCash:' : 'Instructions NatCash :'}
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px]">
                          <li>Fè <strong>*200#</strong> sou telefòn ou oswa louvri <strong>NatCash App</strong></li>
                          <li>Chwazi <strong>"Voye Lajan / Transfer"</strong></li>
                          <li>Mete nimewo Mache Yogann nan: <strong className="text-blue-600 font-mono">+509 35100438</strong></li>
                          <li>Mete montan egzak la: <strong className="text-slate-900">{grandTotal.toLocaleString()} HTG</strong></li>
                          <li>Konfime ak PIN sekrè ou epi <strong>kenbe kòd referans tranzaksyon an</strong></li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* CRYPTO DETAILS */}
                  {paymentMethod === 'crypto' && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                            Adrès Bous USDT (TRC-20) Mache Yogann
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            ≈ {usdtEquivalent} USDT
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value="TXm8ZkKqQ8wYh7pL9s4D2fGjKmP1nTvXz6"
                            className="w-full text-xs font-mono bg-white px-3 py-2 border rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopy('TXm8ZkKqQ8wYh7pL9s4D2fGjKmP1nTvXz6', 'crypto')}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 cursor-pointer transition-colors"
                          >
                            {copiedCrypto ? 'Kopye!' : 'Kopi'}
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500">
                        {language === 'ht'
                          ? 'Voye egzakteman montan an sou rezo TRON (TRC-20) pou frè yo ba, epi kenbe kòd Hash tranzaksyon an.'
                          : 'Envoyez sur le réseau TRON (TRC-20) et conservez le hash de transaction.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Next Step CTA */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={handleGoToConfirmation}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer transition-all"
                  >
                    <span>
                      {language === 'ht'
                        ? 'Mwen voye kòb la, Ale nan Konfimasyon'
                        : 'J\'ai envoyé les fonds, Continuer'}
                    </span>
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ETAP 2: Konfime Kòmand, Enfòmasyon Achtè & Montan Tout Sa li Achte */}
            {step === 'confirm_details' && (
              <motion.form
                key="step-confirm-details"
                initial={{ opacity: 0, x: 15 }}
                animate={shakeError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: shakeError ? 0.4 : 0.2 }}
                onSubmit={handleFinalizeOrder}
                className="space-y-4"
              >
                {/* Back button to change payment platform */}
                <button
                  type="button"
                  onClick={() => setStep('payment_select')}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer mb-1"
                >
                  <ArrowLeft size={14} />
                  <span>
                    {language === 'ht'
                      ? `Chanje platfòm peman (${paymentMethod.toUpperCase()})`
                      : `Changer moyen de paiement (${paymentMethod.toUpperCase()})`}
                  </span>
                </button>

                {/* "sa li achte ap tou monte ak tout pri an" - FULL ITEMS BREAKDOWN */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-red-600" />
                      <span>{language === 'ht' ? 'Atik Ou Achte Yo & Pri Yo' : 'Articles Commandés & Prix'}</span>
                    </h3>
                    <span className="text-xs font-bold text-red-600">
                      {cart.length} {language === 'ht' ? 'pwodwi' : 'articles'}
                    </span>
                  </div>

                  {/* List of items */}
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-slate-200/80 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{item.product.title}</p>
                            <p className="text-[11px] text-slate-500">
                              Vandè: <strong>{item.product.sellerName}</strong> ({item.product.sellerLocation})
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-black text-slate-900">
                            {(item.product.price * item.quantity).toLocaleString()} HTG
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {item.quantity} x {item.product.price.toLocaleString()} HTG
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Calculations */}
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Sous-total:</span>
                      <span className="font-semibold">{cartTotal.toLocaleString()} HTG</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Frè Livrezon Leyogàn:</span>
                      <span className="font-semibold">
                        {deliveryFee === 0 ? 'Gratis' : `${deliveryFee} HTG`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                      <span>Total Jeneral pou Peye:</span>
                      <span className="text-red-600 font-['Outfit'] text-base">
                        {grandTotal.toLocaleString()} HTG
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information Form */}
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ht' ? 'Non Konplè Ou *' : 'Nom Complet *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Ex: Marie Joseph"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ht' ? 'Telefòn / WhatsApp Ou *' : 'Téléphone (WhatsApp) *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="+509 3xxx xxxx"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Transaction verification info */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Sparkles size={14} className="text-amber-600" />
                      <span>
                        {language === 'ht'
                          ? `Prèv Peman sou ${paymentMethod === 'moncash' ? 'MonCash (+509 47703814)' : paymentMethod === 'natcash' ? 'NatCash (+509 35100438)' : 'Kripto'}`
                          : `Preuve de Paiement ${paymentMethod.toUpperCase()}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          {language === 'ht'
                            ? 'Kòd Tranzaksyon / Referans *'
                            : 'Code de Transaction / Référence *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentRef}
                          onChange={(e) => setPaymentRef(e.target.value)}
                          placeholder={
                            paymentMethod === 'moncash'
                              ? 'Ex: MC12849204'
                              : paymentMethod === 'natcash'
                              ? 'Ex: NC83920194'
                              : 'Ex: 0x8f2... / TxHash'
                          }
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          {language === 'ht'
                            ? 'Nimewo ki voye kòb la'
                            : 'Numéro expéditeur'}
                        </label>
                        <input
                          type="text"
                          value={paymentPhone}
                          onChange={(e) => setPaymentPhone(e.target.value)}
                          placeholder="+509 xxxx xxxx"
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location in Léogâne or Digital Delivery */}
                  {isAllDigital ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <Sparkles size={14} className="text-emerald-600" />
                        <span>Livrezon Dijital Imedya & Garanti</span>
                      </div>
                      <p className="text-[11px] text-emerald-700">
                        Pwodwi / sèvis sa yo ap delivre dirèkteman sou kont ou oswa pa WhatsApp/Email nan 5 a 15 minit apre Pwopriyetè Mache Yogann konfime peman an. Pa gen frè livrezon fizik motosiklèt.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ht' ? 'Zòn nan Leyogàn *' : 'Zone à Léogâne *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={buyerZone}
                          onChange={(e) => setBuyerZone(e.target.value)}
                          placeholder="Bergeau, Ti Rivyè, Ca Ira, Dufort..."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ht' ? 'Adrès oswa Pwen Rankont' : 'Adresse ou Repère'}
                        </label>
                        <input
                          type="text"
                          value={buyerAddress}
                          onChange={(e) => setBuyerAddress(e.target.value)}
                          placeholder="Pre legliz la, devan famasi a..."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ht' ? 'Ti nòt pou livrè a (opsyonèl)' : 'Note pour la livraison (optionnel)'}
                    </label>
                    <input
                      type="text"
                      value={buyerNotes}
                      onChange={(e) => setBuyerNotes(e.target.value)}
                      placeholder="Rele m lè w rive nan kafou a..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.01 } : undefined}
                    whileTap={!isSubmitting ? { scale: 0.99 } : undefined}
                    type="submit"
                    className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer transition-all ${
                      isSubmitting ? 'opacity-80 cursor-wait' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                        />
                        <span>{language === 'ht' ? 'Ap anrejistre kòmand lan...' : 'Enregistrement de la commande...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>
                          {language === 'ht'
                            ? 'Konfime Kòmand la & Voye Notifikasyon'
                            : 'Confirmer la Commande & Notifier'}
                        </span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {/* ETAP 3: KÒMAND KONFIME, NOTIFIKASYON GMAIL + WHATSAPP + VANDÈ */}
            {step === 'confirmed' && (
              <motion.div
                key="step-confirmed"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Congratulatory header */}
                <div className="text-center space-y-2 py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit']">
                    {language === 'ht' ? 'Mèsi! Kòmand ou a anrejistre' : 'Merci ! Commande Enregistrée'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {language === 'ht'
                      ? 'Nou resevwa enfòmasyon peman w yo. Ajan Mache Yogann nan ap prepare pake a pou livrezon.'
                      : 'Nous avons reçu vos informations. Nos agents préparent la livraison.'}
                  </p>
                </div>

                {/* Order ID & Security Code Box */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900 text-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Nimewo Kòmand:
                    </span>
                    <span className="font-mono font-black text-amber-400 text-sm sm:text-base">
                      {createdOrderNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Kòd Sekirite Livrezon:
                    </span>
                    <span className="font-mono font-black text-emerald-400 text-base sm:text-lg">
                      {createdDeliveryCode}
                    </span>
                    <span className="block text-[9px] text-slate-400">
                      (Bay livrè a sèlman lè l remèt ou pake a)
                    </span>
                  </div>
                </div>

                {/* 1. NOTIFIKASYON GMAIL MACHEYOGANN@GMAIL.COM */}
                <div className="p-3.5 rounded-2xl border border-red-200 bg-red-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-red-600 shrink-0" />
                      <span className="font-bold text-slate-900">
                        Mesaj voye sou Gmail sit la:
                      </span>
                    </div>
                    <span className="font-mono font-bold text-red-600 bg-white px-2 py-0.5 rounded-md border border-red-200 text-[11px]">
                      macheyogann@gmail.com
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px]">
                    {language === 'ht'
                      ? `Detay kòmand ${createdOrderNumber} ak prèv peman ${paymentRef} voye otomatikman bay administrasyon Mache Yogann sou macheyogann@gmail.com.`
                      : `Les détails de la commande ont été transmis à macheyogann@gmail.com.`}
                  </p>

                  <a
                    href={`mailto:macheyogann@gmail.com?subject=Kòmand%20${createdOrderNumber}%20-${buyerName}&body=${waText}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-700 hover:underline"
                  >
                    <span>Ouvri Gmail pou wè oswa voye yon lòt mesaj</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* 2. NOTIFIKASYON WHATSAPP */}
                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-900">
                        Notifikasyon WhatsApp Mache Yogann:
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                      +509 47703814
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px]">
                    {language === 'ht'
                      ? 'Ou ka voye resi a oswa kòd referans lan dirèkteman sou WhatsApp Mache Yogann pou verifikasyon an fèt pi vit toujou.'
                      : 'Envoyez directement votre reçu sur le WhatsApp officiel de Mache Yogann.'}
                  </p>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                  >
                    <MessageSquare size={15} />
                    <span>Ouvri WhatsApp pou Voye Prèv la (+509 47703814)</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                {/* 3. NOTIFIKASYON POU VANDÈ A */}
                <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Truck size={15} className="text-amber-600" />
                    <span>{language === 'ht' ? 'Notifikasyon Vandè sou Sit la:' : 'Notification Vendeur :'}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    {language === 'ht'
                      ? 'Moun ki te poste pwodwi sa a resevwa mesaj kòmand sa a dirèkteman sou sit la nan pati vandè a pou l ka prepare pake a!'
                      : 'Le vendeur a été notifié dans son tableau de bord vendeur pour préparer le colis.'}
                  </p>
                </div>

                {/* 4. TELECHAJMAN LIV ELEKTRONIK / PDF (SI GENYEN) */}
                {lastCreatedOrder?.items?.some((i: any) => i.product?.bookFormat === 'pdf' || i.product?.category === 'LivPDF') && (
                  <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-blue-950">
                      <BookOpen size={16} className="text-blue-700" />
                      <span>{language === 'ht' ? 'Aksè ak Telechajman Liv Dijital PDF:' : 'Accès aux Livres Numériques PDF :'}</span>
                    </div>
                    <p className="text-blue-800 text-[11px]">
                      {language === 'ht'
                        ? 'Liv PDF ou te kòmande yo pare pou telechaje imedyatman sou aparèy ou an:'
                        : 'Vos livres au format PDF sont disponibles au téléchargement direct :'}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {lastCreatedOrder.items
                        .filter((i: any) => i.product?.bookFormat === 'pdf' || i.product?.category === 'LivPDF')
                        .map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-blue-200">
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{item.product.title}</p>
                              <p className="text-[11px] text-slate-500">
                                {item.product.author ? `Otè: ${item.product.author} · ` : ''} {item.product.fileSize || 'PDF Ebook'}
                              </p>
                            </div>
                            <a
                              href={item.product.pdfDownloadUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => {
                                if (!item.product.pdfDownloadUrl) {
                                  e.preventDefault();
                                  showNotification(language === 'ht' ? 'Fichye sa a ap voye sou imel ou tou!' : 'Le lien est également envoyé par e-mail!', 'info');
                                }
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Download size={13} />
                              <span>{language === 'ht' ? 'Telechaje' : 'Télécharger'}</span>
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setActiveTab('track');
                    }}
                    className="w-full sm:flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    {language === 'ht' ? 'Swiv Kòmand Ou an Dirèk' : 'Suivre ma Commande'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setActiveTab('home');
                    }}
                    className="w-full sm:flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    {language === 'ht' ? 'Retounen nan Boutik la' : 'Retour à la boutique'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
