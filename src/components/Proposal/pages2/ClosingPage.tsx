import React from "react";
import { Proposal } from "@/types/proposal";
import banner2Logo from "@/assets/banner2_logo.png";
import { Phone, Mail, Globe, MapPin, Send, AtSign, Share2, ExternalLink } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const ClosingPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  return (
    <section className="a4-page flex flex-col relative overflow-hidden text-white shadow-2xl" style={{ background: 'linear-gradient(160deg, #0B0E14 0%, #0F1923 40%, #0B0E14 100%)' }}>
       {/* Subtle Grid Pattern */}
       <div className="absolute inset-0 opacity-[0.03]" style={{
         backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
         backgroundSize: '40px 40px'
       }} />
       
       {/* Accent Glow */}
       <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#1AA6E1]/5 blur-[120px]" />
       <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-[#99CB48]/5 blur-[100px]" />

       <div className="page-number text-[#99CB48]">Page {pageNum}</div>

       {/* ── Top Bar ── */}
       <div className="relative z-10 flex items-center justify-between mb-16">
          <div className="flex items-center gap-5">
             <img src={banner2Logo} alt="Weblozy" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
             <div className="h-5 w-[1px] bg-white/10" />
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/30">Strategic Operations</span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#99CB48]/80">Confidential Proposal • 2026</span>
       </div>

       {/* ── Badge ── */}
       <div className="relative z-10 mb-6">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg">
             <div className="w-2 h-2 rounded-full bg-[#99CB48] shadow-[0_0_10px_#99CB48]" />
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/50">Establish Connection</span>
          </div>
       </div>

       {/* ── Hero Title ── */}
       <div className="relative z-10 mb-10">
          <h1 className="text-[76px] font-black leading-[0.85] uppercase tracking-[-0.03em]">
             <span className="text-white italic">Let's</span><br />
             <span className="text-[#99CB48]">Collaborate.</span>
          </h1>
       </div>

       {/* ── Main Content Grid ── */}
       <div className="relative z-10 grid grid-cols-5 gap-8 flex-1">
          
          {/* Left: 2 cols — Description */}
          <div className="col-span-2 flex flex-col justify-end">
             <p className="text-[13px] font-black uppercase leading-[1.8] text-white/60 mb-8">
                Our architecture is engineered for precision. We are ready to deploy your strategic roadmap and scale your operations with master-grade automation.
             </p>

             {/* Support Card */}
             <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#99CB48]">Support Protocol</span>
                <h3 className="text-[20px] font-black uppercase tracking-tight leading-[1.1] text-white">24/7 Technical Liaison</h3>
                <p className="text-[9px] font-medium text-white/25 leading-relaxed">
                   Integrated support systems ensuring zero downtime and continuous operational evolution.
                </p>
             </div>
          </div>

          {/* Right: 3 cols — Contact Cards */}
          <div className="col-span-3 flex flex-col gap-4 justify-center">
             {/* Voice Ports */}
             <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-[#1AA6E1]/10 border border-[#1AA6E1]/10 flex items-center justify-center shrink-0">
                   <Phone size={22} className="text-[#1AA6E1]" />
                </div>
                <div>
                   <div className="text-[7px] font-black uppercase tracking-[0.4em] text-white/25 mb-1.5">Voice Ports</div>
                   <div className="text-[20px] font-black tracking-[-0.02em] text-white leading-none">{proposal?.closing?.contactPhone || "+91 96678 96604"}</div>
                   <div className="text-[12px] font-bold text-white/20 tracking-wide mt-1">+1 320 433 0111</div>
                </div>
             </div>

             {/* Digital Core */}
             <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                   <Mail size={22} className="text-white/50" />
                </div>
                <div>
                   <div className="text-[7px] font-black uppercase tracking-[0.4em] text-white/25 mb-1.5">Digital Core</div>
                   <div className="text-[18px] font-black tracking-tight text-white leading-none">{proposal?.closing?.contactEmail || "info@weblozy.com"}</div>
                </div>
             </div>

             {/* Network Port */}
             <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-[#99CB48]/10 border border-[#99CB48]/10 flex items-center justify-center shrink-0">
                   <Globe size={22} className="text-[#99CB48]" />
                </div>
                <div>
                   <div className="text-[7px] font-black uppercase tracking-[0.4em] text-white/25 mb-1.5">Network Port</div>
                   <a href={proposal?.client?.websiteUrl || "https://www.weblozy.com"} target="_blank" rel="noopener noreferrer" className="text-[18px] font-black tracking-tight text-white leading-none uppercase hover:text-[#99CB48] transition-colors">
                      {proposal?.client?.websiteUrl?.replace('https://', '') || "www.weblozy.com"}
                   </a>
                </div>
             </div>

             {/* Social Row */}
             <div className="flex items-center gap-5 pt-1">
                <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/15">Digital Expansion</span>
                <div className="flex gap-2.5">
                   {[Globe, Send, AtSign, Share2].map((Icon, i) => (
                      <div key={i} className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                         <Icon size={14} className="text-white/25" />
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>

       {/* ── Footer ── */}
       <div className="relative z-10 mt-10 space-y-5">
          <div className="h-[1px] w-full bg-white/[0.04]" />
          
          <div className="flex items-center gap-2">
             <MapPin size={10} className="text-[#99CB48]/40" />
             <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/20">Global HQ</span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
             Weblozy HQ, New Delhi, India
          </div>

          <div className="h-[1px] w-full bg-white/[0.04]" />

          <div className="flex justify-between items-end">
             <div>
                <div className="text-[9px] font-black uppercase tracking-tight text-white/30">Weblozy Strategic Systems</div>
                <div className="text-[6px] font-bold uppercase tracking-[0.3em] text-white/10 mt-0.5">Global Delivery Protocol</div>
             </div>
             <div className="flex items-center gap-4 text-[6px] font-black text-white/10 uppercase tracking-[0.4em]">
                <span>© 2026 Weblozy • Quantum Secured</span>
                <div className="h-2.5 w-[1px] bg-white/[0.06]" />
                <span>SEC_ID // {String(pageNum).padStart(2, '0')}</span>
             </div>
          </div>
       </div>
    </section>
  );
};

export default ClosingPage;
