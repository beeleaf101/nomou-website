import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowRight, Eye, TrendingUp, ChevronRight, Leaf, ArrowUpRight,
  Radio, Wifi, Battery, Shield, Cpu, Gauge, Droplets,
  Wind, Thermometer, CloudRain, type LucideIcon,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip,
} from 'recharts';
import ScrollReveal from '../components/ScrollReveal';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useArduinoData } from '../hooks/useArduinoData';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface NodeItem {
  level: string;
  name: string;
  tags: string;
  image: string;
  features: string[];
  bestFor: string;
  color: string;
}

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

interface MetricItem {
  label: string;
  icon: LucideIcon;
  color: string;
  value: number;
  suffix: string;
  status: string;
  decimals?: number;
}

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const nodes: NodeItem[] = [
  { level: '01', name: 'Prototype Node', tags: 'Learn. Build. Experiment.', image: '/images/node-prototype.png',
    features: ['ESP32 DevKit', 'Breadboard Setup', 'Basic Sensors', 'USB Powered'], bestFor: 'Students & Hobbyists', color: '#03A9F4' },
  { level: '02', name: 'Semi-Professional', tags: 'Field Test. Compete. Validate.', image: '/images/node-semipro.png',
    features: ['Custom PCB', 'IP65 Enclosure', 'Battery Power', 'Enhanced Sensors'], bestFor: 'Research & Competitions', color: '#2D7A3E' },
  { level: '03', name: 'Professional Node', tags: 'Scale. Deploy. Monitor.', image: '/images/node-professional.png',
    features: ['All-in-One Design', 'Solar + Battery', 'LoRa / 4G / WiFi', '30+ Day Runtime'], bestFor: 'Commercial Agriculture', color: '#1B5E20' },
];

const features: FeatureItem[] = [
  { icon: Radio, title: 'Real-time Monitoring', desc: 'Live data from soil, air, water & weather sensors streaming every 30 seconds', color: '#03A9F4' },
  { icon: Wifi, title: 'Multi-Protocol Connectivity', desc: 'WiFi, LoRa, 4G — your data reaches the cloud no matter where your fields are', color: '#4CAF50' },
  { icon: Battery, title: '30+ Day Battery Life', desc: 'Solar-ready ultra-low power design keeps nodes running in the remotest fields', color: '#FF9800' },
  { icon: Shield, title: 'IP67 Weatherproof', desc: "Engineered to survive Kuwait's scorching heat, dust storms, and flash floods", color: '#8BC34A' },
  { icon: Cpu, title: 'Edge Intelligence', desc: 'On-device processing filters noise and sends only actionable insights to the cloud', color: '#1B5E20' },
  { icon: Gauge, title: 'Predictive Analytics', desc: 'AI-powered forecasting helps you irrigate before your crops show stress', color: '#2D7A3E' },
];

// const metrics: MetricItem[] = [
//   { label: 'Soil Moisture', icon: Droplets, color: '#03A9F4', value: 28, suffix: '%', status: 'Optimal' },
//   { label: 'Air Quality', icon: Wind, color: '#4CAF50', value: 42, suffix: ' AQI', status: 'Good' },
//   { label: 'Water pH', icon: CloudRain, color: '#03A9F4', value: 7.24, suffix: '', status: 'Good', decimals: 2 },
//   { label: 'Temperature', icon: Thermometer, color: '#FF9800', value: 31.2, suffix: '°C', status: 'Normal', decimals: 1 },
//   { label: 'Humidity', icon: CloudRain, color: '#4CAF50', value: 64, suffix: '%', status: 'Normal' },
// ];

const chartData = Array.from({ length: 24 }, (_, idx) => ({
  time: `${idx}:00`,
  soil: 25 + Math.sin(idx * 0.5) * 5 + Math.random() * 3,
  air: 40 + Math.cos(idx * 0.3) * 8 + Math.random() * 4,
  temp: 28 + Math.sin(idx * 0.4 + 1) * 4 + Math.random() * 2,
  humidity: 55 + Math.cos(idx * 0.35) * 10 + Math.random() * 5,
}));

/* ------------------------------------------------------------------ */
/*  TEXT SCRAMBLE                                                      */
/* ------------------------------------------------------------------ */

function ScrambleText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [display, setDisplay] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  useEffect(() => {
    let frame = 0;
    const totalFrames = text.length * 3;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        const resolved = Math.floor(frame / 3);
        setDisplay(
          text
            .split('')
            .map((c, i) => {
              if (c === ' ') return ' ';
              if (i < resolved) return c;
              if (i < resolved + 5) return chars[Math.floor(Math.random() * chars.length)];
              return '';
            })
            .join('')
        );
        if (frame >= totalFrames) {
          setDisplay(text);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span className={className}>{display}</span>;
}

/* ------------------------------------------------------------------ */
/*  MAIN HOME COMPONENT                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { isDark } = useTheme();
  const { isLoggedIn } = useAuth();
  const { current: arduino } = useArduinoData();

  const metrics = [
    { label: 'Soil Moisture', icon: Droplets,    color: '#03A9F4', value: arduino.soil_pct,   suffix: '%',    status: arduino.soil_cat    },
    { label: 'Air Quality',   icon: Wind,        color: '#4CAF50', value: arduino.aqi,         suffix: ' AQI', status: arduino.aqi_cat     },
    { label: 'Temperature',   icon: Thermometer, color: '#FF9800', value: arduino.temperature, suffix: '°C',   status: arduino.temperature > 37 ? 'High' : 'Normal' },
    { label: 'Humidity',      icon: CloudRain,   color: '#4CAF50', value: arduino.humidity,    suffix: '%',    status: arduino.humidity_cat },
    { label: 'Light Level',   icon: TrendingUp,  color: '#9C27B0', value: arduino.light_pct,   suffix: '%',    status: arduino.light_cat   },
  ];
  // Plain strings (no translation)
  const t = {
    badge: 'Smart Environmental Monitoring',
    headline1: 'Environmental Intelligence for',
    headline2: 'Smarter Agriculture',
    sub: 'Nomou is an IoT-based monitoring system that helps you track soil, air, and water conditions in real-time.',
    btnNodes: 'Explore Our Nodes',
    btnDashboard: 'View Live Dashboard',
    badge1: 'Real-time Monitoring',
    badge2: 'High Accuracy Smart Sensors',
    badge3: 'Low Power Energy Efficient',
    badge4: 'Scalable Multi-Node System',
    badge5: 'Reliable All Weather',
    scroll: 'Scroll',
    hardwareBadge: 'Hardware',
    hardwareTitle1: 'Built for',
    hardwareTitle2: 'Every',
    hardwareTitle3: 'Stage.',
    viewDashboard: 'View Live Dashboard',
  };

  const tNodes = nodes;
  const tFeatures = features;
  const tMetrics = metrics;
  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  HERO                                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-[#0a120e]">
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg1.jpeg"
            alt=""
            className="w-full h-full object-contain object-center"
            style={{ imageRendering: 'auto', filter: 'contrast(1.08) saturate(1.1)' }}
          />
          {/* Subtle left-side overlay so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/65 via-white/15 to-transparent" />
          {/* Bottom fade into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a120e] to-transparent" />
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">{t.scroll}</span>
          <motion.div
            className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
            animate={{}}
          >
            <motion.div
              className="w-1 h-1.5 rounded-full bg-white/60"
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-0">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">

            {/* ── Left: text ── */}
            <div className="flex-1 max-w-xl">
              {/* Badge */}
              <motion.p
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xs font-bold uppercase tracking-[0.25em] text-green-primary mb-4"
              >
                {t.badge}
              </motion.p>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-[#0a120e] mb-5"
              >
                {t.headline1}{' '}
                <span className="text-green-primary">{t.headline2}</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-base text-gray-500 leading-relaxed mb-8 max-w-md"
              >
                {t.sub}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <Link
                  to="/nodes"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-forest text-white font-bold rounded-2xl transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(27,94,32,0.4)] hover:bg-green-primary"
                >
                  Explore Our Nodes
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-2xl bg-white text-gray-700 border border-gray-200 hover:bg-green-primary/10 hover:text-green-primary hover:border-green-primary/30 hover:shadow-[0_0_20px_rgba(76,175,80,0.2)] transition-all hover:scale-[1.03]"
                >
                  <Eye size={16} /> {t.btnDashboard}
                </Link>
              </motion.div>

              {/* Feature badges */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-2"
              >
                {[
                  { icon: TrendingUp, label: t.badge1 },
                  { icon: Gauge,      label: t.badge2 },
                  { icon: Battery,    label: t.badge3 },
                  { icon: Cpu,        label: t.badge4 },
                  { icon: Shield,     label: t.badge5 },
                ].map(({ icon: Icon, label }, i) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.65 + i * 0.08 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-full text-xs font-medium text-gray-700 shadow-xs"
                  >
                    <Icon size={13} className="text-green-primary" />
                    {label}
                  </motion.span>
                ))}
              </motion.div>
            </div>


          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  NODES — Horizontal scroll                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className={`relative py-32 transition-colors duration-500 ${isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]'}`}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          <ScrollReveal>
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-green-light' : 'text-green-primary'}`}>{t.hardwareBadge}</span>
            <h2 className={`text-4xl sm:text-6xl font-black mt-2 leading-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>
              {t.hardwareTitle1}<br />{t.hardwareTitle2} <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime to-green-light">{t.hardwareTitle3}</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Link
              to="/dashboard"
              className={`mt-6 inline-flex items-center gap-2 px-6 py-3 font-bold rounded-2xl transition-all hover:scale-[1.03] group ${
                isDark
                  ? 'bg-green-primary/15 text-green-light border border-green-primary/30 hover:bg-green-primary/25 hover:shadow-[0_0_25px_rgba(76,175,80,0.25)]'
                  : 'bg-green-primary/10 text-green-primary border border-green-primary/20 hover:bg-green-primary/20 hover:shadow-[0_0_25px_rgba(76,175,80,0.2)]'
              }`}
            >
              <Eye size={16} />
              View Dashboard
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 max-w-7xl mx-auto w-full">
          {tNodes.map((node, i) => (
            <motion.div key={node.level}
              initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.7, delay: i * 0.15 }}
              className="relative">
              <motion.div whileHover={{ y: -15, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}
                className={`rounded-[2rem] border overflow-hidden group transition-colors duration-500 relative min-h-[480px] ${
                  isDark ? 'bg-white/5 border-white/10 backdrop-blur-xl' : 'bg-white border-gray-200 shadow-lg'
                }`}
                style={{ transform: `rotate(${i === 0 ? -1.5 : i === 2 ? 1.5 : 0}deg)` }}>
                {/* Full-bleed background image */}
                <div className="absolute inset-0">
                  <img
                    src={node.image}
                    alt={node.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isDark
                        ? 'brightness-[0.7] contrast-125 saturate-50'
                        : 'brightness-105 saturate-90'
                    }`}
                  />
                  {/* Gradient overlay for text readability */}
                  <div className={`absolute inset-0 transition-colors duration-500 ${
                    isDark
                      ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/20'
                      : 'bg-gradient-to-t from-white/[0.95] via-white/60 to-white/20'
                  }`} />
                </div>
                {/* Content overlaid on image */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[480px]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-5xl font-black" style={{ color: `${node.color}${isDark ? '60' : '40'}` }}>{node.level}</span>
                    <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${node.color}${isDark ? '30' : '25'}`, color: node.color, border: `1px solid ${node.color}${isDark ? '50' : '40'}` }}>
                      {node.bestFor}
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-1 transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{node.name}</h3>
                  <p className={`text-xs mb-4 transition-colors duration-500 ${isDark ? 'text-white/50' : 'text-gray-600'}`}>{node.tags}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {node.features.map(f => (
                      <span key={f} className={`text-[10px] px-2 py-1 rounded-md border transition-colors duration-500 ${
                        isDark ? 'text-white/70 bg-black/40 border-white/10' : 'text-gray-700 bg-white/70 border-gray-200/60'
                      }`}>{f}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  LIVE DASHBOARD                                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className={`relative py-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0d1f12]' : 'bg-[#E8F5E9]'}`}>
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: isDark ? 'radial-gradient(circle, rgba(139,195,74,0.3), transparent 70%)' : 'radial-gradient(circle, rgba(76,175,80,0.15), transparent 70%)' }} />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-10 right-[5%] w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ background: isDark ? 'radial-gradient(circle, rgba(3,169,244,0.2), transparent 70%)' : 'radial-gradient(circle, rgba(3,169,244,0.1), transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-green-light opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-light" />
              </span>
              <span className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-green-light' : 'text-green-primary'}`}>Live System</span>
            </div>
            <h2 className={`text-4xl sm:text-5xl font-black leading-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>
              Your Fields.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky to-green-light">In Real Time.</span>
            </h2>
          </ScrollReveal>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {tMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label}>
                  <ScrollReveal delay={idx * 0.1}>
                    <motion.div whileHover={{ y: -10, scale: 1.04 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`relative rounded-2xl p-5 overflow-hidden cursor-pointer transition-colors duration-500 ${
                        isDark ? '' : 'bg-white shadow-md border border-gray-100'
                      }`}
                      style={isDark ? {
                        background: `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}08 100%)`,
                        border: `1px solid ${metric.color}25`,
                      } : {}}>
                      {isDark && <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)` }} />}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metric.color}${isDark ? '20' : '15'}` }}>
                          <Icon size={16} style={{ color: metric.color }} />
                        </div>
                        <span className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{metric.label}</span>
                      </div>
                      <div className={`font-mono text-2xl font-bold transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{metric.value}{metric.suffix}</div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full animate-live-pulse" style={{ backgroundColor: metric.color }} />
                        <span className="text-xs font-medium" style={{ color: metric.color }}>{metric.status}</span>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <ScrollReveal>
            <div className={`rounded-[2rem] p-6 sm:p-8 relative overflow-hidden transition-colors duration-500 ${
              isDark ? 'bg-white/5 border border-white/10 backdrop-blur-xl' : 'bg-white border border-gray-200 shadow-lg'
            }`}>
              <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className={`font-bold text-lg transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Environmental Trends</h3>
                  <p className={`text-xs transition-colors duration-500 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>24-hour sensor data &middot; Updates every 30s</p>
                </div>
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 border transition-colors duration-500 ${
                  isDark ? 'bg-white/5 border-white/5' : 'bg-pale-green border-green-primary/20'
                }`}>
                  <TrendingUp size={14} className="text-lime" />
                  <span className="text-lime text-xs font-bold">LIVE</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={chartData}>
                  <defs>
                    {[{ id: 'sg', c: '#03A9F4' }, { id: 'ag', c: '#4CAF50' }, { id: 'tg', c: '#FF9800' }, { id: 'hg', c: '#8BC34A' }].map(g => (
                      <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={g.c} stopOpacity={isDark ? 0.5 : 0.3} />
                        <stop offset="95%" stopColor={g.c} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : '#E8F5E9'} vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} />
                  <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload) return null;
                    return (
                      <div className={`rounded-xl px-4 py-3 border shadow-2xl ${isDark ? 'bg-[#0d1f12]/95 border-white/10' : 'bg-white border-gray-200'}`}>
                        <p className={`text-xs mb-2 font-mono ${isDark ? 'text-white/50' : 'text-gray-400'}`}>{label}</p>
                        {payload.map((p: any, idx2: number) => (
                          <div key={idx2} className="flex items-center gap-2 mb-1 last:mb-0">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                            <span className={`text-xs ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{p.name}:</span>
                            <span className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }} />
                  <Area type="monotone" dataKey="soil" stroke="#03A9F4" fill="url(#sg)" strokeWidth={3} name="Soil Moisture" dot={{ r: 0 }} activeDot={{ r: 6, fill: '#03A9F4', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="air" stroke="#4CAF50" fill="url(#ag)" strokeWidth={3} name="Air Quality" dot={{ r: 0 }} activeDot={{ r: 6, fill: '#4CAF50', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="temp" stroke="#FF9800" fill="url(#tg)" strokeWidth={3} name="Temperature" dot={{ r: 0 }} activeDot={{ r: 6, fill: '#FF9800', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="humidity" stroke="#8BC34A" fill="url(#hg)" strokeWidth={2} name="Humidity" dot={{ r: 0 }} activeDot={{ r: 5, fill: '#8BC34A', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-5 justify-center">
                {[{ c: '#03A9F4', l: 'Soil Moisture' }, { c: '#4CAF50', l: 'Air Quality' }, { c: '#FF9800', l: 'Temperature °C' }, { c: '#8BC34A', l: 'Humidity %' }].map(item => (
                  <div key={item.l} className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 border transition-colors duration-500 ${
                    isDark ? 'bg-white/5 border-white/5' : 'bg-off-white border-gray-100'
                  }`}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.c, boxShadow: `0 0 8px ${item.c}60` }} />
                    <span className={`text-xs font-medium transition-colors duration-500 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{item.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Node status */}
          <ScrollReveal delay={0.15}>
            <div className="mt-6 flex flex-wrap gap-3">
              {[{ n: 'A1', loc: 'Al-Wafra Farm', s: 'online', c: '#4CAF50' }, { n: 'B2', loc: 'Greenhouse Beta', s: 'online', c: '#4CAF50' }, { n: 'C3', loc: 'KU Research', s: 'online', c: '#4CAF50' }, { n: 'D4', loc: 'Al-Jahra', s: 'warning', c: '#FF9800' }, { n: 'E5', loc: 'Desert Station', s: 'offline', c: '#ef4444' }].map(node => (
                <motion.div key={node.n} whileHover={{ y: -3, scale: 1.03 }}
                  className={`flex-1 min-w-[160px] rounded-2xl p-4 border transition-colors duration-500 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full animate-live-pulse" style={{ backgroundColor: node.c }} />
                    <span className={`text-xs font-bold transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Node {node.n}</span>
                  </div>
                  <p className={`text-[10px] transition-colors duration-500 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{node.loc}</p>
                  <p className="text-[10px] font-medium mt-1" style={{ color: node.c }}>{node.s}</p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  PROBLEM                                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className={`relative py-32 transition-colors duration-500 ${isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <motion.div whileHover={{ scale: 1.02 }} className="relative rounded-[2rem] overflow-hidden shadow-xl">
                <img src="/images/soil-growth.jpg" alt="Soil and growth" className={`w-full h-[400px] object-cover transition-all duration-500 ${isDark ? 'brightness-[0.7] contrast-125 saturate-75' : ''}`} />
                <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-gradient-to-t from-[#0a120e]/60 to-transparent' : 'bg-gradient-to-t from-[#F7FAF7]/40 to-transparent'}`} />
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
                  className={`absolute bottom-6 left-6 rounded-2xl p-4 border transition-colors duration-500 ${
                    isDark ? 'bg-white/10 backdrop-blur-xl border-white/10' : 'bg-white/90 backdrop-blur-xl border-white/60 shadow-lg'
                  }`}>
                  <p className={`text-2xl font-black transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>30%</p>
                  <p className={`text-[10px] uppercase tracking-wider transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Water Savings</p>
                </motion.div>
              </motion.div>
            </ScrollReveal>
            <div>
              <ScrollReveal>
                <span className="text-sky text-xs font-bold uppercase tracking-[0.2em]">The Problem</span>
                <h2 className={`text-4xl sm:text-5xl font-black mt-3 leading-tight mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>
                  Kuwait's farms<br />lose <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky to-green-light">40% of water</span><br />to guesswork.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <p className={`leading-relaxed mb-6 transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                  Most farmers in Kuwait still rely on intuition to decide when and how much to irrigate. The result? Wasted water, stressed crops, and shrinking yields in one of the world's most water-scarce regions.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.25}>
                <p className={`leading-relaxed mb-8 transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                  NOMOU puts precise, real-time environmental data in your hands — so every drop counts and every decision is backed by science.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.35}>
                <Link to="/about" className="group inline-flex items-center gap-2 text-green-primary font-bold hover:text-green-light transition-colors">
                  Our Story <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  FEATURES — What NOMOU Does                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className={`relative py-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0d1f12]' : 'bg-[#E8F5E9]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal className="mb-16">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-amber' : 'text-amber-600'}`}>Platform</span>
            <h2 className={`text-4xl sm:text-5xl font-black mt-2 leading-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>
              What <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-lime">NOMOU</span> Does
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} delay={idx * 0.08}>
                  <motion.div whileHover={{ y: -10, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative p-7 rounded-[1.5rem] border transition-all duration-500 group overflow-hidden h-full ${
                      isDark ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/20' : 'bg-white border-gray-200 hover:border-green-primary/20 shadow-sm hover:shadow-md'
                    }`}>
                    <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-60 transition-opacity duration-500" style={{ backgroundColor: feature.color }} />
                    <motion.div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${feature.color}15` }}
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }} transition={{ duration: 0.5 }}>
                      <Icon size={26} style={{ color: feature.color }} />
                    </motion.div>
                    <h3 className={`text-base font-bold mb-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{feature.title}</h3>
                    <p className={`text-sm leading-relaxed transition-colors duration-500 ${isDark ? 'text-white/35' : 'text-gray-500'}`}>{feature.desc}</p>
                    <motion.div className="absolute bottom-0 left-6 right-6 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${feature.color}60, transparent)` }}
                      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }} />
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  PARALLAX BREAK                                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }} />
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-[#0a120e] via-transparent to-[#0a120e]' : 'bg-gradient-to-b from-[#F7FAF7] via-transparent to-[#F7FAF7]'}`} />
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#0a120e]/30' : 'bg-[#F7FAF7]/20'}`} />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center">
            <ScrambleText text="SMARTER FIELDS START WITH DATA" className={`text-xs sm:text-sm font-black tracking-[0.3em] transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-[#0a120e]/40'}`} delay={200} />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  CTA                                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className={`relative py-32 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]'}`}>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] bg-green-primary" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }}
          className="absolute top-1/3 right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-sky" />
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="absolute w-3 h-3 rounded-full"
            style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%`, background: i % 2 === 0 ? 'radial-gradient(circle, #8BC34A, transparent)' : 'radial-gradient(circle, #4CAF50, transparent)' }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.8 }} />
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="inline-block mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-lime to-green-light flex items-center justify-center shadow-2xl shadow-[#1B5E20]/60">
                <Leaf size={48} className="text-forest" />
              </div>
            </motion.div>
            <h2 className={`text-5xl sm:text-7xl font-black mb-6 leading-[0.95] transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>
              Ready to<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-green-light to-sky">Grow Smarter?</span>
            </h2>
            <p className={`text-lg mb-12 max-w-lg mx-auto transition-colors duration-500 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              Join the farms across Kuwait that are already saving water, cutting costs, and growing more with NOMOU.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.94 }}>
                <Link to={isLoggedIn ? '/portal/dashboard' : '/auth?tab=signup'}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-lime to-green-light text-forest font-black text-lg rounded-2xl transition-all hover:shadow-[0_0_50px_rgba(139,195,74,0.5)] hover:from-green-light hover:to-lime hover:text-[#1B5E20]">
                  {isLoggedIn ? 'Go to Portal' : 'Start Monitoring'} <ArrowUpRight size={22} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.94 }}>
                <Link to="/pricing" className={`inline-flex items-center gap-2 px-10 py-5 font-bold rounded-2xl transition-all group ${
                  isDark
                    ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-green-primary/15 hover:text-green-light hover:border-green-primary/40 hover:shadow-[0_0_30px_rgba(76,175,80,0.2)]'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-primary/10 hover:text-green-primary hover:border-green-primary/30 hover:shadow-[0_0_25px_rgba(76,175,80,0.2)]'
                }`}>
                  View Pricing
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
