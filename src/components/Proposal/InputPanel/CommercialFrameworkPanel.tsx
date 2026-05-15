import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function CommercialFrameworkPanel({ proposal, currentStep, updatePricing }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Financial Alignment" subtitle="Investment breakdown" stepNumber={currentStep + 1} />
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Core Valuation (₹)</LabelPremium>
          <Input type="number" className="h-14 bg-white border-slate-200 rounded-2xl font-black" value={proposal.pricing.coreValuation} onChange={(e) => updatePricing({ coreValuation: e.target.value })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Discount Protocol (%)</LabelPremium>
          <Input type="number" className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.pricing.discountPercentage} onChange={(e) => updatePricing({ discountPercentage: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1">
        <LabelPremium>ROI Settlement Narrative</LabelPremium>
        <Textarea className="min-h-[100px] bg-white border-slate-200 rounded-3xl p-5" value={proposal.pricing.roiLogic} onChange={(e) => updatePricing({ roiLogic: e.target.value })} />
      </div>
    </div>
  );
}
