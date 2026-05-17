import { useEffect } from "react";
import { TrendingUp, Zap, Clock, Target, BarChart3, PieChart, ShieldCheck } from "lucide-react";
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
    <div className="space-y-8 pb-8">
      <SectionHeader 
        title="Impact & Yield Analytics" 
        subtitle="Quantify the strategic dividends and mathematical justification of the transformation" 
        stepNumber={currentStep + 1} 
      />

      {/* ──── IMPACT MATRIX ──── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100/50 space-y-2.5 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-500">
               <TrendingUp size={16} />
            </div>
            <BarChart3 size={12} className="text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-bold uppercase text-emerald-800 tracking-wider pl-0.5">Revenue Growth</p>
            <div className="relative">
              <ModernInput 
                type="number"
                className="h-10 pl-3 pr-8 text-sm font-semibold text-emerald-700 border-emerald-100/80 focus-visible:ring-emerald-500 rounded-lg bg-white" 
                placeholder="0"
                value={proposal.roi.revenueIncrease} 
                onChange={(e) => updateROI({ revenueIncrease: e.target.value })} 
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-xs">%</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-blue-50/40 rounded-2xl border border-blue-100/50 space-y-2.5 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-500">
               <Target size={16} />
            </div>
            <PieChart size={12} className="text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-bold uppercase text-blue-800 tracking-wider pl-0.5">Cost Reduction</p>
            <div className="relative">
              <ModernInput 
                type="number"
                className="h-10 pl-3 pr-8 text-sm font-semibold text-blue-700 border-blue-100/80 focus-visible:ring-blue-500 rounded-lg bg-white" 
                placeholder="0"
                value={proposal.roi.costReduction} 
                onChange={(e) => updateROI({ costReduction: e.target.value })} 
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-xs">%</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-amber-50/40 rounded-2xl border border-amber-100/50 space-y-2.5 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-500">
               <Zap size={16} />
            </div>
            <Zap size={12} className="text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity fill-amber-300" />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-bold uppercase text-amber-800 tracking-wider pl-0.5">Productivity Delta</p>
            <div className="relative">
              <ModernInput 
                type="number"
                className="h-10 pl-3 pr-8 text-sm font-semibold text-amber-700 border-amber-100/80 focus-visible:ring-amber-500 rounded-lg bg-white" 
                placeholder="0"
                value={proposal.roi.productivityIncrease} 
                onChange={(e) => updateROI({ productivityIncrease: e.target.value })} 
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-xs">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ──── RESULT DASHBOARD (PREMIUM DARK) ──── */}
      <div className="p-6 bg-[#0B0E14] rounded-2xl text-white relative overflow-hidden shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 scale-150 pointer-events-none">
          <BarChart3 size={180} className="text-primary" />
        </div>
        
        <div className="relative z-10 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Projected Yield Profile</span>
             </div>
             <div className="text-[8px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md">
                Active Protocol
             </div>
          </div>
          
          {/* Yield Value Display */}
          <div className="py-1">
             {(() => {
                const expectedVal = proposal.roi.expectedROI || "0";
                const isNumeric = /^\d+$/.test(expectedVal.trim());
                if (isNumeric) {
                   return (
                      <div className="flex items-baseline gap-1">
                         <span className="text-4xl md:text-5xl font-black tracking-tight text-white leading-none">{expectedVal}</span>
                         <span className="text-lg font-black text-primary leading-none">%</span>
                      </div>
                   );
                } else {
                   return (
                      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight break-words max-w-full">
                         {expectedVal}
                      </div>
                   );
                }
             })()}
             <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1.5">Aggregated Strategic Return on Investment</p>
          </div>
          
          {/* Secondary Metrics horizontal layout */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
             <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#0B0E14] transition-all duration-300 shadow-md shrink-0">
                   <Clock size={14} />
                </div>
                <div className="min-w-0">
                   <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">Amortization Period</div>
                   <div className="text-xs font-bold tracking-tight text-white/90 truncate">{proposal.roi.breakEven}</div>
                </div>
             </div>
             <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-[#0B0E14] transition-all duration-300 shadow-md shrink-0">
                   <TrendingUp size={16} />
                </div>
                <div className="min-w-0">
                   <div className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30 mb-0.5">Growth Trajectory</div>
                   <div className="text-xs font-bold tracking-tight text-white/90 truncate">{proposal.roi.growthFactor}</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ──── OPERATIONAL REALITY ──── */}
      <div className="p-6 bg-white border border-slate-100/80 rounded-2xl space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-primary shadow-md">
             <BarChart3 size={16} />
          </div>
          <div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Mathematical Constants</span>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Foundational data for ROI synthesis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
               <LabelPremium className="mb-0 text-slate-800 text-[10px]">Inefficiency Payload</LabelPremium>
               <div className="text-[8px] font-bold uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Cost Leakage</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Manual Hrs / Mo</p>
                <ModernInput 
                  type="number" 
                  className="h-10 px-3 text-sm font-semibold text-slate-800 bg-slate-50 border-none rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0 focus:bg-white" 
                  placeholder="e.g. 160" 
                  value={proposal.roi.manualHoursPerMonth || ""} 
                  onChange={(e) => updateROI({ manualHoursPerMonth: e.target.value })} 
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Hourly Rate (₹)</p>
                <ModernInput 
                  type="number" 
                  className="h-10 px-3 text-sm font-semibold text-slate-800 bg-slate-50 border-none rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0 focus:bg-white" 
                  placeholder="e.g. 500" 
                  value={proposal.roi.hourlyRate || ""} 
                  onChange={(e) => updateROI({ hourlyRate: e.target.value })} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
               <LabelPremium className="mb-0 text-slate-800 text-[10px]">Financial Overhead</LabelPremium>
               <div className="text-[8px] font-bold uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Ops Burden</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Monthly Ops Cost</p>
                <ModernInput 
                  type="number" 
                  className="h-10 px-3 text-sm font-semibold text-slate-800 bg-slate-50 border-none rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0 focus:bg-white" 
                  placeholder="₹ 50k" 
                  value={proposal.roi.currentOpsCost || ""} 
                  onChange={(e) => updateROI({ currentOpsCost: e.target.value })} 
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Revenue Leak (%)</p>
                <ModernInput 
                  type="number" 
                  className="h-10 px-3 text-sm font-semibold text-slate-800 bg-slate-50 border-none rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0 focus:bg-white" 
                  placeholder="e.g. 15" 
                  value={proposal.roi.revenueIncrease || ""} 
                  onChange={(e) => updateROI({ revenueIncrease: e.target.value })} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
           <ShieldCheck size={14} className="text-primary shrink-0" />
           <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider leading-relaxed">
             This analytical core drives the **Strategic Comparison Matrix** in the final output, providing a mathematically sound justification for the ecosystem investment.
           </p>
        </div>
      </div>

      {/* ──── EXECUTIVE SUMMARY ──── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
           <LabelPremium className="mb-0 text-slate-800 text-[10px]">Strategic Impact Synthesis</LabelPremium>
           <span className="text-[8px] font-bold uppercase text-primary border border-primary/20 px-3 py-1 rounded-full shadow-sm bg-white">Executive Narrative</span>
        </div>
        <ModernTextArea 
          className="min-h-[120px] p-4 text-sm font-medium text-slate-700 leading-relaxed rounded-xl border border-slate-200/80 focus-visible:ring-primary focus-visible:ring-offset-0 focus:border-primary/40 focus:bg-white transition-all bg-slate-50/20" 
          placeholder="Synthesize the tangible business transformation. E.g., 'This implementation will recover 2,400 manual hours annually, redirecting workforce focus to high-value strategic growth initiatives...'" 
          value={proposal.roi.impactSummary} 
          onChange={(e) => updateROI({ impactSummary: e.target.value })} 
        />
      </div>
    </div>
  );
}
