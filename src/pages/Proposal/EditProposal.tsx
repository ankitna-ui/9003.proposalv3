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

  const handleSave = async () => {
    if (!id) return;
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
        {/* Modernized Input Panel */}
        <div className="w-full md:w-1/2 lg:w-[42%] xl:w-[40%] flex flex-col border-r border-slate-100 bg-[#F8FAFC] shadow-[20px_0_40px_-15px_rgba(0,0,0,0.03)] z-30 overflow-hidden relative">
          
          {/* Header */}
          <div className="px-10 py-8 border-b border-slate-100 bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-[#0B0E14] rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src="/asset/logo.png" alt="W" className="w-8 h-8 object-contain brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter text-[#0B0E14]">Edit <span className="text-primary italic">OS.</span></h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#99CB48]" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Strategic Editor V3</p>
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/dashboard")} className="w-10 h-10 flex items-center justify-center bg-slate-100/50 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
              <X size={20} />
            </button>
          </div>

          {/* Premium Step Navigation */}
          <div className="px-8 py-5 bg-white/40 border-b border-slate-100 flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = currentStep === i;
              return (
                <button 
                  key={i} 
                  onClick={() => setCurrentStep(i)} 
                  className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-[#0B0E14] text-white shadow-xl shadow-black/10 scale-105" 
                      : "bg-white/80 border border-slate-100 text-slate-400 hover:border-primary/30 hover:text-slate-600"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? "bg-primary/20 text-primary" : "bg-slate-100 text-slate-300"}`}>
                    <StepIcon size={12} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{step.name}</span>
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
                className="max-w-2xl mx-auto"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Modernized Footer Controls */}
          <div className="p-10 border-t border-slate-100 bg-white/90 backdrop-blur-xl flex justify-between items-center sticky bottom-0">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} 
              disabled={currentStep === 0} 
              className="h-14 px-8 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest bg-white hover:bg-slate-50 transition-all disabled:opacity-30"
            >
              <ChevronLeft size={18} className="mr-2" /> Back
            </Button>
            
            <div className="flex gap-2 items-center">
              <div className="hidden lg:flex flex-col items-end mr-4">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Progress</span>
                <span className="text-[10px] font-black text-slate-900">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
              </div>
              {currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep(prev => prev + 1)} className="h-14 px-10 rounded-2xl bg-[#0B0E14] hover:bg-black text-white shadow-xl shadow-black/10 text-[10px] font-black uppercase tracking-[0.2em] group">
                  Next Sequence <ChevronRight size={18} className="text-primary ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button onClick={handleSave} disabled={isSaving} className="h-14 px-10 rounded-2xl bg-primary hover:bg-[#88B540] text-white shadow-xl shadow-primary/20 text-[10px] font-black uppercase tracking-[0.2em]">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="mr-2" />} Update Protocol
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Cleaned Preview Panel (Removed background as requested) */}
        <div className="hidden md:flex flex-1 bg-slate-50 items-start justify-center overflow-y-auto p-12 custom-scrollbar relative">
           <div className="w-full max-w-5xl py-2 relative z-10 flex justify-center h-fit">
              <div className="origin-top shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 transform scale-[0.6] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-[0.95] h-fit">
                 <ProposalPDF proposal={proposal} />
              </div>
           </div>
           
           <div className="absolute top-8 left-8 flex items-center gap-4">
              <div className="px-6 py-3 bg-white border border-slate-100 rounded-[2rem] shadow-xl">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Real-time Visualization</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

  );
}
