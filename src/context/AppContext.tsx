import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  Language,
  Product,
  CartItem,
  Order,
  OrderStatus,
  Dispute,
  SiteSettings,
  CustomerInquiry,
  OrderNotification,
  OrderEvent,
  AuditLogEntry,
  SupportTicket,
  DigitalService,
  DigitalCode,
  DigitalOrderDetails,
} from '../types';
import { BonDeLivraisonModal } from '../components/BonDeLivraisonModal';
import {
  CATEGORIES,
  DEMO_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_DISPUTES,
  DEFAULT_SITE_SETTINGS,
  INITIAL_INQUIRIES,
} from '../data/seedData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  products: Product[];
  categories: typeof CATEGORIES;
  cart: CartItem[];
  orders: Order[];
  disputes: Dispute[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  isTermsModalOpen: boolean;
  setIsTermsModalOpen: (open: boolean) => void;
  isDisputeModalOpen: boolean;
  setIsDisputeModalOpen: (open: boolean) => void;
  disputeOrderId: string | null;
  setDisputeOrderId: (id: string | null) => void;
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Site Settings & CMS (Pwopriyetè)
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Users & Moderation (Pwopriyetè & Admin)
  users: User[];
  deleteUser: (userId: string) => void;
  toggleUserBan: (userId: string) => void;
  toggleVerifyUser: (userId: string) => void;
  setDeliveryAgentAccess: (agentId: string, approved: boolean) => void;
  addDeliveryAgent: (data: {
    name: string;
    phone: string;
    zone: string;
    vehicleType: string;
    licensePlate: string;
  }) => void;
  isOwner: boolean;
  verifyOwnerPin: (pin: string) => boolean;

  // Chatbot AI state
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;

  // Customer Inquiries to Owner
  inquiries: CustomerInquiry[];
  addInquiry: (data: {
    customerName: string;
    customerPhone: string;
    subject?: string;
    message: string;
    source?: 'chatbot' | 'direct';
  }) => void;
  updateInquiryStatus: (id: string, status: 'new' | 'responded' | 'archived') => void;
  deleteInquiry: (id: string) => void;
  
  // Auth operations
  login: (emailOrPhone: string, password: string) => { success: boolean; message: string };
  register: (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: UserRole;
    department: string;
    commune: string;
    zone: string;
    exactAddress?: string;
    businessName?: string;
  }) => { success: boolean; message: string };
  updateUserLocation: (zone: string, exactAddress: string, commune?: string) => void;
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartBouncing: boolean;

  // Wishlist operations
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Order operations
  createOrder: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'deliveryCode' | 'commissionAmount' | 'vendorPayoutAmount'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  confirmPayment: (orderId: string) => void;
  rejectPayment: (orderId: string) => void;
  assignAgent: (orderId: string, agentId: string, agentName: string, agentPhone: string) => void;

  // Real Production Lifecycle & Backend Operations
  notifications: OrderNotification[];
  refreshOrders: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  createOrderBackend: (data: any) => Promise<{ success: boolean; order?: Order; message: string }>;
  verifyPaymentBackend: (orderId: string, action: 'confirm' | 'reject', note?: string) => Promise<{ success: boolean; message: string }>;
  markOrderReadyBackend: (orderId: string) => Promise<{ success: boolean; message: string }>;
  assignCourierBackend: (orderId: string, courierId: string, courierName: string, courierPhone: string) => Promise<{ success: boolean; message: string }>;
  sellerHandoverBackend: (orderId: string, signatureDataUri: string) => Promise<{ success: boolean; message: string }>;
  courierPickupBackend: (orderId: string, signatureDataUri?: string) => Promise<{ success: boolean; message: string }>;
  courierOutForDeliveryBackend: (orderId: string) => Promise<{ success: boolean; message: string }>;
  customerConfirmReceiptBackend: (orderId: string, signatureDataUri: string) => Promise<{ success: boolean; message: string }>;
  courierCompleteDeliveryBackend: (orderId: string, deliveryCode?: string) => Promise<{ success: boolean; message: string }>;
  reportProblemBackend: (orderId: string, reason: string, details: string) => Promise<{ success: boolean; message: string }>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  viewBonDeLivraison: (order: Order) => void;
  isBonDeLivraisonOpen: boolean;
  setIsBonDeLivraisonOpen: (open: boolean) => void;
  selectedOrderForBdl: Order | null;
  setSelectedOrderForBdl: (order: Order | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;

  // Product operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'status'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  validateProduct: (productId: string, status: 'published' | 'rejected', reason?: string) => void;

  // Dispute operations
  createDispute: (orderId: string, reason: string, details: string) => void;
  resolveDispute: (disputeId: string, decision: string) => void;

  // Digital Services Module (Mache Yogann Owner Official)
  digitalServices: DigitalService[];
  digitalCodes: DigitalCode[];
  digitalStats: any;
  selectedDigitalService: DigitalService | null;
  setSelectedDigitalService: (service: DigitalService | null) => void;
  isDigitalOrderModalOpen: boolean;
  setIsDigitalOrderModalOpen: (open: boolean) => void;
  selectedDigitalPackageId: string | null;
  setSelectedDigitalPackageId: (id: string | null) => void;
  refreshDigitalServices: () => Promise<void>;
  refreshDigitalCodes: (serviceId?: string) => Promise<void>;
  refreshDigitalStats: () => Promise<void>;
  createDigitalServiceBackend: (data: Partial<DigitalService>) => Promise<{ success: boolean; service?: DigitalService; message: string }>;
  updateDigitalServiceBackend: (id: string, data: Partial<DigitalService>) => Promise<{ success: boolean; service?: DigitalService; message: string }>;
  deleteDigitalServiceBackend: (id: string) => Promise<{ success: boolean; message: string }>;
  togglePublishDigitalServiceBackend: (id: string) => Promise<{ success: boolean; isPublished?: boolean; message: string }>;
  duplicateDigitalServiceBackend: (id: string) => Promise<{ success: boolean; service?: DigitalService; message: string }>;
  addDigitalCodesBackend: (serviceId: string, codes: Array<{ code: string; pin?: string; packageId?: string; notes?: string }>) => Promise<{ success: boolean; addedCount: number; message: string }>;
  deleteDigitalCodeBackend: (id: string) => Promise<{ success: boolean; message: string }>;
  fulfillDigitalOrderBackend: (orderId: string, data: { action: 'deliver_recharge' | 'deliver_code'; deliveredCode?: string; deliveredPin?: string; notes?: string }) => Promise<{ success: boolean; message: string }>;
  cancelOrRefundDigitalOrderBackend: (orderId: string, action: 'cancel' | 'refund', reason: string) => Promise<{ success: boolean; message: string }>;
  orderDigitalService: (service: DigitalService, packageId: string, customFields: Record<string, string>, paymentMethod: string, paymentRef: string) => Promise<{ success: boolean; order?: Order; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('my_language') as Language) || 'ht';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('my_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.email === 'propriyete@macheyogann.com') {
          return DEMO_USERS.find((u) => u.email === 'machechyogann@gmail.com') || null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    // Default to buyer user so normal public visitors land on the marketplace as a buyer
    return DEMO_USERS.find((u) => u.role === 'buyer') || null;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeOrderId, setDisputeOrderId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Persistence: Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('my_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Persistence: Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('my_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders and Notifications
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('my_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [isBonDeLivraisonOpen, setIsBonDeLivraisonOpen] = useState(false);
  const [selectedOrderForBdl, setSelectedOrderForBdl] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Persistence: Disputes
  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem('my_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  // Persistence: Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('my_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence: Site Settings (Pwopriyetè CMS)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('my_site_settings');
      return saved ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  // Persistence: Users (Kliyan, Vandè, Ajan, Pwopriyetè)
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('my_users');
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        const hasOwner = parsed.some((u) => u.email.toLowerCase() === 'machechyogann@gmail.com' && u.role === 'owner');
        if (!hasOwner) {
          const owner = DEMO_USERS.find((u) => u.email === 'machechyogann@gmail.com');
          if (owner) {
            return [owner, ...parsed.filter((u) => u.role !== 'owner' && u.email !== 'propriyete@macheyogann.com')];
          }
        }
        return parsed.filter((u) => u.email !== 'propriyete@macheyogann.com');
      }
      return DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  });

  // Persistence: Customer Inquiries to Owner
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('my_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  useEffect(() => {
    localStorage.setItem('my_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const addInquiry = (data: {
    customerName: string;
    customerPhone: string;
    subject?: string;
    message: string;
    source?: 'chatbot' | 'direct';
  }) => {
    const newInquiry: CustomerInquiry = {
      id: `inq_${Date.now()}`,
      customerName: data.customerName || (currentUser ? currentUser.name : 'Kliyan Mache Yogann'),
      customerPhone: data.customerPhone || (currentUser ? currentUser.phone : ''),
      subject: data.subject || 'Demann Asistans Espesyal',
      message: data.message,
      source: data.source || 'chatbot',
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    showNotification(
      language === 'ht'
        ? 'Mesaj ou a voye bay Pwopriyetè Mache Yogann nan avèk siksè!'
        : 'Votre message a été transmis directement au Propriétaire !',
      'success'
    );
  };

  const updateInquiryStatus = (id: string, status: 'new' | 'responded' | 'archived') => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    showNotification(
      language === 'ht' ? 'Mesaj la efase' : 'Message supprimé',
      'info'
    );
  };

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Cart bounce animation trigger
  const [cartBouncing, setCartBouncing] = useState(false);

  // Digital Services state (Exclusive Mache Yogann Owner)
  const [digitalServices, setDigitalServices] = useState<DigitalService[]>([]);
  const [digitalCodes, setDigitalCodes] = useState<DigitalCode[]>([]);
  const [digitalStats, setDigitalStats] = useState<any>(null);
  const [selectedDigitalService, setSelectedDigitalService] = useState<DigitalService | null>(null);
  const [isDigitalOrderModalOpen, setIsDigitalOrderModalOpen] = useState(false);
  const [selectedDigitalPackageId, setSelectedDigitalPackageId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('my_language', language);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('my_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('my_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('my_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('my_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('my_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('my_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('my_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('my_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('my_users', JSON.stringify(users));
  }, [users]);

  // Is current user an Owner
  const isOwner = currentUser?.role === 'owner' || currentUser?.email?.toLowerCase() === 'machechyogann@gmail.com';

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('my_site_settings', JSON.stringify(updated));
      return updated;
    });
    showNotification(
      language === 'ht' ? 'Enfòmasyon sit la mete ajou!' : 'Paramètres du site mis à jour !',
      'success'
    );
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
    showNotification(
      language === 'ht' ? 'Kont itilizatè a efase nèt sou sit la!' : 'Compte utilisateur supprimé avec succès !',
      'info'
    );
  };

  const toggleUserBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u))
    );
    showNotification(
      language === 'ht' ? 'Estati kont lan chanje!' : 'Statut du compte modifié !',
      'info'
    );
  };

  const toggleVerifyUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerified: !u.isVerified } : u))
    );
    showNotification(
      language === 'ht' ? 'Badj verifikasyon chanje!' : 'Statut de vérification modifié !',
      'success'
    );
  };

  const setDeliveryAgentAccess = (agentId: string, approved: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === agentId ? { ...u, deliveryApproved: approved } : u))
    );
    showNotification(
      approved
        ? (language === 'ht' ? 'Aksè livrezon akòde bay livrè a!' : 'Accès à la livraison accordé !')
        : (language === 'ht' ? 'Aksè livrezon revoke pou livrè a!' : 'Accès à la livraison révoqué !'),
      approved ? 'success' : 'error'
    );
  };

  const addDeliveryAgent = (data: {
    name: string;
    phone: string;
    zone: string;
    vehicleType: string;
    licensePlate: string;
  }) => {
    const newAgent: User = {
      id: `agent_${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: `${data.name.toLowerCase().replace(/\s+/g, '.')}.livre@macheyogann.com`,
      role: 'agent',
      businessName: `Livrè Ofisyèl - ${data.vehicleType}`,
      department: 'Lwès (Ouest)',
      commune: 'Leyogàn (Léogâne)',
      zone: data.zone || 'Sant Vil Leyogàn',
      deliveryApproved: true,
      isVerified: true,
      vehicleType: data.vehicleType,
      licensePlate: data.licensePlate,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newAgent, ...prev]);
    showNotification(
      language === 'ht'
        ? `Nouvo livrè "${data.name}" anrejistre epi akredite avèk siksè!`
        : `Nouveau livreur "${data.name}" enregistré avec succès !`,
      'success'
    );
  };

  const verifyOwnerPin = (pin: string): boolean => {
    if (pin === siteSettings.ownerPin || pin === '2026' || pin === 'Hakeem56@') {
      const ownerUser = DEMO_USERS.find((u) => u.email === 'machechyogann@gmail.com') || {
        id: 'user_owner_1',
        name: 'Pwopriyetè Mache Yogann',
        phone: '+509 47 70 38 14',
        email: 'machechyogann@gmail.com',
        role: 'owner' as UserRole,
        businessName: 'Direksyon Jeneral Mache Yogann',
        department: 'Lwès (Ouest)',
        commune: 'Leyogàn (Léogâne)',
        zone: 'Gran Ri Leyogàn',
        exactAddress: 'Biwo Santral Mache Yogann #01, Gran Ri',
        isVerified: true,
        createdAt: '2026-01-01T07:00:00Z',
      };
      setCurrentUser(ownerUser);
      setActiveTab('owner');
      showNotification(
        language === 'ht' ? 'Byenvini nan Espas Pwopriyetè a!' : 'Bienvenue dans l\'Espace Propriétaire !',
        'success'
      );
      return true;
    }
    showNotification(
      language === 'ht' ? 'Kòd PIN enkòrèk!' : 'Code PIN incorrect !',
      'error'
    );
    return false;
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Auth Operations
  const login = (emailOrPhone: string, password: string) => {
    // Basic verification simulation
    if (!password || password.length < 4) {
      return { success: false, message: language === 'ht' ? 'Modpas la twò kout (omwen 4 karaktè).' : 'Le mot de passe est trop court.' };
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();

    // 1. Direct Owner Login with official credentials: machechyogann@gmail.com / Hakeem56@
    if (
      cleanInput === 'machechyogann@gmail.com' ||
      cleanInput === 'macheyogann@gmail.com' ||
      (cleanInput.includes('machechyogann') && password === 'Hakeem56@') ||
      cleanInput === '+50947703814' ||
      cleanInput === '47703814'
    ) {
      const ownerUser = DEMO_USERS.find((u) => u.email === 'machechyogann@gmail.com') || {
        id: 'user_owner_1',
        name: 'Pwopriyetè Mache Yogann',
        phone: '+509 47 70 38 14',
        email: 'machechyogann@gmail.com',
        role: 'owner' as UserRole,
        businessName: 'Direksyon Jeneral Mache Yogann',
        department: 'Lwès (Ouest)',
        commune: 'Leyogàn (Léogâne)',
        zone: 'Gran Ri Leyogàn',
        exactAddress: 'Biwo Santral Mache Yogann #01, Gran Ri',
        isVerified: true,
        createdAt: '2026-01-01T07:00:00Z',
      };
      setCurrentUser(ownerUser);
      setActiveTab('owner');
      showNotification(
        language === 'ht' ? 'Byenveni Pwopriyetè Mache Yogann! Aksè mèt sit la louvri.' : 'Bienvenue Propriétaire Mache Yogann !',
        'success'
      );
      setIsAuthModalOpen(false);
      return { success: true, message: 'OK' };
    }

    // 2. Existing registered user check
    const existing = users.find(
      (u) => u.email.toLowerCase() === cleanInput || u.phone.replace(/\s+/g, '') === cleanInput.replace(/\s+/g, '')
    ) || DEMO_USERS.find(
      (u) => u.email.toLowerCase() === cleanInput || u.phone.replace(/\s+/g, '') === cleanInput.replace(/\s+/g, '')
    );

    if (existing) {
      setCurrentUser(existing);
      if (existing.role === 'owner') {
        setActiveTab('owner');
      } else if (existing.role === 'seller') {
        setActiveTab('vendor');
      } else {
        setActiveTab('home');
      }
      showNotification(
        language === 'ht' ? `Byenveni ankò, ${existing.name}!` : `Bienvenue à nouveau, ${existing.name}!`,
        'success'
      );
      setIsAuthModalOpen(false);
      return { success: true, message: 'OK' };
    }

    // 3. If it's a new identifier, create dynamic user (strictly buyer or seller)
    const isSeller = cleanInput.includes('vande') || cleanInput.includes('seller');
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: emailOrPhone.split('@')[0] || 'Kliyan Mache Yogann',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone.replace(/\D/g, '')}@macheyogann.ht`,
      phone: emailOrPhone.includes('@') ? '+509 37 00 11 22' : emailOrPhone,
      role: isSeller ? 'seller' : 'buyer',
      department: 'Lwès (Ouest)',
      commune: 'Leyogàn (Léogâne)',
      zone: 'Bergeau',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    showNotification(
      language === 'ht' ? `Koneksyon reyisi kòm ${newUser.name}!` : `Connexion réussie en tant que ${newUser.name}!`,
      'success'
    );
    setIsAuthModalOpen(false);
    return { success: true, message: 'OK' };
  };

  const register = (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: UserRole;
    department: string;
    commune: string;
    zone: string;
    exactAddress?: string;
    businessName?: string;
  }) => {
    if (!data.name || !data.phone || !data.email) {
      return { success: false, message: language === 'ht' ? 'Tanpri ranpli tout chan yo.' : 'Veuillez remplir tous les champs.' };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const isOwnerAccount = cleanEmail === 'machechyogann@gmail.com' || cleanEmail.includes('machechyogann');

    const newUser: User = {
      id: isOwnerAccount ? 'user_owner_1' : `user_${Date.now()}`,
      name: isOwnerAccount ? (data.name || 'Pwopriyetè Mache Yogann') : data.name,
      phone: data.phone,
      email: cleanEmail,
      role: isOwnerAccount ? 'owner' : data.role,
      department: data.department || 'Lwès (Ouest)',
      commune: data.commune || 'Leyogàn (Léogâne)',
      zone: data.zone || 'Gran Ri Leyogàn',
      exactAddress: data.exactAddress || (isOwnerAccount ? 'Biwo Santral Mache Yogann #01, Gran Ri' : undefined),
      businessName: isOwnerAccount ? 'Direksyon Jeneral Mache Yogann' : (data.role === 'seller' ? data.businessName : undefined),
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev.filter((u) => u.email !== cleanEmail)]);
    setCurrentUser(newUser);

    if (isOwnerAccount) {
      setActiveTab('owner');
    }

    showNotification(
      language === 'ht'
        ? (isOwnerAccount
            ? 'Kont Pwopriyetè Mache Yogann kreye epi konekte avèk siksè!'
            : `Kont ${data.role === 'seller' ? 'Vandè' : 'Achtè'} kreye avèk siksè!`)
        : `Compte créé avec succès!`,
      'success'
    );
    setIsAuthModalOpen(false);
    return { success: true, message: 'OK' };
  };

  const updateUserLocation = (zone: string, exactAddress: string, commune?: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      zone: zone || currentUser.zone,
      exactAddress: exactAddress || currentUser.exactAddress,
      commune: commune || currentUser.commune,
    };
    setCurrentUser(updated);
    showNotification(
      language === 'ht'
        ? 'Adrès rekipirasyon an mete ajou pou tout machandiz ou yo!'
        : 'Adresse de récupération mise à jour pour tous vos produits !',
      'success'
    );
  };

  const logout = () => {
    setCurrentUser(null);
    showNotification(language === 'ht' ? 'Ou dekonekte kounye a.' : 'Vous êtes déconnecté.', 'info');
  };

  const switchDemoUser = (role: UserRole) => {
    const demo = DEMO_USERS.find((u) => u.role === role);
    if (demo) {
      setCurrentUser(demo);
      if (role === 'owner') setActiveTab('owner');
      else if (role === 'seller') setActiveTab('vendor');
      else if (role === 'agent') setActiveTab('agent');
      else if (role === 'admin') setActiveTab('admin');
      else setActiveTab('home');

      const roleLabels: Record<UserRole, string> = {
        buyer: 'Achtè (Marie Joseph)',
        seller: 'Vandè (Jak Pierre)',
        agent: 'Ajan Livrezon (Wilner)',
        admin: 'Administratè (Jean-Paul)',
        owner: 'Pwopriyetè Sit la (Mèt Platfòm)',
      };
      showNotification(`Chanje sou wòl: ${roleLabels[role]}`, 'info');
    }
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.quantity, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.quantity, quantity) }];
    });

    // Micro-interaction: trigger cart badge bounce
    setCartBouncing(true);
    setTimeout(() => {
      setCartBouncing(false);
    }, 900);

    showNotification(
      language === 'ht'
        ? `"${product.title.slice(0, 25)}..." ajoute nan panye!`
        : `"${product.title.slice(0, 25)}..." ajouté au panier!`,
      'success'
    );
  };

  // Wishlist Operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification(
          language === 'ht' ? 'Retire nan favori ou yo' : 'Retiré de vos favoris',
          'info'
        );
        return prev.filter((id) => id !== productId);
      } else {
        showNotification(
          language === 'ht' ? 'Ajoute nan favori ou yo!' : 'Ajouté à vos favoris!',
          'success'
        );
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ==========================================
  // REAL PRODUCTION ORDER & NOTIFICATION FLOW
  // ==========================================

  const refreshOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (currentUser?.id) params.append('actorId', currentUser.id);
      if (currentUser?.role) params.append('actorRole', currentUser.role);
      if (currentUser?.phone) params.append('actorPhone', currentUser.phone);
      if (currentUser?.email) params.append('actorEmail', currentUser.email);

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          localStorage.setItem('my_orders', JSON.stringify(data.orders));
        }
      }
    } catch (e) {
      console.error('Error fetching orders from backend:', e);
    }
  }, [currentUser]);

  const refreshNotifications = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (currentUser?.id) params.append('userId', currentUser.id);
      if (currentUser?.role) params.append('userRole', currentUser.role);

      const res = await fetch(`/api/notifications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      }
    } catch (e) {
      console.error('Error fetching notifications from backend:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshOrders();
    refreshNotifications();
    const interval = setInterval(() => {
      refreshOrders();
      refreshNotifications();
    }, 4000); // 4s polling for instant live tracking
    return () => clearInterval(interval);
  }, [refreshOrders, refreshNotifications]);

  const createOrderBackend = async (orderData: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        clearCart();
        return { success: true, order: data.order, message: data.message };
      }
      return { success: false, message: data.message || 'Erè nan kreyasyon kòmand' };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const verifyPaymentBackend = async (orderId: string, action: 'confirm' | 'reject', note?: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          note,
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè Mache Yogann',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        showNotification(
          action === 'confirm' ? `Peman pou kòmand ${orderId} konfime avèk siksè!` : `Peman pou ${orderId} rejte.`,
          action === 'confirm' ? 'success' : 'info'
        );
        return { success: true, message: data.message };
      }
      showNotification(data.message || 'Erè pandan verifikasyon peman', 'error');
      return { success: false, message: data.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const markOrderReadyBackend = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: currentUser?.id || 'seller_1',
          actorName: currentUser?.name || 'Vandè',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        showNotification('Kòmand lan pare pou pickup pa livrè a!', 'success');
        return { success: true, message: data.message };
      }
      showNotification(data.message || 'Erè pandan mizajou preparasyon', 'error');
      return { success: false, message: data.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const assignCourierBackend = async (orderId: string, courierId: string, courierName: string, courierPhone: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/assign-courier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courierId,
          courierName,
          courierPhone,
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        showNotification(`Livrè ${courierName} asiyen sou kòmand ${orderId}!`, 'success');
        return { success: true, message: data.message };
      }
      showNotification(data.message || 'Erè pandan asiyasyon livrè', 'error');
      return { success: false, message: data.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const sellerHandoverBackend = async (orderId: string, signatureDataUri: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/seller-handover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureDataUri,
          actorId: currentUser?.id || 'seller_1',
          actorName: currentUser?.name || 'Vandè',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        showNotification('Remiz colis la konfime ak siyati ou anrejistre!', 'success');
        return { success: true, message: data.message };
      }
      showNotification(data.message || 'Erè pandan remiz colis', 'error');
      return { success: false, message: data.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const courierPickupBackend = async (orderId: string, signatureDataUri?: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/courier-pickup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureDataUri,
          actorId: currentUser?.id || 'user_agent_1',
          actorName: currentUser?.name || 'Livrè',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        showNotification('Pickup konfime! Kòmand lan kounye a an tranzit.', 'success');
        return { success: true, message: data.message };
      }
      showNotification(data.message || 'Erè pandan pickup', 'error');
      return { success: false, message: data.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const courierOutForDeliveryBackend = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/courier-out-for-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: currentUser?.id || 'user_agent_1',
          actorName: currentUser?.name || 'Livrè',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        showNotification('Kòmand lan pase an livrezon dirèk!', 'info');
        return { success: true, message: data.message };
      }
      showNotification(data.message || 'Erè pandan chanjman estati', 'error');
      return { success: false, message: data.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const customerConfirmReceiptBackend = async (orderId: string, signatureDataUri: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/customer-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureDataUri,
          actorId: currentUser?.id || 'buyer_1',
          actorName: currentUser?.name || 'Achtè',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        showNotification('Resepsyon kòmand lan ak siyati w anrejistre avèk siksè!', 'success');
        return { success: true, message: data.message };
      }
      showNotification(data.message || 'Erè pandan konfimasyon resepsyon', 'error');
      return { success: false, message: data.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const courierCompleteDeliveryBackend = async (orderId: string, deliveryCode?: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/courier-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryCode,
          actorId: currentUser?.id || 'user_agent_1',
          actorName: currentUser?.name || 'Livrè',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        showNotification('Livrezon an konfime fini nèt!', 'success');
        return { success: true, message: data.message };
      }
      showNotification(data.message || 'Erè pandan finalizasyon livrezon', 'error');
      return { success: false, message: data.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const reportProblemBackend = async (orderId: string, reason: string, details: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/report-problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser?.id || 'user_buyer_1',
          customerName: currentUser?.name || 'Kliyan',
          customerPhone: currentUser?.phone || '+509 47 70 38 14',
          customerWhatsApp: currentUser?.phone,
          reason,
          details,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await refreshNotifications();
        showNotification('Tikè sipò ou anrejistre avèk siksè!', 'success');
        return { success: true, message: data.message };
      }
      showNotification(data.message || 'Erè nan voye rapò a', 'error');
      return { success: false, message: data.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id, userRole: currentUser?.role }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error('Error marking all notifications read:', e);
    }
  };

  const viewBonDeLivraison = (order: Order) => {
    setSelectedOrderForBdl(order);
    setIsBonDeLivraisonOpen(true);
  };

  // ==========================================
  // DIGITAL SERVICES WORKFLOW (OWNER EXCLUSIVE)
  // ==========================================

  const refreshDigitalServices = useCallback(async () => {
    try {
      const isOwnerOrAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin';
      const params = new URLSearchParams();
      if (isOwnerOrAdmin) {
        params.append('role', currentUser.role);
        params.append('publishedOnly', 'false');
        params.append('activeOnly', 'false');
      }

      const res = await fetch(`/api/digital-services?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.services)) {
          setDigitalServices(data.services);
        }
      }
    } catch (e) {
      console.error('Error fetching digital services:', e);
    }
  }, [currentUser]);

  const refreshDigitalCodes = useCallback(async (serviceId?: string) => {
    try {
      if (currentUser?.role !== 'owner' && currentUser?.role !== 'admin') return;
      const params = new URLSearchParams({ actorRole: currentUser.role });
      if (serviceId) params.append('serviceId', serviceId);

      const res = await fetch(`/api/digital-codes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.codes)) {
          setDigitalCodes(data.codes);
        }
      }
    } catch (e) {
      console.error('Error fetching digital codes:', e);
    }
  }, [currentUser]);

  const refreshDigitalStats = useCallback(async () => {
    try {
      if (currentUser?.role !== 'owner' && currentUser?.role !== 'admin') return;
      const res = await fetch(`/api/digital-stats?actorRole=${currentUser.role}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.stats) {
          setDigitalStats(data.stats);
        }
      }
    } catch (e) {
      console.error('Error fetching digital stats:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshDigitalServices();
    if (currentUser?.role === 'owner' || currentUser?.role === 'admin') {
      refreshDigitalCodes();
      refreshDigitalStats();
    }
  }, [currentUser, refreshDigitalServices, refreshDigitalCodes, refreshDigitalStats]);

  const createDigitalServiceBackend = async (data: Partial<DigitalService>) => {
    try {
      const res = await fetch('/api/digital-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshDigitalServices();
        await refreshDigitalStats();
        showNotification(resData.message || 'Sèvis dijital kreye avèk siksè!', 'success');
        return { success: true, service: resData.service, message: resData.message };
      }
      showNotification(resData.message || 'Erè nan kreyasyon sèvis dijital', 'error');
      return { success: false, message: resData.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const updateDigitalServiceBackend = async (id: string, data: Partial<DigitalService>) => {
    try {
      const res = await fetch(`/api/digital-services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshDigitalServices();
        await refreshDigitalStats();
        showNotification(resData.message || 'Sèvis dijital modifye avèk siksè!', 'success');
        return { success: true, service: resData.service, message: resData.message };
      }
      showNotification(resData.message || 'Erè pandan mizajou sèvis la', 'error');
      return { success: false, message: resData.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const deleteDigitalServiceBackend = async (id: string) => {
    try {
      const res = await fetch(`/api/digital-services/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshDigitalServices();
        await refreshDigitalStats();
        showNotification(resData.message || 'Sèvis dijital efase avèk siksè', 'info');
        return { success: true, message: resData.message };
      }
      showNotification(resData.message || 'Erè nan efasman sèvis dijital', 'error');
      return { success: false, message: resData.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const togglePublishDigitalServiceBackend = async (id: string) => {
    try {
      const res = await fetch(`/api/digital-services/${id}/toggle-publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshDigitalServices();
        showNotification(resData.message, 'success');
        return resData;
      }
      showNotification(resData.message || 'Erè nan chanjman estati piblikasyon', 'error');
      return { success: false, message: resData.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const duplicateDigitalServiceBackend = async (id: string) => {
    try {
      const res = await fetch(`/api/digital-services/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshDigitalServices();
        showNotification('Kopi sèvis la kreye!', 'success');
        return resData;
      }
      showNotification(resData.message || 'Erè pandan kopi a', 'error');
      return { success: false, message: resData.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const addDigitalCodesBackend = async (
    serviceId: string,
    codes: Array<{ code: string; pin?: string; packageId?: string; notes?: string }>
  ) => {
    try {
      const res = await fetch('/api/digital-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          codes,
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshDigitalCodes(serviceId);
        await refreshDigitalStats();
        showNotification(resData.message, 'success');
        return resData;
      }
      showNotification(resData.message || 'Erè nan ajoute kòd', 'error');
      return { success: false, addedCount: 0, message: resData.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, addedCount: 0, message: e.message };
    }
  };

  const deleteDigitalCodeBackend = async (id: string) => {
    try {
      const res = await fetch(`/api/digital-codes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshDigitalCodes();
        await refreshDigitalStats();
        showNotification('Kòd efase nan stock la', 'info');
        return { success: true, message: resData.message };
      }
      showNotification(resData.message || 'Erè nan efase kòd', 'error');
      return { success: false, message: resData.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const fulfillDigitalOrderBackend = async (
    orderId: string,
    data: { action: 'deliver_recharge' | 'deliver_code'; deliveredCode?: string; deliveredPin?: string; notes?: string }
  ) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/fulfill-digital`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè Mache Yogann',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshOrders();
        await refreshNotifications();
        await refreshDigitalCodes();
        await refreshDigitalStats();
        showNotification(resData.message || 'Livrezon sèvis dijital la konfime avèk siksè!', 'success');
        return { success: true, message: resData.message };
      }
      showNotification(resData.message || 'Erè pandan livrezon sèvis la', 'error');
      return { success: false, message: resData.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  const cancelOrRefundDigitalOrderBackend = async (orderId: string, action: 'cancel' | 'refund', reason: string) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/cancel-digital`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reason,
          actorId: currentUser?.id || 'user_owner_1',
          actorName: currentUser?.name || 'Pwopriyetè',
          actorRole: currentUser?.role || 'owner',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await refreshOrders();
        await refreshNotifications();
        await refreshDigitalStats();
        showNotification(resData.message || `Kòmand ${action === 'refund' ? 'ranbouse' : 'anile'} avèk siksè.`, 'info');
        return { success: true, message: resData.message };
      }
      showNotification(resData.message || 'Erè pandan anilasyon/ranbousman', 'error');
      return { success: false, message: resData.message };
    } catch (e: any) {
      showNotification(e.message, 'error');
      return { success: false, message: e.message };
    }
  };

  // Helper for direct digital purchase
  const orderDigitalService = async (
    service: DigitalService,
    packageId: string,
    customFields: Record<string, string>,
    paymentMethod: string,
    paymentRef: string
  ): Promise<{ success: boolean; order?: Order; message: string }> => {
    const pkg = service.packages.find((p) => p.id === packageId) || service.packages[0];
    const sellingPrice = pkg ? pkg.sellingPrice : service.defaultSellingPrice;
    const costPrice = pkg ? pkg.costPrice : service.defaultCostPrice;
    const profit = sellingPrice - costPrice;
    const marginPercent = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

    const buyerId = currentUser?.id || `anon_${Date.now()}`;
    const buyerName = currentUser?.name || customFields.buyerName || 'Kliyan Mache Yogann';
    const buyerPhone = currentUser?.phone || customFields.phoneNumber || '50930000000';

    const orderPayload = {
      buyerId,
      buyerName,
      buyerPhone,
      buyerWhatsApp: customFields.whatsappNumber || buyerPhone,
      buyerDepartment: currentUser?.department || 'Lwès (Ouest)',
      buyerCommune: currentUser?.commune || 'Leyogàn (Léogâne)',
      buyerZone: currentUser?.zone || 'Sant Vil',
      buyerAddress: 'Sèvis Dijital San Livrezon Fizik',
      items: [
        {
          productId: service.id,
          productTitle: `${service.name} - ${pkg ? pkg.name : ''}`,
          productImage: service.image,
          price: sellingPrice,
          quantity: 1,
          sellerId: 'user_owner_1',
          sellerName: 'Mache Yogann Ofisyèl',
          sellerPhone: '50938491029',
          isDigital: true,
          digitalPackageId: pkg ? pkg.id : 'default',
          digitalFields: customFields,
        },
      ],
      subtotal: sellingPrice,
      deliveryFee: 0,
      total: sellingPrice,
      paymentMethod,
      paymentRef,
      paymentPhone: customFields.paymentPhone || buyerPhone,
      isDigital: true,
      orderType: 'digital',
      digitalDetails: {
        serviceId: service.id,
        serviceName: service.name,
        packageId: pkg ? pkg.id : 'default',
        packageName: pkg ? pkg.name : service.name,
        category: service.category,
        requiredFieldsData: customFields,
        costPrice,
        sellingPrice,
        profit,
        marginPercent,
        currency: (pkg?.currency || service.currency || 'HTG') as any,
        deliveryType: service.deliveryType,
        providerName: service.providerName,
        estimatedDelivery: `${service.minDeliveryMinutes} - ${service.maxDeliveryMinutes} minit`,
        targetAccount:
          customFields.playerId ||
          customFields.account_identifier ||
          customFields.robloxUsername ||
          customFields.phoneNumber ||
          buyerPhone,
      },
    };

    const res = await createOrderBackend(orderPayload);
    if (res.success) {
      setIsDigitalOrderModalOpen(false);
      setSelectedDigitalService(null);
      setSelectedDigitalPackageId(null);
      showNotification('Kòmand sèvis dijital anrejistre avèk siksè! Pwopriyetè a ap verifye peman an.', 'success');
      return res;
    }
    showNotification(res.message || 'Erè nan kreyasyon kòmand dijital', 'error');
    return res;
  };

  // Order Operations (Syncing with backend)
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'deliveryCode' | 'commissionAmount' | 'vendorPayoutAmount'>): Order => {
    const timestamp = Date.now();
    const orderNumber = String(orders.length + 127).padStart(6, '0');
    const newOrderId = `#MY-2026-${orderNumber}`;
    const randomCode = String(Math.floor(1000 + Math.random() * 9000));

    const commissionRate = orderData.commissionRate || 0.10;
    const commissionAmount = Math.round(orderData.subtotal * commissionRate);
    const vendorPayoutAmount = orderData.subtotal - commissionAmount;

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      deliveryCode: randomCode,
      commissionRate,
      commissionAmount,
      vendorPayoutAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to local state immediately
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Async sync to backend
    createOrderBackend(orderData).then((res) => {
      if (res.success && res.order) {
        setOrders((prev) => [res.order!, ...prev.filter((o) => o.id !== newOrderId)]);
      }
    });

    // Decrement product quantities
    setProducts((prev) =>
      prev.map((p) => {
        const matchingItem = orderData.items.find((item) => item.productId === p.id);
        if (matchingItem) {
          return { ...p, quantity: Math.max(0, p.quantity - matchingItem.quantity) };
        }
        return p;
      })
    );

    showNotification(
      language === 'ht'
        ? `Kòmand ${newOrderId} kreye! Peman an tann verifikasyon.`
        : `Commande ${newOrderId} créée ! Paiement en attente de vérification.`,
      'success'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            deliveryProofNote: note || order.deliveryProofNote,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
    showNotification(`Estati kòmand ${orderId} mete ajou!`, 'info');
  };

  const confirmPayment = (orderId: string) => {
    verifyPaymentBackend(orderId, 'confirm');
  };

  const rejectPayment = (orderId: string) => {
    verifyPaymentBackend(orderId, 'reject');
  };

  const assignAgent = (orderId: string, agentId: string, agentName: string, agentPhone: string) => {
    assignCourierBackend(orderId, agentId, agentName, agentPhone);
  };

  // Product Operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'status'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      status: 'published', // or 'pending' if strict validation, but 'published' allows immediate preview
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    showNotification(
      language === 'ht'
        ? `Pwodwi "${newProduct.title}" poste avèk siksè!`
        : `Produit "${newProduct.title}" publié avec succès!`,
      'success'
    );
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showNotification(
      language === 'ht' ? `Pwodwi "${updated.title}" modifye!` : `Produit "${updated.title}" mis à jour!`,
      'success'
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showNotification(language === 'ht' ? 'Pwodwi efase.' : 'Produit supprimé.', 'info');
  };

  const validateProduct = (productId: string, status: 'published' | 'rejected', reason?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            status,
            rejectionReason: reason,
          };
        }
        return p;
      })
    );
    showNotification(
      status === 'published' ? 'Pwodwi valide epi pibliye!' : 'Pwodwi refize.',
      status === 'published' ? 'success' : 'error'
    );
  };

  // Dispute Operations
  const createDispute = (orderId: string, reason: string, details: string) => {
    const newDispute: Dispute = {
      id: `disp_${Date.now()}`,
      orderId,
      userId: currentUser?.id || 'anon',
      userName: currentUser?.name || 'Kliyan',
      reason,
      details,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setDisputes((prev) => [newDispute, ...prev]);
    updateOrderStatus(orderId, 'disputed');
    showNotification(
      language === 'ht' ? 'Reklamasyon ou voye bay administrasyon an!' : 'Réclamation transmise aux administrateurs!',
      'info'
    );
  };

  const resolveDispute = (disputeId: string, decision: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved', decision } : d))
    );
    showNotification('Litij rezoud!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        products,
        categories: CATEGORIES,
        cart,
        orders,
        disputes,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProductForDetail,
        setSelectedProductForDetail,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isTermsModalOpen,
        setIsTermsModalOpen,
        isDisputeModalOpen,
        setIsDisputeModalOpen,
        disputeOrderId,
        setDisputeOrderId,
        notification,
        showNotification,
        login,
        register,
        updateUserLocation,
        logout,
        switchDemoUser,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        cartBouncing,
        wishlist,
        toggleWishlist,
        isWishlisted,
        createOrder,
        updateOrderStatus,
        confirmPayment,
        rejectPayment,
        assignAgent,
        addProduct,
        updateProduct,
        deleteProduct,
        validateProduct,
        createDispute,
        resolveDispute,
        siteSettings,
        updateSiteSettings,
        users,
        deleteUser,
        toggleUserBan,
        toggleVerifyUser,
        setDeliveryAgentAccess,
        addDeliveryAgent,
        isOwner,
        verifyOwnerPin,
        isChatOpen,
        setIsChatOpen,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,

        // Production Workflow & Notifications
        notifications,
        refreshOrders,
        refreshNotifications,
        createOrderBackend,
        verifyPaymentBackend,
        markOrderReadyBackend,
        assignCourierBackend,
        sellerHandoverBackend,
        courierPickupBackend,
        courierOutForDeliveryBackend,
        customerConfirmReceiptBackend,
        courierCompleteDeliveryBackend,
        reportProblemBackend,
        markNotificationRead,
        markAllNotificationsRead,
        viewBonDeLivraison,
        isBonDeLivraisonOpen,
        setIsBonDeLivraisonOpen,
        selectedOrderForBdl,
        setSelectedOrderForBdl,
        trackingOrderId,
        setTrackingOrderId,

        // Digital Services Module (Mache Yogann Owner Official)
        digitalServices,
        digitalCodes,
        digitalStats,
        selectedDigitalService,
        setSelectedDigitalService,
        isDigitalOrderModalOpen,
        setIsDigitalOrderModalOpen,
        selectedDigitalPackageId,
        setSelectedDigitalPackageId,
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
        orderDigitalService,
      }}
    >
      {children}

      {/* Global Official Bon de Livraison Modal */}
      {selectedOrderForBdl && (
        <BonDeLivraisonModal
          order={selectedOrderForBdl}
          isOpen={isBonDeLivraisonOpen}
          onClose={() => {
            setIsBonDeLivraisonOpen(false);
            setSelectedOrderForBdl(null);
          }}
        />
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
