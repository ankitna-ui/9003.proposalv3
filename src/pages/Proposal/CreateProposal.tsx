import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Wand2, 
  Plus, 
  X, 
  Loader2, 
  Trash2,
  Layout,
  Award,
  Search,
  Globe,
  GitBranch,
  Box,
  Cpu,
  TrendingUp,
  CreditCard,
  Monitor,
  Send,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProposalForm } from "@/hooks/useProposalForm";
import ModuleSelector from "@/components/Proposal/ModuleSelector";
import { generateProposalContent } from "@/lib/gemini";
import { saveProposal } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Module } from "@/types/proposal";

import ProposalPDF from "@/components/Proposal/pages2";

const steps = [
  { name: "Cover & Identity", icon: Layout },
  { name: "Corporate Legacy", icon: Award },
  { name: "Operational Audit", icon: Search },
  { name: "Strategic Ecosystem", icon: Globe },
  { name: "Operational Logic", icon: GitBranch },
  { name: "Solution Modules", icon: Box },
  { name: "Technical Stack", icon: Cpu },
  { name: "Strategic ROI", icon: TrendingUp },
  { name: "Commercial Framework", icon: CreditCard },
  { name: "Portfolio Protocol", icon: Monitor },
  { name: "CTA & Closing", icon: Send }
];

export default function CreateProposal() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { 
    proposal, 
    updateClient, 
    updateSituation, 
    updateSolution, 
    updateTechArchitecture,
    updateROI, 
    updateExperience,
    updatePricing, 
    updateClosing,
    setAIContent
  } = useProposalForm();

  // Auto-calculate ROI
  useEffect(() => {
    const rev = parseFloat(proposal.roi.revenueIncrease) || 0;
    const cost = parseFloat(proposal.roi.costReduction) || 0;
    const prod = parseFloat(proposal.roi.productivityIncrease) || 0;
    if (rev > 0 || cost > 0 || prod > 0) {
      const calculatedROI = (rev + cost + (prod * 0.5)) * 1.5;
      updateROI({ expectedROI: calculatedROI.toFixed(0) });
    }
  }, [proposal.roi.revenueIncrease, proposal.roi.costReduction, proposal.roi.productivityIncrease]);

  const handleAIAction = async () => {
    if (!proposal.situation.meetingNotes) {
      alert("Please add meeting notes first to generate content.");
      return;
    }
    setIsGenerating(true);
    try {
      const content = await generateProposalContent(
        proposal.situation.meetingNotes,
        proposal.client.companyName,
        proposal.solution.selectedModules.map(m => m.name)
      );
      setAIContent(content);
      alert("AI Content Refreshed!");
    } catch (error) {
      console.error(error);
      alert("AI Generation failed. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!proposal.client.companyName || !proposal.client.proposalTitle) {
          alert("Company Name and Proposal Title are required.");
          return false;
        }
        break;
      case 2:
        if (!proposal.situation.currentWorkflow) {
          alert("Operational Narrative is required.");
          return false;
        }
        break;
      case 5:
        if (proposal.solution.selectedModules.length === 0) {
          alert("Select at least one module.");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to initiate your strategic protocol.");
      return;
    }

    setIsSaving(true);
    try {
      const id = await saveProposal({
        ...proposal,
        userId: user.uid,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      alert("Strategic Protocol Initialized!");
      navigate(`/preview/${id}`, { state: { proposal: { ...proposal, id, userId: user.uid } } });
    } catch (error) {
      console.error(error);
      alert("Failed to save protocol.");
    } finally {
      setIsSaving(false);
    }
  };

  const LabelPremium = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <Label className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block ${className}`}>
      {children}
    </Label>
  );

  const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6 border-b border-slate-100 pb-4">
      <h3 className="text-sm font-black uppercase tracking-tighter text-[#0B0E14]">{title}</h3>
      {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Cover & Identity
        return (
          <div className="space-y-8">
            <SectionHeader title="Brand Configuration" subtitle="Define the strategic identity of this proposal" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Strategic Ally (Company)</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.companyName} onChange={(e) => updateClient({ companyName: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Valued Client Name</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.clientName} onChange={(e) => updateClient({ clientName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <LabelPremium>Main Proposal Title</LabelPremium>
              <Input className="bg-white border-slate-200 font-bold" value={proposal.client.proposalTitle} onChange={(e) => updateClient({ proposalTitle: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Industry Focus</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.industryTitle} onChange={(e) => updateClient({ industryTitle: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Industry Domain</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.industryDomain} onChange={(e) => updateClient({ industryDomain: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Security Label</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.protocolTitle} onChange={(e) => updateClient({ protocolTitle: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Framework Title</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.frameworkTitle} onChange={(e) => updateClient({ frameworkTitle: e.target.value })} />
              </div>
            </div>
          </div>
        );
      case 1: // Corporate Legacy
        return (
          <div className="space-y-8">
            <SectionHeader title="Operational Authority" subtitle="Display your track record and experience" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Years of Experience</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.experience.yearsOfExperience} onChange={(e) => updateExperience({ yearsOfExperience: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Projects Completed</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.experience.projectsCompleted} onChange={(e) => updateExperience({ projectsCompleted: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <LabelPremium>Partner Status</LabelPremium>
              <Input className="bg-white border-slate-200" value={proposal.experience.partnerStatus} onChange={(e) => updateExperience({ partnerStatus: e.target.value })} />
            </div>
            <div className="space-y-1">
              <LabelPremium>Strategic Summary</LabelPremium>
              <Textarea className="bg-white border-slate-200 min-h-[100px]" value={proposal.experience.strategicSummary} onChange={(e) => updateExperience({ strategicSummary: e.target.value })} />
            </div>
          </div>
        );
      case 2: // Operational Audit
        return (
          <div className="space-y-8">
            <SectionHeader title="Operational Diagnosis" subtitle="Identify pain points and optimization opportunities" />
            <div className="space-y-1">
              <LabelPremium>Current Workflow Audit</LabelPremium>
              <Textarea className="min-h-[120px] bg-white border-slate-200" value={proposal.situation.currentWorkflow} onChange={(e) => updateSituation({ currentWorkflow: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Revenue Leakage</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.situation.revenueLeakage} onChange={(e) => updateSituation({ revenueLeakage: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Efficiency Gaps</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.situation.inefficiencies} onChange={(e) => updateSituation({ inefficiencies: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-2">
                <LabelPremium className="mb-0">Raw Meeting Notes (AI Intelligence)</LabelPremium>
                <Button size="xs" variant="ghost" onClick={handleAIAction} disabled={isGenerating} className="h-6 px-2 text-[8px] uppercase font-black tracking-widest text-primary hover:bg-primary/10">
                  <Sparkles size={10} className="mr-1" /> Auto-Sync
                </Button>
              </div>
              <Textarea className="min-h-[150px] bg-slate-900 text-white border-none font-mono text-[11px] p-4" placeholder="Paste your discovery notes here for AI processing..." value={proposal.situation.meetingNotes} onChange={(e) => updateSituation({ meetingNotes: e.target.value })} />
            </div>
          </div>
        );
      case 3: // Strategic Ecosystem
        return (
          <div className="space-y-8">
            <SectionHeader title="Solution Ecosystem" subtitle="Define the strategic approach and core pillars" />
            <div className="space-y-1">
              <LabelPremium>Strategic Approach</LabelPremium>
              <Textarea className="min-h-[100px] bg-white border-slate-200" value={proposal.solution.approach} onChange={(e) => updateSolution({ approach: e.target.value })} />
            </div>
            <div className="space-y-4">
              <LabelPremium>Core Implementation Pillars</LabelPremium>
              <div className="grid gap-3">
                {(proposal.solution.approachPoints || []).map((point, i) => (
                  <div key={i} className="flex gap-2 group">
                    <div className="w-8 h-10 bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-300 rounded-lg group-hover:bg-slate-100 transition-colors">0{i+1}</div>
                    <Input className="bg-white border-slate-200" value={point} onChange={(e) => {
                      const newPoints = [...proposal.solution.approachPoints];
                      newPoints[i] = e.target.value;
                      updateSolution({ approachPoints: newPoints });
                    }} />
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500" onClick={() => updateSolution({ approachPoints: proposal.solution.approachPoints.filter((_, idx) => idx !== i) })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full border-dashed border-slate-300 text-slate-400 hover:text-primary hover:border-primary transition-all text-[9px] font-black uppercase tracking-widest" onClick={() => updateSolution({ approachPoints: [...proposal.solution.approachPoints, ""] })}>
                  <Plus className="w-3 h-3 mr-2" /> Add Strategic Pillar
                </Button>
              </div>
            </div>
          </div>
        );
      case 4: // Operational Logic
        return (
          <div className="space-y-8">
            <SectionHeader title="Logic Architecture" subtitle="Visualize the system flow and operational logic" />
            <div className="space-y-1">
              <LabelPremium>Flowchart Image URL</LabelPremium>
              <Input className="bg-white border-slate-200" placeholder="Direct image link (e.g. Cloudinary/S3)" value={proposal.solution.flowchartImageUrl} onChange={(e) => updateSolution({ flowchartImageUrl: e.target.value })} />
            </div>
            <div className="space-y-1">
              <LabelPremium>Live System Demo Link</LabelPremium>
              <Input className="bg-white border-slate-200" placeholder="https://..." value={proposal.solution.demoLink} onChange={(e) => updateSolution({ demoLink: e.target.value })} />
            </div>
            <div className="space-y-1">
              <LabelPremium>System Narrative</LabelPremium>
              <Textarea className="bg-white border-slate-200" value={proposal.solution.overview} onChange={(e) => updateSolution({ overview: e.target.value })} />
            </div>
          </div>
        );
      case 5: // Solution Modules
        return (
          <div className="space-y-8">
            <SectionHeader title="Functional Blueprint" subtitle="Select the core modules to be implemented" />
            <ModuleSelector selectedModules={proposal.solution.selectedModules} onChange={(m) => updateSolution({ selectedModules: m })} />
          </div>
        );
      case 6: // Technical Stack
        return (
          <div className="space-y-8">
            <SectionHeader title="Technology Protocol" subtitle="The architectural foundation of the solution" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Frontend Stack</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.techArchitecture.frontendStack.join(", ")} onChange={(e) => updateTechArchitecture({ frontendStack: e.target.value.split(",").map(i => i.trim()) })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Backend Stack</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.techArchitecture.backendStack.join(", ")} onChange={(e) => updateTechArchitecture({ backendStack: e.target.value.split(",").map(i => i.trim()) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Database System</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.techArchitecture.database} onChange={(e) => updateTechArchitecture({ database: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Cloud Infrastructure</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.techArchitecture.hosting} onChange={(e) => updateTechArchitecture({ hosting: e.target.value })} />
              </div>
            </div>
          </div>
        );
      case 7: // Strategic ROI
        return (
          <div className="space-y-8">
            <SectionHeader title="Economic Impact" subtitle="Quantify the expected returns and efficiency gains" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Revenue Increase (%)</LabelPremium>
                <Input type="number" className="bg-white border-slate-200" value={proposal.roi.revenueIncrease} onChange={(e) => updateROI({ revenueIncrease: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Productivity Gain (%)</LabelPremium>
                <Input type="number" className="bg-white border-slate-200" value={proposal.roi.productivityIncrease} onChange={(e) => updateROI({ productivityIncrease: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 p-6 bg-slate-900 rounded-[2rem] text-white">
              <div className="space-y-1">
                <LabelPremium className="text-white/40">Calculated System ROI</LabelPremium>
                <div className="text-4xl font-black text-primary tracking-tighter">{proposal.roi.expectedROI}%</div>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-6">
                <LabelPremium className="text-white/40">Profit Impact (est.)</LabelPremium>
                <Input className="bg-transparent border-none p-0 h-auto text-2xl font-black text-white focus-visible:ring-0" placeholder="e.g. $15k/mo" value={proposal.roi.profitImpact} onChange={(e) => updateROI({ profitImpact: e.target.value })} />
              </div>
            </div>
          </div>
        );
      case 8: // Commercial Framework
        return (
          <div className="space-y-8">
            <SectionHeader title="Financial Alignment" subtitle="Investment breakdown and milestone scheduling" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Core Valuation (₹)</LabelPremium>
                <Input type="number" className="bg-white border-slate-200 font-bold" value={proposal.pricing.coreValuation} onChange={(e) => updatePricing({ coreValuation: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Discount Protocol (%)</LabelPremium>
                <Input type="number" className="bg-white border-slate-200" value={proposal.pricing.discountPercentage} onChange={(e) => updatePricing({ discountPercentage: e.target.value })} />
              </div>
            </div>
            <div className="space-y-4">
              <LabelPremium>Payment Milestones</LabelPremium>
              <div className="grid gap-3">
                {proposal.pricing.milestones.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <Input className="flex-[3] bg-white" value={m.name} onChange={(e) => {
                      const newM = [...proposal.pricing.milestones];
                      newM[i].name = e.target.value;
                      updatePricing({ milestones: newM });
                    }} />
                    <div className="flex-[1] relative">
                      <Input className="bg-white pr-8 text-right font-black" type="number" value={m.percentage} onChange={(e) => {
                        const newM = [...proposal.pricing.milestones];
                        newM[i].percentage = Number(e.target.value);
                        updatePricing({ milestones: newM });
                      }} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <LabelPremium>ROI Settlement Narrative</LabelPremium>
              <Textarea className="bg-white border-slate-200" value={proposal.pricing.roiLogic} onChange={(e) => updatePricing({ roiLogic: e.target.value })} />
            </div>
          </div>
        );
      case 9: // Portfolio Protocol
        return (
          <div className="space-y-8">
            <SectionHeader title="Success Protocol" subtitle="Verify expertise via live deployment portfolio" />
            <div className="grid gap-4">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-1">
                  <LabelPremium>Live Project {idx + 1}</LabelPremium>
                  <Input 
                    className="bg-white border-slate-200"
                    placeholder="Project Title|https://deployment-link.com"
                    value={proposal.experience.portfolioLinks[idx] || ""}
                    onChange={(e) => {
                      const newLinks = [...proposal.experience.portfolioLinks];
                      newLinks[idx] = e.target.value;
                      updateExperience({ portfolioLinks: newLinks });
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest leading-relaxed">
                Format: <span className="text-primary">Project Title | URL</span>. This ensures the preview handles both labels and links correctly.
              </p>
            </div>
          </div>
        );
      case 10: // CTA & Closing
        return (
          <div className="space-y-8">
            <SectionHeader title="Strategic Alignment" subtitle="Finalize the engagement and next steps" />
            <div className="space-y-1">
              <LabelPremium>Scheduling Protocol (Calendly)</LabelPremium>
              <Input className="bg-white border-slate-200" placeholder="https://calendly.com/your-team" value={proposal.closing.meetingLink} onChange={(e) => updateClosing({ meetingLink: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Direct Email</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.closing.contactEmail} onChange={(e) => updateClosing({ contactEmail: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Direct Phone</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.closing.contactPhone} onChange={(e) => updateClosing({ contactPhone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <LabelPremium>Strategic Next Steps</LabelPremium>
              <Textarea className="min-h-[100px] bg-white border-slate-200" placeholder="Step 1, Step 2, Step 3..." value={proposal.closing.nextSteps.join(", ")} onChange={(e) => updateClosing({ nextSteps: e.target.value.split(",").map(s => s.trim()) })} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex h-screen overflow-hidden">
        {/* Left Input Panel: Redesigned for Premium Experience */}
        <div className="w-full md:w-1/2 lg:w-[42%] xl:w-[38%] flex flex-col border-r bg-white shadow-2xl z-30 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b bg-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0B0E14] rounded-xl flex items-center justify-center text-white shadow-xl">
                <img src="/asset/logo.png" alt="W" className="w-6 h-6 object-contain brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tighter text-[#0B0E14]">Proposal <span className="text-primary">OS.</span></h1>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Strategic Initiative</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
               <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                 <X size={20} />
               </Button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="px-8 py-3 bg-slate-50 border-b flex gap-2 overflow-x-auto no-scrollbar">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <button 
                  key={i} 
                  onClick={() => setCurrentStep(i)} 
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    currentStep === i 
                      ? "bg-[#0B0E14] text-white shadow-lg shadow-black/10" 
                      : "bg-white border border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                  }`}
                >
                  <StepIcon size={12} className={currentStep === i ? "text-primary" : "text-slate-300"} />
                  <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{step.name}</span>
                </button>
              );
            })}
          </div>

          {/* Step Progress */}
          <div className="h-1 w-full bg-slate-100 flex">
             <motion.div 
               className="h-full bg-primary" 
               initial={{ width: 0 }} 
               animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} 
               transition={{ duration: 0.3 }}
             />
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="mb-10 flex items-center justify-between">
                  <div className="text-[9px] font-black uppercase tracking-[0.5em] text-primary">Protocol Phase 0{currentStep + 1}</div>
                  <div className="h-[1px] flex-1 mx-6 bg-slate-100" />
                  <div className="text-[10px] font-black text-slate-300 italic">{currentStep + 1} / {steps.length}</div>
                </div>
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="p-8 border-t bg-slate-50 flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} 
              disabled={currentStep === 0} 
              className="h-12 px-6 rounded-2xl border-slate-200 text-xs font-black uppercase tracking-widest gap-2 bg-white hover:bg-slate-50"
            >
              <ChevronLeft size={16} /> Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={nextStep} 
                className="h-12 px-8 rounded-2xl bg-[#0B0E14] hover:bg-black text-white shadow-xl shadow-black/10 text-xs font-black uppercase tracking-widest gap-2"
              >
                Next Sequence <ChevronRight size={16} className="text-primary" />
              </Button>
            ) : (
              <Button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="h-12 px-8 rounded-2xl bg-primary hover:bg-[#88B540] text-white shadow-xl shadow-primary/20 text-xs font-black uppercase tracking-widest gap-2"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Finalize Protocol
              </Button>
            )}
          </div>
        </div>

        {/* Right Preview Panel: High-End Staging Area */}
        <div className="hidden md:flex flex-1 bg-slate-100 items-start justify-center overflow-y-auto p-12 custom-scrollbar relative">
           {/* Mockup Frame */}
           <div className="w-full max-w-5xl relative z-10 flex justify-center py-20">
              <div className="transform scale-[0.6] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 origin-top shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] transition-all duration-500">
                 <ProposalPDF proposal={proposal} />
              </div>
           </div>

           {/* Preview Floating Indicators */}
           <div className="absolute top-8 left-8 flex items-center gap-4">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-md border border-white rounded-2xl shadow-xl shadow-black/5">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Live Strategic Engine</span>
                 </div>
              </div>
           </div>

           <div className="absolute bottom-8 right-8 flex flex-col gap-3">
              <div className="px-5 py-3 bg-[#0B0E14] text-white rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10">
                 <div className="flex flex-col">
                    <span className="text-[7px] font-black text-white/40 uppercase tracking-widest mb-1">A4 Export Context</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">210mm × 297mm • Print Ready</span>
                 </div>
                 <div className="w-[1px] h-8 bg-white/10" />
                 <Monitor size={16} className="text-primary" />
              </div>
           </div>

           {/* Atmospheric Overlays */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center">
              <div className="text-[20vw] font-black uppercase tracking-tighter -rotate-12">STAGING</div>
           </div>
        </div>
      </div>
    </div>
  );
}
