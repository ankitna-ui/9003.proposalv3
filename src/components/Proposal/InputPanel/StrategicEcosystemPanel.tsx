import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function StrategicEcosystemPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Strategic Solution Architecture" subtitle="Define pillars, connectivity, and hierarchy" stepNumber={currentStep + 1} />
      <div className="space-y-1">
        <LabelPremium>Strategic Approach</LabelPremium>
        <Textarea className="min-h-[80px] bg-white border-slate-200 rounded-3xl p-5" value={proposal.solution.approach} onChange={(e) => updateSolution({ approach: e.target.value })} />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <LabelPremium>Implementation Pillars</LabelPremium>
          <button type="button" onClick={() => updateSolution({ approachPoints: [...(proposal.solution.approachPoints || []), ""] })} className="text-[10px] font-black uppercase text-primary hover:underline">+ Add Pillar</button>
        </div>
        <div className="space-y-2">
          {(proposal.solution.approachPoints || []).map((point: string, i: number) => (
            <div key={i} className="flex gap-2">
              <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={point} onChange={(e) => {
                const next = [...(proposal.solution.approachPoints || [])];
                next[i] = e.target.value;
                updateSolution({ approachPoints: next });
              }} />
              <button type="button" onClick={() => updateSolution({ approachPoints: proposal.solution.approachPoints.filter((_: string, idx: number) => idx !== i) })} className="px-4 text-red-500 hover:bg-red-50 rounded-2xl font-black">×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
