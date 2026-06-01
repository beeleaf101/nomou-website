import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, AlertTriangle, Download, Receipt, Wifi, ChevronDown } from 'lucide-react';
import { usePayments, type Payment } from '../../hooks/usePayments';
import { useTheme } from '../../hooks/useTheme';

const tabs = ['All', 'Subscription', 'Node', 'Unpaid'] as const;

export default function PortalPayments() {
  const { payments, markPaymentPaid, nodeRequests } = usePayments();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('All');
  const [paying, setPaying] = useState<string | null>(null);

  const filtered = payments.filter(p => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Subscription') return p.type === 'subscription';
    if (activeTab === 'Node') return p.type === 'node';
    if (activeTab === 'Unpaid') return p.status === 'unpaid';
    return true;
  });

  const handlePay = async (id: string) => {
    setPaying(id);
    await new Promise(r => setTimeout(r, 1500));
    markPaymentPaid(id);
    setPaying(null);
  };

  const statusConfig = {
    paid:   { label: 'Paid',    color: '#4CAF50', icon: CheckCircle },
    unpaid: { label: 'Unpaid',  color: '#FF9800', icon: Clock },
    overdue:{ label: 'Overdue', color: '#ef4444', icon: AlertTriangle },
  };

  const totalUnpaid = payments.filter(p => p.status === 'unpaid').reduce((sum, p) => {
    const amt = parseFloat(p.amount.replace('KD ', '')) || 0;
    return sum + amt;
  }, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Payments</h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>All your subscription and node payment history</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Payments', value: payments.length.toString(), icon: Receipt, color: '#2D7A3E' },
          { label: 'Paid', value: payments.filter(p => p.status === 'paid').length.toString(), icon: CheckCircle, color: '#4CAF50' },
          { label: 'Pending', value: payments.filter(p => p.status === 'unpaid').length.toString(), icon: Clock, color: '#FF9800' },
          { label: 'Amount Due', value: `KD ${totalUnpaid.toFixed(2)}`, icon: CreditCard, color: '#ef4444' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} whileHover={{ y: -3 }}
              className={`rounded-2xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}20` }}>
                  <Icon size={14} style={{ color: s.color }} />
                </div>
                <span className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{s.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Node requests status */}
      {nodeRequests.length > 0 && (
        <div className={`rounded-2xl border p-5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h3 className={`font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Node Requests</h3>
          <div className="space-y-3">
            {nodeRequests.map(req => (
              <div key={req.id} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${req.status === 'approved' ? 'bg-green-primary/15' : req.status === 'pending' ? 'bg-amber/15' : 'bg-red-100'}`}>
                    <Wifi size={15} className={req.status === 'approved' ? 'text-green-primary' : req.status === 'pending' ? 'text-amber' : 'text-red-500'} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{req.nodeName}</p>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{req.location} · {req.requestedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {req.status === 'pending' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber/15 text-amber">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" /> Pending Approval
                    </span>
                  )}
                  {req.status === 'approved' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-primary/15 text-green-primary">
                      <CheckCircle size={11} /> Approved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments table */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
        {/* Tabs */}
        <div className={`flex border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-green-primary text-green-primary'
                  : `border-transparent ${isDark ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`
              }`}>
              {tab}
              {tab === 'Unpaid' && payments.filter(p => p.status === 'unpaid').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[9px]">
                  {payments.filter(p => p.status === 'unpaid').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            <CreditCard size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No payments found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((p, i) => {
              const sc = statusConfig[p.status];
              const SIcon = sc.icon;
              const isPayingThis = paying === p.id;
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-green-primary/[0.03] transition-colors ${isDark ? 'divide-white/5' : ''}`}>
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${p.type === 'subscription' ? 'bg-sky/15' : 'bg-green-primary/10'}`}>
                      {p.type === 'subscription' ? <CreditCard size={16} className="text-sky" /> : <Wifi size={16} className="text-green-primary" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.label}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                          {p.status === 'paid' ? `Paid ${p.paidAt}` : `Due ${p.dueDate}`}
                        </span>
                        <span className={`text-[10px] font-medium ${p.type === 'subscription' ? 'text-sky' : 'text-green-primary'}`}>
                          {p.type === 'subscription' ? 'Subscription' : 'Node Purchase'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{p.amount}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${sc.color}15`, color: sc.color }}>
                      <SIcon size={10} /> {sc.label}
                    </span>
                    {p.status === 'unpaid' && (
                      <motion.button onClick={() => handlePay(p.id)} disabled={!!paying} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-primary text-white text-xs font-bold rounded-xl hover:bg-green-light transition-colors disabled:opacity-50">
                        {isPayingThis ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CreditCard size={11} /> Pay Now</>}
                      </motion.button>
                    )}
                    {p.status === 'paid' && (
                      <button className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-white/20 hover:text-white/50 hover:bg-white/5' : 'text-gray-300 hover:text-gray-600 hover:bg-gray-50'}`}>
                        <Download size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
