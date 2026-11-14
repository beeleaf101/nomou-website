import { Scale } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const sections=[
 ['Using Nomou','You may use the website, dashboard, mobile application and connected Nomou services for lawful personal, educational, agricultural or authorized business purposes. Do not misuse the service, attempt unauthorized access, interfere with systems, or use the platform to harm others.'],
 ['Agricultural guidance','Nomou provides monitoring, screening and decision-support information. Sensor readings, calculated indicators, crop suggestions, AI responses and Guardian results are not a substitute for certified laboratory testing, professional agronomy, medical/veterinary advice, or any legally required inspection.'],
 ['Sensor limitations','Sensor performance depends on installation, calibration, environment, connectivity and hardware condition. A missing channel may be shown as unavailable. Calculated values are estimates derived from available evidence and should not be represented as direct laboratory measurements.'],
 ['Accounts','You are responsible for keeping your account credentials secure and for activity performed through your account. Nomou may suspend access where necessary to protect users, systems or data.'],
 ['Subscriptions and payments','Prices, plan features and billing terms are those shown during the applicable purchase or subscription flow. Project-report financial models and historical presentation figures are not guarantees of future commercial pricing.'],
 ['Your data and reports','Your account reports and supported exports are intended for your use. By using connected features, you allow Nomou to process the data necessary to provide monitoring, reports, alerts, analysis and support as described in the Privacy Policy.'],
 ['Photos and AI features','When you submit a plant photo for Guardian Scan, you are asking Nomou to process that image for plant-health analysis. AI-generated results can be uncertain or incomplete and should be checked against real plant conditions and, when needed, a qualified professional or laboratory.'],
 ['Availability','Nomou may update, improve, interrupt or discontinue parts of the service. Live data depends on node connectivity, cloud availability and third-party infrastructure.'],
 ['Intellectual property','The Nomou name, website design, software, branding and original platform materials belong to their respective rights holders. Your own uploaded content, reports and exported account data remain subject to your own rights and any applicable law.'],
 ['Limitation of responsibility','Nomou is designed to support better decisions, not to guarantee crop yield, plant survival, financial savings or a particular agricultural outcome. Users remain responsible for decisions made using the service.'],
 ['Contact','Questions about these terms can be sent to NomouSupport@gmail.com.'],
];

export default function TermsOfService(){
 const {isDark}=useTheme();const bg=isDark?'bg-[#0a120e]':'bg-[#F7FAF7]';const card=isDark?'bg-white/5 border-white/10':'bg-white border-gray-200';const text=isDark?'text-white':'text-[#0a120e]';const muted=isDark?'text-white/55':'text-gray-600';
 return <div className={`min-h-screen pt-36 pb-24 px-4 sm:px-6 ${bg} ${text}`}><div className="max-w-4xl mx-auto"><Scale size={30} className="text-green-primary"/><h1 className="text-4xl sm:text-6xl font-black mt-4">Terms of Service</h1><p className={`mt-4 ${muted}`}>Effective: 15 November 2026</p><p className={`mt-6 text-lg leading-relaxed ${muted}`}>These terms explain the basic rules for using Nomou's website, connected dashboard, mobile application and smart-agriculture features.</p><div className="mt-10 space-y-4">{sections.map(([h,b])=><section key={h} className={`p-6 rounded-2xl border ${card}`}><h2 className="font-black text-lg">{h}</h2><p className={`mt-2 text-sm leading-relaxed ${muted}`}>{b}</p></section>)}</div></div></div>;
}