import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { TrendingUp, IndianRupee, Clock, Zap, Target, ArrowUpRight } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const StrategicROIPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  // Ensure we append units correctly if they aren't provided by the user
  const formatPercent = (val: string) => val ? (val.includes('%') ? val : `${val}%`) : "0%";
  const formatValue = (val: string) => val ? (val.includes('₹') ? val : `₹${val}`) : "₹0";
  const formatHours = (val: string) => val ? (val.includes('Hrs') ? val : `${val} Hrs/Mo`) : "0 Hrs/Mo";

  return (
    <PageWrapper pageNum={pageNum} title="Performance & Impact">
       <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-[2px] bg-[#99CB48]" />
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#99CB48]">Phase 03: Impact</span>
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none mb-2">
             Strategic <span className="text-[#99CB48]">ROI.</span>
          </h2>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Quantifying Value & Performance Transformation</div>
       </div>

       <div className="space-y-8 flex-1">
          <div className="grid grid-cols-2 gap-8">
             {/* Main Hero Metric: Expected ROI */}
             <div className="space-y-6">
                <div className="p-10 bg-[#0B0E14] rounded-[3rem] text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <TrendingUp size={140} className="text-[#99CB48]" />
                   </div>
                   <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-[#99CB48] animate-pulse" />
                         <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#99CB48]">Efficiency Yield</div>
                      </div>
                      <div className="text-8xl font-black tracking-tighter text-white leading-none">
                         {formatPercent(proposal?.roi?.expectedROI || "45")}
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-black uppercase tracking-widest text-white/60">Aggregated Strategic ROI</p>
                         <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Calculated across 12-month operational cycle</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Financial Impact Card */}
             <div className="flex flex-col gap-6">
                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6 flex-1 shadow-sm">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-slate-400">
                         <IndianRupee size={20} />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em]">Monthly Surplus</span>
                      </div>
                      <ArrowUpRight size={20} className="text-[#99CB48]" />
                   </div>
                   <div className="text-5xl font-black text-[#0B0E14] tracking-tighter">
                      {formatValue(proposal?.roi?.profitImpact || "12,500")}
                   </div>
                   <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed tracking-tight">
                      Estimated Monthly Profitability Increase Post-Implementation
                   </p>
                   <div className="pt-6 border-t border-slate-200">
                      <div className="flex justify-between items-end">
                         <div className="space-y-1">
                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Break-even</div>
                            <div className="text-xs font-black text-slate-900">{proposal?.roi?.breakEven || "4-6 Months"}</div>
                         </div>
                         <div className="space-y-1 text-right">
                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Growth Factor</div>
                            <div className="text-xs font-black text-[#99CB48]">{proposal?.roi?.growthFactor || "Exponential"}</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Core Performance Matrix */}
          <div className="grid grid-cols-3 gap-6">
             {[
                { label: "Productivity", value: formatPercent(proposal?.roi?.productivityIncrease || "40"), icon: <Zap size={18} />, color: "#99CB48" },
                { label: "Cost Saving", value: formatPercent(proposal?.roi?.costReduction || "15"), icon: <IndianRupee size={18} />, color: "#1AA6E1" },
                { label: "Time Recovered", value: formatHours(proposal?.roi?.timeSaving || "120"), icon: <Clock size={18} />, color: "#FACC15" }
             ].map((stat, i) => (
                <div key={i} className="flex flex-col p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-[#99CB48]/20 transition-all">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                      {stat.icon}
                   </div>
                   <div className="space-y-1 mb-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                      <div className="text-3xl font-black text-[#0B0E14] tracking-tight">{stat.value}</div>
                   </div>
                   <div className="mt-auto h-[3px] w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-current" style={{ width: '70%', color: stat.color }} />
                   </div>
                </div>
             ))}
          </div>

          {/* Strategic Narrative */}
          <div className="p-10 bg-[#F8FAFC] rounded-[3rem] border border-slate-100 flex gap-8 shadow-inner">
             <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#99CB48] shrink-0 border border-slate-100">
                <Target size={32} strokeWidth={2.5} />
             </div>
             <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Strategic Alignment</div>
                <p className="text-[12px] font-black uppercase text-slate-700 leading-relaxed italic">
                   "{proposal?.roi?.impactSummary || "This transformation framework is engineered to neutralize operational friction, maximize capital efficiency, and establish a high-performance digital ecosystem."}"
                </p>
             </div>
          </div>
       </div>

       <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#99CB48]" />
             <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Verified Financial Projection Protocol</div>
          </div>
          <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300">Analytical Archive // ROI-V2.1</div>
       </div>
    </PageWrapper>
  );
};

export default StrategicROIPage;
