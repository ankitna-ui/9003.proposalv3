import { Input } from "@/components/ui/input";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function TechnicalStackPanel({ proposal, currentStep, updateTechArchitecture }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Technology Protocol" subtitle="The architectural foundation" stepNumber={currentStep + 1} />
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Frontend Stack</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.techArchitecture.frontendStack.join(", ")} onChange={(e) => updateTechArchitecture({ frontendStack: e.target.value.split(",").map((i: string) => i.trim()) })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Backend Stack</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.techArchitecture.backendStack.join(", ")} onChange={(e) => updateTechArchitecture({ backendStack: e.target.value.split(",").map((i: string) => i.trim()) })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Database System</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.techArchitecture.database} onChange={(e) => updateTechArchitecture({ database: e.target.value })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Hosting Protocol</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.techArchitecture.hosting} onChange={(e) => updateTechArchitecture({ hosting: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
