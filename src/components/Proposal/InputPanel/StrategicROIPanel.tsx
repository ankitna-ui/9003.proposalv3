import { Input } from "@/components/ui/input";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function StrategicROIPanel({ proposal, currentStep, updateROI }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Economic Impact" subtitle="Quantify expected returns" stepNumber={currentStep + 1} />
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Revenue Increase (%)</LabelPremium>
          <Input type="number" className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.roi.revenueIncrease} onChange={(e) => updateROI({ revenueIncrease: e.target.value })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Productivity Gain (%)</LabelPremium>
          <Input type="number" className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.roi.productivityIncrease} onChange={(e) => updateROI({ productivityIncrease: e.target.value })} />
        </div>
      </div>
      <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl">
         <div className="space-y-1">
            <LabelPremium className="text-white/40">Calculated ROI</LabelPremium>
            <div className="text-5xl font-black text-primary tracking-tighter">{proposal.roi.expectedROI}%</div>
         </div>
         <div className="w-[1px] h-16 bg-white/10" />
         <div className="space-y-1 text-right">
            <LabelPremium className="text-white/40 text-right">Profit Impact</LabelPremium>
            <Input className="bg-transparent border-none p-0 h-auto text-3xl font-black text-white focus-visible:ring-0 text-right" placeholder="$15k/mo" value={proposal.roi.profitImpact} onChange={(e) => updateROI({ profitImpact: e.target.value })} />
         </div>
      </div>
    </div>
  );
}
