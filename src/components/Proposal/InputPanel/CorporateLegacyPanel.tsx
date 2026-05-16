import { Input } from "@/components/ui/input";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function CorporateLegacyPanel({ proposal, currentStep, updateExperience, updateClient }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Operational Authority" subtitle="Display your track record and market authority" stepNumber={currentStep + 1} />
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Target Industry</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl font-black" placeholder="e.g. Retail Automation" value={proposal.client.industryTitle} onChange={(e) => updateClient({ industryTitle: e.target.value })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Industry Domain</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder="e.g. Enterprise Sector" value={proposal.client.industryDomain} onChange={(e) => updateClient({ industryDomain: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <LabelPremium>Years Experience</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl font-black" placeholder="15+" value={proposal.experience.yearsOfExperience} onChange={(e) => updateExperience({ yearsOfExperience: e.target.value })} />
        </div>
        <div className="space-y-1">
          <LabelPremium>Projects Built</LabelPremium>
          <Input className="h-14 bg-white border-slate-200 rounded-2xl font-black" placeholder="250+" value={proposal.experience.projectsCompleted} onChange={(e) => updateExperience({ projectsCompleted: e.target.value })} />
        </div>
      </div>

      <div className="space-y-1">
        <LabelPremium>Industries Served (Pointers)</LabelPremium>
        <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder="E-commerce, SaaS, Logistics" value={Array.isArray(proposal.experience.industriesServed) ? proposal.experience.industriesServed.join(", ") : ""} onChange={(e) => updateExperience({ industriesServed: e.target.value.split(",").map((s: string) => s.trim()) })} />
      </div>
    </div>
  );
}
