import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function StrategicEcosystemPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  return (
    <div className="space-y-12 pb-20">
      <SectionHeader title="Strategic Solution Architecture" subtitle="Define pillars, connectivity, and hierarchy" stepNumber={currentStep + 1} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1">
          <LabelPremium>Strategic Approach</LabelPremium>
          <Textarea className="min-h-[120px] bg-white border-slate-200 rounded-3xl p-5 font-medium" placeholder="Describe the core transformation strategy..." value={proposal.solution.approach} onChange={(e) => updateSolution({ approach: e.target.value })} />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <LabelPremium>Connectivity Hub</LabelPremium>
            <button type="button" onClick={() => updateSolution({ integrations: [...(proposal.solution.integrations || []), ""] })} className="text-[10px] font-black uppercase text-blue-600 hover:underline">+ Add Link / API</button>
          </div>
          <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] space-y-3">
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Active System Nodes & Integrations</p>
            <div className="space-y-2">
              {(proposal.solution.integrations || []).map((link, i) => (
                <div key={i} className="flex gap-2">
                  <Input 
                    className="h-12 bg-white border-blue-100 rounded-xl font-bold text-blue-600" 
                    placeholder="e.g. CRM Integration | https://api.crm.com" 
                    value={link} 
                    onChange={(e) => {
                      const next = [...(proposal.solution.integrations || [])];
                      next[i] = e.target.value;
                      updateSolution({ integrations: next });
                    }} 
                  />
                  <button type="button" onClick={() => updateSolution({ integrations: proposal.solution.integrations.filter((_, idx) => idx !== i) })} className="px-3 text-red-400 font-black hover:text-red-600 transition-colors">×</button>
                </div>
              ))}
              {(proposal.solution.integrations?.length === 0 || !proposal.solution.integrations) && (
                <div className="text-[10px] text-blue-300 italic font-medium uppercase tracking-widest text-center py-4">No active connectivity nodes defined.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <LabelPremium>Implementation Pillars</LabelPremium>
          <button type="button" onClick={() => updateSolution({ approachPoints: [...(proposal.solution.approachPoints || []), ""] })} className="text-[10px] font-black uppercase text-primary hover:underline">+ Add Pillar</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(proposal.solution.approachPoints || []).map((point: string, i: number) => (
            <div key={i} className="flex gap-2 group">
              <Input className="h-14 bg-white border-slate-200 rounded-2xl group-hover:border-primary/30 transition-colors" placeholder={`Strategic Pillar 0${i+1}`} value={point} onChange={(e) => {
                const next = [...(proposal.solution.approachPoints || [])];
                next[i] = e.target.value;
                updateSolution({ approachPoints: next });
              }} />
              <button type="button" onClick={() => updateSolution({ approachPoints: proposal.solution.approachPoints.filter((_: string, idx: number) => idx !== i) })} className="px-4 text-slate-300 hover:text-red-500 transition-colors font-black">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* User Hierarchy Strategic Section */}
      <div className="space-y-8 border-t-2 border-slate-100 pt-12">
        <div className="flex justify-between items-end px-2">
          <div className="space-y-1">
            <LabelPremium>User Access Hierarchy</LabelPremium>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Define system authority nodes & responsibilities</p>
          </div>
          <Button 
            onClick={() => updateSolution({ userRoles: [...(proposal.solution.userRoles || []), "New Strategic Role|Define access permissions..."] })} 
            className="bg-slate-900 hover:bg-black text-white rounded-2xl px-6 h-10 text-[9px] font-black uppercase tracking-widest shadow-lg"
          >
            + Add Access Node
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"]).map((roleStr, rIdx) => {
            const [title, desc] = (roleStr || "|").split("|");
            return (
              <div key={rIdx} className="group relative bg-white border-2 border-slate-100 hover:border-slate-300 rounded-[2.5rem] p-8 transition-all duration-300">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-black italic shadow-lg border-2 border-white">
                  0{rIdx + 1}
                </div>
                
                <div className="space-y-4">
                  <Input 
                    className="h-12 bg-slate-50/50 border-transparent focus:bg-white focus:border-slate-200 rounded-xl font-black uppercase tracking-tight text-slate-900" 
                    placeholder="Role Title" 
                    value={title} 
                    onChange={(e) => {
                      const next = [...(proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"])];
                      next[rIdx] = `${e.target.value}|${desc}`;
                      updateSolution({ userRoles: next });
                    }}
                  />
                  <Textarea 
                    className="bg-slate-50/50 border-transparent focus:bg-white focus:border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 min-h-[70px]" 
                    placeholder="Responsibilities..." 
                    value={desc} 
                    onChange={(e) => {
                      const next = [...(proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"])];
                      next[rIdx] = `${title}|${e.target.value}`;
                      updateSolution({ userRoles: next });
                    }}
                  />
                </div>

                <button 
                  onClick={() => updateSolution({ userRoles: (proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"]).filter((_: string, i: number) => i !== rIdx) })} 
                  className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
