import { useEffect } from "react";
import { TrendingUp, Zap, Clock, Target, ArrowUpRight, BarChart3, PieChart, ShieldCheck } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea } from "./shared";

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
    <div className="space-y-10 pb-10">
      <SectionHeader 
        title="Impact & Yield Analytics" 
        subtitle="Quantify the strategic dividends and mathematical justification of the transformation" 
        stepNumber={currentStep + 1} 
      />

      {/* ──── IMPACT MATRIX ──── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50 space-y-3 hover:shadow-xl transition-all duration-500 group">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
               <TrendingUp size={18} />
            </div>
            <BarChart3 size={14} className="text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-1.5">
            <LabelPremium className="mb-0 text-emerald-900 text-[8px]">Revenue Growth</LabelPremium>
            <div className="relative">
              <ModernInput 
                type="number"
                className="h-12 pl-4 pr-10 text-sm font-bold text-emerald-700 border-emerald-100 focus-visible:ring-emerald-500 rounded-xl" 
                placeholder="0"
                value={proposal.roi.revenueIncrease} 
                onChange={(e) => updateROI({ revenueIncrease: e.target.value })} 
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">%</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 space-y-3 hover:shadow-xl transition-all duration-500 group">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500">
               <Target size={18} />
            </div>
            <PieChart size={14} className="text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-1.5">
            <LabelPremium className="mb-0 text-blue-900 text-[8px]">Cost Reduction</LabelPremium>
            <div className="relative">
              <ModernInput 
                type="number"
                className="h-12 pl-4 pr-10 text-sm font-bold text-blue-700 border-blue-100 focus-visible:ring-blue-500 rounded-xl" 
                placeholder="0"
                value={proposal.roi.costReduction} 
                onChange={(e) => updateROI({ costReduction: e.target.value })} 
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-sm">%</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100/50 space-y-3 hover:shadow-xl transition-all duration-500 group">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500">
               <Zap size={18} />
            </div>
            <Zap size={14} className="text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity fill-amber-300" />
          </div>
          <div className="space-y-1.5">
            <LabelPremium className="mb-0 text-amber-900 text-[8px]">Productivity Delta</LabelPremium>
            <div className="relative">
              <ModernInput 
                type="number"
                className="h-12 pl-4 pr-10 text-sm font-bold text-amber-700 border-amber-100 focus-visible:ring-amber-500 rounded-xl" 
                placeholder="0"
                value={proposal.roi.productivityIncrease} 
                onChange={(e) => updateROI({ productivityIncrease: e.target.value })} 
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ──── RESULT DASHBOARD (PREMIUM DARK) ──── */}
      <div className="p-10 bg-[#0B0E14] rounded-[3rem] text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-150 pointer-events-none">
          <BarChart3 size={200} className="text-primary" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 min-w-0">
             <div className="flex items-center gap-3 text-primary">
                <div className="w-8 h-[2px] bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Projected Yield Profile</span>
             </div>
             <div className="min-h-[80px] flex items-center">
               {(() => {
                  const expectedVal = proposal.roi.expectedROI || "0";
                  const isNumeric = /^\d+$/.test(expectedVal.trim());
                  if (isNumeric) {
                     return (
                        <div className="flex items-baseline gap-2">
                           <span className="text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 leading-none">{expectedVal}</span>
                           <span className="text-3xl font-black text-primary leading-none">%</span>
                        </div>
                     );
                  } else {
                     return (
                        <div className="flex items-baseline py-2">
                           <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 leading-tight pr-2">
                              {expectedVal}
                           </span>
                        </div>
                     );
                  }
               })()}
             </div>
             <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-normal">Aggregated Strategic Return on Investment</p>
          </div>
          
          <div className="flex flex-col justify-center space-y-6 md:border-l md:border-white/5 md:pl-8">
             <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#0B0E14] transition-all duration-500 shadow-lg shrink-0">
                   <Clock size={20} />
                </div>
                <div className="min-w-0">
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-0.5">Amortization Period</div>
                   <div className="text-lg font-black tracking-tight text-white/90 truncate">{proposal.roi.breakEven}</div>
                </div>
             </div>
             <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-[#0B0E14] transition-all duration-500 shadow-lg shrink-0">
                   <TrendingUp size={20} />
                </div>
                <div className="min-w-0">
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-0.5">Growth Trajectory</div>
                   <div className="text-lg font-black tracking-tight text-white/90 truncate">{proposal.roi.growthFactor}</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ──── OPERATIONAL REALITY ──── */}
      <div className="p-12 bg-white border border-slate-100 rounded-[3.5rem] space-y-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-primary shadow-xl">
             <BarChart3 size={20} />
          </div>
          <div>
             <span className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900">Mathematical Constants</span>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Foundational data for ROI synthesis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <LabelPremium className="mb-0 text-slate-900">Inefficiency Payload</LabelPremium>
               <div className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-3 py-1 rounded-full">Cost Leakage</div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Manual Hrs / Mo</p>
                <ModernInput 
                  type="number" 
                  className="bg-slate-50 border-none font-black" 
                  placeholder="e.g. 160" 
                  value={proposal.roi.manualHoursPerMonth || ""} 
                  onChange={(e) => updateROI({ manualHoursPerMonth: e.target.value })} 
                />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hourly Rate (₹)</p>
                <ModernInput 
                  type="number" 
                  className="bg-slate-50 border-none font-black text-primary" 
                  placeholder="e.g. 500" 
                  value={proposal.roi.hourlyRate || ""} 
                  onChange={(e) => updateROI({ hourlyRate: e.target.value })} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <LabelPremium className="mb-0 text-slate-900">Financial Overhead</LabelPremium>
               <div className="text-[9px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1 rounded-full">Ops Burden</div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Monthly Ops Cost</p>
                <ModernInput 
                  type="number" 
                  className="bg-slate-50 border-none font-black" 
                  placeholder="₹ 50k" 
                  value={proposal.roi.currentOpsCost || ""} 
                  onChange={(e) => updateROI({ currentOpsCost: e.target.value })} 
                />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Revenue Leak (%)</p>
                <ModernInput 
                  type="number" 
                  className="bg-slate-50 border-none font-black text-red-400" 
                  placeholder="e.g. 15" 
                  value={proposal.roi.revenueIncrease || ""} 
                  onChange={(e) => updateROI({ revenueIncrease: e.target.value })} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex items-center gap-4">
           <ShieldCheck size={18} className="text-primary" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
             This analytical core drives the **Strategic Comparison Matrix** in the final output, providing a mathematically sound justification for the ecosystem investment.
           </p>
        </div>
      </div>

      {/* ──── EXECUTIVE SUMMARY ──── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-6">
           <LabelPremium className="mb-0 text-slate-900">Strategic Impact Synthesis</LabelPremium>
           <span className="text-[9px] font-black uppercase text-primary border border-primary/20 px-4 py-1.5 rounded-full shadow-sm bg-white">Executive Narrative</span>
        </div>
        <ModernTextArea 
          className="min-h-[160px] p-10 text-base font-bold text-slate-600 leading-relaxed rounded-[3rem]" 
          placeholder="Synthesize the tangible business transformation. E.g., 'This implementation will recover 2,400 manual hours annually, redirecting workforce focus to high-value strategic growth initiatives...'" 
          value={proposal.roi.impactSummary} 
          onChange={(e) => updateROI({ impactSummary: e.target.value })} 
        />
      </div>
    </div>
  );
}
