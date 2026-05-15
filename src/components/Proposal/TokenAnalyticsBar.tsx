import React from 'react';
import { useTokens } from '@/hooks/useTokens';
import { Cpu, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const TokenAnalyticsBar: React.FC = () => {
  const { used, total, remaining, percentage, lastUsage } = useTokens();

  const getStatusColor = () => {
    if (percentage > 85) return 'bg-[#FF4D4D]';
    if (percentage > 60) return 'bg-[#FFB800]';
    return 'bg-[#3ABEF9]';
  };

  return (
    <div className="w-full bg-[#0B0E14] rounded-3xl p-5 border border-white/5 shadow-xl relative overflow-hidden group mb-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#3ABEF9]/5 blur-[50px] -mr-16 -mt-16" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Stats */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3ABEF9]">
             <Cpu size={20} />
          </div>
          <div className="space-y-0.5">
            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">AI Neural Credits</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white tabular-nums">{(remaining / 1000).toFixed(1)}k</span>
              <span className="text-[8px] font-bold text-[#3ABEF9] uppercase tracking-widest">Available</span>
            </div>
          </div>
        </div>

        {/* Center Progress */}
        <div className="flex-1 w-full max-w-md space-y-2">
          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
             <div className="flex items-center gap-1.5">
                <Activity size={10} className="text-[#3ABEF9]" />
                <span className="text-white/40">Efficiency Optimal</span>
             </div>
             <span className="text-white/20">{used.toLocaleString()} / {total.toLocaleString()} Used</span>
          </div>
          <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05] p-[2px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1 }}
              className={`h-full rounded-full ${getStatusColor()} shadow-[0_0_10px_rgba(58,190,249,0.3)]`}
            />
          </div>
        </div>

        {/* Right Info */}
        {lastUsage > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
          >
             <Zap size={10} className="text-amber-400" />
             <span className="text-[8px] font-black uppercase text-white tracking-[0.2em]">+{lastUsage} TKN</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TokenAnalyticsBar;
