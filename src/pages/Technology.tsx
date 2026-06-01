import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Activity, CloudRain, Zap, Shield, Wifi, Cpu, Battery, Radio, Signal, Globe, Droplets, Layers, Microchip } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useTheme } from '../hooks/useTheme';

const specs = [
  { spec: 'Microcontroller', prototype: 'ESP32 DevKit', semipro: 'ESP32-WROOM', professional: 'ESP32-S3' },
  { spec: 'Connectivity', prototype: 'WiFi', semipro: 'WiFi + BT', professional: 'WiFi + LoRa + 4G' },
  { spec: 'Sensors', prototype: '3-in-1', semipro: '5-in-1', professional: '7-in-1' },
  { spec: 'Enclosure', prototype: 'None', semipro: 'IP65 Plastic', professional: 'IP67 Aluminum' },
  { spec: 'Power', prototype: 'USB', semipro: '18650 Battery', professional: 'Solar + Battery' },
  { spec: 'Battery Life', prototype: 'N/A', semipro: '7 days', professional: '30+ days' },
  { spec: 'Data Interval', prototype: '5 min', semipro: '1 min', professional: '30 sec' },
  { spec: 'Range', prototype: '50m WiFi', semipro: '100m WiFi', professional: '5km LoRa' },
];

const bottomFeatures = [
  { icon: Activity, title: 'Real-time Monitoring', desc: 'Continuous data from soil, air, water & weather sensors streaming 24/7', color: '#4CAF50' },
  { icon: CloudRain, title: 'Smart & Connected', desc: 'IoT technology that keeps you informed anywhere in the world', color: '#03A9F4' },
  { icon: Zap, title: 'Energy Efficient', desc: 'Low power design for longer field performance with solar charging', color: '#FF9800' },
  { icon: Shield, title: 'Built for All Conditions', desc: 'Weatherproof, durable and ready for the harshest outdoor environments', color: '#8BC34A' },
];

const techStack = [
  { icon: Cpu, label: 'ESP32 Microcontroller', desc: 'Dual-core 240MHz processor with built-in WiFi & Bluetooth 5.0' },
  { icon: Wifi, label: 'Multi-Protocol Wireless', desc: 'WiFi, LoRaWAN, and 4G LTE connectivity options for any deployment' },
  { icon: Droplets, label: '7 Sensor Types', desc: 'Soil, air, water, temperature, humidity, light, and barometric pressure' },
  { icon: Battery, label: '30+ Day Battery', desc: 'Solar-powered with ultra-low power consumption design' },
  { icon: Signal, label: '5km Wireless Range', desc: 'LoRa long-range communication for remote field deployments' },
  { icon: Globe, label: 'Cloud Connected', desc: 'Real-time data sync to secure cloud dashboard via HTTPS' },
  { icon: Layers, label: 'Edge Computing', desc: 'On-device data processing and filtering before cloud transmission' },
  { icon: Microchip, label: 'OTA Updates', desc: 'Over-the-air firmware updates keep nodes current without field visits' },
];

function Particle({ i, isDark }: { i: number; isDark: boolean }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none"
      style={{ width: 2 + (i % 3) * 2, height: 2 + (i % 3) * 2, left: `${5 + i * 8}%`, top: `${10 + (i % 4) * 22}%`, backgroundColor: i % 3 === 0 ? '#8BC34A' : i % 3 === 1 ? '#4CAF50' : '#03A9F4', boxShadow: `0 0 ${6 + (i % 3) * 4}px currentColor` }}
      animate={{ y: [0, -30, 0], opacity: isDark ? [0.3, 0.8, 0.3] : [0.1, 0.3, 0.1] }}
      transition={{ duration: 6 + i * 0.8, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
  );
}

export default function Technology() {
  const { isDark } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: headerProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] });
  const headerY = useTransform(headerProgress, [0, 1], [0, 120]);
  const headerOpacity = useTransform(headerProgress, [0, 0.5], [1, 0]);

  const bg = isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]';
  const bg2 = isDark ? 'bg-[#0d1f12]' : 'bg-[#E8F5E9]';
  const text = isDark ? 'text-white' : 'text-[#0a120e]';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-500';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-md';
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] bg-lime" />
        </motion.div>

        {[...Array(12)].map((_, i) => <Particle key={i} i={i} isDark={isDark} />)}

        <motion.div style={{ opacity: headerOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-32 pt-36">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className={`text-xs font-semibold uppercase tracking-[0.2em] mb-6 transition-colors duration-500 ${isDark ? 'text-lime' : 'text-green-primary'}`}>Technology</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, type: 'spring', stiffness: 80 }}
            className={`text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.92] mb-6 transition-colors duration-500 ${text}`}>
            The Tech Behind
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-green-light to-sky">NOMOU</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${textMuted}`}>
            Cutting-edge IoT hardware and cloud software designed for the harshest environments on Earth.
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════ TECH STACK GRID ═══════════════ */}
      <section className={`py-24 transition-colors duration-500 ${bg2}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-green-light' : 'text-green-primary'}`}>Stack</span>
            <h2 className={`text-4xl sm:text-6xl font-black mt-2 transition-colors duration-500 ${text}`}>Core Technology</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {techStack.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <ScrollReveal key={tech.label} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -12, scale: 1.04, boxShadow: isDark ? '0 0 30px rgba(76,175,80,0.15)' : '0 8px 32px rgba(27,94,32,0.1)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative p-6 rounded-2xl border transition-all duration-500 group overflow-hidden h-full ${cardBg} ${isDark ? 'hover:border-white/20' : 'hover:border-green-primary/20'}`}>
                    <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-green-primary" />
                    <motion.div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-green-primary/10 group-hover:bg-green-primary/20 transition-colors relative z-10"
                      whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.15 }} transition={{ duration: 0.6 }}>
                      <Icon size={26} className="text-green-primary" />
                    </motion.div>
                    <h3 className={`text-sm font-bold mb-2 transition-colors duration-500 ${text} relative z-10`}>{tech.label}</h3>
                    <p className={`text-xs leading-relaxed transition-colors duration-500 ${textMuted} relative z-10`}>{tech.desc}</p>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SPECS TABLE ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-amber' : 'text-amber-600'}`}>Details</span>
            <h2 className={`text-4xl sm:text-5xl font-black mt-2 mb-4 transition-colors duration-500 ${text}`}>Technical Specifications</h2>
            <div className={`w-20 h-1 rounded-full mx-auto transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
          </ScrollReveal>

          <ScrollReveal>
            <motion.div whileHover={{ y: -6, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.3)' : '0 20px 60px rgba(27,94,32,0.08)' }}
              className={`rounded-3xl shadow-card overflow-hidden border transition-colors duration-500 ${cardBg2}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-[#1B5E20] to-[#2D7A3E]' : 'bg-gradient-to-r from-[#1B5E20] to-[#2D7A3E]'} text-white`}>
                      <th className="text-left px-6 py-5 font-bold">Specification</th>
                      <th className="text-center px-6 py-5 font-bold">Prototype</th>
                      <th className="text-center px-6 py-5 font-bold">Semi-Pro</th>
                      <th className="text-center px-6 py-5 font-bold">Professional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specs.map((row, i) => (
                      <motion.tr key={row.spec}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(76,175,80,0.04)' }}
                        className={`border-b last:border-0 transition-colors duration-200 cursor-default ${i % 2 === 1 ? (isDark ? 'bg-pale-green/5' : 'bg-pale-green/20') : ''} ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                        <td className={`px-6 py-4.5 font-bold transition-colors duration-500 ${text}`}>{row.spec}</td>
                        <td className={`px-6 py-4.5 text-center transition-colors duration-500 ${textMuted}`}>{row.prototype}</td>
                        <td className={`px-6 py-4.5 text-center transition-colors duration-500 ${textMuted}`}>{row.semipro}</td>
                        <td className="px-6 py-4.5 text-center font-bold text-green-primary">{row.professional}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════ FEATURE HIGHLIGHTS ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg2}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-sky' : 'text-sky-600'}`}>Capabilities</span>
            <h2 className={`text-4xl sm:text-5xl font-black mt-2 transition-colors duration-500 ${text}`}>Key Capabilities</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bottomFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -14, scale: 1.05, boxShadow: isDark ? '0 0 30px rgba(76,175,80,0.12)' : '0 8px 32px rgba(27,94,32,0.08)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`text-center p-7 rounded-2xl border transition-all duration-500 ${
                      isDark ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/15' : 'bg-white border-gray-100 hover:border-green-primary/20 shadow-sm'
                    }`}>
                    <motion.div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5`}
                      style={{ backgroundColor: `${feature.color}15` }}
                      whileHover={{ rotate: [0, -15, 15, 0], scale: 1.15 }} transition={{ duration: 0.6 }}>
                      <Icon size={30} style={{ color: feature.color }} />
                    </motion.div>
                    <h3 className={`text-base font-bold mb-3 transition-colors duration-500 ${text}`}>{feature.title}</h3>
                    <p className={`text-sm leading-relaxed transition-colors duration-500 ${textMuted}`}>{feature.desc}</p>
                  </motion.div>
                </ScrollReveal>
              );
            })}
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
                <Radio size={36} className={isDark ? 'text-green-light' : 'text-green-primary'} />
              </div>
            </motion.div>
            <h2 className={`text-4xl sm:text-5xl font-black mb-6 transition-colors duration-500 ${text}`}>Ready to Monitor Smarter?</h2>
            <p className={`text-lg mb-10 max-w-xl mx-auto transition-colors duration-500 ${textMuted}`}>Explore our nodes in action on the live dashboard and see the technology in real-time.</p>
            <Link to="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-primary to-green-light text-white font-bold text-lg rounded-2xl transition-all hover:shadow-[0_0_50px_rgba(76,175,80,0.5)] hover:scale-[1.03]">
              View Live Dashboard <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
