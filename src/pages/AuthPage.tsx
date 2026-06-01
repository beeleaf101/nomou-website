import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Building2, Eye, EyeOff,
  ArrowRight, AlertCircle, ArrowLeft, CheckCircle,
  Droplets, Wind, Thermometer, Leaf,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const features = [
  { icon: Droplets, label: 'Real-time Soil Monitoring' },
  { icon: Wind,     label: 'Air Quality Tracking' },
  { icon: Thermometer, label: 'Temperature & Humidity' },
  { icon: Leaf,     label: 'Crop Health Reports' },
];

export default function AuthPage() {
  const location = useLocation();
  const defaultTab = new URLSearchParams(location.search).get('tab') === 'signup' ? 'signup' : 'login';
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login, signup } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail]   = useState('');
  const [loginPass, setLoginPass]     = useState('');
  const [signName, setSignName]       = useState('');
  const [signEmail, setSignEmail]     = useState('');
  const [signPass, setSignPass]       = useState('');
  const [signCompany, setSignCompany] = useState('');

  useEffect(() => { setError(''); }, [tab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await login(loginEmail, loginPass);
    setLoading(false);
    if (res.success) { setSuccess(true); setTimeout(() => navigate('/portal/dashboard'), 600); }
    else setError(res.error ?? 'Login failed.');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signPass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError('');
    const res = await signup(signName, signEmail, signPass, signCompany);
    setLoading(false);
    if (res.success) { setSuccess(true); setTimeout(() => navigate('/portal/subscription'), 600); }
    else setError(res.error ?? 'Sign up failed.');
  };

  const inputBase = `w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-green-primary/70 focus:bg-white/8 focus:ring-2 focus:ring-green-primary/20'
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-primary focus:bg-white focus:ring-2 focus:ring-green-primary/15'
  }`;

  return (
    <div className={`min-h-screen flex overflow-hidden ${isDark ? 'bg-[#07100a]' : 'bg-[#f4faf4]'}`}>

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex w-[480px] shrink-0 flex-col relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20] via-[#2D7A3E] to-[#1a4a28]" />
        {/* Animated blobs */}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-lime/30 blur-[80px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }}
          className="absolute bottom-[-60px] left-[-60px] w-80 h-80 rounded-full bg-sky/20 blur-[100px]" />
        {/* Particle dots */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white"
              style={{ width: 2 + (i % 3) * 2, height: 2 + (i % 3) * 2, left: `${(i * 19) % 92}%`, top: `${(i * 11 + 5) % 90}%`, opacity: 0.08 + (i % 4) * 0.05 }}
              animate={{ y: [0, -18, 0], opacity: [0.05 + i % 4 * 0.04, 0.2, 0.05 + i % 4 * 0.04] }}
              transition={{ duration: 5 + i % 4, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo — large and prominent */}
          <div className="mb-auto">
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl shrink-0">
                <img src="/images/logo.png" alt="Nomou" className="h-10 w-auto" />
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-wide">NOMOU</p>
                <p className="text-xs text-white/55 font-medium">Smart Environmental Monitoring</p>
              </div>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
              className="text-4xl font-black text-white leading-tight mb-4">
              Monitor smarter.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime to-[#a8e063]">Grow better.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-white/55 text-sm leading-relaxed mb-8 max-w-xs">
              Join farms across Kuwait using real-time IoT data to save water, cut costs, and maximise yields.
            </motion.p>

            <div className="space-y-3">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-lime" />
                    </div>
                    <span className="text-white/75 text-sm">{f.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom back button — always visible */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <Link to="/"
              className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200">
              <ArrowLeft size={16} className="text-white/70 group-hover:text-white transition-colors group-hover:-translate-x-0.5 duration-200" />
              <span className="text-white/70 group-hover:text-white text-sm font-semibold transition-colors">Back to Website</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className={`lg:hidden flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-white/5 bg-[#0d1f12]' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-green-primary/10'}`}>
              <img src="/images/logo.png" alt="Nomou" className={`h-6 w-auto ${isDark ? 'brightness-0 invert' : ''}`} />
            </div>
            <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-forest'}`}>NOMOU</span>
          </div>
          <Link to="/"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${isDark ? 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
            <ArrowLeft size={13} /> Back to site
          </Link>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center p-6 py-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-7">
              <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>
                {tab === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                {tab === 'login' ? 'Sign in to access your farm dashboard' : 'Start monitoring your farm for free'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className={`flex rounded-2xl p-1 mb-7 ${isDark ? 'bg-white/5 border border-white/8' : 'bg-gray-100 border border-gray-200/60'}`}>
              {(['login', 'signup'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                    tab === t
                      ? 'bg-gradient-to-r from-green-primary to-green-light text-white shadow-md shadow-green-primary/20'
                      : isDark ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-700'
                  }`}>
                  {t === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Card */}
            <div className={`rounded-3xl border p-7 shadow-xl ${isDark ? 'bg-white/[0.04] border-white/8 shadow-black/30' : 'bg-white border-gray-100 shadow-green-primary/5'}`}>
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="py-8 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-green-primary/15 flex items-center justify-center">
                      <CheckCircle size={32} className="text-green-primary" />
                    </div>
                    <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {tab === 'login' ? 'Signing you in…' : 'Account created!'}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Redirecting to your dashboard</p>
                  </motion.div>
                ) : tab === 'login' ? (
                  <motion.form key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }} onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Email Address</label>
                      <div className="relative">
                        <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/25' : 'text-gray-400'}`} />
                        <input type="email" required placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={inputBase} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Password</label>
                      </div>
                      <div className="relative">
                        <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/25' : 'text-gray-400'}`} />
                        <input type={showPass ? 'text' : 'password'} required placeholder="••••••••" value={loginPass} onChange={e => setLoginPass(e.target.value)} className={inputBase} />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-white/25 hover:text-white/50' : 'text-gray-300 hover:text-gray-500'}`}>
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" /> {error}
                      </motion.div>
                    )}
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 bg-gradient-to-r from-green-primary to-green-light text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-primary/25 hover:shadow-green-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                      {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Log In <ArrowRight size={16} /></>}
                    </motion.button>
                    <p className={`text-center text-xs pt-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                      Don't have an account?{' '}
                      <button type="button" onClick={() => setTab('signup')} className="text-green-primary font-bold hover:text-green-light transition-colors">Sign up free</button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }} onSubmit={handleSignup} className="space-y-4">
                    {[
                      { label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name', value: signName, onChange: setSignName, required: true },
                      { label: 'Email Address', icon: Mail, type: 'email', placeholder: 'you@example.com', value: signEmail, onChange: setSignEmail, required: true },
                      { label: 'Company / Farm (optional)', icon: Building2, type: 'text', placeholder: 'Al-Wafra Farms', value: signCompany, onChange: setSignCompany, required: false },
                    ].map(field => {
                      const Icon = field.icon;
                      return (
                        <div key={field.label}>
                          <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{field.label}</label>
                          <div className="relative">
                            <Icon size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/25' : 'text-gray-400'}`} />
                            <input type={field.type} required={field.required} placeholder={field.placeholder} value={field.value}
                              onChange={e => field.onChange(e.target.value)} className={inputBase} />
                          </div>
                        </div>
                      );
                    })}
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Password</label>
                      <div className="relative">
                        <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/25' : 'text-gray-400'}`} />
                        <input type={showPass ? 'text' : 'password'} required placeholder="Min. 8 characters" value={signPass}
                          onChange={e => setSignPass(e.target.value)} className={inputBase} />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-white/25 hover:text-white/50' : 'text-gray-300 hover:text-gray-500'}`}>
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" /> {error}
                      </motion.div>
                    )}
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 bg-gradient-to-r from-green-primary to-green-light text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-primary/25 hover:shadow-green-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1">
                      {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
                    </motion.button>
                    <p className={`text-center text-xs pt-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                      Already have an account?{' '}
                      <button type="button" onClick={() => setTab('login')} className="text-green-primary font-bold hover:text-green-light transition-colors">Log in</button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile back to website — below the card, always visible */}
            <div className="lg:hidden mt-6 text-center">
              <Link to="/"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border font-semibold text-sm transition-all ${isDark ? 'border-white/10 text-white/50 hover:bg-white/5 hover:text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                <ArrowLeft size={14} /> Back to Website
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
