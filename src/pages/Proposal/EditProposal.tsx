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
          alert("Proposal not found");
          navigate("/dashboard");
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
      alert("AI Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await updateProposal(id, {
        ...proposal,
        updatedAt: Date.now()
      });
      alert("Strategic Protocol Updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to update protocol.");
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
                <h1 className="text-2xl font-black uppercase tracking-tighter text-[#0B0E14]">Edit <span className="text-primary">OS.</span></h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Strategic Protocol V2</p>
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
              <Button onClick={() => setCurrentStep(prev => prev + 1)} className="h-14 px-10 rounded-2xl bg-[#0B0E14] hover:bg-black text-white shadow-2xl shadow-black/10 text-xs font-black uppercase tracking-widest">
                Next Sequence <ChevronRight size={20} className="text-primary ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={isSaving} className="h-14 px-10 rounded-2xl bg-primary hover:bg-[#88B540] text-white shadow-2xl shadow-primary/20 text-xs font-black uppercase tracking-widest">
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="mr-2" />} Update Protocol
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
