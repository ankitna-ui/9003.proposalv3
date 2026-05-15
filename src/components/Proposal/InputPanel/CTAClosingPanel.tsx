import { Input } from "@/components/ui/input";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function CTAClosingPanel({ proposal, currentStep, updateClosing }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Strategic Alignment" subtitle="Finalize engagement" stepNumber={currentStep + 1} />
      <div className="space-y-1">
        <LabelPremium>Scheduling Protocol</LabelPremium>
        <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder="Calendly link..." value={proposal.closing.meetingLink} onChange={(e) => updateClosing({ meetingLink: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Direct Email</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.closing.contactEmail} onChange={(e) => updateClosing({ contactEmail: e.target.value })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Direct Phone</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.closing.contactPhone} onChange={(e) => updateClosing({ contactPhone: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
