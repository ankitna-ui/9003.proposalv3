import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Module } from "@/types/proposal";

const PREDEFINED_MODULES: Module[] = [
  { id: "crm", name: "Lead Management CRM", features: ["Lead capture", "Lead assignment", "Follow-up reminders", "Pipeline visibility", "Lead analytics", "Conversion tracking"] },
  { id: "sales", name: "Sales Pipeline", features: ["Deal stages", "Forecasting", "Quote generation", "Activity tracking"] },
  { id: "hrms", name: "HRMS", features: ["Attendance", "Leave management", "Employee records", "Payroll support"] },
  { id: "inventory", name: "Inventory Management", features: ["Stock tracking", "Warehouse visibility", "Purchase management", "Low stock alerts"] },
  { id: "production", name: "Production Management", features: ["BOM", "Work orders", "Resource planning"] },
  { id: "finance", name: "Finance & Accounting", features: ["Invoicing", "Expense tracking", "GL", "Profit & Loss"] },
  { id: "whatsapp", name: "WhatsApp Automation", features: ["Auto-replies", "Broadcasts", "Template messages"] },
  { id: "email", name: "Email Automation", features: ["Drip campaigns", "Personalization", "Tracking"] },
  { id: "tally", name: "Tally Integration", features: ["Real-time sync", "Voucher import"] },
];

interface ModuleSelectorProps {
  selectedModules: Module[];
  onChange: (modules: Module[]) => void;
}

export default function ModuleSelector({ selectedModules, onChange }: ModuleSelectorProps) {
  const [customName, setCustomName] = useState("");
  const [customFeatures, setCustomFeatures] = useState("");

  const toggleModule = (module: Module) => {
    const isSelected = selectedModules.find(m => m.id === module.id);
    if (isSelected) {
      onChange(selectedModules.filter(m => m.id !== module.id));
    } else {
      onChange([...selectedModules, module]);
    }
  };

  const addCustomModule = () => {
    if (!customName.trim()) return;
    const newModule: Module = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      features: customFeatures.split(",").map(f => f.trim()).filter(f => f !== ""),
      description: "",
      icon: "settings"
    };
    onChange([...selectedModules, newModule]);
    setCustomName("");
    setCustomFeatures("");
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {PREDEFINED_MODULES.map((module) => {
          const isSelected = selectedModules.find(m => m.id === module.id);
          return (
            <div 
              key={module.id}
              onClick={() => toggleModule(module)}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                isSelected 
                  ? "bg-primary/10 border-primary shadow-sm" 
                  : "bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold uppercase tracking-tight">{module.name}</span>
                {isSelected && <Badge variant="default" className="bg-primary text-[8px] uppercase tracking-widest px-1.5 h-4">Selected</Badge>}
              </div>
              <div className="flex flex-wrap gap-1">
                {module.features.slice(0, 3).map((f, i) => (
                  <span key={i} className="text-[9px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-muted-foreground/10">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {/* Render Custom Modules already selected */}
        {selectedModules.filter(m => m.id.startsWith("custom-")).map((module) => (
          <div 
            key={module.id}
            className="group relative p-4 rounded-xl border bg-primary/5 border-primary shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold uppercase tracking-tight text-primary">{module.name}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleModule(module); }}
                className="p-1 hover:bg-red-500 hover:text-white rounded-md transition-colors"
              >
                <X size={12} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {module.features.slice(0, 3).map((f, i) => (
                <span key={i} className="text-[9px] text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Add Custom Architectural Module</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-slate-500">Module Identity</Label>
            <Input 
              placeholder="e.g. AI Content Engine" 
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-slate-500">Feature Roadmap (Comma separated)</Label>
            <Input 
              placeholder="e.g. SEO Analysis, Auto-Drafting, Plagiarism Check" 
              value={customFeatures}
              onChange={(e) => setCustomFeatures(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
        <Button 
          onClick={addCustomModule}
          className="w-full gap-2 uppercase text-[10px] font-black tracking-widest h-12"
          variant="outline"
        >
          <Plus size={14} />
          Inject Custom Module into Ecosystem
        </Button>
      </div>
    </div>
  );
}

// Add missing Label import if needed, assuming it's available or we use a generic label
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}</label>;
}
