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

        <div className="space-y-6 flex-1">
           <div className="grid grid-cols-[1.2fr,1fr] gap-6">
              {/* ROI Hero Card */}
              <div className="p-10 bg-[#0B0E14] rounded-[3rem] text-white relative overflow-hidden shadow-2xl flex flex-col justify-center min-h-[220px]">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={140} className="text-[#99CB48]" />
                 </div>
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#99CB48] animate-pulse" />
                       <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#99CB48]">Strategic Yield</div>
                    </div>
                    <div className="text-8xl font-black tracking-tighter text-white leading-none">
                       {formatPercent(proposal?.roi?.expectedROI || "45")}
                    </div>
                    <div className="space-y-1">
                       <p className="text-xs font-black uppercase tracking-widest text-white/60">Annual Strategic ROI</p>
                       <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Mathematically modeled across operational KPIs</p>
                    </div>
                 </div>
              </div>

              {/* Payback & Growth Card */}
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-[3rem] space-y-6 flex flex-col justify-center">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payback Period</div>
                       <div className="text-2xl font-black text-[#0B0E14] tracking-tight">{proposal?.roi?.breakEven || "4-6 Months"}</div>
                    </div>
                    <div className="space-y-2 text-right">
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Growth Velocity</div>
                       <div className="text-2xl font-black text-[#99CB48] tracking-tight">{proposal?.roi?.growthFactor || "Exponential"}</div>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-[#99CB48]/10 flex items-center justify-center text-[#99CB48]">
                          <IndianRupee size={18} strokeWidth={3} />
                       </div>
                       <div>
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Annual Capital Recovery</div>
                          <div className="text-lg font-black text-[#0B0E14] leading-none">
                             {formatValue(proposal?.roi?.profitImpact || "1.5M+")}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Comparative Efficiency Matrix */}
           <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                 <div className="px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-md">Comparative Efficiency Matrix</div>
                 <div className="h-[1px] flex-1 bg-slate-100" />
              </div>
              
              <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                 <div className="grid grid-cols-[1.5fr,1fr,1.2fr] bg-slate-900 text-white py-3 px-8 text-[9px] font-black uppercase tracking-widest">
                    <div>Performance Pillar</div>
                    <div className="text-center opacity-50">Current State</div>
                    <div className="text-right text-[#99CB48]">Weblozy Future</div>
                 </div>
                 
                 <div className="p-2">
                    {[
                       { pillar: "Operational Error Rate", legacy: "12 - 15%", weblozy: "< 1.5%", desc: "Full automation of critical logic nodes" },
                       { pillar: "Processing Latency", legacy: "24 - 48 Hrs", weblozy: "Real-time", desc: "Instantaneous data synchronization" },
                       { pillar: "Manual Human Dependency", legacy: `${proposal.roi.manualHoursPerMonth || "160"} Hrs/Mo`, weblozy: `${Math.round((parseInt(proposal.roi.manualHoursPerMonth || "160")) * 0.15)} Hrs/Mo`, desc: "90% automation of routine tasks" },
                       { pillar: "Operational Cost / Unit", legacy: "Variable High", weblozy: "Fixed Optimized", desc: "Lean infrastructure deployment" }
                    ].map((row, i) => (
                       <div key={i} className={`grid grid-cols-[1.5fr,1fr,1.2fr] items-center py-4 px-6 ${i !== 3 ? 'border-b border-slate-50' : ''}`}>
                          <div className="space-y-0.5">
                             <div className="text-[10px] font-black uppercase text-slate-900 tracking-tight">{row.pillar}</div>
                             <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{row.desc}</div>
                          </div>
                          <div className="text-center text-[11px] font-bold text-slate-400 italic">{row.legacy}</div>
                          <div className="text-right text-[12px] font-black text-[#99CB48] italic">{row.weblozy}</div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Strategic Summary */}
           <div className="p-8 bg-[#F8FAFC] rounded-[2.5rem] border border-slate-100 flex gap-6 items-center">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#99CB48] shrink-0 border border-slate-100">
                 <Target size={28} strokeWidth={2.5} />
              </div>
              <p className="text-[11px] font-black uppercase text-slate-700 leading-relaxed italic pr-6">
                 "{proposal?.roi?.impactSummary || "This transformation framework is engineered to neutralize operational friction, maximize capital efficiency, and establish a high-performance digital ecosystem."}"
              </p>
           </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100 shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#99CB48]" />
              <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Institutional Impact modeling Protocol</div>
           </div>
           <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Analytical Archive // ROI-MODERN-V3</div>
        </div>
    </PageWrapper>
  );
};

export default StrategicROIPage;
