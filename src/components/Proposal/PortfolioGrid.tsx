import { ExternalLink } from "lucide-react";

interface PortfolioGridProps {
  links: string[];
}

export default function PortfolioGrid({ links }: PortfolioGridProps) {
  const labels = [
    "Modern SaaS UX",
    "Enterprise Operations Hub",
    "Secure Fintech Portal",
    "AI Analytics Suite"
  ];

  const subLabels = [
     "Active Showcase",
     "Strategic Ecosystem",
     "Commercial Protocol",
     "Intelligence Engine"
  ];

  // Helper to get actual website screenshot via Microlink API
  const getScreenshotUrl = (url: string) => {
    return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {links.slice(0, 4).map((link, i) => (
         <div key={i} className="group relative bg-slate-900 rounded-[1.5rem] overflow-hidden border border-slate-800 shadow-2xl h-[140px]">
          {/* Actual Website Preview Background */}
          <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500 overflow-hidden bg-slate-800">
             <img 
                src={getScreenshotUrl(link)} 
                alt={labels[i]} 
                className="w-full h-full object-cover object-top scale-100 group-hover:scale-110 transition-transform duration-1000"
                onError={(e) => {
                   // Fallback if screenshot fails
                   e.currentTarget.src = "/asset/portfolio_mock.png";
                }}
             />
          </div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 p-5 flex flex-col justify-end">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#99CB48]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-[#99CB48]">{subLabels[i] || "Client Showcase"}</span>
             </div>
             <h5 className="text-base font-black text-white uppercase tracking-tighter mb-1 leading-none">{labels[i] || "Enterprise Solution"}</h5>
             <div className="flex items-center justify-between gap-3 mt-1">
                <div className="flex items-center gap-1.5 overflow-hidden">
                   <ExternalLink size={8} className="text-white/40 shrink-0" />
                   <span className="text-[7px] font-bold text-slate-400 truncate tracking-tight">{link.replace('https://', '')}</span>
                </div>
                <div className="px-2 py-0.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-md shrink-0">
                   <span className="text-[7px] font-black text-white uppercase tracking-widest">LIVE</span>
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
