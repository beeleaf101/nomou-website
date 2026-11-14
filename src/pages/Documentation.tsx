import { Link } from 'react-router';
import { FileText, CheckCircle, ArrowRight, BookOpen, Cpu, Users, BarChart3, ShieldCheck } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const sections = [
  'Executive Summary','Company Structure','Services Explanations','Components and Technology',
  'Customer Validation and Survey Results','Kuwait Market Feasibility','UN Sustainable Development Goals Alignment',
  'Media and Marketing Strategies','Sales Strategies','Full Financial Report','Timeline for the Project',
  'Risks and Legal Notes','SWOT Analysis','Unique Selling Points',"Nomou's Future",'References'
];

export default function Documentation(){
  const {isDark}=useTheme();
  const bg=isDark?'bg-[#0a120e]':'bg-[#F7FAF7]';
  const card=isDark?'bg-white/5 border-white/10':'bg-white border-gray-200';
  const text=isDark?'text-white':'text-[#0a120e]';
  const muted=isDark?'text-white/55':'text-gray-600';
  return <div className={`min-h-screen ${bg} ${text}`}>
    <section className="pt-36 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-primary/10 text-green-primary text-xs font-bold mb-5"><FileText size={14}/> NOMOU PROJECT DOCUMENTATION</div>
        <h1 className="text-4xl sm:text-6xl font-black leading-tight">Nomou Final Project Report</h1>
        <p className={`mt-5 text-lg leading-relaxed max-w-3xl ${muted}`}>This documentation is based on the final Nomou project report prepared by the Canadian College of Kuwait student team. It presents the business model, research, validation, technology concept, financial projections, risks and future direction recorded in that report.</p>
        <div className={`mt-7 p-5 rounded-2xl border ${card}`}>
          <p className="font-bold">Report title</p>
          <p className={`mt-1 ${muted}`}>NOMOU — Smart Environmental Monitoring — AI-Powered Soil Intelligence & Smart Agriculture Service</p>
          <p className={`mt-3 text-sm ${muted}`}>Project report · 2026 · Canadian College of Kuwait</p>
        </div>
      </div>
    </section>

    <section className="pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className={`p-7 rounded-3xl border ${card}`}>
          <BookOpen className="text-green-primary" />
          <h2 className="text-2xl font-black mt-4">What the report covers</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-2">
            {sections.map((s,i)=><div key={s} className={`text-sm rounded-xl px-3 py-2 ${isDark?'bg-white/5':'bg-gray-50'}`}><span className="text-green-primary font-bold mr-2">{String(i+1).padStart(2,'0')}</span>{s}</div>)}
          </div>
        </div>
        <div className="space-y-6">
          <div className={`p-7 rounded-3xl border ${card}`}>
            <Users className="text-sky"/>
            <h2 className="text-xl font-black mt-4">Customer validation</h2>
            <p className={`mt-3 ${muted}`}>The report records a bilingual Google Forms survey with 117 respondents. It reports 81.2% willing to pay, 75.2% willing to recommend Nomou, 70.1% preferring continuous monitoring, and 58.3% preferring the Smart package.</p>
          </div>
          <div className={`p-7 rounded-3xl border ${card}`}>
            <BarChart3 className="text-amber-500"/>
            <h2 className="text-xl font-black mt-4">Business figures are projections</h2>
            <p className={`mt-3 ${muted}`}>The financial section is a project forecast, not audited operating history. Pricing, adoption and profit figures are presented as the assumptions used in the report and may change as Nomou develops.</p>
          </div>
          <div className={`p-7 rounded-3xl border ${card}`}>
            <ShieldCheck className="text-green-primary"/>
            <h2 className="text-xl font-black mt-4">Screening, not a certified lab result</h2>
            <p className={`mt-3 ${muted}`}>The report itself states that Nomou should be described as a screening and monitoring tool, not a replacement for official laboratory testing or certified agricultural consultation.</p>
          </div>
        </div>
      </div>
    </section>

    <section className={`py-20 px-4 sm:px-6 ${isDark?'bg-[#0d1f12]':'bg-[#E8F5E9]'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3"><Cpu className="text-green-primary"/><h2 className="text-3xl font-black">Current Nomou V2 implementation note</h2></div>
        <p className={`mt-4 max-w-3xl leading-relaxed ${muted}`}>The June 2026 report records the project architecture as it existed at that stage. The current Nomou V2 prototype has since evolved. The current node and app use ESP32-C3-based sensing, live cloud APIs, Soil Passport intelligence, Guardian plant scanning and the newer V2 sensor suite shown on the Technology page.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-7">
          {['Soil moisture','DS18B20 root temperature','BMP280 pressure','DHT11 temperature/humidity','SCD40 CO₂/temp/humidity','LDR light','Fermion MEMS NH₃','TDS','pH/electrode channel','UV'].map(x=><div key={x} className={`flex items-center gap-2 p-3 rounded-xl border ${card}`}><CheckCircle size={15} className="text-green-primary"/><span className="text-sm">{x}</span></div>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/technology" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-primary text-white font-bold">Current V2 technology <ArrowRight size={15}/></Link>
          <Link to="/research" className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border font-bold ${card}`}>Research & references <ArrowRight size={15}/></Link>
        </div>
      </div>
    </section>
  </div>;
}