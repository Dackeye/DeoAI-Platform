import React from 'react';
import { View, UserProfile } from '../types';
import { 
  LayoutDashboard, 
  Wallet, 
  Share2, 
  Scale, 
  Users, 
  Bot, 
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  user?: UserProfile;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout }) => {
  const coreItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.FINANCE, label: 'Financial Suite', icon: Wallet },
    { id: View.ADVISOR, label: 'NEO Advisor', icon: Bot },
  ];

  const secondaryItems = [
    { id: View.SOCIAL, label: 'Social Manager', icon: Share2 },
    { id: View.COMPLIANCE, label: 'Compliance & Legal', icon: Scale },
    { id: View.COMMUNITY, label: 'Community Hub', icon: Users },
  ];

  const NavButton: React.FC<{ item: any }> = ({ item }) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return (
        <button
        onClick={() => setView(item.id)}
        className={`flex items-center p-3 rounded-xl transition-all duration-200 group w-full mb-1
            ${isActive 
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-indigo-300'
            }`}
        >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className={`hidden lg:block ml-3 font-medium ${isActive ? 'text-white' : ''}`}>
            {item.label}
        </span>
        {isActive && (
            <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        )}
        </button>
    );
  };

  return (
    <div className="hidden lg:flex w-20 lg:w-64 h-screen bg-slate-900 border-r border-slate-800 flex-col justify-between sticky top-0">
      <div>
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="hidden lg:block ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            NEO
          </span>
        </div>

        <nav className="mt-6 px-2 lg:px-4">
            <div className="mb-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:block">Core</div>
            {coreItems.map(item => <NavButton key={item.id} item={item} />)}

            <div className="mt-6 mb-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:block">Apps</div>
            {secondaryItems.map(item => <NavButton key={item.id} item={item} />)}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2">
        {user && (
            <button 
                onClick={() => setView(View.PROFILE)}
                className={`flex items-center w-full p-2 rounded-xl transition-colors ${currentView === View.PROFILE ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
            >
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <User size={16} className="text-slate-400" />
                    )}
                </div>
                <div className="hidden lg:block ml-3 text-left overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.businessName}</p>
                </div>
            </button>
        )}
        <button 
            onClick={onLogout}
            className="flex items-center w-full p-3 text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-colors"
        >
          <LogOut size={24} />
          <span className="hidden lg:block ml-3 font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;