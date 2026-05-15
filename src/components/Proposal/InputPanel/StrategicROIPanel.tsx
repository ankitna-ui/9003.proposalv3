import { useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, IndianRupee, Clock, Zap, ArrowUpRight, Calculator, Target } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader } from "./shared";

export default function StrategicROIPanel({ proposal, currentStep, updateROI }: InputPanelProps) {

  // ──── Real Calculations ────
  const calc = useMemo(() => {
    const projectCost = parseFloat(proposal.roi.projectCost) || 0;
    const monthlyCost = parseFloat(proposal.roi.monthlyCost) || 0;
    const currentRevenue = parseFloat(proposal.roi.currentRevenue) || 0;
    const currentOpsCost = parseFloat(proposal.roi.currentOpsCost) || 0;
    const manualHours = parseFloat(proposal.roi.manualHoursPerMonth) || 0;
    const hourlyRate = parseFloat(proposal.roi.hourlyRate) || 0;
    const revenueIncPct = parseFloat(proposal.roi.revenueIncrease) || 0;
    const costRedPct = parseFloat(proposal.roi.costReduction) || 0;
    const timeSavePct = parseFloat(proposal.roi.productivityIncrease) || 0;

    // Monthly gains
    const monthlyRevenueGain = currentRevenue * (revenueIncPct / 100);
    const monthlyCostSaving = currentOpsCost * (costRedPct / 100);
    const hoursSaved = manualHours * (timeSavePct / 100);
    const monthlyTimeSaving = hoursSaved * hourlyRate;
    const totalMonthlyBenefit = monthlyRevenueGain + monthlyCostSaving + monthlyTimeSaving;

    // Annual
    const annualBenefit = totalMonthlyBenefit * 12;
    const totalInvestment = projectCost + (monthlyCost * 12);

    // ROI %
    const roiPercent = totalInvestment > 0 ? Math.round(((annualBenefit - totalInvestment) / totalInvestment) * 100) : 0;

    // Break-even (months)
    const netMonthlyBenefit = totalMonthlyBenefit - monthlyCost;
    const breakEvenMonths = netMonthlyBenefit > 0 ? Math.ceil(projectCost / netMonthlyBenefit) : 0;

    // Growth factor
    const growthFactor = totalInvestment > 0 ? (annualBenefit / totalInvestment).toFixed(1) : "0";

    return {
      monthlyRevenueGain: Math.round(monthlyRevenueGain),
      monthlyCostSaving: Math.round(monthlyCostSaving),
      hoursSaved: Math.round(hoursSaved),
      monthlyTimeSaving: Math.round(monthlyTimeSaving),
      totalMonthlyBenefit: Math.round(totalMonthlyBenefit),
      annualBenefit: Math.round(annualBenefit),
      totalInvestment: Math.round(totalInvestment),
      roiPercent,
      breakEvenMonths,
      growthFactor
    };
  }, [
    proposal.roi.projectCost, proposal.roi.monthlyCost,
    proposal.roi.currentRevenue, proposal.roi.currentOpsCost,
    proposal.roi.manualHoursPerMonth, proposal.roi.hourlyRate,
    proposal.roi.revenueIncrease, proposal.roi.costReduction,
    proposal.roi.productivityIncrease
  ]);

  // Auto-sync calculated values to proposal state for PDF output
  useEffect(() => {
    updateROI({
      expectedROI: String(calc.roiPercent),
      profitImpact: `₹${calc.totalMonthlyBenefit.toLocaleString("en-IN")}`,
      timeSaving: String(calc.hoursSaved),
      breakEven: calc.breakEvenMonths > 0 ? `${calc.breakEvenMonths} Months` : "N/A",
      growthFactor: `${calc.growthFactor}x`
    });
  }, [calc.roiPercent, calc.totalMonthlyBenefit, calc.hoursSaved, calc.breakEvenMonths, calc.growthFactor]);

  const formatINR = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-8 pb-10">
      <SectionHeader title="Strategic ROI Engine" subtitle="Real financial projections based on actual metrics" stepNumber={currentStep + 1} />

      {/* ──── INVESTMENT INPUTS ──── */}
      <div className="p-8 bg-red-50/30 rounded-[2.5rem] border border-red-100/60 space-y-5">
        <div className="flex items-center gap-2 text-red-500">
          <IndianRupee size={18} />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Investment Parameters</span>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1">
            <LabelPremium>Project Cost (One-time ₹)</LabelPremium>
            <Input type="number" className="h-14 bg-white border-red-100 rounded-2xl font-black" placeholder="500000" value={proposal.roi.projectCost || ""} onChange={(e) => updateROI({ projectCost: e.target.value })} />
          </div>
          <div className="space-y-1">
            <LabelPremium>Monthly Maintenance (₹)</LabelPremium>
            <Input type="number" className="h-14 bg-white border-red-100 rounded-2xl" placeholder="15000" value={proposal.roi.monthlyCost || ""} onChange={(e) => updateROI({ monthlyCost: e.target.value })} />
          </div>
        </div>
      </div>

      {/* ──── CURRENT STATE ──── */}
      <div className="p-8 bg-amber-50/30 rounded-[2.5rem] border border-amber-100/60 space-y-5">
        <div className="flex items-center gap-2 text-amber-600">
          <Calculator size={18} />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Current State Baseline</span>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1">
            <LabelPremium>Monthly Revenue (₹)</LabelPremium>
            <Input type="number" className="h-14 bg-white border-amber-100 rounded-2xl" placeholder="1000000" value={proposal.roi.currentRevenue || ""} onChange={(e) => updateROI({ currentRevenue: e.target.value })} />
          </div>
          <div className="space-y-1">
            <LabelPremium>Monthly Ops Cost (₹)</LabelPremium>
            <Input type="number" className="h-14 bg-white border-amber-100 rounded-2xl" placeholder="300000" value={proposal.roi.currentOpsCost || ""} onChange={(e) => updateROI({ currentOpsCost: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1">
            <LabelPremium>Manual Hours / Month</LabelPremium>
            <Input type="number" className="h-14 bg-white border-amber-100 rounded-2xl" placeholder="400" value={proposal.roi.manualHoursPerMonth || ""} onChange={(e) => updateROI({ manualHoursPerMonth: e.target.value })} />
          </div>
          <div className="space-y-1">
            <LabelPremium>Hourly Rate (₹)</LabelPremium>
            <Input type="number" className="h-14 bg-white border-amber-100 rounded-2xl" placeholder="300" value={proposal.roi.hourlyRate || ""} onChange={(e) => updateROI({ hourlyRate: e.target.value })} />
          </div>
        </div>
      </div>

      {/* ──── PROJECTED IMPACT ──── */}
      <div className="p-8 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100/60 space-y-5">
        <div className="flex items-center gap-2 text-emerald-600">
          <TrendingUp size={18} />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Projected Impact (%)</span>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div className="space-y-1">
            <LabelPremium>Revenue ↑ %</LabelPremium>
            <Input type="number" className="h-14 bg-white border-emerald-100 rounded-2xl font-black text-center" placeholder="20" value={proposal.roi.revenueIncrease} onChange={(e) => updateROI({ revenueIncrease: e.target.value })} />
          </div>
          <div className="space-y-1">
            <LabelPremium>Cost ↓ %</LabelPremium>
            <Input type="number" className="h-14 bg-white border-emerald-100 rounded-2xl font-black text-center" placeholder="15" value={proposal.roi.costReduction} onChange={(e) => updateROI({ costReduction: e.target.value })} />
          </div>
          <div className="space-y-1">
            <LabelPremium>Time Saved %</LabelPremium>
            <Input type="number" className="h-14 bg-white border-emerald-100 rounded-2xl font-black text-center" placeholder="40" value={proposal.roi.productivityIncrease} onChange={(e) => updateROI({ productivityIncrease: e.target.value })} />
          </div>
        </div>
      </div>

      {/* ──── LIVE CALCULATIONS ──── */}
      <div className="p-10 bg-slate-900 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <TrendingUp size={180} className="text-[#99CB48]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#99CB48] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#99CB48]">Live Calculation Engine</span>
          </div>

          {/* Hero ROI */}
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Calculated ROI</div>
              <div className="text-7xl font-black text-white tracking-tighter leading-none">
                {calc.roiPercent}<span className="text-[#99CB48]">%</span>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Monthly Surplus</div>
              <div className="text-4xl font-black text-[#99CB48] tracking-tighter">{formatINR(calc.totalMonthlyBenefit)}</div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpRight size={14} className="text-emerald-400" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Revenue Gain</span>
              </div>
              <div className="text-xl font-black text-white">{formatINR(calc.monthlyRevenueGain)}</div>
              <div className="text-[9px] text-white/20 font-bold mt-1">per month</div>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee size={14} className="text-blue-400" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Cost Saved</span>
              </div>
              <div className="text-xl font-black text-white">{formatINR(calc.monthlyCostSaving)}</div>
              <div className="text-[9px] text-white/20 font-bold mt-1">per month</div>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-yellow-400" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Time Saved</span>
              </div>
              <div className="text-xl font-black text-white">{calc.hoursSaved} <span className="text-sm text-white/40">hrs</span></div>
              <div className="text-[9px] text-white/20 font-bold mt-1">= {formatINR(calc.monthlyTimeSaving)}</div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="space-y-1">
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">Break-even</div>
              <div className="text-lg font-black text-white">{calc.breakEvenMonths > 0 ? `${calc.breakEvenMonths} Months` : "—"}</div>
            </div>
            <div className="space-y-1 text-center">
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">Annual Benefit</div>
              <div className="text-lg font-black text-[#99CB48]">{formatINR(calc.annualBenefit)}</div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">Growth Factor</div>
              <div className="text-lg font-black text-white">{calc.growthFactor}x</div>
            </div>
          </div>
        </div>
      </div>

      {/* ──── STRATEGIC NARRATIVE ──── */}
      <div className="space-y-1">
        <LabelPremium>Impact Summary (for PDF)</LabelPremium>
        <Textarea 
          className="min-h-[100px] bg-white border-slate-200 rounded-3xl p-5" 
          placeholder="This transformation framework is engineered to neutralize operational friction..." 
          value={proposal.roi.impactSummary} 
          onChange={(e) => updateROI({ impactSummary: e.target.value })} 
        />
      </div>
    </div>
  );
}
