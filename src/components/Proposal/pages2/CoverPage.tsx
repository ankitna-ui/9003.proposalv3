import React from "react";
import { Proposal } from "@/types/proposal";
import banner2Logo from "@/assets/banner2_logo.png";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const CoverPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  return (
    <section className="a4-page cover-gradient flex flex-col relative overflow-hidden text-white shadow-2xl" style={{ background: 'linear-gradient(135deg, #1668B2 0%, #0B0E14 100%)' }}>
       <div className="watermark opacity-[0.03]">WEBLOZY</div>
       <div className="page-number text-[#99CB48]">Page {pageNum}</div>
       
       {/* Top Branding Section */}
       <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-4 max-w-[65%]">
             <img src={banner2Logo} alt="Weblozy" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} className="opacity-100" />
             <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-[#99CB48]" />
                <div className="text-[10px] font-black tracking-[0.5em] text-white/60 uppercase truncate">{proposal?.client?.tagline || "We Automate Businesses"}</div>
             </div>
          </div>
          
          <div className="text-right space-y-4">
             <div className="space-y-3">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Reference Protocol</div>
                <div className="inline-flex items-center gap-3 px-6 py-2.5 border-[1.5px] border-white/10 rounded-full bg-white/5 backdrop-blur-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#99CB48] shadow-lg shadow-[#99CB48]/40" />
                  <span className="text-sm font-black tracking-widest text-white">#{proposal?.client?.referenceId || "WBL-2024-001"}</span>
                </div>
             </div>
          </div>
       </div>

       {/* Hero Strategic Title Section */}
       <div className="relative z-10 flex-1 flex flex-col justify-center px-4">
          <div className="space-y-6">
             <div className="inline-flex items-center gap-4">
               <div className="h-[1px] w-12 bg-[#99CB48]" />
               <div className="text-[10px] font-black uppercase tracking-[0.8em] text-[#99CB48]">
                  {proposal?.client?.frameworkTitle || "Executive Framework"}
               </div>
             </div>
             
             <h1 className={`font-black tracking-[-0.04em] uppercase text-white drop-shadow-2xl transition-all duration-300 ${
               (proposal?.client?.proposalTitle || "").length > 80 ? "text-[28px] leading-[1.1]" : 
               (proposal?.client?.proposalTitle || "").length > 50 ? "text-[36px] leading-[1.05]" : 
               (proposal?.client?.proposalTitle || "").length > 30 ? "text-[48px] leading-[1]" : 
               "text-[64px] leading-[0.95]"
             }`}>
               {proposal?.client?.proposalTitle ? (
                 (proposal?.client?.proposalTitle || '').split(' ').map((word, i) => (
                   <span key={i} className="inline-block mr-[0.3em]">
                      {word === '&' ? <span className="text-[#99CB48] font-light">&</span> : word}
                   </span>
                 ))
               ) : (
                 <>
                   Digital Transformation <span className="text-[#99CB48] font-light">&</span> <br />
                   Business Automation
                 </>
               )}
             </h1>
             
             <div className="pt-8 flex items-center gap-8">
                <div className="h-[2px] w-24 bg-gradient-to-r from-[#99CB48] to-transparent shrink-0" />
                <div className={`font-medium uppercase tracking-[0.4em] text-white/50 transition-all duration-300 leading-relaxed ${
                  (proposal?.client?.subTitle || "").length > 80 ? "text-[9px]" : "text-[12px]"
                }`}>
                  {proposal?.client?.subTitle || "Bespoke Technical & Operational Roadmap"}
                </div>
             </div>
          </div>
       </div>

       {/* Master Data Footer Section */}
       <div className="relative z-10 mt-auto pb-6 w-full">
          <div className="h-[1px] w-full bg-gradient-to-r from-white/5 via-white/20 to-white/5 mb-8" />
          
          <div className="grid grid-cols-4 gap-4 px-2">
             <div className="space-y-3">
                <div className="text-[8px] font-black uppercase tracking-[0.4em] text-[#99CB48]/80">Strategic Ally</div>
                <div className="space-y-1.5">
                  <div className={`font-black uppercase leading-tight tracking-tight text-white ${
                    (proposal?.client?.companyName || "").length > 25 ? "text-[12px]" : "text-[16px]"
                  }`}>{proposal?.client?.companyName || "Enterprise Corp"}</div>
                  <div className="font-bold text-white/40 uppercase tracking-[0.3em] text-[9px]">
                    {proposal?.client?.clientName || "Valued Client"}
                  </div>
                </div>
             </div>
             
             <div className="space-y-3 border-l pl-5 border-white/10">
                <div className="text-[8px] font-black uppercase tracking-[0.4em] text-[#99CB48]/80">Domain</div>
                <div className="space-y-1.5">
                  <div className={`font-black uppercase leading-tight tracking-tight text-white ${
                    (proposal?.client?.industryTitle || "").length > 25 ? "text-[12px]" : "text-[16px]"
                  }`}>{proposal?.client?.industryTitle || "Business Automation"}</div>
                  <div className="font-bold text-white/40 uppercase tracking-[0.3em] text-[9px]">
                    {proposal?.client?.industryDomain || "Enterprise Sector"}
                  </div>
                </div>
             </div>
             
             <div className="space-y-3 border-l pl-5 border-white/10">
                <div className="text-[8px] font-black uppercase tracking-[0.4em] text-[#99CB48]/80">Protocol</div>
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1.5 bg-white/5 border border-white/10 text-white text-[8px] font-black uppercase tracking-[0.4em] rounded-md backdrop-blur-md">
                     {proposal?.client?.protocolTitle || "Confidential"}
                  </div>
                  <div className="font-bold text-white/40 uppercase tracking-[0.4em] text-[8px] block mt-1">
                    {proposal?.client?.releaseProtocol || "Stable-V2"}
                  </div>
                </div>
             </div>
             
             <div className="space-y-3 border-l pl-6 border-white/10">
                <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Filing Date</div>
                <div className="space-y-1">
                  <div className="font-black italic tracking-tighter text-[#99CB48] text-2xl">
                    {proposal?.client?.filingDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </div>
                </div>
             </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-white/5 pt-8 text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">
             <div>{proposal?.client?.footerMessage || "© WEBLOZY SOLUTIONS • GLOBAL OPERATIONS"}</div>
             <div className="text-[#99CB48]/60 tracking-[0.6em] underline decoration-[#99CB48]/20 underline-offset-8">
                {proposal?.client?.websiteUrl || "WWW.WEBLOZY.COM"}
             </div>
          </div>
       </div>
    </section>
  );
};

export default CoverPage;
