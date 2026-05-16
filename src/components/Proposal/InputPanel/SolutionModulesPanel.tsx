import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, X, Loader2, Trash2, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTokens } from "@/hooks/useTokens";
import TokenAnalyticsBar from "@/components/Proposal/TokenAnalyticsBar";
import { generateModuleFeatures, extractModulesFromContext } from "@/lib/gemini";
import { Module } from "@/types/proposal";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

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
      <SectionHeader title="Functional Blueprint" subtitle="Define system modules via AI or Manual entry" stepNumber={currentStep + 1} />
      
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

      {/* Module List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <LabelPremium>Selected Solution Modules</LabelPremium>
          <Button onClick={handleAddManualModule} variant="ghost" className="text-[10px] font-black uppercase text-blue-600 hover:underline">+ Add Manual</Button>
        </div>
        <div className="space-y-4">
          {proposal.solution.selectedModules.map((module: Module, mIdx: number) => (
            <Card key={module.id} className="border-slate-200 overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <Input className="bg-transparent border-none font-black uppercase text-slate-800 text-lg focus-visible:ring-0 p-0 h-auto" value={module.name} onChange={(e) => {
                  const next = [...proposal.solution.selectedModules];
                  next[mIdx].name = e.target.value;
                  updateSolution({ selectedModules: next });
                }} />
                <button onClick={() => updateSolution({ selectedModules: proposal.solution.selectedModules.filter((_: Module, i: number) => i !== mIdx) })} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="grid gap-4">
                  {module.features.map((feature: any, fIdx: number) => (
                    <div key={fIdx} className="flex items-center gap-4 group">
                      <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                      <Input className="flex-1 bg-transparent border-none p-0 h-auto text-xs font-bold text-slate-600 focus-visible:ring-0" value={typeof feature === 'string' ? feature : feature.name} onChange={(e) => {
                        const next = [...proposal.solution.selectedModules];
                        next[mIdx].features[fIdx] = { name: e.target.value, price: "" };
                        updateSolution({ selectedModules: next });
                      }} />
                      <button onClick={() => {
                        const next = [...proposal.solution.selectedModules];
                        next[mIdx].features = next[mIdx].features.filter((_: any, i: number) => i !== fIdx);
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

      {/* User Hierarchy & Access Strategic Section */}
      <div className="mt-12 space-y-8 border-t-2 border-slate-100 pt-12 pb-10">
        <div className="flex justify-between items-end px-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[2px] bg-blue-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">Strategic Infrastructure</span>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">User Access Hierarchy</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-md">Define the authority levels and system responsibilities for different organizational nodes.</p>
          </div>
          <Button 
            onClick={() => updateSolution({ userRoles: [...(proposal.solution.userRoles || []), "New Strategic Role|Define access permissions..."] })} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 h-12 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
          >
            + Add New Role
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"]).map((roleStr, rIdx) => {
            const [title, desc] = (roleStr || "|").split("|");
            return (
              <div key={rIdx} className="group relative bg-white border-2 border-slate-100 hover:border-blue-200 rounded-[2.5rem] p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-black italic shadow-lg border-2 border-white">
                  0{rIdx + 1}
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <LabelPremium>Authority Title</LabelPremium>
                    <Input 
                      className="h-14 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl font-black uppercase tracking-tight text-slate-900" 
                      placeholder="e.g. System Admin" 
                      value={title} 
                      onChange={(e) => {
                        const next = [...(proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"])];
                        next[rIdx] = `${e.target.value}|${desc}`;
                        updateSolution({ userRoles: next });
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <LabelPremium>Access Protocol / Responsibilities</LabelPremium>
                    <Textarea 
                      className="bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl text-[11px] font-bold text-slate-500 min-h-[80px] leading-relaxed" 
                      placeholder="Define what this user can do in the system..." 
                      value={desc} 
                      onChange={(e) => {
                        const next = [...(proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"])];
                        next[rIdx] = `${title}|${e.target.value}`;
                        updateSolution({ userRoles: next });
                      }}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => updateSolution({ userRoles: (proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"]).filter((_: string, i: number) => i !== rIdx) })} 
                  className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
