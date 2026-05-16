import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { Layout, CheckCircle2, Globe, UserCheck, Cpu, Shield } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const StrategicEcosystemPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const pillars = proposal?.solution?.approachPoints || ["Agile Development Cycle", "Seamless API Orchestration", "End-to-End Encryption"];
  const integrations = proposal?.solution?.integrations || ["Custom CRM", "ERP Sync", "Cloud DB", "Payment Gateway"];
  const roles = proposal?.solution?.userRoles || ["Super Admin", "Department Head"];

  // Logic for Pillars
  const pillarCount = pillars.length;
  const pillarStyle = pillarCount > 10 ? { p: 'p-1.5', text: 'text-[6px]', icon: 8, gap: 'gap-2', rounded: 'rounded-lg' } :
                     pillarCount > 7 ? { p: 'p-2', text: 'text-[7px]', icon: 10, gap: 'gap-3', rounded: 'rounded-xl' } :
                     pillarCount > 4 ? { p: 'p-3', text: 'text-[8px]', icon: 14, gap: 'gap-4', rounded: 'rounded-2xl' } :
                     { p: 'p-4', text: 'text-[10px]', icon: 16, gap: 'gap-5', rounded: 'rounded-3xl' };

  // Logic for Integrations
  const intCount = integrations.length;
  const intText = intCount > 12 ? 'text-[5px]' : intCount > 8 ? 'text-[6px]' : 'text-[8px]';
  const intPad = intCount > 8 ? 'px-2 py-1' : 'px-3 py-2';

  // Logic for Roles
  const roleCount = roles.length;
  const useGrid = roleCount > 3;
  const roleStyle = roleCount > 8 ? { p: 'p-1.5', title: 'text-[6.5px]', sub: 'text-[4.5px]', box: 'w-7 h-7', icon: 0 } :
                    roleCount > 5 ? { p: 'p-2', title: 'text-[7px]', sub: 'text-[5px]', box: 'w-8 h-8', icon: 0 } :
                    roleCount > 3 ? { p: 'p-2.5', title: 'text-[8px]', sub: 'text-[6px]', box: 'w-9 h-9', icon: 10 } :
                    { p: 'p-4', title: 'text-[10px]', sub: 'text-[8px]', box: 'w-10 h-10', icon: 14 };

  return (
    <PageWrapper pageNum={pageNum} title="Strategic Solution">
       <div className="flex flex-col h-full space-y-4">
          {/* Header Section */}
          <div className="mb-2 shrink-0">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-[2px] bg-[#3ABEF9]" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#3ABEF9]">Phase 02: Architecture</span>
             </div>
             <h2 className="text-5xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none mb-1">
                Strategic <span className="text-[#3ABEF9]">Ecosystem.</span>
             </h2>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Engineering Scalable Solutions for Digital Excellence</div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-0 flex flex-col space-y-4">
             {/* Approach Card */}
             <div className="bg-[#F8FAFC] p-6 rounded-[2.5rem] border border-slate-100 relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                   <Layout size={100} className="text-[#3ABEF9]" />
                </div>
                <div className="relative z-10 space-y-3">
                   <div className="text-[9px] font-black uppercase tracking-[0.4em] text-[#3ABEF9]/60">Solution Blueprint</div>
                   <p className="text-[11px] font-bold uppercase text-slate-700 leading-relaxed max-w-[95%]">
                      {proposal?.solution?.approach || "We propose building a custom automation system tailored to your specific business workflow, ensuring seamless data flow and operational transparency across all departments."}
                   </p>
                </div>
             </div>

             {/* Grid Content */}
             <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Left Column: Pillars */}
                <div className="flex flex-col min-h-0">
                   <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3 shrink-0">Implementation Pillars</div>
                   <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
                      {pillars.map((point, i) => (
                         <div key={i} className={`flex items-center ${pillarStyle.gap} bg-white border border-slate-100 ${pillarStyle.rounded} shadow-sm transition-all ${pillarStyle.p}`}>
                            <div className={`rounded-xl bg-[#3ABEF9]/10 flex items-center justify-center text-[#3ABEF9] shrink-0`} style={{ width: pillarCount > 10 ? '20px' : pillarCount > 7 ? '28px' : '36px', height: pillarCount > 10 ? '20px' : pillarCount > 7 ? '28px' : '36px' }}>
                               <CheckCircle2 size={pillarStyle.icon} strokeWidth={2.5} />
                            </div>
                            <span className={`font-black uppercase tracking-tight text-slate-800 leading-none ${pillarStyle.text}`}>
                               {point}
                            </span>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Right Column: Connectivity & Hierarchy */}
                <div className="flex flex-col space-y-4 min-h-0">
                   {/* System Connectivity */}
                   <div className="shrink-0">
                      <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">Connectivity Hub</div>
                      <div className="flex flex-wrap gap-1.5">
                         {integrations.map((item, i) => (
                            <div key={i} className={`flex items-center gap-1.5 bg-slate-900 rounded-lg border border-slate-800 shadow-lg ${intPad}`}>
                               <Globe size={intCount > 12 ? 6 : 8} className="text-[#3ABEF9]" />
                               <span className={`font-black uppercase tracking-widest text-white/80 ${intText}`}>{item}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                    {/* User Architecture */}
                    <div className="flex flex-col flex-1 min-h-0">
                       <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3 shrink-0">User Hierarchy</div>
                       <div className={`grid gap-1.5 flex-1 min-h-0 overflow-hidden ${useGrid ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {roles.map((role, i) => {
                             const roleStr = typeof role === 'string' ? role : "";
                             const [roleName, roleAccess] = roleStr.includes('|') ? roleStr.split('|') : [roleStr, "Strategic Access"];
                             
                             return (
                                <div key={i} className={`flex items-center justify-between bg-white rounded-xl border border-slate-100 shadow-sm transition-all ${roleStyle.p}`}>
                                   <div className="flex items-center gap-2 min-w-0">
                                      <div className={`${roleStyle.box} rounded-lg bg-slate-900 flex flex-col items-center justify-center text-[#99CB48] border border-slate-900 shrink-0`}>
                                         <div className="text-[10px] font-black leading-none">0{i+1}</div>
                                         <div className="text-[4px] font-black uppercase tracking-widest opacity-40">Node</div>
                                      </div>
                                      <div className="space-y-0.5 min-w-0">
                                         <div className={`${roleStyle.title} font-black uppercase text-slate-900 tracking-tight leading-none truncate`}>
                                            {roleName || "System Role"}
                                         </div>
                                         <div className={`${roleStyle.sub} font-bold text-slate-400 uppercase tracking-widest leading-none truncate`}>
                                            {roleAccess || "Strategic Access"}
                                         </div>
                                      </div>
                                   </div>
                                   {roleStyle.icon > 0 && <UserCheck size={roleStyle.icon} className="text-[#3ABEF9]/20 shrink-0" />}
                                </div>
                             );
                          })}
                       </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Trust Section Footer - ABSOLUTE STABILITY */}
          <div className="p-6 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shrink-0 border border-slate-800">
             <div className="absolute inset-0 bg-gradient-to-r from-[#3ABEF9]/20 to-transparent" />
             <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                   <div className="text-[#3ABEF9] text-[9px] font-black uppercase tracking-[0.5em]">Scalability Protocol</div>
                   <h4 className="text-white text-lg font-black uppercase tracking-tight">Built for Future Expansion.</h4>
                </div>
                <div className="flex gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3ABEF9]">
                      <Cpu size={20} />
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3ABEF9]">
                      <Shield size={20} />
                   </div>
                </div>
             </div>
          </div>
       </div>
    </PageWrapper>
  );
};

export default StrategicEcosystemPage;
