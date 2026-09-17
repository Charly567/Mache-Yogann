/**
 * MACHE YOGANN DIGITAL - PROVIDER ADAPTER ARCHITECTURE
 * 
 * Ce module définit l'abstraction pour connecter des fournisseurs réels de services numériques
 * (agrégateurs de jeux, cartes cadeaux, recharge mobile télécom, cartes virtuelles).
 * 
 * RÈGLE FONDAMENTALE :
 * - Aucune simulation de fausse API.
 * - Le mode par défaut est le « Mode Manuel Mache Yogann » : l'Owner effectue ou valide
 *   la recharge manuellement ou distribue des codes authentiques sécurisés depuis le stock.
 * - L'interface DigitalProviderAdapter permet de brancher directement une vraie API fournisseur
 *   dès que des clés officielles de production sont configurées dans l'environnement.
 */

export interface DigitalProviderProduct {
  providerProductId: string;
  name: string;
  category: string;
  available: boolean;
  minAmount?: number;
  maxAmount?: number;
}

export interface TopUpRequestParams {
  orderId: string;
  serviceId: string;
  packageId: string;
  targetAccount: string; // Player ID, phone, username, etc.
  additionalFields?: Record<string, string>;
  amount?: number;
}

export interface TopUpResult {
  success: boolean;
  mode: 'manual' | 'api';
  transactionId?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  deliveredCode?: string;
  deliveredPin?: string;
  message: string;
  rawResponse?: any;
}

export interface DigitalProviderAdapter {
  providerId: string;
  providerName: string;
  isConfigured: boolean;
  mode: 'manual' | 'api';

  getProducts(): Promise<DigitalProviderProduct[]>;
  getProduct(providerProductId: string): Promise<DigitalProviderProduct | null>;
  checkBalance(): Promise<{ balance: number; currency: string }>;
  createTopUp(params: TopUpRequestParams): Promise<TopUpResult>;
  checkTransaction(transactionId: string): Promise<{ status: string; details?: any }>;
  getTransactionStatus(transactionId: string): Promise<string>;
  refundTransaction?(transactionId: string): Promise<{ success: boolean; message: string }>;
}

/**
 * Adaptateur officiel par défaut : Mode Manuel Mache Yogann
 * Toutes les recharges sont supervisées et exécutées en toute sécurité par le Pwopriyetè / Super Admin.
 */
export class ManualDigitalProvider implements DigitalProviderAdapter {
  providerId = 'mache_yogann_manual';
  providerName = 'Mòd Manyèl Mache Yogann (Ofisyèl)';
  isConfigured = true;
  mode: 'manual' = 'manual';

  async getProducts(): Promise<DigitalProviderProduct[]> {
    return [];
  }

  async getProduct(providerProductId: string): Promise<DigitalProviderProduct | null> {
    return null;
  }

  async checkBalance(): Promise<{ balance: number; currency: string }> {
    return { balance: 0, currency: 'USD' };
  }

  async createTopUp(params: TopUpRequestParams): Promise<TopUpResult> {
    return {
      success: true,
      mode: 'manual',
      transactionId: `TX-MANUAL-${Date.now()}`,
      status: 'PROCESSING',
      message: 'Kòmand lan pase nan mòd manyèl. Pwopriyetè a verifye epi trete recharge la anvan livrezon final.',
    };
  }

  async checkTransaction(transactionId: string): Promise<{ status: string; details?: any }> {
    return {
      status: 'MANUAL_PROCESSING',
      details: { transactionId, note: 'Tretman manyèl an kou pa Pwopriyetè Mache Yogann' },
    };
  }

  async getTransactionStatus(transactionId: string): Promise<string> {
    return 'MANUAL_PROCESSING';
  }

  async refundTransaction(transactionId: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: 'Demann ranbousman anrejistre pou verifikasyon administratif.',
    };
  }
}

/**
 * Gestionnaire de fournisseurs
 */
export class DigitalProviderManager {
  private static instance: DigitalProviderManager;
  private adapters: Map<string, DigitalProviderAdapter> = new Map();

  private constructor() {
    // Enregistrement de l'adaptateur par défaut
    this.registerAdapter(new ManualDigitalProvider());
  }

  public static getInstance(): DigitalProviderManager {
    if (!DigitalProviderManager.instance) {
      DigitalProviderManager.instance = new DigitalProviderManager();
    }
    return DigitalProviderManager.instance;
  }

  public registerAdapter(adapter: DigitalProviderAdapter) {
    this.adapters.set(adapter.providerId, adapter);
  }

  public getAdapter(providerId = 'mache_yogann_manual'): DigitalProviderAdapter {
    return this.adapters.get(providerId) || this.adapters.get('mache_yogann_manual')!;
  }

  public listAdapters(): { id: string; name: string; isConfigured: boolean; mode: string }[] {
    return Array.from(this.adapters.values()).map((a) => ({
      id: a.providerId,
      name: a.providerName,
      isConfigured: a.isConfigured,
      mode: a.mode,
    }));
  }
}

export const digitalProviderManager = DigitalProviderManager.getInstance();
