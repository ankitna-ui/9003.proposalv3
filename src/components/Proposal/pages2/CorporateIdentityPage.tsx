import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { Target, ShieldCheck, Zap, Rocket, Star, Code, ShoppingCart, UserCheck, Database, Layout } from "lucide-react";
import aboutIllustration from "@/assets/image.png";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const CorporateIdentityPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  return (
    <PageWrapper pageNum={pageNum} title="Corporate Identity">
       <div className="flex flex-col h-full space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-start">
             <div>
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1AA6E1] mb-2">Corporate Identity</div>
                <h2 className="text-[54px] font-black uppercase tracking-tighter leading-[0.8] text-[#0B0E14]">
                   About <br /> Company.
                </h2>
             </div>
             <div className="flex gap-4">
                <div className="w-[120px] h-[90px] bg-[#0B0E14] rounded-3xl flex flex-col items-center justify-center text-white p-4 shadow-xl">
                   <div className="text-3xl font-black tracking-tighter leading-none mb-1">{proposal?.experience?.yearsOfExperience || "10+"}</div>
                   <div className="text-[7px] font-black uppercase tracking-widest opacity-80">Years Precision</div>
                </div>
                <div className="w-[120px] h-[90px] bg-[#99CB48] rounded-3xl flex flex-col items-center justify-center text-[#0B0E14] p-4 shadow-xl">
                   <div className="text-3xl font-black tracking-tighter leading-none mb-1">{proposal?.experience?.projectsCompleted || "250+"}</div>
                   <div className="text-[7px] font-black uppercase tracking-widest opacity-80">Projects Built</div>
                </div>
                <div className="w-[120px] h-[90px] bg-[#1AA6E1] rounded-3xl flex flex-col items-center justify-center text-white p-4 shadow-xl">
                   <div className="text-3xl font-black tracking-tighter leading-none mb-1">{proposal?.experience?.industriesServed?.length || "15+"}</div>
                   <div className="text-[7px] font-black uppercase tracking-widest opacity-80">Industries</div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8 flex-1">
             {/* Left Column: Introduction & Why Weblozy */}
             <div className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 flex flex-col space-y-8">
                <div className="space-y-4">
                   <div className="text-[#1AA6E1] text-[9px] font-black uppercase tracking-[0.4em]">Introduction</div>
                   <p className="text-[13px] font-black uppercase text-slate-700 leading-relaxed">
                      We at Weblozy are committed to providing you with the best solution in all our online services and the best support in the industry. Weblozy is a leading and reputed business automation, SaaS, web development and digital marketing company based out of New Delhi.
                   </p>
                </div>

                <div className="h-[1px] w-full bg-slate-200" />

                <div className="space-y-6">
                   <div className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Why Weblozy?</div>
                   <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      {[
                         { icon: <Target className="text-[#1AA6E1]" size={16} />, title: "Creatively Customized" },
                         { icon: <ShieldCheck className="text-[#99CB48]" size={16} />, title: "Reliably Responsive" },
                         { icon: <Zap className="text-[#1AA6E1]" size={16} />, title: "Effortlessly Efficient" },
                         { icon: <Rocket className="text-[#99CB48]" size={16} />, title: "Securely Streamlined" },
                         { icon: <Star className="text-yellow-500" size={16} />, title: "Exceptionally Experiential" }
                      ].map((item, i) => (
                         <div key={i} className="flex items-center gap-3">
                            <div className="shrink-0">{item.icon}</div>
                            <span className="text-[9px] font-black uppercase tracking-tight text-slate-800 leading-tight">{item.title}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right Column: Innovation Hub & Ecosystem */}
             <div className="space-y-6">
                {/* Innovation Hub Image Card */}
                <div className="relative h-[200px] rounded-[3rem] overflow-hidden border border-slate-100 group shadow-lg">
                   <img src={aboutIllustration} alt="Innovation Hub" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                   <div className="absolute bottom-8 left-8 text-white">
                      <h4 className="text-xl font-black uppercase tracking-tighter">Innovation Hub.</h4>
                      <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/60">Global Delivery HQ</div>
                   </div>
                </div>

                {/* Full-Stack Ecosystem */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 space-y-6 shadow-sm flex-1">
                   <div className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Full-Stack Ecosystem</div>
                   <div className="space-y-4">
                      {[
                         { icon: <Layout size={10} />, name: "Business Automation" },
                         { icon: <ShoppingCart size={10} />, name: "Ecommerce Development" },
                         { icon: <Code size={10} />, name: "Software Development" },
                         { icon: <UserCheck size={10} />, name: "Linkedin Automation" },
                         { icon: <Database size={10} />, name: "Sass Development / Consultant" }
                      ].map((item, i) => (
                         <div key={i} className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#99CB48]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">{item.name}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Quote Section */}
          <div className="bg-[#0B0E14] rounded-full py-8 px-12 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-r from-[#1AA6E1]/10 via-transparent to-[#99CB48]/10" />
             <p className="relative z-10 text-white text-[20px] font-black uppercase tracking-tight italic">
                "We have completely mastered the art of digital technology."
             </p>
          </div>

          {/* Manifesto Footer Section */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 flex items-center justify-between relative overflow-hidden border border-slate-800">
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white">
                   <Layout size={24} />
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Weblozy Manifesto</div>
                   <p className="text-[9px] font-bold text-white/60 uppercase max-w-lg leading-relaxed">
                      Are you ready to break free from the monochrome monotony of traditional tech solutions? Welcome to Weblozy. Where your business isn't just optimized — it's immortalized.
                   </p>
                </div>
             </div>
             <div className="text-right space-y-1 relative z-10">
                <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Fiscal Status</div>
                <div className="text-[#1AA6E1] text-[10px] font-black uppercase tracking-widest">{proposal?.experience?.partnerStatus || "Active Partner"}</div>
             </div>
          </div>
       </div>
    </PageWrapper>
  );
};

export default CorporateIdentityPage;
