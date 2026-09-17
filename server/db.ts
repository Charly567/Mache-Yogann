import fs from 'fs';
import path from 'path';
import {
  Order,
  OrderEvent,
  OrderNotification,
  AuditLogEntry,
  OrderStatus,
  PaymentStatus,
  UserRole,
  SignatureProof,
  SupportTicket,
  DigitalService,
  DigitalCode,
  DigitalOrderDetails,
} from '../src/types';
import { INITIAL_DIGITAL_SERVICES, INITIAL_DIGITAL_CODES } from './initialDigitalData';

interface StoreData {
  orders: Order[];
  orderEvents: OrderEvent[];
  notifications: OrderNotification[];
  auditLogs: AuditLogEntry[];
  orderCounter: number;
  digitalServices: DigitalService[];
  digitalCodes: DigitalCode[];
}

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed orders with canonical production statuses
const INITIAL_STORE_ORDERS: Order[] = [
  {
    id: '#MY-20260914-00125',
    buyerId: 'user_buyer_1',
    buyerName: 'Marie Joseph',
    buyerPhone: '+509 37 12 34 56',
    buyerWhatsApp: '+509 37 12 34 56',
    buyerDepartment: 'Lwès (Ouest)',
    buyerCommune: 'Leyogàn (Léogâne)',
    buyerZone: 'Bergeau',
    buyerAddress: 'Toupre legliz Sent Woz, kay ble a #12',
    buyerNotes: 'Rele m sou WhatsApp lè w rive nan kafou a tanpri',
    items: [
      {
        productId: 'prod_1',
        productTitle: 'Dous Makòs & Sirèt Natirèl Leyogàn (Pake Espesyal)',
        productImage: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=700&q=80',
        price: 650,
        quantity: 2,
        sellerId: 'user_seller_1',
        sellerName: 'Jak Pierre',
        sellerPhone: '+509 34 55 67 89',
        sellerLocation: 'Ti Rivyè, Leyogàn',
      },
    ],
    subtotal: 1300,
    deliveryFee: 150,
    total: 1450,
    status: 'OUT_FOR_DELIVERY',
    paymentMethod: 'moncash',
    paymentRef: 'MC-89472910',
    paymentPhone: '+509 37 12 34 56',
    paymentStatus: 'PAYMENT_CONFIRMED',
    assignedAgentId: 'user_agent_1',
    assignedAgentName: 'Wilner Baptiste',
    assignedAgentPhone: '+509 44 22 11 00',
    assignedAt: '2026-09-14T10:15:00Z',
    deliveryCode: '7412',
    deliveryEstimate: '30 - 45 minit (Aktivite livrezon an kou)',
    commissionRate: 0.10,
    commissionAmount: 145,
    vendorPayoutAmount: 1305,
    sellerConfirmedHandoverAt: '2026-09-14T10:45:00Z',
    courierConfirmedPickupAt: '2026-09-14T10:50:00Z',
    bonDeLivraison: {
      documentId: 'BDL-20260914-00125',
      orderId: '#MY-20260914-00125',
      generatedAt: '2026-09-14T09:30:00Z',
      verificationReference: 'MY-VRF-7412-SEC',
    },
    createdAt: '2026-09-14T09:30:00Z',
    updatedAt: '2026-09-14T11:00:00Z',
  },
  {
    id: '#MY-20260914-00126',
    buyerId: 'user_buyer_2',
    buyerName: 'Jean Claude Dorvil',
    buyerPhone: '+509 31 00 22 33',
    buyerWhatsApp: '+509 31 00 22 33',
    buyerDepartment: 'Lwès (Ouest)',
    buyerCommune: 'Leyogàn (Léogâne)',
    buyerZone: 'Ca Ira',
    buyerAddress: 'Kafou Ca Ira, dezyèm ri a goch',
    items: [
      {
        productId: 'prod_6',
        productTitle: 'Lwil Maskreti Otantik Ayisyen & Savon Nwa Aloès',
        productImage: 'https://images.unsplash.com/photo-1608248597359-251e604fef5d?auto=format&fit=crop&w=700&q=80',
        price: 850,
        quantity: 1,
        sellerId: 'user_seller_1',
        sellerName: 'Jak Pierre',
        sellerPhone: '+509 34 55 67 89',
        sellerLocation: 'Ti Rivyè, Leyogàn',
      },
    ],
    subtotal: 850,
    deliveryFee: 150,
    total: 1000,
    status: 'PAYMENT_PENDING',
    paymentMethod: 'natcash',
    paymentRef: 'NC-5531092',
    paymentPhone: '+509 40 11 22 33',
    paymentStatus: 'PAYMENT_PENDING',
    deliveryCode: '3891',
    deliveryEstimate: 'Apre verifikasyon peman pa Pwopriyetè a',
    commissionRate: 0.10,
    commissionAmount: 100,
    vendorPayoutAmount: 900,
    bonDeLivraison: {
      documentId: 'BDL-20260914-00126',
      orderId: '#MY-20260914-00126',
      generatedAt: '2026-09-14T11:20:00Z',
      verificationReference: 'MY-VRF-3891-SEC',
    },
    createdAt: '2026-09-14T11:20:00Z',
    updatedAt: '2026-09-14T11:20:00Z',
  },
];

const INITIAL_EVENTS: OrderEvent[] = [
  {
    id: 'evt_125_1',
    orderId: '#MY-20260914-00125',
    actorId: 'user_buyer_1',
    actorName: 'Marie Joseph',
    actorRole: 'buyer',
    eventType: 'ORDER_CREATED',
    title: 'Kòmand Kreye',
    message: 'Kliyan an pase kòmand #MY-20260914-00125 avèk siksè sou sit la.',
    createdAt: '2026-09-14T09:30:00Z',
  },
  {
    id: 'evt_125_2',
    orderId: '#MY-20260914-00125',
    actorId: 'user_owner_1',
    actorName: 'Pwopriyetè Mache Yogann',
    actorRole: 'owner',
    eventType: 'PAYMENT_CONFIRMED',
    title: 'Peman Resevwa & Verifye',
    message: 'Pwopriyetè a konfime li resevwa peman 1,450 HTG sou MonCash (Ref: MC-89472910).',
    createdAt: '2026-09-14T09:45:00Z',
  },
  {
    id: 'evt_125_3',
    orderId: '#MY-20260914-00125',
    actorId: 'user_seller_1',
    actorName: 'Jak Pierre',
    actorRole: 'seller',
    eventType: 'READY_FOR_PICKUP',
    title: 'Kòmand Pare pou Pickup',
    message: 'Vandè a fin prepare pake machandiz la, li pare pou livrè a vin pran li.',
    createdAt: '2026-09-14T10:10:00Z',
  },
  {
    id: 'evt_125_4',
    orderId: '#MY-20260914-00125',
    actorId: 'user_owner_1',
    actorName: 'Pwopriyetè Mache Yogann',
    actorRole: 'owner',
    eventType: 'COURIER_ASSIGNED',
    title: 'Livrè Asiyen',
    message: 'Livrè Wilner Baptiste (+509 44 22 11 00) asiyen pou ranmase pake a.',
    createdAt: '2026-09-14T10:15:00Z',
  },
  {
    id: 'evt_125_5',
    orderId: '#MY-20260914-00125',
    actorId: 'user_seller_1',
    actorName: 'Jak Pierre',
    actorRole: 'seller',
    eventType: 'PICKED_UP_FROM_SELLER',
    title: 'Vandè Remèt Colis la',
    message: 'Vandè Jak Pierre remèt pake a ofisyèlman bay livrè a nan Ti Rivyè.',
    createdAt: '2026-09-14T10:45:00Z',
  },
  {
    id: 'evt_125_6',
    orderId: '#MY-20260914-00125',
    actorId: 'user_agent_1',
    actorName: 'Wilner Baptiste',
    actorRole: 'agent',
    eventType: 'OUT_FOR_DELIVERY',
    title: 'Livrè Sou Wout pou Livrezon',
    message: 'Wilner Baptiste an wout sou motosiklèt pou ale livre kòmand lan nan Bergeau.',
    createdAt: '2026-09-14T10:55:00Z',
  },
  {
    id: 'evt_126_1',
    orderId: '#MY-20260914-00126',
    actorId: 'user_buyer_2',
    actorName: 'Jean Claude Dorvil',
    actorRole: 'buyer',
    eventType: 'ORDER_CREATED',
    title: 'Kòmand Kreye',
    message: 'Kliyan an pase kòmand #MY-20260914-00126. Peman NatCash ap tann verifikasyon.',
    createdAt: '2026-09-14T11:20:00Z',
  },
  {
    id: 'evt_126_2',
    orderId: '#MY-20260914-00126',
    actorId: 'system',
    actorName: 'Sistèm Mache Yogann',
    actorRole: 'admin',
    eventType: 'PAYMENT_PENDING',
    title: 'Peman ap Tann Verifikasyon',
    message: 'Tranzaksyon NatCash NC-5531092 voye bay Pwopriyetè a pou validasyon manyèl.',
    createdAt: '2026-09-14T11:21:00Z',
  },
];

const INITIAL_NOTIFICATIONS: OrderNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_buyer_1',
    userRole: 'buyer',
    orderId: '#MY-20260914-00125',
    type: 'delivery',
    title: '🛵 Livrè a sou wout pou pote kòmand ou a!',
    message: 'Livrè Wilner Baptiste sou wout pou livre kòmand #MY-20260914-00125 nan Bergeau. Prepare kòd sekirite ou pou lè li rive.',
    isRead: false,
    link: '#MY-20260914-00125',
    createdAt: '2026-09-14T10:55:00Z',
  },
  {
    id: 'notif_2',
    userId: 'user_seller_1',
    userRole: 'seller',
    orderId: '#MY-20260914-00125',
    type: 'pickup',
    title: '🤝 Colis la remèt bay livrè a avèk siksè',
    message: 'Livrè a pran kòmand #MY-20260914-00125. Peman w lan ap disponib le pli vit ke livrezon an konfime.',
    isRead: true,
    link: '#MY-20260914-00125',
    createdAt: '2026-09-14T10:46:00Z',
  },
  {
    id: 'notif_3',
    userId: 'user_owner_1',
    userRole: 'owner',
    orderId: '#MY-20260914-00126',
    type: 'payment',
    title: '💰 Nouvo peman pou verifye pou kòmand #MY-20260914-00126',
    message: 'Kliyan Jean Claude Dorvil soumèt yon peman NatCash (Ref: NC-5531092) pou montan 1,000 HTG.',
    isRead: false,
    link: '#MY-20260914-00126',
    createdAt: '2026-09-14T11:21:00Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit_1',
    actorId: 'user_owner_1',
    actorName: 'Pwopriyetè Mache Yogann',
    actorRole: 'owner',
    action: 'CONFIRM_PAYMENT',
    orderId: '#MY-20260914-00125',
    oldStatus: 'PAYMENT_PENDING',
    newStatus: 'PREPARING_ORDER',
    timestamp: '2026-09-14T09:45:00Z',
    details: 'Verifikasyon MonCash MC-89472910 konfime',
  },
  {
    id: 'audit_2',
    actorId: 'user_owner_1',
    actorName: 'Pwopriyetè Mache Yogann',
    actorRole: 'owner',
    action: 'ASSIGN_COURIER',
    orderId: '#MY-20260914-00125',
    oldStatus: 'READY_FOR_PICKUP',
    newStatus: 'COURIER_ASSIGNED',
    timestamp: '2026-09-14T10:15:00Z',
    details: 'Asiyen bay livrè Wilner Baptiste',
  },
];

class Database {
  private data: StoreData;
  private isSaving = false;
  private pendingSave = false;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StoreData {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          orders: Array.isArray(parsed.orders) && parsed.orders.length > 0 ? parsed.orders : INITIAL_STORE_ORDERS,
          orderEvents: Array.isArray(parsed.orderEvents) ? parsed.orderEvents : INITIAL_EVENTS,
          notifications: Array.isArray(parsed.notifications) ? parsed.notifications : INITIAL_NOTIFICATIONS,
          auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : INITIAL_AUDIT_LOGS,
          orderCounter: parsed.orderCounter || 127,
          digitalServices: Array.isArray(parsed.digitalServices) && parsed.digitalServices.length > 0 ? parsed.digitalServices : INITIAL_DIGITAL_SERVICES,
          digitalCodes: Array.isArray(parsed.digitalCodes) && parsed.digitalCodes.length > 0 ? parsed.digitalCodes : INITIAL_DIGITAL_CODES,
        };
      }
    } catch (e) {
      console.error('Failed to read database store, initializing defaults:', e);
    }

    const defaultData: StoreData = {
      orders: INITIAL_STORE_ORDERS,
      orderEvents: INITIAL_EVENTS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      orderCounter: 127,
      digitalServices: INITIAL_DIGITAL_SERVICES,
      digitalCodes: INITIAL_DIGITAL_CODES,
    };
    this.saveDataDirect(defaultData);
    return defaultData;
  }

  private saveDataDirect(data: StoreData) {
    try {
      const tempFile = `${STORE_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, STORE_FILE);
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  private scheduleSave() {
    if (this.isSaving) {
      this.pendingSave = true;
      return;
    }
    this.isSaving = true;
    setTimeout(() => {
      this.saveDataDirect(this.data);
      this.isSaving = false;
      if (this.pendingSave) {
        this.pendingSave = false;
        this.scheduleSave();
      }
    }, 50);
  }

  // --- ORDER NUMBER GENERATION ---
  generateOrderId(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const serial = String(this.data.orderCounter++).padStart(5, '0');
    this.scheduleSave();
    return `#MY-${yyyy}${mm}${dd}-${serial}`;
  }

  // --- QUERY ORDERS WITH ROLE PERMISSION ---
  getOrders(actorId?: string, actorRole?: UserRole, actorPhone?: string, actorEmail?: string): Order[] {
    const all = this.data.orders;
    const isOwner = actorRole === 'owner' || actorRole === 'admin' || actorEmail?.toLowerCase() === 'machechyogann@gmail.com';

    if (isOwner) {
      return all;
    }

    if (actorRole === 'seller') {
      return all.filter((order) =>
        order.items.some(
          (item) =>
            item.sellerId === actorId ||
            (actorPhone && item.sellerPhone.replace(/\D/g, '') === actorPhone.replace(/\D/g, ''))
        )
      );
    }

    if (actorRole === 'agent') {
      return all.filter(
        (order) =>
          order.assignedAgentId === actorId ||
          (actorPhone && order.assignedAgentPhone && order.assignedAgentPhone.replace(/\D/g, '') === actorPhone.replace(/\D/g, ''))
      );
    }

    // Default buyer view: only see their own orders
    if (actorId || actorPhone || actorEmail) {
      return all.filter(
        (order) =>
          (actorId && order.buyerId === actorId) ||
          (actorPhone && order.buyerPhone.replace(/\D/g, '') === actorPhone.replace(/\D/g, '')) ||
          (actorEmail && order.paymentPhone && order.paymentPhone.toLowerCase() === actorEmail.toLowerCase())
      );
    }

    return all;
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  // --- GET ORDER EVENTS (TIMELINE) ---
  getOrderEvents(orderId: string): OrderEvent[] {
    return this.data.orderEvents
      .filter((e) => e.orderId === orderId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // --- AUDIT LOGS ---
  getAuditLogs(orderId?: string): AuditLogEntry[] {
    if (orderId) {
      return this.data.auditLogs.filter((l) => l.orderId === orderId);
    }
    return this.data.auditLogs.slice().reverse();
  }

  // --- NOTIFICATIONS ---
  getNotifications(userId?: string, userRole?: UserRole): OrderNotification[] {
    const isOwner = userRole === 'owner' || userRole === 'admin';
    return this.data.notifications
      .filter((n) => {
        if (isOwner) return n.userRole === 'owner' || n.userId === userId || n.userId === 'user_owner_1';
        if (userId && n.userId === userId) return true;
        if (userRole && n.userRole === userRole) return true;
        return false;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  markNotificationAsRead(id: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.scheduleSave();
      return true;
    }
    return false;
  }

  markAllNotificationsAsRead(userId?: string, userRole?: UserRole): void {
    const isOwner = userRole === 'owner' || userRole === 'admin';
    this.data.notifications.forEach((n) => {
      if (isOwner && (n.userRole === 'owner' || n.userId === 'user_owner_1' || n.userId === userId)) {
        n.isRead = true;
      } else if (userId && n.userId === userId) {
        n.isRead = true;
      } else if (userRole && n.userRole === userRole) {
        n.isRead = true;
      }
    });
    this.scheduleSave();
  }

  // --- CREATE ORDER WORKFLOW ---
  createOrder(data: {
    buyerId: string;
    buyerName: string;
    buyerPhone: string;
    buyerWhatsApp?: string;
    buyerDepartment: string;
    buyerCommune: string;
    buyerZone: string;
    buyerAddress: string;
    buyerNotes?: string;
    items: any[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: any;
    paymentRef: string;
    paymentPhone?: string;
    cryptoNetwork?: string;
    cryptoTxHash?: string;
    isDigital?: boolean;
    orderType?: 'physical' | 'digital';
    digitalDetails?: DigitalOrderDetails;
  }): { success: boolean; order: Order; message: string } {
    const isDigital = Boolean(
      data.isDigital ||
      data.orderType === 'digital' ||
      data.digitalDetails ||
      data.items.some((item) => item.isDigital || item.productId?.startsWith('dig_svc_'))
    );

    const baseId = this.generateOrderId();
    const orderId = isDigital ? baseId.replace('#MY-', '#MY-DIG-') : baseId;
    const deliveryCode = String(Math.floor(1000 + Math.random() * 9000));
    const now = new Date().toISOString();

    let computedDigitalDetails: DigitalOrderDetails | undefined = data.digitalDetails;

    // Server-side validation and price computation for digital items
    if (isDigital) {
      const digitalItem = data.items.find((i) => i.isDigital || i.productId?.startsWith('dig_svc_'));
      const serviceId = data.digitalDetails?.serviceId || digitalItem?.productId;
      const service = this.data.digitalServices.find((s) => s.id === serviceId);

      if (service) {
        const pkgId = data.digitalDetails?.packageId || digitalItem?.digitalPackageId;
        const pkg = service.packages.find((p) => p.id === pkgId) || service.packages[0];
        const costPrice = pkg ? pkg.costPrice : service.defaultCostPrice;
        const sellingPrice = pkg ? pkg.sellingPrice : service.defaultSellingPrice;
        const profit = sellingPrice - costPrice;
        const marginPercent = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

        computedDigitalDetails = {
          serviceId: service.id,
          serviceName: service.name,
          packageId: pkg ? pkg.id : 'default',
          packageName: pkg ? pkg.name : service.name,
          category: service.category,
          requiredFieldsData: data.digitalDetails?.requiredFieldsData || digitalItem?.digitalFields || {},
          costPrice,
          sellingPrice,
          profit,
          marginPercent,
          currency: (pkg?.currency || service.currency || 'HTG') as 'HTG' | 'USD',
          deliveryType: service.deliveryType,
          providerName: service.providerName,
          estimatedDelivery: `${service.minDeliveryMinutes} - ${service.maxDeliveryMinutes} minit`,
          targetAccount:
            data.digitalDetails?.targetAccount ||
            data.digitalDetails?.requiredFieldsData?.playerId ||
            data.digitalDetails?.requiredFieldsData?.phoneNumber ||
            data.digitalDetails?.requiredFieldsData?.robloxUsername ||
            data.buyerPhone,
        };
      }
    }

    const commissionRate = isDigital ? 0 : 0.10;
    const commissionAmount = isDigital ? 0 : Math.round(data.total * commissionRate);
    const vendorPayoutAmount = isDigital ? data.total : data.total - commissionAmount;

    const newOrder: Order = {
      id: orderId,
      buyerId: data.buyerId,
      buyerName: data.buyerName,
      buyerPhone: data.buyerPhone,
      buyerWhatsApp: data.buyerWhatsApp || data.buyerPhone,
      buyerDepartment: data.buyerDepartment || 'Lwès (Ouest)',
      buyerCommune: data.buyerCommune || 'Leyogàn (Léogâne)',
      buyerZone: data.buyerZone || 'Sant Vil',
      buyerAddress: data.buyerAddress || 'Sèvis Dijital San Livrezon Fizik',
      buyerNotes: data.buyerNotes,
      items: data.items,
      subtotal: data.subtotal,
      deliveryFee: isDigital ? 0 : data.deliveryFee,
      total: isDigital ? data.subtotal : data.total,
      status: 'PAYMENT_PENDING',
      paymentMethod: data.paymentMethod,
      paymentRef: data.paymentRef,
      paymentPhone: data.paymentPhone || data.buyerPhone,
      cryptoNetwork: data.cryptoNetwork,
      cryptoTxHash: data.cryptoTxHash,
      paymentStatus: 'PAYMENT_PENDING',
      deliveryCode,
      deliveryEstimate: isDigital
        ? (computedDigitalDetails?.estimatedDelivery || '5 a 30 minit apre verifikasyon peman')
        : 'Apre verifikasyon peman (apeprè 1 a 2 èdtan nan Leyogàn)',
      commissionRate,
      commissionAmount,
      vendorPayoutAmount,
      isDigital,
      orderType: isDigital ? 'digital' : 'physical',
      digitalDetails: computedDigitalDetails,
      bonDeLivraison: isDigital ? undefined : {
        documentId: `BDL-${orderId.replace('#', '')}`,
        orderId,
        generatedAt: now,
        verificationReference: `MY-VRF-${deliveryCode}-SEC`,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.data.orders.unshift(newOrder);

    // 1. Event: ORDER_CREATED
    this.addEvent({
      orderId,
      actorId: data.buyerId,
      actorName: data.buyerName,
      actorRole: 'buyer',
      eventType: isDigital ? 'DIGITAL_ORDER_CREATED' : 'ORDER_CREATED',
      title: isDigital ? 'Kòmand Dijital Kreye' : 'Kòmand Kreye',
      message: isDigital
        ? `Kòmand sèvis dijital ${orderId} (${computedDigitalDetails?.serviceName || 'Sèvis'}) anrejistre pou ${newOrder.total.toLocaleString()} HTG.`
        : `Kòmand ${orderId} soumèt avèk siksè. Montan total: ${data.total.toLocaleString()} HTG.`,
    });

    // 2. Event: PAYMENT_PENDING
    this.addEvent({
      orderId,
      actorId: 'system',
      actorName: 'Sistèm Mache Yogann',
      actorRole: 'admin',
      eventType: 'PAYMENT_PENDING',
      title: 'Peman ap Verifye',
      message: `Peman pa ${data.paymentMethod.toUpperCase()} (Ref: ${data.paymentRef}) soumèt bay Pwopriyetè a pou verifikasyon.`,
    });

    // 3. Notification to Customer
    this.addNotification({
      userId: data.buyerId,
      userRole: 'buyer',
      orderId,
      type: 'order',
      title: isDigital ? `🎮 Kòmand ${orderId} anrejistre avèk siksè` : `🛍️ Kòmand ${orderId} kreye avèk siksè`,
      message: isDigital
        ? `Kòmand dijital ou a (${computedDigitalDetails?.serviceName}) anrejistre. Pwopriyetè a ap verifye peman ou kounye a pou trete sèvis la.`
        : `Kòmand ou an anrejistre. Peman ou ap verifye kounye a pa Mache Yogann. Kòd sekirite ou se: ${deliveryCode}.`,
      link: orderId,
    });

    // 4. Notification to Owner
    this.addNotification({
      userId: 'user_owner_1',
      userRole: 'owner',
      orderId,
      type: 'payment',
      title: isDigital
        ? `⚡ NOUVO SÈVIS DIJITAL: ${computedDigitalDetails?.serviceName || 'Sèvis'} (${orderId})`
        : `💰 Nouvo kòmand ${orderId} ap tann verifikasyon peman`,
      message: isDigital
        ? `Kliyan ${data.buyerName} peye ${newOrder.total.toLocaleString()} HTG pa ${data.paymentMethod.toUpperCase()} (Ref: ${data.paymentRef}) pou ${computedDigitalDetails?.serviceName} - ${computedDigitalDetails?.packageName}.`
        : `Kliyan ${data.buyerName} soumèt yon peman ${data.total.toLocaleString()} HTG pa ${data.paymentMethod.toUpperCase()} (Ref: ${data.paymentRef}).`,
      link: orderId,
    });

    // 5. Notification to Sellers (ONLY for physical marketplace items)
    if (!isDigital) {
      const uniqueSellerIds = Array.from(new Set(data.items.map((i) => i.sellerId)));
      uniqueSellerIds.forEach((sId) => {
        this.addNotification({
          userId: sId,
          userRole: 'seller',
          orderId,
          type: 'order',
          title: `📦 Nouvo kòmand plase: ${orderId}`,
          message: `Yon kliyan plase yon kòmand sou pwodwi w yo. Peman an ap verifye kounye a anvan preparasyon.`,
          link: orderId,
        });
      });
    }

    // 6. Audit Log
    this.addAuditLog({
      actorId: data.buyerId,
      actorName: data.buyerName,
      actorRole: 'buyer',
      action: isDigital ? 'DIGITAL_ORDER_CREATED' : 'CREATE_ORDER',
      orderId,
      newStatus: 'PAYMENT_PENDING',
      details: isDigital
        ? `Kòmand sèvis dijital ${orderId} kreye pou ${computedDigitalDetails?.serviceName} (${newOrder.total} HTG via ${data.paymentMethod})`
        : `Kòmand ${orderId} kreye pou ${data.total} HTG via ${data.paymentMethod}`,
    });

    this.scheduleSave();
    return { success: true, order: newOrder, message: 'Kòmand kreye avèk siksè' };
  }

  // --- VERIFY PAYMENT (OWNER ONLY) ---
  verifyPayment(
    orderId: string,
    action: 'confirm' | 'reject' | 'request_verification',
    note?: string,
    actorId = 'user_owner_1',
    actorName = 'Pwopriyetè Mache Yogann'
  ): { success: boolean; order?: Order; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand sa a pa egziste' };

    // Prevent double verification
    if (action === 'confirm' && order.paymentStatus === 'PAYMENT_CONFIRMED') {
      return { success: false, message: 'Peman sa a te deja konfime!' };
    }

    const oldStatus = order.status;
    const now = new Date().toISOString();

    if (action === 'confirm') {
      order.paymentStatus = 'PAYMENT_CONFIRMED';
      order.status = order.isDigital ? 'DIGITAL_PROCESSING' : 'PREPARING_ORDER';
      order.paymentVerificationNote = note || 'Peman verifye epi konfime pa Pwopriyetè a.';
      order.updatedAt = now;

      // Event: PAYMENT_CONFIRMED
      this.addEvent({
        orderId,
        actorId,
        actorName,
        actorRole: 'owner',
        eventType: 'PAYMENT_CONFIRMED',
        title: 'Peman Konfime pa Pwopriyetè a',
        message: order.isDigital
          ? `Peman ${order.total.toLocaleString()} HTG konfime. Sèvis dijital la kounye a an tretman pou livrezon dirèk.`
          : `Peman ${order.total.toLocaleString()} HTG konfime avèk siksè. Kòmand lan kounye a ap prepare pa vandè a.`,
      });

      if (order.isDigital) {
        // Event: DIGITAL_PROCESSING
        this.addEvent({
          orderId,
          actorId,
          actorName,
          actorRole: 'owner',
          eventType: 'DIGITAL_PROCESSING',
          title: 'Recharge / Sèvis an Kou de Tretman',
          message: `Pwopriyetè Mache Yogann ap trete recharge la pou kont ${order.digitalDetails?.targetAccount || 'kliyan an'}.`,
        });
      }

      // Notification Customer
      this.addNotification({
        userId: order.buyerId,
        userRole: 'buyer',
        orderId,
        type: 'payment',
        title: `✅ Peman kòmand ${orderId} konfime!`,
        message: order.isDigital
          ? `Peman ou pou ${order.digitalDetails?.serviceName || 'sèvis dijital'} konfime! Ekip la ap trete livrezon kòd ou oswa recharge ou kounye a.`
          : `Peman kòmand ${orderId} ou an konfime pa Mache Yogann. Kòmand ou a ap prepare kounye a kay vandè a.`,
        link: orderId,
      });

      // Notification Seller (only for physical)
      if (!order.isDigital) {
        const uniqueSellerIds = Array.from(new Set(order.items.map((i) => i.sellerId)));
        uniqueSellerIds.forEach((sId) => {
          this.addNotification({
            userId: sId,
            userRole: 'seller',
            orderId,
            type: 'order',
            title: `🔔 Nouvo kòmand peye konfime: ${orderId}`,
            message: `Peman kòmand ${orderId} an konfime. Tanpri prepare machandiz yo kounye a pou livrè a vin pran yo!`,
            link: orderId,
          });
        });
      }

      // Notification Owner
      this.addNotification({
        userId: 'user_owner_1',
        userRole: 'owner',
        orderId,
        type: 'payment',
        title: order.isDigital
          ? `⚡ AKSYON REKÒMANDE: Trete recharge ${orderId}`
          : `💰 Peman konfime pou kòmand ${orderId}`,
        message: order.isDigital
          ? `Ou konfime peman pou ${order.digitalDetails?.serviceName} (${order.total.toLocaleString()} HTG). Ale nan seksyon Sèvis Numériques pou konfime livrezon an.`
          : `Ou konfime peman ${order.total.toLocaleString()} HTG pou kòmand ${orderId}.`,
        link: orderId,
      });

      // Audit Log
      this.addAuditLog({
        actorId,
        actorName,
        actorRole: 'owner',
        action: 'CONFIRM_PAYMENT',
        orderId,
        oldStatus,
        newStatus: order.status,
        details: `Peman ${order.total} HTG konfime (Ref: ${order.paymentRef}). Nòt: ${note || 'Oto-apwobasyon'}`,
      });
    } else if (action === 'reject') {
      order.paymentStatus = 'PAYMENT_FAILED';
      order.status = 'PAYMENT_FAILED';
      order.paymentVerificationNote = note || 'Peman pa t ka verifye (referans envalid oswa mank fon).';
      order.updatedAt = now;

      this.addEvent({
        orderId,
        actorId,
        actorName,
        actorRole: 'owner',
        eventType: 'PAYMENT_FAILED',
        title: 'Peman Rejte / Pa Valid',
        message: `Pwopriyetè a rejte peman sa a. Rezon: ${note || 'Referans pa kowenside ak kont MonCash/NatCash nou an.'}`,
      });

      this.addNotification({
        userId: order.buyerId,
        userRole: 'buyer',
        orderId,
        type: 'payment',
        title: `❌ Peman kòmand ${orderId} pa reyisi`,
        message: `Nou pa t ka verifye tranzaksyon peman ou a: ${note || 'Tanpri rekòmanse oswa kontakte sipò Mache Yogann sou WhatsApp.'}`,
        link: orderId,
      });

      this.addAuditLog({
        actorId,
        actorName,
        actorRole: 'owner',
        action: 'REJECT_PAYMENT',
        orderId,
        oldStatus,
        newStatus: 'PAYMENT_FAILED',
        details: `Peman rejte pou ${orderId}: ${note || 'Pa gen detay'}`,
      });
    }

    this.scheduleSave();
    return { success: true, order, message: `Aksyon sou peman an fèt avèk siksè` };
  }

  // --- SELLER MARKS READY ---
  markOrderReady(
    orderId: string,
    actorId: string,
    actorName: string
  ): { success: boolean; order?: Order; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand sa a pa egziste' };

    if (order.status !== 'PREPARING_ORDER' && order.status !== 'PAYMENT_CONFIRMED') {
      return { success: false, message: `Kòmand lan pa nan eta preparasyon (Eta aktyèl: ${order.status})` };
    }

    const oldStatus = order.status;
    order.status = 'READY_FOR_PICKUP';
    order.updatedAt = new Date().toISOString();

    // Event: READY_FOR_PICKUP
    this.addEvent({
      orderId,
      actorId,
      actorName,
      actorRole: 'seller',
      eventType: 'READY_FOR_PICKUP',
      title: 'Kòmand Pare pou Pickup',
      message: `Vandè ${actorName} fin prepare machandiz yo. Pake a pare pou yon livrè pase pran li.`,
    });

    // Customer Notification
    this.addNotification({
      userId: order.buyerId,
      userRole: 'buyer',
      orderId,
      type: 'order',
      title: `📦 Bon nouvèl! Kòmand ${orderId} pare`,
      message: `Kòmand ou a pare pou livrè a vin pran li nan men vandè a pou livrezon.`,
      link: orderId,
    });

    // Owner Notification
    this.addNotification({
      userId: 'user_owner_1',
      userRole: 'owner',
      orderId,
      type: 'pickup',
      title: `📦 Kòmand ${orderId} pare pou pickup`,
      message: `Vandè a pare pake a. Asiyen yon livrè pou ranmase l si sa poko fèt.`,
      link: orderId,
    });

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'seller',
      action: 'MARK_READY',
      orderId,
      oldStatus,
      newStatus: 'READY_FOR_PICKUP',
    });

    this.scheduleSave();
    return { success: true, order, message: 'Kòmand lan pare pou pickup' };
  }

  // --- OWNER ASSIGNS COURIER ---
  assignCourier(
    orderId: string,
    courierId: string,
    courierName: string,
    courierPhone: string,
    actorId = 'user_owner_1',
    actorName = 'Pwopriyetè Mache Yogann'
  ): { success: boolean; order?: Order; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand sa a pa egziste' };

    const oldStatus = order.status;
    const now = new Date().toISOString();

    order.assignedAgentId = courierId;
    order.assignedAgentName = courierName;
    order.assignedAgentPhone = courierPhone;
    order.assignedAt = now;

    // Only update status if before transit
    if (order.status === 'READY_FOR_PICKUP' || order.status === 'PREPARING_ORDER' || order.status === 'PAYMENT_CONFIRMED') {
      order.status = 'COURIER_ASSIGNED';
    }
    order.updatedAt = now;

    // Event
    this.addEvent({
      orderId,
      actorId,
      actorName,
      actorRole: 'owner',
      eventType: 'COURIER_ASSIGNED',
      title: 'Livrè Asiyen',
      message: `Livrè ${courierName} (${courierPhone}) asiyen pa Pwopriyetè a pou livre kòmand lan.`,
    });

    // Notification to Customer
    this.addNotification({
      userId: order.buyerId,
      userRole: 'buyer',
      orderId,
      type: 'delivery',
      title: `🚚 Yon livrè te asiyen pou kòmand ou ${orderId}`,
      message: `Livrè ${courierName} (${courierPhone}) ap okipe kòmand ou a.`,
      link: orderId,
    });

    // Notification to Seller
    const uniqueSellerIds = Array.from(new Set(order.items.map((i) => i.sellerId)));
    uniqueSellerIds.forEach((sId) => {
      this.addNotification({
        userId: sId,
        userRole: 'seller',
        orderId,
        type: 'pickup',
        title: `🚚 Livrè asiyen pou kòmand ${orderId}`,
        message: `Livrè ${courierName} (${courierPhone}) ap vini pran kòmand lan byento.`,
        link: orderId,
      });
    });

    // Notification to Courier
    this.addNotification({
      userId: courierId,
      userRole: 'agent',
      orderId,
      type: 'delivery',
      title: `🛵 Nouvo kòmand asiyen pou ou: ${orderId}`,
      message: `Ou resevwa misyon livrezon pou kòmand ${orderId} (Zòn: ${order.buyerZone}, Leyogàn).`,
      link: orderId,
    });

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'owner',
      action: 'ASSIGN_COURIER',
      orderId,
      oldStatus,
      newStatus: order.status,
      details: `Livrè ${courierName} asiyen`,
    });

    this.scheduleSave();
    return { success: true, order, message: 'Livrè asiyen avèk siksè' };
  }

  // --- SELLER HANDS OVER PACKAGE (WITH SELLER SIGNATURE) ---
  sellerHandover(
    orderId: string,
    signatureDataUri: string,
    actorId: string,
    actorName: string
  ): { success: boolean; order?: Order; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand sa a pa egziste' };

    if (!order.assignedAgentId) {
      return { success: false, message: 'Pa gen okenn livrè ki asiyen sou kòmand sa a ankò.' };
    }

    const oldStatus = order.status;
    const now = new Date().toISOString();

    const signature: SignatureProof = {
      signatureDataUri,
      signerName: actorName,
      signerRole: 'seller',
      signedAt: now,
    };

    order.sellerSignature = signature;
    order.sellerConfirmedHandoverAt = now;
    order.status = 'PICKED_UP_FROM_SELLER';
    order.updatedAt = now;

    // Event
    this.addEvent({
      orderId,
      actorId,
      actorName,
      actorRole: 'seller',
      eventType: 'PICKED_UP_FROM_SELLER',
      title: 'Vandè Remèt Colis la bay Livrè a',
      message: `Vandè ${actorName} konfime remiz colis la bay livrè ${order.assignedAgentName || 'Livrè Mache Yogann'}. Siyati anrejistre.`,
    });

    // Notification Customer
    this.addNotification({
      userId: order.buyerId,
      userRole: 'buyer',
      orderId,
      type: 'pickup',
      title: `🚚 Kòmand ou ${orderId} soti nan men vandè a`,
      message: `Livrè a pran colis la nan men vandè a epi li kòmanse etap livrezon an.`,
      link: orderId,
    });

    // Notification Courier
    if (order.assignedAgentId) {
      this.addNotification({
        userId: order.assignedAgentId,
        userRole: 'agent',
        orderId,
        type: 'pickup',
        title: `📦 Vandè a konfime li remèt ou kòmand ${orderId}`,
        message: `Ou ka klike pou konfime pickup epi kòmanse wout livrezon an.`,
        link: orderId,
      });
    }

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'seller',
      action: 'SELLER_HANDOVER_CONFIRMED',
      orderId,
      oldStatus,
      newStatus: 'PICKED_UP_FROM_SELLER',
      details: `Remiz colis konfime ak siyati vandè a`,
    });

    this.scheduleSave();
    return { success: true, order, message: 'Remiz colis la konfime ak siksè' };
  }

  // --- COURIER CONFIRMS PICKUP & STARTS IN TRANSIT ---
  courierConfirmPickup(
    orderId: string,
    actorId: string,
    actorName: string,
    signatureDataUri?: string
  ): { success: boolean; order?: Order; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand sa a pa egziste' };

    if (order.assignedAgentId && order.assignedAgentId !== actorId && actorId !== 'user_owner_1') {
      return { success: false, message: 'Ou pa livrè ki asiyen pou kòmand sa a!' };
    }

    const oldStatus = order.status;
    const now = new Date().toISOString();

    if (signatureDataUri) {
      order.courierSignature = {
        signatureDataUri,
        signerName: actorName,
        signerRole: 'courier',
        signedAt: now,
      };
    }

    order.courierConfirmedPickupAt = now;
    order.status = 'IN_TRANSIT';
    order.updatedAt = now;

    // Event
    this.addEvent({
      orderId,
      actorId,
      actorName,
      actorRole: 'agent',
      eventType: 'IN_TRANSIT',
      title: 'Livrè Konfime Pickup · An Tranzit',
      message: `Livrè ${actorName} konfime li resevwa pake a nan men vandè a epi li an tranzit.`,
    });

    // Customer Notification
    this.addNotification({
      userId: order.buyerId,
      userRole: 'buyer',
      orderId,
      type: 'delivery',
      title: `🚚 Kòmand ${orderId} sou wout pou ale jwenn ou`,
      message: `Livrè ${actorName} gen koli w la sou motosiklèt li, li sou wout pou zòn ${order.buyerZone}.`,
      link: orderId,
    });

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'agent',
      action: 'COURIER_PICKUP_CONFIRMED',
      orderId,
      oldStatus,
      newStatus: 'IN_TRANSIT',
    });

    this.scheduleSave();
    return { success: true, order, message: 'Pickup konfime, kòmand an tranzit' };
  }

  // --- COURIER OUT FOR DELIVERY ---
  courierOutForDelivery(
    orderId: string,
    actorId: string,
    actorName: string
  ): { success: boolean; order?: Order; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand sa a pa egziste' };

    const oldStatus = order.status;
    order.status = 'OUT_FOR_DELIVERY';
    order.updatedAt = new Date().toISOString();

    this.addEvent({
      orderId,
      actorId,
      actorName,
      actorRole: 'agent',
      eventType: 'OUT_FOR_DELIVERY',
      title: 'Livrè Toupre Destinasyon · En Livraison',
      message: `Livrè ${actorName} ap fè dènye etap livrezon an pou pote kòmand lan nan ${order.buyerAddress}, ${order.buyerZone}.`,
    });

    this.addNotification({
      userId: order.buyerId,
      userRole: 'buyer',
      orderId,
      type: 'delivery',
      title: `🛵 Livrè a sou wout pou pote kòmand ou a!`,
      message: `Livrè a ap rive nan kèk minit nan adrès ou a. Tanpri pare kòd sekirite w: ${order.deliveryCode}.`,
      link: orderId,
    });

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'agent',
      action: 'OUT_FOR_DELIVERY',
      orderId,
      oldStatus,
      newStatus: 'OUT_FOR_DELIVERY',
    });

    this.scheduleSave();
    return { success: true, order, message: 'Kòmand lan pase an livrezon dirèk' };
  }

  // --- CUSTOMER CONFIRMS RECEIPT & SIGNS ---
  customerConfirmReceipt(
    orderId: string,
    signatureDataUri: string,
    actorId: string,
    actorName: string
  ): { success: boolean; order?: Order; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand sa a pa egziste' };

    const oldStatus = order.status;
    const now = new Date().toISOString();

    const signature: SignatureProof = {
      signatureDataUri,
      signerName: actorName,
      signerRole: 'buyer',
      signedAt: now,
    };

    order.customerSignature = signature;
    order.customerConfirmedDeliveryAt = now;
    order.status = 'DELIVERED_PENDING_CUSTOMER_CONFIRMATION';
    order.updatedAt = now;

    // Event
    this.addEvent({
      orderId,
      actorId,
      actorName,
      actorRole: 'buyer',
      eventType: 'DELIVERED_PENDING_CUSTOMER_CONFIRMATION',
      title: 'Achtè Konfime Resepsyon & Siyen',
      message: `Kliyan ${actorName} konfime li resevwa kòmand lan an bon eta epi li siyen prèv livrezon an.`,
    });

    // Notification Courier
    if (order.assignedAgentId) {
      this.addNotification({
        userId: order.assignedAgentId,
        userRole: 'agent',
        orderId,
        type: 'delivery',
        title: `🤝 Kliyan an konfime li resevwa kòmand ${orderId}`,
        message: `Kliyan an siyen. Ou ka klike pou fè final confirmation livrezon an.`,
        link: orderId,
      });
    }

    // Notification Owner
    this.addNotification({
      userId: 'user_owner_1',
      userRole: 'owner',
      orderId,
      type: 'delivery',
      title: `✅ Resepsyon siyen pou kòmand ${orderId}`,
      message: `Kliyan ${actorName} siyen pou resepsyon kòmand ${orderId}.`,
      link: orderId,
    });

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'buyer',
      action: 'CUSTOMER_RECEIPT_CONFIRMED',
      orderId,
      oldStatus,
      newStatus: 'DELIVERED_PENDING_CUSTOMER_CONFIRMATION',
    });

    this.scheduleSave();
    return { success: true, order, message: 'Resepsyon konfime avèk siksè' };
  }

  // --- COURIER FINAL DELIVERY COMPLETION ---
  courierCompleteDelivery(
    orderId: string,
    actorId: string,
    actorName: string,
    deliveryCodeProvided?: string
  ): { success: boolean; order?: Order; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand sa a pa egziste' };

    // Validation
    if (order.status === 'DELIVERED') {
      return { success: false, message: 'Kòmand sa a te deja make kòm livre nèt!' };
    }

    if (order.assignedAgentId && order.assignedAgentId !== actorId && actorId !== 'user_owner_1') {
      return { success: false, message: 'Ou pa livrè ki asiyen sou kòmand sa a!' };
    }

    // Check delivery code if provided
    if (deliveryCodeProvided && deliveryCodeProvided.trim() !== order.deliveryCode) {
      return { success: false, message: 'Kòd sekirite 4 chif la pa kòrèk! Mande kliyan an kòd li a.' };
    }

    const oldStatus = order.status;
    const now = new Date().toISOString();

    order.status = 'DELIVERED';
    order.updatedAt = now;

    // Event: DELIVERED
    this.addEvent({
      orderId,
      actorId,
      actorName,
      actorRole: 'agent',
      eventType: 'DELIVERED',
      title: 'Livrezon Konfime Nèt · DELIVERED',
      message: `Livrezon kòmand ${orderId} konplete avèk siksè pa livrè ${actorName}. Tranzaksyon an fèmen an sekirite.`,
    });

    // Customer Notification
    this.addNotification({
      userId: order.buyerId,
      userRole: 'buyer',
      orderId,
      type: 'delivery',
      title: `🎉 Kòmand ${orderId} delivre avèk siksè!`,
      message: `Mèsi paske ou te itilize Mache Yogann! Kòmand ou an fèmen avèk siksè. Bon apresyasyon machandiz ou yo!`,
      link: orderId,
    });

    // Seller Notification
    const uniqueSellerIds = Array.from(new Set(order.items.map((i) => i.sellerId)));
    uniqueSellerIds.forEach((sId) => {
      this.addNotification({
        userId: sId,
        userRole: 'seller',
        orderId,
        type: 'delivery',
        title: `💰 Livrezon konfime pou kòmand ${orderId}`,
        message: `Kliyan an resevwa machandiz yo! Peman net ou (${order.vendorPayoutAmount.toLocaleString()} HTG) pare pou debousman.`,
        link: orderId,
      });
    });

    // Owner Notification
    this.addNotification({
      userId: 'user_owner_1',
      userRole: 'owner',
      orderId,
      type: 'delivery',
      title: `✅ Livrezon konplete: ${orderId}`,
      message: `Livrè ${actorName} konplete livrezon an. Komisyon platfòm: ${order.commissionAmount.toLocaleString()} HTG.`,
      link: orderId,
    });

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'agent',
      action: 'FINAL_DELIVERY_CONFIRMED',
      orderId,
      oldStatus,
      newStatus: 'DELIVERED',
      details: 'Livrezon konplete avèk siksè',
    });

    this.scheduleSave();
    return { success: true, order, message: 'Livrezon konplete avèk siksè' };
  }

  // --- REPORT PROBLEM / SUPPORT TICKET ---
  reportProblem(
    orderId: string,
    data: {
      customerId: string;
      customerName: string;
      customerPhone: string;
      customerWhatsApp?: string;
      reason: string;
      details: string;
    }
  ): { success: boolean; ticket: SupportTicket; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, ticket: {} as any, message: 'Kòmand pa jwenn' };

    const ticketId = `TKT-${Date.now()}`;
    const now = new Date().toISOString();

    const ticket: SupportTicket = {
      id: ticketId,
      orderId,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerWhatsApp: data.customerWhatsApp,
      reason: data.reason,
      details: data.details,
      status: 'open',
      createdAt: now,
    };

    order.supportTicket = ticket;
    order.updatedAt = now;

    // Event
    this.addEvent({
      orderId,
      actorId: data.customerId,
      actorName: data.customerName,
      actorRole: 'buyer',
      eventType: 'SUPPORT_TICKET_CREATED',
      title: 'Pwoblèm Rapòte pa Kliyan an',
      message: `Rezon: ${data.reason}. Detay: ${data.details}`,
    });

    // Owner Notification
    this.addNotification({
      userId: 'user_owner_1',
      userRole: 'owner',
      orderId,
      type: 'support',
      title: `🚨 Pwoblèm rapòte sou kòmand ${orderId}`,
      message: `Kliyan ${data.customerName} rapòte: "${data.reason}". WhatsApp: ${data.customerPhone}.`,
      link: orderId,
    });

    this.addAuditLog({
      actorId: data.customerId,
      actorName: data.customerName,
      actorRole: 'buyer',
      action: 'REPORT_PROBLEM',
      orderId,
      details: `Tikè sipò kreye: ${data.reason}`,
    });

    this.scheduleSave();
    return { success: true, ticket, message: 'Rapò ou anrejistre avèk siksè' };
  }

  // =========================================================================
  // --- DIGITAL SERVICES MODULE (PROPRIÉTAIRE / SUPER ADMIN EXCLUSIF) ---
  // =========================================================================

  // --- QUERY DIGITAL SERVICES ---
  getDigitalServices(options?: {
    publishedOnly?: boolean;
    activeOnly?: boolean;
    category?: string;
    search?: string;
  }): DigitalService[] {
    let list = this.data.digitalServices || [];

    if (options?.publishedOnly) {
      list = list.filter((s) => s.isPublished);
    }
    if (options?.activeOnly) {
      list = list.filter((s) => s.isActive);
    }
    if (options?.category && options.category !== 'all') {
      list = list.filter((s) => s.category === options.category);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    return list;
  }

  getDigitalServiceById(id: string): DigitalService | null {
    return this.data.digitalServices.find((s) => s.id === id) || null;
  }

  getDigitalServiceBySlug(slug: string): DigitalService | null {
    return this.data.digitalServices.find((s) => s.slug === slug) || null;
  }

  // --- CREATE DIGITAL SERVICE (OWNER ONLY) ---
  createDigitalService(
    data: Partial<DigitalService>,
    actor: { id: string; name: string; role: string }
  ): { success: boolean; service?: DigitalService; message: string } {
    if (actor.role !== 'owner' && actor.role !== 'admin') {
      return { success: false, message: 'Aksè refize. Se sèlman Pwopriyetè a ki gen dwa kreye sèvis dijital.' };
    }

    if (!data.name || !data.category) {
      return { success: false, message: 'Non ak kategori sèvis la obligatwa.' };
    }

    const now = new Date().toISOString();
    const id = `dig_svc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const slug = (data.slug || data.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const defaultCost = Number(data.defaultCostPrice) || 0;
    const defaultSelling = Number(data.defaultSellingPrice) || 0;
    const profit = Math.max(0, defaultSelling - defaultCost);
    const marginPercent = defaultSelling > 0 ? Number(((profit / defaultSelling) * 100).toFixed(1)) : 0;

    const packages = Array.isArray(data.packages)
      ? data.packages.map((pkg, idx) => {
          const c = Number(pkg.costPrice) || 0;
          const s = Number(pkg.sellingPrice) || 0;
          const p = s - c;
          return {
            ...pkg,
            id: pkg.id || `pkg_${idx}_${Date.now()}`,
            profit: p,
            marginPercent: s > 0 ? Number(((p / s) * 100).toFixed(1)) : 0,
            currency: pkg.currency || 'HTG',
          };
        })
      : [];

    const newService: DigitalService = {
      id,
      name: data.name,
      slug,
      category: data.category as any,
      description: data.description || '',
      image: data.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      gallery: data.gallery || [],
      providerName: data.providerName || 'Fournisseur Direct Mache Yogann',
      providerProductId: data.providerProductId || '',
      defaultCostPrice: defaultCost,
      defaultSellingPrice: defaultSelling,
      currency: (data.currency as any) || 'HTG',
      profit,
      marginPercent,
      packages,
      availableCountries: data.availableCountries || ['HT', 'Tout'],
      availableRegions: data.availableRegions || ['Global'],
      minDeliveryMinutes: Number(data.minDeliveryMinutes) || 5,
      maxDeliveryMinutes: Number(data.maxDeliveryMinutes) || 30,
      deliveryType: data.deliveryType || 'manual_recharge',
      clientInstructions: data.clientInstructions || 'Antre enfòmasyon egzak kont ou an.',
      termsAndConditions: data.termsAndConditions,
      requiredFields: data.requiredFields || [
        {
          id: 'account_identifier',
          label: 'ID Kont oswa Nimewo',
          type: 'text',
          placeholder: 'Egzanp: Player ID oswa Nimewo',
          required: true,
        },
      ],
      isActive: data.isActive !== false,
      isPublished: data.isPublished !== false,
      isFeatured: Boolean(data.isFeatured),
      createdAt: now,
      updatedAt: now,
    };

    this.data.digitalServices.unshift(newService);

    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role as any,
      action: 'OWNER_CREATED_DIGITAL_SERVICE',
      details: `Kreyasyon sèvis dijital "${newService.name}" (${newService.category})`,
    });

    this.scheduleSave();
    return { success: true, service: newService, message: 'Sèvis dijital kreye avèk siksè!' };
  }

  // --- UPDATE DIGITAL SERVICE (OWNER ONLY) ---
  updateDigitalService(
    id: string,
    data: Partial<DigitalService>,
    actor: { id: string; name: string; role: string }
  ): { success: boolean; service?: DigitalService; message: string } {
    if (actor.role !== 'owner' && actor.role !== 'admin') {
      return { success: false, message: 'Aksè refize. Se sèlman Pwopriyetè a ki ka modifye sèvis dijital.' };
    }

    const serviceIndex = this.data.digitalServices.findIndex((s) => s.id === id);
    if (serviceIndex === -1) {
      return { success: false, message: 'Sèvis dijital sa a pa egziste.' };
    }

    const current = this.data.digitalServices[serviceIndex];
    const now = new Date().toISOString();

    const defaultCost = data.defaultCostPrice !== undefined ? Number(data.defaultCostPrice) : current.defaultCostPrice;
    const defaultSelling = data.defaultSellingPrice !== undefined ? Number(data.defaultSellingPrice) : current.defaultSellingPrice;
    const profit = Math.max(0, defaultSelling - defaultCost);
    const marginPercent = defaultSelling > 0 ? Number(((profit / defaultSelling) * 100).toFixed(1)) : 0;

    let packages = current.packages;
    if (Array.isArray(data.packages)) {
      packages = data.packages.map((pkg, idx) => {
        const c = Number(pkg.costPrice) || 0;
        const s = Number(pkg.sellingPrice) || 0;
        const p = s - c;
        return {
          ...pkg,
          id: pkg.id || `pkg_${idx}_${Date.now()}`,
          profit: p,
          marginPercent: s > 0 ? Number(((p / s) * 100).toFixed(1)) : 0,
          currency: pkg.currency || 'HTG',
        };
      });
    }

    const updatedService: DigitalService = {
      ...current,
      ...data,
      defaultCostPrice: defaultCost,
      defaultSellingPrice: defaultSelling,
      profit,
      marginPercent,
      packages,
      updatedAt: now,
    };

    this.data.digitalServices[serviceIndex] = updatedService;

    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role as any,
      action: 'OWNER_UPDATED_DIGITAL_SERVICE',
      details: `Mizajou sèvis dijital "${updatedService.name}"`,
    });

    this.scheduleSave();
    return { success: true, service: updatedService, message: 'Sèvis dijital mete ajou avèk siksè!' };
  }

  // --- DELETE DIGITAL SERVICE (OWNER ONLY) ---
  deleteDigitalService(
    id: string,
    actor: { id: string; name: string; role: string }
  ): { success: boolean; message: string } {
    if (actor.role !== 'owner' && actor.role !== 'admin') {
      return { success: false, message: 'Aksè refize.' };
    }

    const target = this.data.digitalServices.find((s) => s.id === id);
    if (!target) return { success: false, message: 'Sèvis pa jwenn.' };

    this.data.digitalServices = this.data.digitalServices.filter((s) => s.id !== id);

    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role as any,
      action: 'OWNER_DELETED_DIGITAL_SERVICE',
      details: `Efase sèvis dijital "${target.name}"`,
    });

    this.scheduleSave();
    return { success: true, message: 'Sèvis efase avèk siksè.' };
  }

  // --- TOGGLE PUBLISH / ACTIVE (OWNER ONLY) ---
  togglePublishDigitalService(
    id: string,
    actor: { id: string; name: string; role: string }
  ): { success: boolean; isPublished?: boolean; message: string } {
    if (actor.role !== 'owner' && actor.role !== 'admin') {
      return { success: false, message: 'Aksè refize.' };
    }

    const service = this.data.digitalServices.find((s) => s.id === id);
    if (!service) return { success: false, message: 'Sèvis pa jwenn.' };

    service.isPublished = !service.isPublished;
    service.updatedAt = new Date().toISOString();

    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role as any,
      action: service.isPublished ? 'OWNER_PUBLISHED_SERVICE' : 'OWNER_UNPUBLISHED_SERVICE',
      details: `${service.isPublished ? 'Pibliye' : 'Depibliye'} sèvis "${service.name}"`,
    });

    this.scheduleSave();
    return {
      success: true,
      isPublished: service.isPublished,
      message: service.isPublished ? 'Sèvis la pibliye nan katalòg la!' : 'Sèvis la depibliye nan katalòg la.',
    };
  }

  // --- DUPLICATE SERVICE ---
  duplicateDigitalService(
    id: string,
    actor: { id: string; name: string; role: string }
  ): { success: boolean; service?: DigitalService; message: string } {
    if (actor.role !== 'owner' && actor.role !== 'admin') {
      return { success: false, message: 'Aksè refize.' };
    }

    const original = this.data.digitalServices.find((s) => s.id === id);
    if (!original) return { success: false, message: 'Sèvis pa jwenn.' };

    const duplicateData: Partial<DigitalService> = {
      ...original,
      name: `${original.name} (Kopi)`,
      slug: `${original.slug}-kopi-${Date.now().toString().slice(-4)}`,
      isPublished: false,
    };

    return this.createDigitalService(duplicateData, actor);
  }

  // --- DIGITAL CODES INVENTORY (GIFT CARDS / CARDS STOCK) ---
  getDigitalCodes(serviceId?: string, status?: string): DigitalCode[] {
    let list = this.data.digitalCodes || [];
    if (serviceId) {
      list = list.filter((c) => c.serviceId === serviceId);
    }
    if (status && status !== 'all') {
      list = list.filter((c) => c.status === status);
    }
    return list;
  }

  addDigitalCodes(
    serviceId: string,
    codes: Array<{ code: string; pin?: string; packageId?: string; notes?: string }>,
    actor: { id: string; name: string; role: string }
  ): { success: boolean; addedCount: number; message: string } {
    if (actor.role !== 'owner' && actor.role !== 'admin') {
      return { success: false, addedCount: 0, message: 'Aksè refize.' };
    }

    const now = new Date().toISOString();
    let count = 0;

    codes.forEach((c) => {
      const cleanCode = c.code?.trim();
      if (cleanCode) {
        // Prevent exact duplicate code entry in available stock
        const exists = this.data.digitalCodes.some(
          (existing) => existing.code === cleanCode && existing.serviceId === serviceId
        );
        if (!exists) {
          this.data.digitalCodes.push({
            id: `code_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            serviceId,
            packageId: c.packageId,
            code: cleanCode,
            pin: c.pin?.trim(),
            status: 'AVAILABLE',
            notes: c.notes,
            createdAt: now,
          });
          count++;
        }
      }
    });

    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role as any,
      action: 'OWNER_ADDED_DIGITAL_CODES',
      details: `Ajoute ${count} kòd nan envantè sèvis ${serviceId}`,
    });

    this.scheduleSave();
    return { success: true, addedCount: count, message: `${count} kòd ajoute nan envantè a avèk siksè!` };
  }

  deleteDigitalCode(id: string, actor: { id: string; name: string; role: string }): { success: boolean; message: string } {
    if (actor.role !== 'owner' && actor.role !== 'admin') {
      return { success: false, message: 'Aksè refize.' };
    }

    const code = this.data.digitalCodes.find((c) => c.id === id);
    if (!code) return { success: false, message: 'Kòd pa jwenn.' };

    if (code.status === 'DELIVERED') {
      return { success: false, message: 'Ou pa ka efase yon kòd ki te deja livre bay yon kliyan.' };
    }

    this.data.digitalCodes = this.data.digitalCodes.filter((c) => c.id !== id);
    this.scheduleSave();
    return { success: true, message: 'Kòd efase nan stock la.' };
  }

  // --- FULFILL DIGITAL ORDER (OWNER ONLY) ---
  fulfillDigitalOrder(
    orderId: string,
    data: {
      action: 'deliver_recharge' | 'deliver_code';
      deliveredCode?: string;
      deliveredPin?: string;
      notes?: string;
      actorId: string;
      actorName: string;
      actorRole: string;
    }
  ): { success: boolean; order?: Order; message: string } {
    if (data.actorRole !== 'owner' && data.actorRole !== 'admin') {
      return { success: false, message: 'Aksè refize. Se sèlman Pwopriyetè a ki ka trete ak livre sèvis dijital.' };
    }

    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand pa jwenn.' };

    // Idempotency check: if order is already fulfilled or delivered, do not repeat
    if (order.status === 'DELIVERED' || order.status === 'FULFILLED' || order.status === 'DIGITAL_FULFILLED') {
      return { success: false, message: 'Kòmand sa a te deja delivre avèk siksè!' };
    }

    const now = new Date().toISOString();
    const oldStatus = order.status;
    let finalCode = data.deliveredCode?.trim();
    let finalPin = data.deliveredPin?.trim();

    // If it's a code-based delivery and no code was manually supplied in form, look up from inventory
    if (data.action === 'deliver_code' && !finalCode && order.digitalDetails) {
      const availableCode = this.data.digitalCodes.find(
        (c) =>
          c.serviceId === order.digitalDetails?.serviceId &&
          c.status === 'AVAILABLE' &&
          (!order.digitalDetails?.packageId || !c.packageId || c.packageId === order.digitalDetails?.packageId)
      );

      if (availableCode) {
        availableCode.status = 'DELIVERED';
        availableCode.orderId = order.id;
        availableCode.buyerId = order.buyerId;
        availableCode.deliveredAt = now;
        finalCode = availableCode.code;
        finalPin = availableCode.pin;
      }
    }

    // Update order status & digital details
    order.status = 'DELIVERED';
    order.updatedAt = now;

    if (!order.digitalDetails) {
      order.digitalDetails = {
        serviceId: 'generic_digital',
        serviceName: order.items[0]?.productTitle || 'Sèvis Dijital',
        packageId: 'default',
        packageName: order.items[0]?.productTitle || 'Sèvis Dijital',
        category: 'game_topup',
        requiredFieldsData: {},
        costPrice: 0,
        sellingPrice: order.total,
        profit: order.total,
        marginPercent: 100,
        currency: 'HTG',
        deliveryType: data.action === 'deliver_code' ? 'instant_code' : 'manual_recharge',
        estimatedDelivery: 'Imedyat',
      };
    }

    order.digitalDetails.deliveredAt = now;
    order.digitalDetails.deliveryNotes = data.notes || (data.action === 'deliver_code' ? 'Kòd voucher remèt' : 'Recharge konplete sou kont jwè a');
    if (finalCode) {
      order.digitalDetails.deliveredCode = finalCode;
    }
    if (finalPin) {
      order.digitalDetails.deliveredPin = finalPin;
    }

    // Event: DIGITAL_FULFILLED
    this.addEvent({
      orderId,
      actorId: data.actorId,
      actorName: data.actorName,
      actorRole: 'owner',
      eventType: 'DIGITAL_FULFILLED',
      title: data.action === 'deliver_code' ? 'Kòd Voucher Delivre' : 'Recharge Konplete avèk Siksè',
      message: data.action === 'deliver_code'
        ? `Kòd la (${finalCode ? finalCode.slice(0, 4) + '****' : 'Voucher'}) remèt bay kliyan an. Kòmand lan konplete.`
        : `Recharge la sou kont ${order.digitalDetails.targetAccount || 'kliyan an'} konplete pa Pwopriyetè a.`,
    });

    // Notification Customer
    this.addNotification({
      userId: order.buyerId,
      userRole: 'buyer',
      orderId,
      type: 'delivery',
      title: `🎉 SÈVIS LIVRE: ${order.digitalDetails.serviceName} (${orderId})`,
      message: data.action === 'deliver_code'
        ? `Kòd voucher ou pare! Ou ka kopye li kounye a sou paj swivi kòmand ou a.`
        : `Recharge ${order.digitalDetails.serviceName} ou an fin fèt avèk siksè sou kont ou! Mèsi paske ou chwazi Mache Yogann.`,
      link: orderId,
    });

    // Notification Owner
    this.addNotification({
      userId: 'user_owner_1',
      userRole: 'owner',
      orderId,
      type: 'delivery',
      title: `✅ Sèvis Dijital Livre: ${orderId}`,
      message: `Ou konfime livrezon pou kòmand ${orderId} (${order.digitalDetails.serviceName}).`,
      link: orderId,
    });

    // Audit Log
    this.addAuditLog({
      actorId: data.actorId,
      actorName: data.actorName,
      actorRole: 'owner',
      action: 'OWNER_CONFIRMED_FULFILLMENT',
      orderId,
      oldStatus,
      newStatus: 'DELIVERED',
      details: `Sèvis dijital ${order.digitalDetails.serviceName} livre. Aksyon: ${data.action}.`,
    });

    this.scheduleSave();
    return { success: true, order, message: 'Livrezon sèvis dijital la konfime avèk siksè!' };
  }

  // --- CANCEL / REFUND DIGITAL ORDER ---
  cancelOrRefundDigitalOrder(
    orderId: string,
    action: 'cancel' | 'refund',
    reason: string,
    actor: { id: string; name: string; role: string }
  ): { success: boolean; order?: Order; message: string } {
    if (actor.role !== 'owner' && actor.role !== 'admin') {
      return { success: false, message: 'Aksè refize.' };
    }

    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Kòmand pa jwenn.' };

    const now = new Date().toISOString();
    const oldStatus = order.status;
    const newStatus = action === 'refund' ? 'REFUNDED' : 'CANCELLED';

    order.status = newStatus as any;
    order.updatedAt = now;

    // Release any reserved code back to available
    const assignedCode = this.data.digitalCodes.find((c) => c.orderId === orderId);
    if (assignedCode && assignedCode.status !== 'USED') {
      assignedCode.status = 'AVAILABLE';
      assignedCode.orderId = undefined;
      assignedCode.buyerId = undefined;
    }

    // Event
    this.addEvent({
      orderId,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: 'owner',
      eventType: action === 'refund' ? 'REFUNDED' : 'CANCELLED',
      title: action === 'refund' ? 'Kòmand Ranbouse pa Pwopriyetè a' : 'Kòmand Dijital Anile',
      message: `Rezon: ${reason}`,
    });

    // Customer notification
    this.addNotification({
      userId: order.buyerId,
      userRole: 'buyer',
      orderId,
      type: 'support',
      title: action === 'refund' ? `💰 Kòmand ${orderId} ranbouse` : `❌ Kòmand ${orderId} anile`,
      message: `Kòmand ou an ${action === 'refund' ? 'ranbouse' : 'anile'}. Rezon: ${reason}.`,
      link: orderId,
    });

    // Audit log
    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: 'owner',
      action: action === 'refund' ? 'OWNER_APPROVED_REFUND' : 'OWNER_CANCELLED_ORDER',
      orderId,
      oldStatus,
      newStatus,
      details: `${action === 'refund' ? 'Ranbousman' : 'Anilasyon'} kòmand dijital: ${reason}`,
    });

    this.scheduleSave();
    return { success: true, order, message: `Kòmand ${action === 'refund' ? 'ranbouse' : 'anile'} avèk siksè.` };
  }

  // --- DIGITAL STATISTICS ---
  getDigitalStats() {
    const digitalOrders = this.data.orders.filter((o) => o.isDigital || o.id.includes('-DIG-') || o.digitalDetails);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let salesToday = 0;
    let salesThisWeek = 0;
    let salesThisMonth = 0;

    let revenueTotal = 0;
    let costTotal = 0;
    let profitTotal = 0;

    let pendingPayment = 0;
    let inProcessing = 0;
    let completed = 0;
    let failedOrCancelled = 0;

    digitalOrders.forEach((o) => {
      const orderDate = new Date(o.createdAt);
      const isPaid = o.paymentStatus === 'PAYMENT_CONFIRMED' || o.status === 'DELIVERED' || o.status === 'DIGITAL_PROCESSING';

      if (isPaid) {
        revenueTotal += o.total || 0;
        const c = o.digitalDetails?.costPrice || (o.total * 0.72);
        costTotal += c;
        profitTotal += (o.total || 0) - c;

        if (o.createdAt.startsWith(todayStr)) {
          salesToday += o.total || 0;
        }
        if (orderDate >= oneWeekAgo) {
          salesThisWeek += o.total || 0;
        }
        if (orderDate >= oneMonthAgo) {
          salesThisMonth += o.total || 0;
        }
      }

      if (o.status === 'PAYMENT_PENDING' || o.status === 'PAYMENT_VERIFICATION') {
        pendingPayment++;
      } else if (o.status === 'DIGITAL_PROCESSING' || o.status === 'PROCESSING' || o.status === 'PREPARING_ORDER') {
        inProcessing++;
      } else if (o.status === 'DELIVERED' || o.status === 'FULFILLED' || o.status === 'completed') {
        completed++;
      } else if (o.status === 'CANCELLED' || o.status === 'FAILED' || o.status === 'REFUNDED') {
        failedOrCancelled++;
      }
    });

    const activeServicesCount = this.data.digitalServices.filter((s) => s.isActive).length;
    const totalServicesCount = this.data.digitalServices.length;
    const availableCodesCount = this.data.digitalCodes.filter((c) => c.status === 'AVAILABLE').length;

    return {
      salesToday,
      salesThisWeek,
      salesThisMonth,
      revenueTotal,
      costTotal,
      profitTotal,
      pendingPayment,
      inProcessing,
      completed,
      failedOrCancelled,
      totalOrders: digitalOrders.length,
      activeServicesCount,
      totalServicesCount,
      availableCodesCount,
    };
  }

  // --- HELPER WRITERS ---
  private addEvent(eventData: Omit<OrderEvent, 'id' | 'createdAt'>) {
    const event: OrderEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...eventData,
      createdAt: new Date().toISOString(),
    };
    this.data.orderEvents.push(event);
  }

  private addNotification(notifData: Omit<OrderNotification, 'id' | 'isRead' | 'createdAt'>) {
    const notif: OrderNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...notifData,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(notif);
  }

  private addAuditLog(logData: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const log: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...logData,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
  }
}

export const db = new Database();
