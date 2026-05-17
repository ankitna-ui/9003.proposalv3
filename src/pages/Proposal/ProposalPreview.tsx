import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, Printer, Loader2 } from "lucide-react";
import { Proposal } from "@/types/proposal";
import ProposalPDF from "@/components/Proposal/pages2";

export default function ProposalPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const proposalRef = useRef<HTMLDivElement>(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportingPage, setExportingPage] = useState(0);
  const [totalExportPages, setTotalExportPages] = useState(0);

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

    const pages = element.querySelectorAll('.a4-page');
    if (pages.length === 0) return;

    setIsExporting(true);
    setExportingPage(1);
    setTotalExportPages(pages.length);
    setExportProgress(0);

    try {
      // Dynamic imports
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // A4 dimensions in mm
      const PDF_W = 210;
      const PDF_H = 297;
      // Capture scale for ultra-sharp text (3x for enterprise quality)
      const SCALE = 3;
      // A4 width in pixels at 96dpi
      const PAGE_PX_W = 794;
      const PAGE_PX_H = Math.round(PAGE_PX_W * (PDF_H / PDF_W));

      const pdf = new jsPDF({ 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait', 
        compress: true,
        precision: 16
      });

      for (let i = 0; i < pages.length; i++) {
        setExportingPage(i + 1);
        setExportProgress(Math.round((i / pages.length) * 100));

        // Let the CPU/UI paint the progress overlay smoothly before locking the thread
        await new Promise(resolve => setTimeout(resolve, 80));

        const page = pages[i] as HTMLElement;

        const canvas = await html2canvas(page, {
          scale: SCALE,
          useCORS: true,
          backgroundColor: null,
          width: PAGE_PX_W,
          height: PAGE_PX_H,
          windowWidth: PAGE_PX_W,
          scrollX: 0,
          scrollY: 0,
          logging: false
        });

        const imgData = canvas.toDataURL('image/png', 1.0);

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, PDF_W, PDF_H, undefined, 'FAST');
      }

      setExportProgress(100);
      const fileName = `${(proposal.client?.companyName || "Client")}_${(proposal.client?.proposalTitle || "Proposal")}_Weblozy.pdf`.replace(/\s+/g, '_');
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsExporting(false);
    }
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
          <Button onClick={exportPDF} className="gap-2 bg-[#99CB48] text-black hover:bg-[#99CB48]/90 shadow-xl shadow-[#99CB48]/20 font-black uppercase text-[10px] tracking-widest px-6 h-11">
            <Download className="w-4 h-4" />
            Download Strategic PDF
          </Button>
        </div>
      </div>

      <div className="pdf-container">
        <ProposalPDF ref={proposalRef} proposal={proposal} />
      </div>

      {isExporting && (
        <div className="fixed inset-0 z-50 bg-[#0B0E14]/90 backdrop-blur-md flex items-center justify-center flex-col no-print">
          <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center">
            <Loader2 className="w-14 h-14 text-primary animate-spin" />
            <div className="space-y-2">
              <h3 className="text-white text-[12px] font-black uppercase tracking-[0.4em] mb-1">Compiling Strategic Protocol</h3>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Page {exportingPage} of {totalExportPages}</p>
            </div>
            
            {/* Elegant high-contrast progress bar */}
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-[#99CB48] shadow-[0_0_12px_#99CB48] transition-all duration-300 rounded-full" 
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            
            <p className="text-white/30 text-[9px] font-black uppercase tracking-wider tabular-nums">{exportProgress}% Sync Complete</p>
          </div>
        </div>
      )}
    </div>
  );
}
