import { useState } from "react";
import { Proposal, ClientDetails, BusinessSituation, SolutionDetails, ROIMetrics, PricingDetail, Policies, TechnicalArchitecture, ExperiencePortfolio, ClosingCTA } from "@/types/proposal";

const initialProposal: Proposal = {
  userId: "",
  client: {
    companyName: "",
    contactPerson: "",
    clientName: "VALUED CLIENT",
    industry: "",
    industryTitle: "BUSINESS AUTOMATION",
    meetingDate: "",
    proposalTitle: "",
    tagline: "WE AUTOMATE BUSINESSES",
    preparedBy: "Weblozy Consulting Team",
    referenceId: `WBZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "Draft",
    subTitle: "Digital Transformation & Business Automation",
    industryDomain: "Business Automation / Enterprise Sector",
    releaseProtocol: "Confidential / Stable-V2",
    protocolTitle: "CONFIDENTIAL",
    filingDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase(),
    executiveSummary: "In today's hyper-accelerated market, efficiency is the only competitive moat. This proposal outlines a comprehensive automation architecture designed specifically for your digital excellence.",
    websiteUrl: "WWW.WEBLOZY.COM",
    frameworkTitle: "EXECUTIVE FRAMEWORK",
    footerMessage: "© WEBLOZY SOLUTIONS • GLOBAL OPERATIONS"
  },
  problemStatement: {
    heading: "The Innovation Bottleneck",
    description: "Your current operational architecture is facing systemic challenges that impede rapid growth and scalability. We have identified several critical areas where friction is most prevalent.",
    pointers: [
      "Fragmented data silos leading to informational delay",
      "Manual repetitive tasks consuming high-value human capital",
      "Lack of real-time visibility into operational performance"
    ]
  },
  situation: {
    currentWorkflow: "",
    existingSoftware: "",
    challenges: [],
    revenueLeakage: "",
    inefficiencies: "",
    limitations: "",
    meetingNotes: "",
  },
  solution: {
    overview: "",
    approach: "",
    approachPoints: [],
    selectedModules: [],
    customModules: [],
    demoLinks: [],
    timeline: "",
    integrations: [],
    userRoles: [],
    flowchartImageUrl: "",
    demoLink: "",
  },
  techArchitecture: {
    frontendStack: ["React.js", "Next.js", "Tailwind CSS"],
    backendStack: ["Node.js", "Express", "Python"],
    database: "PostgreSQL / MongoDB",
    hosting: "AWS / Google Cloud",
    securityFeatures: ["256-bit AES Encryption", "SOC2 Compliance", "Multi-factor Authentication"],
  },
  roi: {
    revenueIncrease: "",
    costReduction: "",
    timeSaving: "",
    productivityIncrease: "",
    expectedROI: "",
    profitImpact: "",
    impactSummary: "",
  },
  experience: {
    yearsOfExperience: "10+",
    projectsCompleted: "250+",
    industriesServed: ["E-commerce", "Fintech", "Manufacturing", "Logistics"],
    testimonials: [],
    portfolioLinks: [
      "Enterprise Ecosystem|https://weblozyenterprisedemo.netlify.app/",
      "Precision Manufacturing|https://snow-wombat-148981.hostingersite.com/",
      "AI Analytics|https://weblozyaianalyzer.vercel.app/",
      "Modern UX|https://weblozydemocool.netlify.app/"
    ],
    strategicSummary: "Weblozy specializes in high-performance automation ecosystems, bridging the gap between legacy operations and future-ready scalability.",
    partnerStatus: "ACTIVE PARTNER",
  },
  pricing: {
    range: "",
    coreValuation: "10000",
    discountPercentage: "15",
    taxRate: "18",
    milestones: [
      { name: "Initiation Advance", percentage: 50, description: "Strategic Planning & Architecture Setup" },
      { name: "Development Milestone", percentage: 30, description: "Core Development & Beta Testing" },
      { name: "Final Deployment", percentage: 20, description: "UAT & Global Launch" }
    ],
    hostingCost: "Included",
    maintenanceCost: "Included",
    supportCost: "Included",
    taxes: "18% GST extra",
    roiLogic: "The investment is optimized for high-yield operational efficiency, with a projected systemic ROI realized through automated cost reduction.",
  },
  policies: {
    support: "24/7 Priority Support with Dedicated Manager",
    security: "Enterprise-grade security with regular penetration testing",
    backup: "Daily automated geo-redundant cloud backups",
    sla: "99.99% Uptime Guarantee with SLA reporting",
    timeline: "8-12 Weeks Implementation Lifecycle",
  },
  closing: {
    meetingLink: "https://calendly.com/weblozy",
    nextSteps: ["Initial Technical Discovery", "Logic Blueprint Approval", "Agile Development Sprint", "UAT & Deployment"],
    contactEmail: "HELLO@WEBLOZY.COM",
    contactPhone: "+91 98765 43210",
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export function useProposalForm() {
  const [proposal, setProposal] = useState<Proposal>(initialProposal);

  const updateClient = (data: Partial<ClientDetails>) => {
    setProposal(prev => ({ ...prev, client: { ...prev.client, ...data } }));
  };

  const updateProblemStatement = (data: Partial<Proposal['problemStatement']>) => {
    setProposal(prev => ({ ...prev, problemStatement: { ...prev.problemStatement, ...data } }));
  };

  const updateSituation = (data: Partial<BusinessSituation>) => {
    setProposal(prev => ({ ...prev, situation: { ...prev.situation, ...data } }));
  };

  const updateSolution = (data: Partial<SolutionDetails>) => {
    setProposal(prev => ({ ...prev, solution: { ...prev.solution, ...data } }));
  };

  const updateTechArchitecture = (data: Partial<TechnicalArchitecture>) => {
    setProposal(prev => ({ ...prev, techArchitecture: { ...prev.techArchitecture, ...data } }));
  };

  const updateROI = (data: Partial<ROIMetrics>) => {
    setProposal(prev => ({ ...prev, roi: { ...prev.roi, ...data } }));
  };

  const updateExperience = (data: Partial<ExperiencePortfolio>) => {
    setProposal(prev => ({ ...prev, experience: { ...prev.experience, ...data } }));
  };

  const updatePricing = (data: Partial<PricingDetail>) => {
    setProposal(prev => ({ ...prev, pricing: { ...prev.pricing, ...data } }));
  };

  const updatePolicies = (data: Partial<Policies>) => {
    setProposal(prev => ({ ...prev, policies: { ...prev.policies, ...data } }));
  };

  const updateClosing = (data: Partial<ClosingCTA>) => {
    setProposal(prev => ({ ...prev, closing: { ...prev.closing, ...data } }));
  };

  const setAIContent = (content: Proposal['aiGeneratedContent']) => {
    setProposal(prev => ({ ...prev, aiGeneratedContent: content }));
  };

  return {
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
  };
}
