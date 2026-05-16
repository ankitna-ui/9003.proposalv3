import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, Zap, Clock, Target, ArrowUpRight } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function StrategicROIPanel({ proposal, currentStep, updateROI }: InputPanelProps) {

  // 🧠 NEURAL ROI ENGINE: Minimizing user input via smart estimation
  useEffect(() => {
    const rev = parseFloat(proposal.roi.revenueIncrease) || 0;
    const manualHrs = parseFloat(proposal.roi.manualHoursPerMonth) || 160;
    const hourlyRate = parseFloat(proposal.roi.hourlyRate) || 500;
    
    // Auto-calculate dependencies
    const estimatedCostSaving = Math.round((manualHrs * hourlyRate * 0.7) / 1000); // K-INR
    const estimatedProfitImpact = Math.round((rev * 5000) + (estimatedCostSaving * 12)); 
    const estimatedProductivity = Math.round(30 + (manualHrs / 20));
    
    // Update ROI Object if values are missing or need syncing
    const updates: Partial<typeof proposal.roi> = {};
    
    if (!proposal.roi.costReduction) updates.costReduction = "25";
    if (!proposal.roi.productivityIncrease) updates.productivityIncrease = String(estimatedProductivity);
    if (!proposal.roi.timeSaving) updates.timeSaving = String(Math.round(manualHrs * 0.85));
    if (!proposal.roi.expectedROI || proposal.roi.expectedROI === "0") {
      updates.expectedROI = String(Math.round(35 + (rev * 1.5) + (manualHrs / 10)));
    }
    if (!proposal.roi.profitImpact || proposal.roi.profitImpact.includes("12,500")) {
      updates.profitImpact = `₹${(estimatedProfitImpact * 100).toLocaleString("en-IN")}`;
    }
    if (!proposal.roi.breakEven) updates.breakEven = "4-6 Months";
    if (!proposal.roi.growthFactor) updates.growthFactor = "Exponential";

    if (Object.keys(updates).length > 0) {
      updateROI(updates);
    }
  }, [proposal.roi.revenueIncrease, proposal.roi.manualHoursPerMonth, proposal.roi.hourlyRate]);

  return (
    <div className="space-y-8 pb-10">
      <SectionHeader 
        title="Strategic ROI Engine" 
        subtitle="Define the impact metrics to calculate project yield" 
        stepNumber={currentStep + 1} 
      />

      {/* ──── IMPACT MATRIX (MAIN INPUTS) ──── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Revenue Growth</span>
          </div>
          <div className="relative">
            <Input 
              type="number"
              className="h-12 bg-white border-emerald-200 pr-10 font-black rounded-xl" 
              placeholder="0"
              value={proposal.roi.revenueIncrease} 
              onChange={(e) => updateROI({ revenueIncrease: e.target.value })} 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 font-black">%</span>
          </div>
        </div>

        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <Target size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Cost Reduction</span>
          </div>
          <div className="relative">
            <Input 
              type="number"
              className="h-12 bg-white border-blue-200 pr-10 font-black rounded-xl" 
              placeholder="0"
              value={proposal.roi.costReduction} 
              onChange={(e) => updateROI({ costReduction: e.target.value })} 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 font-black">%</span>
          </div>
        </div>

        <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <Zap size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Productivity</span>
          </div>
          <div className="relative">
            <Input 
              type="number"
              className="h-12 bg-white border-amber-200 pr-10 font-black rounded-xl" 
              placeholder="0"
              value={proposal.roi.productivityIncrease} 
              onChange={(e) => updateROI({ productivityIncrease: e.target.value })} 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 font-black">%</span>
          </div>
        </div>
      </div>

      {/* ──── RESULT DASHBOARD ──── */}
      <div className="p-8 bg-[#0B0E14] rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
          <TrendingUp size={120} className="text-primary" />
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-10">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-primary">
                <ArrowUpRight size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Projected ROI</span>
             </div>
             <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter">{proposal.roi.expectedROI || "0"}</span>
                <span className="text-2xl font-black text-primary">%</span>
             </div>
          </div>
          <div className="space-y-6 flex flex-col justify-center">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                   <Clock size={20} />
                </div>
                <div>
                   <div className="text-[8px] font-black uppercase tracking-widest text-white/30">Break-even</div>
                   <div className="text-sm font-black tracking-tight">{proposal.roi.breakEven}</div>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                   <TrendingUp size={20} />
                </div>
                <div>
                   <div className="text-[8px] font-black uppercase tracking-widest text-white/30">Growth Factor</div>
                   <div className="text-sm font-black tracking-tight">{proposal.roi.growthFactor}</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ──── REAL-WORLD OPERATIONAL DATA ──── */}
      <div className="p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-[2px] bg-[#99CB48]" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Operational Reality Check</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <LabelPremium>Current Manual Inefficiency</LabelPremium>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase text-slate-400 pl-1">Manual Hrs / Mo</p>
                <Input 
                  type="number" 
                  className="h-14 bg-white border-slate-200 rounded-2xl font-black text-slate-900" 
                  placeholder="e.g. 160" 
                  value={proposal.roi.manualHoursPerMonth || ""} 
                  onChange={(e) => updateROI({ manualHoursPerMonth: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase text-slate-400 pl-1">Avg Hourly Rate (₹)</p>
                <Input 
                  type="number" 
                  className="h-14 bg-white border-slate-200 rounded-2xl font-black text-[#99CB48]" 
                  placeholder="e.g. 500" 
                  value={proposal.roi.hourlyRate || ""} 
                  onChange={(e) => updateROI({ hourlyRate: e.target.value })} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <LabelPremium>Financial Overheads</LabelPremium>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase text-slate-400 pl-1">Current Monthly Ops Cost</p>
                <Input 
                  type="number" 
                  className="h-14 bg-white border-slate-200 rounded-2xl font-black text-slate-900" 
                  placeholder="₹ 50,000" 
                  value={proposal.roi.currentOpsCost || ""} 
                  onChange={(e) => updateROI({ currentOpsCost: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase text-slate-400 pl-1">Revenue Leakage (%)</p>
                <Input 
                  type="number" 
                  className="h-14 bg-white border-slate-200 rounded-2xl font-black text-red-400" 
                  placeholder="e.g. 10" 
                  value={proposal.roi.revenueIncrease || ""} 
                  onChange={(e) => updateROI({ revenueIncrease: e.target.value })} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
             * These numbers will automatically drive the **Strategic Comparison Matrix** in the final PDF output, providing the client with a mathematically sound justification for the investment.
           </p>
        </div>
      </div>

      {/* ──── STRATEGIC NARRATIVE ──── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-4">
           <LabelPremium>Impact Summary & Growth Strategy</LabelPremium>
           <div className="text-[9px] font-black uppercase text-[#99CB48] bg-[#99CB48]/10 px-3 py-1 rounded-full">Executive Vision</div>
        </div>
        <Textarea 
          className="min-h-[140px] bg-slate-50 border-slate-200 rounded-[2.5rem] p-8 text-sm font-medium leading-relaxed shadow-inner" 
          placeholder="Summarize the tangible business transformation. E.g., 'This implementation will recover 2,400 manual hours annually, redirecting focus to high-value strategic growth...'" 
          value={proposal.roi.impactSummary} 
          onChange={(e) => updateROI({ impactSummary: e.target.value })} 
        />
      </div>
    </div>
  );
}
