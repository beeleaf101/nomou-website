
import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check, Target, Zap, BarChart3, Shield, Eye, Cpu, Wifi, Battery } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useTheme } from '../hooks/useTheme';

const topBadges = [
  { icon: Target, title: 'High Accuracy', desc: 'Reliable Sensors' },
  { icon: Zap, title: 'Low Power', desc: 'Energy Efficient' },
  { icon: BarChart3, title: 'Scalable', desc: 'Multi-Node System' },
  { icon: Shield, title: 'Rugged & Reliable', desc: 'All Environments' },
];

const nodes = [
  { level: '01', name: 'Prototype Node', subtitle: 'Learn. Build. Experiment.', image: '/images/node-prototype.png',
    features: ['ESP32 Dev Board', 'Basic Sensors (Soil, Air, Water)', 'Breadboard & Jumper Wires', 'Great for Learning & Prototyping'],
    bestFor: 'Students & Early Development', color: '#03A9F4',
    specs: [
      { icon: Wifi, label: 'WiFi Only' },
      { icon: Battery, label: 'USB Power' },
      { icon: Cpu, label: '3 Sensors' },
    ],
  },
  { level: '02', name: 'Semi-Professional', subtitle: 'Field Test. Compete. Validate.', image: '/images/node-semipro.png',
    features: ['Custom PCB & Organized Layout', 'Enclosure for Protection (IP65)', 'Enhanced Sensors & Stability', 'Battery Powered & Portable'],
    bestFor: 'Field Testing & Competitions', color: '#2D7A3E',
    specs: [
      { icon: Wifi, label: 'WiFi + BT' },
      { icon: Battery, label: 'Battery 7d' },
      { icon: Cpu, label: '5 Sensors' },
    ],
  },
  { level: '03', name: 'Professional Node', subtitle: 'Scale. Deploy. Monitor.', image: '/images/node-professional.png',
    features: ['Custom Designed PCB', 'All Sensors Integrated', 'Optimized Power Management', 'Durable, Compact & Scalable'],
    bestFor: 'Commercial Use & Large Deployments', color: '#1B5E20',
    specs: [
      { icon: Wifi, label: 'WiFi + LoRa + 4G' },
      { icon: Battery, label: 'Solar 30d+' },
      { icon: Cpu, label: '7 Sensors' },
    ],
  },
];

const comparisonFeatures = [
  { name: 'WiFi Connectivity', proto: true, semipro: true, pro: true },
  { name: 'Bluetooth', proto: false, semipro: true, pro: true },
  { name: 'LoRa / 4G', proto: false, semipro: false, pro: true },
  { name: 'Soil Moisture', proto: true, semipro: true, pro: true },
  { name: 'Air Quality', proto: true, semipro: true, pro: true },
  { name: 'Water Quality', proto: true, semipro: true, pro: true },
  { name: 'Temp & Humidity', proto: true, semipro: true, pro: true },
  { name: 'Light / UV Sensor', proto: false, semipro: true, pro: true },
  { name: 'Barometric Pressure', proto: false, semipro: false, pro: true },
  { name: 'Weatherproof', proto: false, semipro: true, pro: true },
  { name: 'Solar Power', proto: false, semipro: false, pro: true },
  { name: 'OTA Updates', proto: false, semipro: true, pro: true },
];

function Particle({ i, isDark }: { i: number; isDark: boolean }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none"
      style={{ width: 2 + (i % 3) * 2, height: 2 + (i % 3) * 2, left: `${5 + i * 8}%`, top: `${10 + (i % 4) * 22}%`, backgroundColor: i % 3 === 0 ? '#8BC34A' : i % 3 === 1 ? '#4CAF50' : '#03A9F4', boxShadow: `0 0 ${6 + (i % 3) * 4}px currentColor` }}
      animate={{ y: [0, -30, 0], opacity: isDark ? [0.3, 0.8, 0.3] : [0.1, 0.3, 0.1] }}
      transition={{ duration: 6 + i * 0.8, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
  );
}

export default function NodesPage() {
  const { isDark } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headerProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] });
  const headerY = useTransform(headerProgress, [0, 1], [0, 150]);
  const headerOpacity = useTransform(headerProgress, [0, 0.5], [1, 0]);


  const bg = isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]';
  const bg2 = isDark ? 'bg-[#0d1f12]' : 'bg-[#E8F5E9]';
  const text = isDark ? 'text-white' : 'text-[#0a120e]';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-500';
  const textFaint = isDark ? 'text-white/30' : 'text-gray-400';
  const cardBg2 = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-100';

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={headerRef} className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden ${bg} transition-colors duration-500`}>
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="absolute inset-0 will-change-transform pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-green-primary" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }}
            className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-sky" />
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 14, repeat: Infinity, delay: 1.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] bg-lime" />
        </motion.div>

        {[...Array(12)].map((_, i) => <Particle key={i} i={i} isDark={isDark} />)}

        <motion.div style={{ opacity: headerOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-32 pt-36">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className={`text-xs font-semibold uppercase tracking-[0.2em] mb-6 transition-colors duration-500 ${isDark ? 'text-lime' : 'text-green-primary'}`}>Our Products</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, type: 'spring', stiffness: 80 }}
            className={`text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.92] mb-6 transition-colors duration-500 ${text}`}>
            Smart Nodes —
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-green-light to-sky">Built for Every Need</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${textMuted}`}>
            From simple prototypes to advanced, deployable systems. NOMOU nodes evolve with your needs.
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════ BADGES ═══════════════ */}
      <section className={`py-16 border-b transition-colors duration-500 ${bg} ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {topBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <motion.div key={badge.title}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ y: -8, scale: 1.05, boxShadow: isDark ? '0 0 30px rgba(76,175,80,0.15)' : '0 0 20px rgba(76,175,80,0.1)' }}
                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                      isDark ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/15' : 'bg-white border-gray-100 shadow-sm hover:border-green-primary/20'
                    }`}>
                    <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-pale-green' : 'bg-pale-green'}`}>
                      <Icon size={22} className="text-green-primary" />
                    </motion.div>
                    <div>
                      <p className={`text-sm font-bold transition-colors duration-500 ${text}`}>{badge.title}</p>
                      <p className={`text-xs transition-colors duration-500 ${textFaint}`}>{badge.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════ NODE CARDS ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {nodes.map((node, i) => (
              <ScrollReveal key={node.level} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -18, scale: 1.03, rotateY: 2 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className={`rounded-[2.5rem] transition-all duration-300 overflow-hidden h-full flex flex-col border group relative`}
                  style={{ borderTop: `4px solid ${node.color}`, perspective: 1000 }}>

                  {/* Hover glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: node.color }} />

                  <div className={`p-7 flex-1 flex flex-col transition-colors duration-500 relative z-10 ${isDark ? 'bg-white/[0.02]' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <motion.span whileHover={{ scale: 1.1 }} className="px-4 py-1.5 text-xs font-bold rounded-full text-white shadow-lg" style={{ backgroundColor: node.color, boxShadow: `0 4px 15px ${node.color}40` }}>
                        LEVEL {node.level}
                      </motion.span>
                      <span className={`text-xs font-medium transition-colors duration-500 ${textFaint}`}>{node.bestFor}</span>
                    </div>

                    <h3 className={`text-2xl font-black mb-1 transition-colors duration-500 ${text}`}>{node.name}</h3>
                    <p className={`text-sm mb-6 transition-colors duration-500 ${textFaint}`}>{node.subtitle}</p>

                    {/* Spec pills */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {node.specs.map((spec) => {
                        const SpecIcon = spec.icon;
                        return (
                          <motion.span key={spec.label} whileHover={{ scale: 1.08, y: -2 }}
                            className={`inline-flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border font-medium transition-all ${
                              isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-gray-50 border-gray-100 text-gray-500'
                            }`}>
                            <SpecIcon size={10} /> {spec.label}
                          </motion.span>
                        );
                      })}
                    </div>

                    {/* Image */}
                    <div className={`flex-1 flex items-center justify-center py-5 min-h-[220px] rounded-2xl mb-6 transition-colors duration-500 ${isDark ? 'bg-off-white/5' : 'bg-off-white/50'}`}>
                      <motion.img whileHover={{ scale: 1.12, rotate: -3, y: -8 }} transition={{ type: 'spring', stiffness: 200 }}
                        src={node.image} alt={node.name}
                        className={`max-h-[200px] w-auto object-contain transition-all duration-500 drop-shadow-2xl ${isDark ? 'brightness-[0.75] contrast-125 saturate-75' : ''}`} />
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-4">
                      {node.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <motion.span whileHover={{ scale: 1.3, rotate: 10 }} className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDark ? 'bg-pale-green' : 'bg-pale-green'}`}>
                            <Check size={14} className="text-green-primary" />
                          </motion.span>
                          <span className={`text-sm transition-colors duration-500 ${textMuted}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`px-7 py-5 transition-colors duration-500 relative z-10 ${isDark ? 'bg-pale-green/10' : 'bg-pale-green/30'}`}>
                    <span className="text-sm font-bold" style={{ color: node.color }}>Best For: {node.bestFor}</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ COMPARISON ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg2}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-amber' : 'text-amber-600'}`}>Compare</span>
            <h2 className={`text-4xl sm:text-5xl font-black mt-2 mb-4 transition-colors duration-500 ${text}`}>Feature Comparison</h2>
            <div className={`w-20 h-1 rounded-full mx-auto transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
          </ScrollReveal>

          <ScrollReveal>
            <motion.div whileHover={{ y: -6, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.3)' : '0 20px 60px rgba(27,94,32,0.08)' }}
              className={`rounded-3xl shadow-card overflow-hidden border transition-colors duration-500 ${cardBg2}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-[#1B5E20] to-[#2D7A3E]' : 'bg-gradient-to-r from-[#1B5E20] to-[#2D7A3E]'} text-white`}>
                      <th className="text-left px-6 py-5 font-bold text-sm">Feature</th>
                      <th className="text-center px-6 py-5 font-bold">Prototype</th>
                      <th className="text-center px-6 py-5 font-bold">Semi-Pro</th>
                      <th className="text-center px-6 py-5 font-bold">Professional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, i) => (
                      <motion.tr key={feature.name}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(76,175,80,0.04)' }}
                        className={`border-b last:border-0 transition-colors duration-200 cursor-default ${i % 2 === 1 ? (isDark ? 'bg-white/[0.015]' : 'bg-off-white/30') : ''} ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                        <td className={`px-6 py-4 font-semibold transition-colors duration-500 ${text}`}>{feature.name}</td>
                        {['proto', 'semipro', 'pro'].map((k) => (
                          <td key={k} className="px-6 py-4 text-center">
                            {feature[k as keyof typeof feature] ? (
                              <motion.div whileHover={{ scale: 1.5, rotate: 10 }} transition={{ type: 'spring' }}>
                                <Check size={18} className="text-green-light mx-auto drop-shadow-[0_0_6px_rgba(139,195,74,0.5)]" />
                              </motion.div>
                            ) : (
                              <span className={isDark ? 'text-white/10' : 'text-gray-200'}>—</span>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </ScrollReveal>
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
                <Eye size={36} className={isDark ? 'text-green-light' : 'text-green-primary'} />
              </div>
            </motion.div>
            <h2 className={`text-4xl sm:text-5xl font-black mb-6 transition-colors duration-500 ${text}`}>Ready to Monitor Smarter?</h2>
            <p className={`text-lg mb-10 max-w-xl mx-auto transition-colors duration-500 ${textMuted}`}>Explore our nodes in action on the live dashboard and see real-time data from the field.</p>
            <Link to="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-primary to-green-light text-white font-bold text-lg rounded-2xl transition-all hover:shadow-[0_0_50px_rgba(76,175,80,0.5)] hover:scale-[1.03]">
              View Live Dashboard <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
