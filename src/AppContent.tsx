
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
import { useWallet } from './contexts/WalletContext';
import { useToast } from './contexts/ToastContext';
import { useData } from './contexts/DataContext';
import { useAuth } from './contexts/AuthContext';
import PageLoader from './components/PageLoader';
import BlockedScreen from './components/BlockedScreen';
import { UserRole, ModerationCase, ArtistProfile as IArtistProfile, Lead, Artist } from './types';
import { Bell, Search, LogOut, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { MOCK_ARTIST_PROFILE, MOCK_ROSTER } from './mockData';
import Dashboard from './components/Dashboard';

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

const AppContent: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [currentView, setCurrentView] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(MOCK_ARTIST_PROFILE);
  const [showTokenExchange, setShowTokenExchange] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(MOCK_ARTIST_PROFILE);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [moderationCases, setModerationCases] = useState<ModerationCase[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  const { isConnected: isWalletConnected, connect: connectWallet, disconnect: disconnectWallet, walletAddress, balances } = useWallet();
  const { notify } = useToast();
  const { addUser, isDemoMode, updateUser } = useData();
  const { currentUser, loading: isAuthLoading, login, logout, signup } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setSelectedProfile(currentUser);
      setCurrentView('dashboard');
    } else {
      setCurrentView('home');
    }
  }, [currentUser]);

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

  const handleOpenChat = () => {
    setChatRecipient(selectedProfile);
    setShowChat(true);
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      notify("Wallet connected successfully!", "success");
    } catch (error) {
      notify("Wallet connection failed or was cancelled.", "error");
    }
    setIsConnecting(false);
  };

  const handleViewProfile = (id: string) => {
    const member = MOCK_ROSTER.find(m => m.id === id);
    if (member) {
      const profile = {
         ...MOCK_ARTIST_PROFILE,
         id: member.id,
         name: member.name,
         role: member.role,
         avatar: member.avatar,
         location: member.location,
         verified: member.verified,
         walletAddress: member.walletAddress,
         bio: `${member.name} is a leading ${member.role} in the KalaKrut ecosystem...`,
         coverImage: `https://picsum.photos/seed/${member.id}/1200/400`
      };
      setSelectedProfile(profile as IArtistProfile);
      navigate('profile');
    }
  };

  const handleUpdateUserProfile = (updates: Partial<IArtistProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    updateUser({
      id: updatedUser.id,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      walletAddress: updatedUser.walletAddress,
      subscriberOnly: { ...currentUser.subscriberOnly, ...updatedUser.subscriberOnly },
    });
    if (selectedProfile.id === currentUser.id) { setSelectedProfile(updatedUser); }
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
             <button onClick={handleWalletConnect} disabled={isConnecting || isAuthLoading} className="text-xs bg-kala-secondary text-kala-900 px-3 py-1.5 rounded font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2">
               {(isConnecting || isAuthLoading) ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Connect Wallet'}
             </button>
           ) : null}
           <button className="relative p-2 text-kala-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" /><span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
           </button>
           <div className="flex items-center gap-3 pl-4 border-l border-kala-700">
              <div className="text-right hidden sm:block">
                {isWalletConnected && walletAddress && balances ? (
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-sm font-bold text-white text-right font-mono tracking-tighter">{walletAddress}</div>
                      <div className="flex gap-2 justify-end">
                        <span className="text-xs text-kala-secondary font-mono">{balances.eth.toFixed(2)} ETH</span>
                        <span className="text-xs text-purple-400 font-mono">{balances.kala.toFixed(0)} KALA</span>
                      </div>
                    </div>
                    <button onClick={() => setShowTokenExchange(true)} className="p-2 bg-kala-800 hover:bg-kala-700 rounded-full border border-kala-600 text-kala-secondary transition-colors" title="Swap Tokens"><RefreshCw className="w-4 h-4" /></button>
                  </div>
                ) : null}
              </div>
              <div onClick={() => { if(currentUser) { setSelectedProfile(currentUser); navigate('profile'); } }} className="w-10 h-10 rounded-full bg-gradient-to-br from-kala-secondary to-purple-600 p-0.5 cursor-pointer hover:scale-105 transition-transform ml-2" title="View My Profile">
                <img src={currentUser.avatar} alt="Me" className="w-full h-full rounded-full border-2 border-kala-900 object-cover" />
              </div>
              <button onClick={logout} className="text-kala-500 hover:text-red-400 transition-colors ml-2" title="Log Out"><LogOut className="w-5 h-5" /></button>
           </div>
         </div>
      </div>
    );
  };

  const renderAppContent = () => {
    return (
      <div className={isPending ? "opacity-70 transition-opacity pointer-events-none" : "opacity-100 transition-opacity"}>
        <Suspense fallback={<PageLoader />}>
          {(() => {
            switch (currentView) {
              case 'search_results': return <SearchResults query={searchQuery} onNavigate={navigate} />;
              case 'sitemap': return <Sitemap onNavigate={navigate} />;
              case 'system_docs': return currentUser?.role === UserRole.ADMIN ? <SystemDiagrams /> : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied</div>;
              case 'whitepaper': return <WhitePaper />;
              case 'register_artist': return <ArtistRegistration onComplete={() => { navigate('dashboard'); }} onBlockUser={handleBlockUser} />;
              case 'booking': return <BookingHub onBlockUser={handleBlockUser} onOpenExchange={() => setShowTokenExchange(true)} />;
              case 'governance': return currentUser?.role ? <DaoGovernance currentUserRole={currentUser.role} onOpenExchange={() => setShowTokenExchange(true)} /> : <div>Access Denied</div>;
              case 'marketplace': return <Marketplace onBlockUser={handleBlockUser} onChat={(seller) => { setChatRecipient({ ...MOCK_ARTIST_PROFILE, name: seller.name, avatar: seller.avatar }); setShowChat(true); }} />;
              case 'services': return currentUser?.role ? <ServicesHub userRole={currentUser.role} onNavigateToProfile={() => { if(currentUser) setSelectedProfile(currentUser); navigate('profile'); }} onBlockUser={handleBlockUser} /> : <div>Access Denied</div>;
              case 'roster': return <Roster onNavigate={navigate} onViewProfile={handleViewProfile} />;
              case 'forum': return <Forum onBlockUser={handleBlockUser} />;
              case 'studio': return <CreativeStudio onBlockUser={handleBlockUser} />;
              case 'admin_email_templates': return currentUser?.role === UserRole.ADMIN ? <AdminEmailTemplates isDemoMode={isDemoMode} /> : <div>Access Denied</div>;
              case 'membership': return currentUser ? <MembershipPlans currentUser={currentUser} /> : <PageLoader />;
              case 'my_circle': return currentUser ? <MyCircle currentUser={currentUser} /> : <PageLoader />;
              case 'leads': return currentUser?.role === UserRole.ADMIN ? <AdminLeads leads={leads} addLead={addLead} /> : <LeadsAndAi leads={leads} addLead={addLead} />;
              case 'leads_and_ai': return <LeadsAndAi leads={leads} addLead={addLead} />;
              case 'admin_support': return currentUser?.role === UserRole.ADMIN ? <AdminSupport moderationCases={moderationCases} onDecision={handleAdminDecision} /> : <div>Access Denied</div>;
              case 'contracts': return (currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.DAO_GOVERNOR) ? <AdminContracts onBlockUser={handleBlockUser} onChat={(name, avatar) => { setChatRecipient({ ...MOCK_ARTIST_PROFILE, name, avatar }); setShowChat(true); }} /> : <div>Access Denied</div>;
              case 'treasury': return (currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.DAO_GOVERNOR) ? <TreasuryDashboard /> : <div>Access Denied</div>;
              case 'hrd': return (currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.DAO_GOVERNOR) ? <HRDashboard /> : <div>Access Denied</div>;
              case 'profile': return <ArtistProfile artist={selectedProfile} onChat={handleOpenChat} onBook={() => navigate('booking')} isOwnProfile={selectedProfile.id === currentUser?.id} isBlocked={isUserBlocked} onUpdateProfile={handleUpdateUserProfile} />;
              case 'analytics': return currentUser?.role === UserRole.ADMIN ? <AnalyticsDashboard /> : <div>Access Denied</div>;
              case 'announcements_internal': return <Announcements onBack={() => navigate('dashboard')} />;
              case 'dashboard':
              default:
                return currentUser ? <Dashboard user={currentUser} onNavigate={navigate} /> : <PageLoader />;
            }
          })()}
        </Suspense>
      </div>
    );
  };
  
  if (isAuthLoading) return <PageLoader />;
  if (isUserBlocked) return <BlockedScreen onAppeal={handleAppeal} />;
  
  if (!currentUser) {
    if (currentView === 'announcements_public') { return <Announcements onBack={() => navigate('home')} />; }
    if (currentView === 'register_new_user') {
       return (
         <div className="min-h-screen bg-kala-900 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
               <button onClick={() => navigate('home')} className="flex items-center gap-2 text-kala-400 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
               <Suspense fallback={<PageLoader />}>
                  <ArtistRegistration onComplete={(profile) => { signup(profile); }} onBlockUser={handleBlockUser} />
               </Suspense>
            </div>
         </div>
       );
    }
    return <Home onLogin={login} onViewNews={() => navigate('announcements_public')} onJoin={() => navigate('register_new_user')} />;
  }

  return (
    <Layout currentView={currentView} userRole={currentUser.role} onNavigate={navigate}>
       {showChat && (
         <ChatOverlay recipientName={chatRecipient.name} recipientAvatar={chatRecipient.avatar} onClose={() => setShowChat(false)} onNavigateToBooking={() => { setShowChat(false); navigate('booking'); }} onBlockUser={handleBlockUser} />
       )}
       {showTokenExchange && <TokenExchange onClose={() => setShowTokenExchange(false)} />}
       {currentView !== 'dashboard' && <UserWidget />}
       {renderAppContent()}
    </Layout>
  );
};

export default AppContent;
