import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import FinancialSuite from './components/FinancialSuite';
import SocialManager from './components/SocialManager';
import Compliance from './components/Compliance';
import Advisor from './components/Advisor';
import Login from './components/Login';
import Profile from './components/Profile';
import { View, UserProfile } from './types';
import { Users } from 'lucide-react';

// Simple placeholder for Community since it wasn't core logic focus but visual
const CommunityPlaceholder = () => (
    <div className="p-10 text-center animate-fade-in">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={40} className="text-indigo-400"/>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Entrepreneur Community</h2>
        <p className="text-slate-400 max-w-md mx-auto">
            Connect with like-minded founders, share your journey, and find partners.
            <br/><br/>
            <span className="text-sm italic opacity-50">Coming in v2.0</span>
        </p>
    </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  
  // User Profile State
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex@neo-business.com',
    businessName: 'Neo Innovations',
    role: 'Founder & CEO',
    location: 'Lagos, Nigeria',
    bio: 'Passionate about leveraging technology to solve local problems. Building the future of retail.'
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard setView={setCurrentView} user={user} />;
      case View.FINANCE:
        return <FinancialSuite />;
      case View.SOCIAL:
        return <SocialManager />;
      case View.COMPLIANCE:
        return <Compliance />;
      case View.ADVISOR:
        return <Advisor />;
      case View.COMMUNITY:
        return <CommunityPlaceholder />;
      case View.PROFILE:
        return <Profile user={user} onUpdateUser={setUser} />;
      default:
        return <Dashboard setView={setCurrentView} user={user} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Desktop Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Mobile Bottom Navigation */}
      <MobileNav currentView={currentView} setView={setCurrentView} />

      <main className="flex-1 overflow-x-hidden overflow-y-auto relative pb-16 lg:pb-0">
        {/* Mobile Header (visible only on mobile) */}
        <div className="lg:hidden h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">N</span>
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                    NEO
                </span>
             </div>
        </div>

        {renderView()}
      </main>
    </div>
  );
};

export default App;