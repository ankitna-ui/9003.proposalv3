import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, TrendingUp, Users, Clock, Eye, Trash2, LogOut, Pencil, LayoutGrid, Search, Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProposals, deleteProposal } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Proposal } from "@/types/proposal";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import banner2Logo from "@/assets/banner2_logo.png";

// System Templates / Sample Data for a full experience
const SAMPLE_PROPOSALS: (Proposal & { id: string })[] = [
  {
    id: "sample-1",
    userId: "system",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    client: {
      companyName: "Nexus Global",
      contactPerson: "Alex Rivera",
      clientName: "Alex Rivera",
      industry: "Retail Automation",
      industryTitle: "Retail Automation",
      proposalTitle: "E-commerce AI Transformation",
      industryDomain: "Global E-commerce",
      websiteUrl: "WWW.NEXUSGLOBAL.COM",
      tagline: "The Future of Retail",
      subTitle: "Strategic Technical Roadmap V2.0",
      protocolTitle: "CONFIDENTIAL",
      releaseProtocol: "SECURE-NODE",
      filingDate: "MAY 2024",
      status: "Sent",
      referenceId: "WBL-NEXUS-001",
      meetingDate: "2024-05-10",
      preparedBy: "Weblozy Labs"
    },
    problemStatement: {
      heading: "Operational Inefficiency",
      description: "Manual order management is causing significant revenue leakage.",
      pointers: ["15% error rate", "High manual overhead", "Inventory desync"]
    },
    situation: {
      currentWorkflow: "Nexus Global currently manages 500+ orders manually, leading to a 15% error rate in fulfillment.",
      revenueLeakage: "₹2.5L / Month",
      inefficiencies: "High manual overhead",
      challenges: ["Manual Order Entry", "Inventory Desync", "Support Latency"],
      meetingNotes: "Client wants automation.",
      existingSoftware: "Legacy Excel Sheets",
      limitations: "No real-time tracking"
    },
    solution: {
      overview: "Unified Automation Engine",
      approach: "Unified Logic Engine for Real-time Inventory.",
      approachPoints: ["AI Fulfillment", "Cloud Logistics"],
      selectedModules: [
        { id: "mod-1", name: "Inventory Sync", features: ["Real-time", "Multi-channel"] },
        { id: "mod-2", name: "AI Chatbot", features: ["24/7 Support", "NLP"] }
      ],
      customModules: [],
      demoLinks: ["demo.nexus.com"],
      integrations: ["WhatsApp API", "Stripe"],
      userRoles: ["Admin", "Warehouse"],
      timeline: "4 Weeks"
    },
    techArchitecture: {
      frontendStack: ["React", "Tailwind"],
      backendStack: ["Node.js"],
      database: "PostgreSQL",
      hosting: "AWS",
      securityFeatures: ["SSL", "OAuth2"]
    },
    roi: {
      revenueIncrease: "35",
      productivityIncrease: "50",
      costReduction: "20",
      timeSaving: "150",
      expectedROI: "320",
      impactSummary: "Operational reclaimed within 6 months.",
      profitImpact: "₹4.2L / Month"
    },
    pricing: {
      range: "₹45,000 - ₹60,000",
      coreValuation: "55000",
      discountPercentage: "10",
      taxRate: "18",
      milestones: [{ name: "Logic Setup", percentage: 40, description: "Phase 1" }],
      roiLogic: "Value extraction via automation.",
      hostingCost: "₹2,000/mo",
      maintenanceCost: "Included",
      supportCost: "Included",
      taxes: "18% GST"
    },
    experience: {
      yearsOfExperience: "8+",
      projectsCompleted: "150+",
      industriesServed: ["E-commerce", "Fintech"],
      portfolioLinks: ["portfolio.weblozy.com"],
      strategicSummary: "Expertise in high-scale retail.",
      testimonials: []
    },
    policies: {
      support: "24/7 Priority Support",
      security: "Enterprise-grade encryption",
      backup: "Daily automated backups",
      sla: "99.9% Uptime",
      timeline: "Strict milestone adherence"
    },
    closing: {
      meetingLink: "cal.com",
      contactEmail: "nexus@weblozy.com",
      contactPhone: "9999",
      nextSteps: ["Sign Contract", "Kickoff"]
    },
    aiGeneratedContent: {
      problemStatement: "The current manual processes at Nexus Global are unsustainable...",
      proposedSolution: "By implementing the Weblozy OS, Nexus Global will achieve...",
      businessImpact: "The projected ROI of 320% indicates...",
      whyWeblozy: "Weblozy's track record in retail automation..."
    }
  },
  {
     id: "sample-2",
     userId: "system",
     createdAt: Date.now() - 172800000,
     updatedAt: Date.now() - 86400000,
     client: {
       companyName: "FinSafe Ltd",
       contactPerson: "Sarah Chen",
       clientName: "Sarah Chen",
       industry: "Fintech",
       industryTitle: "Fintech",
       proposalTitle: "Quantum Security Protocol",
       industryDomain: "Digital Banking",
       websiteUrl: "WWW.FINSAFE.IO",
       tagline: "Security First",
       subTitle: "Cyber-Defense Architecture",
       protocolTitle: "HIGHLY SENSITIVE",
       releaseProtocol: "DEFENSE-V4",
       filingDate: "APR 2024",
       status: "Draft",
       referenceId: "WBL-FS-202",
       meetingDate: "2024-04-20",
       preparedBy: "Weblozy Labs"
     },
     problemStatement: {
       heading: "Security Latency",
       description: "Legacy security protocols are slowing down transaction speeds.",
       pointers: ["High latency", "Auth failures", "Encryption lag"]
     },
     situation: {
       currentWorkflow: "Legacy security systems causing 2min latency per transaction.",
       revenueLeakage: "₹1.8L / Month",
       inefficiencies: "Security Latency",
       challenges: ["Encryption Lag", "Auth Failures"],
       meetingNotes: "Needs faster auth.",
       existingSoftware: "Legacy Security v2",
       limitations: "Quantum vulnerability"
     },
     solution: {
       overview: "Quantum-Safe Protocol",
       approach: "Quantum-ready Encryption Layer.",
       approachPoints: ["Edge Computing", "Bio-Auth"],
       selectedModules: [
         { id: "mod-3", name: "Security Core", features: ["Quantum-ready", "Zero-trust"] }
       ],
       customModules: [],
       demoLinks: [],
       integrations: ["Auth0", "AWS Shield"],
       userRoles: ["DSO", "Ops"],
       timeline: "6 Weeks"
     },
     techArchitecture: {
       frontendStack: ["Next.js"],
       backendStack: ["Go"],
       database: "Redis",
       hosting: "Google Cloud",
       securityFeatures: ["Quantum Encryption", "Biometric Auth"]
     },
     roi: {
       revenueIncrease: "20",
       productivityIncrease: "30",
       costReduction: "40",
       timeSaving: "200",
       expectedROI: "450",
       impactSummary: "Zero-breach guarantee.",
       profitImpact: "₹6.5L / Month"
     },
     pricing: {
       range: "₹85,000 - ₹1,20,000",
       coreValuation: "95000",
       discountPercentage: "15",
       taxRate: "18",
       milestones: [],
       roiLogic: "Breach avoidance valuation.",
       hostingCost: "₹5,000/mo",
       maintenanceCost: "Custom",
       supportCost: "Priority",
       taxes: "18% GST"
     },
     experience: {
       yearsOfExperience: "8+",
       projectsCompleted: "150+",
       industriesServed: ["Fintech"],
       portfolioLinks: [],
       strategicSummary: "Deep fintech expertise.",
       testimonials: []
     },
     policies: {
       support: "Executive Level Support",
       security: "Quantum-Safe Standards",
       backup: "Real-time mirroring",
       sla: "99.99% Uptime",
       timeline: "Agile delivery"
     },
     closing: {
       meetingLink: "",
       contactEmail: "finsafe@weblozy.com",
       contactPhone: "",
       nextSteps: []
     },
     aiGeneratedContent: {
       problemStatement: "FinSafe's market position is threatened by legacy security...",
       proposedSolution: "The Quantum Security Protocol ensures long-term viability...",
       businessImpact: "Protecting institutional assets from breach...",
       whyWeblozy: "Weblozy's expertise in defensive architecture..."
     }
  }
];

export default function Dashboard() {
  const [proposals, setProposals] = useState<(Proposal & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProposals(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProposals = async (uid: string) => {
    try {
      const data = await getProposals(uid);
      setProposals(data as (Proposal & { id: string })[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this proposal?")) {
      try {
        await deleteProposal(id);
        setProposals(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const displayProposals = useMemo(() => proposals.length > 0 ? proposals : SAMPLE_PROPOSALS, [proposals]);

  const metrics = useMemo(() => [
    { title: "Strategic Proposals", value: displayProposals.length.toString(), icon: FileText, color: "from-blue-600/20 to-blue-400/5", textColor: "text-blue-400" },
    { title: "Active Drafts", value: displayProposals.filter(p => (p.client?.status || 'Draft') === 'Draft').length.toString(), icon: Clock, color: "from-[#99CB48]/20 to-[#99CB48]/5", textColor: "text-[#99CB48]" },
    { title: "Institutional Assets", value: (displayProposals.length * 9).toString(), icon: Database, color: "from-purple-600/20 to-purple-400/5", textColor: "text-purple-400" },
    { title: "Client Network", value: new Set(displayProposals.map(p => p.client?.companyName)).size.toString(), icon: Users, color: "from-orange-600/20 to-orange-400/5", textColor: "text-orange-400" },
  ], [displayProposals]);

  const isShowcase = proposals.length === 0;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white overflow-x-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1668B2]/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Top Command Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={banner2Logo} alt="Weblozy" className="h-10 w-auto object-contain" />
            <div className="h-6 w-[1.5px] bg-white/10 hidden md:block" />
            <div className="hidden md:block">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Automation OS</h2>
              <p className="text-[8px] text-gray-500 uppercase tracking-widest">Master-Grade Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 h-10 w-80">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input type="text" placeholder="Search Strategic Assets..." className="bg-transparent border-none text-[10px] uppercase tracking-widest text-white focus:ring-0 placeholder:text-gray-700 w-full" />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white rounded-full">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              <Button onClick={handleLogout} variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 hover:bg-red-500/5 gap-2 px-4">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              <Button onClick={() => navigate('/create')} className="bg-primary text-black hover:bg-primary/90 h-10 px-6 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20 gap-2">
                <Plus className="w-4 h-4" />
                New Strategy
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-10 space-y-12 relative z-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">System Active</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
              Strategic <span className="text-primary italic">Dashboard</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium tracking-tight">Overview of institutional assets and proposal metrics.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="text-right">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network Status</div>
                <div className="text-xs font-black uppercase tracking-widest text-[#99CB48]">Secured V4.2</div>
             </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 bg-gradient-to-br ${metric.color} border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/20 transition-all duration-500`}
            >
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <metric.icon size={120} />
              </div>
              <div className="flex flex-col gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                  <metric.icon className={`w-6 h-6 ${metric.textColor}`} />
                </div>
                <div>
                  <div className="text-4xl font-black tracking-tighter mb-1 leading-none">{metric.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{metric.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proposals List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Recent Proposals</h3>
            </div>
            <Badge variant="outline" className={`border-white/10 rounded-full px-4 py-1 uppercase text-[9px] font-black tracking-widest ${isShowcase ? 'text-orange-400 bg-orange-400/5' : 'text-primary bg-primary/5'}`}>
              {isShowcase ? "System Showcase" : "Live Monitoring"}
            </Badge>
          </div>

          <div className="bg-[#161B22]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] overflow-hidden">
            {loading ? (
              <div className="p-32 text-center">
                <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Accessing Cloud Assets...</div>
              </div>
            ) : proposals.length === 0 ? (
              <div className="p-32 text-center space-y-6">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-700">
                  <FileText size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-gray-400">No Proposals Found</h4>
                  <p className="text-gray-600 text-sm max-w-xs mx-auto">Start by initializing your first strategic document.</p>
                </div>
                <Button onClick={() => navigate('/create')} className="bg-primary text-black font-black uppercase tracking-widest rounded-full px-8 h-12">
                  Launch Creator
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-6 pl-10 text-[10px] font-black uppercase tracking-widest text-gray-500">Client Profile</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Strategic Title</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Execution Status</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Timestamp</th>
                      <th className="p-6 pr-10 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {displayProposals.map((p, i) => (
                      <motion.tr 
                        key={p.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="p-6 pl-10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center text-primary font-black text-xs">
                              {p.client?.companyName?.charAt(0) || "W"}
                            </div>
                            <div className="font-black text-white uppercase tracking-tight">{p.client?.companyName || "N/A"}</div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="text-gray-400 text-xs font-bold uppercase tracking-tight line-clamp-1">{p.client?.proposalTitle || "Bespoke Solution"}</div>
                        </td>
                        <td className="p-6">
                          <Badge 
                            variant="outline" 
                            className={`rounded-full px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] border-none ${
                              p.client?.status === 'Draft' 
                              ? 'bg-orange-500/10 text-orange-400' 
                              : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {p.client?.status || 'Draft'}
                          </Badge>
                        </td>
                        <td className="p-6">
                          <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                            {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                          </div>
                        </td>
                        <td className="p-6 pr-10 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => navigate(`/preview/${p.id}`, { state: { proposal: p } })}
                              className="w-10 h-10 rounded-xl hover:bg-primary/10 text-primary transition-all active:scale-90"
                            >
                              <Eye className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => navigate(`/edit/${p.id}`)}
                              className="w-10 h-10 rounded-xl hover:bg-orange-500/10 text-orange-500 transition-all active:scale-90"
                            >
                              <Pencil className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(p.id)}
                              disabled={p.userId === 'system'}
                              className="w-10 h-10 rounded-xl hover:bg-red-500/10 text-red-500 transition-all active:scale-90 disabled:opacity-20"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-[1600px] mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
        <div className="flex items-center gap-4">
          <img src={banner2Logo} alt="Weblozy" className="h-6 w-auto grayscale" />
          <div className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic Control Node</div>
        </div>
        <div className="text-[8px] font-black uppercase tracking-[0.6em]">
          Secure Terminal Access • Version 2.8.5 • © 2026 Weblozy Labs
        </div>
      </footer>
    </div>
  );
}

// Support Icon for Metrics
function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
