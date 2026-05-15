import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { ShieldAlert, AlertCircle, TrendingDown, Activity, Target } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const OperationalAuditPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const challenges = proposal.situation?.challenges?.length > 0 
    ? proposal.situation.challenges 
    : ["Manual Data Entry", "Communication Silos", "Resource Misallocation"];

  const isMany = challenges.length > 5;
  const isTooMany = challenges.length > 8;

  return (
    <PageWrapper pageNum={pageNum} title="Strategic Audit">
       <div className="mb-6 relative">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-[2px] bg-red-600" />
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-red-600">Phase 01: Audit</span>
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none mb-1">
             Operational <span className="text-red-600">Audit.</span>
          </h2>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Identifying Systemic Bottlenecks & Growth Inhibitors</div>
       </div>
       
       <div className="space-y-6 flex-1 min-h-0">
          {/* Situational Narrative */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group shadow-sm shrink-0">
             <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <ShieldAlert size={120} className="text-red-600" />
             </div>
             <div className="relative z-10 space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600/60">Situational Analysis</div>
                <p className="text-[12px] font-bold uppercase text-slate-700 leading-relaxed max-w-[95%]">
                   {proposal.situation?.currentWorkflow || "The current operational framework exhibits significant friction points that impede scalable growth and resource optimization. Our audit identifies core vulnerabilities in manual coordination and data fragmentation."}
                </p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
             {/* Friction Points - Dynamic Sizing */}
             <div className="space-y-4 flex flex-col min-h-0 overflow-hidden">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Critical Friction Points</div>
                <div className={`grid gap-3 flex-1 overflow-hidden ${isTooMany ? 'grid-cols-1 gap-2' : 'grid-cols-1'}`}>
                   {challenges.map((challenge, i) => (
                      <div 
                        key={i} 
                        className={`flex items-start gap-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-colors
                          ${isTooMany ? 'p-2' : isMany ? 'p-3' : 'p-4'}`}
                      >
                         <div className={`rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0
                           ${isTooMany ? 'w-4 h-4 mt-0.5' : 'w-6 h-6 mt-1'}`}>
                            <AlertCircle size={isTooMany ? 10 : 14} strokeWidth={2.5} />
                         </div>
                         <span className={`font-black uppercase tracking-tight text-slate-800 leading-tight
                           ${isTooMany ? 'text-[7px]' : isMany ? 'text-[8px]' : 'text-[10px]'}`}>
                           {challenge}
                         </span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Impact Metrics */}
             <div className="space-y-6 flex flex-col">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Leakage & Inefficiency</div>
                <div className="space-y-4 flex-1">
                   <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 text-red-600">
                         <TrendingDown size={16} strokeWidth={2.5} />
                         <span className="text-[9px] font-black uppercase tracking-widest">Financial Leakage</span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 tracking-tighter">{proposal.situation?.revenueLeakage || "₹10k+ / Mo"}</div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Estimated Monthly Capital Loss Due to Inefficiency</p>
                   </div>

                   <div className="p-6 bg-slate-900 rounded-3xl space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 text-[#99CB48]">
                         <Activity size={16} strokeWidth={2.5} />
                         <span className="text-[9px] font-black uppercase tracking-widest">Operational Drag</span>
                      </div>
                      <div className="text-xl font-black text-white uppercase tracking-tighter">{proposal.situation?.inefficiencies || "High Manual Overhead"}</div>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-tight">Systemic Friction impacting Team Velocity</p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                <Target size={20} />
             </div>
             <div className="space-y-0.5">
                <div className="text-[10px] font-black uppercase text-slate-900">Audit Objective</div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Neutralizing Operational Friction for Enterprise Scalability</div>
             </div>
          </div>
          <div className="text-[8px] font-black text-red-500 uppercase tracking-[0.3em] bg-red-50 px-4 py-2 rounded-lg border border-red-100">
             Action Required
          </div>
       </div>
    </PageWrapper>
  );
};

export default OperationalAuditPage;
