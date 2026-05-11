import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Save, Wand2, Plus, X, Loader2, Eye, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProposalForm } from "@/hooks/useProposalForm";
import ModuleSelector from "@/components/Proposal/ModuleSelector";
import { generateProposalContent } from "@/lib/gemini";
import { getProposal, updateProposal } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Module } from "@/types/proposal";

import ProposalPDF from "@/components/Proposal/ProposalPDF";

const steps = [
  "Client Details",
  "Problem Statement",
  "Strategic Solution",
  "Performance & Impact",
  "Why Weblozy",
  "Technical Ecosystem",
  "Pricing & ROI",
  "Policies & Commitments",
  "CTA & Closing"
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
    updateProblemStatement,
    updateSituation, 
    updateSolution, 
    updateTechArchitecture,
    updateROI, 
    updateExperience,
    updatePricing, 
    updatePolicies,
    updateClosing,
    setAIContent,
    setProposal
  } = useProposalForm();

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
      const content = await generateProposalContent(
        proposal.situation.meetingNotes,
        proposal.client.companyName,
        proposal.solution.selectedModules.map(m => m.name)
      );
      setAIContent(content);
      alert("AI Content Refreshed!");
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
        if (!proposal.client.companyName || !proposal.client.proposalTitle) {
          alert("Company Name and Proposal Title are required.");
          return false;
        }
        break;
      case 1:
        if (!proposal.situation.currentWorkflow || !proposal.situation.meetingNotes) {
          alert("Current Workflow Audit and Meeting Notes are required.");
          return false;
        }
        break;
      case 2:
        if (!proposal.solution.approach) {
          alert("Strategic Approach is required.");
          return false;
        }
        break;
      case 5:
        if (proposal.solution.selectedModules.length === 0) {
          alert("Please select at least one module for the technical ecosystem.");
          return false;
        }
        break;
      case 6:
        if (!proposal.pricing.range) {
          alert("Investment range is required.");
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
    if (!id) return;
    if (!validateStep()) return;
    setIsSaving(true);
    try {
      await updateProposal(id, proposal);
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
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Retrieving proposal protocol...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Strategic Ally (Company Name)</Label>
                <Input 
                  id="companyName" 
                  placeholder="e.g. Enterprise Corp" 
                  value={proposal.client.companyName}
                  onChange={(e: any) => updateClient({ companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Valued Client Name</Label>
                <Input 
                  id="clientName" 
                  placeholder="e.g. Mr. John Doe" 
                  value={proposal.client.clientName}
                  onChange={(e: any) => updateClient({ clientName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proposalTitle">Main Proposal Title</Label>
              <Input 
                id="proposalTitle" 
                placeholder="e.g. Digital Transformation Roadmap" 
                value={proposal.client.proposalTitle}
                onChange={(e: any) => updateClient({ proposalTitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industryTitle">Industry Focus</Label>
                <Input 
                  id="industryTitle" 
                  placeholder="e.g. Business Automation" 
                  value={proposal.client.industryTitle}
                  onChange={(e: any) => updateClient({ industryTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industryDomain">Industry Domain</Label>
                <Input 
                  id="industryDomain" 
                  placeholder="e.g. Enterprise Sector" 
                  value={proposal.client.industryDomain}
                  onChange={(e: any) => updateClient({ industryDomain: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input 
                  id="websiteUrl" 
                  placeholder="e.g. WWW.WEBLOZY.COM" 
                  value={proposal.client.websiteUrl}
                  onChange={(e: any) => updateClient({ websiteUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Company Tagline</Label>
                <Input 
                  id="tagline" 
                  placeholder="e.g. We Automate Businesses" 
                  value={proposal.client.tagline}
                  onChange={(e: any) => updateClient({ tagline: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subTitle">Proposal Subtitle</Label>
              <Input 
                id="subTitle" 
                placeholder="e.g. Bespoke Technical & Operational Roadmap" 
                value={proposal.client.subTitle}
                onChange={(e: any) => updateClient({ subTitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protocolTitle">Security Label</Label>
                <Input 
                  id="protocolTitle" 
                  placeholder="e.g. Confidential" 
                  value={proposal.client.protocolTitle}
                  onChange={(e: any) => updateClient({ protocolTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="releaseProtocol">Release Protocol</Label>
                <Input 
                  id="releaseProtocol" 
                  placeholder="e.g. Stable-V2" 
                  value={proposal.client.releaseProtocol}
                  onChange={(e: any) => updateClient({ releaseProtocol: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filingDate">Filing Date</Label>
                <Input 
                  id="filingDate" 
                  placeholder="e.g. MAY 2024" 
                  value={proposal.client.filingDate}
                  onChange={(e: any) => updateClient({ filingDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentWorkflow">Operational Narrative (Current Workflow)</Label>
                <Textarea 
                  id="currentWorkflow" 
                  placeholder="Analyze the existing manual overhead, bottlenecks, and coordination gaps..." 
                  value={proposal.situation.currentWorkflow}
                  onChange={(e: any) => updateSituation({ currentWorkflow: e.target.value })}
                  className="min-h-[120px]"
                />
                <p className="text-[10px] text-muted-foreground italic">This narrative appears on Page 2 of the proposal as the 'Strategic Audit'.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revenueLeakage">Estimated Revenue Leakage</Label>
                  <Input 
                    id="revenueLeakage" 
                    placeholder="e.g. $10k / month" 
                    value={proposal.situation.revenueLeakage}
                    onChange={(e: any) => updateSituation({ revenueLeakage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inefficiencies">Efficiency Gaps</Label>
                  <Input 
                    id="inefficiencies" 
                    placeholder="e.g. High manual overhead" 
                    value={proposal.situation.inefficiencies}
                    onChange={(e: any) => updateSituation({ inefficiencies: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Critical Challenges & Pain Points</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateSituation({ challenges: [...(proposal.situation.challenges || []), ""] })}
                    className="h-7 text-[10px] uppercase font-black"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Challenge
                  </Button>
                </div>
                <div className="grid gap-3">
                  {(proposal.situation.challenges || []).map((challenge, i) => (
                    <div key={i} className="flex gap-2">
                      <Input 
                        placeholder="e.g. Lead leakage in initial 5 minutes"
                        value={challenge}
                        onChange={(e: any) => {
                          const newChallenges = [...(proposal.situation.challenges || [])];
                          newChallenges[i] = e.target.value;
                          updateSituation({ challenges: newChallenges });
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => updateSituation({ challenges: proposal.situation.challenges.filter((_, idx) => idx !== i) })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingNotes">Raw Meeting Notes (For AI Analysis)</Label>
                <Textarea 
                  id="meetingNotes" 
                  placeholder="Paste your conversation notes here..." 
                  value={proposal.situation.meetingNotes}
                  onChange={(e: any) => updateSituation({ meetingNotes: e.target.value })}
                  className="min-h-[150px] border-primary/20 bg-primary/5"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="approach">Proposed Solution Approach</Label>
              <Textarea 
                id="approach" 
                placeholder="e.g. We propose building a proprietary logic engine..." 
                value={proposal.solution.approach}
                onChange={(e: any) => updateSolution({ approach: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Implementation Pillars</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateSolution({ approachPoints: [...(proposal.solution.approachPoints || []), ""] })}
                  className="h-7 text-[10px] uppercase font-black"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Pillar
                </Button>
              </div>
              <div className="grid gap-3">
                {(proposal.solution.approachPoints || []).map((point, i) => (
                  <div key={i} className="flex gap-2">
                    <Input 
                      placeholder="e.g. Centralized Data Architecture"
                      value={point}
                      onChange={(e: any) => {
                        const newPoints = [...(proposal.solution.approachPoints || [])];
                        newPoints[i] = e.target.value;
                        updateSolution({ approachPoints: newPoints });
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => updateSolution({ approachPoints: proposal.solution.approachPoints.filter((_, idx) => idx !== i) })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demoLinks">Demo / Validation Links (Comma separated)</Label>
                <Input 
                  id="demoLinks" 
                  placeholder="e.g. demo.weblozy.com" 
                  value={proposal.solution.demoLinks.join(", ")}
                  onChange={(e: any) => updateSolution({ demoLinks: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="integrations">System Integrations (Comma separated)</Label>
                <Input 
                  id="integrations" 
                  placeholder="e.g. WhatsApp API, Stripe, Zoho CRM" 
                  value={proposal.solution.integrations.join(", ")}
                  onChange={(e: any) => updateSolution({ integrations: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRoles">User Ecosystem (Roles, Comma separated)</Label>
              <Input 
                id="userRoles" 
                placeholder="e.g. Admin, Sales Exec, Client Portal" 
                value={proposal.solution.userRoles.join(", ")}
                onChange={(e: any) => updateSolution({ userRoles: e.target.value.split(",").map(s => s.trim()) })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex items-center justify-between">
               <div>
                  <h4 className="font-bold text-lg text-primary">Performance Analysis</h4>
                  <p className="text-xs text-slate-500">Sync numerical impact metrics for the ROI dashboard.</p>
               </div>
               <Button onClick={handleAIAction} disabled={isGenerating} variant="outline" className="gap-2">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  AI Sync
               </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenueIncrease">Revenue Increase (%)</Label>
                <Input 
                  id="revenueIncrease" 
                  placeholder="e.g. 25" 
                  value={proposal.roi.revenueIncrease}
                  onChange={(e: any) => updateROI({ revenueIncrease: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productivityIncrease">Productivity Increase (%)</Label>
                <Input 
                  id="productivityIncrease" 
                  placeholder="e.g. 40" 
                  value={proposal.roi.productivityIncrease}
                  onChange={(e: any) => updateROI({ productivityIncrease: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costReduction">Cost Reduction (%)</Label>
                <Input 
                  id="costReduction" 
                  placeholder="e.g. 15" 
                  value={proposal.roi.costReduction}
                  onChange={(e: any) => updateROI({ costReduction: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeSaving">Time Saving (Hrs/Mo)</Label>
                <Input 
                  id="timeSaving" 
                  placeholder="e.g. 120" 
                  value={proposal.roi.timeSaving}
                  onChange={(e: any) => updateROI({ timeSaving: e.target.value })}
                />
              </div>
            </div>
              <div className="space-y-2">
                <Label htmlFor="profitImpact">Monthly Profit Impact</Label>
                <Input 
                  id="profitImpact" 
                  placeholder="e.g. $12,500" 
                  value={proposal.roi.profitImpact}
                  onChange={(e: any) => updateROI({ profitImpact: e.target.value })}
                  className="bg-primary/5 border-primary/20 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="expectedROI">Expected ROI (%)</Label>
                <Input 
                  id="expectedROI" 
                  value={proposal.roi.expectedROI}
                  onChange={(e: any) => updateROI({ expectedROI: e.target.value })}
                  className="h-12 text-xl font-black text-primary bg-primary/5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="impactSummary">Strategic Impact Narrative</Label>
                <Textarea 
                  id="impactSummary" 
                  placeholder="Explain how this transformation affects the business bottom line..." 
                  value={proposal.roi.impactSummary}
                  onChange={(e: any) => updateROI({ impactSummary: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic">Numerical data here drives the 'Performance & Impact' page visualizations.</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-tighter text-primary">Why Weblozy</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Build trust with performance metrics</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expYears">Years of Experience</Label>
                <Input 
                  id="expYears" 
                  value={proposal.experience.yearsOfExperience}
                  onChange={(e) => updateExperience({ yearsOfExperience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectsCount">Projects Completed</Label>
                <Input 
                  id="projectsCount" 
                  value={proposal.experience.projectsCompleted}
                  onChange={(e) => updateExperience({ projectsCompleted: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industries">Industries Served (Comma separated)</Label>
              <Input 
                id="industries" 
                value={proposal.experience.industriesServed.join(", ")}
                onChange={(e) => updateExperience({ industriesServed: e.target.value.split(",").map(i => i.trim()) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolioLinks">Portfolio Links (Comma separated)</Label>
              <Input 
                id="portfolioLinks" 
                value={proposal.experience.portfolioLinks.join(", ")}
                onChange={(e) => updateExperience({ portfolioLinks: e.target.value.split(",").map(i => i.trim()) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strategicSummary">Strategic Alignment Narrative</Label>
              <Textarea 
                id="strategicSummary" 
                placeholder="Explain why Weblozy is the perfect partner for this specific client..." 
                value={proposal.experience.strategicSummary}
                onChange={(e) => updateExperience({ strategicSummary: e.target.value })}
                className="min-h-[100px]"
              />
              <p className="text-[10px] text-muted-foreground italic">This narrative appears on Page 5 under 'Strategic Alignment'.</p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold uppercase tracking-tighter text-primary">Technical Features</h3>
              <div className="text-[10px] font-black uppercase text-slate-400">Architecture Modules</div>
            </div>
            <ModuleSelector 
              selectedModules={proposal.solution.selectedModules}
              onChange={(modules: Module[]) => updateSolution({ selectedModules: modules })}
            />
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="space-y-2">
                <Label htmlFor="frontend">Frontend Stack</Label>
                <Input 
                  id="frontend" 
                  value={proposal.techArchitecture.frontendStack.join(", ")}
                  onChange={(e) => updateTechArchitecture({ frontendStack: e.target.value.split(",").map(i => i.trim()) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backend">Backend Stack</Label>
                <Input 
                  id="backend" 
                  value={proposal.techArchitecture.backendStack.join(", ")}
                  onChange={(e) => updateTechArchitecture({ backendStack: e.target.value.split(",").map(i => i.trim()) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="database">Database</Label>
                <Input 
                  id="database" 
                  value={proposal.techArchitecture.database}
                  onChange={(e) => updateTechArchitecture({ database: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hosting">Hosting Environment</Label>
                <Input 
                  id="hosting" 
                  value={proposal.techArchitecture.hosting}
                  onChange={(e) => updateTechArchitecture({ hosting: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black uppercase tracking-tighter text-primary">Commercial Framework</h3>
               <div className="px-3 py-1 bg-slate-900 rounded-md">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white">Financial Protocol</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="space-y-2">
                <Label htmlFor="coreValuation">Core Project Valuation (₹)</Label>
                <Input 
                  id="coreValuation" 
                  type="number"
                  placeholder="e.g. 10000"
                  value={proposal.pricing.coreValuation}
                  onChange={(e) => updatePricing({ coreValuation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Strategic Discount (%)</Label>
                <Input 
                  id="discount" 
                  type="number"
                  placeholder="e.g. 15"
                  value={proposal.pricing.discountPercentage}
                  onChange={(e) => updatePricing({ discountPercentage: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20 flex justify-between items-center">
               <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Calculated Net Investment</div>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">
                     ₹{(Number(proposal.pricing.coreValuation || 0) - (Number(proposal.pricing.coreValuation || 0) * Number(proposal.pricing.discountPercentage || 0)) / 100).toLocaleString()}
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tax Provision ({proposal.pricing.taxRate || 18}%)</div>
                  <div className="text-xl font-bold text-slate-400 tracking-tight">
                     + ₹{((Number(proposal.pricing.coreValuation || 0) - (Number(proposal.pricing.coreValuation || 0) * Number(proposal.pricing.discountPercentage || 0)) / 100) * (Number(proposal.pricing.taxRate || 18) / 100)).toLocaleString()}
                  </div>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Disbursement Phases</Label>
                 <span className="text-[9px] font-bold text-primary italic">Ensure total equals 100%</span>
              </div>
              <div className="space-y-3">
                {proposal.pricing.milestones.map((milestone, index) => (
                  <div key={index} className="grid grid-cols-[2fr,1fr,0.5fr] gap-4 items-end p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase">Phase Identity</Label>
                      <Input 
                        value={milestone.name}
                        onChange={(e) => {
                          const newMilestones = [...proposal.pricing.milestones];
                          newMilestones[index].name = e.target.value;
                          updatePricing({ milestones: newMilestones });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase">Allocation (%)</Label>
                      <Input 
                        type="number"
                        value={milestone.percentage}
                        onChange={(e) => {
                          const newMilestones = [...proposal.pricing.milestones];
                          newMilestones[index].percentage = Number(e.target.value);
                          updatePricing({ milestones: newMilestones });
                        }}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-slate-300 hover:text-red-500"
                      onClick={() => {
                        const newMilestones = proposal.pricing.milestones.filter((_, i) => i !== index);
                        updatePricing({ milestones: newMilestones });
                      }}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full border-dashed border-2 h-12 gap-2 uppercase text-[10px] font-black tracking-widest"
                  onClick={() => {
                    updatePricing({ 
                      milestones: [...proposal.pricing.milestones, { name: "Next Phase", percentage: 0, description: "Milestone Details" }] 
                    });
                  }}
                >
                  <Plus size={14} />
                  Add Disbursement Phase
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roiLogic">ROI Settlement Logic & Formula Narrative</Label>
              <Textarea 
                id="roiLogic" 
                placeholder="Explain the breakdown of how the client recovers this investment..."
                value={proposal.pricing.roiLogic}
                onChange={(e) => updatePricing({ roiLogic: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-tighter text-primary">Policies & Commitments</h3>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportPolicy">Support & SLA</Label>
                  <Textarea 
                    id="supportPolicy" 
                    value={proposal.policies.support}
                    onChange={(e: any) => updatePolicies({ support: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityPolicy">Security Protocols</Label>
                  <Textarea 
                    id="securityPolicy" 
                    value={proposal.policies.security}
                    onChange={(e: any) => updatePolicies({ security: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupPolicy">Backup Protocol</Label>
                  <Textarea 
                    id="backupPolicy" 
                    value={proposal.policies.backup}
                    onChange={(e: any) => updatePolicies({ backup: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slaPolicy">Uptime Guarantee (SLA)</Label>
                  <Textarea 
                    id="slaPolicy" 
                    value={proposal.policies.sla}
                    onChange={(e: any) => updatePolicies({ sla: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-tighter text-primary">CTA & Closing</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meetingLink">Meeting / Booking Link</Label>
                <Input 
                  id="meetingLink" 
                  placeholder="e.g. calendly.com/weblozy" 
                  value={proposal.closing.meetingLink}
                  onChange={(e) => updateClosing({ meetingLink: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail" 
                    value={proposal.closing.contactEmail}
                    onChange={(e) => updateClosing({ contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input 
                    id="contactPhone" 
                    value={proposal.closing.contactPhone}
                    onChange={(e) => updateClosing({ contactPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextSteps">Next Steps (Comma separated)</Label>
                <Textarea 
                  id="nextSteps" 
                  value={proposal.closing.nextSteps.join(", ")}
                  onChange={(e) => updateClosing({ nextSteps: e.target.value.split(",").map(i => i.trim()) })}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Left Side: Form Content */}
        <div className="w-full md:w-1/2 lg:w-[45%] xl:w-[40%] flex flex-col border-r bg-card/30 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b bg-background/50 sticky top-0 z-20">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <img src="/asset/logo.png" alt="Weblozy" className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <div>
                  <h1 className="text-xl font-black uppercase tracking-tighter text-primary">Weblozy OS</h1>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Modify Proposal: {proposal.client.referenceId}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/")} className="h-8 text-[10px] uppercase font-bold tracking-widest">
                  Cancel
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="h-8 text-[10px] uppercase font-bold tracking-widest bg-primary/20 text-primary hover:bg-primary/30"
                  onClick={handleAIAction}
                  disabled={isGenerating}
                >
                  <Wand2 className={`w-3 h-3 mr-1 ${isGenerating ? "animate-spin" : ""}`} />
                  AI Sync
                </Button>
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                    currentStep === i 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="pb-24"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="p-6 border-t bg-background/80 backdrop-blur sticky bottom-0 z-20 flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} 
              disabled={currentStep === 0}
              className="gap-2 text-xs uppercase font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={nextStep} 
                className="gap-2 h-10 px-6 text-xs uppercase font-bold"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="gap-2 h-10 px-6 text-xs uppercase font-bold bg-primary text-primary-foreground"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Update Protocol
              </Button>
            )}
          </div>
        </div>

        {/* Right Side: PDF Preview */}
        <div className="hidden md:flex flex-1 bg-slate-50 items-start justify-center overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar relative border-l shadow-inner">
           <div className="w-full max-w-4xl flex justify-center py-12">
              <div className="transform scale-[0.5] sm:scale-[0.6] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-100 origin-top overflow-visible transition-transform duration-300">
                 <ProposalPDF proposal={proposal} />
              </div>
           </div>

           {/* Visual Guide Overlay */}
           <div className="absolute top-4 right-4 bg-white shadow-sm px-3 py-1.5 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Live Preview • A4 Format
           </div>
        </div>
      </div>
    </div>
  );
}
