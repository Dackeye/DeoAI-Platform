import React from 'react';
import { View, UserProfile } from '../types';
import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  DollarSign, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface DashboardProps {
  setView: (view: View) => void;
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, user }) => {
  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 text-lg">Your business ecosystem at <strong>{user.businessName}</strong> is running smoothly.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group cursor-pointer" onClick={() => setView(View.FINANCE)}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <DollarSign size={24} />
            </div>
            <span className="text-emerald-400 text-sm font-semibold bg-emerald-500/10 px-2 py-1 rounded">+14%</span>
          </div>
          <p className="text-slate-400 text-sm">Monthly Profit</p>
          <h3 className="text-2xl font-bold text-white mt-1">$2,450.20</h3>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group cursor-pointer" onClick={() => setView(View.COMMUNITY)}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <span className="text-blue-400 text-sm font-semibold bg-blue-500/10 px-2 py-1 rounded">+5</span>
          </div>
          <p className="text-slate-400 text-sm">New Leads</p>
          <h3 className="text-2xl font-bold text-white mt-1">128</h3>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group cursor-pointer" onClick={() => setView(View.SOCIAL)}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Social Engagement</p>
          <h3 className="text-2xl font-bold text-white mt-1">4.2k</h3>
        </div>

         <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group cursor-pointer" onClick={() => setView(View.COMPLIANCE)}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <AlertCircle size={24} />
            </div>
             <span className="text-amber-400 text-sm font-semibold bg-amber-500/10 px-2 py-1 rounded">Action</span>
          </div>
          <p className="text-slate-400 text-sm">Compliance Status</p>
          <h3 className="text-xl font-bold text-white mt-1">Tax Due Soon</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Action Center */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-indigo-400">
                    <Zap size={20} className="fill-indigo-400" />
                    <span className="text-sm font-bold uppercase tracking-wider">NEO Insights</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Recommended Actions</h2>
                <div className="space-y-4">
                    <div className="bg-slate-950/50 backdrop-blur-sm p-4 rounded-xl border border-indigo-500/20 flex items-start gap-4">
                         <div className="mt-1 p-2 bg-indigo-500/20 rounded-lg">
                            <ShieldCheck size={18} className="text-indigo-300" />
                         </div>
                         <div>
                            <h4 className="text-white font-semibold">Review Liability Insurance</h4>
                            <p className="text-slate-400 text-sm mt-1">Based on your recent growth, your current coverage might be insufficient. Ask NEO Advisor for affordable options.</p>
                            <button onClick={() => setView(View.ADVISOR)} className="text-indigo-400 text-sm font-medium mt-3 flex items-center gap-1 hover:gap-2 transition-all">
                                Consult Advisor <ArrowRight size={14} />
                            </button>
                         </div>
                    </div>
                    
                    <div className="bg-slate-950/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 flex items-start gap-4">
                         <div className="mt-1 p-2 bg-pink-500/20 rounded-lg">
                            <TrendingUp size={18} className="text-pink-300" />
                         </div>
                         <div>
                            <h4 className="text-white font-semibold">Instagram Momentum</h4>
                            <p className="text-slate-400 text-sm mt-1">Your post from Tuesday is performing 20% better than average. Boost it now?</p>
                            <button onClick={() => setView(View.SOCIAL)} className="text-pink-400 text-sm font-medium mt-3 flex items-center gap-1 hover:gap-2 transition-all">
                                Go to Social Manager <ArrowRight size={14} />
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Access */}
        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Learning Hub</h3>
                <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 cursor-pointer transition-colors border border-slate-800">
                        <span className="text-xs text-indigo-400 font-bold">NEW ARTICLE</span>
                        <p className="text-sm text-slate-200 mt-1">Understanding VAT in 2024</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 cursor-pointer transition-colors border border-slate-800">
                        <span className="text-xs text-emerald-400 font-bold">VIDEO</span>
                        <p className="text-sm text-slate-200 mt-1">Marketing for Gen Z: Authenticity Wins</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-indigo-600/30">
                    <Users className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-white">Join the Community</h3>
                <p className="text-slate-400 text-sm mt-2 mb-4">Connect with 500+ entrepreneurs in your niche.</p>
                <button onClick={() => setView(View.COMMUNITY)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Explore Network
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;