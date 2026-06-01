import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Sprout, FlaskConical, CloudSun, FileText, ExternalLink,
  TrendingUp, Check,
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTheme } from '../hooks/useTheme';

function generateDailyData() {
  const data = [];
  const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  let baseWater = 8;
  let baseYield = 82;
  let baseEff = 70;
  for (const day of days) {
    baseWater += Math.random() * 4 + 1;
    baseYield = Math.min(99, baseYield + Math.random() * 1.5 - 0.3);
    baseEff = Math.min(98, baseEff + Math.random() * 1.8 - 0.2);
    data.push({
      day,
      waterSaved: Math.round(baseWater),
      yield: Math.round(baseYield),
      efficiency: Math.round(baseEff),
      soilHealth: Math.round(60 + (parseInt(day) / 30) * 35 + Math.random() * 5),
      waterQuality: Math.round(70 + (parseInt(day) / 30) * 25 + Math.random() * 3),
    });
  }
  return data;
}
const dailyData = generateDailyData();

const applications = [
  { icon: Sprout, title: 'Agricultural Optimization', desc: 'Use real-time soil moisture, temperature, and humidity data to optimize irrigation schedules, reduce water waste, and maximize crop yields across farms of any size.', stats: ['30% water savings', '15% yield increase', 'Real-time alerts'], color: '#4CAF50' },
  { icon: FlaskConical, title: 'Environmental Impact Studies', desc: 'Monitor air quality, water pollution levels, and soil degradation over time. Researchers use NOMOU data to track environmental changes with precision.', stats: ['7 sensor types', 'Historical data', 'Exportable reports'], color: '#03A9F4' },
  { icon: CloudSun, title: 'Climate Research', desc: 'Collect long-term microclimate data to understand local weather patterns, heat island effects, and climate adaptation strategies.', stats: ['Microclimate tracking', '5km coverage', 'Open data API'], color: '#FF9800' },
];

const publications = [
  { title: 'Smart Irrigation Systems for Arid Climates: A Case Study from Kuwait', authors: 'Al-Rashid, A., et al.', journal: 'Journal of Agricultural Technology', year: '2025' },
  { title: 'Low-Cost IoT Sensor Networks for Soil Quality Monitoring', authors: 'Al-Sabah, F., Hassan, O.', journal: 'IEEE Internet of Things Journal', year: '2024' },
  { title: 'Environmental Data Analytics in Desert Agriculture', authors: 'Khalid, N., et al.', journal: 'Sustainability Science', year: '2024' },
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

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden ${bg} transition-colors duration-500`}>
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 will-change-transform pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-green-primary" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }}
            className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-sky" />
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 14, repeat: Infinity, delay: 1.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] bg-lime" />
        </motion.div>

        {[...Array(12)].map((_, i) => <Particle key={i} i={i} isDark={isDark} />)}

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-32 pt-36">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className={`text-xs font-semibold uppercase tracking-[0.2em] mb-6 transition-colors duration-500 ${isDark ? 'text-lime' : 'text-green-primary'}`}>Research & Data</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, type: 'spring', stiffness: 80 }}
            className={`text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.92] mb-6 transition-colors duration-500 ${text}`}>
            Research &
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-green-light to-sky">Data Insights</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${textMuted}`}>
            Leveraging comprehensive environmental data for scientific research and sustainable development across the Gulf.
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════ METHODOLOGY ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <ScrollReveal>
                <span className="text-sky text-xs font-bold uppercase tracking-[0.2em]">Methodology</span>
                <h2 className={`text-3xl sm:text-5xl font-black mt-2 mb-8 leading-tight transition-colors duration-500 ${text}`}>
                  Data Collection
                  <br />
                  <span className="text-sky">Methodology</span>
                </h2>
              </ScrollReveal>
              <div className={`space-y-5 leading-relaxed transition-colors duration-500 ${textMuted}`}>
                <ScrollReveal delay={0.1}>
                  <motion.p whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }} className="cursor-default">
                    NOMOU&apos;s sensor network collects environmental data at configurable intervals ranging from 30 seconds to 5 minutes. Each reading is timestamped, geotagged, and transmitted securely to our cloud infrastructure via HTTPS.
                  </motion.p>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <ul className="space-y-3">
                    {['Soil moisture, temperature, and electrical conductivity', 'Air quality index (AQI), CO2, and particulate matter', 'Water pH, dissolved oxygen, and turbidity', 'Ambient temperature, humidity, barometric pressure', 'Light intensity and UV index'].map((item, i) => (
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
                  <motion.p whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }} className="cursor-default text-sm">
                    All data is validated through multi-point calibration and cross-referenced against reference instruments at Kuwait University.
                  </motion.p>
                </ScrollReveal>
              </div>
            </div>

            <ScrollReveal delay={0.15} direction="right">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className={`rounded-3xl p-8 transition-all duration-500 ${isDark ? 'bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(76,175,80,0.05)]' : 'bg-white border border-gray-200 shadow-lg'}`}>
                <h3 className={`text-lg font-bold mb-6 transition-colors duration-500 ${text}`}>Daily Impact Metrics</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0'} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} interval={4} />
                    <YAxis tick={{ fontSize: 12, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9E9E9E' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: isDark ? 'rgba(10,18,14,0.95)' : 'white', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E8F5E9', borderRadius: 16, backdropFilter: 'blur(10px)' }} />
                    <Bar dataKey="waterSaved" fill="#03A9F4" radius={[4, 4, 0, 0]} name="Water Saved (L)" />
                    <Bar dataKey="yield" fill="#4CAF50" radius={[4, 4, 0, 0]} name="Crop Yield Index" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#03A9F4]" /><span className={`text-xs ${textFaint}`}>Water Saved (L)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#4CAF50]" /><span className={`text-xs ${textFaint}`}>Crop Yield Index</span></div>
                </div>
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
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
            <p className={`max-w-2xl mx-auto mt-4 transition-colors duration-500 ${textMuted}`}>How researchers and organizations use NOMOU data to drive meaningful change.</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {applications.map((app, i) => {
              const Icon = app.icon;
              return (
                <ScrollReveal key={app.title} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -14, scale: 1.03, boxShadow: isDark ? `0 0 30px ${app.color}15` : `0 12px 40px ${app.color}08` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative rounded-[2rem] p-8 border transition-all duration-500 h-full flex flex-col group ${cardBg} ${isDark ? 'hover:border-white/20' : 'hover:border-green-primary/20'}`}>
                    <div className="absolute -top-14 -right-14 w-28 h-28 rounded-full blur-[50px] opacity-0 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundColor: app.color }} />
                    <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10" style={{ backgroundColor: `${app.color}15` }}
                      whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.15 }} transition={{ duration: 0.6 }}>
                      <Icon size={28} style={{ color: app.color }} />
                    </motion.div>
                    <h3 className={`text-xl font-bold mb-4 transition-colors duration-500 ${text} relative z-10`}>{app.title}</h3>
                    <p className={`text-sm leading-relaxed mb-6 flex-1 transition-colors duration-500 ${textMuted} relative z-10`}>{app.desc}</p>
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
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-green-light' : 'text-green-primary'}`}>Results</span>
            <h2 className={`text-4xl sm:text-5xl font-black mt-2 transition-colors duration-500 ${text}`}>Measured Improvements</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
            <p className={`mt-4 transition-colors duration-500 ${textMuted}`}>30 days of real deployment data showing consistent gains across all environmental metrics.</p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6">
            {[
              { title: 'System Efficiency %', badge: '+28%', color: '#2D7A3E', dataKey: 'efficiency', gradId: 'effGrad', domain: [60, 100] },
              { title: 'Soil Health Index', badge: '+35 pts', color: '#FF9800', dataKey: 'soilHealth', gradId: 'soilGrad', domain: [50, 100] },
              { title: 'Water Quality Score', badge: '+25 pts', color: '#03A9F4', dataKey: 'waterQuality', gradId: 'wqGrad', domain: [60, 100] },
              { title: 'Crop Yield Index', badge: '+16 pts', color: '#8BC34A', dataKey: 'yield', gradId: 'yieldGrad', domain: [75, 100] },
            ].map((chart, i) => (
              <ScrollReveal key={chart.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8, scale: 1.01, boxShadow: isDark ? `0 0 25px ${chart.color}10` : `0 8px 32px ${chart.color}06` }}
                  className={`rounded-3xl p-6 transition-colors duration-500 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-md'}`}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`text-sm font-bold transition-colors duration-500 ${text}`}>{chart.title}</h3>
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
                      <Tooltip contentStyle={{ background: isDark ? 'rgba(10,18,14,0.95)' : 'white', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E8F5E9', borderRadius: 16, backdropFilter: 'blur(10px)' }} />
                      <Area type="monotone" dataKey={chart.dataKey} stroke={chart.color} fill={`url(#${chart.gradId})`} strokeWidth={2.5} name={chart.title} dot={false} activeDot={{ r: 6, fill: chart.color, stroke: '#fff', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PUBLICATIONS ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg2}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-amber' : 'text-amber-600'}`}>Academic</span>
            <h2 className={`text-4xl sm:text-5xl font-black mt-2 transition-colors duration-500 ${text}`}>Publications</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
            <p className={`mt-4 transition-colors duration-500 ${textMuted}`}>Research papers and publications using NOMOU data and technology.</p>
          </ScrollReveal>

          <div className="space-y-5">
            {publications.map((pub, i) => (
              <ScrollReveal key={pub.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.01, boxShadow: isDark ? '0 0 25px rgba(76,175,80,0.08)' : '0 12px 40px rgba(27,94,32,0.06)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`rounded-2xl p-6 transition-all duration-300 border ${cardBg} ${isDark ? 'hover:border-white/20' : 'hover:border-green-primary/20'}`}>
                  <div className="flex items-start gap-5">
                    <motion.div whileHover={{ rotate: 15, scale: 1.15 }} className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-pale-green' : 'bg-pale-green'}`}>
                      <FileText size={22} className="text-green-primary" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-bold mb-1 transition-colors duration-500 ${text}`}>{pub.title}</h3>
                      <p className={`text-sm mb-1 transition-colors duration-500 ${textMuted}`}>{pub.authors} — <span className="italic">{pub.journal}</span>, {pub.year}</p>
                    </div>
                    <motion.a href="#" whileHover={{ x: 6, scale: 1.2 }} className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-green-primary hover:text-green-light transition-colors">
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
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }}
          className="absolute top-1/3 right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-sky pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="inline-block mb-8">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-2 ${isDark ? 'bg-green-primary/15 border border-green-primary/20' : 'bg-green-primary/10 border border-green-primary/20'}`}>
                <FlaskConical size={36} className={isDark ? 'text-green-light' : 'text-green-primary'} />
              </div>
            </motion.div>
            <h2 className={`text-4xl sm:text-5xl font-black mb-6 transition-colors duration-500 ${text}`}>Want to Collaborate?</h2>
            <p className={`text-lg mb-10 max-w-2xl mx-auto transition-colors duration-500 ${textMuted}`}>We&apos;re open to research partnerships and data sharing agreements with academic institutions across the region.</p>
            <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-primary to-green-light text-white font-bold text-lg rounded-2xl transition-all hover:shadow-[0_0_50px_rgba(76,175,80,0.5)] hover:scale-[1.03]">
              Contact Our Research Team <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
