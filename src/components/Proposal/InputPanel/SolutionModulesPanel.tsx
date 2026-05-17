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
    <div className="space-y-8 pb-10">
      <TokenAnalyticsBar />
      <SectionHeader 
        title="Functional Blueprint" 
        subtitle="Engineer the core system modules via Neural AI or precision manual definition" 
        stepNumber={currentStep + 1} 
      />
      
      {/* AI Generator - Premium Glassmorphism Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-primary/5 via-primary/[0.08] to-primary/10 rounded-2xl border border-primary/20 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(153,203,72,0.3)] shrink-0">
             <Sparkles size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B0E14]/80">Neural Module Protocol</span>
        </div>
        <div className="flex gap-3">
          <ModernInput 
            className="flex-1 h-11 px-3.5 text-xs font-semibold bg-white border-slate-200/80 rounded-xl" 
            placeholder="System Domain (e.g. Smart Logistics Engine)" 
            value={singleModuleName}
            onChange={(e) => setSingleModuleName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSingleModule()}
          />
          <Button 
            onClick={handleAddSingleModule} 
            disabled={isAiLoading} 
            className="h-11 bg-[#0B0E14] hover:bg-black text-white rounded-xl px-5 text-xs font-bold tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 shrink-0"
          >
            {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : "Generate"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {previewModule && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }} 
            className="p-5 sm:p-6 bg-[#0B0E14] rounded-2xl border border-primary/30 shadow-xl space-y-5"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Preview Node: AI Synthesized</div>
                  <h4 className="text-xl font-black uppercase text-white tracking-tighter">{previewModule.name}</h4>
               </div>
               <button onClick={() => setPreviewModule(null)} className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors border border-white/5"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
               {previewModule.features.map((f: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/[0.08] transition-all">
                     <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                        <CheckCircle size={12} className="text-primary" />
                     </div>
                     <span className="text-xs font-semibold text-white/70 uppercase tracking-widest leading-none">{f.name}</span>
                  </div>
               ))}
            </div>
            <div className="pt-2">
              <Button onClick={confirmPreviewModule} className="w-full h-11 bg-primary hover:bg-primary/90 text-[#0B0E14] font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-[0_12px_24px_rgba(153,203,72,0.2)] transition-all hover:scale-101 active:scale-99">
                Integrate Module Architecture
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Extraction Panel */}
      <div className="p-5 sm:p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-slate-400">
           <Wand2 size={14} className="shrink-0" />
           <span className="text-[9px] font-black uppercase tracking-[0.3em]">Bulk Tactical Extraction</span>
        </div>
        <ModernTextArea 
          className="min-h-[100px] p-3.5 text-xs font-medium text-slate-700 bg-white border border-slate-200/80 rounded-xl focus:bg-white" 
          placeholder="Paste entire system requirements or legacy audit notes here for neural parsing..." 
          value={bulkContext} 
          onChange={(e) => setBulkContext(e.target.value)} 
        />
        <Button 
          onClick={handleBulkExtract} 
          disabled={isAiLoading || !bulkContext} 
          className="w-full h-11 bg-white border border-slate-200 text-[#0B0E14] hover:bg-[#0B0E14] hover:text-white rounded-xl text-xs font-bold tracking-wider transition-all shadow-sm"
        >
          Extract All Protocol Nodes
        </Button>
      </div>

      {/* Active Module List */}
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center px-1">
          <div className="space-y-0.5">
             <LabelPremium className="mb-0 text-slate-800 text-[10px]">Blueprint Registry</LabelPremium>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active operational modules</p>
          </div>
          <Button 
            onClick={handleAddManualModule} 
            variant="outline" 
            className="h-9 rounded-xl px-4 border-slate-200 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all bg-white"
          >
            + Add Manual Node
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {proposal.solution.selectedModules.map((module: Module, mIdx: number) => (
            <Card key={module.id} className="border-slate-100 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group bg-white">
              {/* Card Header (Sleek and Packed) */}
              <div className="p-4 sm:p-5 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 group-hover:bg-white transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                   <div className="w-8 h-8 rounded-lg bg-[#0B0E14] flex items-center justify-center text-white font-black italic shadow-sm rotate-3 group-hover:rotate-0 transition-all duration-500 shrink-0 text-xs">
                      M{mIdx + 1}
                   </div>
                   <input 
                      type="text" 
                      className="flex-1 bg-transparent border-none text-base font-black uppercase tracking-tighter text-[#0B0E14] h-auto p-0 focus:outline-none focus:ring-0 min-w-0" 
                      value={module.name} 
                      onChange={(e) => {
                         const next = [...proposal.solution.selectedModules];
                         next[mIdx].name = e.target.value;
                         updateSolution({ selectedModules: next });
                      }} 
                   />
                </div>
                
                {/* Module Price Field */}
                <div className="flex items-center gap-2 shrink-0">
                   <div className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Est. Price:</div>
                   <div className="relative w-28">
                      <input 
                         type="text" 
                         placeholder="e.g. 25,000" 
                         className="w-full h-8 pl-5 pr-2 bg-white border border-slate-200/80 rounded-lg text-xs font-bold text-[#0B0E14] focus:outline-none focus:border-primary/50 text-right"
                         value={module.price || ""} 
                         onChange={(e) => {
                            const next = [...proposal.solution.selectedModules];
                            next[mIdx].price = e.target.value;
                            updateSolution({ selectedModules: next });
                         }} 
                      />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[9px]">₹</span>
                   </div>
                </div>

                <button 
                  onClick={() => updateSolution({ selectedModules: proposal.solution.selectedModules.filter((_: Module, i: number) => i !== mIdx) })} 
                  className="p-1.5 bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Card Content (Sleek Features Grid) */}
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {module.features.map((feature: any, fIdx: number) => (
                    <div 
                      key={fIdx} 
                      className="flex items-center gap-2 group/item relative bg-slate-50/20 hover:bg-slate-50/60 p-2 border border-slate-100/80 rounded-xl transition-all duration-300 w-full min-w-0 shadow-sm hover:shadow"
                    >
                       <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_#99CB48]" />
                       
                       {/* Feature Name Input */}
                       <input 
                          type="text"
                          className="flex-1 bg-transparent border-none text-xs font-semibold text-slate-600 focus:outline-none focus:ring-0 min-w-0 p-0" 
                          value={typeof feature === 'string' ? feature : feature.name} 
                          onChange={(e) => {
                             const next = [...proposal.solution.selectedModules];
                             const currentPrice = typeof feature === 'string' ? "" : (feature.price || "");
                             next[mIdx].features[fIdx] = { name: e.target.value, price: currentPrice };
                             updateSolution({ selectedModules: next });
                          }} 
                       />
                       
                       {/* Feature Price Input */}
                       <div className="relative w-16 shrink-0">
                          <input 
                             type="text" 
                             placeholder="Price" 
                             className="w-full h-6 pl-3.5 pr-1.5 bg-white border border-slate-200/60 rounded-md text-[9px] font-bold text-slate-700 focus:outline-none focus:border-primary/40 text-right p-0"
                             value={typeof feature === 'string' ? "" : (feature.price || "")} 
                             onChange={(e) => {
                                const next = [...proposal.solution.selectedModules];
                                const currentName = typeof feature === 'string' ? feature : feature.name;
                                next[mIdx].features[fIdx] = { name: currentName, price: e.target.value };
                                updateSolution({ selectedModules: next });
                             }} 
                          />
                          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[7px]">₹</span>
                       </div>

                       <button 
                         onClick={() => {
                           const next = [...proposal.solution.selectedModules];
                           next[mIdx].features = next[mIdx].features.filter((_: any, i: number) => i !== fIdx);
                           updateSolution({ selectedModules: next });
                         }} 
                         className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all shrink-0"
                       >
                         <X size={12} />
                       </button>
                    </div>
                  ))}
                </div>
                
                {/* Add Feature Button */}
                <button 
                  onClick={() => {
                    const next = [...proposal.solution.selectedModules];
                    next[mIdx].features.push({ name: "New Feature Protocol", price: "" });
                    updateSolution({ selectedModules: next });
                  }} 
                  className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-primary hover:text-primary/80 transition-all pl-3 border-l border-slate-200 py-0.5 mt-2"
                >
                   <Plus size={10} /> Add System Feature
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
