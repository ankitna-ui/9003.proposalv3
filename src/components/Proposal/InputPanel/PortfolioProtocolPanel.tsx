import { Input } from "@/components/ui/input";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function PortfolioProtocolPanel({ proposal, currentStep, updateExperience }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Success Protocol" subtitle="Verify expertise via live deployments" stepNumber={currentStep + 1} />
      <div className="grid grid-cols-1 gap-4">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="space-y-1">
            <LabelPremium>Deployment Case 0{idx + 1}</LabelPremium>
            <Input 
              className="h-14 bg-white border-slate-200 rounded-2xl"
              placeholder="Project Title | https://..."
              value={proposal.experience.portfolioLinks[idx] || ""}
              onChange={(e) => {
                const next = [...proposal.experience.portfolioLinks];
                next[idx] = e.target.value;
                updateExperience({ portfolioLinks: next });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
