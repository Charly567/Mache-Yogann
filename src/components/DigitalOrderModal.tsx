import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Gamepad2,
  Tv,
  Gift,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { DigitalService, DigitalPackage } from '../types';

export const DigitalOrderModal: React.FC = () => {
  const {
    language,
    selectedDigitalService,
    setSelectedDigitalService,
    isDigitalOrderModalOpen,
    setIsDigitalOrderModalOpen,
    selectedDigitalPackageId,
    setSelectedDigitalPackageId,
    orderDigitalService,
    currentUser,
    siteSettings,
  } = useApp();

  const service = selectedDigitalService;

  // Selected package
  const [selectedPkg, setSelectedPkg] = useState<DigitalPackage | null>(null);

  // Dynamic custom fields
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.phone || '');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'moncash' | 'natcash' | 'crypto' | 'cash'>('moncash');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentPhone, setPaymentPhone] = useState(currentUser?.phone || '');
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  useEffect(() => {
    if (service && service.packages && service.packages.length > 0) {
      const initialPkg = selectedDigitalPackageId
        ? service.packages.find((p) => p.id === selectedDigitalPackageId) || service.packages[0]
        : service.packages[0];
      setSelectedPkg(initialPkg);
    } else {
      setSelectedPkg(null);
    }
    setFieldValues({});
    setPaymentRef('');
    setErrorMessage('');
    setIsSuccess(false);
    setCreatedOrder(null);
  }, [service, selectedDigitalPackageId]);

  if (!isDigitalOrderModalOpen || !service) return null;

  const currentPrice = selectedPkg ? selectedPkg.sellingPrice : service.defaultSellingPrice;
  const currentCost = selectedPkg ? selectedPkg.costPrice : service.defaultCostPrice;
  const currentCurrency = selectedPkg?.currency || service.currency || 'HTG';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFieldChange = (key: string, val: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!paymentRef.trim()) {
      setErrorMessage(
        language === 'ht'
          ? 'Tanpri antre nimewo referans oswa kòd tranzaksyon peman an (MonCash / NatCash / Kripto).'
          : 'Veuillez entrer le numéro de référence du paiement.'
      );
      return;
    }

    // Validate required custom fields
    if (service.requiredFields && service.requiredFields.length > 0) {
      for (const field of service.requiredFields) {
        if (field.required && !fieldValues[field.id]?.trim()) {
          setErrorMessage(
            language === 'ht'
              ? `Tanpri ranpli chan: "${field.label}"`
              : `Veuillez remplir le champ: "${field.label}"`
          );
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const combinedFields = {
        ...fieldValues,
        buyerName: buyerName.trim() || 'Kliyan Mache Yogann',
        phoneNumber: buyerPhone.trim(),
        whatsappNumber: whatsappNumber.trim() || buyerPhone.trim(),
        paymentPhone: paymentPhone.trim() || buyerPhone.trim(),
      };

      const result = await orderDigitalService(
        service,
        selectedPkg?.id || 'default',
        combinedFields,
        paymentMethod,
        paymentRef.trim()
      );

      if (result.success) {
        setIsSuccess(true);
        setCreatedOrder(result.order);
      } else {
        setErrorMessage(result.message || 'Erè nan anrejistreman kòmand la');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erè sèvè');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    setIsDigitalOrderModalOpen(false);
    setSelectedDigitalService(null);
    setSelectedDigitalPackageId(null);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'gaming':
        return <Gamepad2 className="text-violet-500" size={20} />;
      case 'telecom':
      case 'recharge':
        return <Smartphone className="text-red-500" size={20} />;
      case 'streaming':
        return <Tv className="text-pink-500" size={20} />;
      case 'giftcard':
        return <Gift className="text-amber-500" size={20} />;
      default:
        return <Zap className="text-blue-500" size={20} />;
    }
  };

  return (
    <div
      id="digital-order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDialog();
      }}
    >
      <motion.div
        id="digital-order-modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto"
      >
        {/* Header with gradient badge */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white p-5 sm:p-6 relative">
          <button
            id="close-digital-modal-btn"
            onClick={closeDialog}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 p-1 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wide">
                  <Sparkles size={11} />
                  Mache Yogann Ofisyèl
                </span>
                <span className="inline-flex items-center gap-1 text-slate-300 text-xs">
                  {getCategoryIcon(service.category)}
                  <span className="capitalize">{service.category}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
                {service.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-amber-400" />
                  Livrezon: {service.minDeliveryMinutes} - {service.maxDeliveryMinutes} minit
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">
                  {service.deliveryType === 'manual_recharge'
                    ? 'Rechaj Dirèk sou Kont'
                    : 'Kòd / PIN Imedya'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">
                {language === 'ht' ? 'Kòmand Dijital Anrejistre!' : 'Commande Numérique Enregistrée !'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {language === 'ht'
                  ? `Kòmand ou ${createdOrder?.id || ''} sou ${service.name} anrejistre avèk siksè. Pwopriyetè Mache Yogann nan ap verifye peman MonCash/NatCash ou an pou trete livrezon an touswit.`
                  : `Votre commande pour ${service.name} est enregistrée. L'équipe Mache Yogann valide votre paiement et livre votre service.`}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Nimewo Kòmand:</span>
                <span className="font-mono font-bold text-slate-900">{createdOrder?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sèvis:</span>
                <span className="font-bold text-slate-900">{service.name} ({selectedPkg?.name})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Montan Peye:</span>
                <span className="font-bold text-red-600">{currentPrice.toLocaleString()} {currentCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Referans Peman:</span>
                <span className="font-mono font-bold text-slate-900">{paymentRef}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/50947703814?text=${encodeURIComponent(
                  `Bonjou Pwopriyetè Mache Yogann 🇭🇹, mwen fèk pase kòmand sèvis dijital ${createdOrder?.id || ''} pou ${service.name} (${selectedPkg?.name || ''}). Referans Peman: ${paymentRef}. Mèsi!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Konfime sou WhatsApp Pwopriyetè a</span>
                <ArrowRight size={14} />
              </a>

              <button
                type="button"
                onClick={closeDialog}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Fèmen
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Description / Instructions Banner */}
            {service.instructions && (
              <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Kijan sa fonksyone:</p>
                  <p className="text-blue-800 leading-relaxed text-[11px]">{service.instructions}</p>
                </div>
              </div>
            )}

            {/* Step 1: Package Selection */}
            {service.packages && service.packages.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  1. Chwazi Pakè oswa Kantite Ou Vle a *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {service.packages.map((pkg) => {
                    const isSelected = selectedPkg?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPkg(pkg)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-red-600 bg-red-50/70 shadow-sm shadow-red-600/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                        )}
                        <p className="font-bold text-xs text-slate-900">{pkg.name}</p>
                        {pkg.bonusInfo && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-800">
                            {pkg.bonusInfo}
                          </span>
                        )}
                        <p className="text-sm font-black text-red-600 mt-1.5 font-['Outfit']">
                          {pkg.sellingPrice.toLocaleString()} {pkg.currency || 'HTG'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Custom Required Fields */}
            {service.requiredFields && service.requiredFields.length > 0 && (
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Enfòmasyon pou Resevwa Sèvis la *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.requiredFields.map((field) => (
                    <div key={field.id} className={field.id === 'account_identifier' ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
                        required={field.required}
                        value={fieldValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || `Mete ${field.label.toLowerCase()}`}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-red-600 focus:outline-none transition-colors"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp pou Konfimasyon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+509 3xxx xxxx"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Peye sou Platfòm Ofisyèl Mache Yogann
                </label>
                <span className="text-xs font-black text-red-600 font-['Outfit']">
                  Total: {currentPrice.toLocaleString()} {currentCurrency}
                </span>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('moncash')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'moncash'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone size={13} />
                  <span>MonCash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('natcash')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'natcash'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone size={13} />
                  <span>NatCash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'crypto'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Lock size={13} />
                  <span>USDT (TRC20)</span>
                </button>
              </div>

              {/* Account Details Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                {paymentMethod === 'moncash' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Nimewo MonCash Ofisyèl
                      </span>
                      <span className="text-base font-black font-mono text-slate-900">
                        +509 47703814
                      </span>
                      <span className="text-[11px] text-slate-500 block">Non: Mache Yogann</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('+509 47703814')}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedAccount ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedAccount ? 'Kopye' : 'Kopi'}</span>
                    </button>
                  </div>
                )}

                {paymentMethod === 'natcash' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Nimewo NatCash Ofisyèl
                      </span>
                      <span className="text-base font-black font-mono text-slate-900">
                        +509 35100438
                      </span>
                      <span className="text-[11px] text-slate-500 block">Non: Mache Yogann</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('+509 35100438')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedAccount ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedAccount ? 'Kopye' : 'Kopi'}</span>
                    </button>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Adrès Bous USDT (TRC-20)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="TXm8ZkKqQ8wYh7pL9s4D2fGjKmP1nTvXz6"
                        className="w-full text-xs font-mono bg-white px-2 py-1 border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy('TXm8ZkKqQ8wYh7pL9s4D2fGjKmP1nTvXz6')}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                      >
                        {copiedAccount ? 'Kopye' : 'Kopi'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Reference Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kòd Tranzaksyon / Trans ID MonCash/NatCash *
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="Ex: MC9381920 oswa Trans ID"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nimewo ki fè transfè a
                  </label>
                  <input
                    type="tel"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="+509 xxxx xxxx"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
              <span>
                <strong>Garanti Mache Yogann:</strong> Sèvis sa a jere dirèkteman pa administrasyon an. Livrezon an fèt nan 5 - 15 minit apre validasyon.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-digital-order-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer transition-all"
              >
                {isSubmitting ? (
                  <span>Tanpri pasyante, n ap anrejistre kòmand lan...</span>
                ) : (
                  <>
                    <span>Konfime & Kòmande ({currentPrice.toLocaleString()} {currentCurrency})</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
