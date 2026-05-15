import { Input } from "@/components/ui/input";
import { Monitor, Link2, Tag, Layout } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function PortfolioProtocolPanel({ proposal, currentStep, updateExperience }: InputPanelProps) {
  
  const updateProject = (idx: number, field: 'title' | 'url' | 'category', value: string) => {
    const next = [...proposal.experience.portfolioLinks];
    const current = next[idx] || "||";
    const parts = current.split('|');
    
    if (field === 'title') parts[0] = value;
    if (field === 'url') parts[1] = value;
    if (field === 'category') parts[2] = value;
    
    next[idx] = parts.join('|');
    updateExperience({ portfolioLinks: next });
  };

  const getProjectValue = (idx: number, partIdx: number) => {
    const current = proposal.experience.portfolioLinks[idx] || "||";
    return current.split('|')[partIdx] || "";
  };

  return (
    <div className="space-y-8 pb-10">
      <SectionHeader 
        title="Success Protocol" 
        subtitle="Curate your high-impact project portfolio and live deployments" 
        stepNumber={currentStep + 1} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-4 hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-black">
                     0{idx + 1}
                  </div>
                  <LabelPremium>Case Study Protocol</LabelPremium>
               </div>
               <Monitor size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>

            <div className="space-y-3">
               <div className="relative">
                  <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <Input 
                    className="h-10 bg-slate-50 border-slate-100 pl-10 rounded-xl text-xs font-bold" 
                    placeholder="Project Title (e.g. Enterprise ERP)"
                    value={getProjectValue(idx, 0)} 
                    onChange={(e) => updateProject(idx, 'title', e.target.value)} 
                  />
               </div>
               <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <Input 
                    className="h-10 bg-slate-50 border-slate-100 pl-10 rounded-xl text-xs font-bold" 
                    placeholder="Live URL (e.g. app.domain.com)"
                    value={getProjectValue(idx, 1)} 
                    onChange={(e) => updateProject(idx, 'url', e.target.value)} 
                  />
               </div>
               <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <Input 
                    className="h-10 bg-slate-50 border-slate-100 pl-10 rounded-xl text-xs font-bold" 
                    placeholder="Category (e.g. Industrial SaaS)"
                    value={getProjectValue(idx, 2)} 
                    onChange={(e) => updateProject(idx, 'category', e.target.value)} 
                  />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between overflow-hidden relative">
         <div className="absolute top-0 right-0 p-4 opacity-5">
            <Monitor size={80} />
         </div>
         <div className="relative z-10 flex items-center gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#3ABEF9]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Protocol Verified</p>
         </div>
         <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Network Node: LIVE-WBL-2024</span>
      </div>
    </div>
  );
}
