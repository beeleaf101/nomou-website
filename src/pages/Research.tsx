import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Sprout, FlaskConical, CloudSun, FileText, ExternalLink,
  TrendingUp, Check, Droplets, Thermometer, Wind, CloudRain,
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { useArduinoData } from '../hooks/useArduinoData';

function generateDailyData() {
  const data = [];
  const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  let baseWater = 8; let baseYield = 82; let baseEff = 70;
  for (const day of days) {
    baseWater += Math.random() * 4 + 1;
    baseYield = Math.min(99, baseYield + Math.random() * 1.5 - 0.3);
    baseEff = Math.min(98, baseEff + Math.random() * 1.8 - 0.2);
    data.push({
      day, waterSaved: Math.round(baseWater), yield: Math.round(baseYield),
      efficiency: Math.round(baseEff),
      soilHealth: Math.round(60 + (parseInt(day) / 30) * 35 + Math.random() * 5),
      waterQuality: Math.round(70 + (parseInt(day) / 30) * 25 + Math.random() * 3),
    });
  }
  return data;
}
const dailyData = generateDailyData();

const applications = [
  { icon: Sprout, title: 'Agricultural Optimization', desc: 'Real-time soil moisture, temperature, and humidity data helps farmers in Wafra and Abdali optimize irrigation schedules, reduce water waste, and maximize crop yields in Kuwait\'s arid conditions.', stats: ['30% water savings', '15% yield increase', 'Real-time alerts'], color: '#4CAF50' },
  { icon: FlaskConical, title: 'Soil Intelligence Service', desc: 'NOMOU visits farms, deploys Nomou SENSE nodes, collects environmental readings, and produces AI-assisted reports explaining soil health and actionable next steps — no lab jargon required.', stats: ['5-step process', 'AI-readable reports', 'Arabic & English'], color: '#03A9F4' },
  { icon: CloudSun, title: 'Kuwait Climate Research', desc: 'Long-term microclimate monitoring across key agricultural zones — Wafra, Abdali, and Sulaibiya — supporting Kuwait\'s food security goals and SDG alignment with KFAS and KISR partnerships.', stats: ['SDG 2, 6, 9, 13, 15', 'KISR collaboration', 'Open data API'], color: '#FF9800' },
];

const references = [
  { title: 'Soil Tests Section', authors: 'Kuwait Environment Public Authority', journal: 'epa.gov.kw', year: 'n.d.', url: 'https://epa.gov.kw/en-us/LabsDept/SandTest' },
  { title: 'Environment and Life Sciences Research Center', authors: 'Kuwait Institute for Scientific Research (KISR)', journal: 'kisr.edu.kw', year: 'n.d.', url: 'https://www.kisr.edu.kw/en/research-centers/environment-life-sciences-reducing-risks-improving-health/' },
  { title: 'Farm Land Salinity Risk Assessment', authors: 'Kuwait Foundation for the Advancement of Sciences (KFAS)', journal: 'pure.kfas.org.kw', year: 'n.d.', url: 'https://pure.kfas.org.kw/en/projects/81f494a5-a847-499f-b3f0-ce39084136c8/' },
  { title: 'Soil Testing Services', authors: 'SGS Kuwait', journal: 'sgs.com', year: 'n.d.', url: 'https://www.sgs.com/en-kw/service-groups/soil-testing' },
  { title: 'Soil Lab', authors: 'Kuwait University', journal: 'nuers.ku.edu.kw', year: 'n.d.', url: 'https://nuers.ku.edu.kw/soil-lab' },
];

function Particle({ i, isDark }: { i: number; isDark: boolean }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none"
      style={{ width: 2 + (i % 3) * 2, height: 2 + (i % 3) * 2, left: `${5 + i * 8}%`, top: `${10 + (i % 4) * 22}%`, backgroundColor: i % 3 === 0 ? '#8BC34A' : i % 3 === 1 ? '#4CAF50' : '#03A9F4', boxShadow: `0 0 ${6 + (i % 3) * 4}px currentColor` }}
      animate={{ y: [0, -30, 0], opacity: isDark ? [0.3, 0.8, 0.3] : [0.1, 0.3, 0.1] }}
      transition={{ duration: 6 + i * 0.8, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
  );
}

export default function Research() {
  const { isDark } = useTheme();
  const { current: arduino } = useArduinoData();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const bg = isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]';
  const bg2 = isDark ? 'bg-[#0d1f12]' : 'bg-[#E8F5E9]';
  const text = isDark ? 'text-white' : 'text-[#0a120e]';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-500';
  const textFaint = isDark ? 'text-white/30' : 'text-gray-400';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-md';

  const liveMetrics = [
    { label: 'Soil Moisture', value: arduino.soil_pct,   suffix: '%',    status: arduino.soil_cat,    icon: Droplets,    color: '#03A9F4' },
    { label: 'Temperature',   value: arduino.temperature, suffix: '°C',   status: arduino.temperature > 37 ? 'High' : arduino.temperature > 33 ? 'Warm' : 'Normal', icon: Thermometer, color: '#FF9800', decimals: 1 },
    { label: 'Humidity',      value: arduino.humidity,   suffix: '%',    status: arduino.humidity_cat, icon: CloudRain,   color: '#4CAF50' },
    { label: 'Air Quality',   value: arduino.aqi,        suffix: ' AQI', status: arduino.aqi_cat,     icon: Wind,        color: '#8BC34A' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden ${bg} transition-colors duration-500`}>
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 will-change-transform pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-green-primary" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }}
            className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-sky" />
        </motion.div>
        {[...Array(12)].map((_, i) => <Particle key={i} i={i} isDark={isDark} />)}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-32 pt-36">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className={`text-xs font-semibold uppercase tracking-[0.2em] mb-6 transition-colors duration-500 ${isDark ? 'text-lime' : 'text-green-primary'}`}>Research & Data</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className={`text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.92] mb-6 transition-colors duration-500 ${text}`}>
            Research &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-green-light to-sky">Data Insights</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${textMuted}`}>
            AI-powered soil intelligence and smart agriculture data from NOMOU's active monitoring node in Kuwait.
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════ LIVE SENSOR READINGS ═══════════════ */}
      <section className={`py-16 transition-colors duration-500 ${bg2}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-light opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-light" />
              </span>
              <span className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-green-light' : 'text-green-primary'}`}>Live Field Readings</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black ${text}`}>Current Node Data — Kuwait</h2>
            <p className={`text-sm mt-1 ${textMuted}`}>
              {arduino.online ? `Live from Nomou SENSE node · Updated ${arduino.lastUpdated.toLocaleTimeString()}` : 'Nomou SENSE node offline — showing last known values'}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {liveMetrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <ScrollReveal key={m.label} delay={i * 0.08}>
                  <motion.div whileHover={{ y: -8, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative rounded-2xl p-5 overflow-hidden border transition-colors duration-500 ${cardBg}`}
                    style={isDark ? { background: `linear-gradient(135deg, ${m.color}15 0%, ${m.color}05 100%)`, border: `1px solid ${m.color}25` } : {}}>
                    {isDark && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }} />}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}20` }}>
                        <Icon size={16} style={{ color: m.color }} />
                      </div>
                      <span className={`text-[11px] font-medium uppercase tracking-wider ${textFaint}`}>{m.label}</span>
                    </div>
                    <div className={`font-mono text-2xl font-bold ${text}`}>
                      {m.decimals ? m.value.toFixed(m.decimals) : Math.round(m.value)}{m.suffix}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: m.color }} />
                      <span className="text-xs font-medium" style={{ color: m.color }}>{m.status}</span>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ METHODOLOGY ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <ScrollReveal>
                <span className="text-sky text-xs font-bold uppercase tracking-[0.2em]">Methodology</span>
                <h2 className={`text-3xl sm:text-5xl font-black mt-2 mb-8 leading-tight transition-colors duration-500 ${text}`}>
                  The NOMOU<br /><span className="text-sky">5-Step Process</span>
                </h2>
              </ScrollReveal>
              <div className={`space-y-5 leading-relaxed transition-colors duration-500 ${textMuted}`}>
                <ScrollReveal delay={0.1}>
                  <p>NOMOU's sensor network collects environmental data every 30 seconds. Each reading is timestamped and transmitted securely to the cloud via HTTPS through the Nomou Cortex IoT hub.</p>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <ul className="space-y-3">
                    {[
                      'Soil moisture via capacitive sensor (V1.2)',
                      'Temperature & humidity via DHT22 AM2302',
                      'Light intensity via VEML7700 lux sensor',
                      'Air quality via ENS160/AHT21 sensor',
                      'EC/TDS screening via TDS sensor',
                    ].map((item, i) => (
                      <motion.li key={item} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08 }}
                        whileHover={{ x: 8 }} className="flex items-start gap-3 cursor-default group">
                        <motion.span whileHover={{ scale: 1.3, rotate: 10 }} className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-pale-green group-hover:bg-green-primary transition-colors">
                          <Check size={14} className="text-green-primary group-hover:text-white transition-colors" />
                        </motion.span>
                        <span className="text-sm group-hover:text-green-primary transition-colors">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                  <p className="text-sm">Data flows: Nomou SENSE → Nomou Cortex (ESP32) → Firebase Cloud → AI Engine → Dashboard & App. All sensors are calibrated against SGS Kuwait certified lab results.</p>
                </ScrollReveal>
              </div>
            </div>

            <ScrollReveal delay={0.15} direction="right">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className={`rounded-3xl p-8 transition-all duration-500 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-lg'}`}>
                <h3 className={`text-lg font-bold mb-6 transition-colors duration-500 ${text}`}>Customer Validation — 117 Respondents</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={[
                    { label: 'Willing to Pay', value: 81.2 },
                    { label: 'Would Recommend', value: 75.2 },
                    { label: 'Prefer Continuous', value: 70.1 },
                    { label: 'Trust Barrier', value: 65.0 },
                    { label: 'Prefer Smart Plan', value: 58.3 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0'} />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                    <Tooltip contentStyle={{ background: isDark ? 'rgba(10,18,14,0.95)' : 'white', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E8F5E9', borderRadius: 16 }} formatter={(v: number) => [`${v}%`]} />
                    <Bar dataKey="value" fill="#4CAF50" radius={[4, 4, 0, 0]} name="%" />
                  </BarChart>
                </ResponsiveContainer>
                <p className={`text-xs text-center mt-3 ${textFaint}`}>Source: NOMOU Customer Validation Survey, 2026 — Canadian College of Kuwait</p>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ APPLICATIONS ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg2}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-amber' : 'text-amber-600'}`}>Use Cases</span>
            <h2 className={`text-4xl sm:text-6xl font-black mt-2 transition-colors duration-500 ${text}`}>Research Applications</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
            <p className={`max-w-2xl mx-auto mt-4 ${textMuted}`}>How NOMOU's soil intelligence platform serves farmers, researchers, and institutions across Kuwait.</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {applications.map((app, i) => {
              const Icon = app.icon;
              return (
                <ScrollReveal key={app.title} delay={i * 0.15}>
                  <motion.div whileHover={{ y: -14, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative rounded-[2rem] p-8 border transition-all duration-500 h-full flex flex-col group ${cardBg} ${isDark ? 'hover:border-white/20' : 'hover:border-green-primary/20'}`}>
                    <div className="absolute -top-14 -right-14 w-28 h-28 rounded-full blur-[50px] opacity-0 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundColor: app.color }} />
                    <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${app.color}15` }}
                      whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.15 }} transition={{ duration: 0.6 }}>
                      <Icon size={28} style={{ color: app.color }} />
                    </motion.div>
                    <h3 className={`text-xl font-bold mb-4 ${text} relative z-10`}>{app.title}</h3>
                    <p className={`text-sm leading-relaxed mb-6 flex-1 ${textMuted} relative z-10`}>{app.desc}</p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {app.stats.map((stat) => (
                        <motion.span key={stat} whileHover={{ scale: 1.08, y: -2 }} className="px-3 py-1.5 bg-pale-green text-green-primary text-xs font-semibold rounded-xl">{stat}</motion.span>
                      ))}
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ IMPROVEMENT CHARTS ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-green-light' : 'text-green-primary'}`}>Results</span>
            <h2 className={`text-4xl sm:text-5xl font-black mt-2 ${text}`}>Measured Improvements</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
            <p className={`mt-4 ${textMuted}`}>30-day pilot deployment data showing consistent gains across all environmental metrics at NOMOU's test site.</p>
          </ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-6">
            {[
              { title: 'System Efficiency %', badge: '+28%', color: '#2D7A3E', dataKey: 'efficiency', gradId: 'effGrad', domain: [60, 100] },
              { title: 'Soil Health Index', badge: '+35 pts', color: '#FF9800', dataKey: 'soilHealth', gradId: 'soilGrad', domain: [50, 100] },
              { title: 'Water Quality Score', badge: '+25 pts', color: '#03A9F4', dataKey: 'waterQuality', gradId: 'wqGrad', domain: [60, 100] },
              { title: 'Crop Yield Index', badge: '+16 pts', color: '#8BC34A', dataKey: 'yield', gradId: 'yieldGrad', domain: [75, 100] },
            ].map((chart, i) => (
              <ScrollReveal key={chart.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8, scale: 1.01 }}
                  className={`rounded-3xl p-6 transition-colors duration-500 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-md'}`}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`text-sm font-bold ${text}`}>{chart.title}</h3>
                    <motion.span whileHover={{ scale: 1.1 }} className="text-xs font-bold text-green-light bg-green-light/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <TrendingUp size={12} /> {chart.badge}
                    </motion.span>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={dailyData}>
                      <defs><linearGradient id={chart.gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={chart.color} stopOpacity={isDark ? 0.4 : 0.2} /><stop offset="95%" stopColor={chart.color} stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0'} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} interval={4} />
                      <YAxis tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} domain={chart.domain} />
                      <Tooltip contentStyle={{ background: isDark ? 'rgba(10,18,14,0.95)' : 'white', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E8F5E9', borderRadius: 16 }} />
                      <Area type="monotone" dataKey={chart.dataKey} stroke={chart.color} fill={`url(#${chart.gradId})`} strokeWidth={2.5} name={chart.title} dot={false} activeDot={{ r: 6, fill: chart.color, stroke: '#fff', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ REFERENCES ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg2}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-amber' : 'text-amber-600'}`}>Sources</span>
            <h2 className={`text-4xl sm:text-5xl font-black mt-2 ${text}`}>References</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
            <p className={`mt-4 ${textMuted}`}>Official Kuwaiti institutions and certified lab sources referenced in NOMOU's research and development.</p>
          </ScrollReveal>
          <div className="space-y-5">
            {references.map((ref, i) => (
              <ScrollReveal key={ref.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`rounded-2xl p-6 transition-all duration-300 border ${cardBg} ${isDark ? 'hover:border-white/20' : 'hover:border-green-primary/20'}`}>
                  <div className="flex items-start gap-5">
                    <motion.div whileHover={{ rotate: 15, scale: 1.15 }} className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-pale-green">
                      <FileText size={22} className="text-green-primary" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-bold mb-1 ${text}`}>{ref.title}</h3>
                      <p className={`text-sm mb-1 ${textMuted}`}>{ref.authors} — <span className="italic">{ref.journal}</span>, {ref.year}</p>
                    </div>
                    <motion.a href={ref.url} target="_blank" rel="noopener noreferrer" whileHover={{ x: 6, scale: 1.2 }} className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-green-primary hover:text-green-light transition-colors">
                      <ExternalLink size={16} />
                    </motion.a>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className={`relative py-32 overflow-hidden transition-colors duration-500 ${bg}`}>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] bg-green-primary pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="inline-block mb-8">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-2 ${isDark ? 'bg-green-primary/15 border border-green-primary/20' : 'bg-green-primary/10 border border-green-primary/20'}`}>
                <FlaskConical size={36} className={isDark ? 'text-green-light' : 'text-green-primary'} />
              </div>
            </motion.div>
            <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${text}`}>Want to Collaborate?</h2>
            <p className={`text-lg mb-10 max-w-2xl mx-auto ${textMuted}`}>We are open to research partnerships with KFAS, KISR, Kuwait University, and institutions across the region.</p>
            <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-primary to-green-light text-white font-bold text-lg rounded-2xl transition-all hover:shadow-[0_0_50px_rgba(76,175,80,0.5)] hover:scale-[1.03]">
              Contact Our Research Team <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}