import { Input } from "@/components/ui/input";
import { Trash2, ImagePlus } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function OperationalFlowchartPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="System Logic Architecture" subtitle="Upload flowchart and define demo access" stepNumber={currentStep + 1} />
      <div className="space-y-6">
        <LabelPremium>Flowchart Image</LabelPremium>
        {proposal.solution.flowchartImageUrl ? (
          <div className="relative group rounded-3xl overflow-hidden border-2 border-primary/20 bg-slate-50 aspect-video">
            <img src={proposal.solution.flowchartImageUrl} alt="Flowchart" className="w-full h-full object-contain p-4" />
            <button onClick={() => updateSolution({ flowchartImageUrl: "" })} className="absolute top-4 right-4 p-3 bg-white rounded-2xl text-red-500 shadow-xl"><Trash2 size={20} /></button>
          </div>
        ) : (
          <div className="relative group">
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => updateSolution({ flowchartImageUrl: reader.result as string });
                reader.readAsDataURL(file);
              }
            }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="h-[200px] border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 flex flex-col items-center justify-center gap-4 group-hover:border-primary group-hover:bg-primary/5 transition-all">
              <ImagePlus size={28} className="text-slate-400" />
              <p className="text-[10px] font-black uppercase text-slate-900">Upload Logic Flowchart</p>
            </div>
          </div>
        )}
        <div className="space-y-1">
          <LabelPremium>Flowchart URL</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder="https://..." value={proposal.solution.flowchartImageUrl} onChange={(e) => updateSolution({ flowchartImageUrl: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
