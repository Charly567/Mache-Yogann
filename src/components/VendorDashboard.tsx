import React, { useState } from 'react';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  PackageCheck,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Upload,
  X,
  MessageSquare,
  ExternalLink,
  Phone,
  Truck,
  Bell,
  BookOpen,
  Download,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';
import { SignaturePad } from './SignaturePad';

export const VendorDashboard: React.FC = () => {
  const {
    language,
    currentUser,
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    setIsTermsModalOpen,
    categories,
    updateUserLocation,
    markOrderReadyBackend,
    sellerHandoverBackend,
    viewBonDeLivraison,
    refreshOrders,
  } = useApp();

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [signingOrder, setSigningOrder] = useState<Order | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Maket');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [freeShipping, setFreeShipping] = useState(false);

  // Book Specifics State
  const [author, setAuthor] = useState('');
  const [bookFormat, setBookFormat] = useState<'physical' | 'pdf'>('physical');
  const [pageCount, setPageCount] = useState<number | ''>('');
  const [fileSize, setFileSize] = useState('');
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState('');

  // Address edit state for vendor
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempZone, setTempZone] = useState(currentUser?.zone || 'Bergeau');
  const [tempAddress, setTempAddress] = useState(currentUser?.exactAddress || '');
  const [tempCommune, setTempCommune] = useState(currentUser?.commune || 'Leyogàn');

  // Resolved pickup location from user's account profile (Never re-typed per product)
  const autoPickupLocation = currentUser?.exactAddress
    ? `${currentUser.exactAddress}, ${currentUser.zone}, ${currentUser.commune || 'Leyogàn'}`
    : currentUser?.zone
    ? `${currentUser.zone}, ${currentUser.commune || 'Leyogàn'}`
    : 'Ti Rivyè, Leyogàn';

  // Vendor's specific products
  const vendorProducts = products.filter(
    (p) => p.sellerId === currentUser?.id || currentUser?.role === 'seller' || p.sellerName === 'Jak Pierre'
  );

  // Vendor's specific orders
  const vendorOrders = orders.filter((o) =>
    o.items.some((i) => i.sellerId === currentUser?.id || i.sellerName === 'Jak Pierre' || currentUser?.role === 'seller')
  );

  // Financial calculations
  const totalSales = vendorOrders.reduce((acc, o) => acc + o.subtotal, 0);
  const totalCommission = Math.round(totalSales * 0.10);
  const netPayout = totalSales - totalCommission;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('Maket');
    setPrice('');
    setOriginalPrice('');
    setQuantity(1);
    setDescription('');
    setImageUrl('');
    setFreeShipping(false);
    setAuthor('');
    setBookFormat('physical');
    setPageCount('');
    setFileSize('');
    setPdfDownloadUrl('');
    setIsAddingProduct(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || '');
    setQuantity(p.quantity);
    setDescription(p.description);
    setImageUrl(p.image);
    setFreeShipping(!!p.freeShipping);
    setAuthor(p.author || '');
    setBookFormat(p.bookFormat || (p.category === 'LivPDF' ? 'pdf' : 'physical'));
    setPageCount(p.pageCount || '');
    setFileSize(p.fileSize || '');
    setPdfDownloadUrl(p.pdfDownloadUrl || '');
    setIsAddingProduct(true);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    if (newCat === 'LivPDF') {
      setBookFormat('pdf');
      if (quantity === 1) setQuantity(999);
    } else if (newCat === 'LivFizik') {
      setBookFormat('physical');
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserLocation(tempZone, tempAddress, tempCommune);
    setIsEditingAddress(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const defaultImages: Record<string, string> = {
      Maket: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=700&q=80',
      Fason: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80',
      Telefon: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80',
      Teknoloji: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=700&q=80',
      Bote: 'https://images.unsplash.com/photo-1608248597359-251e604fef5d?auto=format&fit=crop&w=700&q=80',
      Kay: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=700&q=80',
      Agrikilti: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80',
      LivFizik: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
      LivPDF: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=700&q=80',
      Pwomosyon: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80',
    };

    const isBook = category === 'LivFizik' || category === 'LivPDF';
    const finalImage = imageUrl.trim() || defaultImages[category] || defaultImages.Maket;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        title,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        quantity: Number(quantity) || 1,
        description,
        sellerLocation: autoPickupLocation, // Always strictly bound to seller's registered account location
        image: finalImage,
        freeShipping,
        bookFormat: isBook ? bookFormat : undefined,
        author: isBook && author.trim() ? author.trim() : undefined,
        pageCount: isBook && pageCount ? Number(pageCount) : undefined,
        fileSize: isBook && bookFormat === 'pdf' && fileSize.trim() ? fileSize.trim() : undefined,
        pdfDownloadUrl: isBook && bookFormat === 'pdf' && pdfDownloadUrl.trim() ? pdfDownloadUrl.trim() : undefined,
      });
    } else {
      addProduct({
        sellerId: currentUser?.id || 'user_seller_1',
        sellerName: currentUser?.name || 'Jak Pierre',
        sellerBusiness: currentUser?.businessName || 'Atelye & Boutik Pierre Leyogàn',
        sellerPhone: currentUser?.phone || '+509 34 55 67 89',
        sellerLocation: autoPickupLocation, // Automatically filled from user profile
        title,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        quantity: Number(quantity) || 1,
        description,
        image: finalImage,
        freeShipping,
        bookFormat: isBook ? bookFormat : undefined,
        author: isBook && author.trim() ? author.trim() : undefined,
        pageCount: isBook && pageCount ? Number(pageCount) : undefined,
        fileSize: isBook && bookFormat === 'pdf' && fileSize.trim() ? fileSize.trim() : undefined,
        pdfDownloadUrl: isBook && bookFormat === 'pdf' && pdfDownloadUrl.trim() ? pdfDownloadUrl.trim() : undefined,
      });
    }

    setIsAddingProduct(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with Seller Info & Terms Button */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-semibold text-amber-200">
            <Store size={14} />
            <span>{language === 'ht' ? 'Espas Vandè Mache Yogann' : 'Espace Vendeur'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit']">
            {currentUser?.businessName || currentUser?.name || 'Boutik Vandè Leyogàn'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-amber-100">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-amber-300" />
              <span className="font-semibold">{language === 'ht' ? 'Adrès Rekipirasyon Livrè:' : 'Lieu de Récupération:'}</span>
              <span className="bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/40">{autoPickupLocation}</span>
            </span>
            <button
              onClick={() => {
                setTempZone(currentUser?.zone || 'Bergeau');
                setTempAddress(currentUser?.exactAddress || '');
                setTempCommune(currentUser?.commune || 'Leyogàn');
                setIsEditingAddress(true);
              }}
              className="text-[11px] font-bold text-amber-200 hover:text-white underline cursor-pointer"
            >
              {language === 'ht' ? 'Modifye adrès sa a' : 'Modifier'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsTermsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xs sm:text-sm font-bold backdrop-blur transition-colors cursor-pointer"
          >
            <FileText size={16} />
            <span>{language === 'ht' ? '📄 Gid & Kondisyon Vandè' : '📄 Guide & Conditions'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-amber-50 text-amber-900 rounded-xl text-xs sm:text-sm font-black shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Plus size={18} />
            <span>{language === 'ht' ? '+ Poste yon Pwodwi' : '+ Publier un Produit'}</span>
          </button>
        </div>
      </div>

      {/* Live Order Notification Banner for the Vendor */}
      {vendorOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-amber-600 text-white shadow-lg flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="animate-bounce" size={20} />
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base">
                {language === 'ht'
                  ? `🔔 Ou gen ${vendorOrders.length} kòmand resevwa sou Mache Yogann!`
                  : `🔔 Vous avez ${vendorOrders.length} commande(s) reçue(s) sur Mache Yogann !`}
              </p>
              <p className="text-xs text-red-100">
                {language === 'ht'
                  ? 'Klyan yo fin voye kòb la (MonCash: +509 47703814 / NatCash: +509 35100438). Prepare pake yo pou ajan motosiklèt la.'
                  : 'Paiements reçus via MonCash ou NatCash. Préparez les colis pour le coursier.'}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/50947703814"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-white text-red-700 hover:bg-red-50 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
          >
            <MessageSquare size={14} />
            <span>{language === 'ht' ? 'WhatsApp Mache Yogann (+509 47703814)' : 'WhatsApp Support'}</span>
          </a>
        </motion.div>
      )}

      {/* Financial Metrics Cards (Commission 10% clearly visualized) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'ht' ? 'Total Vant' : 'Ventes Totales'}
          </span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
            {totalSales.toLocaleString()} <span className="text-xs font-bold text-slate-500">HTG</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {vendorOrders.length} {language === 'ht' ? 'kòmand anrejistre' : 'commandes enregistrées'}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
        >
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider block">
            {language === 'ht' ? 'Komisyon Mache Yogann (10%)' : 'Commission (10%)'}
          </span>
          <p className="text-xl sm:text-2xl font-black text-red-600 font-['Outfit'] mt-1">
            {totalCommission.toLocaleString()} <span className="text-xs font-bold text-slate-500">HTG</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {language === 'ht' ? 'Frè sèvis ak livrezon' : 'Frais de plateforme'}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-xs bg-emerald-50/30 hover:shadow-md transition-shadow"
        >
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            {language === 'ht' ? 'Lajan Ou Resevwa (90%)' : 'Montant Net Vendeur'}
          </span>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 font-['Outfit'] mt-1">
            {netPayout.toLocaleString()} <span className="text-xs font-bold text-emerald-900">HTG</span>
          </p>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            {language === 'ht' ? 'Peman dirèk apre rekipirasyon' : 'Paiement net garanti'}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'ht' ? 'Pwodwi Ou Yo' : 'Produits en Ligne'}
          </span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
            {vendorProducts.length}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {vendorProducts.filter((p) => p.status === 'published').length} {language === 'ht' ? 'pibliye sou sit la' : 'publiés'}
          </span>
        </motion.div>
      </div>

      {/* Product Creation / Edit Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                {editingProduct
                  ? (language === 'ht' ? 'Modifye Pwodwi' : 'Modifier le Produit')
                  : (language === 'ht' ? 'Poste yon Nouvo Pwodwi' : 'Publier un Nouveau Produit')}
              </h3>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ht' ? 'Non Pwodwi a *' : 'Nom du produit *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Panye Mango Fransik oswa Dous Makòs"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ht' ? 'Kategori *' : 'Catégorie *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-xs sm:text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {language === 'ht' ? c.nameHt : c.nameFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {category === 'LivPDF'
                      ? (language === 'ht' ? 'Aksè Dijital (Illimité)' : 'Licences / Accès')
                      : (language === 'ht' ? 'Kantite Disponib *' : 'Stock disponible *')}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={category === 'LivPDF'}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none ${category === 'LivPDF' ? 'opacity-70 bg-slate-100 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              {/* Book Specifics (Fòma Liv Fizik oswa PDF) */}
              {(category === 'LivFizik' || category === 'LivPDF') && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <BookOpen size={16} className="text-amber-700" />
                      <span>{language === 'ht' ? 'Enfòmasyon Espesyal sou Liv la' : 'Détails spécifiques du Livre'}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      {category === 'LivPDF' ? '📄 Dijital PDF' : '📚 Liv Papye Fizik'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ht' ? 'Otè / Ekriven *' : 'Auteur / Écrivain *'}
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Ex: Jacques Roumain, Dany Laferrière..."
                        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ht' ? 'Fòma Liv la' : 'Format du livre'}
                      </label>
                      <select
                        value={bookFormat}
                        onChange={(e) => setBookFormat(e.target.value as 'physical' | 'pdf')}
                        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs focus:outline-none"
                      >
                        <option value="physical">📚 Liv Fizik (Papye / Kouvèti)</option>
                        <option value="pdf">📄 Dokiman / Ebook PDF Dijital</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ht' ? 'Nonb de Paj' : 'Nombre de pages'}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={pageCount}
                        onChange={(e) => setPageCount(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Ex: 180"
                        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    {bookFormat === 'pdf' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ht' ? 'Gwosè Fichye PDF' : 'Taille du fichier PDF'}
                        </label>
                        <input
                          type="text"
                          value={fileSize}
                          onChange={(e) => setFileSize(e.target.value)}
                          placeholder="Ex: 4.8 MB"
                          className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {bookFormat === 'pdf' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ht' ? 'Lyen Telechajman PDF (Ebook)' : 'Lien de téléchargement PDF'}
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={pdfDownloadUrl}
                          onChange={(e) => setPdfDownloadUrl(e.target.value)}
                          placeholder="https://... oswa lyen Google Drive / Dropbox PDF"
                          className="w-full pl-8 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs focus:outline-none"
                        />
                        <Download size={14} className="absolute left-2.5 top-2.5 text-amber-700" />
                      </div>
                      <p className="text-[11px] text-amber-800 mt-1 font-medium">
                        {language === 'ht'
                          ? '⚡ Livrezon Imedya: Achtè a ap resevwa fichye sa a otomatikman apre peman MonCash/NatCash/Kripto fin valide.'
                          : '⚡ Livraison immédiate : l\'acheteur reçoit le fichier dès validation du paiement.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ht' ? 'Deskripsyon Pwodwi a' : 'Description du produit'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Dekri kalite a, kijan l fèt, kijan pou moun itilize l..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  id="freeShipCheck"
                  checked={freeShipping}
                  onChange={(e) => setFreeShipping(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                />
                <label htmlFor="freeShipCheck" className="text-xs text-amber-900 font-semibold cursor-pointer">
                  {language === 'ht' ? 'Ofri livrezon gratis pou pwodwi sa a' : 'Livraison gratuite offerte'}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  {language === 'ht' ? 'Anile' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingProduct
                    ? (language === 'ht' ? 'Anrejistre Chanjman' : 'Mettre à jour')
                    : (language === 'ht' ? 'Poste Pwodwi a' : 'Publier')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Products Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
            {language === 'ht' ? 'Pwodwi Ou Afiche Yo' : 'Mes Produits'} ({vendorProducts.length})
          </h2>
          <button
            onClick={handleOpenAdd}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
          >
            {language === 'ht' ? '+ Ajoute yon lòt' : '+ Ajouter'}
          </button>
        </div>

        {vendorProducts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <p className="text-xs">{language === 'ht' ? 'Ou poko poste okenn pwodwi.' : 'Aucun produit publié pour l\'instant.'}</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
            >
              {language === 'ht' ? 'Poste premye pwodwi w' : 'Publier mon premier produit'}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {vendorProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-[240px]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{p.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      {p.category} · {p.quantity} {language === 'ht' ? 'disponib' : 'en stock'}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.status === 'published' ? 'Pibliye' : p.status === 'pending' ? 'An tann' : 'Refize'}
                    </span>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap">
                  <span className="font-black text-slate-900 text-sm">{p.price.toLocaleString()} HTG</span>
                  {p.originalPrice && (
                    <span className="block text-[11px] text-slate-400 line-through">
                      {p.originalPrice.toLocaleString()} HTG
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    title="Modifye"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(language === 'ht' ? 'Ou sèten ou vle efase pwodwi sa a?' : 'Supprimer ce produit ?')) {
                        deleteProduct(p.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                    title="Efase"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Received for this Vendor */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
          {language === 'ht' ? 'Kòmand Resevwa Pou Pwodwi Ou Yo' : 'Commandes Reçues'} ({vendorOrders.length})
        </h2>

        {vendorOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {language === 'ht' ? 'Poko gen okenn kòmand pou machandiz ou yo.' : 'Aucune commande reçue pour le moment.'}
          </p>
        ) : (
          <div className="space-y-4">
            {vendorOrders.map((o) => (
              <div key={o.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 shadow-xs">
                {/* Order Top Bar */}
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-200 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-red-600">{o.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {o.status === 'out_for_delivery'
                          ? 'Ajan an sou wout'
                          : o.status === 'completed'
                          ? 'Livre & Fini'
                          : o.status === 'payment_pending'
                          ? 'Peman ap verifye'
                          : o.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      Achtè: <strong className="text-slate-900">{o.buyerName}</strong> · Telefòn: <span className="font-mono font-bold text-slate-800">{o.buyerPhone}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Livrezon nan Leyogàn: <strong>{o.buyerZone}</strong>, {o.buyerAddress || 'Sant Vil'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-slate-900 text-base sm:text-lg">
                      {o.subtotal.toLocaleString()} HTG
                    </span>
                    <p className="text-xs text-emerald-700 font-black">
                      Peman Nèt Vandè (90%): {(o.subtotal * 0.9).toLocaleString()} HTG
                    </p>
                    <span className="text-[10px] text-slate-400">
                      (Komisyon Mache Yogann 10%: {(o.subtotal * 0.1).toLocaleString()} HTG)
                    </span>
                  </div>
                </div>

                {/* Items Purchased in this Order */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    {language === 'ht' ? 'Atik Kliyan an Achte:' : 'Articles Commandés :'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {o.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">{item.productTitle}</p>
                          <p className="text-[11px] text-slate-500">
                            {item.quantity} x {item.price.toLocaleString()} HTG = <strong className="text-slate-900">{(item.quantity * item.price).toLocaleString()} HTG</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar: Payment Platform, Actions & WhatsApp Direct Contact */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-slate-600">
                    <span className="text-[11px]">
                      Platfòm: <strong className="uppercase text-slate-900">{o.paymentMethod}</strong>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[11px]">
                      Ref: <strong className="font-mono text-red-600">{o.paymentRef}</strong>
                    </span>
                    {o.sellerSignature ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>Remiz Siyen pa Vandè</span>
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Action 1: Mark ready for pickup */}
                    {(o.status === 'PAYMENT_CONFIRMED' || o.status === 'payment_confirmed') && (
                      <button
                        onClick={async () => {
                          await markOrderReadyBackend(o.id);
                          refreshOrders();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <PackageCheck size={13} />
                        <span>Mete Pare pou Livrè</span>
                      </button>
                    )}

                    {/* Action 2: Seller Handover Signature */}
                    {!o.sellerSignature &&
                      (o.status === 'READY_FOR_PICKUP' ||
                        o.status === 'COURIER_ASSIGNED' ||
                        o.status === 'PICKUP_PENDING' ||
                        o.status === 'pickup_pending' ||
                        o.status === 'agent_assigned') && (
                        <button
                          onClick={() => setSigningOrder(o)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        >
                          <FileText size={13} />
                          <span>Siyen Remèt bay Livrè</span>
                        </button>
                      )}

                    {/* Action 3: View Bon de Livraison */}
                    <button
                      onClick={() => viewBonDeLivraison(o)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <FileText size={12} />
                      <span>Bon de Livraison</span>
                    </button>

                    <a
                      href={`https://wa.me/${o.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Bonjou ${o.buyerName}, mwen se vandè pwodwi w te kòmande sou Mache Yogann nan (${o.id}). Pake w la ap prepare kounye a!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <MessageSquare size={12} />
                      <span>WhatsApp Achtè</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Edit Modal for Vendor */}
      <AnimatePresence>
        {isEditingAddress && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit']">
                  <MapPin size={18} className="text-red-600" />
                  <span>{language === 'ht' ? 'Modifye Adrès Rekipirasyon w' : 'Modifier votre adresse de récupération'}</span>
                </div>
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                {language === 'ht'
                  ? 'Adrès sa a ap sèvi otomatikman pou tout machandiz ou poste sou Mache Yogann pou livrè nou yo ka pase pran yo fasil.'
                  : 'Cette adresse est utilisée automatiquement pour la collecte de tous vos produits par nos agents.'}
              </p>

              <form onSubmit={handleSaveAddress} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ht' ? 'Komin' : 'Commune'}
                    </label>
                    <input
                      type="text"
                      required
                      value={tempCommune}
                      onChange={(e) => setTempCommune(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ht' ? 'Zòn nan Leyogàn' : 'Zone'}
                    </label>
                    <input
                      type="text"
                      required
                      value={tempZone}
                      onChange={(e) => setTempZone(e.target.value)}
                      placeholder="Ti Rivyè, Bergeau..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ht' ? 'Adrès Egzak / Repè Boutik oswa Atelye w *' : 'Adresse exacte / Repère *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                    placeholder="Egz: Ri Prensipal Ti Rivyè, toupre estasyon an, #8"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-red-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    {language === 'ht' ? 'Anile' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    {language === 'ht' ? 'Anrejistre Adrès la' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signature Pad Modal for Seller Handover to Courier */}
      {signingOrder && (
        <SignaturePad
          title={language === 'ht' ? 'Siyati Vandè: Remèt Pake a bay Livrè' : 'Signature Vendeur: Remise au coursier'}
          signerName={currentUser?.name || 'Vandè'}
          signerRole="seller"
          onSave={async (signatureDataUri) => {
            await sellerHandoverBackend(signingOrder.id, signatureDataUri);
            setSigningOrder(null);
            refreshOrders();
          }}
          onCancel={() => setSigningOrder(null)}
        />
      )}
    </div>
  );
};
