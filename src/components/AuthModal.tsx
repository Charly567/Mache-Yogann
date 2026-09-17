import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Phone,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Store,
  Truck,
  ShoppingBag,
  Mail,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Info,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { DEMO_USERS } from '../data/seedData';

export const AuthModal: React.FC = () => {
  const {
    language,
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    register,
    switchDemoUser,
    showNotification,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Fields
  const [name, setName] = useState('');
  const [gmail, setGmail] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [businessName, setBusinessName] = useState('');
  const [zone, setZone] = useState('Bergeau');
  const [commune, setCommune] = useState('Leyogàn');
  const [exactAddress, setExactAddress] = useState('');

  // 6-digit Verification State
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resending code
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(phone, password);
    if (res.success) {
      setIsAuthModalOpen(false);
      setPhone('');
      setPassword('');
    }
  };

  const handleInitiateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !gmail || !password) {
      showNotification(language === 'ht' ? 'Tanpri ranpli tout chan yo.' : 'Veuillez remplir tous les champs.', 'error');
      return;
    }

    // Validate email format
    const cleanEmail = gmail.trim().toLowerCase();
    if (!cleanEmail.includes('@') || cleanEmail.length < 5) {
      showNotification(language === 'ht' ? 'Tanpri antre yon adrès Gmail ki valid (egz: non@gmail.com).' : 'Veuillez entrer une adresse Gmail valide.', 'error');
      return;
    }

    // Generate a secure 6-digit verification code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(code);
    setResendCooldown(60);
    setMode('verify');
    showNotification(
      language === 'ht'
        ? `Kòd 6 chif la voye soti nan macheyogann@gmail.com pou ${cleanEmail}!`
        : `Code à 6 chiffres envoyé depuis macheyogann@gmail.com à ${cleanEmail}!`,
      'info'
    );
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.trim() !== generatedCode.trim()) {
      showNotification(
        language === 'ht'
          ? 'Kòd 6 chif la pa kòrèk. Tanpri tcheke mesaj Gmail ou a.'
          : 'Le code à 6 chiffres est incorrect. Vérifiez votre boîte Gmail.',
        'error'
      );
      return;
    }

    // Code verified! Register the user
    const res = register({
      name,
      phone,
      email: gmail.trim().toLowerCase(),
      password,
      role,
      department: 'Lwès (Ouest)',
      commune: commune || 'Leyogàn',
      zone: zone || 'Bergeau',
      exactAddress: exactAddress.trim() || undefined,
      businessName: role === 'seller' ? businessName : undefined,
    });

    if (res.success) {
      showNotification(
        language === 'ht'
          ? `Kont ou verifye avèk siksè sou ${gmail}! Byenveni sou Mache Yogann 🇭🇹`
          : `Compte vérifié avec succès sur ${gmail} ! Bienvenue sur Mache Yogann 🇭🇹`,
        'success'
      );
      setIsAuthModalOpen(false);
      setMode('login');
      setName('');
      setPhone('');
      setGmail('');
      setPassword('');
      setEnteredCode('');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResendCode = () => {
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(newCode);
    setResendCooldown(60);
    showNotification(
      language === 'ht'
        ? `Nouvo kòd voye soti nan macheyogann@gmail.com!`
        : `Nouveau code envoyé depuis macheyogann@gmail.com !`,
      'info'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              Y
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
                {mode === 'login' && (language === 'ht' ? 'Koneksyon Sekirize' : 'Connexion Sécurisée')}
                {mode === 'register' && (language === 'ht' ? 'Kreye yon Kont' : 'Créer un Compte')}
                {mode === 'verify' && (language === 'ht' ? 'Konfimasyon Gmail (6 Chif)' : 'Vérification Gmail (6 Chiffres)')}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Mache Yogann · Leyogàn 🇭🇹</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs (only visible when not in verify mode) */}
        {mode !== 'verify' && (
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 m-4 rounded-xl text-xs font-bold relative">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'ht' ? 'Konekte' : 'Connexion'}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'ht' ? 'Enskri' : 'Inscription'}
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="px-5 pb-6 space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ht' ? 'Telefòn oswa Adrès Gmail *' : 'Téléphone ou Gmail *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+509 47703814 oswa oumenm@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-600 transition-colors"
                    />
                    <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ht' ? 'Modpas *' : 'Mot de passe *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-600 transition-colors"
                    />
                    <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer transition-all"
                >
                  <ShieldCheck size={16} />
                  <span>{language === 'ht' ? 'Konekte ak Sekirite' : 'Se Connecter'}</span>
                </motion.button>

                {/* 1-Click Fast Role Demo Access - Only Buyer & Seller visible */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 mb-2 text-center uppercase tracking-wider">
                    {language === 'ht' ? '⚡ Koneksyon rapid kòm:' : '⚡ Connexion rapide démo :'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {DEMO_USERS.filter((u) => u.role === 'buyer' || u.role === 'seller').map((demo) => (
                      <button
                        key={demo.id}
                        type="button"
                        onClick={() => {
                          switchDemoUser(demo.role);
                          setIsAuthModalOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                          {demo.role === 'buyer' && <ShoppingBag size={14} className="text-blue-600 shrink-0" />}
                          {demo.role === 'seller' && <Store size={14} className="text-amber-600 shrink-0" />}
                          <span className="truncate">{demo.role === 'buyer' ? 'Kont Achtè' : 'Kont Vandè'}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium block truncate">
                          {demo.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.form>
            )}

            {mode === 'register' && (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleInitiateRegister}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ht' ? 'Non Konplè *' : 'Nom Complet *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Jean Baptiste"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-600"
                    />
                    <User size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                {/* GMAIL FIELD - Required for 6-digit confirmation */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {language === 'ht' ? 'Adrès Gmail Ou (Obligatwa) *' : 'Adresse Gmail (Requis) *'}
                    </label>
                    <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
                      <Mail size={10} />
                      <span>Kòd 6 chif ap voye la</span>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={gmail}
                      onChange={(e) => setGmail(e.target.value)}
                      placeholder="egzanp@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-600"
                    />
                    <Mail size={15} className="absolute left-3 top-2.5 text-red-500" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {language === 'ht'
                      ? 'N ap voye yon kòd konfimasyon 6 chif sou Gmail sa a soti nan macheyogann@gmail.com.'
                      : 'Un code de confirmation à 6 chiffres sera envoyé à cette adresse.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ht' ? 'Telefòn (WhatsApp) *' : 'Téléphone (WhatsApp) *'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+509 3xxx xxxx"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-600"
                    />
                    <Phone size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ht' ? 'Chwazi Tip Kont Ou *' : 'Type de compte *'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        role === 'buyer'
                          ? 'border-red-600 bg-red-50 text-red-900 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShoppingBag size={16} className="mx-auto mb-1 text-red-600" />
                      <span className="block font-bold">{language === 'ht' ? 'Kont Achtè' : 'Compte Acheteur'}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {language === 'ht' ? 'Pou achte & resevwa koli' : 'Pour passer vos commandes'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        role === 'seller'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Store size={16} className="mx-auto mb-1 text-amber-600" />
                      <span className="block font-bold">{language === 'ht' ? 'Kont Vandè' : 'Compte Vendeur'}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {language === 'ht' ? 'Pou vann sou Mache Yogann' : 'Pour vendre vos produits'}
                      </span>
                    </button>
                  </div>
                </div>

                {role === 'seller' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ht' ? 'Non Biznis oswa Atelye w la *' : 'Nom de votre Boutique *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ex: Boutik Pierre Leyogàn"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-600"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ht' ? 'Komin' : 'Commune'}
                    </label>
                    <input
                      type="text"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ht' ? 'Zòn nan Leyogàn' : 'Zone'}
                    </label>
                    <input
                      type="text"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      placeholder="Bergeau, Ca Ira..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Exact Pickup / Vendor Location */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {role === 'seller'
                        ? (language === 'ht' ? '📍 Adrès Egzak / Repè Boutik Ou (pou Livrè yo) *' : '📍 Adresse exacte / Repère de votre Boutique *')
                        : (language === 'ht' ? 'Adrès Egzak oswa Repè' : 'Adresse exacte ou Repère')}
                    </label>
                    {role === 'seller' && (
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                        {language === 'ht' ? 'Otomatik pou tout pwodwi' : 'Automatique pour vos produits'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required={role === 'seller'}
                      value={exactAddress}
                      onChange={(e) => setExactAddress(e.target.value)}
                      placeholder={
                        role === 'seller'
                          ? 'Egz: Ri Prensipal Ti Rivyè, toupre estasyon an, #8'
                          : 'Egz: Ri Gabon #14, pre Legliz Sent Woz'
                      }
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-red-600"
                    />
                    <MapPin size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                  {role === 'seller' && (
                    <p className="text-[10px] text-emerald-700 mt-1 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      {language === 'ht'
                        ? '✅ Gras ak adrès sa a, ou PAP bezwen mete kote w ye chak fwa w ap poste yon pwodwi. Sit la ap tou anrejistre l pou livrè yo ka pase pran koli yo!'
                        : '✅ Grâce à cette adresse, vous n\'aurez plus à renseigner votre lieu lors de la publication de vos produits.'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ht' ? 'Kreye yon Modpas *' : 'Mot de passe *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimòm 6 karaktè"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer transition-all mt-2"
                >
                  <span>{language === 'ht' ? 'Resevwa Kòd 6 Chif sou Gmail' : 'Recevoir le Code à 6 Chiffres'}</span>
                  <Sparkles size={15} />
                </motion.button>
              </motion.form>
            )}

            {/* VERIFICATION STEP: 6-DIGIT CODE SENT TO GMAIL FROM macheyogann@gmail.com */}
            {mode === 'verify' && (
              <motion.div
                key="verify-flow"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer mb-1"
                >
                  <ArrowLeft size={14} />
                  <span>{language === 'ht' ? 'Retounen nan fòmilè a' : 'Retour au formulaire'}</span>
                </button>

                {/* Simulated Incoming Gmail Message Card from macheyogann@gmail.com */}
                <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50/70 via-white to-amber-50/50 p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-red-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                        MY
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-none">
                          Mache Yogann 🇭🇹
                        </p>
                        <p className="text-[11px] text-red-600 font-mono">
                          macheyogann@gmail.com
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                      Mesaj Byenveni
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                    <p className="font-semibold text-slate-900">
                      {language === 'ht' ? `Alo ${name}, Byenveni sou Mache Yogann!` : `Bonjour ${name}, Bienvenue sur Mache Yogann !`}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {language === 'ht'
                        ? 'Sit sa a kreye espesyalman pou valorize kòmès, atizan, kiltivatè ak boutik nan Leyogàn ak tout Ayiti. Nou pèmèt ou achte ak vann fasilman, peye pa MonCash (+509 47703814), NatCash (+509 35100438) oswa Kripto, epi resevwa livrezon rapid lakay ou ak ajan motosiklèt serye.'
                        : 'Mache Yogann valorise le commerce local à Léogâne et en Haïti. Achetez et vendez facilement avec paiements MonCash (+509 47703814), NatCash (+509 35100438) et Crypto, avec livraison directe.'}
                    </p>
                    <div className="p-2.5 rounded-xl bg-white border border-red-200/80 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">
                          {language === 'ht' ? 'Kòd Konfimasyon 6 Chif Ou:' : 'Votre Code de Confirmation :'}
                        </span>
                        <span className="text-xl font-black font-mono tracking-widest text-red-600">
                          {generatedCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Kopi kòd la"
                        >
                          {copiedCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          <span>{copiedCode ? 'Kopye!' : 'Kopi'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEnteredCode(generatedCode)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer transition-colors"
                        >
                          {language === 'ht' ? 'Mete Kòd la' : 'Remplir'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Verification Input Form */}
                <form onSubmit={handleVerifyCode} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ht' ? 'Antre kòd 6 chif la isit la *' : 'Entrez le code à 6 chiffres ici *'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center text-xl sm:text-2xl font-black tracking-[0.4em] py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-red-600 focus:bg-white rounded-xl focus:outline-none transition-all"
                    />
                    <p className="text-[11px] text-slate-500 mt-1 text-center">
                      Destinatè: <strong>{gmail}</strong>
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer transition-all"
                  >
                    <CheckCircle2 size={16} />
                    <span>{language === 'ht' ? 'Konfime Kont Mwen Sou Mache Yogann' : 'Valider mon Compte'}</span>
                  </motion.button>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>{language === 'ht' ? 'Ou pa resevwa kòd la?' : 'Pas reçu le code ?'}</span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={handleResendCode}
                      className={`font-semibold underline cursor-pointer ${
                        resendCooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-red-600 hover:text-red-700'
                      }`}
                    >
                      {resendCooldown > 0
                        ? `${language === 'ht' ? 'Tann' : 'Attendez'} ${resendCooldown}s`
                        : language === 'ht' ? 'Revoye kòd la' : 'Renvoyer le code'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
