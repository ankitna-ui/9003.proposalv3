import { Input } from "@/components/ui/input";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function CoverIdentityPanel({ proposal, currentStep, updateClient }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Brand Configuration" subtitle="Define the strategic identity of this proposal" stepNumber={currentStep + 1} />
      <div className="space-y-1">
        <LabelPremium>Proposal Reference ID</LabelPremium>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">#</span>
          <Input className="h-14 bg-white border-slate-200 pl-10 font-black rounded-2xl" placeholder="2024-001" value={proposal.client.referenceId} onChange={(e) => updateClient({ referenceId: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1">
        <LabelPremium>Main Proposal Title</LabelPremium>
        <Input className="h-14 bg-white border-slate-200 font-black text-lg rounded-2xl" value={proposal.client.proposalTitle} onChange={(e) => updateClient({ proposalTitle: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Framework Title</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.client.frameworkTitle} onChange={(e) => updateClient({ frameworkTitle: e.target.value })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Tagline</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.client.tagline} onChange={(e) => updateClient({ tagline: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1">
        <LabelPremium>Strategic Domain (Industry)</LabelPremium>
        <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.client.industryTitle} onChange={(e) => updateClient({ industryTitle: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Proposal Date</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.client.filingDate} onChange={(e) => updateClient({ filingDate: e.target.value })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Footer Message</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.client.footerMessage} placeholder="© Weblozy" onChange={(e) => updateClient({ footerMessage: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
