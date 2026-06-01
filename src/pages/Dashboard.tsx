import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Droplets, Wind, Thermometer, CloudRain, Download, FileText, Battery, Signal, MapPin, AlertTriangle, CheckCircle, Wifi, Calendar, Printer, RefreshCw, TrendingUp } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useTheme } from '../hooks/useTheme';
import { useArduinoData } from '../hooks/useArduinoData';

function generateData(hours: number) {
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      soil: 20 + Math.random() * 15,
      air: 30 + Math.random() * 25,
      water: 6.5 + Math.random() * 2,
      temp: 25 + Math.random() * 12,
      humidity: 45 + Math.random() * 30,
    });
  }
  return data;
}

const nodesList = [
  { id: 'A1', name: 'Field Station Alpha', location: 'Al-Wafra Farm', status: 'online', battery: 87, signal: 92 },
  { id: 'B2', name: 'Greenhouse Beta', location: 'Al-Abdali', status: 'online', battery: 64, signal: 78 },
  { id: 'C3', name: 'Research Gamma', location: 'KU Field', status: 'online', battery: 91, signal: 95 },
  { id: 'D4', name: 'Orchard Delta', location: 'Al-Jahra', status: 'warning', battery: 23, signal: 45 },
  { id: 'E5', name: 'Desert Epsilon', location: 'Al-Salmi', status: 'offline', battery: 0, signal: 0 },
];

const timeRanges = [
  { label: '1H', value: 1 },
  { label: '6H', value: 6 },
  { label: '24H', value: 24 },
  { label: '7D', value: 168 },
];




const pieData = [
  { name: 'Online', value: 3, color: '#4CAF50' },
  { name: 'Warning', value: 1, color: '#FF9800' },
  { name: 'Offline', value: 1, color: '#ef4444' },
];

const weeklyReport = [
  { day: 'Sun', avgSoil: 26, avgTemp: 30, alerts: 0 },
  { day: 'Mon', avgSoil: 25, avgTemp: 31, alerts: 1 },
  { day: 'Tue', avgSoil: 28, avgTemp: 32, alerts: 0 },
  { day: 'Wed', avgSoil: 29, avgTemp: 33, alerts: 2 },
  { day: 'Thu', avgSoil: 27, avgTemp: 31, alerts: 0 },
  { day: 'Fri', avgSoil: 26, avgTemp: 30, alerts: 1 },
  { day: 'Sat', avgSoil: 28, avgTemp: 29, alerts: 0 },
];

function AnimatedCounter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value === prevValue.current) return;
    prevValue.current = value;
    const from = display;
    const duration = 800;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplay(value);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}</span>;
}

export default function Dashboard() {
  const { isDark } = useTheme();
  const { current, history, loading, error } = useArduinoData();

  // Build live metrics from real Arduino data
  const allMetrics = [
    { label: 'Soil Moisture', value: current.soil_pct,    suffix: '%',   icon: Droplets,     color: '#03A9F4', status: current.soil_cat },
    { label: 'Air Quality',   value: 42,                  suffix: ' AQI',icon: Wind,         color: '#4CAF50', status: 'Good' },
    { label: 'Temperature',   value: current.temperature, suffix: '°C',  decimals: 1, icon: Thermometer, color: '#FF9800', status: '' },
    { label: 'Humidity',      value: current.humidity,    suffix: '%',   icon: CloudRain,    color: '#4CAF50', status: current.humidity_cat },
    { label: 'Light Level',   value: current.light_pct,   suffix: '%',   icon: TrendingUp,   color: '#9C27B0', status: current.light_cat },
  ];

  // Build chart data from Arduino history (last 20 readings every 30s)
  const data = history.labels.length > 0
    ? history.labels.map((time, i) => ({
        time,
        soil:     history.soil[i]  ?? 0,
        temp:     history.temp[i]  ?? 0,
        humidity: history.humid[i] ?? 0,
        light:    history.light[i] ?? 0,
        air:      42, // not in Arduino sensors — keep as static
        water:    7.1,
      }))
    : generateData(24); // fallback to mock while loading
  const [selectedRange, setSelectedRange] = useState(24);
  const [activeMetrics, setActiveMetrics] = useState({ soil: true, air: true, water: true, temp: true, humidity: true });
  const [showReport, setShowReport] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // data is now built from Arduino history above — no useMemo needed
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const bg = isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-md';
  const textMain = isDark ? 'text-white' : 'text-[#0a120e]';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-500';
  const textFaint = isDark ? 'text-white/30' : 'text-gray-400';

  return (
    <div className={`min-h-[100dvh] ${bg} transition-colors duration-500 overflow-x-hidden`}>

      {/* ── LIVE NODE STATUS BANNER ── */}
      <div className={`${current.online
        ? isDark ? 'bg-green-primary/15 border-b border-green-primary/20' : 'bg-green-primary/10 border-b border-green-primary/15'
        : 'bg-red-500/10 border-b border-red-500/20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {current.online ? (
              <>
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-light animate-ping opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-light" />
                </span>
                <p className={`text-xs font-semibold ${isDark ? 'text-green-light' : 'text-green-primary'}`}>
                  <span className="font-black">Live Node Data</span> — Reading from NOMOU Node A1 · Last updated {current.lastUpdated.toLocaleTimeString()}
                </p>
              </>
            ) : (
              <>
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <p className="text-xs font-semibold text-red-600">
                  {error ?? 'Node offline'} — showing last known readings. Make sure your Arduino is connected and ngrok is running.
                </p>
              </>
            )}
          </div>
          {loading && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-gray-300 border-t-green-primary rounded-full animate-spin inline-block" />
              Connecting…
            </span>
          )}
        </div>
      </div>
      {/* ═══════════════ HEADER ═══════════════ */}
      <section className={`relative pt-28 pb-10 transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-[#0d1f12] via-[#0a120e] to-[#0d1f12]' : 'bg-gradient-to-br from-pale-green via-off-white to-mint'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-green-primary" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }}
            className="absolute bottom-0 right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-sky" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
                <span className="relative flex h-3 w-3">
                  <motion.span animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inline-flex h-full w-full rounded-full bg-green-light" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-light shadow-[0_0_10px_rgba(139,195,74,0.6)]" />
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-green-light' : 'text-green-primary'}`}>Live System</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className={`text-3xl sm:text-5xl font-black transition-colors duration-500 ${textMain}`}>Environmental Dashboard</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className={`mt-2 transition-colors duration-500 ${textMuted}`}>Real-time data from all active monitoring nodes across Kuwait</motion.p>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowReport(!showReport)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                  isDark ? 'text-amber border-amber/20 hover:bg-amber/10 hover:shadow-[0_0_15px_rgba(255,152,0,0.1)]' : 'text-amber-600 border-amber/20 hover:bg-amber/5'
                } ${showReport ? (isDark ? 'bg-amber/10' : 'bg-amber/5') : ''}`}>
                <FileText size={16} /> {showReport ? 'Hide Report' : 'View Report'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                  isDark ? 'text-green-primary border-green-primary/20 hover:bg-pale-green/20 hover:shadow-[0_0_15px_rgba(76,175,80,0.15)]' : 'text-green-primary border-green-primary/20 hover:bg-pale-green'
                }`}>
                <Download size={16} /> Export
              </motion.button>
              <motion.button whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }} onClick={handleRefresh}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-all ${
                  isDark ? 'text-green-primary border-green-primary/20 hover:bg-pale-green/20' : 'text-green-primary border-green-primary/20 hover:bg-pale-green'
                } ${refreshing ? 'animate-spin' : ''}`}>
                <RefreshCw size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ REPORT PANEL ═══════════════ */}
      <AnimatePresence>
        {showReport && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <motion.div whileHover={{ y: -4, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.3)' : '0 20px 60px rgba(27,94,32,0.06)' }}
              className={`rounded-3xl p-8 border transition-colors duration-500 ${cardBg}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-amber/10' : 'bg-amber/5'}`}>
                    <FileText size={24} className="text-amber" />
                  </motion.div>
                  <div>
                    <h2 className={`text-xl font-bold transition-colors duration-500 ${textMain}`}>Weekly Analytics Report</h2>
                    <p className={`text-xs transition-colors duration-500 ${textFaint}`}>May 17 - May 23, 2026</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition-colors ${isDark ? 'text-white/60 border-white/10 hover:bg-white/5' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                  <Printer size={14} /> Print
                </motion.button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Avg Soil Moisture', value: '27.1%', change: '+3.2%', up: true, icon: Droplets },
                  { label: 'Avg Temperature', value: '30.8°C', change: '-1.4°C', up: false, icon: Thermometer },
                  { label: 'Total Alerts', value: '4', change: '-50%', up: true, icon: AlertTriangle },
                  { label: 'Uptime', value: '99.2%', change: '+0.5%', up: true, icon: CheckCircle },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div key={stat.label} whileHover={{ y: -6, scale: 1.03 }} transition={{ type: 'spring' }}
                      className={`rounded-2xl p-5 border transition-colors duration-500 ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-off-white border-gray-100'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon size={16} className={textFaint} />
                        <span className={`text-xs uppercase tracking-wider transition-colors duration-500 ${textFaint}`}>{stat.label}</span>
                      </div>
                      <div className={`text-3xl font-bold transition-colors duration-500 ${textMain}`}>{stat.value}</div>
                      <span className={`text-xs font-medium ${stat.up ? 'text-green-light' : 'text-amber'}`}>{stat.change}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl p-5 border transition-colors duration-500 ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-off-white border-gray-100'}`}>
                  <h3 className={`text-sm font-semibold mb-4 transition-colors duration-500 ${textMain}`}>Weekly Averages</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyReport}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0'} />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: isDark ? 'rgba(27,94,32,0.95)' : 'white', border: isDark ? 'none' : '1px solid #E8F5E9', borderRadius: 12, fontSize: 12 }} />
                      <Bar dataKey="avgSoil" fill="#03A9F4" radius={[4, 4, 0, 0]} name="Soil %" />
                      <Bar dataKey="avgTemp" fill="#FF9800" radius={[4, 4, 0, 0]} name="Temp °C" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className={`rounded-2xl p-5 border transition-colors duration-500 ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-off-white border-gray-100'}`}>
                  <h3 className={`text-sm font-semibold mb-4 transition-colors duration-500 ${textMain}`}>Alert Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value" stroke={isDark ? '#0a120e' : '#F7FAF7'} strokeWidth={3}>
                        {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: isDark ? 'rgba(27,94,32,0.95)' : 'white', border: isDark ? 'none' : '1px solid #E8F5E9', borderRadius: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ═══════════════ CONTROLS ═══════════════ */}
        <ScrollReveal>
          <motion.div whileHover={{ y: -3 }} className={`rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4 border transition-colors duration-500 ${cardBg}`}>
            <div className="flex items-center gap-1">
              {timeRanges.map((range) => (
                <motion.button key={range.value} onClick={() => setSelectedRange(range.value)}
                  whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    selectedRange === range.value ? 'bg-gradient-to-r from-green-primary to-green-light text-white shadow-lg shadow-green-primary/20' : isDark ? 'text-white/50 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-forest'
                  }`}>{range.label}</motion.button>
              ))}
            </div>
            <div className={`w-px h-6 hidden sm:block ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            <div className="flex items-center gap-2">
              <Calendar size={14} className={textFaint} />
              <span className={`text-xs transition-colors duration-500 ${textFaint}`}>{data.length} data points &middot; Auto-refresh</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-green-light opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-light" />
              </span>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* ═══════════════ METRICS ═══════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {allMetrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <ScrollReveal key={metric.label} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.04, boxShadow: isDark ? `0 0 25px ${metric.color}20` : `0 8px 24px ${metric.color}10` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`relative rounded-2xl p-5 overflow-hidden cursor-pointer transition-colors duration-500 ${
                    isDark ? '' : 'bg-white shadow-md border border-gray-100'
                  }`}
                  style={isDark ? {
                    background: `linear-gradient(135deg, ${metric.color}12 0%, ${metric.color}05 100%)`,
                    border: `1px solid ${metric.color}20`,
                  } : {}}>
                  {isDark && <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)` }} />}
                  <div className="flex items-center justify-between mb-3">
                    <motion.div whileHover={{ rotate: [0, -15, 15, 0], scale: 1.2 }} className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metric.color}15` }}>
                      <Icon size={18} style={{ color: metric.color }} />
                    </motion.div>
                    <span className="w-2.5 h-2.5 rounded-full animate-live-pulse shadow-[0_0_8px_currentColor]" style={{ color: metric.color, backgroundColor: metric.color }} />
                  </div>
                  <div className={`font-mono text-3xl font-bold transition-colors duration-500 ${textMain}`}>
                    <AnimatedCounter value={metric.value} decimals={metric.decimals || 0} />{metric.suffix}
                  </div>
                  <div className={`text-xs uppercase tracking-wider mt-1 transition-colors duration-500 ${textFaint}`}>{metric.label}</div>
                  <svg className="mt-3 w-full h-6" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d={`M0,${15 + Math.random() * 5} Q10,${5 + Math.random() * 10} 20,${10 + Math.random() * 8} T40,${5 + Math.random() * 10} T60,${12 + Math.random() * 6} T80,${4 + Math.random() * 8} T100,${8 + Math.random() * 6}`}
                      fill="none" stroke={metric.color} strokeWidth="2" opacity="0.4" />
                  </svg>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* ═══════════════ MAIN CHART ═══════════════ */}
        <ScrollReveal>
          <motion.div whileHover={{ y: -6, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.3)' : '0 20px 60px rgba(27,94,32,0.06)' }}
            className={`rounded-3xl p-6 sm:p-8 border transition-colors duration-500 ${cardBg}`}>
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div>
                <h3 className={`font-bold text-lg transition-colors duration-500 ${textMain}`}>Environmental Trends</h3>
                <p className={`text-xs transition-colors duration-500 ${textFaint}`}>24-hour sensor data &middot; Updates every 30s</p>
              </div>
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 border transition-colors duration-500 ${isDark ? 'bg-white/5 border-white/5' : 'bg-pale-green border-green-primary/20'}`}>
                <TrendingUp size={14} className="text-lime" />
                <span className="text-lime text-xs font-bold">LIVE</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {[{ key: 'soil', label: 'Soil', color: '#03A9F4' }, { key: 'air', label: 'Air', color: '#4CAF50' }, { key: 'temp', label: 'Temp', color: '#FF9800' }, { key: 'humidity', label: 'Humidity', color: '#8BC34A' }].map((metric) => (
                <motion.button key={metric.key} onClick={() => setActiveMetrics(p => ({ ...p, [metric.key]: !p[metric.key as keyof typeof p] }))}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                    activeMetrics[metric.key as keyof typeof activeMetrics]
                      ? (isDark ? 'bg-pale-green/20 text-forest shadow-[0_0_10px_rgba(139,195,74,0.1)]' : 'bg-pale-green text-forest shadow-sm')
                      : (isDark ? 'bg-white/5 text-white/30 line-through' : 'bg-gray-100 text-gray-400 line-through')
                  }`}>
                  <motion.span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metric.color }}
                    animate={activeMetrics[metric.key as keyof typeof activeMetrics] ? { boxShadow: [`0 0 0px ${metric.color}00`, `0 0 8px ${metric.color}60`, `0 0 0px ${metric.color}00`] } : {}} transition={{ duration: 2, repeat: Infinity }} />
                  {metric.label}
                </motion.button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data}>
                <defs>
                  {[{ id: 'soilGrad', c: '#03A9F4' }, { id: 'airGrad', c: '#4CAF50' }, { id: 'tempGrad', c: '#FF9800' }, { id: 'humGrad', c: '#8BC34A' }].map(g => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={g.c} stopOpacity={isDark ? 0.3 : 0.15} />
                      <stop offset="95%" stopColor={g.c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : '#E8F5E9'} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: isDark ? 'rgba(10,18,14,0.95)' : 'white', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E8F5E9', borderRadius: 16, fontSize: 12, backdropFilter: 'blur(10px)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {activeMetrics.soil && <Area type="monotone" dataKey="soil" stroke="#03A9F4" fill="url(#soilGrad)" strokeWidth={2.5} dot={false} name="Soil Moisture" activeDot={{ r: 6, fill: '#03A9F4', stroke: '#fff', strokeWidth: 2 }} />}
                {activeMetrics.air && <Area type="monotone" dataKey="air" stroke="#4CAF50" fill="url(#airGrad)" strokeWidth={2.5} dot={false} name="Air Quality" activeDot={{ r: 6, fill: '#4CAF50', stroke: '#fff', strokeWidth: 2 }} />}
                {activeMetrics.temp && <Area type="monotone" dataKey="temp" stroke="#FF9800" fill="url(#tempGrad)" strokeWidth={2.5} dot={false} name="Temperature" activeDot={{ r: 6, fill: '#FF9800', stroke: '#fff', strokeWidth: 2 }} />}
                {activeMetrics.humidity && <Area type="monotone" dataKey="humidity" stroke="#8BC34A" fill="url(#humGrad)" strokeWidth={2} dot={false} name="Humidity" activeDot={{ r: 5, fill: '#8BC34A', stroke: '#fff', strokeWidth: 2 }} />}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </ScrollReveal>

        {/* ═══════════════ MAP + SIDEBAR ═══════════════ */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <ScrollReveal className="lg:col-span-2">
            <motion.div whileHover={{ y: -6, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.3)' : '0 20px 60px rgba(27,94,32,0.06)' }}
              className={`rounded-3xl p-6 border transition-colors duration-500 ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold transition-colors duration-500 ${textMain}`}>Node Locations</h3>
                <span className={`flex items-center gap-1 text-xs ${textFaint}`}><MapPin size={12} /> Kuwait</span>
              </div>
              <div className={`relative rounded-2xl overflow-hidden h-[300px] transition-colors duration-500 ${isDark ? 'bg-[#081a0e]' : 'bg-off-white'}`}>
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
                  <polygon points="20,15 45,10 70,12 85,25 80,45 55,50 30,48 15,35" fill="none" stroke={isDark ? 'rgba(76,175,80,0.15)' : 'rgba(45,122,62,0.12)'} strokeWidth="0.5" />
                  {/* Animated connection lines */}
                  <motion.line x1="30" y1="25" x2="55" y2="20" stroke={isDark ? 'rgba(76,175,80,0.1)' : 'rgba(45,122,62,0.08)'} strokeWidth="0.3"
                    animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity }} />
                  <motion.line x1="55" y1="20" x2="75" y2="35" stroke={isDark ? 'rgba(76,175,80,0.1)' : 'rgba(45,122,62,0.08)'} strokeWidth="0.3"
                    animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
                </svg>
                <span className={`absolute top-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider ${textFaint}`}>Kuwait Map Overview</span>
                {nodesList.map((node, i) => {
                  const left = 15 + (i * 16) + (i % 3) * 3;
                  const top = 18 + (i % 3) * 12;
                  const color = node.status === 'online' ? '#4CAF50' : node.status === 'warning' ? '#FF9800' : '#ef4444';
                  return (
                    <motion.div key={node.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
                      className="absolute group cursor-pointer" style={{ left: `${left}%`, top: `${top}%` }}>
                      <span className="relative flex h-5 w-5">
                        {node.status === 'online' && (
                          <motion.span animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
                        )}
                        <motion.span whileHover={{ scale: 1.4 }} className="relative inline-flex rounded-full h-5 w-5 border-2 shadow-lg" style={{ backgroundColor: color, borderColor: isDark ? '#0a120e' : '#F7FAF7', boxShadow: `0 0 12px ${color}60` }} />
                      </span>
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 ${
                        isDark ? 'bg-[#0d1f12] border border-white/10 shadow-2xl' : 'bg-white border border-gray-200 shadow-2xl'
                      }`}>
                        <p className={`text-xs font-bold ${textMain}`}>{node.name}</p>
                        <p className={`text-[10px] ${textFaint}`}>{node.location}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-[10px]"><Battery size={10} />{node.battery}%</span>
                          <span className="flex items-center gap-1 text-[10px]"><Signal size={10} />{node.signal}%</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-5 mt-4">
                {[{ c: '#4CAF50', l: 'Online' }, { c: '#FF9800', l: 'Warning' }, { c: '#ef4444', l: 'Offline' }].map(item => (
                  <div key={item.l} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_6px_currentColor]" style={{ backgroundColor: item.c, color: item.c }} />
                    <span className={`text-xs transition-colors duration-500 ${textFaint}`}>{item.l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Analytics Sidebar */}
          <ScrollReveal>
            <motion.div whileHover={{ y: -6 }} className={`rounded-3xl p-6 border transition-colors duration-500 ${cardBg}`}>
              <h3 className={`text-sm font-bold mb-5 transition-colors duration-500 ${textMain}`}>Node Analytics</h3>

              <div className="mb-6">
                <p className={`text-xs uppercase tracking-wider mb-3 transition-colors duration-500 ${textFaint}`}>Battery Levels</p>
                {nodesList.filter(n => n.status !== 'offline').map(node => (
                  <div key={node.id} className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold w-7 transition-colors duration-500 ${textFaint}`}>{node.id}</span>
                    <div className={`flex-1 h-2.5 rounded-full overflow-hidden transition-colors duration-500 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${node.battery}%` }} transition={{ duration: 1.5, delay: 0.3 + parseInt(node.id.slice(1)) * 0.1, ease: 'easeOut' }}
                        className="h-full rounded-full relative" style={{ backgroundColor: node.battery > 50 ? '#4CAF50' : node.battery > 20 ? '#FF9800' : '#ef4444' }}>
                        <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                      </motion.div>
                    </div>
                    <span className={`text-xs font-mono font-bold transition-colors duration-500 ${textMuted}`}>{node.battery}%</span>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <p className={`text-xs uppercase tracking-wider mb-3 transition-colors duration-500 ${textFaint}`}>Signal Strength</p>
                {nodesList.filter(n => n.status !== 'offline').map(node => (
                  <motion.div key={node.id} whileHover={{ x: 6 }} className="flex items-center gap-3 mb-2.5 cursor-default group">
                    <Wifi size={14} style={{ color: node.signal > 80 ? '#4CAF50' : node.signal > 50 ? '#FF9800' : '#ef4444' }} />
                    <span className={`text-xs transition-colors duration-500 ${textFaint} group-hover:${isDark ? 'text-white/60' : 'text-gray-600'}`}>{node.name.split(' ').pop()}</span>
                    <div className="flex-1" />
                    <span className={`text-xs font-mono font-bold transition-colors duration-500 ${textMuted}`}>{node.signal}%</span>
                  </motion.div>
                ))}
              </div>

              <div>
                <p className={`text-xs uppercase tracking-wider mb-3 transition-colors duration-500 ${textFaint}`}>24h Air Quality Trend</p>
                <svg className="w-full h-12" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="airGradDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,12 Q5,8 10,10 T20,6 T30,10 T40,7 T50,11 T60,5 T70,9 T80,6 T90,10 T100,8" fill="none" stroke="#4CAF50" strokeWidth="1.5" opacity="0.6" />
                  <path d="M0,12 Q5,8 10,10 T20,6 T30,10 T40,7 T50,11 T60,5 T70,9 T80,6 T90,10 T100,8 V20 H0 Z" fill="url(#airGradDash)" />
                </svg>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* ═══════════════ NODE STATUS CARDS ═══════════════ */}
        <div className="mt-6 flex flex-wrap gap-3">
          {nodesList.map((node, i) => (
            <motion.div key={node.id} initial={{ opacity: 0, y: 20, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: 'spring' }}
              whileHover={{ y: -6, scale: 1.04, boxShadow: isDark ? `0 0 20px ${node.status === 'online' ? 'rgba(76,175,80,0.15)' : node.status === 'warning' ? 'rgba(255,152,0,0.15)' : 'rgba(239,68,68,0.15)'}` : '0 8px 24px rgba(0,0,0,0.06)' }}
              className={`flex-1 min-w-[160px] rounded-2xl p-5 border transition-colors duration-500 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
              }`}>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="relative flex h-3 w-3">
                  {node.status === 'online' && <motion.span animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: node.status === 'online' ? '#4CAF50' : node.status === 'warning' ? '#FF9800' : '#ef4444' }} />}
                  <span className="relative inline-flex rounded-full h-3 w-3 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: node.status === 'online' ? '#4CAF50' : node.status === 'warning' ? '#FF9800' : '#ef4444', color: node.status === 'online' ? '#4CAF50' : node.status === 'warning' ? '#FF9800' : '#ef4444' }} />
                </span>
                <span className={`text-xs font-bold transition-colors duration-500 ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{node.id}</span>
              </div>
              <p className={`text-[11px] font-medium transition-colors duration-500 ${textFaint}`}>{node.location}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className={`flex items-center gap-1.5 text-[11px] ${textFaint}`}><Battery size={12} />{node.battery}%</span>
                <span className={`flex items-center gap-1.5 text-[11px] ${textFaint}`}><Signal size={12} />{node.signal}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══════════════ DATA TABLE ═══════════════ */}
        <ScrollReveal className="mt-6">
          <motion.div whileHover={{ y: -6, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.3)' : '0 20px 60px rgba(27,94,32,0.06)' }}
            className={`rounded-3xl p-6 border transition-colors duration-500 ${cardBg}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-sm font-bold transition-colors duration-500 ${textMain}`}>Recent Readings</h3>
              <span className={`text-xs ${textFaint}`}>Last 8 entries &middot; Auto-updating</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b transition-colors duration-500 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                    {['Time', 'Node', 'Soil', 'Air', 'Water', 'Temp', 'Humidity'].map(h => (
                      <th key={h} className={`text-left py-3 px-3 font-bold text-xs uppercase tracking-wider transition-colors duration-500 ${textFaint}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(-8).reverse().map((row, i) => (
                    <motion.tr key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                      whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(76,175,80,0.04)' }}
                      className={`border-b last:border-0 transition-colors duration-200 ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                      <td className={`py-3 px-3 font-mono text-xs transition-colors duration-500 ${textMuted}`}>{row.time}</td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-green-light opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-light" />
                          </span>
                          <span className={`text-sm font-bold transition-colors duration-500 ${textMain}`}>A1</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sky text-xs font-bold">{row.soil.toFixed(1)}%</td>
                      <td className="py-3 px-3 text-right font-mono text-green-light text-xs font-bold">{row.air.toFixed(0)}</td>
                      <td className="py-3 px-3 text-right font-mono text-sky text-xs font-bold">{row.water.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-mono text-amber text-xs font-bold">{row.temp.toFixed(1)}°C</td>
                      <td className="py-3 px-3 text-right font-mono text-green-light text-xs font-bold">{row.humidity.toFixed(0)}%</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}
