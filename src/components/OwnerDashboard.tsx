import React, { useState } from 'react';
import {
  Crown,
  Settings,
  Package,
  Users,
  Truck,
  DollarSign,
  Image as ImageIcon,
  Video,
  FileText,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Plus,
  Search,
  Eye,
  ShieldCheck,
  Ban,
  RotateCcw,
  Sparkles,
  Phone,
  Lock,
  Save,
  Play,
  MessageSquare,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Product, User, SiteSettings } from '../types';
import { DigitalServicesManager } from './DigitalServicesManager';

export const OwnerDashboard: React.FC = () => {
  const {
    language,
    siteSettings,
    updateSiteSettings,
    products,
    updateProduct,
    deleteProduct,
    addProduct,
    validateProduct,
    users,
    deleteUser,
    toggleUserBan,
    toggleVerifyUser,
    setDeliveryAgentAccess,
    addDeliveryAgent,
    orders,
    confirmPayment,
    rejectPayment,
    confirmPaymentBackend,
    assignCourierBackend,
    viewBonDeLivraison,
    refreshOrders,
    setTrackingOrderId,
    setActiveTab,
    showNotification,
    currentUser,
    categories,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    digitalServices,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'cms' | 'products' | 'users' | 'agents' | 'finances' | 'inquiries' | 'digital'>('cms');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'responded'>('all');

  const newInquiriesCount = inquiries.filter((inq) => inq.status === 'new').length;
  const pendingDigitalOrdersCount = orders.filter(
    (o) => o.isDigital && (o.status === 'DIGITAL_PROCESSING' || o.status === 'payment_pending' || o.status === 'PAYMENT_CONFIRMED')
  ).length;

  // Form states for CMS
  const [cmsForm, setCmsForm] = useState<SiteSettings>({ ...siteSettings });
  const [imagePreview, setImagePreview] = useState<string>(siteSettings.heroImage);
  const [videoPreview, setVideoPreview] = useState<string>(siteSettings.heroVideoUrl || '');

  // Product management states
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('Tout');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    description: '',
    category: 'Makèt & Pwovizyon',
    price: 500,
    originalPrice: 750,
    quantity: 20,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    sellerLocation: 'Sant Vil, Leyogàn',
    sellerPhone: siteSettings.contactPhone,
    sellerName: siteSettings.siteName,
  });

  // User management states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'seller' | 'buyer' | 'agent'>('all');
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    isOpen: boolean;
    type: 'product' | 'user';
    id: string;
    name: string;
  }>({
    isOpen: false,
    type: 'product',
    id: '',
    name: '',
  });

  // New Delivery Agent form state
  const [newAgentForm, setNewAgentForm] = useState({
    name: '',
    phone: '',
    zone: 'Sant Vil Leyogàn',
    vehicleType: 'Motosiklèt Haojue 125',
    licensePlate: '',
  });
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);

  // Handle local image upload for CMS
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setCmsForm((prev) => ({ ...prev, heroImage: result }));
        showNotification(language === 'ht' ? 'Imaj telechaje avèk siksè!' : 'Image téléchargée avec succès !', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local video upload for CMS
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setVideoPreview(result);
        setCmsForm((prev) => ({ ...prev, heroVideoUrl: result, showHeroVideo: true }));
        showNotification(language === 'ht' ? 'Videyo telechaje avèk siksè!' : 'Vidéo téléchargée avec succès !', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save all CMS settings
  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(cmsForm);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sellerLocation.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedProductCategory === 'Tout' || p.category === selectedProductCategory;
    return matchesSearch && matchesCat;
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.zone.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Delivery agents list
  const deliveryAgents = users.filter((u) => u.role === 'agent');

  // Finances calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalCommission = Math.round((totalRevenue * (siteSettings.commissionPercent || 10)) / 100);
  const paidOrders = orders.filter((o) => o.paymentStatus === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner for Owner Space */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Crown size={15} />
              <span>Espas Pwopriyetè & Mèt Sit la</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight text-white flex items-center gap-2">
              <span>Panèl Kontwòl Jeneral</span>
              <span className="text-amber-400 font-normal text-sm sm:text-base">({siteSettings.siteName})</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Ou gen tout otorite sou platfòm nan: modifye tèks, banyè, imaj ak videyo, kontwole ak efase machandiz/pòs, bay oswa retire aksè livrè yo, epi jere kont kliyan ak vandè.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl px-4 py-2.5 text-center">
              <p className="text-[11px] text-slate-400 font-medium">Total Machandiz</p>
              <p className="text-lg font-black text-white font-['Outfit']">{products.length}</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl px-4 py-2.5 text-center">
              <p className="text-[11px] text-slate-400 font-medium">Livrè Akredite</p>
              <p className="text-lg font-black text-amber-400 font-['Outfit']">
                {deliveryAgents.filter((a) => a.deliveryApproved).length} / {deliveryAgents.length}
              </p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl px-4 py-2.5 text-center">
              <p className="text-[11px] text-slate-400 font-medium">Komisyon ({siteSettings.commissionPercent}%)</p>
              <p className="text-lg font-black text-emerald-400 font-['Outfit']">{totalCommission.toLocaleString()} HTG</p>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 border-t border-slate-800 pt-4">
          <button
            onClick={() => setActiveSubTab('cms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'cms'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText size={16} />
            <span>1. Tèks, Imaj & Videyo (CMS)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package size={16} />
            <span>2. Machandiz & Pòs Vandè ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users size={16} />
            <span>3. Vandè & Kliyan ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('agents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'agents'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck size={16} />
            <span>4. Akredite Livrè yo ({deliveryAgents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('finances')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'finances'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <DollarSign size={16} />
            <span>5. Peman & Finans ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'inquiries'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare size={16} />
            <span>6. Mesaj Kliyan & AI ({inquiries.length})</span>
            {newInquiriesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                {newInquiriesCount} nouvo
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('digital')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'digital'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap size={16} className={activeSubTab === 'digital' ? 'text-slate-950' : 'text-amber-400'} />
            <span>7. Services Numériques Mache Yogann ({digitalServices.length})</span>
            {pendingDigitalOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                {pendingDigitalOrdersCount} pou trete
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CMS - TÈKS, IMAJ, VIDEYO */}
      {activeSubTab === 'cms' && (
        <form onSubmit={handleSaveCms} className="space-y-6">
          {/* Section: General Texts & Branding */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 font-['Outfit']">
                  <FileText className="text-amber-600" size={18} />
                  <span>Modifye Tèks ak Bannè Sit la</span>
                </h3>
                <p className="text-xs text-slate-500">Chanje non sit la, eslogan ak tout mesaj ki afiche pou vizitè yo.</p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm cursor-pointer shadow-xs transition-colors"
              >
                <Save size={16} />
                <span>Sove Chanjman yo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Non Sit la</label>
                <input
                  type="text"
                  value={cmsForm.siteName}
                  onChange={(e) => setCmsForm({ ...cmsForm, siteName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eslogan Kreyòl</label>
                <input
                  type="text"
                  value={cmsForm.sloganHt}
                  onChange={(e) => setCmsForm({ ...cmsForm, sloganHt: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Bannè Anons Anwo Sit la (Top Bar Notice)</label>
                <input
                  type="text"
                  value={cmsForm.topBannerNotice}
                  onChange={(e) => setCmsForm({ ...cmsForm, topBannerNotice: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tit Prensipal Akèy (Hero Title)</label>
                <input
                  type="text"
                  value={cmsForm.heroTitleHt}
                  onChange={(e) => setCmsForm({ ...cmsForm, heroTitleHt: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ti Badj Akèy la (Hero Badge)</label>
                <input
                  type="text"
                  value={cmsForm.heroBadgeHt}
                  onChange={(e) => setCmsForm({ ...cmsForm, heroBadgeHt: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Soutit & Deskripsyon Akèy la</label>
                <textarea
                  rows={2}
                  value={cmsForm.heroSubtitleHt}
                  onChange={(e) => setCmsForm({ ...cmsForm, heroSubtitleHt: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Upload Imaj & Banyè */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 font-['Outfit']">
                <ImageIcon className="text-amber-600" size={18} />
                <span>Upload & Modifye Imaj Sit la</span>
              </h3>
              <p className="text-xs text-slate-500">Chwazi imaj depi sou telefòn/òdinatè w oswa antre yon URL imaj.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Upload Imaj Banyè Prensipal (depi sou aparèy ou)</label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors">
                    <Upload size={28} className="text-amber-600 mb-2" />
                    <span className="text-xs font-bold text-slate-800">Klike pou chwazi yon imaj sou aparèy ou</span>
                    <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, WebP aksepte</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Oubyen antre URL imaj la dirèk</label>
                  <input
                    type="text"
                    value={cmsForm.heroImage}
                    onChange={(e) => {
                      setCmsForm({ ...cmsForm, heroImage: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Image Preview Box */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Aperçu Imaj Banyè a:</p>
                <div className="w-full h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group shadow-inner">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      Pa gen imaj chwazi
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    Imaj sa ap parèt sou akèy la
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Upload Videyo & Hero Video */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 font-['Outfit']">
                  <Video className="text-amber-600" size={18} />
                  <span>Upload & Montre Videyo sou Sit la</span>
                </h3>
                <p className="text-xs text-slate-500">Ajoute yon videyo pwomosyonèl pou mache a oswa pou montre kijan sa fonksyone.</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cmsForm.showHeroVideo}
                  onChange={(e) => setCmsForm({ ...cmsForm, showHeroVideo: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="text-xs font-bold text-slate-800">Montre Videyo a sou Akèy</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Upload Fichye Videyo (depi sou aparèy ou)</label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-red-300 hover:border-red-500 rounded-2xl bg-red-50/50 hover:bg-red-50 cursor-pointer transition-colors">
                    <Video size={28} className="text-red-600 mb-2" />
                    <span className="text-xs font-bold text-slate-800">Klike pou chwazi yon ti videyo</span>
                    <span className="text-[11px] text-slate-500 mt-1">MP4, WebM aksepte</span>
                    <input type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Oubyen Lyen Videyo (YouTube embed oswa MP4 URL)</label>
                  <input
                    type="text"
                    value={cmsForm.heroVideoUrl || ''}
                    onChange={(e) => {
                      setCmsForm({ ...cmsForm, heroVideoUrl: e.target.value });
                      setVideoPreview(e.target.value);
                    }}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Video Preview Box */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Aperçu Videyo:</p>
                <div className="w-full h-52 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                  {videoPreview ? (
                    videoPreview.includes('youtube.com') || videoPreview.includes('youtu.be') ? (
                      <iframe
                        src={videoPreview}
                        title="Hero Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={videoPreview} controls className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="text-center text-slate-400 p-4 space-y-1">
                      <Play size={28} className="mx-auto text-slate-600" />
                      <p className="text-xs">Pa gen videyo konfigire</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Kontak, Peman & PIN Sekirite */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 font-['Outfit']">
                <Settings className="text-amber-600" size={18} />
                <span>Paramèt Finans, Kontak & PIN Sekirite</span>
              </h3>
              <p className="text-xs text-slate-500">Nimewo MonCash, NatCash, komisyon ak kòd PIN pou antre nan espas sa a.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nimewo MonCash Ofisyèl</label>
                <input
                  type="text"
                  value={cmsForm.moncashNumber}
                  onChange={(e) => setCmsForm({ ...cmsForm, moncashNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nimewo NatCash Ofisyèl</label>
                <input
                  type="text"
                  value={cmsForm.natcashNumber}
                  onChange={(e) => setCmsForm({ ...cmsForm, natcashNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Sipò</label>
                <input
                  type="text"
                  value={cmsForm.contactWhatsApp}
                  onChange={(e) => setCmsForm({ ...cmsForm, contactWhatsApp: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Komisyon Platfòm nan (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={cmsForm.commissionPercent}
                  onChange={(e) => setCmsForm({ ...cmsForm, commissionPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Frè Livrezon De Baz (HTG)</label>
                <input
                  type="number"
                  value={cmsForm.baseDeliveryFee}
                  onChange={(e) => setCmsForm({ ...cmsForm, baseDeliveryFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Lock size={12} className="text-amber-600" />
                  <span>Kòd PIN Pwopriyetè a</span>
                </label>
                <input
                  type="text"
                  value={cmsForm.ownerPin}
                  onChange={(e) => setCmsForm({ ...cmsForm, ownerPin: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-amber-50/60 border border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 font-mono font-bold"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
              >
                <Save size={18} />
                <span>Sove Tout Paramèt Sit la</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: KONTWÒL MACHINDIZ & PÒS VANDÈ */}
      {activeSubTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-['Outfit'] flex items-center gap-2">
                <Package className="text-red-600" size={18} />
                <span>Tout Machandiz & Pòs Vandè Yo ({products.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ou ka efase nenpòt pòs vandè fè, modifye pri ak estòk, oswa valide machandiz an tann.
              </p>
            </div>

            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors shadow-xs"
            >
              <Plus size={16} />
              <span>Poste yon Nouvo Machandiz</span>
            </button>
          </div>

          {/* Filter / Search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Chèche pa tit, non vandè, zòn..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
              />
            </div>

            <select
              value={selectedProductCategory}
              onChange={(e) => setSelectedProductCategory(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
            >
              <option value="Tout">Tout Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.nameHt}>
                  {c.nameHt}
                </option>
              ))}
            </select>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Machandiz</th>
                  <th className="py-3 px-3">Vandè</th>
                  <th className="py-3 px-3">Pri</th>
                  <th className="py-3 px-3">Estòk</th>
                  <th className="py-3 px-3">Estati</th>
                  <th className="py-3 px-3 text-right">Aksyon Pwopriyetè</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{product.title}</p>
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{product.sellerName}</p>
                      <p className="text-[11px] text-slate-500">{product.sellerLocation}</p>
                      <p className="text-[10px] text-slate-400">{product.sellerPhone}</p>
                    </td>

                    <td className="py-3 px-3 font-bold text-red-600 font-['Outfit'] whitespace-nowrap">
                      {product.price.toLocaleString()} HTG
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          product.quantity <= 3 ? 'text-red-600' : 'text-slate-700'
                        }`}
                      >
                        {product.quantity} inite
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {product.status === 'published' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} />
                          <span>Pibliye</span>
                        </span>
                      )}
                      {product.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <AlertTriangle size={12} />
                          <span>An tann</span>
                        </span>
                      )}
                      {product.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                          <XCircle size={12} />
                          <span>Refize</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingProduct(product)}
                          title="Modifye machandiz la"
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>

                        {product.status === 'pending' && (
                          <button
                            onClick={() => validateProduct(product.id, 'published')}
                            title="Valide epi Pibliye"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}

                        {/* Button: Siprime Pòs Vandè a Fè */}
                        <button
                          onClick={() => {
                            setConfirmDeleteModal({
                              isOpen: true,
                              type: 'product',
                              id: product.id,
                              name: product.title,
                            });
                          }}
                          title="Siprime pòs sa a nèt sou sit la"
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: KONTWÒL VANDÈ & KLIYAN */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-['Outfit'] flex items-center gap-2">
                <Users className="text-indigo-600" size={18} />
                <span>Jesyon & Kontwòl Itilizatè Yo ({users.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ou ka efase kont vandè oswa kliyan, bloke yo si yo pa respekte règleman yo, oswa verifye yo.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserRoleFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  userRoleFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tout ({users.length})
              </button>
              <button
                onClick={() => setUserRoleFilter('seller')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  userRoleFilter === 'seller' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Vandè ({users.filter((u) => u.role === 'seller').length})
              </button>
              <button
                onClick={() => setUserRoleFilter('buyer')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  userRoleFilter === 'buyer' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Kliyan ({users.filter((u) => u.role === 'buyer').length})
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Chèche pa non, nimewo telefòn, imèl, zòn..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Itilizatè</th>
                  <th className="py-3 px-3">Wòl</th>
                  <th className="py-3 px-3">Kontak & Zòn</th>
                  <th className="py-3 px-3">Estati Kont</th>
                  <th className="py-3 px-3 text-right">Aksyon Pwopriyetè</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {user.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight flex items-center gap-1">
                            <span>{user.name}</span>
                            {user.isVerified && <ShieldCheck size={14} className="text-emerald-500" />}
                          </p>
                          {user.businessName && (
                            <p className="text-[11px] text-amber-700 font-medium">{user.businessName}</p>
                          )}
                          <p className="text-[10px] text-slate-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 capitalize font-semibold">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          user.role === 'seller'
                            ? 'bg-amber-100 text-amber-800'
                            : user.role === 'buyer'
                            ? 'bg-blue-100 text-blue-800'
                            : user.role === 'agent'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800">{user.phone}</p>
                      <p className="text-[11px] text-slate-500">{user.zone || 'Leyogàn'}</p>
                      <p className="text-[10px] text-slate-400">{user.email}</p>
                    </td>

                    <td className="py-3 px-3">
                      {user.isBanned ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <Ban size={12} />
                          <span>Kont Bloke</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} />
                          <span>Aktif</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Verify Badge button */}
                        {user.role === 'seller' && (
                          <button
                            onClick={() => toggleVerifyUser(user.id)}
                            title={user.isVerified ? 'Retire badj verifye' : 'Bay badj verifye'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              user.isVerified
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                            }`}
                          >
                            <ShieldCheck size={16} />
                          </button>
                        )}

                        {/* Ban / Unban Account */}
                        <button
                          onClick={() => toggleUserBan(user.id)}
                          title={user.isBanned ? 'Debloke kont sa a' : 'Bloke kont sa a'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            user.isBanned
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-amber-600 hover:bg-amber-50'
                          }`}
                        >
                          <Ban size={16} />
                        </button>

                        {/* Delete Account */}
                        <button
                          onClick={() => {
                            setConfirmDeleteModal({
                              isOpen: true,
                              type: 'user',
                              id: user.id,
                              name: user.name,
                            });
                          }}
                          title="Siprime kont sa a nèt"
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AKREDITE LIVRÈ YO ("se mwen pou ki bay akse ak livre yo") */}
      {activeSubTab === 'agents' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Crown className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-amber-950 text-sm font-['Outfit']">
                Règleman Sekirite Livrezon Mache Yogann
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                <strong>Se Pwopriyetè a sèlman ki gen dwa bay aksè ak livrè yo!</strong> Livrè ki pa apwouve pa w la p ap ka wè kòmand kliyan yo, li p ap ka pran koli nan men vandè yo, epi sistèm nan p ap asiyen l kòmand.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-['Outfit'] flex items-center gap-2">
                <Truck className="text-blue-600" size={18} />
                <span>Lis Livrè & Ajan Livrezon Yo ({deliveryAgents.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Bay aksè, revoke aksè, oswa anrejistre yon nouvo livrè ofisyèl.</p>
            </div>

            <button
              onClick={() => setIsAddAgentOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm cursor-pointer shadow-xs transition-colors"
            >
              <Plus size={16} />
              <span>Anrejistre Nouvo Livrè</span>
            </button>
          </div>

          {/* Delivery Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryAgents.map((agent) => (
              <div
                key={agent.id}
                className={`p-5 rounded-2xl border transition-all ${
                  agent.deliveryApproved
                    ? 'bg-white border-emerald-200 shadow-xs'
                    : 'bg-slate-50 border-slate-300 opacity-90'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                        agent.deliveryApproved ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                    >
                      <Truck size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                        <span>{agent.name}</span>
                        {agent.deliveryApproved && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                            Akredite
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">{agent.phone}</p>
                      <p className="text-[11px] text-slate-500">{agent.zone} · Leyogàn</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      agent.deliveryApproved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {agent.deliveryApproved ? 'Aksè Akòde ✅' : 'Poko gen aksè ⛔'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                  <p>
                    <span className="font-semibold">Motosiklèt:</span> {agent.vehicleType || 'Motosiklèt estanda'}
                  </p>
                  {agent.licensePlate && (
                    <p>
                      <span className="font-semibold">Plak:</span> {agent.licensePlate}
                    </p>
                  )}
                  {agent.exactAddress && (
                    <p>
                      <span className="font-semibold">Pwen baz:</span> {agent.exactAddress}
                    </p>
                  )}
                </div>

                {/* Owner Actions for Delivery Agent */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {agent.deliveryApproved ? (
                    <button
                      onClick={() => setDeliveryAgentAccess(agent.id, false)}
                      className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
                    >
                      Revoke Aksè Livrè a
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeliveryAgentAccess(agent.id, true)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Bay Aksè & Apwouve Livrè a
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setConfirmDeleteModal({
                        isOpen: true,
                        type: 'user',
                        id: agent.id,
                        name: agent.name,
                      });
                    }}
                    title="Efase livrè a"
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PEMAN & FINANS */}
      {activeSubTab === 'finances' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base font-['Outfit'] flex items-center gap-2">
              <DollarSign className="text-emerald-600" size={18} />
              <span>Verifikasyon Peman & Finans Sit la</span>
            </h3>
            <p className="text-xs text-slate-500">Valide transfè MonCash/NatCash kliyan yo epi swiv komisyon ou.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">Total Kòmand</p>
              <p className="text-2xl font-black text-slate-900 font-['Outfit']">{orders.length}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <p className="text-xs text-emerald-800 font-medium">Volim Vant Total</p>
              <p className="text-2xl font-black text-emerald-700 font-['Outfit']">{totalRevenue.toLocaleString()} HTG</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <p className="text-xs text-amber-800 font-medium">Komisyon Sit la ({siteSettings.commissionPercent}%)</p>
              <p className="text-2xl font-black text-amber-700 font-['Outfit']">{totalCommission.toLocaleString()} HTG</p>
            </div>
          </div>

          {/* Orders list with Payment Verification & Courier Assignment */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Kòmand ID</th>
                  <th className="py-3 px-3">Kliyan</th>
                  <th className="py-3 px-3">Montan</th>
                  <th className="py-3 px-3">Metòd & Ref</th>
                  <th className="py-3 px-3">Estati Lifecycle</th>
                  <th className="py-3 px-3">Livrè Motosiklèt</th>
                  <th className="py-3 px-3 text-right">Aksyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const availableAgents = users.filter((u) => u.role === 'agent' || u.isDeliveryAgent);
                  const isPendingPayment =
                    order.paymentStatus === 'pending' ||
                    order.status === 'PAYMENT_PENDING' ||
                    order.status === 'PAYMENT_VERIFICATION' ||
                    order.status === 'ORDER_CREATED';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900 block">{order.id}</span>
                        <button
                          onClick={() => {
                            setTrackingOrderId(order.id);
                            setActiveTab('tracking');
                          }}
                          className="text-[10px] text-red-600 hover:underline font-semibold cursor-pointer"
                        >
                          Swiv kòmand
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-800">{order.buyerName}</p>
                        <p className="text-[11px] text-slate-500">{order.buyerPhone}</p>
                        <p className="text-[10px] text-slate-400">{order.buyerZone}</p>
                      </td>

                      <td className="py-3 px-3 font-bold text-slate-900 font-['Outfit']">
                        {(order.total || order.totalAmount || 0).toLocaleString()} HTG
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold uppercase text-slate-700">{order.paymentMethod}</span>
                        <p className="font-mono text-[11px] text-red-600 font-bold">
                          {order.paymentRef || order.paymentReference || 'N/A'}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block uppercase ${
                            order.status === 'DELIVERED' || order.status === 'completed' || order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'CANCELLED' || order.status === 'PAYMENT_FAILED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {order.assignedAgentName ? (
                          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded-lg block w-max">
                            {order.assignedAgentName}
                          </span>
                        ) : (
                          <select
                            onChange={(e) => {
                              const selected = availableAgents.find((a) => a.id === e.target.value);
                              if (selected) {
                                assignCourierBackend(order.id, selected.id, selected.name, selected.phone);
                              }
                            }}
                            defaultValue=""
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
                          >
                            <option value="" disabled>
                              Asiyen Livrè...
                            </option>
                            {availableAgents.map((ag) => (
                              <option key={ag.id} value={ag.id}>
                                {ag.name} ({ag.phone})
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right space-y-1">
                        <div className="flex items-center justify-end gap-1">
                          {isPendingPayment && (
                            <>
                              <button
                                onClick={async () => {
                                  await confirmPaymentBackend(order.id);
                                  refreshOrders();
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-2xs"
                              >
                                Valide Peman
                              </button>
                              <button
                                onClick={() => rejectPayment(order.id)}
                                className="px-2 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg hover:bg-rose-100 cursor-pointer"
                              >
                                Rejte
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => viewBonDeLivraison(order)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
                            title="Gade Bon de Livraison PDF"
                          >
                            BDL
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: MESAJ KLIYAN & ESKALASYON AI */}
      {activeSubTab === 'inquiries' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 font-['Outfit']">
                <MessageSquare className="text-amber-600" size={20} />
                <span>Mesaj & Demann Kliyan (Eskalasyon Chatbot AI)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Lè asistan AI a bloke oswa kliyan an mande pou l pale ak mèt sit la, tout demann yo rive dirèkteman isit la pou w ka reponn yo pa WhatsApp oswa telefòn.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <span>{newInquiriesCount} Nouvo demann</span>
              </span>
              <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                {inquiries.length} Total
              </span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                placeholder="Chèche pa non, telefòn oswa kesyon..."
                className="w-full pl-9 pr-4 py-2 bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setInquiryFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  inquiryFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tout ({inquiries.length})
              </button>
              <button
                onClick={() => setInquiryFilter('new')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  inquiryFilter === 'new'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nouvo ({newInquiriesCount})
              </button>
              <button
                onClick={() => setInquiryFilter('responded')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  inquiryFilter === 'responded'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reponn ({inquiries.filter((i) => i.status === 'responded').length})
              </button>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="space-y-3">
            {inquiries
              .filter((inq) => {
                if (inquiryFilter === 'new' && inq.status !== 'new') return false;
                if (inquiryFilter === 'responded' && inq.status !== 'responded') return false;
                if (inquirySearch) {
                  const s = inquirySearch.toLowerCase();
                  return (
                    inq.customerName.toLowerCase().includes(s) ||
                    inq.customerPhone.toLowerCase().includes(s) ||
                    inq.message.toLowerCase().includes(s) ||
                    (inq.subject && inq.subject.toLowerCase().includes(s))
                  );
                }
                return true;
              })
              .map((inq) => {
                const cleanCustPhone = inq.customerPhone.replace(/[^0-9]/g, '');
                const whatsappReplyUrl = `https://wa.me/${cleanCustPhone}?text=${encodeURIComponent(
                  `Bonjou ${inq.customerName}, mwen se ${siteSettings.ownerName} (Pwopriyetè Mache Yogann). Mwen resevwa mesaj ou te voye a: "${inq.message}". Kijan mwen ka ede w jodi a?`
                )}`;

                return (
                  <div
                    key={inq.id}
                    className={`bg-white rounded-2xl p-5 border transition-all ${
                      inq.status === 'new'
                        ? 'border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                        : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            inq.status === 'new'
                              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {inq.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm font-['Outfit']">
                              {inq.customerName}
                            </h4>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                inq.status === 'new'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {inq.status === 'new' ? 'Nouvo Demann' : 'Reponn'}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                              {inq.source === 'chatbot' ? '🤖 Chatbot AI' : '📩 Dirèk'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Telefòn: <strong className="text-slate-700">{inq.customerPhone || 'Pa presize'}</strong> · {new Date(inq.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {inq.customerPhone && (
                          <>
                            <a
                              href={whatsappReplyUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => updateInquiryStatus(inq.id, 'responded')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                            >
                              <MessageSquare size={14} />
                              <span>Reponn sou WhatsApp</span>
                              <ExternalLink size={11} />
                            </a>

                            <a
                              href={`tel:${inq.customerPhone.replace(/\s+/g, '')}`}
                              onClick={() => updateInquiryStatus(inq.id, 'responded')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                            >
                              <Phone size={14} />
                              <span>Rele</span>
                            </a>
                          </>
                        )}

                        <button
                          onClick={() =>
                            updateInquiryStatus(
                              inq.id,
                              inq.status === 'new' ? 'responded' : 'new'
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            inq.status === 'new'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                          }`}
                        >
                          {inq.status === 'new' ? 'Mete kòm Reponn' : 'Mete kòm Nouvo'}
                        </button>

                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Efase mesaj sa a"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Inquiry Content */}
                    <div className="mt-3 bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
                      {inq.subject && (
                        <p className="text-xs font-bold text-slate-800 mb-1">
                          Sijè: {inq.subject}
                        </p>
                      )}
                      <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                        "{inq.message}"
                      </p>
                    </div>
                  </div>
                );
              })}

            {inquiries.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <MessageSquare size={28} />
                </div>
                <h4 className="font-bold text-slate-800 text-base font-['Outfit']">
                  Pa gen okenn demann kliyan pou kounye a
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Lè yon kliyan poze yon kesyon chatbot AI a pa konnen oswa si li mande pou l konekte ak Pwopriyetè a, mesaj la ap parèt isit la otomatikman.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: SERVICES NUMÉRIQUES (EXCLUSIF PROPRIÉTAIRE / SUPER ADMIN) */}
      {activeSubTab === 'digital' && (
        <DigitalServicesManager />
      )}

      {/* MODAL: POSTE NOUVO MACHINDIZ OFISYÈL */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base font-['Outfit'] flex items-center gap-2">
                <Plus className="text-red-600" size={18} />
                <span>Poste yon Nouvo Machandiz Ofisyèl</span>
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tit Machandiz la</label>
                <input
                  type="text"
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  placeholder="egz: Sak Diri Shella 25 Lbs"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={newProductForm.category}
                  onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.nameHt}>
                      {c.nameHt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pri Vant (HTG)</label>
                  <input
                    type="number"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kantite nan Estòk</label>
                  <input
                    type="number"
                    value={newProductForm.quantity}
                    onChange={(e) => setNewProductForm({ ...newProductForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Imaj (Upload oswa URL)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const r = new FileReader();
                      r.onloadend = () => {
                        setNewProductForm({ ...newProductForm, image: r.result as string });
                      };
                      r.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-slate-500 mb-1"
                />
                <input
                  type="text"
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  placeholder="URL Imaj"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsyon</label>
                <textarea
                  rows={3}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Anile
              </button>
              <button
                onClick={() => {
                  if (!newProductForm.title) {
                    showNotification('Mete yon tit pou machandiz la.', 'error');
                    return;
                  }
                  addProduct({
                    sellerId: currentUser?.id || 'owner_1',
                    sellerName: siteSettings.siteName,
                    sellerPhone: siteSettings.contactPhone,
                    sellerLocation: newProductForm.sellerLocation,
                    title: newProductForm.title,
                    description: newProductForm.description,
                    category: newProductForm.category,
                    price: newProductForm.price,
                    originalPrice: newProductForm.originalPrice,
                    quantity: newProductForm.quantity,
                    image: newProductForm.image,
                  });
                  setIsAddProductModalOpen(false);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Pibliye Machandiz la
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base font-['Outfit'] flex items-center gap-2">
                <Edit className="text-amber-600" size={18} />
                <span>Modifye Machandiz: {editingProduct.title}</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tit</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pri (HTG)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kantite nan Estòk</label>
                  <input
                    type="number"
                    value={editingProduct.quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsyon</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Anile
              </button>
              <button
                onClick={() => {
                  updateProduct(editingProduct);
                  setEditingProduct(null);
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Sove Modifikasyon yo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ANREJISTRE NOUVO LIVRÈ */}
      {isAddAgentOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base font-['Outfit'] flex items-center gap-2">
                <Truck className="text-blue-600" size={18} />
                <span>Anrejistre & Akredite yon Livrè</span>
              </h3>
              <button onClick={() => setIsAddAgentOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Non Konplè Livrè a</label>
                <input
                  type="text"
                  value={newAgentForm.name}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, name: e.target.value })}
                  placeholder="egz: Jean Ronald Pierre"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nimewo Telefòn</label>
                <input
                  type="text"
                  value={newAgentForm.phone}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, phone: e.target.value })}
                  placeholder="+509 36 ..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Zòn Kouvèti nan Leyogàn</label>
                <input
                  type="text"
                  value={newAgentForm.zone}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, zone: e.target.value })}
                  placeholder="egz: Bergeau, Dufort, Ti Rivyè"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kalite Motosiklèt</label>
                  <input
                    type="text"
                    value={newAgentForm.vehicleType}
                    onChange={(e) => setNewAgentForm({ ...newAgentForm, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plak Imatrikilasyon</label>
                  <input
                    type="text"
                    value={newAgentForm.licensePlate}
                    onChange={(e) => setNewAgentForm({ ...newAgentForm, licensePlate: e.target.value })}
                    placeholder="BB-0000"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddAgentOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Anile
              </button>
              <button
                onClick={() => {
                  if (!newAgentForm.name || !newAgentForm.phone) {
                    showNotification('Mete non ak telefòn livrè a.', 'error');
                    return;
                  }
                  addDeliveryAgent(newAgentForm);
                  setIsAddAgentOpen(false);
                  setNewAgentForm({
                    name: '',
                    phone: '',
                    zone: 'Sant Vil Leyogàn',
                    vehicleType: 'Motosiklèt Haojue 125',
                    licensePlate: '',
                  });
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Akredite & Bay Aksè
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDeleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={26} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
                {confirmDeleteModal.type === 'product' ? 'Siprime Pòs Machandiz la?' : 'Siprime Kont Itilizatè a?'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Èske ou sèten ou vle efase <strong>"{confirmDeleteModal.name}"</strong>? Aksyon sa a pa ka defèt.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteModal({ isOpen: false, type: 'product', id: '', name: '' })}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Anile
              </button>
              <button
                onClick={() => {
                  if (confirmDeleteModal.type === 'product') {
                    deleteProduct(confirmDeleteModal.id);
                  } else {
                    deleteUser(confirmDeleteModal.id);
                  }
                  setConfirmDeleteModal({ isOpen: false, type: 'product', id: '', name: '' });
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Konfime Sipresyon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
