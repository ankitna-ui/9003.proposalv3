import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { Layout, CheckCircle2, Globe, UserCheck, Cpu, Shield } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const StrategicEcosystemPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  return (
    <PageWrapper pageNum={pageNum} title="Strategic Solution">
       <div className="mb-10 relative">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-[2px] bg-[#3ABEF9]" />
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#3ABEF9]">Phase 02: Architecture</span>
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none mb-2">
             Strategic <span className="text-[#3ABEF9]">Ecosystem.</span>
          </h2>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Engineering Scalable Solutions for Digital Excellence</div>
       </div>

       <div className="space-y-10 flex-1">
          {/* Approach Card */}
          <div className="bg-[#F8FAFC] p-10 rounded-[3rem] border border-slate-100 relative overflow-hidden group shadow-sm">
             <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                <Layout size={160} className="text-[#3ABEF9]" />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3ABEF9]/60">Solution Blueprint</div>
                <p className="text-[13px] font-black uppercase text-slate-700 leading-relaxed max-w-[95%]">
                   {proposal?.solution?.approach || "We propose building a custom automation system tailored to your specific business workflow, ensuring seamless data flow and operational transparency across all departments."}
                </p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
             {/* Implementation Pillars */}
             <div className="space-y-8">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Implementation Pillars</div>
                <div className="space-y-4">
                   {(proposal?.solution?.approachPoints || ["Agile Development Cycle", "Seamless API Orchestration", "End-to-End Encryption"]).map((point, i) => (
                      <div key={i} className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                         <div className="w-10 h-10 rounded-2xl bg-[#3ABEF9]/10 flex items-center justify-center text-[#3ABEF9] group-hover:bg-[#3ABEF9] group-hover:text-white transition-colors">
                            <CheckCircle2 size={18} strokeWidth={2.5} />
                         </div>
                         <span className="text-[11px] font-black uppercase tracking-tight text-slate-800">{point}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="space-y-10">
                {/* System Connectivity */}
                <div className="space-y-6">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Connectivity Hub</div>
                   <div className="flex flex-wrap gap-3">
                      {(proposal?.solution?.integrations || ["Custom CRM", "ERP Sync", "Cloud DB", "Payment Gateway"]).map((item, i) => (
                         <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 rounded-xl border border-slate-800 group shadow-lg">
                            <Globe size={12} className="text-[#3ABEF9]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{item}</span>
                         </div>
                      ))}
                   </div>
                </div>

                {/* User Architecture */}
                <div className="space-y-6">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">User Hierarchy</div>
                   <div className="grid grid-cols-1 gap-3">
                      {(proposal?.solution?.userRoles || [
                         { role: "Super Admin", access: "Full System Control", count: "1" },
                         { role: "Department Head", access: "Operational Oversight", count: "5" }
                      ]).map((roleObj: any, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[#3ABEF9]/20 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-[#3ABEF9] border border-slate-100">
                                  <div className="text-[12px] font-black leading-none">{roleObj.role ? roleObj.count : "1"}</div>
                                  <div className="text-[5px] font-black uppercase tracking-widest opacity-50">Users</div>
                               </div>
                               <div className="space-y-0.5">
                                  <div className="text-[10px] font-black uppercase text-slate-900 tracking-tight">
                                     {typeof roleObj === 'string' ? roleObj : (roleObj?.role || "New Role")}
                                  </div>
                                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                     {typeof roleObj === 'string' ? "Strategic Access" : (roleObj?.access || "Strategic Access")}
                                  </div>
                               </div>
                            </div>
                            <UserCheck size={14} className="text-[#3ABEF9]/30" />
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Trust Section */}
       <div className="mt-10 p-10 bg-slate-900 rounded-[3rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3ABEF9]/20 to-transparent" />
          <div className="relative z-10 flex items-center justify-between">
             <div className="space-y-2">
                <div className="text-[#3ABEF9] text-[10px] font-black uppercase tracking-[0.5em]">Scalability Protocol</div>
                <h4 className="text-white text-xl font-black uppercase tracking-tight">Built for Future Expansion.</h4>
             </div>
             <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3ABEF9]">
                   <Cpu size={24} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3ABEF9]">
                   <Shield size={24} />
                </div>
             </div>
          </div>
       </div>
    </PageWrapper>
  );
};

export default StrategicEcosystemPage;
