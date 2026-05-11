import { useRef, forwardRef } from "react";
import { Globe, Mail, MapPin, Clock, TrendingUp, CheckCircle2, Shield, Headphones, Database, AlertCircle, ShieldAlert, ExternalLink, Zap, DollarSign, Award, Target, Code, Cpu, Smartphone, Layout, UserCheck, Calculator, ShieldCheck } from "lucide-react";
import { Proposal } from "@/types/proposal";
import PortfolioGrid from "./PortfolioGrid";

interface ProposalPDFProps {
  proposal: Proposal;
}

import banner2Logo from "@/assets/banner2_logo.png";
import bannerLogo from "@/assets/banner_logo.png";

const PageWrapper = ({ children, pageNum, className = "", title = "" }: { children: React.ReactNode, pageNum: number, className?: string, title?: string }) => (
  <section className={`a4-page bg-white shadow-xl ${className}`}>
    <div className="watermark text-[#99CB48]/5">WEBLOZY</div>
    
    {/* Page Header with Logo - Swapped to Logo Left */}
    <div className="relative z-20 flex justify-between items-center mb-4 border-b pb-2 border-slate-100">
       <div className="flex items-center gap-2">
          <img src={bannerLogo} alt="Weblozy" style={{ height: '18px', width: 'auto', objectFit: 'contain' }} className="opacity-80" />
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{title}</div>
       </div>
       <div className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-300">AUTHORITY / WEBLOZY</div>
    </div>

    <div className="relative z-10 flex-1 flex flex-col content-fit">
      {children}
    </div>
    <div className="page-number text-[#99CB48]">Page {pageNum}</div>
  </section>
);

const ProposalPDF = forwardRef<HTMLDivElement, ProposalPDFProps>(({ proposal }, ref) => {
  let currentPage = 1;

  return (
    <div ref={ref} className="flex flex-col gap-6 items-center font-sans text-[#0B0E14] w-full">
      {/* PAGE 1: COVER - MASTERPIECE STYLE */}
      <section className="a4-page cover-gradient flex flex-col relative overflow-hidden text-white shadow-2xl pt-12" style={{ background: 'linear-gradient(135deg, #1668B2 0%, #0B0E14 100%)' }}>
         <div className="watermark opacity-[0.03]">WEBLOZY</div>
         <div className="page-number text-[#99CB48]">Page {currentPage++}</div>
         
         {/* Top Branding Section */}
         <div className="relative z-10 flex justify-between items-start mb-16 px-2">
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
               <div className="flex items-center justify-end gap-2 text-[8px] font-black text-[#99CB48] uppercase tracking-[0.5em]">
                  SECURE ARCHIVE V4.0
               </div>
            </div>
         </div>

         {/* Hero Strategic Title Section */}
         <div className="relative z-10 flex-1 flex flex-col justify-center mb-24">
            <div className="space-y-4">
               <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-[0.6em] text-[#99CB48] mb-4">
                  Executive Framework
               </div>
               <h1 className={`font-black tracking-[-0.05em] leading-[0.8] uppercase text-white drop-shadow-2xl transition-all duration-300 ${
                 (proposal?.client?.proposalTitle || "").length > 80 ? "text-4xl" : 
                 (proposal?.client?.proposalTitle || "").length > 50 ? "text-5xl" : 
                 (proposal?.client?.proposalTitle || "").length > 30 ? "text-7xl" : 
                 "text-8xl"
               }`}>
                 {proposal?.client?.proposalTitle ? (
                   (proposal?.client?.proposalTitle || '').split(' ').map((word, i) => (
                     <span key={i} className="inline-block mr-3">
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
               
               <div className="pt-10 flex items-center gap-6">
                  <div className="h-[2px] w-16 bg-white/10 shrink-0" />
                  <div className={`font-black uppercase tracking-[0.5em] text-white/40 transition-all duration-300 leading-relaxed ${
                    (proposal?.client?.subTitle || "").length > 80 ? "text-[8px]" : "text-[11px]"
                  }`}>
                    {proposal?.client?.subTitle || "Bespoke Technical & Operational Roadmap"}
                  </div>
               </div>
            </div>
         </div>

         {/* Master Data Footer Section */}
         <div className="relative z-10 space-y-8 mt-auto pb-4">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="grid grid-cols-4 gap-6">
               <div className="space-y-3">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Strategic Ally</div>
                  <div className="space-y-1">
                    <div className={`font-black uppercase leading-tight tracking-tight text-white ${
                      (proposal?.client?.companyName || "").length > 25 ? "text-sm" : "text-xl"
                    }`}>{proposal?.client?.companyName || "Enterprise Corp"}</div>
                    <div className="font-bold italic text-white/40 uppercase tracking-widest text-[8px]">
                      {proposal?.client?.clientName || "Valued Client"}
                    </div>
                  </div>
               </div>
               
               <div className="space-y-3 border-l pl-6 border-white/10">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Domain</div>
                  <div className="space-y-1">
                    <div className={`font-black uppercase leading-tight tracking-tight text-white ${
                      (proposal?.client?.industryTitle || "").length > 25 ? "text-sm" : "text-xl"
                    }`}>{proposal?.client?.industryTitle || "Business Automation"}</div>
                    <div className="font-black text-[#99CB48] uppercase tracking-[0.2em] text-[8px]">
                      {proposal?.client?.industryDomain || "Enterprise Sector"}
                    </div>
                  </div>
               </div>
               
               <div className="space-y-3 border-l pl-6 border-white/10">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Protocol</div>
                  <div className="space-y-2">
                    <div className="inline-block px-3 py-1 bg-[#99CB48]/20 text-[#99CB48] text-[8px] font-black uppercase tracking-[0.3em] rounded-md backdrop-blur-md">
                       {proposal?.client?.protocolTitle || "Confidential"}
                    </div>
                    <div className="font-black text-white/60 uppercase tracking-[0.4em] text-[8px]">
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
               <div>© WEBLOZY SOLUTIONS • GLOBAL OPERATIONS</div>
               <div className="text-[#99CB48]/60 tracking-[0.6em] underline decoration-[#99CB48]/20 underline-offset-8">
                  {proposal?.client?.websiteUrl || "WWW.WEBLOZY.COM"}
               </div>
            </div>
         </div>
      </section>

      {/* PAGE 2: PROBLEM STATEMENT */}
      <PageWrapper pageNum={currentPage++} title="Strategic Audit">
         <div className="mb-6 relative">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-[2px] bg-red-500" />
               <span className="text-[9px] font-black uppercase tracking-[0.6em] text-red-500">Problem Statement</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none">
               Operational <span className="text-red-500">Audit</span>
            </h2>
         </div>
         
         <div className="space-y-6 flex-1">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                  <AlertCircle size={60} />
               </div>
               <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 italic">Workflow Analysis</h3>
               <p className="text-lg leading-relaxed text-slate-700 italic font-light">
                  "{proposal?.situation?.currentWorkflow || proposal?.aiGeneratedContent?.problemStatement || "Awaiting workflow details..."}"
               </p>
            </div>

            {proposal?.situation?.challenges?.length > 0 && (
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Critical Challenges Identified</h4>
                  <div className="grid grid-cols-2 gap-4">
                     {(proposal?.situation?.challenges || []).map((challenge, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                           <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-black text-[10px]">
                              {i + 1}
                           </div>
                           <span className="text-xs font-bold uppercase tracking-tight text-slate-900 leading-tight">{challenge}</span>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            <div className="grid grid-cols-2 gap-8">
               <div className="p-10 border-2 border-slate-100 rounded-[2.5rem] bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                     <Clock className="w-6 h-6 text-red-500" />
                  </div>
                  <h4 className="font-black mb-4 uppercase text-xs tracking-[0.3em] text-slate-900">Efficiency Gaps</h4>
                  <p className="text-slate-500 leading-relaxed text-sm font-medium">{proposal?.situation?.inefficiencies || "Details on manual overhead and coordination gaps."}</p>
               </div>
               <div className="p-10 border-2 border-slate-100 rounded-[2.5rem] bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                     <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-black mb-4 uppercase text-xs tracking-[0.3em] text-slate-900">Revenue Leakage</h4>
                  <p className="text-slate-500 leading-relaxed text-sm font-medium">{proposal?.situation?.revenueLeakage || "Identifying points of loss like unattended leads."}</p>
               </div>
            </div>
         </div>
      </PageWrapper>

      {/* PAGE 3: OUR SOLUTION + DEMO */}
      <PageWrapper pageNum={currentPage++} title="Strategic Solution">
         <div className="mb-6 relative">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-[2px] bg-primary" />
               <span className="text-[9px] font-black uppercase tracking-[0.6em] text-primary">Proposed Architecture</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none">
               Strategic <span className="text-primary">Ecosystem</span>
            </h2>
         </div>

         <div className="space-y-10 flex-1">
            <div className="relative">
               <div className="absolute -left-2 top-0 bottom-0 w-[4px] bg-primary rounded-full" />
               <div className="p-6 bg-slate-50 rounded-2xl">
                  <p className="text-lg leading-relaxed text-slate-700 italic">
                     {proposal?.solution?.approach || "We propose building a custom automation system tailored to your specific business workflow."}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Implementation Pillars</h4>
                  <div className="space-y-2">
                     {(proposal?.solution?.approachPoints || []).map((point, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                           <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                              {i + 1}
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-tight text-slate-900">{point}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">System Connectivity</h4>
                     <div className="flex flex-wrap gap-2">
                        {(proposal?.solution?.integrations || []).map((item, i) => (
                           <div key={i} className="px-3 py-1.5 bg-slate-100 rounded-full text-[9px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
                              {item}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">User Architecture</h4>
                     <div className="grid grid-cols-2 gap-3">
                        {(proposal?.solution?.userRoles || []).map((role, i) => (
                           <div key={i} className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="text-[10px] font-bold uppercase text-slate-700">{role}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 flex flex-col items-center justify-center text-center">
                     <Zap size={40} className="text-primary mb-4 animate-pulse" />
                     <h5 className="font-black uppercase text-xs tracking-widest text-slate-900 mb-2">Live Demo Protocol</h5>
                     <p className="text-[10px] text-slate-500 font-medium mb-6">Experience the transformation in real-time</p>
                     {proposal?.solution?.demoLinks?.map((link, i) => (
                        <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:underline mb-2">
                           <ExternalLink size={12} /> {link.replace('https://', '')}
                        </a>
                     )) || (
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Awaiting Demo URL</span>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </PageWrapper>

      {/* PAGE 4: PERFORMANCE & IMPACT */}
      <PageWrapper pageNum={currentPage++} title="Strategic ROI">
         <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-[2px] bg-[#99CB48]" />
               <span className="text-[9px] font-black uppercase tracking-[0.6em] text-[#99CB48]">Performance & Impact</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none">
               Impact <span className="text-[#99CB48]">& ROI</span>
            </h2>
         </div>

         <div className="grid grid-cols-2 gap-8 flex-1">
            <div className="space-y-8">
               <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                     <TrendingUp size={80} />
                  </div>
                  <div className="relative z-10">
                     <h3 className="text-[8px] font-black text-[#99CB48] uppercase tracking-[0.6em] mb-6">Projected ROI</h3>
                     <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-5xl font-black tracking-tighter text-white leading-none">{proposal?.roi?.expectedROI || "250"}</span>
                        <span className="text-xl font-black text-[#99CB48]">%</span>
                     </div>
                     <div className="h-1 w-12 bg-[#99CB48] mb-3" />
                     <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 leading-relaxed">
                        Expected efficiency <br/>transformation factor
                     </p>
                  </div>
               </div>

               <div className="p-6 border-2 border-slate-100 rounded-[2.5rem] bg-white shadow-xl hover:border-[#99CB48]/20 transition-colors duration-500">
                  <h4 className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 mb-6">Economic Impact</h4>
                  <div className="space-y-5">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                           <DollarSign className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                           <p className="text-2xl font-black tracking-tighter text-slate-900 leading-tight">{proposal?.roi?.profitImpact || "$12,500"}</p>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-green-500">Monthly Revenue Uplift</p>
                        </div>
                     </div>
                     <div className="pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
                        <div>
                           <p className="text-lg font-black text-[#99CB48]">+{proposal?.roi?.productivityIncrease || "40"}%</p>
                           <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Productivity</p>
                        </div>
                        <div>
                           <p className="text-lg font-black text-[#F58323]">-{proposal?.roi?.costReduction || "15"}%</p>
                           <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">OpEx Savings</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="p-8 bg-[#99CB48]/5 rounded-[3rem] border border-[#99CB48]/10 flex flex-col shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-[#99CB48] rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#99CB48]">Time Velocity</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Resource Reclamation</p>
                     </div>
                  </div>
                  
                  <div className="mb-8">
                     <div className="text-6xl font-black tracking-tighter text-slate-900 leading-none mb-3">{proposal?.roi?.timeSaving || "120"}</div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Hours Saved / Month</p>
                  </div>

                  <div className="space-y-4 mt-auto">
                     <div className="flex justify-between items-end mb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Efficiency Index</span>
                        <span className="text-[10px] font-black text-[#99CB48]">85% Optimized</span>
                     </div>
                     <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-[#99CB48] rounded-full shadow-lg shadow-[#99CB48]/30" style={{ width: '85%' }} />
                     </div>
                     <p className="text-[9px] leading-relaxed text-slate-400 font-medium italic">
                        *Calculated based on current manual coordination overhead vs. proposed automated logic.
                     </p>
                  </div>
               </div>

               <div className="relative p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#99CB48]" />
                  <h5 className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 mb-3">Transformation Narrative</h5>
                  <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                     "{proposal?.roi?.impactSummary || proposal?.aiGeneratedContent?.businessImpact || "This transformation represents a strategic shift from manual overhead to automated excellence, driving sustainable profit margins and scalable growth architecture."}"
                  </p>
               </div>
            </div>
         </div>
      </PageWrapper>

      {/* PAGE 5: WHY WEBLOZY + EXPERIENCE & PORTFOLIO */}
      <PageWrapper pageNum={currentPage++} title="Corporate Authority">
         <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-[2px] bg-primary" />
               <span className="text-[9px] font-black uppercase tracking-[0.6em] text-primary">Why Weblozy</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none">
               Experience <span className="text-primary">& Portfolio</span>
            </h2>
         </div>

         <div className="space-y-12 flex-1">
            <div className="grid grid-cols-3 gap-8">
               <div className="p-8 border-2 border-slate-100 rounded-3xl bg-white text-center group hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                     <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{proposal?.experience?.yearsOfExperience || "5"}+</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Years Exp</div>
               </div>
               <div className="p-8 border-2 border-slate-100 rounded-3xl bg-white text-center group hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#99CB48]/10 flex items-center justify-center mx-auto mb-4">
                     <Target className="w-6 h-6 text-[#99CB48]" />
                  </div>
                  <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{proposal?.experience?.projectsCompleted || "50"}+</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Projects Done</div>
               </div>
               <div className="p-8 border-2 border-slate-100 rounded-3xl bg-white text-center group hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                     <Globe className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{proposal?.experience?.industriesServed?.length || "10"}+</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Industries</div>
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400">Strategic Alignment</h3>
               <p className="text-xl text-slate-700 font-light leading-relaxed italic border-l-4 border-primary pl-6 bg-slate-50 p-6 rounded-r-3xl">
                  "{proposal?.experience?.strategicSummary || proposal?.aiGeneratedContent?.whyWeblozy || "Weblozy brings a unique blend of engineering rigor and strategic foresight, ensuring your automation journey is built on a foundation of excellence."}"
               </p>
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Industries Served</h4>
               <div className="flex flex-wrap gap-2">
                  {(proposal?.experience?.industriesServed || ["E-commerce", "Fintech", "Manufacturing", "Logistics"]).map((industry, i) => (
                     <span key={i} className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                        {industry}
                     </span>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Corporate Portfolio</h4>
               <PortfolioGrid links={(proposal?.experience?.portfolioLinks || [])} />
               <div className="flex flex-wrap gap-4 mt-4">
                  {(proposal?.experience?.portfolioLinks || []).map((link, i) => (
                     <a key={i} href={link} className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.2em] hover:underline">
                        <ExternalLink size={10} /> {link.replace('https://', '')}
                     </a>
                  ))}
               </div>
            </div>
         </div>
      </PageWrapper>

      {/* PAGE 6: TECHNICAL FEATURES + TECH STACK */}
      <PageWrapper pageNum={currentPage++} title="Technical Architecture">
         <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-[2px] bg-primary" />
               <span className="text-[9px] font-black uppercase tracking-[0.6em] text-primary">Technical Stack</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none">
               Tech <span className="text-primary">Ecosystem</span>
            </h2>
         </div>

         <div className="space-y-12 flex-1">
            <div className="grid grid-cols-2 gap-8">
               <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-3 mb-4">
                     <Layout className="w-5 h-5 text-primary" />
                     <h4 className="font-black uppercase text-[10px] tracking-widest text-slate-900">Frontend Stack</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                     {(proposal?.techArchitecture?.frontendStack || []).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500">
                           {tech}
                        </span>
                     ))}
                  </div>
               </div>
               <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-3 mb-4">
                     <Code className="w-5 h-5 text-primary" />
                     <h4 className="font-black uppercase text-[10px] tracking-widest text-slate-900">Backend Stack</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                     {(proposal?.techArchitecture?.backendStack || []).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500">
                           {tech}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="flex items-center gap-4 p-5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                  <Database className="w-6 h-6 text-[#99CB48]" />
                  <div>
                     <div className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-1">Database Architecture</div>
                     <div className="text-lg font-black text-slate-900 uppercase tracking-tighter">{proposal?.techArchitecture?.database || "PostgreSQL / MongoDB"}</div>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <div>
                     <div className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-1">Cloud Hosting</div>
                     <div className="text-lg font-black text-slate-900 uppercase tracking-tighter">{proposal?.techArchitecture?.hosting || "AWS / Google Cloud"}</div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Technical Modules</h4>
               <div className="grid grid-cols-3 gap-4">
                  {(proposal?.solution?.selectedModules || []).map((module, i) => (
                     <div key={i} className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-between group">
                        <span className="text-[9px] font-black uppercase tracking-widest">{module?.name}</span>
                        <CheckCircle2 size={12} className="text-[#99CB48]" />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </PageWrapper>

      {/* PAGE 7: PROJECT INVESTMENT + ROI SETTLEMENT */}
      <PageWrapper pageNum={currentPage++} title="Commercial Framework">
         <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-[2px] bg-primary" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Financials</span>
               </div>
               <div className="px-2 py-0.5 bg-slate-900 rounded flex items-center gap-1">
                  <Zap size={8} className="text-primary" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-white">ROI Protocol</span>
               </div>
            </div>
            <div className="flex justify-between items-end">
               <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none">
                  Project <span className="text-primary italic">Investment.</span>
               </h2>
               <div className="text-right">
                  <div className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-300">Settlement Matrix</div>
               </div>
            </div>
         </div>

         <div className="space-y-10 flex-1">
            <div className="grid grid-cols-[1.2fr,1fr] gap-8 items-start">
               {/* Financial Breakdown Column */}
               <div className="space-y-8">
                  <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                     <div className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Core Valuation</span>
                           <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{Number(proposal?.pricing?.coreValuation || 0).toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-start">
                           <div className="flex items-start gap-3">
                              <div className="mt-1 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                 <Zap size={8} />
                              </div>
                              <div className="space-y-0.5">
                                 <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{proposal?.pricing?.discountPercentage || 15}% Strategic Discount</div>
                                 <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Additional Rebate</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-lg font-black text-primary tracking-tighter">- ₹{((Number(proposal?.pricing?.coreValuation || 0) * Number(proposal?.pricing?.discountPercentage || 0)) / 100).toLocaleString()}</div>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Net Investment</span>
                           <span className="text-3xl font-black text-slate-900 tracking-tighter">
                              ₹{(Number(proposal?.pricing?.coreValuation || 0) - (Number(proposal?.pricing?.coreValuation || 0) * Number(proposal?.pricing?.discountPercentage || 0)) / 100).toLocaleString()}
                           </span>
                        </div>

                        <div className="flex justify-between items-center text-slate-400">
                           <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Tax Provision ({proposal?.pricing?.taxRate || "18"}%)</span>
                           <span className="text-sm font-black text-slate-400 tracking-tight">+ ₹{((Number(proposal?.pricing?.coreValuation || 0) - (Number(proposal?.pricing?.coreValuation || 0) * Number(proposal?.pricing?.discountPercentage || 0)) / 100) * (Number(proposal?.pricing?.taxRate || 18) / 100)).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  {/* Settlement Note */}
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 flex items-center gap-6">
                     <div className="p-4 bg-white rounded-2xl shadow-sm">
                        <Database className="w-6 h-6 text-primary" />
                     </div>
                     <p className="text-[9px] leading-relaxed text-slate-400 font-medium uppercase tracking-[0.2em]">
                        All values are in <span className="text-slate-900 font-black">INR</span>. The pricing reflects our <span className="text-slate-900 font-black">master-grade</span> service commitment and is valid for 30 business days from the date of issuance.
                     </p>
                  </div>
               </div>

               {/* Final Commitment Card */}
               <div className="bg-slate-900 rounded-2xl p-6 flex flex-col justify-center text-center relative overflow-hidden shadow-2xl h-full min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                     <TrendingUp size={80} className="text-white" />
                  </div>
                  <h4 className="text-[9px] font-black uppercase tracking-[0.6em] text-white/40 mb-6">Final Commitment</h4>
                  <div className="text-6xl font-black text-white tracking-tighter mb-3 leading-none">
                     ₹{(Number(proposal?.pricing?.coreValuation || 0) - (Number(proposal?.pricing?.coreValuation || 0) * Number(proposal?.pricing?.discountPercentage || 0)) / 100).toLocaleString()}
                  </div>
                  <div className="inline-block mx-auto px-5 py-1.5 bg-[#99CB48] text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-full mb-6">
                     {proposal?.pricing?.discountPercentage || 15}% OFF
                  </div>
                  <div className="p-3 border border-white/10 bg-white/5 rounded-xl backdrop-blur-md mb-4">
                     <div className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em]">+ {proposal?.pricing?.taxRate || "18"}% GST EXTRA</div>
                  </div>
                  <p className="text-[7px] font-bold text-white/20 uppercase tracking-[0.4em] italic mb-6">* Strategic Valuation</p>
                  
                  <div className="space-y-3 pt-6 border-t border-white/5">
                     <div className="flex items-center gap-2 justify-center">
                        <div className="w-1 h-1 rounded-full bg-[#99CB48]" />
                        <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Verified Settlement Protocol</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Disbursement Milestones */}
            <div className="space-y-6 pt-6">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-slate-900 rounded-lg">
                        <Layout size={14} className="text-white" />
                     </div>
                     <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900">Disbursement Milestones</h4>
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-300">{proposal?.pricing?.milestones?.length || 3} Phases Defined</div>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  {(proposal?.pricing?.milestones || []).map((milestone, i) => (
                     <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm relative group hover:border-primary transition-all">
                        <div className="absolute top-3 right-4 text-[9px] font-black text-slate-100 uppercase group-hover:text-primary/10">M0{i+1}</div>
                        <div className="mb-3">
                           <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{milestone.name}</div>
                           <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black tracking-tighter text-slate-900">{milestone.percentage}</span>
                              <span className="text-sm font-black text-primary">%</span>
                           </div>
                        </div>
                        <p className="text-[8px] text-slate-500 font-medium leading-tight mb-4 line-clamp-2">{milestone.description}</p>
                        <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                           <span className="text-[7px] font-black uppercase tracking-widest text-slate-300">Phase</span>
                           <span className="text-[9px] font-black text-primary">{milestone.percentage}%</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* ROI Settlement Box */}
            <div className="mt-6 p-5 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden">
               <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-primary rounded-xl">
                     <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-lg font-black uppercase tracking-tighter text-slate-900 leading-none">ROI Settlement Logic</h4>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">Quantum Value Projection</p>
                  </div>
                  <div className="ml-auto flex gap-4">
                     <div className="text-center">
                        <div className="text-[7px] font-black uppercase text-slate-400 mb-1">Efficiency</div>
                        <div className="text-xl font-black text-primary tracking-tighter">+{proposal?.roi?.revenueIncrease || "25"}%</div>
                     </div>
                     <div className="text-center">
                        <div className="text-[7px] font-black uppercase text-slate-400 mb-1">ROI Index</div>
                        <div className="text-xl font-black text-slate-900 tracking-tighter">{proposal?.roi?.expectedROI || "250"}%</div>
                     </div>
                  </div>
               </div>
               <div className="mt-4 grid grid-cols-[1fr,1.5fr] gap-6 relative z-10">
                  <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-primary/10 italic text-[9px] font-black text-slate-700 leading-relaxed shadow-sm">
                     ROI = [(Net Profit Impact - Total Investment) / Total Investment] × 100
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium leading-relaxed border-l-2 border-primary/20 pl-4 italic">
                     "{proposal?.pricing?.roiLogic || "Investment recovered within the first 6-8 months through operational reclamation."}"
                  </p>
               </div>
            </div>

            {/* Footer Settlement Line */}
            <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">
               <div className="flex items-center gap-3">
                  <CheckCircle2 size={12} className="text-[#99CB48]" />
                  <span>Master-grade Financial Integrity Guaranteed</span>
               </div>
               <div>Authorized Verification Required</div>
            </div>
         </div>
      </PageWrapper>

      {/* PAGE 8: POLICIES & COMMITMENTS - MULTI-PILLAR TRUST FRAMEWORK */}
      <PageWrapper pageNum={currentPage++} title="Service Pledges">
         <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-[2px] bg-primary" />
               <span className="text-[9px] font-black uppercase tracking-[0.6em] text-primary">Master-Grade Guarantees</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none">
               Weblozy <span className="text-primary">Commitments</span>
            </h2>
         </div>

         <div className="space-y-8 flex-1">
            {/* 4-QUADRANT TRUST GRID */}
            <div className="grid grid-cols-2 gap-6">
               {/* 1. Lifetime Support */}
               <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm space-y-5 relative overflow-hidden group hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                     <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-tight">Lifetime Engineering <br/>Stability</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Weblozy provides <span className="text-slate-900 font-bold">Lifetime Free Maintenance</span> for our custom software. If any technical issue or bug arises within our original codebase, our engineers will rectify it <span className="text-primary font-black">Free of Cost</span>, indefinitely.
                     </p>
                  </div>
               </div>

               {/* 2. Asset Sovereignty */}
               <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm space-y-5 relative overflow-hidden group hover:border-[#1AA6E1]/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#1AA6E1]/10 flex items-center justify-center text-[#1AA6E1]">
                     <Code size={24} />
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-tight">100% Asset <br/>Sovereignty</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Complete transparency. Weblozy hands over <span className="text-slate-900 font-bold">100% Source Code</span> and all technical documentation. You maintain full <span className="text-slate-900 font-bold">Intellectual Property Rights</span> and absolute control over your digital infrastructure.
                     </p>
                  </div>
               </div>

               {/* 3. Fiscal Transparency */}
               <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm space-y-5 relative overflow-hidden group hover:border-[#99CB48]/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#99CB48]/10 flex items-center justify-center text-[#99CB48]">
                     <DollarSign size={24} />
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-tight">Zero Hidden <br/>Liabilities</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Our pricing is absolute. There are <span className="text-slate-900 font-bold">No Monthly Subscription Traps</span> or hidden licensing fees for our code. Once the project is delivered, you own the technology without any recurring Weblozy service tax.
                     </p>
                  </div>
               </div>

               {/* 4. Transition Excellence */}
               <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm space-y-5 relative overflow-hidden group hover:border-[#F58323]/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#F58323]/10 flex items-center justify-center text-[#F58323]">
                     <UserCheck size={24} />
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-tight">Technical Handover <br/>& Transfer</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        We ensure your team is ready. Weblozy provides <span className="text-slate-900 font-bold">Hands-on Knowledge Transfer</span> and complete technical training during deployment, ensuring your internal operations can manage the solution effectively.
                     </p>
                  </div>
               </div>
            </div>

            {/* INTEGRITY PROTOCOL BANNER */}
            <div className="p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-xl">
               <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                  <ShieldAlert size={180} />
               </div>
               <div className="flex items-start gap-8 relative z-10">
                  <div className="p-4 bg-primary rounded-2xl shadow-lg shadow-primary/20 shrink-0">
                     <ShieldAlert className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <h4 className="text-xl font-black uppercase tracking-tighter text-white leading-none">Integrity Protocol <span className="text-primary">•</span> Note</h4>
                        <div className="px-3 py-1 bg-white/10 text-white/40 text-[7px] font-black uppercase tracking-[0.3em] rounded-md">Clause V4.2</div>
                     </div>
                     <p className="text-[13px] text-white/50 leading-relaxed font-medium uppercase tracking-widest italic border-l-2 border-primary/40 pl-6">
                        "The Lifetime Engineering Stability guarantee remains valid as long as the original code is managed by Weblozy. Modifications performed by <span className="text-primary font-black underline decoration-primary/30 underline-offset-4">Third-Party Personnel</span> or <span className="text-primary font-black underline decoration-primary/30 underline-offset-4">AI-Generation Tools</span> will terminate the free support protocol for that specific module."
                     </p>
                  </div>
               </div>
               <div className="mt-8 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.5em] text-white/20 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-1 h-1 rounded-full bg-primary" />
                     <span>Non-Negotiable Pledges</span>
                  </div>
                  <span>Verified Security Standard</span>
               </div>
            </div>
         </div>
      </PageWrapper>

      {/* PAGE 9: CTA & CLOSING - THE STRATEGIC BOOKEND */}
      <section className="a4-page cover-gradient flex flex-col relative overflow-hidden text-white shadow-2xl pt-12" style={{ background: 'linear-gradient(135deg, #1668B2 0%, #0B0E14 100%)' }}>
         <div className="watermark opacity-[0.03]">WEBLOZY</div>
         <div className="page-number text-[#99CB48]">Page {currentPage++}</div>
         
         {/* Top Branding Section (Mirror Page 1) */}
         <div className="relative z-10 flex justify-between items-start mb-16 px-2">
            <div className="space-y-4 max-w-[65%]">
               <img src={banner2Logo} alt="Weblozy" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} className="opacity-100" />
               <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-[#99CB48]" />
                  <div className="text-[10px] font-black tracking-[0.5em] text-white/60 uppercase">Strategic Finality</div>
               </div>
            </div>
            
            <div className="text-right space-y-4">
               <div className="space-y-3">
                  <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Release Protocol</div>
                  <div className="inline-flex items-center gap-3 px-6 py-2.5 border-[1.5px] border-white/10 rounded-full bg-white/5 backdrop-blur-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1AA6E1] shadow-lg shadow-[#1AA6E1]/40" />
                    <span className="text-sm font-black tracking-widest text-white">#{proposal?.client?.referenceId || "WBL-MASTER-001"}</span>
                  </div>
               </div>
               <div className="flex items-center justify-end gap-2 text-[8px] font-black text-[#99CB48] uppercase tracking-[0.5em]">
                  SECURE ARCHIVE V4.2
               </div>
            </div>
         </div>

         {/* Hero Strategic Title Section */}
         <div className="relative z-10 flex-1 flex flex-col justify-center mb-24">
            <div className="space-y-4">
               <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-[0.6em] text-[#99CB48] mb-4">
                  Final Authorization
               </div>
               <h1 className="text-[85px] font-black tracking-[-0.05em] leading-[0.8] uppercase text-white drop-shadow-2xl">
                  Let's <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1AA6E1] via-[#99CB48] to-[#99CB48]">Collaborate.</span>
               </h1>
               
               <div className="pt-10 flex items-center gap-6">
                  <div className="h-[2px] w-16 bg-white/10 shrink-0" />
                  <div className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 leading-relaxed max-w-sm">
                     Weblozy is ready to architect your digital future. Our technical expertise is at your disposal.
                  </div>
               </div>
            </div>
         </div>

         {/* Master Data Footer Section (Contact Matrix) */}
         <div className="relative z-10 space-y-8 mt-auto pb-4">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="grid grid-cols-4 gap-6">
               <div className="space-y-3">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Digital Core</div>
                  <div className="space-y-1">
                    <div className="font-black uppercase leading-tight tracking-tight text-white text-xl">
                       {proposal?.closing?.contactEmail || "HELLO@WEBLOZY.COM"}
                    </div>
                    <div className="font-bold italic text-white/40 uppercase tracking-widest text-[8px]">
                       Primary Access Point
                    </div>
                  </div>
               </div>
               
               <div className="space-y-3 border-l pl-6 border-white/10">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Voice Port</div>
                  <div className="space-y-1">
                    <div className="font-black uppercase leading-tight tracking-tight text-white text-xl">
                       {proposal?.closing?.contactPhone || "+91 96678 96604"}
                    </div>
                    <div className="font-black text-[#99CB48] uppercase tracking-[0.2em] text-[8px]">
                       Direct Strategic Liaison
                    </div>
                  </div>
               </div>
               
               <div className="space-y-3 border-l pl-6 border-white/10">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Network Port</div>
                  <div className="space-y-1">
                    <div className="font-black uppercase leading-tight tracking-tight text-white text-xl truncate">
                       {proposal?.client?.websiteUrl || "WWW.WEBLOZY.COM"}
                    </div>
                    <div className="font-black text-white/60 uppercase tracking-[0.4em] text-[8px]">
                       Global Digital Presence
                    </div>
                  </div>
               </div>

               <div className="space-y-3 border-l pl-6 border-white/10">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Global HQ</div>
                  <div className="space-y-1">
                    <div className="font-black uppercase leading-tight tracking-tight text-white text-xl">
                       Noida, India
                    </div>
                    <div className="font-black text-[#1AA6E1] uppercase tracking-[0.2em] text-[8px]">
                       Operations Command Center
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center text-[8px] font-black text-white/20 uppercase tracking-[0.5em] pt-4">
               <div>© 2026 Weblozy Solutions • Quantum Secured</div>
               <div className="flex items-center gap-4">
                  <span>SEC_ID // 09</span>
                  <div className="h-3 w-[1px] bg-white/10" />
                  <span>Authority Confirmed</span>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
});

ProposalPDF.displayName = "ProposalPDF";

export default ProposalPDF;
