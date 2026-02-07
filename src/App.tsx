
import React, { useState, useEffect, Suspense, useTransition } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Announcements from './components/Announcements';
import ChatOverlay from './components/ChatOverlay';
import WalletHistory from './components/WalletHistory';
import SearchResults from './components/SearchResults';
import Sitemap from './components/Sitemap';
import SystemDiagrams from './components/SystemDiagrams';
import WhitePaper from './components/WhitePaper';
import TokenExchange from './components/TokenExchange';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { DataProvider, useData } from './contexts/DataContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserRole, ModerationCase, ArtistProfile as IArtistProfile, Lead, Artist, RosterMember } from './types';
import { Wallet, Bell, Search, LogOut, Lock, Loader2, UploadCloud, MessageSquare, CreditCard, CheckCircle, ShieldAlert, AlertTriangle, X, RefreshCw, ArrowLeft } from 'lucide-react';
import { MOCK_LEADERBOARD, MOCK_ARTIST_PROFILE, MOCK_ROSTER, MOCK_USERS_BY_ROLE, MOCK_MODERATION_CASES } from './mockData';
import Dashboard from './components/Dashboard';

// Lazy Loaded Components
const BookingHub = React.lazy(() => import('./components/BookingHub'));
const DaoGovernance = React.lazy(() => import('./components/DaoGovernance'));
const Marketplace = React.lazy(() => import('./components/Marketplace'));
const ServicesHub = React.lazy(() => import('./components/ServicesHub'));
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));
const ArtistProfile = React.lazy(() => import('./components/ArtistProfile'));
const Roster = React.lazy(() => import('./components/Roster'));
const ArtistRegistration = React.lazy(() => import('./components/ArtistRegistration'));
const AdminLeads = React.lazy(() => import('./components/AdminLeads'));
const LeadsAndAi = React.lazy(() => import('./components/LeadsAndAi'));
const AdminEmailTemplates = React.lazy(() => import('./components/AdminEmailTemplates'));
const AdminSupport = React.lazy(() => import('./components/AdminSupport'));
const TreasuryDashboard = React.lazy(() => import('./components/TreasuryDashboard'));
const HRDashboard = React.lazy(() => import('./components/HRDashboard'));
const AdminContracts = React.lazy(() => import('./components/AdminContracts'));
const Forum = React.lazy(() => import('./components/Forum'));
const CreativeStudio = React.lazy(() => import('./components/CreativeStudio'));
const MembershipPlans = React.lazy(() => import('./components/MembershipPlans'));
const MyCircle = React.lazy(() => import('./components/MyCircle'));

const PageLoader = () => (
  <div className="h-[60vh] w-full flex flex-col items-center justify-center text-kala-400">
    <div className="relative">
       <div className="w-16 h-16 border-4 border-kala-800 border-t-kala-secondary rounded-full animate-spin"></div>
       <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-kala-secondary rounded-full"></div>
       </div>
    </div>
    <p className="text-sm font-bold mt-6 tracking-widest uppercase animate-pulse">Loading Module...</p>
  </div>
);

const BlockedScreen: React.FC<{ onAppeal: (reason: string) => void }> = ({ onAppeal }) => {
  const [appealReason, setAppealReason] = useState('');
  const [hasAppealed, setHasAppealed] = useState(false);
  const { notify } = useToast();

  const handleSubmit = () => {
     if (!appealReason.trim()) return;
     onAppeal(appealReason);
     setHasAppealed(true);
     notify("Appeal submitted to moderation team.", "info");
  };

  return (
    <div className="min-h-screen bg-kala-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-900/20 p-8 rounded-full border-4 border-red-500 mb-8 animate-pulse">
         <ShieldAlert className="w-24 h-24 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Account Suspended</h1>
      <div className="max-w-xl mx-auto space-y-4 mb-8">
         <p className="text-red-200 text-lg">
            Your account has been automatically flagged and blocked for violating our <span className="font-bold">Zero Tolerance Policy</span> regarding illicit or foul content.
         </p>
         <p className="text-kala-400 text-sm">This block is immediate and applies to all portal features.</p>
      </div>
      {!hasAppealed ? (
         <div className="w-full max-w-md bg-kala-800 p-6 rounded-xl border border-kala-700">
            <h3 className="text-white font-bold mb-3 flex items-center justify-center gap-2">
               <AlertTriangle className="w-4 h-4 text-yellow-500" /> File Formal Appeal
            </h3>
            <textarea
               className="w-full bg-kala-900 border border-kala-600 rounded-lg p-3 text-white text-sm mb-4 outline-none focus:border-kala-secondary"
               rows={4}
               placeholder="Explain why this block was an error..."
               value={appealReason}
               onChange={(e) => setAppealReason(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={!appealReason} className="w-full px-8 py-3 bg-kala-700 hover:bg-kala-600 text-white font-bold rounded-xl border border-kala-500 transition-colors disabled:opacity-50">
               Submit Appeal to Admins
            </button>
         </div>
      ) : (
         <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl max-w-md">
            <div className="text-green-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
               <CheckCircle className="w-5 h-5" /> Appeal Submitted
            </div>
            <p className="text-green-200 text-sm">Your case ID is #BL-{Math.floor(Math.random() * 1000)}. Our moderation team will review your request within 48-72 hours.</p>
         </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState<RosterMember | null>(null);
  const [isAppLoggedIn, setIsAppLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<RosterMember | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [showWalletHistory, setShowWalletHistory] = useState(false);
  const [showTokenExchange, setShowTokenExchange] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<RosterMember | null>(null);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [moderationCases, setModerationCases] = useState<ModerationCase[]>(MOCK_MODERATION_CASES);
  const [leads, setLeads] = useState<Lead[]>([]);

  const { isConnected: isWalletConnected, connect: connectWallet, disconnect: disconnectWallet, walletAddress, balances } = useWallet();
  const { notify } = useToast();
  const { addUser, isDemoMode, findUserByEmail, findUserByWallet, updateUser, users } = useData();

  const navigate = (view: string) => {
    startTransition(() => {
      setCurrentView(view);
    });
  };

  const addLead = (artist: Artist): boolean => {
    let wasAdded = false;
    setLeads(prev => {
      if (prev.some(l => l.id === artist.id)) {
        wasAdded = false;
        return prev;
      }
      const newLead: Lead = { ...artist, status: 'New' };
      wasAdded = true;
      return [newLead, ...prev];
    });
    return wasAdded;
  };

  const handleBlockUser = () => {
     if (!currentUser) return;
     setIsUserBlocked(true);
     setShowChat(false);
     const newCase: ModerationCase = {
        id: `MOD-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        violationType: 'Automated Flag (Zero Tolerance)',
        contentSnippet: 'User content triggered global moderation filter.',
        status: 'Blocked',
        timestamp: new Date().toLocaleString()
     };
     setModerationCases(prev => [newCase, ...prev]);
     notify("Account suspended due to policy violation.", "error");
  };

  const handleAppeal = (reason: string) => {
     if (!currentUser) return;
     setModerationCases(prev => prev.map(c => (c.userId === currentUser.id && c.status === 'Blocked') ? { ...c, status: 'Appeal Pending', appealReason: reason } : c));
  };

  const handleAdminDecision = (caseId: string, decision: 'Unblock' | 'Reject') => {
     setModerationCases(prev => prev.map(c => {
        if (c.id === caseId) {
           const newStatus = decision === 'Unblock' ? 'Resolved - Unblocked' : 'Resolved - Ban Upheld';
           if (decision === 'Unblock' && c.userId === currentUser?.id) { setIsUserBlocked(false); }
           return { ...c, status: newStatus };
        }
        return c;
     }));
     notify(`Case ${caseId} updated: ${decision}`, "success");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) { navigate('search_results'); }
  };

  const handleOpenChat = (user: RosterMember) => {
    setChatRecipient(user);
    setShowChat(true);
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    try {
      const newAddress = await connectWallet();
      notify("Wallet connected successfully!", "success");
    } catch (error) {
      notify("Wallet connection failed or was cancelled.", "error");
    }
    setIsConnecting(false);
  };

  const handleLogin = async (role: UserRole, method: 'web2' | 'web3', credentials?: any) => {
    setIsLoggingIn(true);
    let foundUser: RosterMember | undefined;

    if (isDemoMode) {
       foundUser = users.find(u => u.role === role && u.isMock);
       if (method === 'web3' && !isWalletConnected) await connectWallet();
    } else {
       if (method === 'web3') {
         if (!isWalletConnected) await connectWallet();
         foundUser = users.find(u => u.walletAddress === walletAddress && !u.isMock);
       } else {
         foundUser = users.find(u => u.email === credentials.email && u.password === credentials.password && !u.isMock);
       }
    }

    if (!foundUser) {
      notify("Login failed. Invalid credentials or user not found.", "error");
      setIsLoggingIn(false);
      return;
    }
    
    // This ensures we have a clean user object without mock data bleeding through
    const targetUser: RosterMember = {
      id: foundUser.id,
      name: foundUser.name,
      role: foundUser.role,
      avatar: foundUser.avatar,
      location: foundUser.location,
      verified: foundUser.verified,
      onboardingComplete: foundUser.onboardingComplete,
      walletAddress: foundUser.walletAddress,
      assets: foundUser.assets,
      rating: foundUser.rating,
      subscriberOnly: foundUser.subscriberOnly,
    };

    startTransition(() => {
      setCurrentUser(targetUser);
      setSelectedProfile(targetUser);
      setIsAppLoggedIn(true);
      setIsUserBlocked(false);
      setCurrentView('dashboard');
    });

    if (targetUser.role === UserRole.ARTIST) { setIsProfileComplete(true); }
    notify(`Welcome back, ${targetUser.name}!`, "info");
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setIsAppLoggedIn(false);
    setCurrentUser(null);
    setSelectedProfile(null);
    disconnectWallet();
    navigate('home');
    setIsUserBlocked(false);
    notify("Logged out successfully.", "info");
  };

  const handleViewProfile = (id: string) => {
    const member = users.find(m => m.id === id);
    if (member) {
      setSelectedProfile(member);
      navigate('profile');
    }
  };

  const handleUpdateUserProfile = (updates: Partial<IArtistProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    updateUser(updatedUser as RosterMember);
    if (selectedProfile?.id === currentUser.id) { setSelectedProfile(updatedUser as RosterMember); }
    notify('Profile updated successfully', 'success');
  };
  
  const handleSignup = (profile: Omit<RosterMember, 'id'>) => {
     const newUser = addUser(profile);
     notify("Registration successful! Please log in.", "success");
     navigate('home');
  };

  const UserWidget = () => {
    if (!currentUser) return null;
    return (
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-8 gap-4">
         <div className="text-white">
            <h1 className="text-2xl font-bold">Welcome back, {currentUser.name}</h1>
            <p className="text-kala-400 text-sm">Role: {currentUser.role} &bull; {currentUser.location}</p>
         </div>
         <div className="flex items-center gap-4">
           <div className="relative hidden lg:block">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
             <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} placeholder="Search portal..." className="bg-kala-800 border border-kala-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-kala-secondary outline-none w-48 transition-all focus:w-64" />
           </div>
           {!isWalletConnected ? (
             <button onClick={handleWalletConnect} disabled={isConnecting || isLoggingIn} className="text-xs bg-kala-secondary text-kala-900 px-3 py-1.5 rounded font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2">
               {(isConnecting || isLoggingIn) ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Connect Wallet'}
             </button>
           ) : null}
           <button className="relative p-2 text-kala-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" /><span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
           </button>
           <div className="flex items-center gap-3 pl-4 border-l border-kala-700">
              <div className="text-right hidden sm:block">
                {isWalletConnected ? (
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-sm font-bold text-white text-right font-mono tracking-tighter">{walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}</div>
                      <div className="flex gap-2 justify-end">
                        <span className="text-xs text-kala-secondary font-mono">{balances.eth.toFixed(2)} ETH</span>
                        <span className="text-xs text-purple-400 font-mono">{balances.kala.toFixed(0)} KALA</span>
                      </div>
                    </div>
                    <button onClick={() => setShowTokenExchange(true)} className="p-2 bg-kala-800 hover:bg-kala-700 rounded-full border border-kala-600 text-kala-secondary transition-colors" title="Swap Tokens"><RefreshCw className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div onClick={() => handleViewProfile(currentUser.id)} className="w-10 h-10 rounded-full bg-gradient-to-br from-kala-secondary to-purple-600 p-0.5 cursor-pointer hover:scale-105 transition-transform ml-2" title="View My Profile">
                <img src={currentUser.avatar} alt="Me" className="w-full h-full rounded-full border-2 border-kala-900 object-cover" />
              </div>
              <button onClick={handleLogout} className="text-kala-500 hover:text-red-400 transition-colors ml-2" title="Log Out"><LogOut className="w-5 h-5" /></button>
           </div>
         </div>
      </div>
    );
  };

  const renderAppContent = () => {
    if (!isAppLoggedIn || !currentUser) {
      return <PageLoader />;
    }
    
    // --- Centralized Permission Logic ---
    const isLiveAdmin = currentUser.role === UserRole.SYSTEM_ADMIN_LIVE;
    const isDemoAdmin = currentUser.role === UserRole.ADMIN;
    const isDaoGovernor = currentUser.role === UserRole.DAO_GOVERNOR;
    const isDaoMember = currentUser.role === UserRole.DAO_MEMBER;

    const permissions = {
      // System Wide
      canAccessSystemConfig: isLiveAdmin,
      // DAO Governance
      canGovernDao: isLiveAdmin || isDemoAdmin || isDaoGovernor,
      canVetoProposals: isLiveAdmin,
      canRatifyProposals: isLiveAdmin || isDemoAdmin || isDaoGovernor,
      // Contracts & Agreements
      canManageAllContracts: isLiveAdmin || isDemoAdmin || isDaoGovernor,
      canOnlyManageOwnContracts: isDaoMember,
      // Treasury
      canAccessTreasury: isLiveAdmin || isDemoAdmin || isDaoGovernor,
      // HR
      canAccessHr: isLiveAdmin || isDemoAdmin,
    };

    const AccessDenied = () => (
      <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p>Your current role does not have permission to view this module.</p>
      </div>
    );

    return (
      <div className={isPending ? "opacity-70 transition-opacity pointer-events-none" : "opacity-100 transition-opacity"}>
        <Suspense fallback={<PageLoader />}>
          {(() => {
            switch (currentView) {
              // --- Open Access Pages ---
              case 'search_results': return <SearchResults query={searchQuery} onNavigate={navigate} />;
              case 'sitemap': return <Sitemap onNavigate={navigate} />;
              case 'whitepaper': return <WhitePaper />;
              case 'register_artist': return <ArtistRegistration onComplete={handleSignup} onBlockUser={handleBlockUser} />;
              case 'booking': return <BookingHub onBlockUser={handleBlockUser} onOpenExchange={() => setShowTokenExchange(true)} />;
              case 'marketplace': return <Marketplace onBlockUser={handleBlockUser} onChat={(seller) => handleOpenChat(seller as RosterMember)} />;
              case 'services': return <ServicesHub userRole={currentUser.role} onNavigateToProfile={() => handleViewProfile(currentUser.id)} onBlockUser={handleBlockUser} />;
              case 'roster': return <Roster onNavigate={navigate} onViewProfile={handleViewProfile} />;
              case 'forum': return <Forum onBlockUser={handleBlockUser} />;
              case 'studio': return <CreativeStudio onBlockUser={handleBlockUser} />;
              case 'membership': return <MembershipPlans currentUser={currentUser} />;
              case 'my_circle': return <MyCircle currentUser={currentUser} />;
              case 'leads_and_ai': return <LeadsAndAi leads={leads} addLead={addLead} />;
              case 'profile': return selectedProfile && <ArtistProfile artist={selectedProfile} onChat={() => handleOpenChat(selectedProfile)} onBook={() => navigate('booking')} isOwnProfile={selectedProfile.id === currentUser.id} isBlocked={isUserBlocked} onUpdateProfile={handleUpdateUserProfile} />;
              case 'announcements_internal': return <Announcements onBack={() => navigate('dashboard')} />;
              
              // --- Permission Gated Pages ---
              case 'governance': 
                return permissions.canGovernDao || permissions.canOnlyManageOwnContracts ? 
                  <DaoGovernance 
                    permissions={permissions} 
                    onOpenExchange={() => setShowTokenExchange(true)} 
                    currentUser={currentUser}
                  /> : <AccessDenied />;

              case 'contracts': 
                return permissions.canManageAllContracts || permissions.canOnlyManageOwnContracts ? 
                  <AdminContracts 
                    onBlockUser={handleBlockUser} 
                    onChat={(name, avatar) => handleOpenChat({ id: 'chat-user', name, avatar, role: UserRole.CLIENT } as RosterMember)} 
                    permissions={permissions} 
                    currentUser={currentUser}
                  /> : <AccessDenied />;

              case 'treasury': 
                return permissions.canAccessTreasury ? <TreasuryDashboard /> : <AccessDenied />;

              case 'hrd': 
                return permissions.canAccessHr ? <HRDashboard /> : <AccessDenied />;
              
              case 'system_docs': 
                return permissions.canAccessSystemConfig ? <SystemDiagrams /> : <AccessDenied />;
                
              case 'admin_email_templates': 
                return isLiveAdmin || isDemoAdmin ? <AdminEmailTemplates isDemoMode={isDemoAdmin} canEdit={isLiveAdmin} /> : <AccessDenied />;

              case 'analytics': 
                return isLiveAdmin || isDemoAdmin ? <AnalyticsDashboard /> : <AccessDenied />;

              case 'admin_support': 
                return isLiveAdmin || isDemoAdmin ? <AdminSupport moderationCases={moderationCases} onDecision={handleAdminDecision} /> : <AccessDenied />;

              case 'leads': 
                return isLiveAdmin || isDemoAdmin ? <AdminLeads leads={leads} addLead={addLead} /> : <LeadsAndAi leads={leads} addLead={addLead} />;

              case 'dashboard':
              default:
                return <Dashboard user={currentUser} onNavigate={navigate} />;
            }
          })()}
        </Suspense>
      </div>
    );
  };
  
  if (isUserBlocked) { return <BlockedScreen onAppeal={handleAppeal} />; }
  if (!isAppLoggedIn) {
    if (currentView === 'announcements_public') { return <Announcements onBack={() => navigate('home')} />; }
    if (currentView === 'register_new_user') {
       return (
         <div className="min-h-screen bg-kala-900 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
               <button onClick={() => navigate('home')} className="flex items-center gap-2 text-kala-400 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
               <Suspense fallback={<PageLoader />}>
                  <ArtistRegistration onComplete={handleSignup} onBlockUser={handleBlockUser} />
               </Suspense>
            </div>
         </div>
       );
    }
    return <Home onLogin={handleLogin} onViewNews={() => navigate('announcements_public')} onJoin={() => navigate('register_new_user')} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={navigate} 
      onLogout={handleLogout}
      currentUser={currentUser}
    >
       {showChat && chatRecipient && (
         <ChatOverlay recipientName={chatRecipient.name} recipientAvatar={chatRecipient.avatar} onClose={() => setShowChat(false)} onNavigateToBooking={() => { setShowChat(false); navigate('booking'); }} onBlockUser={handleBlockUser} />
       )}
       {showTokenExchange && <TokenExchange onClose={() => setShowTokenExchange(false)} />}
       {currentView !== 'dashboard' && <UserWidget />}
       {renderAppContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <WalletProvider>
          <DataProvider>
              <AppContent />
          </DataProvider>
        </WalletProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
