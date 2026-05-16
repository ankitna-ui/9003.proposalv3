import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, X, Loader2, Trash2, Sparkles, CheckCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTokens } from "@/hooks/useTokens";
import TokenAnalyticsBar from "@/components/Proposal/TokenAnalyticsBar";
import { generateModuleFeatures, extractModulesFromContext } from "@/lib/gemini";
import { Module } from "@/types/proposal";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea } from "./shared";

export default function SolutionModulesPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  const [singleModuleName, setSingleModuleName] = useState("");
  const [bulkContext, setBulkContext] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [previewModule, setPreviewModule] = useState<Module | null>(null);
  const { consumeTokens } = useTokens();

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
      name: "New Strategic Module",
      features: [],
      price: "",
      isCustom: true
    };
    updateSolution({ selectedModules: [...proposal.solution.selectedModules, newModule] });
  };

  return (
    <div className="space-y-10 pb-20">
      <TokenAnalyticsBar />
      <SectionHeader title="Functional Blueprint" subtitle="Engineer the core system modules via Neural AI or precision manual definition" stepNumber={currentStep + 1} />
      
      {/* AI Generator - Premium Glassmorphism Card */}
      <div className="p-10 bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2.5rem] border border-primary/20 space-y-6 shadow-sm hover:shadow-lg transition-all duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_#99CB48]">
             <Sparkles size={18} />
          </div>
          <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#0B0E14]/80">Neural Module Protocol</span>
        </div>
        <div className="flex gap-4">
          <ModernInput 
            className="flex-1" 
            placeholder="System Domain (e.g. Smart Logistics Engine)" 
            value={singleModuleName}
            onChange={(e) => setSingleModuleName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSingleModule()}
          />
          <Button onClick={handleAddSingleModule} disabled={isAiLoading} className="h-14 bg-[#0B0E14] hover:bg-black text-white rounded-xl px-12 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-105 active:scale-95">
            {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : "Initiate Gen"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {previewModule && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-10 bg-[#0B0E14] rounded-[3rem] border border-primary/30 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] space-y-8">
            <div className="flex justify-between items-start">
               <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Preview Node: AI Synthesized</div>
                  <h4 className="text-3xl font-black uppercase text-white tracking-tighter">{previewModule.name}</h4>
               </div>
               <button onClick={() => setPreviewModule(null)} className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors border border-white/5"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {previewModule.features.map((f: any, i: number) => (
                  <div key={i} className="flex items-center gap-5 bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/[0.08] transition-all group">
                     <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                        <CheckCircle size={14} className="text-primary" />
                     </div>
                     <span className="text-sm font-bold text-white/70 uppercase tracking-widest">{f.name}</span>
                  </div>
               ))}
            </div>
            <div className="pt-4">
              <Button onClick={confirmPreviewModule} className="w-full h-16 bg-primary hover:bg-primary/90 text-[#0B0E14] font-black uppercase tracking-[0.4em] rounded-2xl shadow-[0_20px_40px_-10px_rgba(153,203,72,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                Finalize Architectural Integration
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Extraction Panel */}
      <div className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6">
        <div className="flex items-center gap-3 text-slate-400">
           <Wand2 size={18} />
           <span className="text-[11px] font-black uppercase tracking-[0.3em]">Bulk Tactical Extraction</span>
        </div>
        <ModernTextArea className="min-h-[140px]" placeholder="Paste entire system requirements or legacy audit notes here for neural parsing..." value={bulkContext} onChange={(e) => setBulkContext(e.target.value)} />
        <Button onClick={handleBulkExtract} disabled={isAiLoading || !bulkContext} className="w-full h-14 bg-white border border-slate-200 text-[#0B0E14] hover:bg-[#0B0E14] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-sm">Extract All Protocol Nodes</Button>
      </div>

      {/* Active Module List */}
      <div className="space-y-8 pt-6">
        <div className="flex justify-between items-center px-4">
          <div className="space-y-1">
             <LabelPremium className="mb-0 text-slate-900">Blueprint Registry</LabelPremium>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active operational modules</p>
          </div>
          <Button onClick={handleAddManualModule} variant="outline" className="h-10 rounded-xl px-6 border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">+ Add Manual Node</Button>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {proposal.solution.selectedModules.map((module: Module, mIdx: number) => (
            <Card key={module.id} className="border-slate-100 overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between group-hover:bg-white transition-colors">
                <div className="flex items-center gap-4 flex-1">
                   <div className="w-10 h-10 rounded-xl bg-[#0B0E14] flex items-center justify-center text-white font-black italic shadow-lg rotate-3 group-hover:rotate-0 transition-all duration-500">
                      M{mIdx + 1}
                   </div>
                   <ModernInput className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-2xl font-black uppercase tracking-tighter text-[#0B0E14] h-auto p-0" value={module.name} onChange={(e) => {
                     const next = [...proposal.solution.selectedModules];
                     next[mIdx].name = e.target.value;
                     updateSolution({ selectedModules: next });
                   }} />
                </div>
                <button onClick={() => updateSolution({ selectedModules: proposal.solution.selectedModules.filter((_: Module, i: number) => i !== mIdx) })} className="p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
              </div>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {module.features.map((feature: any, fIdx: number) => (
                    <div key={fIdx} className="flex items-center gap-4 group/item relative">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 shadow-[0_0_10px_#99CB48]" />
                      <ModernInput className="flex-1 h-10 bg-white border-none shadow-none text-xs font-bold text-slate-600 p-0" value={typeof feature === 'string' ? feature : feature.name} onChange={(e) => {
                        const next = [...proposal.solution.selectedModules];
                        next[mIdx].features[fIdx] = { name: e.target.value, price: "" };
                        updateSolution({ selectedModules: next });
                      }} />
                      <button onClick={() => {
                        const next = [...proposal.solution.selectedModules];
                        next[mIdx].features = next[mIdx].features.filter((_: any, i: number) => i !== fIdx);
                        updateSolution({ selectedModules: next });
                      }} className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all"><X size={16} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  const next = [...proposal.solution.selectedModules];
                  next[mIdx].features.push({ name: "New Feature Protocol", price: "" });
                  updateSolution({ selectedModules: next });
                }} className="flex items-center gap-2 text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-all pl-6 border-l border-slate-100 py-2">
                   <Plus size={14} /> Add System Feature
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
