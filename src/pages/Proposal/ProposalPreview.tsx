import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import { Proposal } from "@/types/proposal";
import ProposalPDF from "@/components/Proposal/ProposalPDF";

export default function ProposalPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const proposalRef = useRef<HTMLDivElement>(null);
  
  const proposal = location.state?.proposal as Proposal;

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No proposal data found</h2>
          <Button onClick={() => navigate('/create')}>Go to Create</Button>
        </div>
      </div>
    );
  }

  const exportPDF = () => {
    const element = proposalRef.current;
    if (!element) return;
    
    const opt = {
      margin: 0,
      filename: `${(proposal?.client?.companyName || "Weblozy")}_Proposal.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#FFFFFF'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
    };
    (html2pdf() as any).set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 no-print">
      <div className="max-w-[210mm] mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-slate-600">
          <ChevronLeft className="w-4 h-4" />
          Back to Strategy Editor
        </Button>
        <div className="flex gap-3">
          <Button onClick={handlePrint} variant="outline" className="gap-2 border-slate-300">
            <Printer className="w-4 h-4" />
            Print Master Copy
          </Button>
          <Button onClick={exportPDF} className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20">
            <Download className="w-4 h-4" />
            Download Strategic PDF
          </Button>
        </div>
      </div>

      <div className="pdf-container">
        <ProposalPDF ref={proposalRef} proposal={proposal} />
      </div>
    </div>
  );
}
