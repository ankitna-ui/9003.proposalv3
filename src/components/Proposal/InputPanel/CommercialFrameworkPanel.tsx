import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreditCard, Percent, Receipt, ShieldCheck, Plus, Trash2, Calculator, Server } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function CommercialFrameworkPanel({ proposal, currentStep, updatePricing }: InputPanelProps) {
  
  // Real-time calculation for the dashboard (Updated as per user request)
  const stats = useMemo(() => {
    const base = parseFloat(proposal.pricing.coreValuation) || 0;
    const discPct = parseFloat(proposal.pricing.discountPercentage) || 0;
    const taxPct = parseFloat(proposal.pricing.taxRate) || 18;
    
    const discAmt = base * (discPct / 100);
    const subtotal = base - discAmt;
    
    // Total is now same as subtotal because GST is EXTRA
    const total = subtotal; 
    
    return { base, discPct, discAmt, subtotal, taxPct, total };
  }, [proposal.pricing.coreValuation, proposal.pricing.discountPercentage, proposal.pricing.taxRate]);

  const addMilestone = () => {
    const milestones = proposal.pricing.milestones || [];
    updatePricing({
      milestones: [...milestones, { name: "New Milestone", percentage: 0, description: "" }]
    });
  };

  const removeMilestone = (idx: number) => {
    const milestones = proposal.pricing.milestones.filter((_: any, i: number) => i !== idx);
    updatePricing({ milestones });
  };

  const updateMilestone = (idx: number, data: any) => {
    const milestones = [...proposal.pricing.milestones];
    milestones[idx] = { ...milestones[idx], ...data };
    updatePricing({ milestones });
  };

  const formatINR = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-8 pb-20">
      <SectionHeader 
        title="Financial Alignment" 
        subtitle="Configure the commercial framework and investment roadmap" 
        stepNumber={currentStep + 1} 
      />

      {/* ──── CORE VALUATION & DISCOUNT ──── */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Base Valuation (₹)</LabelPremium>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="number" 
              className="h-14 bg-white border-slate-200 pl-12 font-black rounded-2xl text-lg" 
              value={proposal.pricing.coreValuation} 
              onChange={(e) => updatePricing({ coreValuation: e.target.value })} 
            />
          </div>
        </div>
        <div className="space-y-1">
          <LabelPremium>Discount (%)</LabelPremium>
          <div className="relative">
            <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="number" 
              className="h-14 bg-white border-slate-200 pl-12 font-black rounded-2xl" 
              value={proposal.pricing.discountPercentage} 
              onChange={(e) => updatePricing({ discountPercentage: e.target.value })} 
            />
          </div>
        </div>
      </div>

      {/* ──── LIVE CALCULATION DASHBOARD ──── */}
      <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border-b-[6px] border-primary">
         <div className="absolute top-0 right-0 p-6 opacity-5 -rotate-12">
            <Calculator size={140} />
         </div>
         
         <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-white/40">
               <span>Investment Protocol</span>
               <span className="text-primary italic">GST Extra Mode</span>
            </div>
            
            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 font-bold">List Price</span>
                  <span className="font-black">{formatINR(stats.base)}</span>
               </div>
               {stats.discAmt > 0 && (
                 <div className="flex justify-between items-center text-sm text-primary">
                    <span className="font-bold">Discount Applied ({stats.discPct}%)</span>
                    <span className="font-black">- {formatINR(stats.discAmt)}</span>
                 </div>
               )}
            </div>

            <div className="pt-6 border-t border-white/10">
               <div className="flex justify-between items-end">
                  <div>
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Net Strategic Investment</div>
                     <div className="text-4xl font-black tracking-tighter">{formatINR(stats.total)}</div>
                     <div className="text-[10px] font-black text-white/40 mt-2">*{stats.taxPct}% GST Extra Applicable</div>
                  </div>
                  <div className="text-right">
                     <div className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Tax Rate</div>
                     <Input 
                        type="number" 
                        className="w-16 h-8 bg-white/5 border-white/10 rounded-lg text-center text-[10px] font-black p-0" 
                        value={proposal.pricing.taxRate || 18} 
                        onChange={(e) => updatePricing({ taxRate: e.target.value })}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* ──── INFRASTRUCTURE & SUPPORT ──── */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <LabelPremium>Cloud Infrastructure</LabelPremium>
          <div className="relative">
            <Server className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              className="h-12 bg-slate-50 border-slate-200 pl-10 rounded-xl text-xs font-bold" 
              placeholder="e.g. At Actuals"
              value={proposal.pricing.hostingCost} 
              onChange={(e) => updatePricing({ hostingCost: e.target.value })} 
            />
          </div>
        </div>
        <div className="space-y-3">
          <LabelPremium>Maintenance / SLA</LabelPremium>
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              className="h-12 bg-slate-50 border-slate-200 pl-10 rounded-xl text-xs font-bold" 
              placeholder="e.g. SLA-1"
              value={proposal.pricing.maintenanceCost} 
              onChange={(e) => updatePricing({ maintenanceCost: e.target.value })} 
            />
          </div>
        </div>
      </div>

      {/* ──── MILESTONE MANAGER ──── */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <LabelPremium>Payment Roadmap (Milestones)</LabelPremium>
           <Button variant="ghost" onClick={addMilestone} className="text-[10px] font-black uppercase text-primary hover:bg-primary/5">
             <Plus size={14} className="mr-1" /> Add Milestone
           </Button>
        </div>
        <div className="space-y-4">
           {proposal.pricing.milestones?.map((m: any, i: number) => (
             <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex gap-4 items-start group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 shrink-0">
                   {i + 1}
                </div>
                <div className="flex-1 grid grid-cols-12 gap-4">
                   <div className="col-span-8">
                      <Input 
                        className="bg-transparent border-none p-0 h-auto font-black uppercase text-slate-800 focus-visible:ring-0" 
                        value={m.name} 
                        onChange={(e) => updateMilestone(i, { name: e.target.value })} 
                      />
                      <Input 
                        className="bg-transparent border-none p-0 h-auto text-[10px] font-bold text-slate-400 focus-visible:ring-0 mt-1" 
                        placeholder="Description..."
                        value={m.description} 
                        onChange={(e) => updateMilestone(i, { description: e.target.value })} 
                      />
                   </div>
                   <div className="col-span-4 flex items-center gap-2">
                      <div className="relative w-full">
                         <Input 
                           type="number"
                           className="h-10 bg-slate-50 border-slate-200 pr-8 font-black rounded-xl text-right" 
                           value={m.percentage} 
                           onChange={(e) => updateMilestone(i, { percentage: e.target.value })} 
                         />
                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">%</span>
                      </div>
                      <button onClick={() => removeMilestone(i)} className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* ──── SETTLEMENT NARRATIVE ──── */}
      <div className="space-y-3">
        <LabelPremium>ROI Settlement Protocol</LabelPremium>
        <Textarea 
          className="min-h-[100px] bg-slate-50 border-slate-200 rounded-[2rem] p-6 text-sm font-medium leading-relaxed" 
          placeholder="Describe how the investment is settled..." 
          value={proposal.pricing.roiLogic} 
          onChange={(e) => updatePricing({ roiLogic: e.target.value })} 
        />
      </div>
    </div>
  );
}
