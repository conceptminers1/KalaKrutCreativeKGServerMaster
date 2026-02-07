
import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, Users, Calendar, Vote, Settings, LogOut, Menu, X, ShoppingBag, Briefcase, 
  BarChart3, Contact2, Bot, MessageSquare, UploadCloud, Network, GitMerge, LifeBuoy, CreditCard, Coins, FileText, FileSignature, AlertTriangle
} from 'lucide-react';
import { RosterMember, UserRole } from '../types';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { SystemConfigModal } from './SystemConfigModal';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: string) => void;
  currentView: string;
  onLogout: () => void;
  currentUser: RosterMember | null;
}

const NavItem: React.FC<{ id: string, icon: any, label: string, currentView: string, onNavigate: (view: string) => void, setIsMobileMenuOpen: (isOpen: boolean) => void }> = ({ id, icon: Icon, label, currentView, onNavigate, setIsMobileMenuOpen }) => (
  <button
    onClick={() => {
      onNavigate(id);
      setIsMobileMenuOpen(false);
    }}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
      currentView === id 
        ? 'bg-kala-secondary/10 text-kala-secondary border-r-2 border-kala-secondary' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onNavigate, 
  currentView,
  onLogout, 
  currentUser
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { isDemoMode, demoModeAvailable, setDemoModeAvailable, purgeMockData } = useData();
  const { notify } = useToast();

  const permissions = useMemo(() => {
    if (!currentUser) return {};
    const { role } = currentUser;
    const isLiveAdmin = role === UserRole.SYSTEM_ADMIN_LIVE;
    const isDemoAdmin = role === UserRole.ADMIN;
    const isDaoGovernor = role === UserRole.DAO_GOVERNOR;
    const isDaoMember = role === UserRole.DAO_MEMBER;

    return {
      canAccessSystemConfig: isLiveAdmin,
      canGovernDao: isLiveAdmin || isDemoAdmin || isDaoGovernor,
      canAccessTreasury: isLiveAdmin || isDemoAdmin || isDaoGovernor,
      canAccessHr: isLiveAdmin || isDemoAdmin,
      canAccessAnalytics: isLiveAdmin || isDemoAdmin,
      canAccessSupport: isLiveAdmin || isDemoAdmin,
      canAccessLeads: isLiveAdmin || isDemoAdmin,
      canAccessEmailTemplates: isLiveAdmin || isDemoAdmin,
      canViewContracts: isLiveAdmin || isDemoAdmin || isDaoGovernor || isDaoMember,
    };
  }, [currentUser]);

  const isActionAllowed = permissions.canAccessSystemConfig && !isDemoMode;

  const handleToggleDemoAvailability = () => {
    if (!isActionAllowed) {
      notify('You do not have permission to change this setting.', 'error');
      return;
    }
    setDemoModeAvailable(!demoModeAvailable);
    notify(`Public Demo Mode has been ${!demoModeAvailable ? 'ENABLED' : 'DISABLED'}.`, 'success');
  };
  
  const handlePurge = () => {
    if(isActionAllowed) {
      purgeMockData();
      notify('All mock data has been purged.', 'success');
    } else {
      notify('You do not have permission to perform this action.', 'error');
    }
  }

  const mainNavItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { id: 'services', icon: Briefcase, label: 'Services Hub' },
    { id: 'booking', icon: Calendar, label: 'Proposals & Bookings' },
    { id: 'studio', icon: UploadCloud, label: 'Creative Studio' },
  ];

  const communityNavItems = [
    { id: 'roster', icon: Contact2, label: 'Roster / Members' },
    { id: 'forum', icon: MessageSquare, label: 'Forum' },
    { id: 'my_circle', icon: Users, label: 'My Circle' },
    { id: 'membership', icon: CreditCard, label: 'Membership & Plans' },
  ];
  
  const navProps = { currentView, onNavigate, setIsMobileMenuOpen };

  return (
    <div className="min-h-screen bg-kala-900 flex text-slate-200 font-sans selection:bg-kala-secondary selection:text-kala-900 relative">
      
      <div className="lg:hidden fixed top-0 w-full bg-kala-900/90 backdrop-blur border-b border-kala-700 z-50 px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tighter text-white">
          Kala<span className="text-kala-secondary">Krut</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside className={`
        fixed lg:static top-0 left-0 z-40 h-full w-64 bg-kala-900 border-r border-kala-800 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-kala-800">
           <div className="font-bold text-2xl tracking-tighter text-white">
            Kala<span className="text-kala-secondary">Krut</span>
            <span className="text-[10px] ml-1 bg-kala-700 text-kala-300 px-1.5 py-0.5 rounded">v3.0</span>
          </div>
          <p className="text-xs text-kala-500 mt-1">Creative Portal</p>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar">
          <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2">Main</div>
          {mainNavItems.map(item => <NavItem key={item.id} {...item} {...navProps} />)}

          <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">Community</div>
          {communityNavItems.map(item => <NavItem key={item.id} {...item} {...navProps} />)}
          
          {(permissions.canGovernDao || permissions.canViewContracts) && (
            <>
              <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">Admin & DAO</div>
              {permissions.canGovernDao && <NavItem id="governance" icon={Vote} label="DAO Governance" {...navProps} />}
              {permissions.canViewContracts && <NavItem id="contracts" icon={FileSignature} label="Contracts & Agreements" {...navProps} />}
              {permissions.canAccessTreasury && <NavItem id="treasury" icon={Coins} label="Treasury" {...navProps} />}
            </>
          )}
          
          {(permissions.canAccessHr || permissions.canAccessAnalytics || permissions.canAccessSupport || permissions.canAccessLeads || permissions.canAccessSystemConfig) && (
            <>
              <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">System Admin</div>
              {permissions.canAccessHr && <NavItem id="hrd" icon={Briefcase} label="HRD & Team" {...navProps} />}
              {permissions.canAccessAnalytics && <NavItem id="analytics" icon={BarChart3} label="Analytics" {...navProps} />}
              {permissions.canAccessSupport && <NavItem id="admin_support" icon={LifeBuoy} label="Support Center" {...navProps} />}
              {permissions.canAccessLeads && <NavItem id="leads" icon={Bot} label="Leads & AI" {...navProps} />}
              {permissions.canAccessEmailTemplates && <NavItem id="admin_email_templates" icon={FileText} label="Email Templates" {...navProps} />}
              {permissions.canAccessSystemConfig && <NavItem id="system_docs" icon={GitMerge} label="Architecture & ERD" {...navProps} />}
            </>  
          )}

          <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">System</div>
          <NavItem id="sitemap" icon={Network} label="Site Map" {...navProps} />
          <NavItem id="whitepaper" icon={FileText} label="Whitepaper & Docs" {...navProps} />
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-kala-800 bg-kala-900">
           <button 
             onClick={() => setIsConfigModalOpen(true)}
             className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-white transition-colors w-full"
           >
              <Settings className="w-5 h-5" /> Settings
           </button>
           <button 
             onClick={onLogout}
             className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors w-full mt-1"
           >
              <LogOut className="w-5 h-5" /> Disconnect
           </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen relative bg-kala-900">
         {isDemoMode && (
            <div className="bg-gradient-to-r from-yellow-600/90 to-orange-600/90 text-white text-xs font-bold text-center py-1.5 flex items-center justify-center gap-2 sticky top-0 z-30 backdrop-blur">
               <AlertTriangle className="w-3 h-3 text-white" />
               DEMO MODE ACTIVE: Using sample data. Actions will not persist to mainnet.
            </div>
         )}
         
         <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
           {children}
         </div>
      </main>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <SystemConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        isDemoAvailable={demoModeAvailable}
        onToggleDemoAvailability={handleToggleDemoAvailability}
        onPurge={handlePurge}
        isActionAllowed={isActionAllowed}
        currentUserRole={currentUser?.role}
      />
    </div>
  );
};

export default Layout;
