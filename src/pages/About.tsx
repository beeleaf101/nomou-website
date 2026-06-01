import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Sprout, Lightbulb, Handshake, BarChart3,
  Leaf, Wifi, Users, Droplets, ArrowUpRight,
  Target, Globe, Zap, ChevronRight,
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useTheme } from '../hooks/useTheme';

/* ── DATA ────────────────────────────────────────────── */

const values = [
  { icon: Sprout, title: 'Sustainability', desc: 'Technology that protects and nurtures the environment, preserving resources for future generations.', color: '#4CAF50' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Pushing boundaries in IoT and sensor technology to create smarter, more efficient solutions.', color: '#FF9800' },
  { icon: Handshake, title: 'Accessibility', desc: 'Smart monitoring that is affordable and easy to use for every farmer, regardless of scale.', color: '#03A9F4' },
  { icon: BarChart3, title: 'Integrity', desc: 'Data you can trust. Transparent, accurate, and always available when you need it most.', color: '#8BC34A' },
];

const milestones = [
  { year: '2023', title: 'The Spark', desc: 'Identified the water waste crisis in Kuwaiti agriculture and envisioned a data-driven solution.', icon: Target },
  { year: '2024 Q1', title: 'First Prototype', desc: 'Built the first ESP32 sensor node on a breadboard. It worked — and the journey began.', icon: Zap },
  { year: '2024 Q3', title: 'Field Proven', desc: 'Deployed 10 nodes across Kuwaiti farms. Real data, real impact, real proof of concept.', icon: Leaf },
  { year: '2025', title: 'NOMOU Live', desc: 'Launched the complete platform — from rugged sensor nodes to a cloud dashboard anyone can use.', icon: Globe },
  { year: '2026', title: 'Scaling Up', desc: 'Expanding across the Gulf. 50+ nodes. 1.2M+ data points collected. The mission continues.', icon: Wifi },
];

const teamMembers = [
  { name: 'Laila Muhanna', role: 'CEO & Marketing', bio: 'Driving NOMOU\'s vision and leading marketing strategy to bring smart agriculture to every farm across Kuwait.', initials: 'LM', color: '#FF9800' },
  { name: 'Ragued CherChari', role: 'CTO & Founder', bio: 'Founding NOMOU and architecting the IoT platform and cloud infrastructure that powers every node.', initials: 'RC', color: '#1B5E20' },
  { name: 'Hamad Mubarak', role: 'CBO', bio: 'Leading business operations and growth strategy, building partnerships that expand NOMOU\'s reach across the region.', initials: 'HM', color: '#03A9F4' },
  { name: 'Faisal Almuneer', role: 'CFO', bio: 'Overseeing financial strategy, planning and operations to ensure NOMOU\'s sustainable growth and stability.', initials: 'FA', color: '#8BC34A' },
  { name: 'Ritaj CherChari', role: 'CDO', bio: 'Leading NOMOU\'s data strategy and analytics infrastructure, transforming raw sensor streams into meaningful insights that empower farmers to make smarter, data-driven decisions.', initials: 'RC', color: '#2D7A3E' },
  { name: 'Mohammad Aaref', role: 'COO & CAO', bio: 'Overseeing day-to-day operations and cross-functional coordination to ensure NOMOUs teams, systems and deployments run smoothly and efficiently across Kuwait.', initials: 'MA', color: '#7B1FA2' },
];

/* ── COUNT UP ────────────────────────────────────────── */

function CountUp({ end, suffix = '' }: { end: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const numericValue = parseFloat(end.replace(/[^0-9.]/g, ''));
  const hasStarted = useRef(false);
  return (
    <motion.span ref={ref} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      onViewportEnter={() => {
        if (hasStarted.current) return;
        hasStarted.current = true;
        const startTime = Date.now();
        const duration = 2000;
        const animate = () => {
          const elapsed = (Date.now() - startTime) / duration;
          const progress = Math.min(elapsed, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          if (ref.current) ref.current.textContent = Math.floor(eased * numericValue).toString() + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }}>
      0{suffix}
    </motion.span>
  );
}

/* ── FLOATING PARTICLE ───────────────────────────────── */

function Particle({ i, isDark }: { i: number; isDark: boolean }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 2 + (i % 3) * 2,
        height: 2 + (i % 3) * 2,
        left: `${5 + i * 8}%`,
        top: `${10 + (i % 4) * 22}%`,
        backgroundColor: i % 3 === 0 ? '#8BC34A' : i % 3 === 1 ? '#4CAF50' : '#03A9F4',
        boxShadow: `0 0 ${6 + (i % 3) * 4}px currentColor`,
      }}
      animate={{ y: [0, -30, 0], opacity: isDark ? [0.3, 0.8, 0.3] : [0.1, 0.3, 0.1] }}
      transition={{ duration: 6 + i * 0.8, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
    />
  );
}

/* ── AMBIENT GLOW ORB ────────────────────────────────── */

function GlowOrb({ className, color = 'bg-green-primary', duration = 10, delay = 0 }: {
  className: string; color?: string; duration?: number; delay?: number;
}) {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.14, 0.06] }}
      transition={{ duration, repeat: Infinity, delay }}
      className={`absolute rounded-full blur-[120px] pointer-events-none ${color} ${className}`}
    />
  );
}

/* ── MAIN COMPONENT ──────────────────────────────────── */

export default function About() {
  const { isDark } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.95]);

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ['start end', 'end start'],
  });
  const storyImgY = useSpring(useTransform(storyProgress, [0, 1], [80, -80]), { stiffness: 40, damping: 20 });

  const bg = isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]';
  const bg2 = isDark ? 'bg-[#0d1f12]' : 'bg-[#E8F5E9]';
  const text = isDark ? 'text-white' : 'text-[#0a120e]';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-500';
  const textFaint = isDark ? 'text-white/30' : 'text-gray-400';
  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-100 shadow-sm';
  const cardHover = isDark ? 'hover:border-white/20' : 'hover:border-green-primary/20';

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className={`relative min-h-[80vh] flex items-center overflow-hidden ${bg} transition-colors duration-500`}>
        {/* Parallax background layer */}
        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 will-change-transform pointer-events-none">
          <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'bg-gradient-to-br from-green-primary/10 via-transparent to-sky/5' : 'bg-gradient-to-br from-pale-green/50 via-transparent to-off-white'}`} />
          <GlowOrb className="top-10 left-[5%] w-[600px] h-[600px]" color="bg-green-primary" duration={10} />
          <GlowOrb className="bottom-10 right-[5%] w-[500px] h-[500px]" color="bg-sky" duration={12} delay={3} />
          <GlowOrb className="top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2" color="bg-lime" duration={14} delay={1.5} />
        </motion.div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <Particle key={i} i={i} isDark={isDark} />
        ))}

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-32 pt-36">
          <motion.span initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, type: 'spring' }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 border transition-colors duration-500 ${
              isDark ? 'bg-green-primary/10 border-green-primary/20 text-green-light' : 'bg-green-primary/10 border-green-primary/20 text-green-primary'
            }`}>
            <Leaf size={16} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Our Story</span>
          </motion.span>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, type: 'spring', stiffness: 80 }}
            className={`text-4xl sm:text-6xl lg:text-8xl font-black leading-[0.92] mb-8 transition-colors duration-500 ${text}`}>
            We saw a problem.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-green-light to-sky">We built the fix.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${textMuted}`}>
            NOMOU was born in Kuwait, for Kuwait. We set out to give every farmer the power of real-time environmental data.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-16 flex justify-center">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-7 h-12 rounded-full border-2 border-green-primary/30 flex items-start justify-center pt-2">
              <motion.div animate={{ opacity: [0.4, 1, 0.4], y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-primary" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      <section ref={storyRef} className={`relative py-32 ${bg} transition-colors duration-500 overflow-hidden`}>
        <GlowOrb className="top-0 right-0 w-[300px] h-[300px]" color="bg-sky" duration={8} delay={2} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <ScrollReveal>
                <span className="text-sky text-xs font-bold uppercase tracking-[0.2em]">The Origin</span>
                <h2 className={`text-3xl sm:text-5xl font-black mt-3 mb-8 leading-tight transition-colors duration-500 ${text}`}>
                  From a simple question
                  <br />
                  to a <span className="text-sky">mission.</span>
                </h2>
              </ScrollReveal>

              <div className={`space-y-6 leading-relaxed transition-colors duration-500 ${textMuted}`}>
                {[
                  'In Kuwait, agriculture faces a brutal reality — extreme heat, scarce water, and farmers making irrigation decisions based on instinct rather than data. The result? Up to 40% of irrigation water goes to waste.',
                  'Our team — engineers, scientists, and designers from Kuwait — asked a simple question: what if every farmer knew exactly what their soil, air, and water conditions were, in real-time?',
                  'NOMOU is the answer. Low-cost IoT nodes that collect environmental data continuously and feed it to a cloud dashboard anyone can read. No PhD required.',
                ].map((para, i) => (
                  <ScrollReveal key={i} delay={0.1 + i * 0.1}>
                    <motion.p whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }} className="cursor-default">
                      {para}
                    </motion.p>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={0.4}>
                <Link to="/technology" className="group inline-flex items-center gap-2 mt-10 text-green-primary font-bold hover:text-green-light transition-colors">
                  Explore Our Technology <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </ScrollReveal>
            </div>

            {/* Parallax image */}
            <ScrollReveal delay={0.2} direction="right">
              <motion.div style={{ y: storyImgY }} className="will-change-transform">
                <motion.div whileHover={{ scale: 1.03, rotate: 0.5 }} transition={{ type: 'spring', stiffness: 200 }}
                  className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group">
                  <img src="/images/soil-growth.jpg" alt="Growth" className={`w-full h-[500px] object-cover transition-all duration-500 ${isDark ? 'brightness-[0.7] contrast-125 saturate-75' : ''}`} />
                  <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-gradient-to-t from-[#0a120e]/60 to-transparent' : 'bg-gradient-to-t from-[#F7FAF7]/50 to-transparent'}`} />

                  {/* Floating badges */}
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className={`absolute bottom-8 left-8 rounded-2xl p-5 border backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-white/60 shadow-lg'}`}>
                    <p className={`text-3xl font-black transition-colors duration-500 ${text}`}><CountUp end="40" suffix="%" /></p>
                    <p className={`text-[10px] uppercase tracking-wider transition-colors duration-500 ${textFaint}`}>Water Saved</p>
                  </motion.div>

                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className={`absolute top-8 right-8 rounded-2xl px-5 py-3 border backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-green-primary/20 border-green-primary/30' : 'bg-green-primary/10 border-green-primary/20'}`}>
                    <p className="text-sm font-bold text-green-light">Est. 2023</p>
                  </motion.div>

                  {/* Corner glow on hover */}
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[60px] bg-green-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </motion.div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ VALUES ═══════════════ */}
      <section className={`relative py-32 overflow-hidden ${bg2} transition-colors duration-500`}>
        <GlowOrb className="top-20 left-[5%] w-[400px] h-[400px]" color="bg-green-primary" duration={9} />
        <GlowOrb className="bottom-20 right-[5%] w-[300px] h-[300px]" color="bg-lime" duration={11} delay={2} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal className="mb-16 text-center">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-amber' : 'text-amber-600'}`}>What Drives Us</span>
            <h2 className={`text-4xl sm:text-6xl font-black mt-2 transition-colors duration-500 ${text}`}>Core Values</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <ScrollReveal key={value.title} delay={i * 0.12}>
                  <motion.div
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative p-8 rounded-[2rem] border transition-all duration-500 group overflow-hidden h-full ${cardBg} ${cardHover}`}>
                    {/* Hover glow orb */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-50 transition-opacity duration-700" style={{ backgroundColor: value.color }} />

                    {/* Animated bottom line */}
                    <motion.div className="absolute bottom-0 left-8 right-8 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${value.color}80, transparent)` }}
                      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 + i * 0.15 }} />

                    <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                      style={{ backgroundColor: `${value.color}15` }}
                      whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.15 }} transition={{ duration: 0.6 }}>
                      <Icon size={26} style={{ color: value.color }} />
                    </motion.div>

                    <h3 className={`text-xl font-bold mb-3 transition-colors duration-500 ${text} relative z-10`}>{value.title}</h3>
                    <p className={`text-sm leading-relaxed transition-colors duration-500 ${textMuted} relative z-10`}>{value.desc}</p>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ TIMELINE ═══════════════ */}
      <section className={`relative py-32 ${bg} transition-colors duration-500 overflow-hidden`}>
        <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" color="bg-green-primary" duration={12} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal className="mb-20 text-center">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-green-light' : 'text-green-primary'}`}>Journey</span>
            <h2 className={`text-4xl sm:text-6xl font-black mt-2 transition-colors duration-500 ${text}`}>Our Path</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
          </ScrollReveal>

          <div className="relative">
            {/* Animated vertical line */}
            <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px origin-top"
              style={{ background: 'linear-gradient(to bottom, #4CAF50, #8BC34A, #03A9F4, #FF9800, #8BC34A, #4CAF50)' }} />

            {milestones.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: i * 0.1, type: 'spring', stiffness: 80 }}
                  className={`relative flex items-start gap-8 mb-20 last:mb-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <motion.div whileInView={{ scale: [0, 1.5, 1] }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1, type: 'spring' }}
                    className={`absolute left-4 sm:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-[3px] z-10 mt-1.5 transition-colors duration-500 shadow-[0_0_15px_rgba(76,175,80,0.4)] ${
                      isDark ? 'bg-[#0a120e] border-green-light' : 'bg-[#F7FAF7] border-green-primary'
                    }`}>
                    <div className="absolute inset-0 rounded-full bg-green-light/20 animate-ping" />
                  </motion.div>

                  <div className={`ml-14 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-16 sm:text-right' : 'sm:pl-16'}`}>
                    <motion.div whileHover={{ y: -6, scale: 1.02 }}
                      className={`rounded-2xl p-6 border transition-all duration-300 ${cardBg} ${cardHover} relative group overflow-hidden`}>
                      {/* Subtle hover glow */}
                      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] bg-green-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className={`flex items-center gap-2 mb-3 ${i % 2 === 0 ? 'sm:justify-end' : ''}`}>
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-primary/10">
                          <Icon size={16} className="text-green-primary" />
                        </motion.div>
                        <span className="text-xs font-bold text-green-light">{m.year}</span>
                      </div>
                      <h3 className={`text-lg font-bold mb-2 transition-colors duration-500 ${text}`}>{m.title}</h3>
                      <p className={`text-sm transition-colors duration-500 ${textMuted}`}>{m.desc}</p>
                    </motion.div>
                  </div>
                  <div className="hidden sm:block sm:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ TEAM ═══════════════ */}
      <section className={`relative py-32 overflow-hidden ${bg2} transition-colors duration-500`}>
        <GlowOrb className="top-10 right-[10%] w-[400px] h-[400px]" color="bg-green-primary" duration={10} delay={1} />
        <GlowOrb className="bottom-10 left-[10%] w-[350px] h-[350px]" color="bg-sky" duration={12} delay={3} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal className="mb-16 text-center">
            <span className="text-sky text-xs font-bold uppercase tracking-[0.2em]">The People</span>
            <h2 className={`text-4xl sm:text-6xl font-black mt-2 transition-colors duration-500 ${text}`}>Meet the Team</h2>
            <div className={`w-20 h-1 rounded-full mx-auto mt-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
          </ScrollReveal>

          {/* Team grid — all members equal */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -14, scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className={`rounded-2xl p-7 border transition-all text-center group relative overflow-hidden ${cardBg} ${cardHover}`}>
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: member.color }} />

                  <motion.div className="w-18 h-18 rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-black text-white relative z-10"
                    style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}90)`, width: 72, height: 72 }}
                    whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.7 }}>
                    {member.initials}
                  </motion.div>
                  <h3 className={`text-base font-bold mb-1 transition-colors duration-500 ${text}`}>{member.name}</h3>
                  <p className="text-xs font-semibold mb-3" style={{ color: member.color }}>{member.role}</p>
                  <p className={`text-xs leading-relaxed transition-colors duration-500 ${textFaint}`}>{member.bio}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className={`relative py-28 border-t transition-colors duration-500 ${bg} ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { value: '50', suffix: '+', label: 'Active Nodes', icon: Wifi },
              { value: '12', suffix: '', label: 'Farm Partners', icon: Users },
              { value: '1.2M', suffix: '+', label: 'Data Points', icon: BarChart3 },
              { value: '30', suffix: '%', label: 'Water Saved', icon: Droplets },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <ScrollReveal key={stat.label} delay={i * 0.12}>
                  <motion.div whileHover={{ y: -10, scale: 1.08 }} transition={{ type: 'spring', stiffness: 300 }} className="text-center group">
                    <motion.div
                      whileHover={{ rotate: [0, -15, 15, 0], scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${
                        isDark ? 'bg-white/[0.03] border-white/[0.08] group-hover:border-green-light/30 group-hover:shadow-[0_0_20px_rgba(139,195,74,0.15)]' : 'bg-white border-gray-100 shadow-sm group-hover:border-green-primary/30 group-hover:shadow-glow-green'
                      }`}>
                      <Icon size={24} className={`transition-colors duration-500 ${isDark ? 'text-green-light' : 'text-green-primary'}`} />
                    </motion.div>
                    <div className={`text-5xl font-black mb-2 transition-colors duration-500 ${text}`}>
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className={`text-xs uppercase tracking-wider transition-colors duration-500 ${textFaint}`}>{stat.label}</p>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
