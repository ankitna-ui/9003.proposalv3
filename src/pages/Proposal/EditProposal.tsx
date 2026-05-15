import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import ModuleSelector from "@/components/Proposal/ModuleSelector";
import TokenAnalyticsBar from "@/components/Proposal/TokenAnalyticsBar";
import { generateProposalContent, generateModuleFeatures, extractModulesFromContext } from "@/lib/gemini";
import { getProposal, updateProposal } from "@/lib/firestore";
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

export default function EditProposal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [singleModuleName, setSingleModuleName] = useState("");
  const [bulkContext, setBulkContext] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [previewModule, setPreviewModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    setAIContent,
    setProposal
  } = useProposalForm();
  
  const { consumeTokens } = useTokens();
  const [isPreviewZoomed, setIsPreviewZoomed] = useState(false);

  useEffect(() => {
    async function loadProposal() {
      if (!id) return;
      try {
        const data = await getProposal(id);
        if (data) {
          setProposal(data);
        } else {
          alert("Proposal not found");
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        alert("Error loading proposal");
      } finally {
        setIsLoading(false);
      }
    }
    loadProposal();
  }, [id, setProposal, navigate]);

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

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!proposal.client.proposalTitle) {
          alert("Proposal Title is required.");
          return false;
        }
        break;
      case 2:
        // No longer required
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
    if (!user || !id) return;
    
    if (proposal.userId !== user.uid) {
      alert("Permission denied. You do not own this strategic asset.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProposal(id, {
        ...proposal,
        updatedAt: Date.now()
      });
      alert("Protocol Synchronized!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to update proposal.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Retrieving protocol...</p>
        </div>
      </div>
    );
  }

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
            
            <div className="space-y-1">
              <LabelPremium>Proposal ID</LabelPremium>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black">#</span>
                <Input className="bg-white border-slate-200 pl-8 font-black" value={proposal.client.referenceId} onChange={(e) => updateClient({ referenceId: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1">
              <LabelPremium>Main Proposal Title</LabelPremium>
              <Input className="bg-white border-slate-200 font-bold" value={proposal.client.proposalTitle} onChange={(e) => updateClient({ proposalTitle: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Framework Title (Top Badge)</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.frameworkTitle} onChange={(e) => updateClient({ frameworkTitle: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Tagline (Under Logo)</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.tagline} onChange={(e) => updateClient({ tagline: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <LabelPremium>Strategic Domain (Industry)</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.industryTitle} onChange={(e) => updateClient({ industryTitle: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Proposal Date</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.filingDate} onChange={(e) => updateClient({ filingDate: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Footer Copyright Message</LabelPremium>
                <Input className="bg-white border-slate-200" value={proposal.client.footerMessage} placeholder="© Weblozy we automate solution" onChange={(e) => updateClient({ footerMessage: e.target.value })} />
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
                <LabelPremium>Years of Experience (Precision)</LabelPremium>
                <Input className="bg-white border-slate-200" placeholder="15+" value={proposal.experience.yearsOfExperience} onChange={(e) => updateExperience({ yearsOfExperience: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Projects Built</LabelPremium>
                <Input className="bg-white border-slate-200" placeholder="250+" value={proposal.experience.projectsCompleted} onChange={(e) => updateExperience({ projectsCompleted: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <LabelPremium>Industries Served</LabelPremium>
              <Input className="bg-white border-slate-200" placeholder="E-commerce, SaaS, Logistics" value={Array.isArray(proposal.experience.industriesServed) ? proposal.experience.industriesServed.join(", ") : ""} onChange={(e) => updateExperience({ industriesServed: e.target.value.split(",").map(s => s.trim()) })} />
            </div>
          </div>
        );

      case 2: // Operational Audit
        return (
          <div className="space-y-8">
            <SectionHeader title="Operational Audit Diagnosis" subtitle="Identify core bottlenecks and systemic friction" />
            
            <div className="space-y-1">
              <LabelPremium>Audit Narrative (Situational Analysis)</LabelPremium>
              <Textarea className="min-h-[100px] bg-white border-slate-200" placeholder="Describe the current state of operations..." value={proposal.situation.currentWorkflow} onChange={(e) => updateSituation({ currentWorkflow: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <LabelPremium>Financial Leakage (e.g. ₹10k+ / Mo)</LabelPremium>
                <Input className="bg-white border-slate-200" placeholder="₹10k+ / Mo" value={proposal.situation.revenueLeakage} onChange={(e) => updateSituation({ revenueLeakage: e.target.value })} />
              </div>
              <div className="space-y-1">
                <LabelPremium>Operational Drag (e.g. High Manual Overhead)</LabelPremium>
                <Input className="bg-white border-slate-200" placeholder="High Manual Overhead" value={proposal.situation.inefficiencies} onChange={(e) => updateSituation({ inefficiencies: e.target.value })} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <LabelPremium>Critical Friction Points</LabelPremium>
                <button type="button" onClick={() => updateSituation({ challenges: [...proposal.situation.challenges, ""] })} className="text-[10px] font-black uppercase text-[#1AA6E1] hover:underline">
                  + Add Point
                </button>
              </div>
              <div className="space-y-3">
                {proposal.situation.challenges.map((challenge, i) => (
                  <div key={i} className="flex gap-2">
                    <Input className="bg-white border-slate-200" placeholder={`Friction Point #${i + 1}`} value={challenge} onChange={(e) => {
                      const newChallenges = [...proposal.situation.challenges];
                      newChallenges[i] = e.target.value;
                      updateSituation({ challenges: newChallenges });
                    }} />
                    <button type="button" onClick={() => {
                      const newChallenges = proposal.situation.challenges.filter((_, index) => index !== i);
                      updateSituation({ challenges: newChallenges });
                    }} className="px-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-black">
                      ×
                    </button>
                  </div>
                ))}
                {proposal.situation.challenges.length === 0 && (
                  <div className="text-[10px] text-slate-400 italic text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No friction points added. Click "+ Add Point" to begin.
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3: // Strategic Ecosystem
        return (
          <div className="space-y-8 pb-10">
            <SectionHeader title="Strategic Solution Architecture" subtitle="Define pillars, connectivity, and hierarchy" />
            
            <div className="space-y-1">
              <LabelPremium>Strategic Approach (Narrative)</LabelPremium>
              <Textarea className="min-h-[80px] bg-white border-slate-200" placeholder="Describe the overall strategy..." value={proposal.solution.approach} onChange={(e) => updateSolution({ approach: e.target.value })} />
            </div>

            {/* Pillars */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <LabelPremium>Implementation Pillars</LabelPremium>
                <button type="button" onClick={() => updateSolution({ approachPoints: [...(proposal.solution.approachPoints || []), ""] })} className="text-[10px] font-black uppercase text-[#3ABEF9] hover:underline">
                  + Add Pillar
                </button>
              </div>
              <div className="space-y-2">
                {(proposal.solution.approachPoints || []).map((point, i) => (
                  <div key={i} className="flex gap-2">
                    <Input className="bg-white border-slate-200" placeholder={`Pillar #${i + 1}`} value={point} onChange={(e) => {
                      const next = [...(proposal.solution.approachPoints || [])];
                      next[i] = e.target.value;
                      updateSolution({ approachPoints: next });
                    }} />
                    <button type="button" onClick={() => updateSolution({ approachPoints: proposal.solution.approachPoints.filter((_, idx) => idx !== i) })} className="px-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-black">×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Connectivity Hub */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <LabelPremium>Connectivity Hub (Integrations)</LabelPremium>
                <button type="button" onClick={() => updateSolution({ integrations: [...(proposal.solution.integrations || []), ""] })} className="text-[10px] font-black uppercase text-[#3ABEF9] hover:underline">
                  + Add Integration
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(proposal.solution.integrations || []).map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input className="bg-white border-slate-200" placeholder="e.g. CRM, Payment Gateway" value={item} onChange={(e) => {
                      const next = [...(proposal.solution.integrations || [])];
                      next[i] = e.target.value;
                      updateSolution({ integrations: next });
                    }} />
                    <button type="button" onClick={() => updateSolution({ integrations: proposal.solution.integrations.filter((_, idx) => idx !== i) })} className="px-2 text-red-500 hover:bg-red-50 rounded-lg font-black">×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* User Hierarchy */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <LabelPremium>User Hierarchy (Roles)</LabelPremium>
                <button type="button" onClick={() => updateSolution({ userRoles: [...(proposal.solution.userRoles || []), ""] })} className="text-[10px] font-black uppercase text-[#3ABEF9] hover:underline">
                  + Add Role
                </button>
              </div>
              <div className="space-y-2">
                {(proposal.solution.userRoles || []).map((role, i) => (
                  <div key={i} className="flex gap-2">
                    <Input className="bg-white border-slate-200" placeholder={`Role #${i + 1} (e.g. Admin)`} value={typeof role === 'string' ? role : (role as any).role} onChange={(e) => {
                      const next = [...(proposal.solution.userRoles || [])];
                      next[i] = e.target.value;
                      updateSolution({ userRoles: next });
                    }} />
                    <button type="button" onClick={() => updateSolution({ userRoles: proposal.solution.userRoles.filter((_, idx) => idx !== i) })} className="px-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-black">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4: // Operational Flowchart
        return (
          <div className="space-y-8">
            <SectionHeader title="System Logic Architecture" subtitle="Upload the operational flowchart and define demo access" />
            
            <div className="space-y-6">
              <div className="space-y-1">
                <LabelPremium>Flowchart Logic Map (Image)</LabelPremium>
                <div className="mt-2 space-y-4">
                  {proposal.solution.flowchartImageUrl ? (
                    <div className="relative group rounded-[2rem] overflow-hidden border-2 border-[#99CB48]/20 bg-slate-50 aspect-video">
                      <img src={proposal.solution.flowchartImageUrl} alt="Flowchart" className="w-full h-full object-contain p-4" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button onClick={() => updateSolution({ flowchartImageUrl: "" })} className="p-3 bg-white rounded-2xl text-red-500 hover:scale-110 transition-transform">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative group">
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => updateSolution({ flowchartImageUrl: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="h-[200px] border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 flex flex-col items-center justify-center gap-4 group-hover:border-[#99CB48] group-hover:bg-[#99CB48]/5 transition-all">
                          <div className="w-14 h-14 rounded-3xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#99CB48]">
                            <ImagePlus size={28} />
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Upload Logic Flowchart</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">Select from local system</p>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">
                          <span className="bg-white px-4">Or use Image URL</span>
                        </div>
                      </div>
                      <Input 
                        className="bg-white border-slate-200 text-[10px]" 
                        placeholder="https://imgur.com/your-flowchart.png" 
                        value={proposal.solution.flowchartImageUrl} 
                        onChange={(e) => updateSolution({ flowchartImageUrl: e.target.value })} 
                      />
                    </>
                  )}
                </div>

              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <LabelPremium>System Demo Link (Optional)</LabelPremium>
                  <Input className="bg-white border-slate-200" placeholder="https://demo.weblozy.com" value={proposal.solution.demoLink} onChange={(e) => updateSolution({ demoLink: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        );
      case 5: // Solution Modules
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
              price: "TBD", // Suggested placeholder
              isCustom: true
            };
            setPreviewModule(newModule); // Show in selection phase
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

        return (
          <div className="space-y-8 pb-20">
            <TokenAnalyticsBar />
            <SectionHeader title="Functional Blueprint" subtitle="Define system modules via AI or Manual entry" />
            
            {/* AI Individual */}
            <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Module Generator</span>
              </div>
              <div className="flex gap-2">
                <Input 
                  className="bg-white border-blue-200" 
                  placeholder="Module Name (e.g. Smart Logistics)" 
                  value={singleModuleName}
                  onChange={(e) => setSingleModuleName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSingleModule()}
                />
                <Button onClick={handleAddSingleModule} disabled={isAiLoading} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">
                  {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : "Generate Details"}
                </Button>
              </div>
            </div>

            {/* Selection Preview Phase */}
            {previewModule && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-slate-900 rounded-[2.5rem] border border-[#3ABEF9]/30 shadow-2xl space-y-6"
              >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3ABEF9]">Selection Phase: AI Generated</div>
                      <h4 className="text-2xl font-black uppercase text-white">{previewModule.name}</h4>
                   </div>
                   <button onClick={() => setPreviewModule(null)} className="text-white/40 hover:text-white">
                      <X size={20} />
                   </button>
                </div>

                <div className="space-y-3">
                   <div className="text-[9px] font-black uppercase tracking-widest text-white/20">Proposed Core Features</div>
                   <div className="grid grid-cols-1 gap-2">
                      {previewModule.features.map((f: any, i: number) => (
                         <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl">
                            <CheckCircle size={14} className="text-[#3ABEF9]" />
                            <span className="text-[11px] font-bold text-white/70 uppercase">{f.name}</span>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="pt-4 flex gap-4">
                   <Button onClick={confirmPreviewModule} className="flex-1 bg-[#3ABEF9] hover:bg-[#3ABEF9]/90 text-slate-900 font-black uppercase tracking-widest rounded-2xl py-6">
                      Finalize & Add to Proposal Sheet
                   </Button>
                   <Button onClick={() => setPreviewModule(null)} variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-2xl px-8">
                      Discard
                   </Button>
                </div>
              </motion.div>
            )}

            {/* AI Bulk */}
            <div className="p-6 bg-purple-50/50 rounded-[2rem] border border-purple-100 space-y-4">
              <div className="flex items-center gap-2 text-purple-600">
                <Wand2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Bulk AI Extraction</span>
              </div>
              <Textarea 
                className="bg-white border-purple-200 min-h-[100px]" 
                placeholder="Paste system requirements or workflow paragraphs here..." 
                value={bulkContext}
                onChange={(e) => setBulkContext(e.target.value)}
              />
              <Button onClick={handleBulkExtract} disabled={isAiLoading || !bulkContext} className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl">
                {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : "Extract All Modules & Features"}
              </Button>
            </div>

            {/* Selected Modules List */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <LabelPremium>System Architecture Modules</LabelPremium>
                <Button onClick={handleAddManualModule} variant="ghost" className="text-[10px] font-black uppercase text-blue-600 hover:underline">
                  + Add Manual Module
                </Button>
              </div>

              <div className="space-y-4">
                {proposal.solution.selectedModules.map((module, mIdx) => (
                  <Card key={module.id} className="border-slate-200 overflow-hidden rounded-[2rem] shadow-sm">
                    <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex-1 flex gap-4 items-center">
                        <Input 
                          className="bg-transparent border-none font-black uppercase text-slate-800 focus-visible:ring-0 p-0 h-auto" 
                          value={module.name} 
                          onChange={(e) => {
                            const next = [...proposal.solution.selectedModules];
                            next[mIdx].name = e.target.value;
                            updateSolution({ selectedModules: next });
                          }}
                        />
                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200">
                          <span className="text-[8px] font-black text-slate-400">₹</span>
                          <input 
                            type="text"
                            placeholder="Price"
                            className="w-16 bg-transparent border-none text-[10px] font-bold focus:outline-none"
                            value={module.price || ""}
                            onChange={(e) => {
                              const next = [...proposal.solution.selectedModules];
                              next[mIdx].price = e.target.value;
                              updateSolution({ selectedModules: next });
                            }}
                          />
                        </div>
                      </div>
                      <button onClick={() => {
                        const next = proposal.solution.selectedModules.filter((_, i) => i !== mIdx);
                        updateSolution({ selectedModules: next });
                      }} className="text-slate-300 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid gap-3">
                        {module.features.map((feature, fIdx) => {
                          const fName = typeof feature === 'string' ? feature : feature.name;
                          const fPrice = typeof feature === 'string' ? "" : (feature.price || "");
                          
                          return (
                            <div key={fIdx} className="flex items-center gap-4 group">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              <Input 
                                className="flex-1 bg-transparent border-none p-0 h-auto text-[11px] font-bold text-slate-600 focus-visible:ring-0" 
                                value={fName}
                                onChange={(e) => {
                                  const next = [...proposal.solution.selectedModules];
                                  next[mIdx].features[fIdx] = { name: e.target.value, price: fPrice };
                                  updateSolution({ selectedModules: next });
                                }}
                              />
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-black text-slate-300">₹</span>
                                <input 
                                  type="text"
                                  placeholder="Add-on"
                                  className="w-14 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-bold focus:outline-none"
                                  value={fPrice}
                                  onChange={(e) => {
                                    const next = [...proposal.solution.selectedModules];
                                    next[mIdx].features[fIdx] = { name: fName, price: e.target.value };
                                    updateSolution({ selectedModules: next });
                                  }}
                                />
                              </div>
                              <button onClick={() => {
                                const next = [...proposal.solution.selectedModules];
                                next[mIdx].features = next[mIdx].features.filter((_, i) => i !== fIdx);
                                updateSolution({ selectedModules: next });
                              }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500">
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })}
                        <button onClick={() => {
                          const next = [...proposal.solution.selectedModules];
                          next[mIdx].features.push({ name: "New Feature", price: "" });
                          updateSolution({ selectedModules: next });
                        }} className="text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 text-left pl-5 mt-2">
                          + Add Feature
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {proposal.solution.selectedModules.length === 0 && (
                  <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <Box size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No modules added yet</p>
                  </div>
                )}
              </div>
            </div>
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
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol: {proposal.client.referenceId}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
               <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
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
        <div className="hidden md:flex flex-1 bg-slate-100 items-start justify-center overflow-y-auto p-12 custom-scrollbar relative scroll-smooth">
            <div className="w-full max-w-5xl relative z-10 flex justify-center py-20">
               <div className={`transition-all duration-500 origin-top shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] ${
                 isPreviewZoomed 
                   ? "scale-100" 
                   : "scale-[0.6] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100"
               }`}>
                  <ProposalPDF proposal={proposal} activeStep={currentStep} />
               </div>
            </div>

           {/* Preview Floating Indicators */}
           <div className="absolute top-8 left-8 flex items-center gap-4">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-md border border-white rounded-2xl shadow-xl shadow-black/5 flex items-center gap-3">
                 <div className="flex items-center gap-3 border-r pr-3 border-slate-200">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Live Strategic Engine</span>
                 </div>
                 <Button 
                   variant="ghost" 
                   size="xs" 
                   onClick={() => setIsPreviewZoomed(!isPreviewZoomed)}
                   className="h-6 px-2 text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                 >
                   {isPreviewZoomed ? "Exit Focus" : "Focus Mode"}
                 </Button>
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
