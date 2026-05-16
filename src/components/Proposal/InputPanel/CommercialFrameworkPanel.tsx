import { useMemo } from "react";
import { CreditCard, Percent, Receipt, ShieldCheck, Plus, Trash2, Calculator, Server, BarChart3 } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea } from "./shared";
import { Button } from "@/components/ui/button";

export default function CommercialFrameworkPanel({ proposal, currentStep, updatePricing }: InputPanelProps) {
  
  const stats = useMemo(() => {
    const base = parseFloat(proposal.pricing.coreValuation) || 0;
    const discPct = parseFloat(proposal.pricing.discountPercentage) || 0;
    const taxPct = parseFloat(proposal.pricing.taxRate) || 18;
    
    const discAmt = base * (discPct / 100);
    const subtotal = base - discAmt;
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
    <div className="space-y-12 pb-20">
      <SectionHeader 
        title="Commercial Alignment" 
        subtitle="Configure the investment framework and structured financial roadmap" 
        stepNumber={currentStep + 1} 
      />

      {/* ──── VALUATION MATRIX ──── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Project Valuation (Base)</LabelPremium>
            <CreditCard size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <div className="relative">
             <ModernInput 
               type="number" 
               className="pl-12 text-xl font-black text-slate-900" 
               placeholder="₹ 0,00,000"
               value={proposal.pricing.coreValuation} 
               onChange={(e) => updatePricing({ coreValuation: e.target.value })} 
             />
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
          </div>
        </div>

        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Strategic Discount</LabelPremium>
            <Percent size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <div className="relative">
             <ModernInput 
               type="number" 
               className="pr-12 font-black text-emerald-600" 
               placeholder="0"
               value={proposal.pricing.discountPercentage} 
               onChange={(e) => updatePricing({ discountPercentage: e.target.value })} 
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 font-black">%</span>
          </div>
        </div>
      </div>

      {/* ──── CALCULATION ENGINE (PREMIUM DARK) ──── */}
      <div className="p-12 bg-[#0B0E14] rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 scale-150">
            <Calculator size={160} className="text-primary" />
         </div>
         
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="flex items-center gap-3 text-primary">
                  <div className="w-10 h-[2px] bg-primary" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">Investment Synthesis</span>
               </div>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                     <span className="text-white/40 font-black uppercase tracking-widest text-[10px]">Gross Valuation</span>
                     <span className="font-black text-white/90">{formatINR(stats.base)}</span>
                  </div>
                  {stats.discAmt > 0 && (
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                       <span className="text-emerald-400/40 font-black uppercase tracking-widest text-[10px]">Strategic Relief ({stats.discPct}%)</span>
                       <span className="font-black text-emerald-400">- {formatINR(stats.discAmt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                     <span className="text-white/40 font-black uppercase tracking-widest text-[10px]">Current Tax (GST)</span>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-white/20">RATE</span>
                        <input 
                           type="number" 
                           className="w-12 bg-white/5 border border-white/10 rounded-lg text-center text-[10px] font-black py-1 focus:outline-none focus:border-primary/40" 
                           value={proposal.pricing.taxRate || 18} 
                           onChange={(e) => updatePricing({ taxRate: e.target.value })}
                        />
                        <span className="text-[10px] font-black text-white/20">%</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col justify-end">
               <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-3">Net Capital Commitment</div>
                  <div className="flex items-baseline gap-3">
                     <div className="text-5xl font-black tracking-tighter text-white">{formatINR(stats.total)}</div>
                     <div className="text-xs font-black text-white/30 uppercase tracking-widest">+ GST Extra</div>
                  </div>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mt-6 leading-relaxed">
                     * Final valuation subject to milestone alignment and service level specifications.
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* ──── SUPPORTING OVERHEADS ──── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Infrastructure (Cloud)</LabelPremium>
            <Server size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <ModernInput 
            className="font-bold text-slate-600" 
            placeholder="e.g. Billed at Actuals / Monthly"
            value={proposal.pricing.hostingCost} 
            onChange={(e) => updatePricing({ hostingCost: e.target.value })} 
          />
        </div>
        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Maintenance Protocol</LabelPremium>
            <ShieldCheck size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <ModernInput 
            className="font-bold text-slate-600" 
            placeholder="e.g. 15% Annual Post-Warranty"
            value={proposal.pricing.maintenanceCost} 
            onChange={(e) => updatePricing({ maintenanceCost: e.target.value })} 
          />
        </div>
      </div>

      {/* ──── MILESTONE ROADMAP ──── */}
      <div className="space-y-8 bg-slate-50/50 p-12 rounded-[3.5rem] border border-slate-100 shadow-inner">
        <div className="flex justify-between items-center px-4">
           <div className="space-y-1">
              <LabelPremium className="mb-0 text-slate-900">Investment Roadmap</LabelPremium>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Defined Payment Milestones & Deliverables</p>
           </div>
           <button 
             onClick={addMilestone} 
             className="text-[11px] font-black uppercase text-primary hover:text-white hover:bg-primary px-8 py-2.5 border border-primary/20 rounded-2xl transition-all shadow-sm hover:shadow-primary/20 bg-white"
           >
             + Add Milestone
           </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
           {proposal.pricing.milestones?.map((m: any, i: number) => (
             <div key={i} className="relative group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl flex gap-8 items-start">
                <div className="w-16 h-16 bg-[#0B0E14] rounded-2xl flex items-center justify-center font-black text-white text-xl italic shrink-0 shadow-lg -rotate-3 group-hover:rotate-0 transition-transform">
                   {String(i + 1).padStart(2, '0')}
                </div>
                
                <div className="flex-1 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-9 space-y-4">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest pl-1">Milestone Phase</p>
                            <ModernInput 
                              className="bg-slate-50/50 border-none font-black text-slate-900 p-0 h-auto text-lg focus:bg-white" 
                              placeholder="e.g. System Blueprint & Initiation"
                              value={m.name} 
                              onChange={(e) => updateMilestone(i, { name: e.target.value })} 
                            />
                         </div>
                         <ModernTextArea 
                           className="bg-slate-50/50 border-none text-[13px] font-medium text-slate-500 p-4 min-h-[80px] focus:bg-white" 
                           placeholder="Describe the scope and delivery logic for this phase..."
                           value={m.description} 
                           onChange={(e) => updateMilestone(i, { description: e.target.value })} 
                         />
                      </div>
                      <div className="md:col-span-3">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest pl-1">Allocation (%)</p>
                            <div className="relative">
                               <ModernInput 
                                 type="number"
                                 className="bg-slate-50/50 border-none font-black text-primary text-2xl text-center py-6 focus:bg-white" 
                                 value={m.percentage} 
                                 onChange={(e) => updateMilestone(i, { percentage: e.target.value })} 
                               />
                               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 font-black">%</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => removeMilestone(i)} 
                  className="absolute top-8 right-8 p-2.5 bg-red-50 rounded-xl text-red-300 hover:text-red-500 hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100 border border-red-100/50"
                >
                   <Trash2 size={18} />
                </button>
             </div>
           ))}
        </div>
      </div>

      {/* ──── ROI LOGIC ──── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-6">
           <LabelPremium className="mb-0 text-slate-900">ROI Settlement Protocol</LabelPremium>
           <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">Financial Logic</span>
        </div>
        <ModernTextArea 
          className="min-h-[140px] p-10 text-base font-bold text-slate-600 leading-relaxed rounded-[3rem]" 
          placeholder="Clarify the settlement logic. E.g., 'Payment for each phase is due upon successful deployment to the staging environment and client protocol sign-off...'" 
          value={proposal.pricing.roiLogic} 
          onChange={(e) => updatePricing({ roiLogic: e.target.value })} 
        />
      </div>
    </div>
  );
}
