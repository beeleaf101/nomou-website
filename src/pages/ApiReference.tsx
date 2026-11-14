import { Code2, Lock, Database, Activity, BrainCircuit } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const endpoints=[
 {method:'GET',path:'/api/current',purpose:'Returns the latest Nomou node reading used by the website and mobile app.',auth:'Node/public deployment dependent'},
 {method:'GET',path:'/api/history',purpose:'Returns recent stored sensor history used for charts and trend calculations.',auth:'Node/public deployment dependent'},
 {method:'GET',path:'/api/soil-intelligence',purpose:'Returns the current Soil Passport / soil intelligence result. Supports desiredCrop when implemented by the backend.',auth:'Application endpoint'},
 {method:'GET',path:'/api/soil-reports?limit={n}',purpose:'Returns saved soil intelligence reports.',auth:'Application endpoint'},
 {method:'POST',path:'/api/soil-reports',purpose:'Saves a soil report for later review.',auth:'Application endpoint'},
 {method:'POST',path:'/api/ai-advisor',purpose:'Nomou app endpoint for crop advice, plant search and Guardian photo analysis.',auth:'Application endpoint'},
 {method:'POST',path:'/api/auth/signup',purpose:'Creates a Nomou website account.',auth:'No existing token required'},
 {method:'POST',path:'/api/auth/login',purpose:'Authenticates an existing account and returns an access token.',auth:'Credentials required'},
 {method:'GET',path:'/api/auth/me',purpose:'Returns the signed-in user profile.',auth:'Bearer token'},
 {method:'POST',path:'/api/auth/logout',purpose:'Ends the current account session.',auth:'Bearer token'},
 {method:'GET',path:'/api/auth/google/start',purpose:'Starts the Google sign-in flow used by the website.',auth:'OAuth flow'},
];

const fields=['temperature','humidity','soil_pct','light_pct','ldr_mv','soil_temp','bmp_pressure','scd_co2','nh3_mv','tds_ppm','ph','ph_mv','uv_mv','online'];

export default function ApiReference(){
 const {isDark}=useTheme(); const bg=isDark?'bg-[#0a120e]':'bg-[#F7FAF7]'; const card=isDark?'bg-white/5 border-white/10':'bg-white border-gray-200'; const text=isDark?'text-white':'text-[#0a120e]'; const muted=isDark?'text-white/55':'text-gray-600';
 return <div className={`min-h-screen pt-36 pb-24 px-4 sm:px-6 ${bg} ${text}`}><div className="max-w-6xl mx-auto">
  <div className="inline-flex items-center gap-2 text-green-primary text-xs font-bold"><Code2 size={15}/> API REFERENCE</div>
  <h1 className="text-4xl sm:text-6xl font-black mt-4">Nomou API reference</h1>
  <p className={`mt-5 max-w-3xl text-lg leading-relaxed ${muted}`}>This page documents endpoints that are currently referenced by the Nomou website and mobile application code. It is not an open-public API guarantee; authentication and availability depend on the deployed Nomou backend.</p>

  <div className="grid sm:grid-cols-3 gap-4 mt-10">
   {[['Base URL','https://api.nomou.app',Database],['Transport','HTTPS / JSON',Lock],['Primary use','Nomou website + app',Activity]].map(([a,b,I]:any)=><div key={a} className={`p-5 rounded-2xl border ${card}`}><I size={19} className="text-green-primary"/><p className="font-bold mt-3">{a}</p><p className={`text-sm mt-1 break-all ${muted}`}>{b}</p></div>)}
  </div>

  <h2 className="text-2xl font-black mt-14 mb-5">Endpoints used by Nomou</h2>
  <div className="space-y-3">{endpoints.map(e=><div key={e.method+e.path} className={`p-5 rounded-2xl border ${card}`}>
   <div className="flex flex-wrap items-center gap-3"><span className="text-xs font-black px-2 py-1 rounded bg-green-primary/10 text-green-primary">{e.method}</span><code className="text-sm font-bold break-all">{e.path}</code></div>
   <p className={`text-sm mt-3 ${muted}`}>{e.purpose}</p><p className="text-xs mt-2 text-green-primary font-semibold">{e.auth}</p>
  </div>)}</div>

  <h2 className="text-2xl font-black mt-14 mb-5">Current sensor payload fields</h2>
  <div className={`p-6 rounded-2xl border ${card}`}><div className="flex flex-wrap gap-2">{fields.map(f=><code key={f} className={`px-3 py-2 rounded-lg text-xs ${isDark?'bg-white/5':'bg-gray-50'}`}>{f}</code>)}</div>
  <p className={`text-sm mt-5 leading-relaxed ${muted}`}>Optional V2 fields can be null when a sensor is not connected or not reporting. Applications should treat missing data as unavailable, not as zero. Low UV indoors is still a valid reading when the UV channel is reporting.</p></div>

  <div className={`mt-8 p-6 rounded-2xl border ${card}`}><div className="flex items-center gap-2"><BrainCircuit size={19} className="text-green-primary"/><h3 className="font-black">Guardian image analysis</h3></div><p className={`text-sm mt-3 ${muted}`}>Guardian sends a plant photo plus available sensor context to the Nomou AI advisor endpoint. Provider credentials remain on the server and are not documented or exposed to client applications.</p></div>
 </div></div>;
}