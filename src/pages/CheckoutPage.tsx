import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { Gift, Cpu, Star, Crown, Check, ArrowLeft } from 'lucide-react';
import { useAuth, type Plan } from '../hooks/useAuth';
import { usePayments } from '../hooks/usePayments';
import { useTheme } from '../hooks/useTheme';

const planDetails: Record<Plan, { name: string; price: string; color: string; icon: React.ElementType; features: string[] }> = {
  trial:  { name: '14-Day Free Trial', price: 'KD 0',  color: '#8BC34A', icon: Gift,  features: ['All Gold features', 'Unlimited nodes', 'No credit card required', 'Free testing up to 30,000 m²'] },
  bronze: { name: 'Bronze',            price: 'KD 15', color: '#CD7F32', icon: Cpu,   features: ['Live dashboard', 'KD 50/node', '50 fils/m² (first 5,000 m²)', '25 fils/m² subsequently'] },
  silver: { name: 'Silver',            price: 'KD 25', color: '#9E9E9E', icon: Star,  features: ['Full dashboard', 'KD 50/node', '25 fils/m² flat rate', 'Priority support'] },
  gold:   { name: 'Gold',              price: 'KD 45', color: '#FF9800', icon: Crown, features: ['Unlimited nodes included', 'AI recommendations', 'Free testing to 30,000 m²', 'Dedicated manager'] },
};

export default function CheckoutPage() {
  const { plan } = useParams<{ plan: string }>();
  const navigate = useNavigate();
  const { user, updatePlan } = useAuth();
  const { addSubscriptionPayment } = usePayments();
  const { isDark } = useTheme();
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const selectedPlan = (plan ?? 'bronze') as Plan;
  const details = planDetails[selectedPlan];
  const Icon = details.icon;
  const isTrial = selectedPlan === 'trial';

  const handleConfirm = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1200));
    await updatePlan(selectedPlan);
    if (!isTrial) await addSubscriptionPayment(details.name, details.price);
    setProcessing(false);
    setDone(true);
    setTimeout(() => navigate('/portal/dashboard'), 1500);
  };

  const card = `rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`;

  if (done) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]'}`}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-primary" />
          </div>
          <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>
            {isTrial ? 'Trial Started!' : 'Plan Updated!'}
          </h2>
          <p className={`${isDark ? 'text-white/40' : 'text-gray-500'}`}>Redirecting to your portal…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-16 px-4 ${isDark ? 'bg-[#0a120e]' : 'bg-[#F7FAF7]'}`}>
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate('/pricing')} className={`flex items-center gap-2 mb-8 text-sm font-medium ${isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-700'} transition-colors`}>
          <ArrowLeft size={16} /> Back to Pricing
        </button>

        <div className={`${card} p-8`}>
          {/* Plan header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F2F6F2' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${details.color}20` }}>
              <Icon size={28} style={{ color: details.color }} />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{details.name}</h2>
              <p className="text-3xl font-black mt-1" style={{ color: details.color }}>{details.price}
                <span className={`text-base font-normal ml-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                  {isTrial ? '/ 14 days' : '/ month'}
                </span>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {details.features.map(f => (
              <div key={f} className="flex items-center gap-3">
                <Check size={16} className="text-green-primary shrink-0" />
                <span className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{f}</span>
              </div>
            ))}
          </div>

          {/* Action */}
          {isTrial ? (
            <>
              <p className={`text-sm mb-6 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                Start your 14-day free trial with full Gold access. No credit card required. Upgrade anytime.
              </p>
              <motion.button onClick={handleConfirm} disabled={processing} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-green-primary to-green-light text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                {processing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Gift size={18} /> Start Free Trial</>}
              </motion.button>
            </>
          ) : (
            <>
              {/* Summary */}
              <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Monthly subscription</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>{details.price}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB' }}>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0a120e]'}`}>Total today</span>
                  <span className="font-black text-green-primary">{details.price}</span>
                </div>
              </div>
              <motion.button onClick={handleConfirm} disabled={processing} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-green-primary to-green-light text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all mb-3">
                {processing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Confirm & Pay {details.price}</>}
              </motion.button>
              <p className={`text-xs text-center ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Cancel anytime · Billed monthly</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
