import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets, Wind, CloudRain, Thermometer, Wifi, WifiOff, AlertTriangle,
  ArrowUpRight, Map, FileBarChart2, Wrench, Plus, X, CheckCircle, Clock,
  CreditCard, Activity, Sun, TrendingUp, TrendingDown, Zap
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { usePayments } from '../../hooks/usePayments';
import { useTheme } from '../../hooks/useTheme';
import { useArduinoData } from '../../hooks/useArduinoData';

export default function PortalDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { nodeRequests, payments, requestNode } = usePayments();
  const { current: arduino, history: arduinoHistory } = useArduinoData();
  const [selectedNode, setSelectedNode] = useState(user?.nodes[0]?.id ?? '');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqLocation, setReqLocation] = useState('');
  const [reqSubmitted, setReqSubmitted] = useState(false);

  if (!user) return null;

  const planNodeLimit: Record<string, number> = { trial: 999, bronze: 999, silver: 999, gold: 999 };
  const nodeLimit = planNodeLimit[user.plan ?? 'trial'];
  const approvedRequests = nodeRequests.filter(r => r.status === 'approved');
  const pendingRequests  = nodeRequests.filter(r => r.status === 'pending');
  const hasApprovedNode  = approvedRequests.length > 0 || user.nodes.length > 0;
  const canRequestMore   = (user.nodes.length + nodeRequests.filter(r => r.status !== 'rejected').length) < nodeLimit;

  const handleRequestNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName || !reqLocation) return;
    requestNode(reqName, reqLocation);
    setReqSubmitted(true);
    setTimeout(() => { setShowRequestModal(false); setReqSubmitted(false); setReqName(''); setReqLocation(''); }, 2000);
  };

  const node = user.nodes.find(n => n.id === selectedNode) ?? user.nodes[0];
  const statusColor = { online: '#4CAF50', offline: '#ef4444', warning: '#FF9800' };
  const StatusIcon  = { online: Wifi, offline: WifiOff, warning: AlertTriangle };

  // Sensor status helpers
  const soilStatus  = arduino.soil_pct < 25 ? { label: 'Critical', color: '#ef4444' } : arduino.soil_pct < 40 ? { label: 'Low', color: '#FF9800' } : { label: 'Optimal', color: '#4CAF50' };
  const tempStatus  = arduino.temperature > 37 ? { label: 'High', color: '#ef4444' } : arduino.temperature > 33 ? { label: 'Warm', color: '#FF9800' } : { label: 'Normal', color: '#4CAF50' };
  const humidStatus = arduino.humidity < 40 ? { label: 'Low', color: '#FF9800' } : arduino.humidity > 80 ? { label: 'High', color: '#FF9800' } : { label: 'Good', color: '#4CAF50' };

  const liveMetrics = [
    { label: 'Soil Moisture', icon: Droplets,    color: '#03A9F4', value: arduino.soil_pct,    suffix: '%',  status: soilStatus,  trend: TrendingDown },
    { label: 'Temperature',   icon: Thermometer, color: '#FF9800', value: arduino.temperature, suffix: '°C', status: tempStatus,  trend: TrendingUp },
    { label: 'Humidity',      icon: CloudRain,   color: '#8BC34A', value: arduino.humidity,    suffix: '%',  status: humidStatus, trend: TrendingUp },
    { label: 'Light Level',   icon: Sun,         color: '#9C27B0', value: arduino.light_pct,   suffix: '%',  status: { label: arduino.light_cat, color: '#9C27B0' }, trend: TrendingUp },
  ];

  const chartData = arduinoHistory.labels.length > 0
    ? arduinoHistory.labels.map((time, i) => ({ time, soil: arduinoHistory.soil[i] ?? 0, temp: arduinoHistory.temp[i] ?? 0, humidity: arduinoHistory.humid[i] ?? 0 }))
    : Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, soil: 25 + Math.sin(i * 0.5) * 8, temp: 28 + Math.sin(i * 0.4) * 5, humidity: 55 + Math.cos(i * 0.35) * 10 }));

  // Plan feature gates
  const planFeatures: Record<string, { reports: boolean; maintenance: boolean; map: boolean; alerts: boolean; ai: boolean }> = {
    trial:  { reports: true,  maintenance: true,  map: true,  alerts: true,  ai: true  },
    bronze: { reports: true,  maintenance: false, map: true,  alerts: false, ai: false },
    silver: { reports: true,  maintenance: true,  map: true,  alerts: true,  ai: false },
    gold:   { reports: true,  maintenance: true,  map: true,  alerts: true,  ai: true  },
  };
  const features = planFeatures[user.plan] ?? planFeatures.bronze;

  const unpaidPayments = payments.filter(p => p.status === 'unpaid');

  // Trial banner
  const trialDaysLeft = user.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;

  const card = `rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* Trial banner */}
      {user.plan === 'trial' && trialDaysLeft !== null && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-lime/20 border border-lime/40">
          <div className="flex items-center gap-2.5">
            <Zap size={16} className="text-forest shrink-0" />
            <div>
              <p className="text-sm font-bold text-forest">Free Trial — {trialDaysLeft} days remaining</p>
              <p className="text-xs text-forest/70">You have full Supreme access. Upgrade before your trial ends.</p>
            </div>
          </div>
          <Link to="/pricing" className="px-3 py-1.5 bg-green-primary text-white text-xs font-bold rounded-xl whitespace-nowrap hover:bg-green-light transition-colors">
            View Plans
          </Link>
        </motion.div>
      )}

      {/* Welcome + stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Welcome card */}
        <div className={`${card} p-5 lg:col-span-1`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Welcome back</p>
              <h2 className={`text-xl font-black mt-0.5 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{user.name.split(' ')[0]}</h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{user.company ?? 'Your Farm'}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                user.plan === 'trial'    ? 'bg-lime/20 text-forest' :
                user.plan === 'bronze' ? 'bg-amber-100 text-amber-700' :
                user.plan === 'silver' ? 'bg-gray-100 text-gray-700' :
                user.plan === 'gold'   ? 'bg-yellow-100 text-yellow-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {user.plan === 'trial' ? 'Free Trial' : user.plan}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Nodes', value: user.nodes.length + approvedRequests.length },
              { label: 'Pending', value: pendingRequests.length },
              { label: 'Unpaid', value: unpaidPayments.length },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-3 text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{s.value}</p>
                <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{s.label}</p>
              </div>
            ))}
          </div>
          {/* Plan feature access */}
          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Your Plan Includes</p>
            <div className="space-y-1">
              {[
                { label: 'Live Dashboard', included: true },
                { label: 'Reports', included: features.reports },
                { label: 'Maintenance Requests', included: features.maintenance },
                { label: 'Custom Alerts', included: features.alerts },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium ${f.included ? (isDark ? 'text-white/70' : 'text-gray-700') : (isDark ? 'text-white/20' : 'text-gray-300')}`}>
                    {f.included ? '✓' : '✗'} {f.label}
                  </span>
                  {!f.included && (
                    <Link to="/pricing" className="text-[10px] text-green-primary font-semibold hover:underline">Upgrade</Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live node status */}
        <div className={`${card} p-5 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Node Status</h3>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Real-time sensor readings</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${arduino.online ? 'bg-green-primary/10 border border-green-primary/20 text-green-primary' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${arduino.online ? 'bg-green-primary' : 'bg-red-500'}`} />
              {arduino.online ? 'Live' : 'Offline'}
            </div>
          </div>
          {hasApprovedNode ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {liveMetrics.map(m => {
                const Icon = m.icon;
                return (
                  <motion.div key={m.label} whileHover={{ y:-4 }}
                    className={`rounded-xl p-3 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor:`${m.color}20` }}>
                        <Icon size={13} style={{ color: m.color }} />
                      </div>
                      <span className="text-[10px] font-bold capitalize" style={{ color: m.status.color }}>{m.status.label}</span>
                    </div>
                    <div className={`text-xl font-black font-mono ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>
                      {m.suffix === '°C' ? m.value.toFixed(1) : Math.round(m.value)}{m.suffix}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{m.label}</div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Wifi size={28} className={`mx-auto mb-2 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
              <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>No active nodes yet. Request a node below.</p>
            </div>
          )}
        </div>
      </div>

      {/* Unpaid payment alerts */}
      {unpaidPayments.map(p => (
        <motion.div key={p.id} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">{p.label}</p>
              <p className="text-xs text-amber-600">Payment due by {p.dueDate} · {p.amount}</p>
            </div>
          </div>
          <Link to="/portal/payments">
            <motion.div whileHover={{ scale:1.05 }} className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-xl whitespace-nowrap">Pay Now</motion.div>
          </Link>
        </motion.div>
      ))}

      {/* Node request status badges */}
      {nodeRequests.map(r => r.status !== 'rejected' && (
        <motion.div key={r.id} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${r.status === 'approved' ? (isDark ? 'bg-green-primary/10 border-green-primary/20' : 'bg-green-50 border-green-200') : (isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}`}>
          {r.status === 'approved'
            ? <CheckCircle size={16} className="text-green-primary shrink-0" />
            : <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-gray-400 shrink-0" />}
          <div>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {r.nodeName} — {r.status === 'approved' ? 'Approved' : 'Pending Review'}
            </p>
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
              {r.status === 'approved' ? 'Node approved! Check payments for invoice.' : 'Usually reviewed within 24 hours.'}
            </p>
          </div>
        </motion.div>
      ))}

      {/* Request node button */}
      {canRequestMore && (
        <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
          onClick={() => setShowRequestModal(true)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed font-semibold text-sm transition-all ${isDark ? 'border-white/10 text-white/40 hover:border-green-primary/40 hover:text-green-light' : 'border-gray-200 text-gray-400 hover:border-green-primary/40 hover:text-green-primary'}`}>
          <Plus size={16} /> Request a Node
        </motion.button>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/portal/map',         icon: Map,          label: 'Node Map',    color: '#2D7A3E', locked: false },
          { to: '/portal/reports',     icon: FileBarChart2,label: 'Reports',     color: '#03A9F4', locked: !features.reports },
          { to: '/portal/maintenance', icon: Wrench,       label: 'Maintenance', color: '#FF9800', locked: !features.maintenance },
          { to: '/portal/payments',    icon: CreditCard,   label: 'Payments',    color: '#8BC34A', locked: false },
        ].map(a => {
          const Icon = a.icon;
          const content = (
            <motion.div whileHover={{ y:-4 }} whileTap={{ scale:0.97 }}
              className={`${card} p-4 flex flex-col items-center gap-2 cursor-pointer transition-all relative ${a.locked ? 'opacity-50' : ''}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor:`${a.color}20` }}>
                <Icon size={20} style={{ color: a.color }} />
              </div>
              <span className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{a.label}</span>
              {a.locked && <span className="absolute top-2 right-2 text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Upgrade</span>}
            </motion.div>
          );
          return a.locked
            ? <Link key={a.to} to="/pricing">{content}</Link>
            : <Link key={a.to} to={a.to}>{content}</Link>;
        })}
      </div>

      {/* Chart — shown when node approved */}
      {hasApprovedNode && (
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>24h Trends</h3>
              <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Soil · Temp · Humidity from your node</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-primary/10 border border-green-primary/20">
              <Activity size={11} className="text-green-primary" />
              <span className="text-xs font-bold text-green-primary">Live</span>
            </div>
          </div>
          <div className="flex gap-4 mb-3 flex-wrap">
            {[{ c:'#0288D1',l:'Soil %' },{ c:'#E65100',l:'Temp °C' },{ c:'#2E7D32',l:'Humidity %' }].map(l=>(
              <div key={l.l} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{background:l.c}}/><span className="text-xs text-gray-500">{l.l}</span></div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="pdgs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0288D1" stopOpacity={0.3}/><stop offset="95%" stopColor="#0288D1" stopOpacity={0}/></linearGradient>
                <linearGradient id="pdgt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E65100" stopOpacity={0.3}/><stop offset="95%" stopColor="#E65100" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0'} vertical={false}/>
              <XAxis dataKey="time" tick={{fontSize:10,fill:isDark?'rgba(255,255,255,0.3)':'#9E9E9E'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:isDark?'rgba(255,255,255,0.3)':'#9E9E9E'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:isDark?'#0d1f12':'#fff',border:'1px solid rgba(0,0,0,0.1)',borderRadius:12,fontSize:12}}/>
              <Area type="monotone" dataKey="soil"     stroke="#0288D1" fill="url(#pdgs)" strokeWidth={2} name="Soil %"     dot={false}/>
              <Area type="monotone" dataKey="temp"     stroke="#E65100" fill="url(#pdgt)" strokeWidth={2} name="Temp °C"    dot={false}/>
              <Area type="monotone" dataKey="humidity" stroke="#2E7D32" fill="none"       strokeWidth={2} name="Humidity %" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* No nodes empty state */}
      {!hasApprovedNode && user.nodes.length === 0 && nodeRequests.length === 0 && (
        <div className={`${card} p-12 text-center`}>
          <div className="w-16 h-16 rounded-2xl bg-green-primary/10 flex items-center justify-center mx-auto mb-4">
            <Wifi size={32} className="text-green-primary" />
          </div>
          <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>No nodes yet</h3>
          <p className={`text-sm mb-6 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Request a node above to start monitoring your farm with live environmental data.</p>
          <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-green-primary text-white font-bold rounded-2xl hover:bg-green-light transition-colors">
            View Plans <ArrowUpRight size={16} />
          </Link>
        </div>
      )}

      {/* Request node modal */}
      <AnimatePresence>
        {showRequestModal && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowRequestModal(false)} />
            <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
              className={`fixed inset-x-4 top-[5%] z-50 max-w-md mx-auto rounded-3xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#0d1f12] border-white/10' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Request a Node</h3>
                <button onClick={() => setShowRequestModal(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-gray-100 text-gray-400'}`}><X size={18}/></button>
              </div>
              {reqSubmitted ? (
                <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center py-6">
                  <CheckCircle size={40} className="text-green-primary mx-auto mb-3"/>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Request Submitted!</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>We'll notify you once approved.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleRequestNode} className="space-y-4">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Node Name</label>
                    <input required value={reqName} onChange={e => setReqName(e.target.value)} placeholder="e.g. North Greenhouse"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-green-primary/60' : 'bg-gray-50 border-gray-200 focus:border-green-primary focus:bg-white'}`}/>
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Location</label>
                    <input required value={reqLocation} onChange={e => setReqLocation(e.target.value)} placeholder="e.g. Al-Wafra Farm, Block 3"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-green-primary/60' : 'bg-gray-50 border-gray-200 focus:border-green-primary focus:bg-white'}`}/>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Node purchase price: <strong>KD 120</strong> · Payment due within 14 days of approval</p>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setShowRequestModal(false)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border ${isDark ? 'border-white/10 text-white/50 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>Cancel</button>
                    <motion.button type="submit" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-primary text-white hover:bg-green-light transition-colors flex items-center justify-center gap-2">
                      <Plus size={14}/> Submit Request
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
