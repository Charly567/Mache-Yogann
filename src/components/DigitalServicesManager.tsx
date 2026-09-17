import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  DollarSign,
  Gift,
  Search,
  Package,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Smartphone,
  Gamepad2,
  Tv,
  Check,
  X,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  DigitalService,
  DigitalPackage,
  DigitalCode,
  DigitalCategory,
  DigitalDeliveryType,
  Order,
} from '../types';

export const DigitalServicesManager: React.FC = () => {
  const {
    language,
    digitalServices,
    digitalCodes,
    digitalStats,
    orders,
    refreshDigitalServices,
    refreshDigitalCodes,
    refreshDigitalStats,
    createDigitalServiceBackend,
    updateDigitalServiceBackend,
    deleteDigitalServiceBackend,
    togglePublishDigitalServiceBackend,
    duplicateDigitalServiceBackend,
    addDigitalCodesBackend,
    deleteDigitalCodeBackend,
    fulfillDigitalOrderBackend,
    cancelOrRefundDigitalOrderBackend,
    verifyPaymentBackend,
    showNotification,
  } = useApp();

  // Internal view tabs: services catalog, orders queue, code inventory
  const [managerTab, setManagerTab] = useState<'services' | 'orders' | 'codes'>('services');

  // Service list filter & search
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Order filter & search
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Codes filter
  const [selectedServiceForCodes, setSelectedServiceForCodes] = useState<string>('all');
  const [codeFilterStatus, setCodeFilterStatus] = useState<'all' | 'unused' | 'used'>('all');

  // Modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<DigitalService | null>(null);

  const [isFulfillModalOpen, setIsFulfillModalOpen] = useState(false);
  const [fulfillingOrder, setFulfillingOrder] = useState<Order | null>(null);
  const [fulfillmentAction, setFulfillmentAction] = useState<'deliver_recharge' | 'deliver_code'>('deliver_recharge');
  const [fulfillmentNote, setFulfillmentNote] = useState('');
  const [deliveredCodeManual, setDeliveredCodeManual] = useState('');
  const [deliveredPinManual, setDeliveredPinManual] = useState('');
  const [selectedStockCodeId, setSelectedStockCodeId] = useState('');

  // Add Codes modal
  const [isAddCodesModalOpen, setIsAddCodesModalOpen] = useState(false);
  const [targetServiceForNewCodes, setTargetServiceForNewCodes] = useState('');
  const [bulkCodesText, setBulkCodesText] = useState('');

  // Form state for Service Create/Edit
  const [serviceForm, setServiceForm] = useState<Partial<DigitalService>>({
    name: '',
    category: 'gaming',
    description: '',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    deliveryType: 'manual_recharge',
    providerName: 'Garena / Free Fire',
    currency: 'HTG',
    defaultSellingPrice: 500,
    defaultCostPrice: 400,
    minDeliveryMinutes: 5,
    maxDeliveryMinutes: 15,
    instructions: 'Tanpri bay Player ID ou kòrèkteman. Rechaj la ap fèt nan 5 a 15 minit.',
    isActive: true,
    isPublished: true,
    isFeatured: false,
    packages: [
      { id: 'pkg_1', name: '100 Dyaman', sellingPrice: 150, costPrice: 120, currency: 'HTG' },
      { id: 'pkg_2', name: '310 Dyaman', sellingPrice: 450, costPrice: 360, currency: 'HTG' },
      { id: 'pkg_3', name: '520 Dyaman', sellingPrice: 750, costPrice: 600, currency: 'HTG' },
    ],
    requiredFields: [
      { id: 'playerId', label: 'Player ID (ID nan jwèt la)', type: 'text', placeholder: 'Ex: 194829104', required: true },
    ],
  });

  // Digital Orders
  const digitalOrders = orders.filter((o) => o.isDigital || o.orderType === 'digital' || o.items?.some((i) => i.isDigital));

  const pendingRecharges = digitalOrders.filter(
    (o) => o.status === 'DIGITAL_PROCESSING' || (o.status === 'PAYMENT_CONFIRMED' && o.isDigital)
  );

  // Filtered Services
  const filteredServices = digitalServices.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      !serviceSearch.trim() ||
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.providerName.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = digitalOrders.filter((o) => {
    const matchesStatus = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch =
      !orderSearch.trim() ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.buyerPhone.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.digitalDetails?.serviceName?.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered Codes
  const filteredCodes = digitalCodes.filter((c) => {
    const matchesService = selectedServiceForCodes === 'all' || c.serviceId === selectedServiceForCodes;
    const matchesStatus =
      codeFilterStatus === 'all' || (codeFilterStatus === 'unused' ? !c.isUsed : c.isUsed);
    return matchesService && matchesStatus;
  });

  // Open Create Service Modal
  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      category: 'gaming',
      description: '',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      deliveryType: 'manual_recharge',
      providerName: '',
      currency: 'HTG',
      defaultSellingPrice: 500,
      defaultCostPrice: 400,
      minDeliveryMinutes: 5,
      maxDeliveryMinutes: 15,
      instructions: '',
      isActive: true,
      isPublished: true,
      isFeatured: false,
      packages: [
        { id: `pkg_${Date.now()}_1`, name: 'Pake Standard', sellingPrice: 500, costPrice: 400, currency: 'HTG' },
      ],
      requiredFields: [
        { id: 'playerId', label: 'Player ID oswa Nimewo Kont', type: 'text', placeholder: 'Antre ID a', required: true },
      ],
    });
    setIsServiceModalOpen(true);
  };

  // Open Edit Service Modal
  const handleOpenEditService = (service: DigitalService) => {
    setEditingService(service);
    setServiceForm({ ...service });
    setIsServiceModalOpen(true);
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name?.trim()) {
      showNotification('Tanpri mete non sèvis la', 'error');
      return;
    }

    if (editingService) {
      await updateDigitalServiceBackend(editingService.id, serviceForm);
    } else {
      await createDigitalServiceBackend(serviceForm);
    }
    setIsServiceModalOpen(false);
  };

  // Open Fulfillment Modal
  const handleOpenFulfillment = (order: Order) => {
    setFulfillingOrder(order);
    const deliveryType = order.digitalDetails?.deliveryType || 'manual_recharge';
    const isCode = deliveryType.includes('code');
    setFulfillmentAction(isCode ? 'deliver_code' : 'deliver_recharge');
    setFulfillmentNote('');
    setDeliveredCodeManual('');
    setDeliveredPinManual('');
    setSelectedStockCodeId('');
    setIsFulfillModalOpen(true);
  };

  // Submit Fulfillment
  const handleExecuteFulfillment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fulfillingOrder) return;

    let finalCode = deliveredCodeManual.trim();
    let finalPin = deliveredPinManual.trim();

    if (fulfillmentAction === 'deliver_code' && selectedStockCodeId) {
      const stockItem = digitalCodes.find((c) => c.id === selectedStockCodeId);
      if (stockItem) {
        finalCode = stockItem.code;
        finalPin = stockItem.pin || '';
      }
    }

    if (fulfillmentAction === 'deliver_code' && !finalCode) {
      showNotification('Tanpri chwazi oswa antre yon kòd ki valab.', 'error');
      return;
    }

    await fulfillDigitalOrderBackend(fulfillingOrder.id, {
      action: fulfillmentAction,
      deliveredCode: finalCode,
      deliveredPin: finalPin,
      notes: fulfillmentNote.trim(),
    });

    setIsFulfillModalOpen(false);
    setFulfillingOrder(null);
  };

  // Bulk Add Codes
  const handleAddCodesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetServiceForNewCodes) {
      showNotification('Tanpri chwazi yon sèvis', 'error');
      return;
    }

    const lines = bulkCodesText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      showNotification('Tanpri mete omwen yon kòd', 'error');
      return;
    }

    const parsedCodes = lines.map((line) => {
      const parts = line.split(/[,\t| ]+/);
      return {
        code: parts[0],
        pin: parts[1] || undefined,
        notes: parts.slice(2).join(' ') || undefined,
      };
    });

    await addDigitalCodesBackend(targetServiceForNewCodes, parsedCodes);
    setBulkCodesText('');
    setIsAddCodesModalOpen(false);
  };

  // Package Form Helpers
  const addPackageToForm = () => {
    const newPkg: DigitalPackage = {
      id: `pkg_${Date.now()}`,
      name: 'Nouvo Pakè',
      sellingPrice: 500,
      costPrice: 400,
      currency: 'HTG',
      profit: 100,
      marginPercent: 20,
    };
    setServiceForm((prev) => ({
      ...prev,
      packages: [...(prev.packages || []), newPkg],
    }));
  };

  const updatePackageInForm = (index: number, updates: Partial<DigitalPackage>) => {
    setServiceForm((prev) => {
      const pkgs = [...(prev.packages || [])];
      pkgs[index] = { ...pkgs[index], ...updates };
      return { ...prev, packages: pkgs };
    });
  };

  const removePackageFromForm = (index: number) => {
    setServiceForm((prev) => ({
      ...prev,
      packages: (prev.packages || []).filter((_, i) => i !== index),
    }));
  };

  // Custom Field Form Helpers
  const addFieldToForm = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: 'Nouvo Chan',
      type: 'text' as const,
      placeholder: '',
      required: true,
    };
    setServiceForm((prev) => ({
      ...prev,
      requiredFields: [...(prev.requiredFields || []), newField],
    }));
  };

  const updateFieldInForm = (index: number, updates: any) => {
    setServiceForm((prev) => {
      const fields = [...(prev.requiredFields || [])];
      fields[index] = { ...fields[index], ...updates };
      return { ...prev, requiredFields: fields };
    });
  };

  const removeFieldFromForm = (index: number) => {
    setServiceForm((prev) => ({
      ...prev,
      requiredFields: (prev.requiredFields || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div id="digital-services-manager-root" className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Katalòg Sèvis</span>
            <Zap size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-['Outfit']">
            {digitalServices.length}
          </p>
          <p className="text-[10px] text-slate-500">
            {digitalServices.filter((s) => s.isPublished).length} pibliye sou sit la
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Kòmand Total</span>
            <Package size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-['Outfit']">
            {digitalOrders.length}
          </p>
          <p className="text-[10px] text-slate-500">
            {digitalOrders.filter((o) => o.status === 'DELIVERED').length} delivre avèk siksè
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Rechaj pou Trete</span>
            <Clock size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 font-['Outfit']">
            {pendingRecharges.length}
          </p>
          <p className="text-[10px] text-slate-500">Kòmand k ap tann livrezon</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Chif D'afè</span>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-['Outfit']">
            {(digitalStats?.totalRevenue || 0).toLocaleString()} <span className="text-xs">HTG</span>
          </p>
          <p className="text-[10px] text-slate-500">Vant sèvis dijital konfime</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Benefis Mèch / Pwofi</span>
            <TrendingUp size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 font-['Outfit']">
            {(digitalStats?.totalProfit || 0).toLocaleString()} <span className="text-xs">HTG</span>
          </p>
          <p className="text-[10px] text-slate-500">Marge pwopriyetè Mache Yogann</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setManagerTab('services')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              managerTab === 'services'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Zap size={15} />
            <span>Katalòg Sèvis Dijital ({digitalServices.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setManagerTab('orders')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
              managerTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package size={15} />
            <span>Kòmand Dijital yo ({digitalOrders.length})</span>
            {pendingRecharges.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {pendingRecharges.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setManagerTab('codes')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              managerTab === 'codes'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Gift size={15} />
            <span>Stock & Kòd Kat Kado ({digitalCodes.filter((c) => !c.isUsed).length})</span>
          </button>
        </div>

        {managerTab === 'services' && (
          <button
            type="button"
            onClick={handleOpenCreateService}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Ajoute Nouvo Sèvis Dijital</span>
          </button>
        )}

        {managerTab === 'codes' && (
          <button
            type="button"
            onClick={() => {
              setTargetServiceForNewCodes(digitalServices[0]?.id || '');
              setIsAddCodesModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Ajoute Kòd nan Stock</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. SERVICES CATALOG VIEW */}
      {/* ========================================================================= */}
      {managerTab === 'services' && (
        <div className="space-y-4">
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'gaming', 'telecom', 'streaming', 'giftcard', 'vpn'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Tout Kategori' : cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Chèche nan sèvis yo..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Table / Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => {
              const availableCodesCount = digitalCodes.filter(
                (c) => c.serviceId === service.id && !c.isUsed
              ).length;
              const margin = service.defaultSellingPrice - service.defaultCostPrice;
              const marginPercent =
                service.defaultSellingPrice > 0
                  ? Math.round((margin / service.defaultSellingPrice) * 100)
                  : 0;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm font-['Outfit'] line-clamp-1">
                            {service.name}
                          </h4>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {service.category} • {service.providerName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => togglePublishDigitalServiceBackend(service.id)}
                          title={service.isPublished ? 'Dépublier' : 'Publier'}
                          className={`p-1.5 rounded-xl cursor-pointer ${
                            service.isPublished
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          {service.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Financial Summary */}
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] grid grid-cols-3 gap-1 text-center">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Kout Acha</span>
                        <span className="font-bold text-slate-700">
                          {service.defaultCostPrice.toLocaleString()} {service.currency || 'HTG'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Pri Vann</span>
                        <span className="font-bold text-red-600">
                          {service.defaultSellingPrice.toLocaleString()} {service.currency || 'HTG'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Marge</span>
                        <span className="font-black text-emerald-600">
                          +{marginPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold ${
                          service.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {service.isPublished ? 'Pibliye' : 'Kache'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-medium bg-blue-50 text-blue-800">
                        {service.deliveryType === 'manual_recharge' ? 'Rechaj Dirèk' : 'Kòd / PIN'}
                      </span>
                      {service.deliveryType.includes('code') && (
                        <span className="px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-900">
                          Stock: {availableCodesCount} kòd
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600">
                        {service.packages?.length || 0} pakè
                      </span>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => duplicateDigitalServiceBackend(service.id)}
                        title="Fè yon kopi"
                        className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDigitalServiceBackend(service.id)}
                        title="Efase sèvis"
                        className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEditService(service)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit size={13} />
                      <span>Modifye</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DIGITAL ORDERS QUEUE */}
      {/* ========================================================================= */}
      {managerTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'Tout Kòmand Dijital' },
                { id: 'DIGITAL_PROCESSING', label: 'Pou Trete (Rechaj)' },
                { id: 'PAYMENT_PENDING', label: 'Peman Tann' },
                { id: 'DELIVERED', label: 'Livre' },
                { id: 'CANCELLED', label: 'Anile / Ranbouse' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setOrderFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    orderFilter === filter.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Chèche pa kliyan, telefòn..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const details = order.digitalDetails;
                const isProcessing = order.status === 'DIGITAL_PROCESSING';
                const isPendingPayment = order.status === 'PAYMENT_PENDING' || order.status === 'payment_pending';
                const isDelivered = order.status === 'DELIVERED' || order.status === 'delivered';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">{order.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isDelivered
                                ? 'bg-emerald-100 text-emerald-800'
                                : isProcessing
                                ? 'bg-rose-100 text-rose-800 animate-pulse'
                                : isPendingPayment
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Kliyan: <strong className="text-slate-800">{order.buyerName}</strong> •{' '}
                          <a
                            href={`https://wa.me/${order.buyerWhatsApp?.replace(/[^0-9]/g, '') || order.buyerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-semibold"
                          >
                            <span>{order.buyerWhatsApp || order.buyerPhone}</span>
                            <ExternalLink size={10} />
                          </a>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-red-600 font-['Outfit'] block">
                          {(order.total || order.subtotal || 0).toLocaleString()} {details?.currency || 'HTG'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Peman: <strong className="uppercase text-slate-700">{order.paymentMethod}</strong> (Ref: {order.paymentRef || 'N/A'})
                        </span>
                      </div>
                    </div>

                    {/* Digital Service Details & Player ID / Account info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Sèvis Dijital</span>
                        <span className="font-bold text-slate-900">{details?.serviceName || order.items?.[0]?.productTitle}</span>
                        <span className="text-[10px] text-slate-500 block">Pakè: {details?.packageName || 'Standard'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Kont / Player ID Kliyan</span>
                        <span className="font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block border border-blue-200">
                          {details?.targetAccount || 'N/A'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Pwofi Mache Yogann</span>
                        <span className="font-bold text-emerald-600">
                          +{(details?.profit || 0).toLocaleString()} HTG ({Math.round(details?.marginPercent || 0)}%)
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Founisè & Délai</span>
                        <span className="font-semibold text-slate-700">{details?.providerName || 'Ofisyèl'}</span>
                        <span className="text-[10px] text-slate-500 block">{details?.estimatedDelivery}</span>
                      </div>
                    </div>

                    {/* Delivered Code Info if fulfilled */}
                    {order.digitalDetails?.deliveredCode && (
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                        <div>
                          <span className="font-bold block">Kòd / PIN Livre:</span>
                          <span className="font-mono text-sm font-black text-emerald-950">
                            {order.digitalDetails.deliveredCode}
                          </span>
                          {order.digitalDetails.deliveredPin && (
                            <span className="ml-3 font-mono text-xs text-emerald-800">
                              PIN: {order.digitalDetails.deliveredPin}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium">Delivre</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        {isPendingPayment && (
                          <button
                            type="button"
                            onClick={() => verifyPaymentBackend(order.id, 'confirm')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Konfime Peman ({order.paymentMethod.toUpperCase()})
                          </button>
                        )}

                        {(isProcessing || isPendingPayment) && (
                          <button
                            type="button"
                            onClick={() => handleOpenFulfillment(order)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Zap size={14} />
                            <span>
                              {order.digitalDetails?.deliveryType === 'manual_recharge'
                                ? 'Trete & Livre Rechaj la'
                                : 'Voye Kòd la bay Kliyan an'}
                            </span>
                          </button>
                        )}
                      </div>

                      {!isDelivered && (
                        <button
                          type="button"
                          onClick={() => {
                            const reason = prompt('Rezon pou anilasyon oswa ranbousman kòmand sa a:');
                            if (reason) {
                              cancelOrRefundDigitalOrderBackend(order.id, 'refund', reason);
                            }
                          }}
                          className="text-xs text-rose-600 hover:underline cursor-pointer font-semibold"
                        >
                          Anile / Ranbouse Kòmand
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <Package size={32} className="mx-auto text-slate-400" />
              <p className="text-xs text-slate-500 font-medium">Pa gen kòmand dijital nan seksyon sa a.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CODES & GIFT CARDS INVENTORY */}
      {/* ========================================================================= */}
      {managerTab === 'codes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <select
                value={selectedServiceForCodes}
                onChange={(e) => setSelectedServiceForCodes(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="all">Tout Sèvis yo</option>
                {digitalServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setCodeFilterStatus('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  codeFilterStatus === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tout Kòd
              </button>

              <button
                type="button"
                onClick={() => setCodeFilterStatus('unused')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  codeFilterStatus === 'unused'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Disponib ({digitalCodes.filter((c) => !c.isUsed).length})
              </button>

              <button
                type="button"
                onClick={() => setCodeFilterStatus('used')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  codeFilterStatus === 'used'
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Itilize ({digitalCodes.filter((c) => c.isUsed).length})
              </button>
            </div>
          </div>

          {filteredCodes.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Kòd / PIN</th>
                      <th className="p-3.5">Sèvis</th>
                      <th className="p-3.5">Estati</th>
                      <th className="p-3.5">Dat Ajoute</th>
                      <th className="p-3.5">Aksyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCodes.map((code) => {
                      const service = digitalServices.find((s) => s.id === code.serviceId);
                      return (
                        <tr key={code.id} className="hover:bg-slate-50/50">
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-slate-900 block">{code.code}</span>
                            {code.pin && (
                              <span className="font-mono text-[11px] text-slate-500">PIN: {code.pin}</span>
                            )}
                          </td>
                          <td className="p-3.5 font-medium text-slate-700">
                            {service?.name || code.serviceId}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                code.isUsed
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {code.isUsed ? 'Itilize' : 'Disponib nan Stock'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {new Date(code.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3.5">
                            {!code.isUsed && (
                              <button
                                type="button"
                                onClick={() => deleteDigitalCodeBackend(code.id)}
                                className="text-rose-500 hover:text-rose-700 cursor-pointer"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <Gift size={32} className="mx-auto text-slate-400" />
              <p className="text-xs text-slate-500 font-medium">Pa gen kòd nan stock pou filtè sa a.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT DIGITAL SERVICE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto"
            >
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-amber-400" />
                  <h3 className="font-bold text-base font-['Outfit']">
                    {editingService ? `Modifye: ${editingService.name}` : 'Ajoute Nouvo Sèvis Dijital'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Non Sèvis la *</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.name || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      placeholder="Ex: Free Fire Dyaman"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                    <select
                      value={serviceForm.category || 'gaming'}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as DigitalCategory })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    >
                      <option value="gaming">Gaming & Dyaman (Free Fire, PUBG, Roblox)</option>
                      <option value="telecom">Rechaj Télécom (Digicel, Natcom)</option>
                      <option value="streaming">Streaming (Netflix, Spotify, IPTV)</option>
                      <option value="giftcard">Kat Kado (Steam, Apple, Google Play)</option>
                      <option value="vpn">VPN & Sekirite</option>
                      <option value="software">Lojisyèl & Kle Aktivasyon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tip Livrezon *</label>
                    <select
                      value={serviceForm.deliveryType || 'manual_recharge'}
                      onChange={(e) => setServiceForm({ ...serviceForm, deliveryType: e.target.value as DigitalDeliveryType })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    >
                      <option value="manual_recharge">Rechaj Manyèl (Pwopriyetè a fè rechaj la sou kont kliyan an)</option>
                      <option value="manual_code">Kòd Manyèl (Pwopriyetè voye yon kòd/PIN bay kliyan an)</option>
                      <option value="automatic_code">Kòd Otomatik (Pran nan stock kòd ki disponib)</option>
                      <option value="assisted">Asiste pa WhatsApp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Founisè / Patnè *</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.providerName || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, providerName: e.target.value })}
                      placeholder="Ex: Garena, Digicel Ayiti, Netflix"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL Imaj *</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.image || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsyon Kout</label>
                    <textarea
                      rows={2}
                      value={serviceForm.description || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="Eksplike kliyan an sa li ap achte a..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enstriksyon pou Kliyan an</label>
                    <textarea
                      rows={2}
                      value={serviceForm.instructions || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, instructions: e.target.value })}
                      placeholder="Kisa pou kliyan an bay? Kijan l ap resevwa l?"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Minimòm Minit Livrezon</label>
                    <input
                      type="number"
                      value={serviceForm.minDeliveryMinutes || 5}
                      onChange={(e) => setServiceForm({ ...serviceForm, minDeliveryMinutes: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Maksimòm Minit Livrezon</label>
                    <input
                      type="number"
                      value={serviceForm.maxDeliveryMinutes || 15}
                      onChange={(e) => setServiceForm({ ...serviceForm, maxDeliveryMinutes: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Packages Editor */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                        Pakè oswa Opsyon Pri yo
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Chak pakè ka gen pri acha, pri vann ak benefis pa l.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addPackageToForm}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Ajoute Pakè</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(serviceForm.packages || []).map((pkg, idx) => {
                      const margin = pkg.sellingPrice - pkg.costPrice;
                      const marginPct = pkg.sellingPrice > 0 ? Math.round((margin / pkg.sellingPrice) * 100) : 0;
                      return (
                        <div
                          key={pkg.id || idx}
                          className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 items-center text-xs"
                        >
                          <div className="sm:col-span-2">
                            <label className="text-[10px] text-slate-500 block">Non Pakè</label>
                            <input
                              type="text"
                              value={pkg.name}
                              onChange={(e) => updatePackageInForm(idx, { name: e.target.value })}
                              placeholder="Ex: 100 Dyaman"
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 block">Kout Acha (HTG)</label>
                            <input
                              type="number"
                              value={pkg.costPrice}
                              onChange={(e) => updatePackageInForm(idx, { costPrice: Number(e.target.value) })}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 block">Pri Vann (HTG)</label>
                            <input
                              type="number"
                              value={pkg.sellingPrice}
                              onChange={(e) => updatePackageInForm(idx, { sellingPrice: Number(e.target.value) })}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-red-600"
                            />
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0">
                            <span className="text-[10px] font-black text-emerald-600">
                              +{marginPct}% (+{margin} G)
                            </span>
                            <button
                              type="button"
                              onClick={() => removePackageFromForm(idx)}
                              className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Required Custom Fields Editor */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                        Chan Kliyan an Dwe Ranpli
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Egzanp: Player ID, Nimewo Telefòn, Sèvè, elatriye.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addFieldToForm}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Ajoute Chan</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(serviceForm.requiredFields || []).map((field, idx) => (
                      <div
                        key={field.id || idx}
                        className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs"
                      >
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateFieldInForm(idx, { label: e.target.value })}
                          placeholder="Etikèt chan an (Ex: Player ID)"
                          className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                        />
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => updateFieldInForm(idx, { placeholder: e.target.value })}
                          placeholder="Placeholder (Ex: 1984291)"
                          className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeFieldFromForm(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-200 text-xs font-bold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceForm.isPublished}
                      onChange={(e) => setServiceForm({ ...serviceForm, isPublished: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Pibliye sou Sit la (Vizib pou Kliyan)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceForm.isFeatured}
                      onChange={(e) => setServiceForm({ ...serviceForm, isFeatured: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Mete an Vedèt (Badge Popilè)</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Anile
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Anrejistre Sèvis la
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: FULFILL DIGITAL ORDER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isFulfillModalOpen && fulfillingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto"
            >
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-amber-400" />
                  <h3 className="font-bold text-base font-['Outfit']">
                    Trete Livrezon Sèvis Dijital
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFulfillModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleExecuteFulfillment} className="p-6 space-y-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kòmand:</span>
                    <span className="font-mono font-bold text-slate-900">{fulfillingOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kliyan:</span>
                    <span className="font-bold text-slate-900">
                      {fulfillingOrder.buyerName} ({fulfillingOrder.buyerPhone})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sèvis / Pakè:</span>
                    <span className="font-bold text-red-600">
                      {fulfillingOrder.digitalDetails?.serviceName} ({fulfillingOrder.digitalDetails?.packageName})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target / Player ID:</span>
                    <span className="font-mono font-black text-blue-700">
                      {fulfillingOrder.digitalDetails?.targetAccount || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Choose fulfillment mode */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">Tip Aksyon Livrezon *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFulfillmentAction('deliver_recharge')}
                      className={`p-3 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        fulfillmentAction === 'deliver_recharge'
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <p>Rechaj Fèt Dirèkteman</p>
                      <span className="text-[10px] font-normal text-slate-500 block">
                        Konfime ou fin chaje ID / Telefòn lan
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentAction('deliver_code')}
                      className={`p-3 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        fulfillmentAction === 'deliver_code'
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <p>Voye Kòd / Kat Kado</p>
                      <span className="text-[10px] font-normal text-slate-500 block">
                        Chwazi nan stock oswa tape kòd la
                      </span>
                    </button>
                  </div>
                </div>

                {/* If delivering code: select from available or enter manual */}
                {fulfillmentAction === 'deliver_code' && (
                  <div className="space-y-3 p-3 bg-amber-50/60 rounded-2xl border border-amber-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Chwazi nan Kòd ki nan Stock (Si genyen)
                      </label>
                      <select
                        value={selectedStockCodeId}
                        onChange={(e) => setSelectedStockCodeId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                      >
                        <option value="">-- Tape kòd la manyèlman anba a --</option>
                        {digitalCodes
                          .filter(
                            (c) =>
                              !c.isUsed &&
                              (!fulfillingOrder.digitalDetails?.serviceId ||
                                c.serviceId === fulfillingOrder.digitalDetails.serviceId)
                          )
                          .map((code) => (
                            <option key={code.id} value={code.id}>
                              {code.code} {code.pin ? `(PIN: ${code.pin})` : ''}
                            </option>
                          ))}
                      </select>
                    </div>

                    {!selectedStockCodeId && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Kòd Dijital *</label>
                          <input
                            type="text"
                            value={deliveredCodeManual}
                            onChange={(e) => setDeliveredCodeManual(e.target.value)}
                            placeholder="Ex: XXXX-YYYY-ZZZZ"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">PIN Sekrè (Opsyonèl)</label>
                          <input
                            type="text"
                            value={deliveredPinManual}
                            onChange={(e) => setDeliveredPinManual(e.target.value)}
                            placeholder="Ex: 1234"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nòt oswa Referans Konfimasyon pou Kliyan an
                  </label>
                  <textarea
                    rows={2}
                    value={fulfillmentNote}
                    onChange={(e) => setFulfillmentNote(e.target.value)}
                    placeholder="Ex: Rechaj Free Fire 520 Dyaman konfime sou ID 19849204. Mèsi paske w fè Mache Yogann konfyans!"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFulfillModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    Anile
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black cursor-pointer shadow-xs"
                  >
                    Konfime Livrezon an Kounye a
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: BULK ADD CODES */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddCodesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto"
            >
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift size={18} className="text-amber-400" />
                  <h3 className="font-bold text-base font-['Outfit']">Ajoute Kòd nan Stock</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCodesModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddCodesSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chwazi Sèvis Dijital la *</label>
                  <select
                    value={targetServiceForNewCodes}
                    onChange={(e) => setTargetServiceForNewCodes(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="">-- Chwazi sèvis --</option>
                    {digitalServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kole Kòd yo (Yon kòd pou chak liy) *
                  </label>
                  <p className="text-[10px] text-slate-500 mb-1.5">
                    Fòma: <code>KOD [PIN] [NÒT]</code> pa egzanp: <code>NF-89240-291 1234 Netflix 1 mois</code>
                  </p>
                  <textarea
                    rows={6}
                    required
                    value={bulkCodesText}
                    onChange={(e) => setBulkCodesText(e.target.value)}
                    placeholder={`NF-28190-8492 1234\nNF-84920-1049 4321\nSTEAM-9824-A782`}
                    className="w-full px-3.5 py-2.5 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCodesModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    Anile
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                  >
                    Anrejistre Kòd yo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
