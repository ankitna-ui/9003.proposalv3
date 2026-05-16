import React from "react";
import { Proposal, Module } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { CheckCircle2, IndianRupee } from "lucide-react";

import { MAX_WEIGHT_PER_PAGE, MODULE_HEADER_WEIGHT, FEATURE_WEIGHT, FIRST_PAGE_REDUCTION } from "@/utils/proposal/weights";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const ModuleArchitecturePage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const allModules = proposal?.solution?.selectedModules?.length > 0 
    ? proposal.solution.selectedModules 
    : [
        { id: "sample-mod-1", name: "Industrial Product Management", features: [{ name: "Product dependency management", price: "₹2,500" }, { name: "Variant & SKU workflows", price: "₹1,500" }, { name: "Category management" }], price: "₹25,000" },
      ];

  // Refined High-Density Adjustment Logic
  const pages: Module[][] = [];
  let currentPage: Module[] = [];
  let currentWeight = 0;

  allModules.forEach((module) => {
    const isFirstPage = pages.length === 0;
    // Tighter weight calculation using shared constants
    const moduleWeight = MODULE_HEADER_WEIGHT + (module.features.length * FEATURE_WEIGHT);
    const availableWeight = isFirstPage ? MAX_WEIGHT_PER_PAGE - FIRST_PAGE_REDUCTION : MAX_WEIGHT_PER_PAGE;

    if (currentWeight + moduleWeight > availableWeight && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentWeight = 0;
    }
    
    currentPage.push(module);
    currentWeight += moduleWeight;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }


  return (
    <>
      {pages.map((pageModules, pageIdx) => (
        <PageWrapper 
          key={pageIdx} 
          pageNum={pageNum + pageIdx} 
          title="Architectural Ecosystem"
        >
          <div className="flex flex-col h-full overflow-hidden">
            {pageIdx === 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-[2px] bg-[#99CB48]" />
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#99CB48]">Solution Breakdown</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none mb-0.5">
                  Modules & <span className="text-[#99CB48]">Architecture.</span>
                </h2>
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Dynamic System Component Specifications</div>
              </div>
            )}

            <div className="flex-1 space-y-3 overflow-hidden py-1">
              {pageModules.map((module, mIdx) => (
                <div key={mIdx} className="w-full border-[1px] border-slate-900 overflow-hidden rounded-lg shadow-sm">
                  {/* Compact Module Header */}
                  <div className="bg-[#0B0E14] py-1.5 px-4 border-b-[1px] border-slate-900 flex justify-between items-center">
                    <h3 className="text-[#99CB48] italic font-black uppercase tracking-widest text-[10px]">
                      {module.name}
                    </h3>
                    {module.price && (
                      <div className="bg-[#99CB48] px-2 py-0.5 rounded border border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                        <IndianRupee size={7} className="text-[#0B0E14]" strokeWidth={3} />
                        <span className="text-[8px] font-black text-[#0B0E14] uppercase italic">{module.price}</span>
                      </div>
                    )}
                  </div>

                  {/* High-Density Features Table */}
                  <div className="bg-white">
                    {module.features.map((feature: any, fIdx: number) => (
                      <div 
                        key={fIdx} 
                        className={`grid grid-cols-[1fr,auto,30px] items-center py-1.5 px-4 ${
                          fIdx !== module.features.length - 1 ? "border-b border-slate-100" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#0B0E14] shrink-0" />
                           <span className="text-[9px] font-black italic uppercase tracking-tight text-slate-800 leading-tight">
                             {typeof feature === 'string' ? feature : feature.name}
                           </span>
                        </div>
                        {feature.price && (
                           <div className="mr-3 px-1.5 py-0 bg-slate-50 border border-slate-200 rounded flex items-center gap-0.5">
                              <IndianRupee size={6} className="text-[#99CB48]" strokeWidth={3} />
                              <span className="text-[7px] font-black text-slate-500 italic uppercase">{feature.price}</span>
                           </div>
                        )}
                        <div className="flex justify-end">
                           <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#0B0E14] text-[#99CB48] shrink-0 shadow-sm">
                              <CheckCircle2 size={10} strokeWidth={3} />
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* User Hierarchy Section (Only on the last page of this module) */}
              {pageIdx === pages.length - 1 && proposal.solution.userRoles?.length > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-[#0B0E14] text-[#99CB48] text-[8px] font-black uppercase tracking-[0.3em] rounded-md">System Access Hierarchy</div>
                    <div className="h-[1px] flex-1 bg-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {proposal.solution.userRoles.map((roleStr, rIdx) => {
                      const [title, desc] = roleStr.split("|");
                      return (
                        <div key={rIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 hover:bg-white hover:border-[#99CB48]/30 transition-all group">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#99CB48]" />
                            <h4 className="text-[10px] font-black uppercase tracking-tight text-slate-900 group-hover:text-[#1AA6E1] transition-colors">{title}</h4>
                          </div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase leading-relaxed tracking-tight">
                            {desc || "Defined access level for system synchronization."}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
              <div className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-300 italic">
                Proprietary Modular Framework // User Access Synchronization
              </div>
              {pages.length > 1 && pageIdx < pages.length - 1 && (
                <div className="text-[7px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1">
                   <div className="w-1 h-1 rounded-full bg-[#99CB48] animate-pulse" />
                   Continued...
                </div>
              )}
            </div>
          </div>
        </PageWrapper>
      ))}
    </>
  );
};

export default ModuleArchitecturePage;
