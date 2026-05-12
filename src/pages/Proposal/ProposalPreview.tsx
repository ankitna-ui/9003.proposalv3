import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, Printer } from "lucide-react";
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

  const exportPDF = async () => {
    const element = proposalRef.current;
    if (!element) return;

    // Dynamic imports
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const pages = element.querySelectorAll('.a4-page');
    if (pages.length === 0) return;

    // A4 dimensions in mm
    const PDF_W = 210;
    const PDF_H = 297;
    // Capture scale for sharp text
    const SCALE = 2;
    // A4 width in pixels at 96dpi
    const PAGE_PX_W = 794;
    const PAGE_PX_H = Math.round(PAGE_PX_W * (PDF_H / PDF_W));

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      const canvas = await html2canvas(page, {
        scale: SCALE,
        useCORS: true,
        backgroundColor: null, // let page's own bg show (for gradients)
        width: PAGE_PX_W,
        height: PAGE_PX_H,
        windowWidth: PAGE_PX_W,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, PDF_W, PDF_H);
    }

    pdf.save(`${(proposal?.client?.companyName || "Weblozy")}_Proposal.pdf`);
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
