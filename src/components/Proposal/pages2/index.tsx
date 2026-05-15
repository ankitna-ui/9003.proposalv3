import { forwardRef, useEffect, useRef } from "react";
import { Proposal } from "@/types/proposal";
import { MAX_WEIGHT_PER_PAGE, MODULE_HEADER_WEIGHT, FEATURE_WEIGHT, FIRST_PAGE_REDUCTION } from "@/utils/proposal/weights";

// Import Modular Pages
import CoverPage from "./CoverPage";
import CorporateIdentityPage from "./CorporateIdentityPage";
import OperationalAuditPage from "./OperationalAuditPage";
import StrategicEcosystemPage from "./StrategicEcosystemPage";
import OperationalFlowchartPage from "./OperationalFlowchartPage";
import ModuleArchitecturePage from "./ModuleArchitecturePage";
import TechnicalArchitecturePage from "./TechnicalArchitecturePage";
import StrategicROIPage from "./StrategicROIPage";
import CommercialFrameworkPage from "./CommercialFrameworkPage";
import CorporateAuthorityPage from "./CorporateAuthorityPage";
import ClosingPage from "./ClosingPage";

interface ProposalPDFProps {
  proposal: Proposal;
  activeStep?: number;
}

const ProposalPDF = forwardRef<HTMLDivElement, ProposalPDFProps>(({ proposal, activeStep }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mapping steps to approximate page indices for auto-scrolling
  const stepToPageMap: Record<number, number> = {
    0: 0, // Cover
    1: 1, // Identity
    2: 2, // Audit
    3: 3, // Ecosystem
    4: 4, // Flowchart
    5: 5, // Modules
    6: 6, // Tech (approx)
    7: 7, // ROI (approx)
    8: 8, // Commercial (approx)
    9: 9, // Portfolio (approx)
    10: 10 // Closing (approx)
  };

  useEffect(() => {
    if (activeStep !== undefined && containerRef.current) {
      const pages = containerRef.current.querySelectorAll('.a4-page');
      let targetPageIndex = stepToPageMap[activeStep] || 0;
      
      // Special logic for steps after modules
      if (activeStep > 5) {
        // We need to account for dynamic module pages
        // This is a simplified estimate
        targetPageIndex = pages.length - (11 - activeStep);
      }

      const targetPage = pages[Math.min(targetPageIndex, pages.length - 1)];
      if (targetPage) {
        targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeStep]);

  let currentPageNum = 1;
  // Calculate pages needed for modules dynamically (matching ModuleArchitecturePage logic)
  const allModules = proposal?.solution?.selectedModules || [];
  let modulePagesCount = 0;
  let currentWeight = 0;
  
  if (allModules.length === 0) {
    modulePagesCount = 1;
  } else {
    allModules.forEach((module) => {
      const isFirstPage = modulePagesCount === 0;
      const moduleWeight = MODULE_HEADER_WEIGHT + (module.features?.length || 0) * FEATURE_WEIGHT;
      const availableWeight = isFirstPage ? MAX_WEIGHT_PER_PAGE - FIRST_PAGE_REDUCTION : MAX_WEIGHT_PER_PAGE;

      if (currentWeight + moduleWeight > availableWeight && modulePagesCount > 0) {
        modulePagesCount++;
        currentWeight = moduleWeight;
      } else {
        currentWeight += moduleWeight;
        if (modulePagesCount === 0) modulePagesCount = 1;
      }
    });
  }
  if (modulePagesCount === 0) modulePagesCount = 1;

  // Combine refs
  const setRefs = (node: HTMLDivElement) => {
    (containerRef as any).current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as any).current = node;
  };

  return (
    <div ref={setRefs} className="flex flex-col gap-12 items-center font-sans text-[#0B0E14] w-full pb-20">
      <CoverPage proposal={proposal} pageNum={currentPageNum++} />
      <CorporateIdentityPage proposal={proposal} pageNum={currentPageNum++} />
      <OperationalAuditPage proposal={proposal} pageNum={currentPageNum++} />
      <StrategicEcosystemPage proposal={proposal} pageNum={currentPageNum++} />
      <OperationalFlowchartPage proposal={proposal} pageNum={currentPageNum++} />
      
      <ModuleArchitecturePage proposal={proposal} pageNum={currentPageNum} />
      {(() => { currentPageNum += modulePagesCount; return null; })()}

      <TechnicalArchitecturePage proposal={proposal} pageNum={currentPageNum++} />
      <StrategicROIPage proposal={proposal} pageNum={currentPageNum++} />
      <CommercialFrameworkPage proposal={proposal} pageNum={currentPageNum++} />
      <CorporateAuthorityPage proposal={proposal} pageNum={currentPageNum++} />
      <ClosingPage proposal={proposal} pageNum={currentPageNum++} />
    </div>
  );
});

ProposalPDF.displayName = "ProposalPDF";

export default ProposalPDF;

