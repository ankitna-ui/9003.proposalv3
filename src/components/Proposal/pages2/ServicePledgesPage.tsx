import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { Shield, Clock, Database, Headphones, Zap, ShieldCheck } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const ServicePledgesPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  return (
    <PageWrapper pageNum={pageNum} title="Service Pledges">
       <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-[2px] bg-[#99CB48]" />
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#99CB48]">Commitment Protocol</span>
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none mb-2">
             Service <span className="text-[#99CB48]">Pledges.</span>
          </h2>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Enterprise-Grade Commitments & Security Standards</div>
       </div>

       <div className="grid grid-cols-2 gap-10 flex-1">
          <div className="space-y-6">
             {[
                { icon: <Shield className="text-[#1AA6E1]" />, title: "Data Security Protocol", desc: proposal?.policies?.security || "AES-256 level encryption for all data at rest and in transit." },
                { icon: <Clock className="text-[#FACC15]" />, title: "Uptime Commitment (SLA)", desc: proposal?.policies?.sla || "99.9% guaranteed uptime for all critical business modules." },
                { icon: <Database className="text-[#99CB48]" />, title: "Backup & Recovery", desc: proposal?.policies?.backup || "Automated daily snapshots with geo-redundant storage." },
                { icon: <Headphones className="text-[#F43F5E]" />, title: "Strategic Support", desc: proposal?.policies?.support || "Priority L1 support with 4-hour response time for critical issues." }
             ].map((policy, i) => (
                <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex gap-6 group hover:border-[#99CB48]/20 transition-all">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {policy.icon}
                   </div>
                   <div className="space-y-2">
                      <div className="text-[11px] font-black uppercase tracking-widest text-[#0B0E14]">{policy.title}</div>
                      <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">{policy.desc}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="space-y-8">
             <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Zap size={140} className="text-[#99CB48]" />
                </div>
                <div className="relative z-10 space-y-8">
                   <div className="space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#99CB48]">Execution Velocity</div>
                      <div className="text-4xl font-black uppercase tracking-tighter leading-none">
                         Rapid <br /> Implementation.
                      </div>
                   </div>
                   <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-3">
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Target Handoff</div>
                      <div className="text-2xl font-black text-[#99CB48] tracking-tighter">{proposal?.policies?.timeline || "8-12 Weeks"}</div>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
                         From blueprint approval to final production deployment.
                      </p>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-[#99CB48]">
                   <ShieldCheck size={32} />
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase text-slate-900 tracking-tight">Protocol Compliance</div>
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">International Standards Alignment</div>
                </div>
             </div>
          </div>
       </div>

       <div className="mt-10 p-10 bg-[#0B0E14] rounded-[3.5rem] flex items-center justify-between">
          <div className="space-y-2">
             <div className="text-[#99CB48] text-[10px] font-black uppercase tracking-[0.6em]">Executive Pledges</div>
             <h4 className="text-white text-xl font-black uppercase tracking-tight">Your trust is our architecture.</h4>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-[#99CB48] uppercase tracking-widest">
                ISO 27001 ALIGNED
             </div>
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-[#99CB48] uppercase tracking-widest">
                SOC2 READY
             </div>
          </div>
       </div>
    </PageWrapper>
  );
};

export default ServicePledgesPage;
