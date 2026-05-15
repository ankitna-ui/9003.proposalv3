import { Label } from "@/components/ui/label";

export interface InputPanelProps {
  proposal: any;
  currentStep: number;
  updateClient: (data: any) => void;
  updateSituation: (data: any) => void;
  updateSolution: (data: any) => void;
  updateTechArchitecture: (data: any) => void;
  updateROI: (data: any) => void;
  updateExperience: (data: any) => void;
  updatePricing: (data: any) => void;
  updateClosing: (data: any) => void;
}

export const LabelPremium = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Label className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block ${className}`}>
    {children}
  </Label>
);

export const SectionHeader = ({ title, subtitle, stepNumber }: { title: string, subtitle?: string, stepNumber: number }) => (
  <div className="mb-10 border-b border-slate-100 pb-6">
    <div className="flex items-center gap-2 mb-2">
       <div className="w-6 h-[2px] bg-primary" />
       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Protocol Phase 0{stepNumber}</span>
    </div>
    <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0B0E14]">{title}</h3>
    {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed max-w-sm">{subtitle}</p>}
  </div>
);
