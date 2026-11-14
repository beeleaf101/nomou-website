import { ExternalLink, FileText, FlaskConical, Droplets, Thermometer, CloudRain, Gauge, Radio, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useArduinoData } from '../hooks/useArduinoData';

const references=[
 {title:'Soil Tests Section',org:'Kuwait Environment Public Authority',url:'https://epa.gov.kw/en-US/LabsDept/SandTest',note:'Official soil-analysis services and laboratory functions in Kuwait.'},
 {title:'Soil Lab',org:'Kuwait University — NUERS',url:'https://nuers.ku.edu.kw/soil-lab',note:'Official Kuwait University soil-laboratory capabilities and services.'},
 {title:'Analytical Soil Testing',org:'SGS Kuwait',url:'https://www.sgs.com/en-kw/services/soil-testing',note:'Agricultural soil testing for nutrients, physical properties and other soil parameters.'},
 {title:'Environment & Life Sciences Research',org:'Kuwait Institute for Scientific Research',url:'https://www.kisr.edu.kw/en/research-centers/environment-life-sciences-reducing-risks-improving-health/',note:'KISR environmental and life-sciences research context.'},
];

const reportEvidence=[
 ['117','survey respondents','Bilingual Google Forms customer-validation survey recorded in the final project report.'],
 ['81.2%','willing to pay','Reported willingness to pay for a soil-monitoring service.'],
 ['75.2%','would recommend','Reported willingness to recommend Nomou to others.'],
 ['70.1%','prefer continuous monitoring','Reported preference for ongoing monitoring over one-time visits.'],
 ['58.3%','prefer Smart package','Reported package preference in the project survey.'],
];

export default function Research(){
 const {isDark}=useTheme();
 const {current}=useArduinoData();
 const bg=isDark?'bg-[#0a120e]':'bg-[#F7FAF7]';
 const bg2=isDark?'bg-[#0d1f12]':'bg-[#E8F5E9]';
 const card=isDark?'bg-white/5 border-white/10':'bg-white border-gray-200';
 const text=isDark?'text-white':'text-[#0a120e]';
 const muted=isDark?'text-white/55':'text-gray-600';

 const live=[
  {label:'Soil moisture',value:`${current.soil_pct}%`,icon:Droplets},
  {label:'Air temperature',value:`${current.temperature.toFixed(1)}°C`,icon:Thermometer},
  {label:'Humidity',value:`${Math.round(current.humidity)}%`,icon:CloudRain},
  {label:'Pressure',value:current.bmp_pressure==null?'—':`${current.bmp_pressure.toFixed(1)} hPa`,icon:Gauge},
  {label:'CO₂',value:current.scd_co2&&current.scd_co2>0?`${Math.round(current.scd_co2)} ppm`:'—',icon:Gauge},
  {label:'NH₃ signal',value:current.nh3_mv==null?'—':`${Math.round(current.nh3_mv)} mV`,icon:Radio},
  {label:'TDS',value:current.tds_ppm==null?'—':`${Math.round(current.tds_ppm)} ppm`,icon:Droplets},
  {label:'UV',value:current.uv_mv==null?'—':`${Math.round(current.uv_mv)} mV`,icon:Sun},
 ];

 return <div className={`min-h-screen ${bg} ${text}`}>
  <section className="pt-36 pb-20 px-4 sm:px-6">
   <div className="max-w-6xl mx-auto">
    <div className="inline-flex items-center gap-2 text-green-primary text-xs font-bold"><FlaskConical size={15}/> RESEARCH & REFERENCES</div>
    <h1 className="text-4xl sm:text-6xl font-black mt-4">Evidence behind Nomou</h1>
    <p className={`mt-5 max-w-3xl text-lg leading-relaxed ${muted}`}>This page separates Nomou's own project evidence from external reference material. We do not present generated demo charts as measured field results, and we do not describe planned collaborations as completed partnerships.</p>
   </div>
  </section>

  <section className={`py-16 px-4 sm:px-6 ${bg2}`}>
   <div className="max-w-6xl mx-auto">
    <div className="flex items-center justify-between flex-wrap gap-3 mb-7"><div><p className="text-xs font-bold text-green-primary">CURRENT V2 EVIDENCE</p><h2 className="text-3xl font-black mt-1">Live node channels</h2></div><span className={`text-sm ${muted}`}>{current.online?'Node online':'Last known / node offline'}</span></div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{live.map(({label,value,icon:Icon})=><div key={label} className={`p-4 rounded-2xl border ${card}`}><Icon size={18} className="text-green-primary"/><p className="text-xl font-black mt-3 font-mono">{value}</p><p className={`text-xs mt-1 ${muted}`}>{label}</p></div>)}</div>
    <p className={`mt-5 text-sm ${muted}`}>A dash means the optional channel is not currently reporting. Missing data is not converted into a fake zero.</p>
   </div>
  </section>

  <section className="py-20 px-4 sm:px-6">
   <div className="max-w-6xl mx-auto">
    <p className="text-xs font-bold text-green-primary">NOMOU PROJECT EVIDENCE</p>
    <h2 className="text-3xl font-black mt-2">Customer-validation survey</h2>
    <p className={`mt-3 max-w-3xl ${muted}`}>The final Nomou project report records a bilingual Google Forms survey of 117 respondents. These figures are project survey findings, not national agricultural statistics.</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-7">{reportEvidence.map(([v,l,n])=><div key={l} className={`p-5 rounded-2xl border ${card}`}><p className="text-2xl font-black text-green-primary">{v}</p><p className="font-bold text-sm mt-2">{l}</p><p className={`text-xs leading-relaxed mt-2 ${muted}`}>{n}</p></div>)}</div>
   </div>
  </section>

  <section className={`py-20 px-4 sm:px-6 ${bg2}`}>
   <div className="max-w-6xl mx-auto">
    <p className="text-xs font-bold text-green-primary">HOW TO READ NOMOU RESULTS</p>
    <h2 className="text-3xl font-black mt-2">Measured data vs. calculated intelligence</h2>
    <div className="grid md:grid-cols-3 gap-5 mt-7">
     <div className={`p-6 rounded-2xl border ${card}`}><h3 className="font-black">Measured</h3><p className={`text-sm mt-2 leading-relaxed ${muted}`}>Direct sensor values such as soil moisture, temperature, humidity, pressure, CO₂, TDS, pH/electrode signal, NH₃ response, light and UV when available.</p></div>
     <div className={`p-6 rounded-2xl border ${card}`}><h3 className="font-black">Calculated</h3><p className={`text-sm mt-2 leading-relaxed ${muted}`}>VPD, moisture trend, irrigation demand, environmental risk indices, Soil Passport scores and crop-fit logic derived from available evidence.</p></div>
     <div className={`p-6 rounded-2xl border ${card}`}><h3 className="font-black">Not a lab certificate</h3><p className={`text-sm mt-2 leading-relaxed ${muted}`}>Nomou supports screening and monitoring. Official laboratory testing remains appropriate for certified measurements and formal agricultural decisions.</p></div>
    </div>
   </div>
  </section>

  <section className="py-20 px-4 sm:px-6">
   <div className="max-w-5xl mx-auto">
    <div className="flex items-center gap-3"><FileText className="text-green-primary"/><h2 className="text-3xl font-black">Verified external references</h2></div>
    <p className={`mt-3 ${muted}`}>These are external sources used as context for soil testing, environmental research and laboratory practice. They are references, not claims that the organizations endorse Nomou.</p>
    <div className="mt-7 space-y-4">{references.map(r=><a key={r.title} href={r.url} target="_blank" rel="noreferrer" className={`block p-6 rounded-2xl border transition-transform hover:-translate-y-1 ${card}`}><div className="flex items-start gap-4"><div className="flex-1"><h3 className="font-black">{r.title}</h3><p className="text-green-primary text-sm font-semibold mt-1">{r.org}</p><p className={`text-sm mt-2 ${muted}`}>{r.note}</p></div><ExternalLink size={17} className="text-green-primary shrink-0"/></div></a>)}</div>
    <div className={`mt-8 p-5 rounded-2xl border ${card}`}><p className="font-bold">Publication status</p><p className={`text-sm mt-2 ${muted}`}>Nomou's website currently presents its student project report, validation survey and cited reference sources. It does not claim that Nomou has published a peer-reviewed scientific paper unless one is added here in the future.</p></div>
   </div>
  </section>
 </div>;
}