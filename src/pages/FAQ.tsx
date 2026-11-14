import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const faqs=[
 ['What is Nomou?','Nomou is a smart agriculture platform that combines live sensor data, soil intelligence, crop guidance, reports and plant scanning to help users understand field and plant conditions.'],
 ['What does Nomou V2 measure?','The V2 node can report soil moisture, root-zone temperature, air temperature and humidity, atmospheric pressure, CO₂, ambient light, NH₃ response, TDS, pH/electrode signal and UV when those channels are connected and reporting.'],
 ['Are all Nomou values directly measured?','No. The app clearly separates measured readings from calculated, fused, relative, predicted or unavailable values. Calculated indicators such as VPD, moisture trend or risk scores are decision-support calculations, not direct sensor measurements.'],
 ['Does a low UV reading mean the node is failing?','No. Indoors, low UV is expected. A low value is still valid evidence when the UV sensor is reporting. Missing data and low data are treated differently.'],
 ['Is Nomou a replacement for laboratory soil testing?','No. Nomou is a screening, monitoring and decision-support platform. Certified laboratory testing remains appropriate when an official or laboratory-grade result is required.'],
 ['How does Guardian Scan work?','The mobile app can capture or select a plant photo, check image quality, and send the image to the Nomou AI service. When chosen, live node readings and recent sensor history can be included as additional context.'],
 ['Who owns my reports and exported data?','Your reports and exported account data are intended for your use. Nomou uses account and field data to provide monitoring, reports and agricultural features. See the Privacy Policy for more detail.'],
 ['How do I get support?','Email NomouSupport@gmail.com or use the Contact page.'],
 ['Where can I see plans and subscriptions?','Visit the Pricing page on nomou.app.'],
 ['Are the financial figures in the project report guaranteed results?','No. The report labels them as forward-looking project projections based on survey data and cost assumptions. Actual costs, adoption and performance may differ.'],
];

export default function FAQ(){
 const {isDark}=useTheme(); const [open,setOpen]=useState<number|null>(0); const bg=isDark?'bg-[#0a120e]':'bg-[#F7FAF7]'; const card=isDark?'bg-white/5 border-white/10':'bg-white border-gray-200'; const text=isDark?'text-white':'text-[#0a120e]'; const muted=isDark?'text-white/55':'text-gray-600';
 return <div className={`min-h-screen pt-36 pb-24 px-4 sm:px-6 ${bg} ${text}`}><div className="max-w-4xl mx-auto">
  <div className="inline-flex items-center gap-2 text-green-primary text-xs font-bold"><HelpCircle size={15}/> FREQUENTLY ASKED QUESTIONS</div>
  <h1 className="text-4xl sm:text-6xl font-black mt-4">Questions about Nomou</h1>
  <p className={`mt-5 text-lg ${muted}`}>Clear answers about the node, data, reports, Guardian, subscriptions and privacy.</p>
  <div className="mt-10 space-y-3">{faqs.map(([q,a],i)=><div key={q} className={`rounded-2xl border overflow-hidden ${card}`}><button onClick={()=>setOpen(open===i?null:i)} className="w-full p-5 text-left flex items-center justify-between gap-4"><span className="font-bold">{q}</span><ChevronDown size={18} className={`shrink-0 transition-transform ${open===i?'rotate-180':''}`}/></button>{open===i&&<div className={`px-5 pb-5 text-sm leading-relaxed ${muted}`}>{a}</div>}</div>)}</div>
 </div></div>;
}