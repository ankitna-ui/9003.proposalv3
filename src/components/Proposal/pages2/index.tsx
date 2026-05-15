import { forwardRef } from "react";
import { Proposal } from "@/types/proposal";

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
}

const ProposalPDF = forwardRef<HTMLDivElement, ProposalPDFProps>(({ proposal }, ref) => {
  let currentPage = 1;
  // Calculate pages needed for modules dynamically (matching ModuleArchitecturePage logic)
  const allModules = proposal?.solution?.selectedModules || [];
  const MAX_WEIGHT_PER_PAGE = 24;
  let modulePagesCount = 0;
  let currentWeight = 0;
  
  if (allModules.length === 0) {
    modulePagesCount = 1;
  } else {
    allModules.forEach((module) => {
      const isFirstPage = modulePagesCount === 0;
      const moduleWeight = 2 + (module.features?.length || 0);
      const availableWeight = isFirstPage ? MAX_WEIGHT_PER_PAGE - 6 : MAX_WEIGHT_PER_PAGE;

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

  return (
    <div ref={ref} className="flex flex-col gap-12 items-center font-sans text-[#0B0E14] w-full pb-20">
      <CoverPage proposal={proposal} pageNum={currentPage++} />
      <CorporateIdentityPage proposal={proposal} pageNum={currentPage++} />
      <OperationalAuditPage proposal={proposal} pageNum={currentPage++} />
      <StrategicEcosystemPage proposal={proposal} pageNum={currentPage++} />
      <OperationalFlowchartPage proposal={proposal} pageNum={currentPage++} />
      
      <ModuleArchitecturePage proposal={proposal} pageNum={currentPage} />
      {(() => { currentPage += modulePagesCount; return null; })()}

      <TechnicalArchitecturePage proposal={proposal} pageNum={currentPage++} />
      <StrategicROIPage proposal={proposal} pageNum={currentPage++} />
      <CommercialFrameworkPage proposal={proposal} pageNum={currentPage++} />
      <CorporateAuthorityPage proposal={proposal} pageNum={currentPage++} />
      <ClosingPage proposal={proposal} pageNum={currentPage++} />
    </div>
  );
});

ProposalPDF.displayName = "ProposalPDF";

export default ProposalPDF;
