import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  Clock,
  DollarSign,
  Truck,
  Users,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  Phone,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/seedData';

export const AdminDashboard: React.FC = () => {
  const {
    language,
    orders,
    products,
    disputes,
    confirmPayment,
    rejectPayment,
    assignAgent,
    validateProduct,
    resolveDispute,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'payments' | 'products' | 'agents' | 'commissions' | 'disputes'>('payments');

  // Stats
  const totalVolume = orders.reduce((acc, o) => acc + o.total, 0);
  const totalCommissionsEarned = orders.reduce((acc, o) => acc + o.commissionAmount, 0);
  const pendingPayments = orders.filter((o) => o.paymentStatus === 'pending');
  const pendingProducts = products.filter((p) => p.status === 'pending');
  const openDisputes = disputes.filter((d) => d.status === 'open' || d.status === 'investigating');

  const availableAgents = DEMO_USERS.filter((u) => u.role === 'agent');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4 border border-indigo-900/40">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
            <ShieldCheck size={14} />
            <span>{language === 'ht' ? 'Panèl Administrasyon Mache Yogann' : 'Panneau d\'Administration'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit']">
            {language === 'ht' ? 'Sant Kontwòl Jeneral' : 'Centre de Contrôle Global'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'ht'
              ? 'Valide peman MonCash/NatCash/Kripto, apwouve pwodwi, asiyen ajan, epi sipèvize komisyon.'
              : 'Validez les paiements, approuvez les produits, assignez les livreurs et suivez les commissions.'}
          </p>
        </div>

        {/* Global KPIs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 backdrop-blur text-right">
            <span className="text-[11px] text-slate-300 block">Total Vant Platfòm</span>
            <span className="text-lg sm:text-xl font-black text-amber-300 font-['Outfit']">
              {totalVolume.toLocaleString()} HTG
            </span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 backdrop-blur text-right">
            <span className="text-[11px] text-emerald-300 block">Komisyon 10% Rekòlte</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400 font-['Outfit']">
              {totalCommissionsEarned.toLocaleString()} HTG
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Peman Pou Verifye</span>
          {pendingPayments.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-red-600 font-black">
              {pendingPayments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Validasyon Pwodwi</span>
          {pendingProducts.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
              {pendingProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'agents'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Asiyasyon Ajan</span>
        </button>

        <button
          onClick={() => setActiveTab('commissions')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'commissions'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Tablo Komisyon (10%)</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'disputes'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Litij &amp; Reklamasyon</span>
          {openDisputes.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-800 text-white font-black">
              {openDisputes.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PAYMENTS APPROVAL (MonCash, NatCash, Crypto) */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Peman Ki Nan Tann Verifikasyon Ofisyèl
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {pendingPayments.length} tranzaksyon an tann
            </span>
          </div>

          {pendingPayments.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-1">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
              <p className="text-sm font-semibold text-slate-700">Tout peman yo verifye!</p>
              <p className="text-xs">Pa gen okenn tranzaksyon k ap tann apwobasyon.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingPayments.map((order) => (
                <div key={order.id} className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{order.id}</span>
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-red-100 text-red-800">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Kliyan: <strong>{order.buyerName}</strong> ({order.buyerPhone})
                    </p>
                    <p className="text-slate-700 font-mono">
                      Referans Tranzaksyon:{' '}
                      <strong className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                        {order.paymentRef}
                      </strong>
                    </p>
                    {order.paymentPhone && (
                      <p className="text-slate-500 text-[11px]">
                        Nimewo ki voye a: {order.paymentPhone}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-black text-lg text-slate-900 font-['Outfit'] block">
                      {order.total.toLocaleString()} HTG
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Komisyon 10%: {order.commissionAmount.toLocaleString()} HTG
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => confirmPayment(order.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Check size={14} />
                      <span>Konfime Peman</span>
                    </button>
                    <button
                      onClick={() => rejectPayment(order.id)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl border border-red-200 cursor-pointer"
                    >
                      <X size={14} />
                      <span>Rejte</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT VALIDATION */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
            Validasyon Pwodwi Vandè Yo
          </h2>
          <p className="text-xs text-slate-500 -mt-2">
            Verifye kalite foto, deskripsyon ak konfòmite avèk règ Mache Yogann anvan piblikasyon.
          </p>

          <div className="divide-y divide-slate-100">
            {products.map((prod) => (
              <div key={prod.id} className="py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-[280px]">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{prod.title}</h4>
                    <p className="text-slate-500 text-[11px]">
                      Vandè: {prod.sellerName} ({prod.sellerLocation})
                    </p>
                    <span className="font-semibold text-red-600">{prod.price.toLocaleString()} HTG</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      prod.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : prod.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {prod.status === 'published' ? 'Pibliye sou sit la' : prod.status === 'pending' ? 'An tann' : 'Refize'}
                  </span>

                  {prod.status !== 'published' && (
                    <button
                      onClick={() => validateProduct(prod.id, 'published')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer"
                    >
                      Apwouve
                    </button>
                  )}

                  {prod.status !== 'rejected' && (
                    <button
                      onClick={() => validateProduct(prod.id, 'rejected', 'Pwodwi pa konfòm')}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold border border-red-200 cursor-pointer"
                    >
                      Refize
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AGENT ASSIGNMENTS */}
      {activeTab === 'agents' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
            Asiyasyon Kòmand Bay Ajan Livrezon
          </h2>
          <p className="text-xs text-slate-500 -mt-2">
            Chwazi yon ajan motosiklèt pou ale pran machandiz la nan men vandè a epi livre l.
          </p>

          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div key={order.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{order.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {order.buyerZone}, {order.buyerCommune.split('(')[0]}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Kliyan: <strong>{order.buyerName}</strong> ({order.buyerPhone})
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Ajan aktyèl: <strong>{order.assignedAgentName || 'Poko gen ajan'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      const agent = availableAgents.find((a) => a.id === e.target.value);
                      if (agent) {
                        assignAgent(order.id, agent.id, agent.name, agent.phone);
                      }
                    }}
                    value={order.assignedAgentId || ''}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  >
                    <option value="">-- Chwazi yon Ajan --</option>
                    {availableAgents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        🛵 {ag.name} ({ag.zone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSIONS 10% BREAKDOWN TABLE */}
      {activeTab === 'commissions' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Tablo Kalkil Komisyon 10% Mache Yogann
              </h2>
              <p className="text-xs text-slate-500">
                Chif yo kalkile otomatikman pou chak vant ki fèt sou platfòm nan.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Komisyon Reyalize</span>
              <span className="text-lg font-black text-emerald-600 font-['Outfit']">
                {totalCommissionsEarned.toLocaleString()} HTG
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Kòmand</th>
                  <th className="p-3">Kliyan</th>
                  <th className="p-3 text-right">Montan Total</th>
                  <th className="p-3 text-right text-red-600">Komisyon Mache Yogann (10%)</th>
                  <th className="p-3 text-right text-emerald-700">Nèt Vandè (90%)</th>
                  <th className="p-3 text-center">Estati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{o.id}</td>
                    <td className="p-3 text-slate-700">{o.buyerName}</td>
                    <td className="p-3 text-right font-bold text-slate-900">{o.subtotal.toLocaleString()} HTG</td>
                    <td className="p-3 text-right font-bold text-red-600">{o.commissionAmount.toLocaleString()} HTG</td>
                    <td className="p-3 text-right font-bold text-emerald-700">{o.vendorPayoutAmount.toLocaleString()} HTG</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {o.paymentStatus === 'confirmed' ? 'Konfime' : 'An tann'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DISPUTES (LITIJ) */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
            Jesyon Litij &amp; Reklamasyon Kliyan
          </h2>

          {disputes.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Pa gen okenn litij ouvri kounye a.</p>
          ) : (
            <div className="space-y-3">
              {disputes.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl bg-red-50/50 border border-red-200 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-red-900 text-sm">
                        Kòmand: {d.orderId} · Plent pa: {d.userName}
                      </span>
                      <p className="font-semibold text-slate-800 mt-1">Rezon: {d.reason}</p>
                      <p className="text-slate-600 mt-0.5">{d.details}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-200 text-red-900 uppercase">
                      {d.status}
                    </span>
                  </div>

                  {d.status !== 'resolved' ? (
                    <div className="flex gap-2 pt-2 border-t border-red-200">
                      <button
                        onClick={() => resolveDispute(d.id, 'Ranbousman total aksepte')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer"
                      >
                        Ranbouse Kliyan an
                      </button>
                      <button
                        onClick={() => resolveDispute(d.id, 'Reklamasyon rejte apre verifikasyon')}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold cursor-pointer"
                      >
                        Rejte Reklamasyon
                      </button>
                    </div>
                  ) : (
                    <p className="text-emerald-700 font-bold text-[11px] pt-1 border-t border-emerald-200">
                      Desizyon: {d.decision}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
