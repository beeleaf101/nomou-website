import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Gift, Cpu, Star, Crown, MapPin, FlaskConical } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import ScrollReveal from '../components/ScrollReveal';

const plans = [
  {
    id: 'trial',
    name: 'One-Time Visit',
    price: '35 KWD',
    period: 'per visit',
    desc: 'One-time soil check with no subscription needed.',
    icon: Gift,
    color: '#8BC34A',
    badge: null,
    highlight: false,
    nodes: 'No subscription needed',
    nodePrice: null,
    testing: 'One-time assessment',
    features: [
      'One-time soil check',
      'Multiple spot readings',
      'AI report in 24 hours',
      'No subscription needed',
    ],
    notIncluded: [],
  },
  {
    id: 'bronze',
    name: 'Basic',
    price: 'KWD 110',
    period: 'setup + KWD 20/month',
    desc: 'For small farms, gardens and customers who want affordable monitoring.',
    icon: Cpu,
    color: '#CD7F32',
    badge: null,
    highlight: false,
    nodes: 'Basic monitoring',
    nodePrice: 'KWD 110 setup',
    testing: 'Monthly soil readings',
    features: [
      'Monthly soil readings',
      'Basic dashboard access',
      'Email alerts',
      'Standard reports',
    ],
    notIncluded: [
      'AI recommendations',
      'Mobile app access',
      'Priority support',
      'Full API access',
    ],
  },
  {
    id: 'silver',
    name: 'Smart',
    price: 'KWD 270',
    period: 'setup + KWD 45/month',
    desc: 'For greenhouses and farms that need more sensors and better alerts.',
    icon: Star,
    color: '#2D7A3E',
    badge: 'Popular',
    highlight: true,
    nodes: 'Smart monitoring',
    nodePrice: 'KWD 270 setup',
    testing: 'Real-time monitoring',
    features: [
      'Real-time monitoring',
      'AI recommendations',
      'Mobile app access',
      'Priority support',
    ],
    notIncluded: [
      'Full API access',
      'Custom reporting',
      'Multi-site deployment',
    ],
  },
  {
    id: 'gold',
    name: 'Institutional',
    price: 'KWD 340',
    period: 'setup + KWD 150/month',
    desc: 'For universities, public projects, large farms and sustainability pilots.',
    icon: Crown,
    color: '#FF9800',
    badge: null,
    highlight: false,
    nodes: 'Full institutional access',
    nodePrice: 'KWD 340 setup',
    testing: 'Full-scale deployment',
    features: [
      'Full API access',
      'Custom reporting',
      'Multi-site deployment',
      'Dedicated account manager',
    ],
    notIncluded: [],
  },
];

// old plans placeholder

export default function Pricing() {
  const { user, isLoggedIn } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSelect = (planId: string) => {
    if (!isLoggedIn) { navigate('/auth'); return; }
    if (planId === user?.plan) return;
    navigate(`/portal/checkout/${planId}`);
  };

  const getButtonLabel = (planId: string) => {
    if (user?.plan === planId) return '✓ Current Plan';
    if (planId === 'trial') return 'Start Free Trial';
    return isLoggedIn ? 'Upgrade' : 'Get Started';
  };

  const card = `rounded-3xl border overflow-hidden flex flex-col h-full transition-all duration-300`;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">

        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-green-light' : 'text-green-primary'}`}>Pricing</span>
          <h1 className={`text-4xl sm:text-6xl font-black mt-2 leading-tight ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-primary to-lime">Plan</span>
          </h1>
          <p className={`mt-4 text-lg max-w-xl mx-auto ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            Start free with full Gold access for 14 days. No credit card required.
          </p>
          {isLoggedIn && user?.plan && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-primary/10 border border-green-primary/20">
              <span className="w-2 h-2 rounded-full bg-green-primary animate-pulse" />
              <span className={`text-sm font-medium ${isDark ? 'text-green-light' : 'text-green-primary'}`}>
                Current plan: <strong className="capitalize">{user.plan === 'trial' ? '14-Day Trial' : user.plan}</strong>
              </span>
            </div>
          )}
        </ScrollReveal>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isCurrent = user?.plan === plan.id;
            return (
              <ScrollReveal key={plan.id} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`${card} ${
                    plan.highlight
                      ? 'border-green-primary shadow-[0_0_40px_rgba(45,122,62,0.2)]'
                      : isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white shadow-sm'
                  } ${plan.highlight ? (isDark ? 'bg-green-primary/10' : 'bg-gradient-to-b from-pale-green to-white') : ''}`}>

                  {plan.highlight && <div className="h-1 bg-gradient-to-r from-green-primary to-lime" />}

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Badge */}
                    {plan.badge && (
                      <div className="mb-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          plan.badge === 'Most Popular' ? 'bg-green-primary text-white' : 'bg-lime text-forest'
                        }`}>{plan.badge}</span>
                      </div>
                    )}

                    {/* Icon + Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${plan.color}20` }}>
                        <Icon size={20} style={{ color: plan.color }} />
                      </div>
                      <div>
                        <p className={`font-black text-base ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{plan.name}</p>
                        <p className="text-xs font-semibold" style={{ color: plan.color }}>{plan.nodes}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className={`text-4xl font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{plan.price}</span>
                      <span className={`text-sm ml-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>/{plan.period}</span>
                    </div>

                    <p className={`text-sm mb-4 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{plan.desc}</p>

                    {/* Testing price box */}
                    <div className={`rounded-xl p-3 mb-5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <FlaskConical size={13} style={{ color: plan.color }} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Testing Rate</span>
                      </div>
                      <p className={`text-xs font-semibold whitespace-pre-line ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{plan.testing}</p>
                    </div>

                    {/* Node price box */}
                    {plan.nodePrice && (
                      <div className={`rounded-xl p-3 mb-5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin size={13} style={{ color: plan.color }} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Node Price</span>
                        </div>
                        <p className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{plan.nodePrice}</p>
                      </div>
                    )}

                    {/* Features */}
                    <div className="space-y-2 mb-6 flex-1">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-start gap-2 text-sm">
                          <Check size={14} className="text-green-primary mt-0.5 shrink-0" />
                          <span className={isDark ? 'text-white/70' : 'text-gray-700'}>{f}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map(f => (
                        <div key={f} className="flex items-start gap-2 text-sm">
                          <X size={14} className={`mt-0.5 shrink-0 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
                          <span className={isDark ? 'text-white/25' : 'text-gray-300'}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(plan.id)}
                      disabled={isCurrent}
                      style={plan.id === 'gold' && !isCurrent ? { background: 'linear-gradient(to right, #F59E0B, #D97706)', color: 'white' } : {}}
                      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        isCurrent
                          ? 'bg-green-primary/20 text-green-primary border border-green-primary/30 cursor-default'
                          : plan.id === 'trial'
                            ? 'bg-gradient-to-r from-lime to-green-light text-forest font-black hover:shadow-lg'
                            : plan.highlight
                              ? 'bg-gradient-to-r from-green-primary to-green-light text-white hover:shadow-lg hover:shadow-green-primary/30'
                              : plan.id === 'gold'
                                ? 'hover:shadow-lg'
                                : isDark
                                  ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                      }`}>
                      {getButtonLabel(plan.id)} {!isCurrent && <ArrowRight size={14} />}
                    </motion.button>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Service-Based Offerings */}
        <ScrollReveal>
          <div className={`rounded-3xl p-8 border mb-10 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Soil Intelligence Services</h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Nomou offers a range of soil intelligence services tailored to different client needs, from one-time assessments to continuous smart monitoring with AI-powered recommendations.</p>
            <div className="space-y-3 mb-8">
              {[
                { title: 'Soil Insight Visit', desc: 'One-time field assessment with sensor deployment and basic soil health report.' },
                { title: 'Basic Monitoring', desc: 'Monthly sensor readings with standard soil parameter tracking and alerts.' },
                { title: 'Smart Monitoring', desc: 'Continuous real-time monitoring with AI analysis and personalized recommendations.' },
                { title: 'Institutional Package', desc: 'Full-scale deployment for research institutions with API access and custom reporting.' },
                { title: 'Consultation Service', desc: 'Expert agricultural consultation based on Nomou data insights.' },
              ].map(s => (
                <div key={s.title} className="flex items-start gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-primary mt-1 shrink-0" />
                  <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-700'}`}><strong>{s.title}</strong> - {s.desc}</p>
                </div>
              ))}
            </div>
            <h3 className={`text-xl font-black mb-6 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Service-Based Offerings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`rounded-2xl p-5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-pale-green border-green-primary/10'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-green-primary" />
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Land Visiting</span>
                </div>
                <p className={`text-xs mb-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Every 6 months</p>
                <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>95 <span className="text-base font-bold">KWD</span> <span className="text-sm font-normal text-gray-400">per visit</span></p>
              </div>
              <div className={`rounded-2xl p-5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-pale-green border-green-primary/10'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical size={16} className="text-green-primary" />
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Meter of Land Tested</span>
                </div>
                <p className={`text-xs mb-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Accurate Analysis</p>
                <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>250 <span className="text-base font-bold">KWD</span> <span className="text-sm font-normal text-gray-400">per test</span></p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Comparison table */}
        <ScrollReveal>
          <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="p-6 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F2F6F2' }}>
              <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Plan Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                    <th className={`text-left py-3 px-6 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Feature</th>
                    {['One-Time','Basic','Smart','Institutional'].map(p => (
                      <th key={p} className={`text-center py-3 px-4 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Package',           'One-Time Visit',  'Basic Monitoring', 'Smart Monitoring', 'Institutional'],
                    ['Setup Charge',      '—',               'KWD 110',          'KWD 270',          'KWD 340'],
                    ['Monthly Sub',       '35 KWD/visit',    'KWD 20',           'KWD 45',           'KWD 150'],
                    ['Best For',          'One-off check',   'Small farms',      'Greenhouses',      'Universities'],
                    ['AI Recommendations','✗',              '✗',               '✓',               '✓'],
                    ['Mobile App',        '✗',              '✗',               '✓',               '✓'],
                    ['API Access',        '✗',              '✗',               '✗',               '✓'],
                    ['Custom Reporting',  '✗',              '✗',               '✗',               '✓'],
                    ['Multi-site',        '✗',              '✗',               '✗',               '✓'],
                    ['Support',           '—',              'Email',            'Priority',         'Dedicated'],
                  ].map(([feat, ...vals]) => (
                    <tr key={feat as string} className={`border-b ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                      <td className={`py-3 px-6 font-medium ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{feat}</td>
                      {vals.map((v, i) => (
                        <td key={i} className={`text-center py-3 px-4 ${v === '✗' ? 'text-gray-300' : v === '✓' ? 'text-green-primary' : isDark ? 'text-white/60' : 'text-gray-600'} text-xs`}>
                          {v === '✓' ? <Check size={15} className="mx-auto text-green-primary" /> : v === '✗' ? <X size={15} className="mx-auto text-gray-300" /> : v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-8 text-center">
          <p className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            All plans include hardware setup support. Need a custom plan?{' '}
            <a href="/contact" className="text-green-primary font-semibold hover:underline">Contact us</a>
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}