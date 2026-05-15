import React from "react";
import bannerLogo from "@/assets/banner_logo.png";

interface PageWrapperProps {
  children: React.ReactNode;
  pageNum: number;
  className?: string;
  title?: string;
}

const PageWrapper = ({ children, pageNum, className = "", title = "" }: PageWrapperProps) => (
  <section className={`a4-page bg-white shadow-xl ${className} flex flex-col`}>
    <div className="watermark text-[#99CB48]/5">WEBLOZY</div>
    
    {/* Page Header */}
    <div className="relative z-20 flex justify-between items-center mb-6 border-b pb-3 border-slate-100">
       <div className="flex items-center gap-3">
          <img src={bannerLogo} alt="Weblozy" style={{ height: '18px', width: 'auto', objectFit: 'contain' }} className="opacity-90" />
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">{title}</div>
       </div>
       <div className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300">CORPORATE / STRATEGIC</div>
    </div>

    <div className="relative z-10 flex-1 flex flex-col min-h-0">
      {children}
    </div>

    {/* Professional Footer */}
    <div className="relative z-20 mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-[7px] font-bold uppercase tracking-[0.4em] text-slate-300">© WEBLOZY • WE AUTOMATE BUSINESS</div>
        </div>
       <div className="text-[9px] font-black uppercase tracking-[0.5em] text-[#99CB48]">PAGE 0{pageNum}</div>
    </div>
  </section>
);

export default PageWrapper;
