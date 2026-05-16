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
        <LabelPremium>Industries Served (Authority Count)</LabelPremium>
        <Input 
          className="h-14 bg-white border-slate-200 rounded-2xl font-black" 
          placeholder="e.g. 15+ Industry" 
          value={typeof proposal.experience.industriesServed === 'string' ? proposal.experience.industriesServed : (Array.isArray(proposal.experience.industriesServed) ? proposal.experience.industriesServed[0] || "15+ Industry" : "15+ Industry")} 
          onChange={(e) => updateExperience({ industriesServed: e.target.value as any })} 
        />
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-2 italic">This value highlights your market reach in the success metrics.</p>
      </div>
    </div>
  );
}
