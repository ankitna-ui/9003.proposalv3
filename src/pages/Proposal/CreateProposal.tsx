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
  Sparkles,
  ImagePlus,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProposalForm } from "@/hooks/useProposalForm";
import { useTokens } from "@/hooks/useTokens";
import TokenAnalyticsBar from "@/components/Proposal/TokenAnalyticsBar";
import { generateProposalContent, generateModuleFeatures, extractModulesFromContext } from "@/lib/gemini";
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
  const [singleModuleName, setSingleModuleName] = useState("");
  const [bulkContext, setBulkContext] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [previewModule, setPreviewModule] = useState<Module | null>(null);
  
  const { consumeTokens } = useTokens();

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

  // Handlers
  const handleAIAction = async () => {
    if (!proposal.situation.meetingNotes) {
      alert("Please add meeting notes first to generate content.");
      return;
    }
    setIsGenerating(true);
    try {
      const { content, tokens } = await generateProposalContent(
        proposal.situation.meetingNotes,
        proposal.client.companyName,
        proposal.solution.selectedModules.map(m => m.name)
      );
      setAIContent(content);
      consumeTokens(tokens);
      alert("AI Intelligence Synchronized!");
    } catch (error) {
      console.error(error);
      alert("AI Generation failed. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSingleModule = async () => {
    if (!singleModuleName) return;
    setIsAiLoading(true);
    try {
      const { features, tokens } = await generateModuleFeatures(singleModuleName);
      consumeTokens(tokens);
      const newModule: Module = {
        id: Math.random().toString(36).substr(2, 9),
        name: singleModuleName,
        features: features.map((f: string) => ({ name: f, price: "" })),
        price: "TBD",
        isCustom: true
      };
      setPreviewModule(newModule);
    } catch (error) {
      console.error("AI Feature generation failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  const confirmPreviewModule = () => {
    if (!previewModule) return;
    updateSolution({ selectedModules: [...proposal.solution.selectedModules, previewModule] });
    setPreviewModule(null);
    setSingleModuleName("");
  };

  const handleBulkExtract = async () => {
    if (!bulkContext) return;
    setIsAiLoading(true);
    try {
      const { modules: extracted, tokens } = await extractModulesFromContext(bulkContext);
      consumeTokens(tokens);
      const newModules = extracted.map((m: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: m.name,
        description: m.description,
        features: m.features.map((f: string) => ({ name: f, price: "" })),
        price: "",
        isCustom: true
      }));
      updateSolution({ selectedModules: [...proposal.solution.selectedModules, ...newModules] });
      setBulkContext("");
    } catch (error) {
      console.error("AI Bulk extraction failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddManualModule = () => {
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Module",
      features: [],
      price: "",
      isCustom: true
    };
    updateSolution({ selectedModules: [...proposal.solution.selectedModules, newModule] });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!proposal.client.proposalTitle) {
          alert("Proposal Title is required.");
          return false;
        }
        break;
      case 5:
        if (proposal.solution.selectedModules.length === 0) {
          alert("Add at least one module to continue.");
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
    <div className="mb-10 border-b border-slate-100 pb-6">
      <div className="flex items-center gap-2 mb-2">
         <div className="w-6 h-[2px] bg-primary" />
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Protocol Phase 0{currentStep + 1}</span>
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0B0E14]">{title}</h3>
      {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed max-w-sm">{subtitle}</p>}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Cover & Identity
        return (
          <div className="space-y-8">
            <SectionHeader title="Brand Configuration" subtitle="Define the strategic identity of this proposal" />
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

      case 1: // Corporate Legacy
        return (
          <div className="space-y-8">
            <SectionHeader title="Operational Authority" subtitle="Display your track record and market authority" />
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
              <LabelPremium>Industries Served</LabelPremium>
              <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder="E-commerce, SaaS, Logistics" value={Array.isArray(proposal.experience.industriesServed) ? proposal.experience.industriesServed.join(", ") : ""} onChange={(e) => updateExperience({ industriesServed: e.target.value.split(",").map(s => s.trim()) })} />
            </div>
          </div>
        );

      case 2: // Operational Audit
        return (
          <div className="space-y-8">
            <SectionHeader title="Operational Audit Diagnosis" subtitle="Identify core bottlenecks and systemic friction" />
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
                {proposal.situation.challenges.map((challenge, i) => (
                  <div key={i} className="flex gap-2">
                    <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder={`Challenge #${i + 1}`} value={challenge} onChange={(e) => {
                      const next = [...proposal.situation.challenges];
                      next[i] = e.target.value;
                      updateSituation({ challenges: next });
                    }} />
                    <button type="button" onClick={() => updateSituation({ challenges: proposal.situation.challenges.filter((_, idx) => idx !== i) })} className="px-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-black">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Strategic Ecosystem
        return (
          <div className="space-y-8">
            <SectionHeader title="Strategic Solution Architecture" subtitle="Define pillars, connectivity, and hierarchy" />
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
                {(proposal.solution.approachPoints || []).map((point, i) => (
                  <div key={i} className="flex gap-2">
                    <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={point} onChange={(e) => {
                      const next = [...(proposal.solution.approachPoints || [])];
                      next[i] = e.target.value;
                      updateSolution({ approachPoints: next });
                    }} />
                    <button type="button" onClick={() => updateSolution({ approachPoints: proposal.solution.approachPoints.filter((_, idx) => idx !== i) })} className="px-4 text-red-500 hover:bg-red-50 rounded-2xl font-black">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Operational Flowchart
        return (
          <div className="space-y-8">
            <SectionHeader title="System Logic Architecture" subtitle="Upload flowchart and define demo access" />
            <div className="space-y-6">
              <LabelPremium>Flowchart Image</LabelPremium>
              {proposal.solution.flowchartImageUrl ? (
                <div className="relative group rounded-3xl overflow-hidden border-2 border-primary/20 bg-slate-50 aspect-video">
                  <img src={proposal.solution.flowchartImageUrl} alt="Flowchart" className="w-full h-full object-contain p-4" />
                  <button onClick={() => updateSolution({ flowchartImageUrl: "" })} className="absolute top-4 right-4 p-3 bg-white rounded-2xl text-red-500 shadow-xl"><Trash2 size={20} /></button>
                </div>
              ) : (
                <div className="relative group">
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => updateSolution({ flowchartImageUrl: reader.result as string });
                      reader.readAsDataURL(file);
                    }
                  }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="h-[200px] border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 flex flex-col items-center justify-center gap-4 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                    <ImagePlus size={28} className="text-slate-400" />
                    <p className="text-[10px] font-black uppercase text-slate-900">Upload Logic Flowchart</p>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <LabelPremium>Flowchart URL</LabelPremium>
                <Input className="h-14 bg-white border-slate-200 rounded-2xl" placeholder="https://..." value={proposal.solution.flowchartImageUrl} onChange={(e) => updateSolution({ flowchartImageUrl: e.target.value })} />
              </div>
            </div>
          </div>
        );

      case 5: // Solution Modules
        return (
          <div className="space-y-8 pb-20">
            <TokenAnalyticsBar />
            <SectionHeader title="Functional Blueprint" subtitle="Define system modules via AI or Manual entry" />
            
            {/* AI Generator */}
            <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600">
                <Sparkles size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Neural Module Generator</span>
              </div>
              <div className="flex gap-3">
                <Input 
                  className="h-14 bg-white border-blue-200 rounded-2xl px-6" 
                  placeholder="Module Name (e.g. Smart Logistics)" 
                  value={singleModuleName}
                  onChange={(e) => setSingleModuleName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSingleModule()}
                />
                <Button onClick={handleAddSingleModule} disabled={isAiLoading} className="h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl px-10 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                  {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : "Generate"}
                </Button>
              </div>
            </div>

            {/* Selection Preview Phase */}
            {previewModule && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-slate-900 rounded-[3rem] border border-[#3ABEF9]/30 shadow-2xl space-y-8">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3ABEF9]">Selection Phase: AI Optimized</div>
                      <h4 className="text-3xl font-black uppercase text-white tracking-tighter">{previewModule.name}</h4>
                   </div>
                   <button onClick={() => setPreviewModule(null)} className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"><X size={24} /></button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   {previewModule.features.map((f: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/[0.08] transition-colors">
                         <CheckCircle size={18} className="text-[#3ABEF9]" />
                         <span className="text-xs font-bold text-white/70 uppercase tracking-wide">{f.name}</span>
                      </div>
                   ))}
                </div>
                <div className="pt-4">
                  <Button onClick={confirmPreviewModule} className="w-full h-16 bg-[#3ABEF9] hover:bg-[#3ABEF9]/90 text-slate-900 font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#3ABEF9]/20">
                    Finalize & Add to Proposal
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Bulk Extraction */}
            <div className="p-8 bg-purple-50/50 rounded-[2.5rem] border border-purple-100 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-purple-600"><Wand2 size={18} /><span className="text-[11px] font-black uppercase tracking-[0.2em]">Bulk System Extraction</span></div>
              <Textarea className="bg-white border-purple-200 min-h-[120px] rounded-3xl p-5" placeholder="Paste system requirements..." value={bulkContext} onChange={(e) => setBulkContext(e.target.value)} />
              <Button onClick={handleBulkExtract} disabled={isAiLoading || !bulkContext} className="w-full h-14 bg-purple-600 hover:bg-purple-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-600/20">Extract All Modules</Button>
            </div>

            {/* List */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-4">
                <LabelPremium>Selected Solution Modules</LabelPremium>
                <Button onClick={handleAddManualModule} variant="ghost" className="text-[10px] font-black uppercase text-blue-600 hover:underline">+ Add Manual</Button>
              </div>
              <div className="space-y-4">
                {proposal.solution.selectedModules.map((module, mIdx) => (
                  <Card key={module.id} className="border-slate-200 overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <Input className="bg-transparent border-none font-black uppercase text-slate-800 text-lg focus-visible:ring-0 p-0 h-auto" value={module.name} onChange={(e) => {
                        const next = [...proposal.solution.selectedModules];
                        next[mIdx].name = e.target.value;
                        updateSolution({ selectedModules: next });
                      }} />
                      <button onClick={() => updateSolution({ selectedModules: proposal.solution.selectedModules.filter((_, i) => i !== mIdx) })} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                    </div>
                    <CardContent className="p-8 space-y-6">
                      <div className="grid gap-4">
                        {module.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-4 group">
                            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                            <Input className="flex-1 bg-transparent border-none p-0 h-auto text-xs font-bold text-slate-600 focus-visible:ring-0" value={typeof feature === 'string' ? feature : feature.name} onChange={(e) => {
                              const next = [...proposal.solution.selectedModules];
                              next[mIdx].features[fIdx] = { name: e.target.value, price: "" };
                              updateSolution({ selectedModules: next });
                            }} />
                            <button onClick={() => {
                              const next = [...proposal.solution.selectedModules];
                              next[mIdx].features = next[mIdx].features.filter((_, i) => i !== fIdx);
                              updateSolution({ selectedModules: next });
                            }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"><X size={16} /></button>
                          </div>
                        ))}
                        <button onClick={() => {
                          const next = [...proposal.solution.selectedModules];
                          next[mIdx].features.push({ name: "New Feature", price: "" });
                          updateSolution({ selectedModules: next });
                        }} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 pl-6 mt-2">+ Add Feature</button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 6: // Technical Stack
        return (
          <div className="space-y-8">
            <SectionHeader title="Technology Protocol" subtitle="The architectural foundation" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Frontend Stack</LabelPremium>
                <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.techArchitecture.frontendStack.join(", ")} onChange={(e) => updateTechArchitecture({ frontendStack: e.target.value.split(",").map(i => i.trim()) })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Backend Stack</LabelPremium>
                <Input className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.techArchitecture.backendStack.join(", ")} onChange={(e) => updateTechArchitecture({ backendStack: e.target.value.split(",").map(i => i.trim()) })} />
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

      case 7: // Strategic ROI
        return (
          <div className="space-y-8">
            <SectionHeader title="Economic Impact" subtitle="Quantify expected returns" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Revenue Increase (%)</LabelPremium>
                <Input type="number" className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.roi.revenueIncrease} onChange={(e) => updateROI({ revenueIncrease: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Productivity Gain (%)</LabelPremium>
                <Input type="number" className="h-14 bg-white border-slate-200 rounded-2xl" value={proposal.roi.productivityIncrease} onChange={(e) => updateROI({ productivityIncrease: e.target.value })} />
              </div>
            </div>
            <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl">
               <div className="space-y-1">
                  <LabelPremium className="text-white/40">Calculated ROI</LabelPremium>
                  <div className="text-5xl font-black text-primary tracking-tighter">{proposal.roi.expectedROI}%</div>
               </div>
               <div className="w-[1px] h-16 bg-white/10" />
               <div className="space-y-1 text-right">
                  <LabelPremium className="text-white/40 text-right">Profit Impact</LabelPremium>
                  <Input className="bg-transparent border-none p-0 h-auto text-3xl font-black text-white focus-visible:ring-0 text-right" placeholder="$15k/mo" value={proposal.roi.profitImpact} onChange={(e) => updateROI({ profitImpact: e.target.value })} />
               </div>
            </div>
          </div>
        );

      case 8: // Commercial Framework
        return (
          <div className="space-y-8">
            <SectionHeader title="Financial Alignment" subtitle="Investment breakdown" />
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

      case 9: // Portfolio Protocol
        return (
          <div className="space-y-8">
            <SectionHeader title="Success Protocol" subtitle="Verify expertise via live deployments" />
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

      case 10: // CTA & Closing
        return (
          <div className="space-y-8">
            <SectionHeader title="Strategic Alignment" subtitle="Finalize engagement" />
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

      default:
        return <div className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.5em]">Phase Under Construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex h-screen overflow-hidden">
        {/* Input Panel */}
        <div className="w-full md:w-1/2 lg:w-[42%] xl:w-[40%] flex flex-col border-r bg-white shadow-2xl z-30 overflow-hidden">
          <div className="px-10 py-8 border-b bg-white flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-[#0B0E14] rounded-2xl flex items-center justify-center text-white shadow-2xl">
                <img src="/asset/logo.png" alt="W" className="w-8 h-8 object-contain brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter text-[#0B0E14]">Proposal <span className="text-primary">OS.</span></h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Strategic Initiative</p>
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/dashboard")} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-all hover:bg-red-50"><X size={24} /></button>
          </div>

          <div className="px-10 py-4 bg-slate-50/50 border-b flex gap-3 overflow-x-auto no-scrollbar">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <button 
                  key={i} 
                  onClick={() => setCurrentStep(i)} 
                  className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl transition-all ${
                    currentStep === i 
                      ? "bg-[#0B0E14] text-white shadow-xl shadow-black/10" 
                      : "bg-white border border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  <StepIcon size={14} className={currentStep === i ? "text-primary" : "text-slate-300"} />
                  <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{step.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-10 border-t bg-slate-50/80 backdrop-blur-sm flex justify-between items-center">
            <Button variant="outline" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="h-14 px-8 rounded-2xl border-slate-200 text-xs font-black uppercase tracking-widest bg-white">
              <ChevronLeft size={20} className="mr-2" /> Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} className="h-14 px-10 rounded-2xl bg-[#0B0E14] hover:bg-black text-white shadow-2xl shadow-black/10 text-xs font-black uppercase tracking-widest">
                Next Sequence <ChevronRight size={20} className="text-primary ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={isSaving} className="h-14 px-10 rounded-2xl bg-primary hover:bg-[#88B540] text-white shadow-2xl shadow-primary/20 text-xs font-black uppercase tracking-widest">
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="mr-2" />} Finalize Protocol
              </Button>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="hidden md:flex flex-1 bg-slate-100 items-start justify-center overflow-y-auto p-16 custom-scrollbar relative">
           <div className="w-full max-w-5xl py-20 relative z-10">
              <div className="transform scale-[0.6] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-105 origin-top shadow-[0_60px_150px_-30px_rgba(0,0,0,0.4)] transition-all duration-700">
                 <ProposalPDF proposal={proposal} />
              </div>
           </div>
           
           <div className="absolute top-10 left-10 flex items-center gap-4">
              <div className="px-6 py-3 bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(153,203,72,0.8)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Live Strategic Engine</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
