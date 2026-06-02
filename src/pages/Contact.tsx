import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare, Users, FlaskConical, ArrowRight, ExternalLink } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useTheme } from '../hooks/useTheme';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'nomouQ8@gmail.com', href: 'mailto:info@nomou.io' },
  { icon: Phone, label: 'Phone', value: '+965 94448134', href: 'tel:+96512345678' },
  { icon: MapPin, label: 'Address', value: 'Kuwait City, State of Kuwait', href: '#' },
  { icon: Clock, label: 'Hours', value: 'Sun - Thu: 8:00 AM - 5:00 PM', href: '#' },
];

const inquiryTypes = ['General Inquiry', 'Sales & Partnership', 'Technical Support', 'Research Collaboration', 'Media & Press'];

const contactOptions = [
  { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with our support team in real-time during business hours.', action: 'Start Chat', href: '#' },
  { icon: Users, title: 'Partnerships', desc: 'Interested in distributing or integrating NOMOU into your operations?', action: 'Learn More', href: '#' },
  { icon: FlaskConical, title: 'Research', desc: 'Collaborate with us on environmental research and data projects.', action: 'Get in Touch', href: '/research' },
  { icon: ExternalLink, title: 'Documentation', desc: 'Find answers in our comprehensive developer and user documentation.', action: 'View Docs', href: '#' },
];

function Particle({ i, isDark }: { i: number; isDark: boolean }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none"
      style={{ width: 2 + (i % 3) * 2, height: 2 + (i % 3) * 2, left: `${5 + i * 8}%`, top: `${10 + (i % 4) * 22}%`, backgroundColor: i % 3 === 0 ? '#8BC34A' : i % 3 === 1 ? '#4CAF50' : '#03A9F4', boxShadow: `0 0 ${6 + (i % 3) * 4}px currentColor` }}
      animate={{ y: [0, -30, 0], opacity: isDark ? [0.3, 0.8, 0.3] : [0.1, 0.3, 0.1] }}
      transition={{ duration: 6 + i * 0.8, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
  );
}

export default function Contact() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }, 4000);
  };

  const bg = isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]';
  const bg2 = isDark ? 'bg-[#0d1f12]' : 'bg-[#E8F5E9]';
  const text = isDark ? 'text-white' : 'text-[#0a120e]';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-500';
  const textFaint = isDark ? 'text-white/30' : 'text-gray-400';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-md';

  const inputBase = `w-full px-5 py-4 rounded-xl border-2 text-sm transition-all duration-300 outline-none`;
  const inputStyle = isDark
    ? `${inputBase} bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-green-light/50 focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(139,195,74,0.08)] hover:border-white/20`
    : `${inputBase} bg-white border-gray-200 text-[#0a120e] placeholder-gray-300 focus:border-green-primary/40 focus:shadow-[0_0_20px_rgba(76,175,80,0.08)] hover:border-green-primary/20`;

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className={`relative min-h-[55vh] flex items-center justify-center overflow-hidden ${bg} transition-colors duration-500`}>
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 will-change-transform pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-green-primary" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }}
            className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-sky" />
        </motion.div>

        {[...Array(10)].map((_, i) => <Particle key={i} i={i} isDark={isDark} />)}

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-32 pt-36">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className={`text-xs font-semibold uppercase tracking-[0.2em] mb-6 transition-colors duration-500 ${isDark ? 'text-lime' : 'text-green-primary'}`}>Contact</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, type: 'spring', stiffness: 80 }}
            className={`text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.92] mb-6 transition-colors duration-500 ${text}`}>
            Get in
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-green-light to-sky">Touch</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${textMuted}`}>Have questions about NOMOU? We&apos;d love to hear from you. Reach out and let&apos;s start a conversation.</motion.p>
        </motion.div>
      </section>

      {/* ═══════════════ CONTACT SECTION ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <ScrollReveal className="lg:col-span-2">
              <span className="text-sky text-xs font-bold uppercase tracking-[0.2em]">Reach Out</span>
              <h2 className={`text-2xl font-black mt-2 mb-4 transition-colors duration-500 ${text}`}>Contact Information</h2>
              <p className={`mb-10 transition-colors duration-500 ${textMuted}`}>Whether you&apos;re a farmer, researcher, or just curious about NOMOU — we&apos;re here to help.</p>

              <div className="space-y-6 mb-10">
                {contactInfo.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.a key={item.label} href={item.href}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                      whileHover={{ x: 8 }}
                      className="flex items-start gap-4 group">
                      <motion.div whileHover={{ scale: 1.15, rotate: 5 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isDark ? 'bg-white/5 border border-white/10 group-hover:bg-green-primary group-hover:border-green-primary' : 'bg-pale-green border border-pale-green group-hover:bg-green-primary group-hover:border-green-primary'
                        }`}>
                        <Icon size={20} className="text-green-primary group-hover:text-white transition-colors" />
                      </motion.div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${textFaint}`}>{item.label}</p>
                        <p className={`text-base font-bold group-hover:text-green-primary transition-colors duration-500 ${text}`}>{item.value}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-4 transition-colors duration-500 ${textFaint}`}>Follow Us</p>
                <div className="flex gap-3">
                  {['X', 'in', 'gh', 'ig'].map((social) => (
                    <motion.a key={social} href="#" whileHover={{ y: -6, scale: 1.15 }} whileTap={{ scale: 0.9 }}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                        isDark ? 'bg-white/5 border border-white/10 text-white/50 hover:bg-green-primary hover:text-white hover:border-green-primary hover:shadow-[0_0_15px_rgba(76,175,80,0.2)]' : 'bg-pale-green text-green-primary hover:bg-green-primary hover:text-white hover:shadow-glow-green'
                      }`}>{social}</motion.a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal delay={0.15} className="lg:col-span-3">
              <motion.div whileHover={{ y: -6, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.3)' : '0 20px 60px rgba(27,94,32,0.08)' }}
                className={`rounded-3xl p-8 sm:p-10 border transition-colors duration-500 ${cardBg} relative overflow-hidden`}>
                {/* Subtle glow on focus */}
                {focusedField && (
                  <motion.div layoutId="formGlow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] bg-green-primary/10 pointer-events-none" />
                )}

                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex flex-col items-center justify-center py-20 text-center">
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.2, stiffness: 150 }}
                      className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${isDark ? 'bg-green-primary/20' : 'bg-green-primary/10'}`}>
                      <CheckCircle size={48} className="text-green-primary" />
                    </motion.div>
                    <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className={`text-3xl font-black mb-3 transition-colors duration-500 ${text}`}>Message Sent!</motion.h3>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                      className={textMuted}>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</motion.p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${text}`}>Name</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                          className={inputStyle} placeholder="Your name" />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
                        <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${text}`}>Email</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                          className={inputStyle} placeholder="you@example.com" />
                      </motion.div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                      <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${text}`}>Subject</label>
                      <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required
                        onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField(null)}
                        className={inputStyle}>
                        <option value="">Select an option</option>
                        {inquiryTypes.map((type) => <option key={type} value={type} className={isDark ? 'bg-[#0a120e] text-white' : ''}>{type}</option>)}
                      </select>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>
                      <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${text}`}>Message</label>
                      <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                        className={`${inputStyle} resize-none`} placeholder="Tell us about your project or question..." />
                    </motion.div>
                    <motion.button type="submit"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, boxShadow: isDark ? '0 0 30px rgba(76,175,80,0.3)' : '0 0 20px rgba(76,175,80,0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-primary to-green-light text-white font-bold rounded-2xl transition-all hover:from-[#388E3C] hover:to-[#66BB6A] text-base">
                      <Send size={18} /> Send Message
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT OPTIONS ═══════════════ */}
      <section className={`py-32 transition-colors duration-500 ${bg2}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-amber' : 'text-amber-600'}`}>Connect</span>
            <h2 className={`text-4xl sm:text-5xl font-black mt-2 mb-4 transition-colors duration-500 ${text}`}>Other Ways to Connect</h2>
            <div className={`w-20 h-1 rounded-full mx-auto transition-colors duration-500 ${isDark ? 'bg-gradient-to-r from-lime to-green-light' : 'bg-gradient-to-r from-green-primary to-green-light'}`} />
            <p className={`mt-4 transition-colors duration-500 ${textMuted}`}>Choose the channel that works best for you.</p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, i) => {
              const Icon = option.icon;
              return (
                <ScrollReveal key={option.title} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -14, scale: 1.05, boxShadow: isDark ? '0 0 25px rgba(76,175,80,0.1)' : '0 12px 40px rgba(27,94,32,0.06)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`text-center p-7 rounded-2xl border transition-all duration-500 h-full flex flex-col group ${
                      isDark ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/15' : 'bg-white border-gray-100 hover:border-green-primary/20 shadow-sm'
                    }`}>
                    <motion.div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${isDark ? 'bg-pale-green' : 'bg-pale-green'}`}
                      whileHover={{ rotate: [0, -15, 15, 0], scale: 1.15 }} transition={{ duration: 0.6 }}>
                      <Icon size={28} className="text-green-primary" />
                    </motion.div>
                    <h3 className={`text-base font-bold mb-3 transition-colors duration-500 ${text}`}>{option.title}</h3>
                    <p className={`text-sm mb-5 flex-1 transition-colors duration-500 ${textMuted}`}>{option.desc}</p>
                    <Link to={option.href} className="text-sm font-bold text-green-primary hover:text-green-light transition-colors inline-flex items-center justify-center gap-1.5 group/link">
                      {option.action} <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
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
