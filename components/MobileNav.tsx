import React, { useState } from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  Wallet, 
  Bot, 
  MoreHorizontal,
  Share2,
  Scale,
  Users,
  User
} from 'lucide-react';

interface MobileNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView }) => {
  const [showMore, setShowMore] = useState(false);

  // Core items typically at the bottom in main bar
  const coreItems = [
    { id: View.DASHBOARD, label: 'Home', icon: LayoutDashboard },
    { id: View.FINANCE, label: 'Finance', icon: Wallet },
    { id: View.ADVISOR, label: 'Advisor', icon: Bot },
  ];

  // Secondary items in the "More" menu
  const secondaryItems = [
    { id: View.SOCIAL, label: 'Social', icon: Share2 },
    { id: View.COMPLIANCE, label: 'Legal', icon: Scale },
    { id: View.COMMUNITY, label: 'Community', icon: Users },
    { id: View.PROFILE, label: 'Profile', icon: User },
  ];

  const handleNavClick = (view: View) => {
    setView(view);
    setShowMore(false);
  };

  return (
    <>
      {/* Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 pb-safe z-50 px-4 py-2 flex justify-around items-center h-16 shadow-2xl">
        {coreItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        
        {/* More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center gap-1 transition-colors ${
             showMore ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <MoreHorizontal size={24} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>

      {/* More Menu Drawer */}
      {showMore && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowMore(false)}>
            <div 
                className="absolute bottom-16 right-4 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden p-2 flex flex-col gap-1 mb-2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Apps</div>
                {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;