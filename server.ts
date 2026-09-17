import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { db } from './server/db';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Mache Yogann' });
  });

  // ==========================================
  // REAL PRODUCTION ORDER & NOTIFICATION APIS
  // ==========================================

  // 1. GET Orders with role-based filtering
  app.get('/api/orders', (req, res) => {
    try {
      const { actorId, actorRole, actorPhone, actorEmail } = req.query;
      const orders = db.getOrders(
        actorId as string | undefined,
        actorRole as any,
        actorPhone as string | undefined,
        actorEmail as string | undefined
      );
      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. GET Single Order + Events
  app.get('/api/orders/:id', (req, res) => {
    try {
      const order = db.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Kòmand pa jwenn' });
      const events = db.getOrderEvents(req.params.id);
      res.json({ success: true, order, events });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. GET Events for Order
  app.get('/api/orders/:id/events', (req, res) => {
    try {
      const events = db.getOrderEvents(req.params.id);
      res.json({ success: true, events });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. POST Create New Order
  app.post('/api/orders', (req, res) => {
    try {
      const result = db.createOrder(req.body);
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. POST Verify Payment (Owner Only)
  app.post('/api/orders/:id/verify-payment', (req, res) => {
    try {
      const { action, note, actorId, actorName, actorRole } = req.body;
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Se Pwopriyetè a sèlman ki gen dwa verifye peman!' });
      }
      const result = db.verifyPayment(req.params.id, action, note, actorId, actorName);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. POST Seller Marks Order Ready for Pickup
  app.post('/api/orders/:id/prepare', (req, res) => {
    try {
      const { actorId, actorName } = req.body;
      const result = db.markOrderReady(req.params.id, actorId, actorName);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. POST Assign Courier (Owner Only)
  app.post('/api/orders/:id/assign-courier', (req, res) => {
    try {
      const { courierId, courierName, courierPhone, actorId, actorName, actorRole } = req.body;
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Se Pwopriyetè a sèlman ki gen dwa asiyen livrè!' });
      }
      const result = db.assignCourier(req.params.id, courierId, courierName, courierPhone, actorId, actorName);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. POST Seller Handover to Courier (with Signature)
  app.post('/api/orders/:id/seller-handover', (req, res) => {
    try {
      const { signatureDataUri, actorId, actorName } = req.body;
      if (!signatureDataUri) {
        return res.status(400).json({ success: false, message: 'Siyati vandè a obligatwa!' });
      }
      const result = db.sellerHandover(req.params.id, signatureDataUri, actorId, actorName);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. POST Courier Confirm Pickup (In Transit)
  app.post('/api/orders/:id/courier-pickup', (req, res) => {
    try {
      const { actorId, actorName, signatureDataUri } = req.body;
      const result = db.courierConfirmPickup(req.params.id, actorId, actorName, signatureDataUri);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 10. POST Courier Out for Delivery
  app.post('/api/orders/:id/courier-out-for-delivery', (req, res) => {
    try {
      const { actorId, actorName } = req.body;
      const result = db.courierOutForDelivery(req.params.id, actorId, actorName);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 11. POST Customer Confirm Receipt & Signs
  app.post('/api/orders/:id/customer-confirm', (req, res) => {
    try {
      const { signatureDataUri, actorId, actorName } = req.body;
      if (!signatureDataUri) {
        return res.status(400).json({ success: false, message: 'Siyati kliyan an obligatwa pou prèv livrezon!' });
      }
      const result = db.customerConfirmReceipt(req.params.id, signatureDataUri, actorId, actorName);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 12. POST Courier Complete Delivery
  app.post('/api/orders/:id/courier-complete', (req, res) => {
    try {
      const { actorId, actorName, deliveryCode } = req.body;
      const result = db.courierCompleteDelivery(req.params.id, actorId, actorName, deliveryCode);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 13. POST Report Problem
  app.post('/api/orders/:id/report-problem', (req, res) => {
    try {
      const result = db.reportProblem(req.params.id, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 14. GET Notifications
  app.get('/api/notifications', (req, res) => {
    try {
      const { userId, userRole } = req.query;
      const notifications = db.getNotifications(userId as string | undefined, userRole as any);
      res.json({ success: true, notifications });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 15. PUT Mark Notification Read
  app.put('/api/notifications/:id/read', (req, res) => {
    try {
      const ok = db.markNotificationAsRead(req.params.id);
      res.json({ success: ok });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 16. PUT Mark All Read
  app.put('/api/notifications/read-all', (req, res) => {
    try {
      const { userId, userRole } = req.body;
      db.markAllNotificationsAsRead(userId, userRole);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 17. GET Audit Logs (Owner only)
  app.get('/api/audit-logs', (req, res) => {
    try {
      const { orderId } = req.query;
      const logs = db.getAuditLogs(orderId as string | undefined);
      res.json({ success: true, logs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 18. GET Official Bon De Livraison Data
  app.get('/api/orders/:id/bon-de-livraison', (req, res) => {
    try {
      const order = db.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Kòmand pa jwenn' });
      res.json({
        success: true,
        bonDeLivraison: {
          documentId: order.bonDeLivraison?.documentId || `BDL-${order.id.replace('#', '')}`,
          orderId: order.id,
          generatedAt: order.bonDeLivraison?.generatedAt || order.createdAt,
          verificationReference: order.bonDeLivraison?.verificationReference || `MY-VRF-${order.deliveryCode}-SEC`,
          order,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // DIGITAL SERVICES API (EXCLUSIVE OWNER / SUPER ADMIN)
  // ==========================================

  // 19. GET Digital Services Catalog
  app.get('/api/digital-services', (req, res) => {
    try {
      const { category, search, publishedOnly, activeOnly, role } = req.query;
      const isOwnerOrAdmin = role === 'owner' || role === 'admin';

      // Non-admins can only see published & active services
      const services = db.getDigitalServices({
        category: category as string,
        search: search as string,
        publishedOnly: isOwnerOrAdmin ? publishedOnly === 'true' : true,
        activeOnly: isOwnerOrAdmin ? activeOnly === 'true' : true,
      });

      res.json({ success: true, services });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 20. GET Single Digital Service
  app.get('/api/digital-services/:id', (req, res) => {
    try {
      const service = db.getDigitalServiceById(req.params.id) || db.getDigitalServiceBySlug(req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Sèvis dijital pa jwenn' });
      }
      res.json({ success: true, service });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 21. POST Create Digital Service (Owner Only)
  app.post('/api/digital-services', (req, res) => {
    try {
      const { actorId = 'user_owner_1', actorName = 'Pwopriyetè', actorRole = 'owner', ...serviceData } = req.body;
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize. Pwopriyetè a sèlman.' });
      }
      const result = db.createDigitalService(serviceData, { id: actorId, name: actorName, role: actorRole });
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 22. PUT Update Digital Service (Owner Only)
  app.put('/api/digital-services/:id', (req, res) => {
    try {
      const { actorId = 'user_owner_1', actorName = 'Pwopriyetè', actorRole = 'owner', ...serviceData } = req.body;
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize. Pwopriyetè a sèlman.' });
      }
      const result = db.updateDigitalService(req.params.id, serviceData, { id: actorId, name: actorName, role: actorRole });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 23. DELETE Digital Service (Owner Only)
  app.delete('/api/digital-services/:id', (req, res) => {
    try {
      const { actorId = 'user_owner_1', actorName = 'Pwopriyetè', actorRole = 'owner' } = req.body || {};
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize.' });
      }
      const result = db.deleteDigitalService(req.params.id, { id: actorId, name: actorName, role: actorRole });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 24. POST Toggle Publish (Owner Only)
  app.post('/api/digital-services/:id/toggle-publish', (req, res) => {
    try {
      const { actorId = 'user_owner_1', actorName = 'Pwopriyetè', actorRole = 'owner' } = req.body || {};
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize.' });
      }
      const result = db.togglePublishDigitalService(req.params.id, { id: actorId, name: actorName, role: actorRole });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 25. POST Duplicate Service (Owner Only)
  app.post('/api/digital-services/:id/duplicate', (req, res) => {
    try {
      const { actorId = 'user_owner_1', actorName = 'Pwopriyetè', actorRole = 'owner' } = req.body || {};
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize.' });
      }
      const result = db.duplicateDigitalService(req.params.id, { id: actorId, name: actorName, role: actorRole });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 26. GET Digital Codes Inventory (Owner Only)
  app.get('/api/digital-codes', (req, res) => {
    try {
      const { serviceId, status, actorRole } = req.query;
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize.' });
      }
      const codes = db.getDigitalCodes(serviceId as string, status as string);
      res.json({ success: true, codes });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 27. POST Add Digital Codes (Owner Only)
  app.post('/api/digital-codes', (req, res) => {
    try {
      const { serviceId, codes, actorId = 'user_owner_1', actorName = 'Pwopriyetè', actorRole = 'owner' } = req.body;
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize.' });
      }
      const result = db.addDigitalCodes(serviceId, codes, { id: actorId, name: actorName, role: actorRole });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 28. DELETE Digital Code (Owner Only)
  app.delete('/api/digital-codes/:id', (req, res) => {
    try {
      const { actorId = 'user_owner_1', actorName = 'Pwopriyetè', actorRole = 'owner' } = req.body || {};
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize.' });
      }
      const result = db.deleteDigitalCode(req.params.id, { id: actorId, name: actorName, role: actorRole });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 29. POST Fulfill Digital Order (Owner Only)
  app.post('/api/orders/:id/fulfill-digital', (req, res) => {
    try {
      const { action, deliveredCode, deliveredPin, notes, actorId = 'user_owner_1', actorName = 'Pwopriyetè', actorRole = 'owner' } = req.body;
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize. Pwopriyetè sèlman.' });
      }
      const result = db.fulfillDigitalOrder(req.params.id, {
        action,
        deliveredCode,
        deliveredPin,
        notes,
        actorId,
        actorName,
        actorRole,
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 30. POST Cancel or Refund Digital Order (Owner Only)
  app.post('/api/orders/:id/cancel-digital', (req, res) => {
    try {
      const { action = 'cancel', reason = 'Anilasyon pa Pwopriyetè', actorId = 'user_owner_1', actorName = 'Pwopriyetè', actorRole = 'owner' } = req.body;
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize.' });
      }
      const result = db.cancelOrRefundDigitalOrder(req.params.id, action, reason, { id: actorId, name: actorName, role: actorRole });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 31. GET Digital Stats (Owner Only)
  app.get('/api/digital-stats', (req, res) => {
    try {
      const { actorRole } = req.query;
      if (actorRole !== 'owner' && actorRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Aksè refize.' });
      }
      const stats = db.getDigitalStats();
      res.json({ success: true, stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Chatbot AI route with Gemini API
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Mesaj obligatwa' });
      }

      const ai = getGenAI();
      if (!ai) {
        return res.json({
          fallback: true,
          reply: null,
          note: 'GEMINI_API_KEY pa konfigire.',
        });
      }

      const systemInstruction = `Ou se "Ti Yogann", asistan entèlijan ofisyèl ak konsèye Mache Yogann nan (premye platfòm e-commerce lokal pou Leyogàn ak tout Ayiti).
Misyon w se ede kliyan, vandè ak livrè yo an Kreyòl Ayisyen (oswa Fransè si itilizatè a poze kesyon an fransè).

BAZ KONESANS KONPLÈ SOU MACHE YOGANN:
1. KATALÒG & PWODWI:
- Pwodwi Fizik (8 kategori): Makèt & Pwovizyon, Fason & Rad, Telefòn & Aksèswà, Teknoloji & Gadjèt, Bote & Swen, Kay & Dekorasyon, Agrikilti & Lokal, Liv Fizik & Ebook.
- Tout pri afiche an Goud Ayisyen (HTG). Pwodwi lokal yo soti dirèkteman nan men kiltivatè ak machann Leyogàn (Mango Fransik, Kafe lokal, Diri, Lwil maskreti natirèl, Rad atizanal, elatriye).
- SÈVIS NUMÉRIQUES MACHE YOGANN (Ofisyèl Pwopriyetè a):
  * Recharge Jwèt: Free Fire Diamants (ID Jwè), PUBG Mobile UC, Roblox Robux (Username).
  * Kat Kado Dijital: Google Play, Apple App Store & iTunes, Steam Wallet, PlayStation, Netflix, Spotify.
  * Recharge Mobil: Digicel Ayiti & Natcom Plan / Minits.
  * Livrezon dijital: Pa gen frè livrezon fizik (0 HTG). Pwopriyetè a verifye peman an epi voye kòd la oswa fè recharge la dirèkteman sou kont kliyan an nan kèk minit!

2. PEMAN & SEKIRITE ESCROW:
- Metòd peman: MonCash, NatCash ak Kripto (USDT rezo TRC-20).
- Sekirite: Lajan kliyan an pwoteje nan men platfòm nan (Escrow). Vandè a pa touche lajan an toutotan livrè a pa delivre machandiz la epi verifye kòd sekirite 4 chif la. Pou sèvis dijital yo, se Pwopriyetè a ki konfime peman an anvan livrezon.
- Pwosesis: Kliyan an transfere lajan an sou nimewo MonCash/NatCash ofisyèl Mache Yogann, epi mete kòd referans tranzaksyon an nan fòm lan.

3. SISTÈM LIVREZON & KÒD SEKIRITE:
- Ajan livrezon motosiklèt ofisyèl Mache Yogann akredite pa Pwopriyetè a pou pwodwi fizik yo.
- Zòn yo kouvri: Sant Vil Leyogàn, Bergeau, Ti Rivyè, Dufort, Dampus, Ça Ira, Gran Ri, Kafou Dufort, Gressier, ak tout lòt vil nan peyi Dayiti.
- Kòd sekirite 4 chif: Lè kliyan fè kòmand lan, sistèm nan ba li yon kòd sekirite 4 chif inik. Kliyan an dwe bay livrè a kòd sa a SÈLMAN lè li fin resevwa pake a nan men l epi verifye l.
- Frè livrezon de baz: 250 HTG nan Leyogàn.

4. VANN SOU MACHE YOGANN:
- Nenpòt machann, kiltivatè, boutik oswa atizan ka klike sou "Mwen Vle Vann", anrejistre gratis, epi poste machandiz yo.
- Komisyon sit la se 10% sèlman sou chak vant reyisi. Vandè a resevwa 90% nèt pa MonCash oswa NatCash.

5. SWIV KÒMAND & LITIJ:
- Kliyan an ka swiv tout etap yo nan onglet "Swiv Kòmand" (Kreye -> Peman Konfime -> Ajan Asiyen -> Ranmase -> Sou Wout -> Delivre).
- Si gen pwoblèm (atik kase, fo atik, reta), kliyan an ka klike sou "Ouvri yon Litij" pou admin/pwopriyetè a verifye epi ranbouse l.

6. ESPAS PWOPRIYETÈ A & DIREKSYON:
- Pwopriyetè a gen kontwòl total sou tèks, banyè, imaj, videyo, apwobasyon ajan livrezon, sipresyon pwodwi ki pa konfòm ak kont itilizatè.

7. RÈG ESKALASYON DIRÈK BAY PWOPRIYETÈ A (TRÈ ENPÒTAN!):
- Lè yon kliyan poze yon kesyon ou PA GEN ENFÒMASYON SOU LI, oswa si w bloke sou yon pwen espesifik (pa egzanp: yon kòmand an gwo espesyal pou yon òganizasyon, negosyasyon pri koutim, yon pwoblèm kont oswa litij pèsonèl konplike, yon zòn difisil ki pa klè, oswa si itilizatè a mande pou l pale ak mèt sit la / direktè a / sipò imen):
  1. Di kliyan an jantiman: "Mwen pa gen tout detay sou pwen patikilye sa a, men m ap konekte w touswit ak Pwopriyetè Mache Yogann nan pou l ka ba w yon repons pèsonalize ak rapid!"
  2. Nan fen repons ou an, ajoute egzakteman kòd sa a: [ESCALATE_TO_OWNER]
  Kòd sa a pral aktive bouton WhatsApp dirèk, apèl telefòn dirèk, ak fòm voye mesaj bay Pwopriyetè a.

${context ? `ENFÒMASYON AKTYÈL SOU SIT LA: ${context}` : ''}
Toujou reponn ak anpil chalè, koutwazi, fyète kreyòl, e bay enfòmasyon ki egzak.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nMesaj itilizatè a: ${message}` }],
          },
        ],
      });

      let rawReply = response.text || 'Mwen la pou m ede w sou Mache Yogann! Kisa w ta renmen konnen?';
      let escalate = false;

      if (rawReply.includes('[ESCALATE_TO_OWNER]')) {
        escalate = true;
        rawReply = rawReply.replace(/\[ESCALATE_TO_OWNER\]/g, '').trim();
      }

      return res.json({ reply: rawReply, escalate, fallback: false });
    } catch (error: any) {
      console.error('Chatbot API error:', error);
      return res.json({
        fallback: true,
        reply: null,
        error: error.message,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
