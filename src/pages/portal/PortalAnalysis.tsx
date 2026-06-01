import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Droplets, Thermometer, Wind, Sun, Leaf, ArrowUpRight, RefreshCw, Lock
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useArduinoData } from '../../hooks/useArduinoData';

// ── AI Analysis engine (client-side, based on live sensor data) ──────────────
function generateAnalysis(soil: number, temp: number, humidity: number, light: number) {
  const issues: { severity: 'critical'|'warning'|'good'; label: string; detail: string; icon: React.ElementType; color: string }[] = [];
  const recs:   { priority: 'high'|'medium'|'low'; title: string; detail: string; icon: React.ElementType }[] = [];

  // Soil
  if (soil < 20) {
    issues.push({ severity:'critical', label:'Critical Soil Moisture', detail:`At ${soil}%, crops are at serious drought risk. Immediate irrigation required.`, icon:Droplets, color:'#ef4444' });
    recs.push({ priority:'high', title:'Irrigate immediately', detail:'Run irrigation for 45–60 min. Target moisture above 35%. Schedule automated watering at 5 AM before peak heat.', icon:Droplets });
  } else if (soil < 35) {
    issues.push({ severity:'warning', label:'Low Soil Moisture', detail:`At ${soil}%, moisture is below optimal 35–65% range.`, icon:Droplets, color:'#FF9800' });
    recs.push({ priority:'medium', title:'Schedule irrigation', detail:'Increase watering by 20%. Best time: early morning 5–6 AM to minimise evaporation.', icon:Droplets });
  } else {
    issues.push({ severity:'good', label:'Soil Moisture Optimal', detail:`At ${soil}%, moisture is within ideal 35–65% range.`, icon:Droplets, color:'#4CAF50' });
  }

  // Temperature
  if (temp > 37) {
    issues.push({ severity:'critical', label:'Heat Stress Risk', detail:`${temp.toFixed(1)}°C exceeds safe crop threshold. Yield reduction likely if sustained > 4h.`, icon:Thermometer, color:'#ef4444' });
    recs.push({ priority:'high', title:'Activate heat protection', detail:'Deploy shade netting (30–40% shade factor). Run mist irrigation at canopy level. Avoid fertilising until temperature drops below 34°C.', icon:Thermometer });
  } else if (temp > 33) {
    issues.push({ severity:'warning', label:'Elevated Temperature', detail:`${temp.toFixed(1)}°C is warm — monitor closely as it approaches critical threshold.`, icon:Thermometer, color:'#FF9800' });
    recs.push({ priority:'medium', title:'Monitor heat levels', detail:'Consider early morning watering to cool soil. Avoid mechanical operations between 11 AM–3 PM.', icon:Thermometer });
  } else {
    issues.push({ severity:'good', label:'Temperature Normal', detail:`${temp.toFixed(1)}°C is within optimal growing range.`, icon:Thermometer, color:'#4CAF50' });
  }

  // Humidity
  if (humidity < 35) {
    issues.push({ severity:'warning', label:'Low Humidity', detail:`${humidity.toFixed(0)}% is below the 40–70% ideal range. Increases transpiration stress.`, icon:Wind, color:'#FF9800' });
    recs.push({ priority:'medium', title:'Increase ambient humidity', detail:'Consider mist irrigation or mulching around plant bases to retain soil moisture and increase local humidity.', icon:Wind });
  } else if (humidity > 80) {
    issues.push({ severity:'warning', label:'High Humidity', detail:`${humidity.toFixed(0)}% is high — increased fungal disease risk. Ensure good air circulation.`, icon:Wind, color:'#FF9800' });
    recs.push({ priority:'medium', title:'Improve ventilation', detail:'Open greenhouse vents if applicable. Check for fungal signs. Apply preventive fungicide if humidity stays above 80% for >48h.', icon:Wind });
  } else {
    issues.push({ severity:'good', label:'Humidity Optimal', detail:`${humidity.toFixed(0)}% is within ideal 40–70% range.`, icon:Wind, color:'#4CAF50' });
  }

  // Light
  if (light < 20) {
    issues.push({ severity:'warning', label:'Low Light Level', detail:`${light}% light is insufficient for most crops — photosynthesis may be limited.`, icon:Sun, color:'#FF9800' });
    recs.push({ priority:'low', title:'Check light obstruction', detail:'Inspect for shading from structures or overgrown plants. Consider supplemental lighting for greenhouse crops.', icon:Sun });
  } else {
    issues.push({ severity:'good', label:'Light Levels Good', detail:`${light}% light is adequate for normal photosynthesis.`, icon:Sun, color:'#4CAF50' });
  }

  // Overall crop health score (0–100)
  let score = 100;
  issues.forEach(i => { if (i.severity==='critical') score -= 25; else if (i.severity==='warning') score -= 10; });
  score = Math.max(0, score);

  // 7-day predictions
  const predictions = [
    { label:'Soil Moisture', current: `${soil}%`, forecast: soil < 30 ? '↓ Critical' : soil < 40 ? '↓ Low' : '→ Stable', trend: soil < 35 ? 'dn' : 'ok' },
    { label:'Temperature',   current: `${temp.toFixed(1)}°C`, forecast: temp > 36 ? '↑ Heat Risk' : '→ Stable', trend: temp > 36 ? 'dn' : 'ok' },
    { label:'Humidity',      current: `${humidity.toFixed(0)}%`, forecast: humidity < 40 ? '↓ Low' : '→ Normal', trend: humidity < 40 ? 'dn' : 'ok' },
    { label:'Crop Health',   current: `${score}/100`, forecast: score < 60 ? '↓ Declining' : score < 80 ? '→ Stable' : '↑ Good', trend: score < 60 ? 'dn' : score >= 80 ? 'up' : 'ok' },
    { label:'Irrigation Need', current: soil < 30 ? 'High' : soil < 45 ? 'Moderate' : 'Low', forecast: 'Next 48h', trend: soil < 30 ? 'dn' : 'ok' },
  ];

  return { issues, recs, score, predictions };
}

export default function PortalAnalysis() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { current, history } = useArduinoData();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  if (!user) return null;

  const isSupreme = user.plan === 'gold' || user.plan === 'trial';

  if (!isSupreme) {
    return (
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
          className={`rounded-3xl p-10 border max-w-md w-full ${isDark?'bg-white/5 border-white/10':'bg-white border-gray-100 shadow-sm'}`}>
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-5">
            <Crown size={32} className="text-amber-500"/>
          </div>
          <h2 className={`text-2xl font-black mb-3 ${isDark?'text-white':'text-[#0a120e]'}`}>Gold Feature</h2>
          <p className={`text-sm mb-6 leading-relaxed ${isDark?'text-white/40':'text-gray-500'}`}>
            AI Analysis &amp; Predictions is exclusive to Gold and Free Trial users. Upgrade to unlock real-time AI insights, 7-day forecasts, and personalised crop recommendations.
          </p>
          <div className="space-y-2 mb-6 text-left">
            {['AI crop health scoring','7-day environmental forecasts','Personalised recommendations','Irrigation planning','Pest &amp; disease risk alerts'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Lock size={13} className="text-gray-300 shrink-0"/>
                <span className={isDark?'text-white/40':'text-gray-400'} dangerouslySetInnerHTML={{__html:f}}/>
              </div>
            ))}
          </div>
          <Link to="/pricing">
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30">
              <Crown size={15}/> Upgrade to Gold <ArrowUpRight size={14}/>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const { issues, recs, score, predictions } = generateAnalysis(
    current.soil_pct, current.temperature, current.humidity, current.light_pct
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setLastRefreshed(new Date());
    setRefreshing(false);
  };

  // Chart data
  const chartData = history.labels.length > 0
    ? history.labels.map((time, i) => ({ time, soil:history.soil[i]??0, temp:history.temp[i]??0, humid:history.humid[i]??0 }))
    : Array.from({length:12},(_,i)=>({ time:`${i*2}:00`, soil:30+Math.sin(i*.5)*10, temp:29+Math.sin(i*.4)*6, humid:55+Math.cos(i*.35)*12 }));

  // Radar data
  const radarData = [
    { subject:'Soil',     value: Math.min(100,current.soil_pct) },
    { subject:'Temp',     value: Math.max(0,100-Math.abs(current.temperature-28)*4) },
    { subject:'Humidity', value: current.humidity > 80 ? 60 : current.humidity < 35 ? 50 : 90 },
    { subject:'Light',    value: current.light_pct },
    { subject:'Overall',  value: score },
  ];

  const criticalCount = issues.filter(i=>i.severity==='critical').length;
  const warnCount     = issues.filter(i=>i.severity==='warning').length;
  const scoreColor    = score >= 80 ? '#4CAF50' : score >= 60 ? '#FF9800' : '#ef4444';
  const card = `rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown size={16} className="text-amber-500"/>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Supreme AI Analysis</span>
          </div>
          <h2 className={`text-2xl font-black ${isDark?'text-white':'text-[#0a120e]'}`}>Crop Intelligence</h2>
          <p className={`text-sm mt-0.5 ${isDark?'text-white/40':'text-gray-500'}`}>
            Live analysis · Last updated {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border ${isDark?'border-white/10 text-white/60 hover:bg-white/10':'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <RefreshCw size={14} className={refreshing?'animate-spin':''}/>
          Refresh
        </motion.button>
      </div>

      {/* Score + radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Health score */}
        <div className={`${card} p-6`}>
          <h3 className={`font-bold mb-4 ${isDark?'text-white':'text-[#0a120e]'}`}>Crop Health Score</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke={isDark?'rgba(255,255,255,0.07)':'#F0F0F0'} strokeWidth="10"/>
                <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="10"
                  strokeDasharray={`${(score/100)*263.9} 263.9`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black" style={{ color:scoreColor }}>{score}</span>
                <span className={`text-[10px] font-bold ${isDark?'text-white/40':'text-gray-400'}`}>/100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className={`text-lg font-black mb-1 ${isDark?'text-white':'text-[#0a120e]'}`}>
                {score >= 80 ? 'Excellent' : score >= 60 ? 'Fair' : 'Needs Attention'}
              </div>
              <p className={`text-xs leading-relaxed ${isDark?'text-white/40':'text-gray-500'}`}>
                {score >= 80 ? 'Conditions are optimal. Continue current practices.' :
                 score >= 60 ? 'Some conditions need attention. Review recommendations below.' :
                 'Multiple issues detected. Immediate action recommended.'}
              </p>
              <div className="flex gap-3 mt-3">
                <div className="text-center">
                  <div className="text-sm font-black text-red-500">{criticalCount}</div>
                  <div className={`text-[10px] ${isDark?'text-white/30':'text-gray-400'}`}>Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-black text-amber-500">{warnCount}</div>
                  <div className={`text-[10px] ${isDark?'text-white/30':'text-gray-400'}`}>Warning</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-black text-green-500">{issues.filter(i=>i.severity==='good').length}</div>
                  <div className={`text-[10px] ${isDark?'text-white/30':'text-gray-400'}`}>Good</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Radar chart */}
        <div className={`${card} p-5`}>
          <h3 className={`font-bold mb-2 ${isDark?'text-white':'text-[#0a120e]'}`}>Environmental Balance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={isDark?'rgba(255,255,255,0.07)':'#F0F0F0'}/>
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:11, fill:isDark?'rgba(255,255,255,0.5)':'#9E9E9E' }}/>
              <Radar name="Score" dataKey="value" stroke="#2D7A3E" fill="#2D7A3E" fillOpacity={0.25} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Condition status cards */}
      <div>
        <h3 className={`font-bold mb-3 ${isDark?'text-white':'text-[#0a120e]'}`}>Current Conditions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {issues.map((issue, i) => {
            const Icon = issue.icon;
            return (
              <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                className={`${card} p-4 flex items-start gap-3`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor:`${issue.color}15` }}>
                  <Icon size={17} style={{ color:issue.color }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${isDark?'text-white':'text-gray-900'}`}>{issue.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                      style={{ backgroundColor:`${issue.color}15`, color:issue.color }}>{issue.severity}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark?'text-white/45':'text-gray-500'}`}>{issue.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 7-Day predictions */}
      <div className={`${card} overflow-hidden`}>
        <div className="p-4 border-b" style={{ borderColor: isDark?'rgba(255,255,255,0.06)':'#F2F6F2' }}>
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-amber-400"/>
            <h3 className={`font-bold ${isDark?'text-white':'text-[#0a120e]'}`}>7-Day AI Forecast</h3>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: isDark?'rgba(255,255,255,0.04)':'#F8F8F8' }}>
          {predictions.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <span className={`text-sm font-medium ${isDark?'text-white/70':'text-gray-700'}`}>{p.label}</span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold font-mono ${isDark?'text-white':'text-gray-900'}`}>{p.current}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  p.trend==='dn' ? 'bg-red-50 text-red-600' :
                  p.trend==='up' ? 'bg-green-50 text-green-700' :
                  isDark?'bg-white/10 text-white/60':'bg-gray-100 text-gray-500'
                }`}>
                  {p.forecast}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend chart */}
      <div className={`${card} p-5`}>
        <h3 className={`font-bold mb-3 ${isDark?'text-white':'text-[#0a120e]'}`}>Sensor Trends</h3>
        <div className="flex gap-4 mb-3 flex-wrap">
          {[{c:'#0288D1',l:'Soil %'},{c:'#E65100',l:'Temp °C'},{c:'#2E7D32',l:'Humidity %'}].map(l=>(
            <div key={l.l} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{background:l.c}}/><span className="text-xs text-gray-500">{l.l}</span></div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0288D1" stopOpacity={0.25}/><stop offset="95%" stopColor="#0288D1" stopOpacity={0}/></linearGradient>
              <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E65100" stopOpacity={0.25}/><stop offset="95%" stopColor="#E65100" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark?'rgba(255,255,255,0.04)':'#f0f0f0'} vertical={false}/>
            <XAxis dataKey="time" tick={{fontSize:10,fill:isDark?'rgba(255,255,255,0.3)':'#9E9E9E'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:isDark?'rgba(255,255,255,0.3)':'#9E9E9E'}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:isDark?'#0d1f12':'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:12,fontSize:12}}/>
            <Area type="monotone" dataKey="soil"  stroke="#0288D1" fill="url(#ag1)" strokeWidth={2} name="Soil %" dot={false}/>
            <Area type="monotone" dataKey="temp"  stroke="#E65100" fill="url(#ag2)" strokeWidth={2} name="Temp °C" dot={false}/>
            <Area type="monotone" dataKey="humid" stroke="#2E7D32" fill="none"      strokeWidth={2} name="Humidity %" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      {recs.length > 0 && (
        <div>
          <h3 className={`font-bold mb-3 ${isDark?'text-white':'text-[#0a120e]'}`}>Recommendations</h3>
          <div className="space-y-3">
            {recs.map((r, i) => {
              const Icon = r.icon;
              const priColor = r.priority==='high'?'#ef4444':r.priority==='medium'?'#FF9800':'#8BC34A';
              return (
                <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.08 }}
                  className={`${card} p-4 flex gap-3`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor:`${priColor}15` }}>
                    <Icon size={18} style={{ color:priColor }}/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-bold ${isDark?'text-white':'text-gray-900'}`}>{r.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor:`${priColor}15`, color:priColor }}>{r.priority} priority</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark?'text-white/45':'text-gray-500'}`}>{r.detail}</p>
                  </div>
                </motion.div>
              );
            })}
            {recs.length === 0 && (
              <div className={`${card} p-5 flex items-center gap-3`}>
                <CheckCircle size={20} className="text-green-primary shrink-0"/>
                <p className={`text-sm ${isDark?'text-white/60':'text-gray-600'}`}>All conditions are optimal. No immediate action required.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
