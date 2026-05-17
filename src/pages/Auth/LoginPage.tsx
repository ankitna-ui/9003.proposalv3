import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  confirmPasswordReset
} from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Zap, ChevronRight, ArrowLeft, Mail, Lock, CheckCircle2, Cpu, Globe, Database } from "lucide-react";
import { toast } from "react-toastify";
import banner2Logo from "@/assets/banner2_logo.png";

type AuthMode = "login" | "signup" | "forgot-password" | "reset-password" | "success" | "loading";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing System...");
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (mode === "resetPassword" && oobCode) {
      setAuthMode("reset-password");
    }
  }, [mode, oobCode]);

  useEffect(() => {
    setError(null);
  }, [email, password, newPassword, confirmPassword, authMode]);

  useEffect(() => {
    if (authMode === "loading") {
      const texts = [
        "Establishing Secure Bridge...",
        "Synchronizing Strategic Modules...",
        "Decrypting Executive Assets...",
        "Validating Authority Tokens...",
        "Launching Weblozy OS..."
      ];
      let currentTextIndex = 0;
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => navigate("/"), 500);
            return 100;
          }
          
          if (prev % 20 === 0 && prev > 0) {
            currentTextIndex = Math.min(currentTextIndex + 1, texts.length - 1);
            setLoadingText(texts[currentTextIndex]);
          }
          
          return prev + 1;
        });
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [authMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Advanced Local Validations
    if (authMode === "login" || authMode === "signup" || authMode === "forgot-password") {
      if (!email.trim()) {
        setError("Operator Validation Failure: Terminal ID (Email) cannot be empty.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Security Alert: Invalid Terminal ID (Email) format.");
        return;
      }
    }

    if (authMode === "login" || authMode === "signup") {
      if (!password) {
        setError("Security Alert: Access Key (Password) cannot be empty.");
        return;
      }
      if (password.length < 6) {
        setError("Security Alert: Access Key must contain at least 6 characters.");
        return;
      }
    }

    if (authMode === "reset-password") {
      if (!newPassword || !confirmPassword) {
        setError("Security Alert: Keys cannot be empty.");
        return;
      }
      if (newPassword.length < 6) {
        setError("Security Alert: New Access Key must contain at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Security Alert: Security keys do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Identity Verified. Accessing Strategic Dashboard.");
        setAuthMode("loading");
      } else if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Identity Established. Initializing Node.");
        setAuthMode("loading");
      } else if (authMode === "forgot-password") {
        await sendPasswordResetEmail(auth, email);
        toast.success("Recovery Protocol Dispatched to your inbox.");
        setAuthMode("success");
      } else if (authMode === "reset-password") {
        if (oobCode) {
          await confirmPasswordReset(auth, oobCode, newPassword);
          toast.success("Security Key Re-established successfully.");
          setAuthMode("success");
        }
      }
    } catch (error: any) {
      console.error(error);
      const friendlyMessage = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' 
        ? "Invalid credentials for this terminal ID." 
        : "Authentication protocol failed. Please verify credentials.";
      setError(friendlyMessage);
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case "signup": return "Onboarding";
      case "forgot-password": return "Recovery";
      case "reset-password": return "Re-Initialize";
      case "success": return "Status";
      default: return "Authentication";
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case "signup": return "Initialize your enterprise workstation.";
      case "forgot-password": return "Recover access to your secure environment.";
      case "reset-password": return "Establish a new high-security access key.";
      case "success": return "Action completed successfully.";
      default: return "Access your secure automation dashboard.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06080B] p-6 relative overflow-hidden font-sans">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{ 
            backgroundImage: `linear-gradient(#1668B2 1px, transparent 1px), linear-gradient(90deg, #1668B2 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
          }} 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1668B2] blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#99CB48] blur-[120px] rounded-full" 
        />
      </div>

      <AnimatePresence mode="wait">
        {authMode === "loading" ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-sm space-y-10 text-center relative z-10"
          >
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-primary/15 blur-[50px] animate-pulse rounded-full" />
              <motion.img 
                src={banner2Logo} 
                alt="Weblozy" 
                className="w-full h-full object-contain relative z-10 p-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white uppercase tracking-[0.4em] leading-none">{loadingText}</h2>
                <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] italic">Access Channel Validating</p>
              </div>
              
              <div className="relative space-y-2">
                <div className="h-[1.5px] w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_#99CB48]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                  <span>System Logic Hook: {loadingProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl grid md:grid-cols-2 bg-[#0E1217]/90 backdrop-blur-3xl rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden border border-white/5 relative z-10"
          >
            {/* Left Side: Institutional Branding */}
            <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent relative border-r border-white/5">
              <div className="space-y-12">
                <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4">
                  <img src={banner2Logo} alt="Weblozy" className="h-8 w-auto object-contain" />
                  <div className="h-5 w-px bg-white/10" />
                  <div className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-black">Auth_V2.8</div>
                </motion.div>
    
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Strategic OS</span>
                  </div>
                  <h1 className="text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                    Absolute <br />
                    <span className="text-primary italic">Authority.</span>
                  </h1>
                  <p className="text-gray-500 text-base leading-relaxed max-w-[280px] font-medium tracking-tight">
                    High-impact enterprise documentation and strategic automation ecosystem.
                  </p>
                </div>
              </div>
    
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-3">
                   {[
                     { icon: ShieldCheck, label: "AES-256" },
                     { icon: Zap, label: "Quantum" },
                     { icon: Globe, label: "Global" }
                   ].map((item, idx) => (
                     <div key={idx} className="p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all">
                        <item.icon className="w-6 h-6 text-primary/60 mb-2" />
                        <div className="text-[8px] font-black text-white/60 uppercase tracking-widest">{item.label}</div>
                     </div>
                   ))}
                </div>
                <div className="text-[7px] font-black text-white/10 uppercase tracking-[0.6em] text-center italic">Institutional Standard</div>
              </div>
            </div>
    
            {/* Right Side: Authentication Interface */}
            <div className="p-12 flex flex-col justify-center bg-black/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={authMode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                        {getTitle()}
                      </h2>
                      {authMode !== "login" && authMode !== "success" && (
                        <button onClick={() => setAuthMode("login")} className="text-primary hover:text-white transition-colors">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm font-medium tracking-tight">
                      {getSubtitle()}
                    </p>
                  </div>
    
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {(authMode === "login" || authMode === "signup" || authMode === "forgot-password") && (
                      <div className="space-y-2">
                        <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-2">Terminal ID</Label>
                        <div className="relative group">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="email" 
                            placeholder="OPERATOR@WEBLOZY.COM" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 pl-14 bg-white/[0.02] border-white/10 rounded-[1.2rem] focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold tracking-tight uppercase transition-all text-sm"
                          />
                        </div>
                      </div>
                    )}
    
                    {(authMode === "login" || authMode === "signup") && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center px-2">
                          <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px]">Access Key</Label>
                          {authMode === "login" && (
                            <button type="button" onClick={() => setAuthMode("forgot-password")} className="text-[8px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors">Recover?</button>
                          )}
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-14 pl-14 bg-white/[0.02] border-white/10 rounded-[1.2rem] focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold transition-all text-sm"
                          />
                        </div>
                      </div>
                    )}
    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-[1rem] bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-red-500/5"
                      >
                        {error}
                      </motion.div>
                    )}

                    {authMode !== "success" ? (
                      <Button type="submit" className="w-full h-14 text-sm font-black uppercase tracking-[0.4em] bg-primary text-black hover:bg-primary/90 rounded-[1.2rem] shadow-lg shadow-primary/10 transition-all active:scale-[0.98] group overflow-hidden relative">
                        {loading ? "Authorizing..." : (
                          <div className="flex items-center gap-2">
                            {authMode === "login" ? "Initialize" : authMode === "signup" ? "Deploy" : "Dispatch"}
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        )}
                      </Button>
                    ) : (
                      <Button type="button" onClick={() => { setAuthMode("login"); }} className="w-full h-14 text-sm font-black uppercase tracking-[0.4em] bg-white/5 border border-white/10 text-white rounded-[1.2rem]">Return Hub</Button>
                    )}
    
                    {(authMode === "login" || authMode === "signup") && (
                      <div className="text-center pt-4">
                        <button type="button" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} className="text-[9px] font-black text-gray-600 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-[0.3em]">
                          {authMode === "login" ? "Establish Identity" : "Authorize Session"}
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Institutional Footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center opacity-15 pointer-events-none">
        <div className="text-[9px] font-black text-white uppercase tracking-[0.8em]">Weblozy Labs • Secure Terminal</div>
      </div>
    </div>
  );
}

