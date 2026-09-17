import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RotateCcw,
  ShoppingBag,
  Store,
  Truck,
  ShieldCheck,
  Phone,
  Crown,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

export const ChatBot: React.FC = () => {
  const {
    language,
    isChatOpen,
    setIsChatOpen,
    products,
    categories,
    siteSettings,
    setActiveTab,
    currentUser,
    addInquiry,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inquirySentMap, setInquirySentMap] = useState<Record<string, boolean>>({});
  const [inquiryPhoneMap, setInquiryPhoneMap] = useState<Record<string, string>>({});
  const [inquiryCustomNoteMap, setInquiryCustomNoteMap] = useState<Record<string, string>>({});

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg_welcome',
        sender: 'bot',
        text:
          language === 'ht'
            ? `Bonjou! Mwen se Ti Yogann 🇭🇹, asistan entèlijan ofisyèl Mache Yogann nan. Mwen gen tout enfòmasyon sou pwodwi yo, pri yo, livrezon nan tout Leyogàn, peman MonCash/NatCash, ak kijan pou w vann!\n\nSi tout fwa mwen pa gen yon enfòmasyon ou bezwen, m ap konekte w dirèkteman ak Pwopriyetè sit la.`
            : `Bonjour ! Je suis Ti Yogann 🇭🇹, l'assistant intelligent de Mache Yogann. J'ai toutes les informations sur les produits, livraisons à Léogâne, paiements et comment vendre ! Si besoin, je vous connecte directement au Propriétaire.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: '🛍️ Pwodwi ki gen rabè', action: 'products_promo' },
          { label: '💳 Peman MonCash / NatCash', action: 'payment_info' },
          { label: '🛵 Livrezon nan Leyogàn', action: 'delivery_info' },
          { label: '🏪 Mwen vle vann sou sit la', action: 'vendor_info' },
          { label: '👑 Pale ak Pwopriyetè a dirèk', action: 'contact_owner' },
        ],
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanWhatsAppNumber = siteSettings.contactWhatsApp.replace(/[^0-9]/g, '');
  const cleanPhone = siteSettings.contactPhone.replace(/\s+/g, '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isChatOpen, messages]);

  // Comprehensive Native Smart Assistant Engine with direct site data and escalation
  const generateNativeReply = (query: string): { text: string; escalate: boolean } => {
    const q = query.toLowerCase();

    // 1. Direct request to talk to owner / human
    if (
      q.includes('propriyete') ||
      q.includes('pwopriyete') ||
      q.includes('met') ||
      q.includes('mèt') ||
      q.includes('moun') ||
      q.includes('responsab') ||
      q.includes('direkte') ||
      q.includes('direktè') ||
      q.includes('kontak') ||
      q.includes('rele') ||
      q.includes('human') ||
      q.includes('pale ak yon moun') ||
      q.includes('nimewo')
    ) {
      return {
        text: `👑 **Koneksyon Dirèk ak Pwopriyetè Mache Yogann:**\nOu mèt pale dirèkteman ak ${siteSettings.ownerName}!\n\nLi disponib sou WhatsApp nan **${siteSettings.contactWhatsApp}** oswa pa telefòn nan **${siteSettings.contactPhone}**.\n\nKlike sou bouton WhatsApp oswa Rele anba a pou w konekte touswit san pèdi tan:`,
        escalate: true,
      };
    }

    // 2. Payments (MonCash, NatCash, USDT, Escrow)
    if (
      q.includes('moncash') ||
      q.includes('natcash') ||
      q.includes('peye') ||
      q.includes('paiement') ||
      q.includes('peman') ||
      q.includes('kripto') ||
      q.includes('usdt') ||
      q.includes('lajan')
    ) {
      return {
        text: `💳 **Kijan Peman Fèt sou Mache Yogann:**\nNou aksepte 3 metòd peman ofisyèl an sekirite:\n\n1. **MonCash**: Nimewo **${siteSettings.moncashNumber}** (${siteSettings.moncashName})\n2. **NatCash**: Nimewo **${siteSettings.natcashNumber}** (${siteSettings.natcashName})\n3. **Kripto (USDT TRC-20)**: \`${siteSettings.cryptoUsdtAddress}\`\n\n🛡️ **Garanti Escrow**: Lajan an rete an sekirite nan men sit la. Vandè a touche sèlman lè koli a delivre epi ou bay kòd sekirite 4 chif ou a.\n\nLè w fin fè transfè a sou telefòn ou, jis antre kòd referans tranzaksyon an sou paj kòmand la pou ekip la valide l rapid!`,
        escalate: false,
      };
    }

    // 3. Deliveries & Zones in Léogâne
    if (
      q.includes('livre') ||
      q.includes('livrezon') ||
      q.includes('ajan') ||
      q.includes('motosiklèt') ||
      q.includes('delivery') ||
      q.includes('kod') ||
      q.includes('kòd') ||
      q.includes('tan')
    ) {
      return {
        text: `🛵 **Sistèm Livrezon Dirèk Mache Yogann:**\n• **Ajan Ofisyèl**: Tout livrè nou yo gen motosiklèt e yo akredite pa direksyon an.\n• **Zòn Leyogàn**: Nou kouvri Sant Vil, Bergeau, Ti Rivyè, Dufort, Dampus, Ça Ira, Gran Ri, Kafou Dufort, Gressier, epi nou livre nan tout lòt vil Ayiti tou.\n• **Kòd Sekirite 4 Chif**: Kòmand ou a gen yon kòd sekirite 4 chif. Ou dwe bay livrè a kòd sa a SÈLMAN lè ou fin verifye pake ou a nan men l.\n• **Frè de baz**: Sèlman **${siteSettings.baseDeliveryFee} HTG** nan zòn Leyogàn!`,
        escalate: false,
      };
    }

    // 4. Selling on the marketplace
    if (
      q.includes('vann') ||
      q.includes('vande') ||
      q.includes('boutik') ||
      q.includes('komisyon') ||
      q.includes('seller') ||
      q.includes('machann') ||
      q.includes('kiltivate')
    ) {
      return {
        text: `🏪 **Kijan pou w Vann sou Mache Yogann:**\nNenpòt machann, kiltivatè, atizan oswa boutik ka vann fasil:\n1. Klike sou bouton **"Mwen Vle Vann"** anlè a.\n2. Kreye kont vandè w gratis.\n3. Poste foto machandiz ou yo ak pri an Goud (HTG).\n4. **Komisyon an se ${siteSettings.commissionPercent}% sèlman** sou chak vant delivre. Ou resevwa **90% nèt** dirèkteman pa MonCash oswa NatCash!`,
        escalate: false,
      };
    }

    // 5. Products, Catalog, Books, Discounts
    if (
      q.includes('pwodwi') ||
      q.includes('achte') ||
      q.includes('pri') ||
      q.includes('katalòg') ||
      q.includes('mango') ||
      q.includes('diri') ||
      q.includes('liv') ||
      q.includes('rabe') ||
      q.includes('rabè') ||
      q.includes('kategori')
    ) {
      const topProducts = products
        .slice(0, 4)
        .map((p) => `• **${p.title}** - ${p.price.toLocaleString()} HTG (${p.sellerLocation})`)
        .join('\n');

      return {
        text: `🛍️ **Kèk bèl machandiz ki disponib kounye a sou Mache Yogann:**\n${topProducts}\n\nNou gen **8 kategori konplè**:\n${categories.map((c) => c.nameHt).join(', ')}.\n\nNou gen tou liv papye ak **Ebooks PDF** pou telechaje imedyatman. Ou ka klike sou meni Kategori anlè a pou w wè tout katalòg la!`,
        escalate: false,
      };
    }

    // 6. Tracking & Disputes / Litij
    if (
      q.includes('swiv') ||
      q.includes('track') ||
      q.includes('litij') ||
      q.includes('dispute') ||
      q.includes('pwoblem') ||
      q.includes('ranbouse') ||
      q.includes('retounen')
    ) {
      return {
        text: `🛡️ **Swiv Kòmand & Garanti Ranbousman:**\n• Ou ka swiv kòmand ou an tan reyèl nan onglet **"Swiv Kòmand"**.\n• Lè peman an konfime, yon ajan asiyen pou ale pran koli a nan men vandè a.\n• Si pwodwi a domaje oswa pa sa w te kòmande a, ou ka klike sou **"Ouvri yon Litij"** pou admin ak Pwopriyetè a verifye l epi ranbouse w 100% lajan w!`,
        escalate: false,
      };
    }

    // 7. Salutations
    if (
      q.includes('bonjou') ||
      q.includes('bonswa') ||
      q.includes('alo') ||
      q.includes('salut') ||
      q.includes('koman ou ye') ||
      q.includes('kijan ou ye') ||
      q.includes('hi')
    ) {
      return {
        text: `Salitasyon konpatriyòt! Mwen kontan pale avèk ou sou Mache Yogann 🇭🇹. Kijan mwen ka ede w jodi a? Èske w ap chèche yon pwodwi patikilye, ou bezwen èd sou yon kòmand, oswa ou vle vann machandiz pa w?`,
        escalate: false,
      };
    }

    // 8. Thanks
    if (q.includes('mèsi') || q.includes('mesi') || q.includes('merci') || q.includes('thanks')) {
      return {
        text: `Se yon gwo plezi! Mwen toujou la pou m sèvi w sou Mache Yogann. Si gen nenpòt lòt enfòmasyon ou bezwen, jis mande m! 🇭🇹`,
        escalate: false,
      };
    }

    // 9. Unknown query or complex/special request -> Escalate directly to the Owner!
    return {
      text: `Mwen pa gen tout detay espesifik sou demand sa a nan baz done sit la kounye a, men m ap konekte w touswit ak **Pwopriyetè Mache Yogann nan (${siteSettings.ownerName})** pou l ka ba w yon repons pèsonalize ak rapid!\n\nOu ka kontakte l dirèkteman sou WhatsApp, rele l sou telefòn, oswa voye yon demann rapid anba a:`,
      escalate: true,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build rich site context
      const productsSummary = products
        .slice(0, 15)
        .map((p) => `• ${p.title} (${p.price} HTG, ${p.category}, nan ${p.sellerLocation})`)
        .join('\n');
      const categoriesSummary = categories.map((c) => c.nameHt).join(', ');

      const contextPayload = `
      Non sit la: ${siteSettings.siteName}
      Pwopriyetè: ${siteSettings.ownerName}
      WhatsApp Pwopriyetè: ${siteSettings.contactWhatsApp}
      Telefòn Pwopriyetè: ${siteSettings.contactPhone}
      Email Pwopriyetè: ${siteSettings.contactEmail}
      MonCash: ${siteSettings.moncashNumber} (${siteSettings.moncashName})
      NatCash: ${siteSettings.natcashNumber} (${siteSettings.natcashName})
      USDT: ${siteSettings.cryptoUsdtAddress}
      Frè livrezon de baz: ${siteSettings.baseDeliveryFee} HTG nan Leyogàn
      Komisyon platfòm: ${siteSettings.commissionPercent}%
      Kategori yo: ${categoriesSummary}
      Kèk pwodwi aktyèl:
      ${productsSummary}
      Kliyan k ap poze kesyon an: ${
        currentUser
          ? `${currentUser.name}, Tel: ${currentUser.phone}, Wòl: ${currentUser.role}, Zòn: ${
              currentUser.zone || 'Leyogàn'
            }`
          : 'Vizitè ki pa konekte'
      }
      `;

      // Call server-side Gemini route
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: contextPayload,
        }),
      });

      const data = await res.json();

      let botReplyText = '';
      let escalate = false;

      if (data && data.reply && !data.fallback) {
        botReplyText = data.reply;
        escalate = Boolean(data.escalate);
      } else {
        // Fallback to intelligent native engine
        const nativeResult = generateNativeReply(text);
        botReplyText = nativeResult.text;
        escalate = nativeResult.escalate;
      }

      // Check if user specifically asked for owner
      const lower = text.toLowerCase();
      if (
        lower.includes('propriyete') ||
        lower.includes('pwopriyete') ||
        lower.includes('met') ||
        lower.includes('mèt') ||
        lower.includes('kontak') ||
        lower.includes('pale ak yon moun') ||
        lower.includes('rele') ||
        lower.includes('responsab')
      ) {
        escalate = true;
      }

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalatedToOwner: escalate,
        escalationQuestion: text,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const nativeResult = generateNativeReply(text);
      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: nativeResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalatedToOwner: nativeResult.escalate,
        escalationQuestion: text,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'products_promo':
        handleSendMessage('Ki pwodwi ak machandiz ki gen bon pri sou sit la jodi a?');
        break;
      case 'payment_info':
        handleSendMessage('Kijan pou m peye pa MonCash oswa NatCash sou Mache Yogann?');
        break;
      case 'delivery_info':
        handleSendMessage('Kijan livrezon fèt nan Leyogàn ak ki kòd sekirite mwen dwe bay?');
        break;
      case 'vendor_info':
        handleSendMessage('Kijan pou m vin vandè sou Mache Yogann e konbyen komisyon an ye?');
        break;
      case 'contact_owner':
        handleSendMessage('Mwen vle pale ak Pwopriyetè sit la dirèkteman');
        break;
      default:
        handleSendMessage(action);
    }
  };

  const handleSendFastInquiry = (msgId: string, question: string) => {
    const phone = inquiryPhoneMap[msgId] || (currentUser ? currentUser.phone : '');
    const note = inquiryCustomNoteMap[msgId] || question;

    if (!phone) {
      alert(language === 'ht' ? 'Tanpri mete yon nimewo telefòn pou Pwopriyetè a ka jwenn ou.' : 'Veuillez saisir votre numéro de téléphone.');
      return;
    }

    addInquiry({
      customerName: currentUser ? currentUser.name : 'Kliyan Mache Yogann',
      customerPhone: phone,
      subject: `Kesyon sou: ${question.slice(0, 40)}...`,
      message: note,
      source: 'chatbot',
    });

    setInquirySentMap((prev) => ({ ...prev, [msgId]: true }));
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <motion.div
        className="fixed bottom-5 right-5 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {!isChatOpen && (
          <motion.button
            id="open-chatbot-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(true)}
            className="relative flex items-center gap-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-3 rounded-full shadow-xl shadow-red-600/30 border border-white/20 cursor-pointer group"
            title="Louvri Ti Yogann AI"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
            </span>
            <Bot size={22} className="group-hover:rotate-12 transition-transform" />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-none font-['Outfit']">Ti Yogann AI</p>
              <p className="text-[10px] text-red-100 font-medium">Asistan & Kontak Pwopriyetè</p>
            </div>
          </motion.button>
        )}
      </motion.div>

      {/* Interactive Chat Window Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 right-5 z-50 w-[94vw] sm:w-[440px] h-[610px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Chat Window Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                    <Bot size={22} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-sm font-['Outfit'] tracking-tight">Ti Yogann AI</h3>
                    <span className="text-xs" title="Haïti">🇭🇹</span>
                  </div>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Asistan Ofisyèl Mache Yogann</span>
                  </p>
                </div>
              </div>

              {/* Fast Escalation to Owner button & Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleQuickAction('contact_owner')}
                  title="Pale ak Pwopriyetè a dirèk"
                  className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <Crown size={13} />
                  <span className="hidden sm:inline">Pwopriyetè</span>
                </button>

                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: `msg_welcome_${Date.now()}`,
                        sender: 'bot',
                        text: 'Konvèsasyon an reyinisyalize! Mwen gen tout enfòmasyon sou sit la. Kisa w ta renmen konnen?',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        quickActions: [
                          { label: '🛍️ Pwodwi yo', action: 'products_promo' },
                          { label: '💳 MonCash / NatCash', action: 'payment_info' },
                          { label: '🛵 Livrezon', action: 'delivery_info' },
                          { label: '👑 Pale ak Pwopriyetè a', action: 'contact_owner' },
                        ],
                      },
                    ]);
                  }}
                  title="Reyinisyalize konvèsasyon"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  id="close-chatbot-btn"
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Fèmen chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Direct Connect Help Notice */}
            <div className="bg-amber-50 border-b border-amber-200/60 px-3 py-1.5 flex items-center justify-between text-[11px] text-amber-900">
              <span className="flex items-center gap-1 font-medium">
                <Crown size={13} className="text-amber-600 shrink-0" />
                <span>Asistans otomatik + Koneksyon dirèk ak mèt sit la</span>
              </span>
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 underline shrink-0"
              >
                <span>WhatsApp</span>
                <ExternalLink size={10} />
              </a>
            </div>

            {/* Quick Portal Navigation Strip */}
            <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex items-center justify-between text-xs overflow-x-auto gap-2">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setIsChatOpen(false);
                }}
                className="flex items-center gap-1 text-slate-600 hover:text-red-600 whitespace-nowrap font-medium"
              >
                <ShoppingBag size={13} />
                <span>Katalòg</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('track');
                  setIsChatOpen(false);
                }}
                className="flex items-center gap-1 text-slate-600 hover:text-red-600 whitespace-nowrap font-medium"
              >
                <Truck size={13} />
                <span>Swiv kòmand</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('vendor');
                  setIsChatOpen(false);
                }}
                className="flex items-center gap-1 text-slate-600 hover:text-amber-600 whitespace-nowrap font-medium"
              >
                <Store size={13} />
                <span>Vann</span>
              </button>
              <button
                onClick={() => handleQuickAction('contact_owner')}
                className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-bold whitespace-nowrap"
              >
                <Phone size={12} />
                <span>Kontak Mèt</span>
              </button>
            </div>

            {/* Message History Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
              {messages.map((msg) => {
                const isSent = inquirySentMap[msg.id];
                const cleanMsgEscalationQuestion = msg.escalationQuestion || msg.text || '';
                const encodedQuestion = encodeURIComponent(
                  `Bonjou Pwopriyetè Mache Yogann, mwen te sou sit la e mwen bezwen asistans sou: "${cleanMsgEscalationQuestion}"`
                );
                const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodedQuestion}`;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-red-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                      <span
                        className={`block text-[10px] mt-1 text-right ${
                          msg.sender === 'user' ? 'text-red-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Quick Action Chips if any */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                        {msg.quickActions.map((qa, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAction(qa.action)}
                            className="text-[11px] font-semibold bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                          >
                            {qa.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* DIRECT ESCALATION TO OWNER CARD */}
                    {msg.isEscalatedToOwner && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="mt-2.5 max-w-[92%] w-full bg-gradient-to-br from-amber-50 via-white to-amber-50/40 rounded-2xl p-3.5 border-2 border-amber-300 shadow-md space-y-2.5"
                      >
                        <div className="flex items-center gap-2 text-amber-950">
                          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                            <Crown size={16} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black tracking-tight text-slate-900 font-['Outfit']">
                              Koneksyon Dirèk ak Pwopriyetè a
                            </h4>
                            <p className="text-[10px] text-slate-600 font-medium">
                              {siteSettings.ownerName} · Repons garanti rapid
                            </p>
                          </div>
                        </div>

                        {/* WhatsApp & Phone Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            <MessageSquare size={14} />
                            <span>WhatsApp Dirèk</span>
                            <ExternalLink size={12} />
                          </a>

                          <a
                            href={`tel:${cleanPhone}`}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            <Phone size={14} />
                            <span>Rele sou Telefòn</span>
                          </a>
                        </div>

                        {/* In-Chat Fast Inquiry Form */}
                        <div className="pt-2 border-t border-amber-200/80">
                          {isSent ? (
                            <div className="flex items-center gap-2 p-2 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold">
                              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                              <span>Mesaj ou a voye bay Pwopriyetè a! N ap kontakte w rapid.</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-[11px] font-bold text-slate-700">
                                Oswa kite nimewo w pou Pwopriyetè a rele w:
                              </p>
                              <div className="flex gap-1.5">
                                <input
                                  type="tel"
                                  placeholder="Telefòn ou (egz: 3800-0000)"
                                  defaultValue={currentUser?.phone || ''}
                                  onChange={(e) =>
                                    setInquiryPhoneMap((prev) => ({
                                      ...prev,
                                      [msg.id]: e.target.value,
                                    }))
                                  }
                                  className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSendFastInquiry(msg.id, cleanMsgEscalationQuestion)
                                  }
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
                                >
                                  Voye bay Mèt la ✉️
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}

              {/* Typing Animation */}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-500 text-xs bg-white border border-slate-200 px-3.5 py-2 rounded-2xl w-fit">
                  <Bot size={15} className="animate-spin text-red-600" />
                  <span>Ti Yogann ap reflechi...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Poze yon kesyon an Kreyòl oswa Fransè..."
                className="flex-1 px-4 py-2.5 bg-slate-100 focus:bg-white text-xs sm:text-sm rounded-full border border-slate-200 focus:border-red-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-md shadow-red-600/20"
                aria-label="Voye mesaj"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
