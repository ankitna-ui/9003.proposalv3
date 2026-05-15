import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, Zap, Clock, Target, ArrowUpRight } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function StrategicROIPanel({ proposal, currentStep, updateROI }: InputPanelProps) {

  // Simple auto-calculation logic for rapid data entry
  useEffect(() => {
    const rev = parseFloat(proposal.roi.revenueIncrease) || 0;
    const cost = parseFloat(proposal.roi.costReduction) || 0;
    const prod = parseFloat(proposal.roi.productivityIncrease) || 0;
    
    if (rev > 0 || cost > 0 || prod > 0) {
      const simpleROI = Math.round((rev + cost + (prod * 0.5)) * 1.5);
      
      if (proposal.roi.expectedROI !== String(simpleROI)) {
        updateROI({ 
          expectedROI: String(simpleROI),
          profitImpact: `₹${((rev + cost) * 500).toLocaleString("en-IN")}`, // Estimated impact
          timeSaving: String(Math.round(prod * 1.2)), // Estimated hours
          breakEven: "4-6 Months",
          growthFactor: "Exponential"
        });
      }
    }
  }, [proposal.roi.revenueIncrease, proposal.roi.costReduction, proposal.roi.productivityIncrease]);

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

      {/* ──── STRATEGIC NARRATIVE ──── */}
      <div className="space-y-3">
        <LabelPremium>Impact Narrative</LabelPremium>
        <Textarea 
          className="min-h-[120px] bg-slate-50 border-slate-200 rounded-[2rem] p-6 text-sm font-medium leading-relaxed" 
          placeholder="Describe the long-term strategic impact on the business..." 
          value={proposal.roi.impactSummary} 
          onChange={(e) => updateROI({ impactSummary: e.target.value })} 
        />
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-4">
          Tip: Focus on scalability and operational excellence.
        </p>
      </div>
    </div>
  );
}
