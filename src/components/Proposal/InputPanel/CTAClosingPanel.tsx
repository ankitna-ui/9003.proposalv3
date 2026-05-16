import { Calendar, Mail, Phone, Shield } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";

export default function CTAClosingPanel({ proposal, currentStep, updateClosing }: InputPanelProps) {
  return (
    <div className="space-y-12 pb-10">
      <SectionHeader 
        title="Strategic Alignment" 
        subtitle="Finalize engagement protocols and establish high-priority communication channels" 
        stepNumber={currentStep + 1} 
      />

      <div className="space-y-4 group">
        <div className="flex items-center justify-between px-2">
          <LabelPremium className="mb-0 text-slate-900">Engagement Scheduling Protocol</LabelPremium>
          <Calendar size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
        </div>
        <div className="relative">
          <ModernInput 
            className="pl-12 font-black text-primary text-xs" 
            placeholder="e.g. https://calendly.com/weblozy/discovery" 
            value={proposal.closing.meetingLink} 
            onChange={(e) => updateClosing({ meetingLink: e.target.value })} 
          />
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Direct Operations Email</LabelPremium>
            <Mail size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
          </div>
          <div className="relative">
            <ModernInput 
              type="email"
              className="pl-12 font-bold text-slate-700" 
              value={proposal.closing.contactEmail} 
              onChange={(e) => updateClosing({ contactEmail: e.target.value })} 
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Direct Priority Hotline</LabelPremium>
            <Phone size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
          </div>
          <div className="relative">
            <ModernInput 
              type="tel"
              className="pl-12 font-bold text-slate-700" 
              value={proposal.closing.contactPhone} 
              onChange={(e) => updateClosing({ contactPhone: e.target.value })} 
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>
      </div>

      <div className="p-8 bg-[#0B0E14] rounded-[2.5rem] text-white flex items-center justify-between overflow-hidden relative shadow-xl">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield size={100} className="text-primary" />
         </div>
         <div className="relative z-10 flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10B981]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Institutional NDA & Security Protocol Enforced</p>
         </div>
         <span className="text-[9px] font-black text-emerald-400 bg-emerald-950 border border-emerald-800/50 px-4 py-1.5 rounded-full">
            SECURE ACCESS
         </span>
      </div>
    </div>
  );
}
