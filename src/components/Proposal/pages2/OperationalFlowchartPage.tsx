import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { GitBranch, ExternalLink, Box, Database, Zap, ArrowRight, Share2 } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const OperationalFlowchartPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const flowchartImg = proposal.solution.flowchartImageUrl;
  const demoLink = proposal.solution.demoLink;

  return (
    <PageWrapper pageNum={pageNum} title="Operational Logic Flow">
       <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-[2px] bg-[#99CB48]" />
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#99CB48]">System Logic Protocol</span>
          </div>
          <div className="flex justify-between items-end">
             <div>
                <h2 className="text-5xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none mb-2">
                   Operational <span className="text-[#99CB48]">Flowchart.</span>
                </h2>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Architectural Mapping of the Automation Ecosystem</div>
             </div>
             {demoLink && (
                <a 
                  href={demoLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#99CB48] text-white rounded-2xl shadow-lg shadow-[#99CB48]/20 hover:scale-105 transition-transform"
                >
                   <span className="text-[10px] font-black uppercase tracking-widest leading-none">View Live Demo</span>
                   <ExternalLink size={14} className="shrink-0" />
                </a>
             )}
          </div>
       </div>

       <div className="flex-1 flex flex-col items-center justify-center py-6">
          {flowchartImg ? (
             <div className="relative w-full h-[500px] bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group">
                <img 
                   src={flowchartImg} 
                   alt="System Flowchart" 
                   className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-35deg]">
                   <span className="text-9xl font-black uppercase tracking-[1em] text-slate-900 select-none">Weblozy</span>
                </div>
                <div className="absolute bottom-8 right-10 pointer-events-none opacity-20">
                   <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#99CB48]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Weblozy Authored</span>
                   </div>
                </div>
             </div>
          ) : (
             <div className="relative w-full max-w-2xl aspect-video bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center shadow-inner overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative z-10 flex flex-col items-center gap-8 w-full px-12 text-slate-300">
                   <Box size={64} className="opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Flowchart Placeholder // Upload logic mapping</p>
                </div>
             </div>
          )}

          {/* Narrative Summary */}
          <div className="w-full mt-10 p-10 bg-slate-900 rounded-[2.5rem] text-white flex gap-8 shadow-2xl">
             <div className="w-14 h-14 rounded-2xl bg-[#99CB48] flex items-center justify-center text-slate-900 shrink-0">
                <GitBranch size={28} />
             </div>
             <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#99CB48]">Architectural Integrity</div>
                <p className="text-[12px] font-bold text-white/70 leading-relaxed uppercase tracking-tight">
                   {proposal.solution.overview || "The system utilizes a non-linear operational logic, ensuring redundant data verification and real-time synchronization across all enterprise nodes."}
                </p>
             </div>
          </div>
       </div>

       <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#99CB48]" />
             <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Logic Flow Verified // Weblozy Architecture</div>
          </div>
          <Share2 size={14} className="text-slate-300" />
       </div>
    </PageWrapper>
  );
};

export default OperationalFlowchartPage;
