import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { ArrowUpRight, Monitor, ShieldCheck, Layout } from "lucide-react";

// Using the generated images that represent these specific client projects
import project1 from "/Users/weblozy/.gemini/antigravity/brain/e8763d39-6b99-4e49-8a55-2b079aa22878/portfolio_project_1_1778745355177.png"; // Enterprise
import project2 from "/Users/weblozy/.gemini/antigravity/brain/e8763d39-6b99-4e49-8a55-2b079aa22878/portfolio_project_2_1778745371499.png"; // Precision/Manufacturing
import project3 from "/Users/weblozy/.gemini/antigravity/brain/e8763d39-6b99-4e49-8a55-2b079aa22878/portfolio_project_3_1778745387480.png"; // AI Analytics
import project4 from "/Users/weblozy/.gemini/antigravity/brain/e8763d39-6b99-4e49-8a55-2b079aa22878/portfolio_project_4_1778745407965.png"; // Modern UX

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const CorporateAuthorityPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  // Default values to fall back to if user hasn't provided inputs
  const defaultProjects = [
    { title: "Precision Manufacturing", url: "https://snow-wombat-148981.hostingersite.com/", image: project2, category: "Industrial E-commerce" },
    { title: "Modern UX Framework", url: "https://weblozydemocool.netlify.app/", image: project4, category: "SaaS Interface" },
    { title: "AI Analytics Protocol", url: "https://weblozyaianalyzer.vercel.app/", image: project3, category: "Intelligent Systems" },
    { title: "Enterprise Ecosystem", url: "https://weblozyenterprisedemo.netlify.app/", image: project1, category: "Corporate Infrastructure" }
  ];

  // Map user inputs to the display format
  const projects = [0, 1, 2, 3].map((i) => {
    const rawData = proposal?.experience?.portfolioLinks[i] || "";
    const [title, url] = rawData.split('|');
    return {
      title: title || defaultProjects[i].title,
      url: url || defaultProjects[i].url,
      image: [project2, project4, project3, project1][i],
      category: defaultProjects[i].category,
      id: `0${i + 1}`
    };
  });

  return (
    <PageWrapper pageNum={pageNum} title="Project Portfolio">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-[#3ABEF9]/10 rounded text-[10px] font-black text-[#3ABEF9] uppercase tracking-widest mb-4">
            Section 06
          </div>
          <div className="flex justify-between items-end">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none">
              Project Portfolio.
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
               <div className="flex -space-x-2">
                 <div className="w-4 h-4 rounded-full bg-[#3ABEF9] border border-white" />
                 <div className="w-4 h-4 rounded-full bg-slate-300 border border-white" />
                 <div className="w-4 h-4 rounded-full bg-slate-200 border border-white" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Live Network</span>
            </div>
          </div>
          
          {/* Sub Navigation */}
          <div className="mt-8 flex gap-8 border-b border-slate-100 pb-4">
            {["Identity", "Production Link", "Performance"].map((item, i) => (
              <span key={i} className={`text-[9px] font-black uppercase tracking-[0.2em] ${i === 1 ? 'text-[#3ABEF9] border-b-2 border-[#3ABEF9]' : 'text-slate-300'}`}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-12 flex-1">
          {projects.map((project, i) => (
            <a 
              href={project.url.startsWith('http') ? project.url : `https://${project.url}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              key={i} 
              className="group space-y-4 block transition-all duration-500 hover:-translate-y-2"
            >
              {/* Browser Mockup */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 bg-white aspect-[4/3] group-hover:shadow-[#3ABEF9]/20 group-hover:border-[#3ABEF9]/30">
                {/* Browser Toolbar */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-slate-50 border-b border-slate-100 flex items-center px-4 justify-between z-10 group-hover:bg-white transition-colors">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-1">
                     <Monitor size={8} className="text-slate-400" />
                     <span className="text-[6px] font-black uppercase text-slate-400 tracking-widest">Live Preview</span>
                  </div>
                </div>
                {/* Content Image */}
                <div className="pt-6 h-full w-full relative">
                  <img 
                    src={`https://api.microlink.io/?url=${encodeURIComponent(project.url.startsWith('http') ? project.url : `https://${project.url}`)}&screenshot=true&embed=screenshot.url`} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    onLoad={(e) => {
                      // Remove any loading styles if necessary
                      e.currentTarget.style.opacity = '1';
                    }}
                    onError={(e) => {
                      // Immediate fallback to the high-end generated assets
                      e.currentTarget.src = project.image;
                    }}
                  />
                  {/* Click Overlay */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="px-4 py-2 bg-white rounded-full shadow-xl flex items-center gap-2">
                       <ArrowUpRight size={12} className="text-[#3ABEF9]" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Launch Project</span>
                    </div>
                  </div>
                </div>
                {/* Overlay Number */}
                <div className="absolute top-10 right-6 text-6xl font-black text-black/5 select-none italic">
                  {project.id}
                </div>
              </div>

              {/* Project Info */}
              <div className="px-4 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[#3ABEF9]">{project.category}</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-[#0B0E14] group-hover:text-[#3ABEF9] transition-colors">{project.title}</h3>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-[#3ABEF9] group-hover:text-[#3ABEF9] transition-all">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Identity Protocol */}
        <div className="mt-auto pt-8">
          <div className="bg-[#0B0E14] rounded-3xl p-6 flex items-center justify-between border border-white/5">
             <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 bg-[#99CB48] rounded-full shadow-[0_0_10px_#99CB48]" />
                <div className="flex items-center gap-3 border-r border-white/10 pr-6 mr-6">
                   <Layout size={14} className="text-[#99CB48]" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Identity Protocol</span>
                </div>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Live deployments verified via global secure nodes.</span>
             </div>
             <Monitor size={16} className="text-[#3ABEF9] opacity-50" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CorporateAuthorityPage;
