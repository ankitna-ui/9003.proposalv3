import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function OperationalAuditPanel({ proposal, currentStep, updateSituation }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Operational Audit Diagnosis" subtitle="Identify core bottlenecks and systemic friction" stepNumber={currentStep + 1} />
      <div className="space-y-1">
        <LabelPremium>Audit Narrative (Situational Analysis)</LabelPremium>
        <Textarea className="min-h-[120px] bg-white border-slate-200 rounded-3xl p-5" placeholder="Describe current workflow friction..." value={proposal.situation.currentWorkflow} onChange={(e) => updateSituation({ currentWorkflow: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Revenue Leakage</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder="₹10k+ / Mo" value={proposal.situation.revenueLeakage} onChange={(e) => updateSituation({ revenueLeakage: e.target.value })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Inefficiencies</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder="High Manual Overhead" value={proposal.situation.inefficiencies} onChange={(e) => updateSituation({ inefficiencies: e.target.value })} />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <LabelPremium>Critical Friction Points</LabelPremium>
          <button type="button" onClick={() => updateSituation({ challenges: [...proposal.situation.challenges, ""] })} className="text-[10px] font-black uppercase text-primary hover:underline">+ Add Point</button>
        </div>
        <div className="space-y-3">
          {proposal.situation.challenges.map((challenge: string, i: number) => (
            <div key={i} className="flex gap-2">
              <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder={`Challenge #${i + 1}`} value={challenge} onChange={(e) => {
                const next = [...proposal.situation.challenges];
                next[i] = e.target.value;
                updateSituation({ challenges: next });
              }} />
              <button type="button" onClick={() => updateSituation({ challenges: proposal.situation.challenges.filter((_: string, idx: number) => idx !== i) })} className="px-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-black">×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
