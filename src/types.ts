export type UserRole = 'buyer' | 'seller' | 'agent' | 'admin' | 'owner';

export type Language = 'ht' | 'fr';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  department: string;
  commune: string;
  zone: string;
  exactAddress?: string; // Adrès egzak / Repè kote boutik oswa kay la ye pou livrè yo ka pase pran koli
  businessName?: string;
  isVerified?: boolean;
  isBanned?: boolean; // Pwopriyetè a ka bloke kont
  avatar?: string;
  createdAt: string;
  // Livrè yo: se Pwopriyetè a ki bay aksè
  deliveryApproved?: boolean; // Pwopriyetè a apwouve l kòm livrè ofisyèl
  vehicleType?: string; // e.g. Motosiklèt, Bisiklèt
  licensePlate?: string; // Plak imatrikilasyon
}

export type ProductStatus = 'draft' | 'pending' | 'published' | 'rejected';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerBusiness?: string;
  sellerPhone: string;
  sellerLocation: string; // e.g., 'Bergeau, Leyogàn'
  title: string;
  description: string;
  category: string;
  price: number; // in HTG
  originalPrice?: number; // crossed-out price in HTG
  quantity: number;
  image: string;
  additionalImages?: string[];
  freeShipping?: boolean;
  hasVideo?: boolean;
  rating: number;
  reviewCount: number;
  status: ProductStatus;
  rejectionReason?: string;
  createdAt: string;
  // Livres / Ebooks & Digital properties
  bookFormat?: 'physical' | 'pdf'; // 'physical' = Liv papye, 'pdf' = Ebook PDF
  author?: string; // Otè / Ekriven
  pageCount?: number; // Nonb de paj
  fileSize?: string; // Gwosè fichye PDF (egz: 4.5 MB)
  pdfDownloadUrl?: string; // Lyen telechajman PDF
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'moncash' | 'natcash' | 'crypto';

export type PaymentStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'refunded'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_VERIFICATION'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED';

export type OrderStatus =
  | 'ORDER_CREATED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_VERIFICATION'
  | 'PAYMENT_CONFIRMED'
  | 'PREPARING_ORDER'
  | 'PROCESSING'
  | 'DIGITAL_PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'COURIER_ASSIGNED'
  | 'PICKUP_PENDING'
  | 'PICKED_UP_FROM_SELLER'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED_PENDING_CUSTOMER_CONFIRMATION'
  | 'FULFILLED'
  | 'DIGITAL_FULFILLED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'PAYMENT_FAILED'
  | 'DELIVERY_FAILED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'FAILED'
  | 'REFUNDED'
  // Legacy aliases for backward compatibility
  | 'created'
  | 'payment_pending'
  | 'payment_confirmed'
  | 'pickup_pending'
  | 'agent_assigned'
  | 'product_picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerLocation: string;
  isDigital?: boolean;
  digitalPackageId?: string;
  digitalPackageName?: string;
  digitalFields?: Record<string, string>;
  digitalCategory?: DigitalCategory;
}

export interface SignatureProof {
  signatureDataUri: string;
  signerName: string;
  signerRole: 'seller' | 'buyer' | 'courier';
  signedAt: string;
}

export interface BonDeLivraison {
  documentId: string;
  orderId: string;
  generatedAt: string;
  verificationReference: string;
}

export interface OrderEvent {
  id: string;
  orderId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  eventType: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface OrderNotification {
  id: string;
  userId: string;
  userRole: UserRole;
  orderId?: string;
  type: 'order' | 'payment' | 'pickup' | 'delivery' | 'support' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  orderId?: string;
  oldStatus?: string;
  newStatus?: string;
  timestamp: string;
  details?: string;
  ip?: string;
}

export interface SupportTicket {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerWhatsApp?: string;
  reason: string;
  details: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}

export interface Order {
  id: string; // e.g. #MY-20260914-00125
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerWhatsApp?: string;
  buyerDepartment: string;
  buyerCommune: string;
  buyerZone: string;
  buyerAddress: string;
  buyerNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number; // in HTG
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentRef: string;
  paymentPhone?: string; // sender's phone for MonCash/NatCash
  paymentProofUrl?: string;
  paymentVerificationNote?: string;
  cryptoNetwork?: string;
  cryptoTxHash?: string;
  paymentStatus: PaymentStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  assignedAgentPhone?: string;
  assignedAt?: string;
  deliveryCode: string; // 4-digit code given to buyer, verified by agent on delivery
  deliveryProofNote?: string;
  deliveryEstimate?: string;
  commissionRate: number; // usually 0.10 (10%)
  commissionAmount: number; // in HTG
  vendorPayoutAmount: number; // in HTG
  sellerSignature?: SignatureProof;
  sellerConfirmedHandoverAt?: string;
  courierSignature?: SignatureProof;
  courierConfirmedPickupAt?: string;
  customerSignature?: SignatureProof;
  customerConfirmedDeliveryAt?: string;
  bonDeLivraison?: BonDeLivraison;
  supportTicket?: SupportTicket;
  events?: OrderEvent[];
  orderType?: 'physical' | 'digital';
  isDigital?: boolean;
  digitalDetails?: DigitalOrderDetails;
  createdAt: string;
  updatedAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  reason: string;
  details: string;
  proofUrl?: string;
  status: 'open' | 'investigating' | 'resolved' | 'rejected';
  decision?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  nameHt: string;
  nameFr: string;
  icon: string;
  descriptionHt: string;
  descriptionFr: string;
}

export interface SiteSettings {
  siteName: string;
  sloganHt: string;
  sloganFr: string;
  topBannerNotice: string;
  heroTitleHt: string;
  heroSubtitleHt: string;
  heroBadgeHt: string;
  heroImage: string;
  heroVideoUrl?: string; // YouTube oswa MP4 lyen
  showHeroVideo: boolean;
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  moncashNumber: string;
  moncashName: string;
  natcashNumber: string;
  natcashName: string;
  cryptoUsdtAddress: string;
  commissionPercent: number; // default 10%
  baseDeliveryFee: number; // default 250 HTG
  ownerPin: string; // PIN sekirite pou aksè Pwopriyetè
  ownerName: string;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  subject?: string;
  message: string;
  source: 'chatbot' | 'direct';
  status: 'new' | 'responded' | 'archived';
  createdAt: string;
}

export interface DigitalCustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'tel';
  placeholder: string;
  required: boolean;
  options?: string[];
  helpText?: string;
}

export interface DigitalPackage {
  id: string;
  name: string;
  costPrice: number; // Prix d'achat / coût fournisseur (en HTG ou USD)
  sellingPrice: number; // Prix de vente client
  currency: 'HTG' | 'USD';
  profit?: number; // sellingPrice - costPrice
  marginPercent?: number; // (profit / sellingPrice) * 100
  stock?: number;
  badge?: string;
  providerPackageId?: string;
}

export type DigitalDeliveryType = 'instant_code' | 'manual_recharge' | 'api_recharge';

export type DigitalCategory = 'game_topup' | 'gift_card' | 'virtual_card' | 'mobile_topup';

export interface DigitalService {
  id: string;
  name: string;
  slug: string;
  category: DigitalCategory;
  description: string;
  image: string;
  gallery?: string[];
  providerName: string; // Nom fournisseur
  providerProductId?: string;
  defaultCostPrice: number;
  defaultSellingPrice: number;
  currency: 'HTG' | 'USD';
  profit: number;
  marginPercent: number;
  packages: DigitalPackage[];
  availableCountries: string[];
  availableRegions: string[];
  minDeliveryMinutes: number;
  maxDeliveryMinutes: number;
  deliveryType: 'instant_code' | 'manual_recharge' | 'api_recharge';
  clientInstructions: string;
  termsAndConditions?: string;
  requiredFields: DigitalCustomField[];
  stock?: number;
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalCode {
  id: string;
  serviceId: string;
  packageId?: string;
  code: string;
  pin?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'DELIVERED' | 'USED' | 'EXPIRED' | 'INVALID';
  orderId?: string;
  buyerId?: string;
  assignedAt?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
}

export interface DigitalOrderDetails {
  serviceId: string;
  serviceName: string;
  packageId: string;
  packageName: string;
  category: DigitalCategory;
  requiredFieldsData: Record<string, string>;
  costPrice: number;
  sellingPrice: number;
  profit: number;
  marginPercent: number;
  currency: 'HTG' | 'USD';
  deliveryType: 'instant_code' | 'manual_recharge' | 'api_recharge';
  deliveredCode?: string;
  deliveredPin?: string;
  deliveredAt?: string;
  deliveryNotes?: string;
  providerName?: string;
  estimatedDelivery: string;
  operator?: string;
  targetAccount?: string; // Player ID, phone, etc.
}

export interface ChatSource {
  title: string;
  url?: string;
  type: 'mache_yogann' | 'knowledge_base' | 'web_search';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
  isEscalatedToOwner?: boolean;
  escalationQuestion?: string;
  sources?: ChatSource[];
  usedWebSearch?: boolean;
  escalationType?: 'delivery' | 'technical' | 'human_request' | 'unknown_query';
  escalationDetails?: {
    ticketId?: string;
    orderId?: string;
    customerName?: string;
    customerPhone?: string;
    customerZone?: string;
    problem?: string;
    priority?: 'normal' | 'important' | 'urgent';
    preparedWhatsAppMessage?: string;
    whatsAppUrl?: string;
  };
  diagnosticDone?: boolean;
}

export interface KnowledgeBaseItem {
  id: string;
  category: 'faq' | 'delivery' | 'payment' | 'seller_rules' | 'general' | 'announcement';
  questionOrTopic: string;
  answerOrContent: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AiConversationLog {
  id: string;
  sessionId?: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  userMessage: string;
  botReply: string;
  sources?: ChatSource[];
  usedWebSearch: boolean;
  escalatedToHuman: boolean;
  escalationType?: 'delivery' | 'technical' | 'human_request' | 'unknown_query';
  escalationDetails?: {
    ticketId?: string;
    orderId?: string;
    customerName?: string;
    customerPhone?: string;
    customerZone?: string;
    problem?: string;
    priority?: 'normal' | 'important' | 'urgent';
    preparedWhatsAppMessage?: string;
    whatsAppUrl?: string;
  };
  failedQuestion?: boolean;
  failedReason?: string;
  timestamp: string;
}

export interface SupportBugReport {
  ticketId: string;
  customerId?: string;
  name?: string;
  email?: string;
  phone?: string;
  page?: string;
  url?: string;
  device?: string;
  browser?: string;
  problem: string;
  conversationSummary?: string;
  screenshot?: string;
  priority: 'normal' | 'important' | 'urgent';
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface AiAssistantSettings {
  aiEnabled: boolean;
  webSearchEnabled: boolean;
  humanEscalationEnabled: boolean;
  whatsappEnabled: boolean;
  deliveryEscalationEnabled: boolean;
  technicalSupportEscalationEnabled: boolean;
  sourceDisplayEnabled: boolean;
}

