import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, RefreshCw, ShieldCheck, Sprout, Save, Fingerprint, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

type CropMatch = {
  crop:string; compatibilityScore:number; compatibilityLabel:string; plantingReadinessScore:number;
  confidence:number; preferred:{pH:string;temperatureC:string;soilMoisturePct:string}; constraints:string[];
};
type Intel = {
  online:boolean;
  soilPassport:{observedConditionScore:number;label:string;confidence:number;evidenceCoveragePct:number;disclaimer:string};
  soilFingerprint:{code:string;historyHours:number;retentionBand:string;moistureTrendPctPerHour:number|null};
  measurements:{key:string;label:string;value:number|null;unit:string;status:string;confidence:number;source:string}[];
  cropMatches:CropMatch[];
  desiredCrop:CropMatch|{crop:string;supported:false;message:string}|null;
  trendProjection:{hours:number;soilMoisturePct:number|null;confidence:string}[];
  recommendations:{priority:string;title:string;action:string;why:string}[];
  limitations:string[];
};

const API='https://api.nomou.app';

export default function PortalSoilIntelligence(){
  const {isDark}=useTheme();
  const [data,setData]=useState<Intel|null>(null);
  const [crop,setCrop]=useState('');
  const [sample,setSample]=useState('Sample A');
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');

  const load=async(desired='')=>{
    setLoading(true);setError('');
    try{
      const r=await fetch(`${API}/api/soil-intelligence${desired.trim()?`?crop=${encodeURIComponent(desired.trim())}`:''}`);
      const j=await r.json();
      if(!r.ok||j.error)throw new Error(j.error||`HTTP ${r.status}`);
      setData(j);
    }catch(e:any){setError(e?.message||'Could not load soil intelligence');}
    finally{setLoading(false);}
  };
  useEffect(()=>{load();},[]);

  const save=async()=>{
    setSaving(true);setError('');
    try{
      const r=await fetch(`${API}/api/soil-reports`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sampleName:sample,desiredCrop:crop})});
      const j=await r.json(); if(!r.ok||j.error)throw new Error(j.error||'Could not save report');
      alert('Soil evidence snapshot saved.');
    }catch(e:any){setError(e?.message||'Could not save report');}
    finally{setSaving(false);}
  };

  const card=`rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-white border-gray-100 shadow-sm'}`;
  const text=isDark?'text-white':'text-[#0a120e]';
  const muted=isDark?'text-white/45':'text-gray-500';
  const wanted:any=data?.desiredCrop;
  const measured=data?.measurements.filter(m=>['soil_moisture','soil_temperature','ph','salinity','nitrate','nh3'].includes(m.key))||[];

  return <div className="p-4 sm:p-6 space-y-5">
    <div className="flex items-start justify-between gap-3">
      <div><p className="text-[10px] font-black tracking-[.2em] text-green-primary uppercase">Nomou V2 · Evidence Engine</p><h2 className={`text-2xl font-black ${text}`}>Soil Intelligence</h2><p className={`text-sm mt-1 ${muted}`}>Measured facts, confidence-aware calculations, crop fit and saved soil fingerprints.</p></div>
      <button onClick={()=>load(crop)} className="p-2.5 rounded-xl bg-green-primary/10 text-green-primary"><RefreshCw size={18}/></button>
    </div>

    {error&&<div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm flex gap-2"><AlertTriangle size={17}/>{error}</div>}
    {loading&&!data?<div className={`${card} p-10 text-center ${muted}`}>Building soil intelligence…</div>:data&&<>
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="lg:col-span-2 rounded-3xl bg-[#0d2a20] text-white p-6 flex items-center gap-5">
          <div className="flex-1"><p className="text-[10px] font-black tracking-[.2em] text-lime uppercase">{data.online?'Live evidence':'Last known evidence'}</p><h3 className="text-3xl font-black mt-1 capitalize">{data.soilPassport.label}</h3><p className="text-sm text-white/60 mt-2 max-w-xl">{data.soilPassport.disclaimer}</p><div className="flex flex-wrap gap-2 mt-4"><span className="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full">{data.soilPassport.confidence}% confidence</span><span className="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full">{data.soilPassport.evidenceCoveragePct}% evidence coverage</span></div></div>
          <div className="w-28 h-28 rounded-full border-4 border-lime flex flex-col items-center justify-center"><span className="text-4xl font-black">{data.soilPassport.observedConditionScore}</span><span className="text-[10px] text-white/50">/ 100</span></div>
        </motion.div>
        <div className={`${card} p-5`}><div className="flex items-center gap-2 text-green-primary"><Fingerprint size={20}/><span className="text-xs font-black uppercase tracking-wider">Soil Fingerprint</span></div><div className={`text-2xl font-black mt-3 ${text}`}>{data.soilFingerprint.code}</div><p className={`text-sm mt-2 ${muted}`}>{data.soilFingerprint.retentionBand} · {data.soilFingerprint.historyHours.toFixed(1)} h learned</p><p className={`text-xs mt-2 ${muted}`}>Moisture trend: {data.soilFingerprint.moistureTrendPctPerHour==null?'learning':`${data.soilFingerprint.moistureTrendPctPerHour.toFixed(2)}%/h`}</p></div>
      </div>

      <div><p className="text-[10px] font-black tracking-[.18em] text-green-primary uppercase">Evidence ledger</p><h3 className={`text-xl font-black ${text}`}>What Nomou actually knows</h3></div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">{measured.map(m=><div key={m.key} className={`${card} p-4`}><div className="flex justify-between gap-2"><span className={`text-xs font-bold ${muted}`}>{m.label}</span><span className={`w-2 h-2 rounded-full ${m.value==null?'bg-amber-400':'bg-green-500'}`}/></div><div className={`text-xl font-black mt-2 ${m.value==null?'text-amber-500':text}`}>{m.value==null?m.status.replaceAll('-',' '):`${Number.isInteger(m.value)?m.value:m.value.toFixed(1)} ${m.unit}`}</div><p className={`text-[10px] mt-2 leading-4 ${muted}`}>{m.source}</p></div>)}</div>

      <div className={`${card} p-5 border-green-primary/20`}><div className="flex gap-3"><ShieldCheck className="text-green-primary shrink-0" size={22}/><div><h4 className={`font-black ${text}`}>No fake chemistry</h4><p className={`text-sm mt-1 ${muted}`}>Nomou does not convert raw NH₃ voltage into nitrate and does not invent pH, EC, phosphorus or potassium. Missing measurements lower confidence instead.</p></div></div></div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className={`${card} p-5 lg:col-span-1`}><div className="flex items-center gap-2"><Sprout size={19} className="text-green-primary"/><h3 className={`font-black ${text}`}>What do you want to plant?</h3></div><input value={crop} onChange={e=>setCrop(e.target.value)} placeholder="e.g. tomato" className={`w-full mt-4 px-3 py-2.5 rounded-xl border outline-none ${isDark?'bg-white/5 border-white/10 text-white':'bg-gray-50 border-gray-200'}`}/><button onClick={()=>load(crop)} className="w-full mt-2 py-2.5 rounded-xl bg-green-primary text-white text-sm font-black">Check crop</button>{wanted?.compatibilityScore!=null&&<div className="mt-4 rounded-xl bg-green-primary/10 p-3"><div className="flex justify-between"><span className={`font-black ${text}`}>{wanted.crop}</span><span className="font-black text-green-primary">{wanted.compatibilityScore}%</span></div><p className={`text-xs mt-1 ${muted}`}>Readiness {wanted.plantingReadinessScore}% · confidence {wanted.confidence}%</p></div>}</div>
        <div className={`${card} p-5 lg:col-span-2`}><h3 className={`font-black ${text}`}>Best current crop matches</h3><div className="mt-3 space-y-2">{data.cropMatches.slice(0,5).map((c,i)=><div key={c.crop} className={`rounded-xl p-3 flex items-center gap-3 ${isDark?'bg-white/5':'bg-gray-50'}`}><div className="w-8 h-8 rounded-lg bg-[#0d2a20] text-white flex items-center justify-center font-black text-xs">{i+1}</div><div className="flex-1"><div className="flex justify-between"><span className={`font-bold ${text}`}>{c.crop}</span><span className="font-black text-green-primary">{c.compatibilityScore}%</span></div><p className={`text-[11px] ${muted}`}>pH {c.preferred.pH} · {c.preferred.temperatureC}°C · moisture {c.preferred.soilMoisturePct}%</p></div></div>)}</div></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`${card} p-5`}><h3 className={`font-black ${text}`}>Next 24 hours</h3><div className="grid grid-cols-3 gap-2 mt-3">{data.trendProjection.map(p=><div key={p.hours} className={`rounded-xl p-3 text-center ${isDark?'bg-white/5':'bg-gray-50'}`}><p className="text-[10px] font-black text-green-primary">{p.hours}H</p><p className={`text-xl font-black mt-1 ${text}`}>{p.soilMoisturePct==null?'—':`${p.soilMoisturePct}%`}</p><p className={`text-[9px] mt-1 ${muted}`}>{p.confidence}</p></div>)}</div><p className={`text-[10px] mt-3 ${muted}`}>Sensor-history trend projection, not a weather forecast.</p></div>
        <div className={`${card} p-5`}><h3 className={`font-black ${text}`}>Save evidence snapshot</h3><p className={`text-xs mt-1 ${muted}`}>Use Sample A/B/C/D/E to compare your five soil cups.</p><input value={sample} onChange={e=>setSample(e.target.value)} className={`w-full mt-3 px-3 py-2.5 rounded-xl border outline-none ${isDark?'bg-white/5 border-white/10 text-white':'bg-gray-50 border-gray-200'}`}/><button onClick={save} disabled={saving} className="mt-2 w-full py-2.5 rounded-xl bg-lime text-forest text-sm font-black flex items-center justify-center gap-2"><Save size={16}/>{saving?'Saving…':'Save Soil Passport'}</button></div>
      </div>

      <div><p className="text-[10px] font-black tracking-[.18em] text-green-primary uppercase">Action plan</p><div className="grid md:grid-cols-2 gap-3 mt-2">{data.recommendations.map((r,i)=><div key={i} className={`${card} p-4`}><span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${r.priority==='high'?'bg-red-100 text-red-600':'bg-amber-100 text-amber-700'}`}>{r.priority}</span><h4 className={`font-black mt-3 ${text}`}>{r.title}</h4><p className={`text-sm mt-1 ${muted}`}>{r.action}</p><p className="text-[10px] font-bold text-green-primary mt-2">WHY · {r.why}</p></div>)}</div></div>
    </>}
  </div>;
}
