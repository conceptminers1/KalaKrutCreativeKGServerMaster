
import React, { useState, useTransition } from 'react';
import { UserRole } from '../types';
import { useData } from '../contexts/DataContext';
import { 
  ArrowRight, Music, Globe2, ShieldCheck, Users, Coins, Building2, Newspaper, Mail, Wallet, Lock, X, Loader2,
  ShoppingBag, Activity, TrendingUp, Instagram, Facebook, Eye, MapPin, PlayCircle, Radio, KeyRound, Info
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface HomeProps {
  onLogin: (role: UserRole, method: 'web2' | 'web3', credentials?: any) => void;
  onViewNews: () => void;
  onJoin: () => void;
}

const KalaKrutLogo = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logo_grad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Abstract Art Circle */}
    <circle cx="100" cy="100" r="90" stroke="url(#logo_grad)" strokeWidth="8" fill="none" opacity="0.8" />
    <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="4 4" />
    
    {/* Central Swirls representing Creativity */}
    <path d="M60 100 Q 100 20, 140 100 T 60 100" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" filter="url(#glow)" />
    <path d="M60 100 Q 100 180, 140 100" stroke="url(#logo_grad)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
    
    {/* Core Dot */}
    <circle cx="100" cy="100" r="12" fill="white" />
    <circle cx="100" cy="100" r="6" fill="#0f172a" />
    
    {/* Orbiting Satellite (Tech/Web3) */}
    <circle cx="100" cy="20" r="6" fill="#06b6d4">
      <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="10s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const SubstackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);

const LinktreeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M13.7364 5.85294V0H10.2624V5.85294L5.27521 2.97351L3.53857 5.98144L9.39343 9.36203L3.53857 12.7426L5.27521 15.7505L10.2624 12.8711V24H13.7364V12.8711L18.7237 15.7505L20.4603 12.7426L14.6054 9.36203L20.4603 5.98144L18.7237 2.97351L13.7364 5.85294Z" />
  </svg>
);

const Home: React.FC<HomeProps> = ({ onLogin, onViewNews, onJoin }) => {
  const { toast } = useToast();
  const { users, stats, setDemoMode, isDemoMode, demoModeAvailable } = useData();
  const [isPending, startTransition] = useTransition();
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMembersPreview, setShowMembersPreview] = useState(false);
  
  // Login Form State for Live Mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Local state for the modal toggle before confirming login.
  const [loginMode, setLoginMode] = useState<'demo' | 'live'>(
    demoModeAvailable && isDemoMode ? 'demo' : 'live'
  );

  const previewMembers = users.slice(0, 5);

// Correction for the handleLoginClick function
  const handleLoginClick = (method: 'web2' | 'web3') => {
    if (selectedRoleForLogin) {
      if (loginMode === 'live' && method === 'web3') {
        toast("Wallet login is disabled for Live Mode for security reasons.", "error");
        return;
      }
      if (loginMode === 'live' && method === 'web2' && (!email || !password)) {
         toast("Please enter email and password for Live access.", "warning");
         return;
      }
...


      // Using startTransition to prevent suspension errors during view swaps
      startTransition(() => {
        setDemoMode(loginMode);
        setTimeout(() => {
          onLogin(selectedRoleForLogin, method, { email, password });
          setIsLoading(false); 
        }, 500);
      });
    }
  };


  const LoginCard = ({ role, icon: Icon, desc }: { role: UserRole, icon: any, desc: string }) => (
    <button 
      onClick={() => setSelectedRoleForLogin(role)}
      className="bg-kala-800/40 backdrop-blur border border-kala-700 p-6 rounded-xl hover:bg-kala-800 hover:border-kala-secondary transition-all text-left group h-full flex flex-col"
    >
      <div className="w-12 h-12 rounded-lg bg-kala-700 flex items-center justify-center text-kala-300 group-hover:bg-kala-secondary group-hover:text-kala-900 mb-4 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{role}</h3>
      <p className="text-sm text-kala-400 leading-relaxed flex-grow">{desc}</p>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-kala-500 group-hover:text-white uppercase tracking-wider">
        Login / Register <ArrowRight className="w-3 h-3" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-kala-900 text-slate-200">
      
      {/* Navbar */}
      <nav className="border-b border-kala-800 bg-kala-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-white">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kala-secondary to-purple-600 flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span>Kala<span className="text-kala-secondary">Krut</span></span>
          </div>
          <div className="flex gap-4">
             <button onClick={onViewNews} className="text-sm font-medium text-kala-300 hover:text-white flex items-center gap-2 px-4 py-2 rounded hover:bg-kala-800 transition-colors">
               <Newspaper className="w-4 h-4" /> News & Announcements
             </button>
             <button className="bg-white text-kala-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
               Get App
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-kala-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-16 text-center">
           
           <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
             The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-kala-secondary to-purple-500">Creative Business</span>
           </h1>
           <p className="text-xl text-kala-300 mb-10 max-w-2xl mx-auto">
             A hybrid social enterprise and gamified community portal. We connect artists, venues, and sponsors through Web3 governance and sustainable business workflows.
           </p>
           
           <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-kala-400 mb-8">
              <span className="flex items-center gap-2 bg-kala-800 px-3 py-1 rounded-full border border-kala-700">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Secure Contracts
              </span>
              <span className="flex items-center gap-2 bg-kala-800 px-3 py-1 rounded-full border border-kala-700">
                <Globe2 className="w-4 h-4 text-blue-400" /> Global Roster
              </span>
              <span className="flex items-center gap-2 bg-kala-800 px-3 py-1 rounded-full border border-kala-700">
                <Coins className="w-4 h-4 text-yellow-400" /> Crypto & Fiat
              </span>
           </div>

           {/* Modes Info */}
           <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-3 bg-kala-800/60 border border-kala-700 px-5 py-3 rounded-xl backdrop-blur-sm">
                 <div className="p-2 bg-kala-secondary/20 rounded-full text-kala-secondary">
                    <PlayCircle className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                    <div className="text-[10px] text-kala-400 font-bold uppercase tracking-wider">Demo Mode</div>
                    <div className="text-xs text-white">Explore working examples</div>
                 </div>
              </div>
              <div className="flex items-center gap-3 bg-kala-800/60 border border-kala-700 px-5 py-3 rounded-xl backdrop-blur-sm">
                 <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                    <Radio className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                    <div className="text-[10px] text-kala-400 font-bold uppercase tracking-wider">Live Mode</div>
                    <div className="text-xs text-white">Real activities</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* About / Mission */}
      <div className="bg-kala-800/30 border-y border-kala-800 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Empowering the Creative Economy</h2>
            <div className="space-y-4 text-kala-300 leading-relaxed">
              <p>
                KalaKrut Creative is built for the worldwide community of artists, organizers, grantmakers, and revellers. We facilitate ease of business by bringing fragmented workflows—booking, ticketing, IP management, and auctions—into a single, secure portal.
              </p>
              <p>
                Whether you are selling physical art, renting instruments, or booking a world tour, our platform handles the complexity so you can focus on the art. With separate, tailored dashboards for every role, we ensure that Admins can monitor health while DAO members govern the future.
              </p>
            </div>
            <button onClick={() => startTransition(() => onViewNews())} className="mt-8 flex items-center gap-2 text-kala-secondary font-bold hover:gap-3 transition-all">
               Read Community Stories <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-br from-kala-secondary/20 to-purple-600/20 blur-2xl rounded-full"></div>
             <img 
               src="https://picsum.photos/seed/studio/600/400" 
               alt="Studio" 
               className="relative rounded-2xl border border-kala-700 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
             />
          </div>
        </div>
      </div>

      {/* Community Barometer */}
      <div className="py-20 bg-kala-900 border-b border-kala-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Activity className="text-kala-secondary w-8 h-8" /> Community Barometer
            </h2>
            <p className="text-kala-400">Live ecosystem metrics indicating the health and growth of the collective.</p>
            
            {/* Join Instructions */}
            <div className="mt-4 inline-flex items-center gap-2 bg-kala-800/50 border border-kala-700 px-4 py-2 rounded-full text-sm text-kala-300 shadow-lg animate-in fade-in zoom-in">
               <Info className="w-4 h-4 text-blue-400" />
               <span>To Join: Click the <span className="text-white font-bold bg-blue-500/20 px-1 rounded border border-blue-500/30">Preview</span> button on the "Active Members" chart below.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => setShowMembersPreview(true)}
              className="bg-kala-800/50 rounded-2xl p-6 border border-kala-700 hover:border-blue-500 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full flex items-center gap-1 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-colors shadow-sm">
                  <Eye className="w-3 h-3" /> Preview
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight relative z-10">{stats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-kala-400 uppercase font-bold tracking-wider mb-4 relative z-10">Active Members</div>
              <div className="w-full bg-kala-900 h-1.5 rounded-full overflow-hidden relative z-10">
                <div className="bg-blue-500 h-full rounded-full w-[15%]"></div>
              </div>
            </div>

            <div className="bg-kala-800/50 rounded-2xl p-6 border border-kala-700 hover:border-purple-500/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Music className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +100%
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight">{stats.activeGigs.toLocaleString()}</div>
              <div className="text-sm text-kala-400 uppercase font-bold tracking-wider mb-4">Gigs Completed</div>
              <div className="w-full bg-kala-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full w-[20%]"></div>
              </div>
            </div>

            <div className="bg-kala-800/50 rounded-2xl p-6 border border-kala-700 hover:border-green-500/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +50%
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight">12</div>
              <div className="text-sm text-kala-400 uppercase font-bold tracking-wider mb-4">Market Conversions</div>
              <div className="w-full bg-kala-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full w-[10%]"></div>
              </div>
            </div>

            <div className="bg-kala-800/50 rounded-2xl p-6 border border-kala-700 hover:border-yellow-500/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +100%
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight">{stats.totalTransactions}</div>
              <div className="text-sm text-kala-400 uppercase font-bold tracking-wider mb-4">Total Transactions</div>
              <div className="w-full bg-kala-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full rounded-full w-[8%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
      {/* Login Portal Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Select Your Portal</h2>
          <p className="text-kala-400 mt-2">Log in to access your specialized dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoginCard role={UserRole.ARTIST} icon={Music} desc="Manage your EPK, accept bookings, and sell merch." />
          <LoginCard role={UserRole.VENUE} icon={Building2} desc="Scout talent and manage event calendars." />
          <LoginCard role={UserRole.SERVICE_PROVIDER} icon={Users} desc="Offer consultancy or production services." />
          <LoginCard role={UserRole.ORGANIZER} icon={Building2} desc="Plan festivals and manage lineups." />
          <LoginCard role={UserRole.SPONSOR} icon={Coins} desc="Fund events and support artists." />
          <LoginCard role={UserRole.REVELLER} icon={Users} desc="Buy tickets and follow your favorite artists." />
          <LoginCard role={UserRole.ADMIN} icon={ShieldCheck} desc="Platform oversight and analytics." />
          <LoginCard role={UserRole.DAO_GOVERNOR} icon={ShieldCheck} desc="Govern the DAO and its Business." />
          <LoginCard role={UserRole.DAO_MEMBER} icon={Globe2} desc="Create proposals and Vote on proposals" />  
        </div>
      </div>
       {/* Footer */}
       <footer className="bg-kala-900 border-t border-kala-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-kala-500 text-sm">
             &copy; 2024 KalaKrut Creative. All rights reserved.
           </div>

           <div className="flex gap-4">
              <a href="https://x.com/KalaKrut" target="_blank" rel="noreferrer" className="p-2 bg-kala-800 rounded-full text-kala-400 hover:text-white hover:bg-kala-700 transition-colors">
                <XIcon className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/kalakrut?igsh=MWcyc2htOGpwN3owYw==" target="_blank" rel="noreferrer" className="p-2 bg-kala-800 rounded-full text-kala-400 hover:text-white hover:bg-kala-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/kalakrutagn?mibextid=ZbWKwL" target="_blank" rel="noreferrer" className="p-2 bg-kala-800 rounded-full text-kala-400 hover:text-white hover:bg-kala-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://kalakrut.substack.com/" target="_blank" rel="noreferrer" className="p-2 bg-kala-800 rounded-full text-kala-400 hover:text-white hover:bg-kala-700 transition-colors">
                <SubstackIcon className="w-4 h-4" />
              </a>
              <a href="https://discord.com/invite/Nk5e4HCX" target="_blank" rel="noreferrer" className="p-2 bg-kala-800 rounded-full text-kala-400 hover:text-white hover:bg-kala-700 transition-colors">
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a href="https://linktr.ee/KalaKrutPlatform" target="_blank" rel="noreferrer" className="p-2 bg-kala-800 rounded-full text-kala-400 hover:text-white hover:bg-kala-700 transition-colors">
                <LinktreeIcon className="w-4 h-4" />
              </a>
           </div>

           <div className="flex gap-6 text-sm font-bold text-kala-400">
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">DAO Constitution</a>
           </div>
        </div>
      </footer>
      
      {/* Dual Login Modal */}
      {selectedRoleForLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
           <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => !isLoading && setSelectedRoleForLogin(null)}
                className="absolute top-4 right-4 text-kala-500 hover:text-white disabled:opacity-50"
                disabled={isLoading}
              >
                 <X className="w-6 h-6" />
              </button>

              <div className="p-8 text-center">
                 <h2 className="text-2xl font-bold text-white mb-2">Login as {selectedRoleForLogin}</h2>
                 <p className="text-kala-400">Choose your authentication method to enter KalaKrut.</p>
                 
                 {/* MODE TOGGLE */}
                 {demoModeAvailable && (
                    <div className="flex justify-center mt-6">
                        <div className="bg-kala-800 p-1 rounded-lg inline-flex relative">
                            <button 
                              onClick={() => { setLoginMode('demo'); setEmail(''); setPassword(''); }}
                              className={`relative z-10 px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                                 loginMode === 'demo' ? 'bg-kala-secondary text-kala-900 shadow' : 'text-kala-400 hover:text-white'
                              }`}
                            >
                               <PlayCircle className="w-3 h-3" /> Demo Mode
                            </button>
                            <button 
                              onClick={() => { setLoginMode('live'); setEmail(''); setPassword(''); }}
                              className={`relative z-10 px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                                 loginMode === 'live' ? 'bg-green-500 text-white shadow' : 'text-kala-400 hover:text-white'
                              }`}
                            >
                               <Radio className="w-3 h-3" /> Live Mode
                            </button>
                        </div>
                    </div>
                 )}
                 <p className="text-[10px] text-kala-500 mt-2">
                    {demoModeAvailable 
                      ? (loginMode === 'demo' ? "Pre-loaded with sample data for evaluation." : "Production environment. Real transactions only.")
                      : "Production Environment (Demo Mode Disabled by Admin)"
                    }
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border-t border-kala-800 bg-kala-800/20">
                 {/* Web3 Login */}
                 <div className="flex flex-col items-center p-6 bg-kala-800/50 rounded-xl border border-kala-700 hover:border-purple-500 transition-colors group">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                       <Wallet className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Web3 Wallet</h3>
                    <p className="text-xs text-kala-400 text-center mb-6 h-10">
                       Connect MetaMask, Phantom, or WalletConnect. Best for DAO Members and NFT Trading.
                    </p>
                    <button 
                      onClick={() => handleLoginClick('web3')}
                      disabled={isLoading}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                       {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Wallet'}
                    </button>
                 </div>

                 {/* Web2 Login */}
                 <div className="flex flex-col items-center p-6 bg-kala-800/50 rounded-xl border border-kala-700 hover:border-kala-secondary transition-colors group">
                    <div className="w-16 h-16 bg-kala-secondary/10 rounded-full flex items-center justify-center text-kala-secondary mb-4 group-hover:bg-kala-secondary group-hover:text-kala-900 transition-colors">
                       <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Email & Password</h3>
                    <p className="text-xs text-kala-400 text-center mb-6 h-10">
                       {loginMode === 'demo' ? "Login as Example User: " + selectedRoleForLogin : "Standard login for real user access."}
                    </p>
                    
                    {loginMode === 'live' ? (
                       <div className="w-full space-y-3">
                          <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-kala-900 border border-kala-700 rounded px-3 py-2 text-sm text-white focus:border-kala-secondary outline-none" 
                          />
                          <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-kala-900 border border-kala-700 rounded px-3 py-2 text-sm text-white focus:border-kala-secondary outline-none" 
                          />
                          {/* Live Mode Admin Hint - visible only if Admin role selected */}
                          {selectedRoleForLogin === UserRole.ADMIN && (
                             <div className="text-[9px] text-kala-500 bg-kala-900 p-2 rounded border border-kala-700 flex items-center gap-2">
                                <KeyRound className="w-3 h-3 text-kala-secondary" />
                                <span>Default: <b>admin@kalakrut.io</b> / <b>(any)</b></span>
                             </div>
                          )}
                          <button 
                            onClick={() => handleLoginClick('web2')}
                            disabled={isLoading}
                            className="w-full py-2 bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                             {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                          </button>
                       </div>
                    ) : (
                       /* Demo Mode Mock Button */
                       <div className="w-full space-y-3">
                          <div className="bg-kala-900/50 border border-kala-700 p-3 rounded text-center text-xs text-kala-400">
                             Simulated Environment Active
                          </div>
                          <button 
                            onClick={() => handleLoginClick('web2')}
                            disabled={isLoading}
                            className="w-full py-2 bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                             {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Enter as ${selectedRoleForLogin} (Demo)`}
                          </button>
                       </div>
                    )}
                 </div>
              </div>

              <div className="p-4 bg-kala-900 border-t border-kala-800 text-center text-xs text-kala-500">
                 By continuing, you agree to our Terms of Service. Both login methods provide secure access to your portal.
              </div>
           </div>
        </div>
      )}

            {/* Member Preview Modal */}
      {showMembersPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
           <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
              <div className="p-4 border-b border-kala-800 flex justify-between items-center bg-kala-800/50">
                 <h3 className="text-white font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" /> Community Snapshot
                 </h3>
                 <button 
                   onClick={() => setShowMembersPreview(false)} 
                   className="text-kala-500 hover:text-white"
                 >
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-6 space-y-4">
                 <p className="text-sm text-kala-400 mb-2">
                   Join {stats.totalMembers.toLocaleString()} creators, venues, and organizers.
                 </p>
                 <div className="space-y-3">
                    {previewMembers.map((member, i) => (
                       <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-kala-800 border border-kala-700">
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-10 h-10 rounded-full object-cover border border-kala-600" 
                          />
                          <div>
                             <div className="text-sm font-bold text-white flex items-center gap-2">
                               {member.name} 
                               {!(member as any).isMock && (
                                 <span className="text-[9px] bg-green-500/20 text-green-400 px-1 rounded border border-green-500/30">
                                   NEW
                                 </span>
                               )}
                             </div>
                             <div className="text-xs text-kala-400 flex items-center gap-2">
                                <span>{member.role}</span>
                                <span className="w-1 h-1 rounded-full bg-kala-600"></span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {member.location}
                                </span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
                 
                 <div className="pt-4 border-t border-kala-800">
                    <p className="text-xs text-center text-kala-500 mb-3">
                      New users must register to access the full portal.
                    </p>
                    <button 
                      onClick={() => startTransition(() => { setShowMembersPreview(false); onJoin(); })}
                      className="w-full py-3 bg-kala-secondary text-kala-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-900/20"
                    >
                       Join the Community
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Home;
