import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  X, 
  Loader2,
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
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useProposalForm } from "@/hooks/useProposalForm";
import { useTokens } from "@/hooks/useTokens";
import { generateProposalContent } from "@/lib/gemini";
import { getProposal, updateProposal } from "@/lib/firestore";
import { auth } from "@/lib/firebase";

import ProposalPDF from "@/components/Proposal/pages2";
import {
  CoverIdentityPanel,
  CorporateLegacyPanel,
  OperationalAuditPanel,
  StrategicEcosystemPanel,
  OperationalFlowchartPanel,
  SolutionModulesPanel,
  TechnicalStackPanel,
  StrategicROIPanel,
  CommercialFrameworkPanel,
  PortfolioProtocolPanel,
  CTAClosingPanel
} from "@/components/Proposal/InputPanel";

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
  const [isLoading, setIsLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  useEffect(() => {
    setValidationError(null);
  }, [currentStep, proposal.client.proposalTitle, proposal.solution.selectedModules]);

  const { consumeTokens } = useTokens();

  useEffect(() => {
    async function loadProposal() {
      if (!id) return;
      try {
        const data = await getProposal(id);
        if (data) {
          setProposal(data);
        } else {
          toast.error("Protocol Error: Requested document not found in strategic archives.");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(error);
        toast.error("System Error: Failed to retrieve protocol from secure storage.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProposal();
  }, [id, setProposal, navigate]);

  const handleAIAction = async () => {
    if (!proposal.situation.meetingNotes) {
      toast.warning("Protocol Error: Please add meeting notes first to synchronize AI.");
      return;
    }
    
    setIsGenerating(true);
    const aiPromise = generateProposalContent(
      proposal.situation.meetingNotes,
      proposal.client.companyName,
      proposal.solution.selectedModules.map(m => m.name)
    );

    toast.promise(aiPromise, {
      pending: 'Synchronizing Strategic AI Intelligence...',
      success: 'AI Content Synchronized Successfully! ✨',
      error: 'AI Synchronization Failed. Please verify connectivity.'
    });

    try {
      const { content, tokens } = await aiPromise;
      setAIContent(content);
      consumeTokens(tokens);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!proposal.client.proposalTitle?.trim()) {
          setValidationError("Validation Error: Main Proposal Title is required.");
          return false;
        }
        break;
      case 5:
        if (proposal.solution.selectedModules.length === 0) {
          setValidationError("Validation Error: Add at least one module node to continue.");
          return false;
        }
        break;
    }
    setValidationError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handleSave = async () => {
    if (!id) return;

    if (!proposal.client.proposalTitle?.trim()) {
      setValidationError("Pre-Flight Check Failed: Proposal Title is required.");
      return;
    }

    setValidationError(null);

    setIsSaving(true);
    
    const updatePromise = updateProposal(id, {
      ...proposal,
      updatedAt: Date.now()
    });

    toast.promise(updatePromise, {
      pending: 'Synchronizing Protocol Changes...',
      success: 'Strategic Protocol Updated Successfully! 🚀',
      error: 'Failed to update protocol. Please try again.'
    });

    try {
      await updatePromise;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0B0E14]">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Loading Protocol...</p>
        </div>
      </div>
    );
  }

  const panelProps = {
    proposal,
    currentStep,
    updateClient,
    updateSituation,
    updateSolution,
    updateTechArchitecture,
    updateROI,
    updateExperience,
    updatePricing,
    updateClosing
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <CoverIdentityPanel {...panelProps} />;
      case 1: return <CorporateLegacyPanel {...panelProps} />;
      case 2: return <OperationalAuditPanel {...panelProps} />;
      case 3: return <StrategicEcosystemPanel {...panelProps} />;
      case 4: return <OperationalFlowchartPanel {...panelProps} />;
      case 5: return <SolutionModulesPanel {...panelProps} />;
      case 6: return <TechnicalStackPanel {...panelProps} />;
      case 7: return <StrategicROIPanel {...panelProps} />;
      case 8: return <CommercialFrameworkPanel {...panelProps} />;
      case 9: return <PortfolioProtocolPanel {...panelProps} />;
      case 10: return <CTAClosingPanel {...panelProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen overflow-hidden">
        {/* Modernized Input Panel with Glassmorphism */}
        <div className="w-full md:w-1/2 lg:w-[42%] xl:w-[40%] flex flex-col border-r border-slate-100 bg-white/40 backdrop-blur-3xl z-30 overflow-hidden relative shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)]">
           
           {/* High-End Header */}
           <div className="px-10 py-10 border-b border-slate-100/50 bg-white/20 backdrop-blur-md flex justify-between items-center sticky top-0 z-40">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-[#0B0E14] rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 group">
                    <img src="/asset/logo.png" alt="W" className="w-9 h-9 object-contain brightness-0 invert transition-transform group-hover:scale-110" />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#0B0E14]">Strategic <span className="text-primary italic">OS.</span></h1>
                    <div className="flex items-center gap-2.5 mt-1.5">
                       <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_#99CB48]" />
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Tactical Editor V4.0</p>
                    </div>
                 </div>
              </div>
              <button onClick={() => navigate("/dashboard")} className="w-12 h-12 flex items-center justify-center bg-slate-100/80 hover:bg-red-500 rounded-2xl text-slate-400 hover:text-white transition-all duration-300 border border-transparent shadow-sm">
                 <X size={22} />
              </button>
           </div>

           {/* Advanced Step Navigation */}
           <div className="px-10 py-6 bg-slate-50/30 border-b border-slate-100/50 flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
              {steps.map((step, i) => {
                 const StepIcon = step.icon;
                 const isActive = currentStep === i;
                 return (
                    <button 
                       key={i} 
                       onClick={() => setCurrentStep(i)} 
                       className={`flex-shrink-0 flex items-center gap-3.5 px-6 py-3 rounded-2xl transition-all duration-500 relative group ${
                          isActive 
                             ? "bg-[#0B0E14] text-white shadow-2xl shadow-black/20 scale-105" 
                             : "bg-white/60 border border-slate-100/50 text-slate-400 hover:border-primary/50 hover:text-slate-700"
                       }`}
                    >
                       <div className={`p-2 rounded-xl transition-colors duration-500 ${isActive ? "bg-primary text-white shadow-[0_0_15px_#99CB48]" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}>
                          <StepIcon size={14} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{step.name}</span>
                       {isActive && (
                          <motion.div layoutId="activeStep" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_#99CB48]" />
                       )}
                    </button>
                 );
              })}
           </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white/30">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }} 
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                {validationError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-red-500/5"
                  >
                    {validationError}
                  </motion.div>
                )}
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

           {/* Premium Control Footer */}
           <div className="p-10 border-t border-slate-100/50 bg-white/80 backdrop-blur-2xl flex justify-between items-center sticky bottom-0 z-40">
              <Button 
                 variant="outline" 
                 onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} 
                 disabled={currentStep === 0} 
                 className="h-16 px-10 rounded-[1.25rem] border-slate-200 text-[11px] font-black uppercase tracking-[0.2em] bg-white hover:bg-slate-900 hover:text-white transition-all duration-500 disabled:opacity-20 shadow-sm"
              >
                 <ChevronLeft size={20} className="mr-3" /> Back Sequence
              </Button>
              
              <div className="flex gap-4 items-center">
                 <div className="hidden lg:flex flex-col items-end mr-6 border-r border-slate-100 pr-6">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Architecture Progress</span>
                    <span className="text-[12px] font-black text-[#0B0E14] tabular-nums tracking-tighter">{Math.round(((currentStep + 1) / steps.length) * 100)}% Synchronized</span>
                 </div>
                 {currentStep < steps.length - 1 ? (
                    <Button onClick={nextStep} className="h-16 px-12 rounded-[1.25rem] bg-[#0B0E14] hover:bg-primary hover:text-white shadow-2xl shadow-black/20 text-[11px] font-black uppercase tracking-[0.3em] group transition-all duration-500">
                       Proceed <ChevronRight size={20} className="text-primary group-hover:text-white ml-3 group-hover:translate-x-2 transition-all" />
                    </Button>
                 ) : (
                    <Button onClick={handleSave} disabled={isSaving} className="h-16 px-12 rounded-[1.25rem] bg-primary hover:bg-[#88B540] text-white shadow-2xl shadow-primary/30 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 scale-105 active:scale-95">
                       {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="mr-3" />} Finalize Protocol
                    </Button>
                 )}
              </div>
           </div>
        </div>

        {/* Cleaned Preview Panel (Dedicated Header & Soft Shadows) */}
        <div className="hidden md:flex flex-col flex-1 bg-slate-50/50 border-l border-slate-100 overflow-hidden h-full relative">
           {/* Sticky Top Status Header */}
           <div className="sticky top-0 z-20 w-full bg-white/85 backdrop-blur-md border-b border-slate-100/80 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#99CB48] animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Real-time Visualization</span>
              </div>
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                 Live Render
              </div>
           </div>

           {/* Scrollable Document Area */}
           <div className="flex-1 overflow-y-auto p-12 custom-scrollbar flex justify-center items-start bg-slate-50/20">
              <div className="relative z-10 flex justify-center h-fit w-full">
                 <div className="pdf-preview-scale transition-all duration-500 h-fit rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/80 bg-white">
                    <ProposalPDF proposal={proposal} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

  );
}
