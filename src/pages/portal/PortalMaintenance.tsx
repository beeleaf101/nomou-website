import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Plus, X, CheckCircle, Clock, AlertTriangle, MapPin, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePayments } from '../../hooks/usePayments';
import { useTheme } from '../../hooks/useTheme';

type TicketStatus   = 'open' | 'in_progress' | 'resolved';
type TicketPriority = 'low' | 'medium' | 'high';

interface Ticket {
  id: string; nodeId: string; nodeName: string; nodeLocation: string;
  type: string; description: string; priority: TicketPriority;
  status: TicketStatus; createdAt: string; updatedAt: string;
}

const ISSUE_TYPES = ['Sensor Malfunction','Physical Damage','Connectivity Issue','Battery / Power Issue','Calibration Needed','Node Offline','Software Bug','Other'];
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const TOKEN_KEY = 'nomou_access_token';

const statusCfg: Record<TicketStatus,{ label:string; color:string; bg:string; icon:React.ElementType }> = {
  open:        { label:'Open',        color:'#FF9800', bg:'#FFF3E0', icon:Clock },
  in_progress: { label:'In Progress', color:'#03A9F4', bg:'#E3F2FD', icon:Wrench },
  resolved:    { label:'Resolved',    color:'#4CAF50', bg:'#E8F5E9', icon:CheckCircle },
};
const priCfg: Record<TicketPriority,{ label:string; color:string }> = {
  low:    { label:'Low',    color:'#8BC34A' },
  medium: { label:'Medium', color:'#FF9800' },
  high:   { label:'High',   color:'#ef4444' },
};

async function sbFetch(method: string, path: string, body?: unknown, token?: string | null) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: { 'Content-Type':'application/json','apikey':SUPABASE_ANON_KEY,'Authorization':`Bearer ${token ?? SUPABASE_ANON_KEY}`,...(method!=='GET'?{'Prefer':'return=representation'}:{}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { ok: res.ok, data: await res.json().catch(()=>({})) };
}

export default function PortalMaintenance() {
  const { user } = useAuth();
  const { nodeRequests } = usePayments();
  const { isDark } = useTheme();
  const [tickets, setTickets]   = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter]     = useState<TicketStatus|'all'>('all');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [form, setForm] = useState({ nodeId:'', type: ISSUE_TYPES[0], priority:'medium' as TicketPriority, description:'' });

  // All nodes the user has — from user.nodes + approved node requests
  const approvedNodes = [
    ...(user?.nodes ?? []),
    ...nodeRequests
      .filter(r => r.status === 'approved')
      .map(r => ({ id: r.id, name: r.nodeName, location: r.location, status: 'online' as const, lastSeen:'—', soil:0,air:0,water:0,temp:0,humidity:0,lat:0,lng:0 })),
  ];

  // Load tickets from Supabase
  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return; }
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await sbFetch('GET', `/rest/v1/maintenance_tickets?user_id=eq.${user.id}&order=created_at.desc&select=*`, undefined, token);
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        setTickets(res.data.map((t: Record<string,unknown>) => {
          const node = approvedNodes.find(n => n.id === t.node_id);
          return {
            id: t.id as string,
            nodeId: t.node_id as string ?? '—',
            nodeName: node?.name ?? (t.node_id as string) ?? 'Unknown Node',
            nodeLocation: (node as { location?: string })?.location ?? '—',
            type: t.type as string,
            description: t.description as string,
            priority: t.priority as TicketPriority,
            status: t.status as TicketStatus,
            createdAt: new Date(t.created_at as string).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
            updatedAt: new Date(t.updated_at as string).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
          };
        }));
      }
      setLoading(false);
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Pre-fill node if only one
  useEffect(() => {
    if (approvedNodes.length === 1 && !form.nodeId) setForm(f => ({ ...f, nodeId: approvedNodes[0].id }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvedNodes.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSubmitting(true);
    const token = localStorage.getItem(TOKEN_KEY);
    const node  = approvedNodes.find(n => n.id === form.nodeId);
    const newTicket: Ticket = {
      id: `TMP-${Date.now()}`,
      nodeId: form.nodeId,
      nodeName: node?.name ?? 'Unknown',
      nodeLocation: (node as { location?: string })?.location ?? '—',
      type: form.type, description: form.description, priority: form.priority,
      status:'open',
      createdAt: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
      updatedAt: 'Just now',
    };
    if (user && token) {
      const res = await sbFetch('POST', '/rest/v1/maintenance_tickets', {
        user_id: user.id, node_id: form.nodeId || null,
        type: form.type, description: form.description,
        priority: form.priority, status: 'open',
      }, token);
      if (res.ok && res.data?.[0]) newTicket.id = res.data[0].id as string;
    }
    setTickets(prev => [newTicket, ...prev]);
    setSubmitting(false); setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setForm({ nodeId: approvedNodes[0]?.id ?? '', type: ISSUE_TYPES[0], priority:'medium', description:'' }); }, 1600);
  };

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);
  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${isDark?'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-green-primary':'bg-gray-50 border-gray-200 text-gray-900 focus:border-green-primary focus:bg-white'}`;
  const card = `rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-white border-gray-100 shadow-sm'}`;

  if (!user) return null;

  // Plan gate — standard users can't submit maintenance
  const canSubmit = user.plan !== 'bronze';

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black ${isDark?'text-white':'text-[#0a120e]'}`}>Maintenance</h2>
          <p className={`text-sm mt-1 ${isDark?'text-white/40':'text-gray-500'}`}>Report and track repair requests for your nodes</p>
        </div>
        {canSubmit ? (
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={() => setShowForm(true)}
            disabled={approvedNodes.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-primary text-white font-bold rounded-xl text-sm hover:bg-green-light transition-colors shrink-0 disabled:opacity-40">
            <Plus size={16}/> New Request
          </motion.button>
        ) : (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border ${isDark?'border-white/10 text-white/40':'border-gray-200 text-gray-400 bg-gray-50'}`}>
            🔒 Premium+ only
          </div>
        )}
      </div>

      {/* Plan gate banner for standard */}
      {!canSubmit && (
        <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border ${isDark?'bg-amber-500/10 border-amber-500/20':'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={15} className="text-amber-500 shrink-0"/>
            <p className={`text-sm font-medium ${isDark?'text-amber-300':'text-amber-800'}`}>
              Maintenance requests require Premium or Supreme plan.
            </p>
          </div>
          <a href="/pricing" className="text-xs font-bold text-green-primary bg-green-primary/10 px-3 py-1.5 rounded-lg hover:bg-green-primary/20 transition-colors whitespace-nowrap">Upgrade</a>
        </div>
      )}

      {/* No nodes */}
      {approvedNodes.length === 0 && (
        <div className={`${card} p-10 text-center`}>
          <Wifi size={28} className={`mx-auto mb-3 ${isDark?'text-white/20':'text-gray-300'}`}/>
          <p className={`text-sm font-medium ${isDark?'text-white/40':'text-gray-500'}`}>No nodes yet. Request a node from the Dashboard to start submitting maintenance tickets.</p>
        </div>
      )}

      {/* Node health overview */}
      {approvedNodes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {approvedNodes.map(n => {
            const SIcon = n.status === 'online' ? Wifi : WifiOff;
            const statusColor = n.status === 'online' ? '#4CAF50' : '#ef4444';
            const openCount = tickets.filter(t => t.nodeId === n.id && t.status === 'open').length;
            return (
              <motion.div key={n.id} whileHover={{ y:-3 }}
                className={`${card} p-4 flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor:`${statusColor}15` }}>
                  <SIcon size={18} style={{ color: statusColor }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-bold truncate ${isDark?'text-white':'text-gray-900'}`}>{n.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 capitalize"
                      style={{ backgroundColor:`${statusColor}15`, color:statusColor }}>{n.status}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className={isDark?'text-white/30':'text-gray-400'}/>
                    <span className={`text-xs truncate ${isDark?'text-white/40':'text-gray-400'}`}>{(n as { location?: string }).location ?? '—'}</span>
                  </div>
                  {openCount > 0 && (
                    <div className="mt-1.5 text-[11px] font-semibold text-amber-500">
                      {openCount} open ticket{openCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(statusCfg) as [TicketStatus, typeof statusCfg[TicketStatus]][]).map(([s, cfg]) => {
          const Icon = cfg.icon;
          const count = tickets.filter(t => t.status === s).length;
          return (
            <motion.div key={s} whileHover={{ y:-3 }}
              onClick={() => setFilter(filter === s ? 'all' : s)}
              className={`${card} p-4 cursor-pointer transition-all ${filter===s?(isDark?'!border-white/30':'!border-gray-300'):''}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={15} style={{ color:cfg.color }}/>
                <span className={`text-xs font-medium ${isDark?'text-white/50':'text-gray-500'}`}>{cfg.label}</span>
              </div>
              <div className={`text-2xl font-black ${isDark?'text-white':'text-[#0a120e]'}`}>{count}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {loading && (
          <div className="text-center py-10">
            <span className="w-6 h-6 border-2 border-green-primary/30 border-t-green-primary rounded-full animate-spin inline-block"/>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border ${isDark?'border-white/10 text-white/30':'border-gray-100 text-gray-400'}`}>
            {filter === 'all' ? 'No maintenance tickets yet.' : `No ${filter.replace('_',' ')} tickets.`}
          </div>
        )}
        <AnimatePresence>
          {filtered.map((t, i) => {
            const sc = statusCfg[t.status];
            const pc = priCfg[t.priority];
            const SIcon = sc.icon;
            return (
              <motion.div key={t.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }} transition={{ delay: i*0.04 }}
                className={`${card} p-5`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor:sc.bg }}>
                      <SIcon size={17} style={{ color:sc.color }}/>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${isDark?'text-white':'text-gray-900'}`}>{t.type}</span>
                        <span className="text-xs font-semibold" style={{ color:pc.color }}>● {pc.label} priority</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className={isDark?'text-white/30':'text-gray-400'}/>
                        <span className={`text-xs ${isDark?'text-white/40':'text-gray-400'}`}>{t.nodeName} · {t.nodeLocation !== '—' ? t.nodeLocation : t.nodeId}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                    style={{ backgroundColor:sc.bg, color:sc.color }}>{sc.label}</span>
                </div>
                <p className={`text-sm leading-relaxed mb-3 ${isDark?'text-white/55':'text-gray-600'}`}>{t.description}</p>
                <div className={`flex items-center justify-between text-xs ${isDark?'text-white/30':'text-gray-400'}`}>
                  <span>Opened {t.createdAt}</span>
                  <span>Updated {t.updatedAt}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* New request modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowForm(false)}/>
            <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
              className={`fixed inset-x-4 top-[5%] z-50 max-w-lg mx-auto rounded-3xl shadow-2xl border max-h-[90vh] overflow-y-auto ${isDark?'bg-[#0d1f12] border-white/10':'bg-white border-gray-100'} p-6`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`font-black text-lg ${isDark?'text-white':'text-[#0a120e]'}`}>New Maintenance Request</h3>
                <button onClick={() => setShowForm(false)} className={`p-2 rounded-xl ${isDark?'hover:bg-white/10 text-white/60':'hover:bg-gray-100 text-gray-500'}`}><X size={18}/></button>
              </div>
              {submitted ? (
                <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center py-8">
                  <CheckCircle size={48} className="text-green-primary mx-auto mb-3"/>
                  <p className={`font-bold text-lg ${isDark?'text-white':'text-gray-900'}`}>Request Submitted!</p>
                  <p className={`text-sm mt-1 ${isDark?'text-white/40':'text-gray-500'}`}>Our team will respond within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${isDark?'text-white/40':'text-gray-500'}`}>Node</label>
                    <select required value={form.nodeId} onChange={e => setForm(f => ({...f, nodeId:e.target.value}))} className={inputCls}>
                      <option value="">Select a node…</option>
                      {approvedNodes.map(n => (
                        <option key={n.id} value={n.id}>{n.name} — {(n as { location?: string }).location ?? n.id}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${isDark?'text-white/40':'text-gray-500'}`}>Issue Type</label>
                      <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} className={inputCls}>
                        {ISSUE_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${isDark?'text-white/40':'text-gray-500'}`}>Priority</label>
                      <select value={form.priority} onChange={e => setForm(f=>({...f,priority:e.target.value as TicketPriority}))} className={inputCls}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High — Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${isDark?'text-white/40':'text-gray-500'}`}>Description</label>
                    <textarea required rows={4} placeholder="Describe the issue in detail — what you observed, when it started, any error codes…"
                      value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))}
                      className={`${inputCls} resize-none`}/>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setShowForm(false)}
                      className={`flex-1 py-2.5 rounded-xl font-semibold text-sm border ${isDark?'border-white/10 text-white/60 hover:bg-white/5':'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>Cancel</button>
                    <motion.button type="submit" disabled={submitting} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-green-primary text-white hover:bg-green-light transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                      {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Wrench size={14}/> Submit Request</>}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
