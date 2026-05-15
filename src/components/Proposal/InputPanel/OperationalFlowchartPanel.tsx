import { Input } from "@/components/ui/input";
import { Trash2, ImagePlus, Link2, MonitorPlay } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function OperationalFlowchartPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  return (
    <div className="space-y-8 pb-10">
      <SectionHeader 
        title="System Logic Architecture" 
        subtitle="Visualize the operational flowchart and provide demo access" 
        stepNumber={currentStep + 1} 
      />

      <div className="space-y-6">
        {/* Flowchart Section */}
        <div className="space-y-3">
          <LabelPremium>Operational Flowchart Image</LabelPremium>
          {proposal.solution.flowchartImageUrl && proposal.solution.flowchartImageUrl.startsWith('data:') ? (
            <div className="relative group rounded-[2.5rem] overflow-hidden border-2 border-primary/20 bg-slate-50 aspect-video shadow-lg">
              <img src={proposal.solution.flowchartImageUrl} alt="Flowchart" className="w-full h-full object-contain p-6" />
              <button 
                onClick={() => updateSolution({ flowchartImageUrl: "" })} 
                className="absolute top-4 right-4 p-3 bg-white rounded-2xl text-red-500 shadow-xl hover:scale-110 transition-transform"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => updateSolution({ flowchartImageUrl: reader.result as string });
                    reader.readAsDataURL(file);
                  }
                }} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="h-[220px] border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 flex flex-col items-center justify-center gap-4 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary">
                   <ImagePlus size={28} />
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Upload Logic Flowchart</p>
                   <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">PNG, JPG or Mermaid Export</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flowchart URL Fallback */}
          <div className="space-y-1">
            <LabelPremium>Flowchart Image URL (Optional)</LabelPremium>
            <div className="relative">
               <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <Input 
                 className="h-14 bg-white border-slate-200 pl-12 rounded-2xl text-xs font-bold" 
                 placeholder="https://image-link.com/flow.png" 
                 value={proposal.solution.flowchartImageUrl && !proposal.solution.flowchartImageUrl.startsWith('data:') ? proposal.solution.flowchartImageUrl : ""} 
                 onChange={(e) => updateSolution({ flowchartImageUrl: e.target.value })} 
               />
            </div>
          </div>

          {/* NEW: Demo Link Option */}
          <div className="space-y-1">
            <LabelPremium>Live Project Demo URL</LabelPremium>
            <div className="relative">
               <MonitorPlay className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
               <Input 
                 className="h-14 bg-white border-primary/20 pl-12 rounded-2xl text-xs font-black text-primary" 
                 placeholder="https://demo.weblozy.com/project-a" 
                 value={proposal.solution.demoLink || ""} 
                 onChange={(e) => updateSolution({ demoLink: e.target.value })} 
               />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            Note: The Demo Link will be rendered as a high-impact call-to-action button in the final proposal, allowing stakeholders to experience the logic architecture in real-time.
         </p>
      </div>
    </div>
  );
}
