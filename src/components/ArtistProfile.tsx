
import React, { useState, useEffect } from 'react';
import { ArtistProfile as IArtistProfile, LeadQuery, UserRole } from '../types';
import { searchArtist } from '../services/musicBrainzService';
import { Artist } from '../types';
import {
  //... other icons
  Search,
  //... other icons
} from 'lucide-react';
import { 
  MapPin, 
  CheckCircle, 
  Play, 
  MessageCircle, 
  Star,
  TrendingUp,
  PieChart,
  Send,
  Users,
  ArrowRight,
  Settings,
  CreditCard,
  ShieldCheck,
  Calendar,
  Wallet,
  Plus,
  Trash2,
  Copy,
  DollarSign,
  Download,
  X,
  Check,
  Bot,
  RefreshCw,
  FileText,
  BookOpen,
  AlertTriangle,
  Network,
  Sparkles,
  Image,
  Link,
  Upload,
  Lock,
  KeyRound,
  Trash
} from 'lucide-react';
import UserGuide from '../components/UserGuide';
import { useToast } from '../contexts/ToastContext';

interface ArtistProfileProps {
  artist: IArtistProfile;
  onChat: () => void;
  onBook: () => void;
  isOwnProfile?: boolean;
  isBlocked?: boolean; 
  onUpdateProfile?: (data: Partial<IArtistProfile>) => void;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({ artist, onChat, onBook, isOwnProfile = false, isBlocked = false, onUpdateProfile }) => {
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'invest' | 'settings' | 'financials' | 'leads' | 'guide'>('overview');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [localArtist, setLocalArtist] = useState(artist);
  const [manualQuery, setManualQuery] = useState('');
  const [manualResponse, setManualResponse] = useState('');
    const [artistQuery, setArtistQuery] = useState('');
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Sync state when prop changes
  useEffect(() => {
    setLocalArtist(artist);
    if (!isOwnProfile) {
       setActiveTab('overview');
    }
  }, [artist, isOwnProfile]);

  // Check if user is a paid subscriber (Not a Guest)
  const isSubscribed = localArtist.subscription?.status === 'Active' && 
                       localArtist.subscription?.planName !== 'Guest' && 
                       localArtist.subscription?.planName !== 'Guest / Starter';

  const setDefaultMethod = (type: 'crypto' | 'fiat', id: string) => {
    const updated = { ...localArtist };
    if (!updated.savedPaymentMethods) return;

    if (type === 'crypto') {
        updated.savedPaymentMethods.crypto = updated.savedPaymentMethods.crypto.map(m => ({ ...m, isDefault: m.id === id }));
        updated.savedPaymentMethods.fiat = updated.savedPaymentMethods.fiat.map(m => ({ ...m, isDefault: false }));
    } else {
        updated.savedPaymentMethods.fiat = updated.savedPaymentMethods.fiat.map(m => ({ ...m, isDefault: m.id === id }));
        updated.savedPaymentMethods.crypto = updated.savedPaymentMethods.crypto.map(m => ({ ...m, isDefault: false }));
    }
    setLocalArtist(updated);
  };

  const handleManualLeadSubmit = () => {
    if(!manualQuery || !manualResponse) return;

    const newLead: LeadQuery = {
       id: `lq-${Date.now()}`,
       date: new Date().toLocaleDateString(),
       query: manualQuery,
       responseSummary: manualResponse,
       method: 'Manual Entry',
       isPaidService: false
    };

    setLocalArtist(prev => ({
       ...prev,
       leadQueries: [newLead, ...(prev.leadQueries || [])]
    }));

    setManualQuery('');
    setManualResponse('');
    notify("Lead query saved successfully!", "success");
  };

  const handleSubscribe = () => {
    setLocalArtist(prev => ({
      ...prev,
      subscription: {
        ...prev.subscription!,
        status: 'Active',
        planName: 'Community Pro'
      }
    }));
    notify("Subscription activated! You can now access the guide.", "success");
  };
  const handleArtistSearch = async () => {
    if (!artistQuery) {
        notify("Please enter an artist name to search.", "warning");
        return;
    }
    setIsSearching(true);
    const results = await searchArtist(artistQuery);
    setArtistResults(results);
    setIsSearching(false);
    notify(`Found ${results.length} artists.`, "success");
  };
  const handleAcceptDaoInvite = () => {
    setLocalArtist(prev => ({ ...prev, role: UserRole.DAO_MEMBER }));
    notify("Welcome to the DAO! You are now an active voting member.", "success");
  };

  // --- Profile Editing Handlers ---

  const handleProfileUpdate = (field: keyof IArtistProfile, value: string) => {
    setLocalArtist(prev => {
        const updated = { ...prev, [field]: value };
        if (onUpdateProfile) onUpdateProfile({ [field]: value });
        return updated;
    });
  };

  const handleImageUpload = (field: 'avatar' | 'coverImage', file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleProfileUpdate(field, reader.result);
          notify(`${field === 'avatar' ? 'Avatar' : 'Cover Image'} updated successfully!`, "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    // If user has a password set, verify current
    if (localArtist.password && currentPassword !== localArtist.password) {
      notify("Current password incorrect.", "error");
      return;
    }
    
    if (newPassword.length < 6) {
      notify("New password must be at least 6 characters.", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      notify("New passwords do not match.", "error");
      return;
    }

    setLocalArtist(prev => {
        const updated = { ...prev, password: newPassword };
        if (onUpdateProfile) onUpdateProfile({ password: newPassword });
        return updated;
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    notify("Password changed successfully!", "success");
  };

  const handleSocialChange = (index: number, field: 'platform' | 'followers', value: string) => {
    const updatedSocials = [...localArtist.pressKit.socials];
    updatedSocials[index] = { ...updatedSocials[index], [field]: value };
    setLocalArtist(prev => ({
        ...prev,
        pressKit: { ...prev.pressKit, socials: updatedSocials }
    }));
  };

  const handleAddSocial = () => {
    setLocalArtist(prev => ({
        ...prev,
        pressKit: {
            ...prev.pressKit,
            socials: [...prev.pressKit.socials, { platform: '', followers: '' }]
        }
    }));
  };

  const handleRemoveSocial = (index: number) => {
     const updatedSocials = localArtist.pressKit.socials.filter((_, i) => i !== index);
     setLocalArtist(prev => ({
        ...prev,
        pressKit: { ...prev.pressKit, socials: updatedSocials }
    }));
  };

  const PayoutModal = () => {
     const [selectedId, setSelectedId] = useState<string>('');
     const [amount, setAmount] = useState(localArtist.revenue?.pendingPayout || 0);

     return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-4 border-b border-kala-800 flex justify-between items-center bg-kala-800/50">
                 <h3 className="text-white font-bold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" /> Request Payout
                 </h3>
                 <button onClick={() => setShowPayoutModal(false)} className="text-kala-500 hover:text-white">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-6 space-y-6">
                 <div>
                    <label className="block text-xs text-kala-500 font-bold uppercase mb-2">Withdrawal Amount (USD)</label>
                    <div className="relative">
                       <span className="absolute left-4 top-3 text-white font-bold">$</span>
                       <input 
                         type="number" 
                         value={amount} 
                         onChange={(e) => setAmount(Number(e.target.value))}
                         max={localArtist.revenue?.pendingPayout}
                         className="w-full bg-kala-800 border border-kala-700 rounded-xl pl-8 pr-4 py-3 text-white font-mono font-bold focus:ring-1 focus:ring-green-500 outline-none"
                       />
                       <button className="absolute right-3 top-2.5 text-xs bg-kala-700 px-2 py-1 rounded text-kala-300 hover:text-white" onClick={() => setAmount(localArtist.revenue?.pendingPayout || 0)}>
                          Max
                       </button>
                    </div>
                    <p className="text-xs text-kala-500 mt-2">Available Balance: ${localArtist.revenue?.pendingPayout.toLocaleString()}</p>
                 </div>

                 <div>
                    <label className="block text-xs text-kala-500 font-bold uppercase mb-2">Select Destination</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                       {localArtist.savedPaymentMethods?.fiat.map(m => (
                          <div 
                            key={m.id} 
                            onClick={() => setSelectedId(m.id)}
                            className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-colors ${selectedId === m.id ? 'bg-green-500/10 border-green-500' : 'bg-kala-800/50 border-kala-700 hover:bg-kala-800'}`}
                          >
                             <div className="flex items-center gap-3">
                                <CreditCard className="w-4 h-4 text-green-400" />
                                <div>
                                   <div className="text-sm font-bold text-white">{m.label}</div>
                                   <div className="text-xs text-kala-500">{m.type} â€¢â€¢â€¢â€¢ {m.last4}</div>
                                </div>
                             </div>
                             {selectedId === m.id && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </div>
                       ))}
                       {localArtist.savedPaymentMethods?.crypto.map(m => (
                          <div 
                            key={m.id} 
                            onClick={() => setSelectedId(m.id)}
                            className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-colors ${selectedId === m.id ? 'bg-purple-500/10 border-purple-500' : 'bg-kala-800/50 border-kala-700 hover:bg-kala-800'}`}
                          >
                             <div className="flex items-center gap-3">
                                <Wallet className="w-4 h-4 text-purple-400" />
                                <div>
                                   <div className="text-sm font-bold text-white">{m.label}</div>
                                   <div className="text-xs text-kala-500">{m.network} â€¢ {m.address.substring(0,6)}...</div>
                                </div>
                             </div>
                             {selectedId === m.id && <CheckCircle className="w-4 h-4 text-purple-500" />}
                          </div>
                       ))}
                    </div>
                 </div>

                 <button 
                   disabled={!selectedId || amount <= 0}
                   onClick={() => { notify(`Withdrawal of $${amount} requested to destination ${selectedId}`, 'info'); setShowPayoutModal(false); }}
                   className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20"
                 >
                    Confirm Withdrawal
                 </button>
              </div>
           </div>
        </div>
     );
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-kala-800 border border-kala-700 shadow-2xl">
        <div className="h-64 w-full relative">
          <img src={localArtist.coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-kala-900 via-kala-900/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="flex items-end gap-4">
              <img 
                src={localArtist.avatar} 
                alt={localArtist.name} 
                className="w-24 h-24 rounded-xl border-4 border-kala-900 shadow-xl object-cover"
              />
              <div className="mb-1">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  {localArtist.name} 
                  {localArtist.verified && <CheckCircle className="w-6 h-6 text-blue-400 fill-blue-400/20" />}
                </h1>
                <div className="flex items-center gap-2 text-kala-300 text-sm mt-1">
                  <MapPin className="w-4 h-4" /> {localArtist.location}
                  {localArtist.genres && localArtist.genres.length > 0 && (
                    <>
                      <span className="mx-1\">â€¢</span>
                      {localArtist.genres.join(', ')}
                    </>
                  )}

                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {!isOwnProfile && (
                <>
                  <button 
                    onClick={onChat}
                    className="flex items-center gap-2 px-4 py-2 bg-kala-700 hover:bg-kala-600 text-white rounded-lg transition-colors font-medium border border-kala-600"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat
                  </button>
                  <button 
                    onClick={onBook}
                    className="flex items-center gap-2 px-6 py-2 bg-kala-secondary hover:bg-cyan-400 text-kala-900 rounded-lg transition-colors font-bold shadow-lg shadow-cyan-900/20"
                  >
                    <Send className="w-4 h-4" /> Send Proposal
                  </button>
                </>
              )}
              {isOwnProfile && (
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2 px-4 py-2 bg-kala-800 hover:bg-kala-700 text-white rounded-lg border border-kala-600 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="bg-kala-800 px-6 pt-2 flex items-center gap-6 border-t border-kala-700/50 overflow-x-auto">
           <button 
             onClick={() => setActiveTab('overview')}
             className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'text-white border-kala-secondary' : 'text-kala-500 border-transparent hover:text-white'}`}
           >
             Overview
           </button>
           <button 
             onClick={() => setActiveTab('invest')}
             className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'invest' ? 'text-white border-kala-secondary' : 'text-kala-500 border-transparent hover:text-white'}`}
           >
             <TrendingUp className="w-4 h-4" /> Equity & Invest
           </button>
           
           {/* Private Tabs: Only show if it's the user's own profile */}
           {isOwnProfile && (
             <>
               <button 
                 onClick={() => setActiveTab('financials')}
                 className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'financials' ? 'text-white border-kala-secondary' : 'text-kala-500 border-transparent hover:text-white'}`}
               >
                 <DollarSign className="w-4 h-4" /> Earnings
               </button>
               <button 
                 onClick={() => setActiveTab('leads')}
                 className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'leads' ? 'text-white border-kala-secondary' : 'text-kala-500 border-transparent hover:text-white'}`}
               >
                 <Bot className="w-4 h-4" /> Lead Queries
               </button>
               <button 
                 onClick={() => setActiveTab('guide')}
                 className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'guide' ? 'text-white border-kala-secondary' : 'text-kala-500 border-transparent hover:text-white'}`}
               >
                 <BookOpen className="w-4 h-4" /> Resources & Guide
               </button>
               <button 
                 onClick={() => setActiveTab('settings')}
                 className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? 'text-white border-kala-secondary' : 'text-kala-500 border-transparent hover:text-white'}`}
               >
                 <Settings className="w-4 h-4" /> Settings
               </button>
             </>
           )}
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
           {/* Left Column: Bio & Info */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">About</h3>
                 <p className="text-kala-300 whitespace-pre-line leading-relaxed">
                   {localArtist.bio}
                 </p>
              </div>

              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <Play className="w-5 h-5 text-kala-secondary" /> Top Tracks / Content
                 </h3>
                 <div className="space-y-2">
                    {localArtist.pressKit.topTracks.length > 0 ? localArtist.pressKit.topTracks.map((track, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-kala-800 transition-colors group cursor-pointer">
                         <div className="flex items-center gap-3">
                           <span className="text-kala-500 text-sm font-mono w-4">{i + 1}</span>
                           <div className="font-medium text-white group-hover:text-kala-secondary">{track.title}</div>
                         </div>
                         <div className="flex items-center gap-4 text-xs text-kala-500">
                            <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {track.plays}</span>
                            <span>{track.duration}</span>
                         </div>
                      </div>
                    )) : (
                      <div className="text-kala-500 text-sm italic">No tracks available.</div>
                    )}
                 </div>
              </div>
           </div>

           {/* Right Column: Stats & Socials */}
           <div className="space-y-6">
              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <h3 className="text-sm font-bold text-kala-500 uppercase mb-4">Performance Stats</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-kala-400 text-sm">Community Rating</span>
                       <span className="text-white font-bold flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {localArtist.stats.rating}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-kala-400 text-sm">Gigs/Deals Completed</span>
                       <span className="text-white font-bold">{localArtist.stats.gigsCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-kala-400 text-sm">Avg. Response</span>
                       <span className="text-white font-bold">{localArtist.stats.responseTime}</span>
                    </div>
                 </div>
              </div>

              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <h3 className="text-sm font-bold text-kala-500 uppercase mb-4">Connect</h3>
                 <div className="flex flex-col gap-3">
                    {localArtist.pressKit.socials.map((social, i) => (
                       <a key={i} href="#" className="flex items-center justify-between p-3 bg-kala-900/50 rounded-lg hover:bg-kala-900 transition-colors">
                          <span className="text-white text-sm">{social.platform}</span>
                          <span className="text-kala-500 text-xs">{social.followers} followers</span>
                       </a>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      ) : activeTab === 'invest' ? (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
           {/* Investment Opportunities */}
           <div className="bg-gradient-to-r from-purple-900/40 to-kala-900 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                    <PieChart className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white mb-2">Invest in {localArtist.name}'s Future</h3>
                    <p className="text-kala-300 text-sm max-w-2xl">
                       Purchase equity tokens to support upcoming projects and share in the revenue. 
                       All contracts are audited and executed via KalaKrut DAO protocols.
                    </p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localArtist.equityOpportunities?.map((opp) => (
                 <div key={opp.id} className="bg-kala-800/50 border border-kala-700 rounded-xl p-6 hover:border-kala-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold border ${
                          opp.riskLevel === 'Low' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          opp.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                       }`}>
                          {opp.riskLevel} Risk
                       </span>
                       <span className="text-kala-500 text-xs flex items-center gap-1">
                          <Users className="w-3 h-3" /> {opp.backersCount} Backers
                       </span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-2">{opp.title}</h4>
                    <p className="text-sm text-kala-400 mb-4 h-10 line-clamp-2">{opp.description}</p>
                    
                    <div className="bg-kala-900/50 rounded-lg p-3 space-y-2 mb-4">
                       <div className="flex justify-between text-sm">
                          <span className="text-kala-500">Valuation</span>
                          <span className="text-white font-mono">{opp.totalValuation.toLocaleString()} {opp.currency}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-kala-500">Equity Offered</span>
                          <span className="text-white font-mono">{opp.equityAvailablePercentage}%</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-kala-500">Min. Investment</span>
                          <span className="text-white font-mono">{opp.minInvestment} {opp.currency}</span>
                       </div>
                    </div>

                    <button className="w-full py-2 bg-kala-secondary text-kala-900 font-bold rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2">
                       Invest Now <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              ))}
              {!localArtist.equityOpportunities?.length && (
                <div className="text-center text-kala-500 py-10 col-span-2 bg-kala-800/30 rounded-xl">
                  No active investment opportunities at this time.
                </div>
              )}
           </div>
        </div>
      ) : activeTab === 'financials' && isOwnProfile ? (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-kala-800 border border-kala-700 rounded-xl p-6">
              <div className="text-kala-400 text-sm font-bold uppercase mb-2">Lifetime Earnings</div>
              <div className="text-3xl font-mono text-white">${localArtist.revenue?.totalLifetime.toLocaleString()}</div>
            </div>
            <div className="bg-kala-800 border border-kala-700 rounded-xl p-6">
              <div className="text-kala-400 text-sm font-bold uppercase mb-2">Pending Payout</div>
              <div className="text-3xl font-mono text-yellow-400">${localArtist.revenue?.pendingPayout.toLocaleString()}</div>
              <button 
                onClick={() => setShowPayoutModal(true)}
                className="mt-3 w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
              >
                Request Payout <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="bg-kala-800 border border-kala-700 rounded-xl p-6">
              <div className="text-kala-400 text-sm font-bold uppercase mb-2">Last 30 Days</div>
              <div className="text-3xl font-mono text-green-400">+${localArtist.revenue?.lastMonth.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(localArtist.revenue?.breakdown || {}).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-kala-300 capitalize">{key}</span>
                        <span className="text-white font-mono">${(val as number).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-kala-900 rounded-full h-2">
                         <div 
                           className="bg-kala-secondary h-2 rounded-full" 
                           style={{ width: `${((val as number) / (localArtist.revenue?.totalLifetime || 1)) * 100}%` }}
                         ></div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Payouts</h3>
                <div className="space-y-3">
                   {localArtist.revenue?.recentPayouts.map((payout, i) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-kala-900/50 rounded-lg">
                        <div>
                           <div className="text-white font-bold text-sm">${payout.amount.toLocaleString()}</div>
                           <div className="text-xs text-kala-500">{payout.date} â€¢ {payout.method}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded font-bold ${
                           payout.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {payout.status}
                        </span>
                     </div>
                   ))}
                   {(!localArtist.revenue?.recentPayouts || localArtist.revenue.recentPayouts.length === 0) && (
                     <div className="text-center text-kala-500 text-sm py-4">No recent payouts found.</div>
                   )}
                </div>
             </div>
          </div>
        </div>
      ) : activeTab === 'leads' && isOwnProfile ? (
         <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            {/* LeadGeniusAI History */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 bg-kala-800/50 p-6 rounded-xl border border-kala-700">
               <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <Bot className="text-indigo-400" /> LeadGeniusAI History
                  </h3>
                  <p className="text-kala-400 text-sm mt-1">
                     Manage your query prompts and lead results.
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${
                     localArtist.subscription?.hasLeadGeniusSync 
                     ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                     : 'bg-kala-900 border-kala-700 text-kala-500'
                  }`}>
                     {localArtist.subscription?.hasLeadGeniusSync ? (
                        <><RefreshCw className="w-3 h-3 animate-spin-slow" /> Auto-Sync Active</>
                     ) : (
                        <><Bot className="w-3 h-3" /> Manual Mode</>
                     )}
                  </div>
               </div>
            </div>
            
            {/* Manual Entry Form */}
            <div className="bg-kala-900/50 border border-kala-800 rounded-xl p-6">
               <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"> <Bot className="w-4 h-4 text-indigo-400" /> Gemini LeadGenius Log </h4>
               </h4>
               <div className="space-y-3">
                  <input 
                     type="text" 
                     placeholder="Query used (e.g. 'Techno venues in London')" 
                     value={manualQuery}
                     onChange={(e) => setManualQuery(e.target.value)}
                     className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-kala-secondary"
                  />
                  <textarea 
                     rows={2}
                     placeholder="Response Summary / Notes from AI Tool..." 
                     value={manualResponse}
                     onChange={(e) => setManualResponse(e.target.value)}
                     className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-kala-secondary resize-none"
                  />
                  <button 
                     onClick={handleManualLeadSubmit}
                     disabled={!manualQuery || !manualResponse}
                     className="bg-kala-700 hover:bg-kala-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors disabled:opacity-50"
                  >
                     Save Entry
                  </button>
               </div>
               <p className="text-[10px] text-kala-500 mt-2">
                  * Manual recording is included in your current plan. To automate this, activate Auto-Sync in the Services Hub.
               </p>
            </div>
            
            {/* MusicBrainz Artist Search */}
            <div className="bg-kala-900/50 border border-kala-800 rounded-xl p-6">
               <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4 text-teal-400" /> MusicBrainz Artist Search
               </h4>
               <div className="flex gap-2">
                   <input
                       type="text"
                       value={artistQuery}
                       onChange={(e) => setArtistQuery(e.target.value)}
                       className="flex-grow bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-teal-500"
                       placeholder="e.g., Nirvana, Daft Punk..."
                   />
                   <button
                       onClick={handleArtistSearch}
                       disabled={isSearching}
                       className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                       {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                       {isSearching ? 'Searching...' : 'Search'}
                   </button>
               </div>
               <p className="text-xs text-kala-500 mt-2">
                   * Search for artists on MusicBrainz to discover new talent.
               </p>
            </div>
            
            {/* Artist Search Results */}
            {artistResults.length > 0 && (
               <div className="bg-kala-800/40 border border-kala-700/80 rounded-xl">
                   <div className="p-4 border-b border-kala-700">
                       <h3 className="font-bold text-white">Artist Search Results</h3>
                   </div>
                   <div className="overflow-x-auto">
                       <table className="w-full text-sm text-left">
                           <thead className="text-xs text-kala-400 uppercase bg-kala-800/60">
                               <tr>
                                   <th className="px-6 py-3">Name</th>
                                   <th className="px-6 py-3">Disambiguation</th>
                                   <th className="px-6 py-3 text-center">Actions</th>
                               </tr>
                           </thead>
                           <tbody>
                               {artistResults.map(artist => (
                                   <tr key={artist.id} className="border-b border-kala-800 hover:bg-kala-800/50">
                                       <td className="px-6 py-4 font-medium text-white">{artist.name}</td>
                                       <td className="px-6 py-4 text-kala-300">{artist.bio}</td>
                                       <td className="px-6 py-4 text-center">
                                           <button className="text-indigo-400 hover:text-indigo-300">Add as Lead</button>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           )}



            {/* Leads List */}
            <div className="space-y-4">
               {localArtist.leadQueries?.map((lead) => (
                  <div key={lead.id} className="bg-kala-800 border border-kala-700 rounded-xl p-4 hover:border-kala-500 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-kala-500 font-mono">{lead.date}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                           lead.method === 'Auto-Sync' 
                           ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                           : 'bg-kala-700 text-kala-400 border-kala-600'
                        }`}>
                           {lead.method}
                        </span>
                     </div>
                     <div className="mb-3">
                        <div className="text-xs text-kala-400 font-bold uppercase mb-1">Query</div>
                        <div className="text-white font-medium text-sm">"{lead.query}"</div>
                     </div>
                     <div className="bg-kala-900/50 p-3 rounded-lg border border-kala-700/50">
                        <div className="text-xs text-kala-400 font-bold uppercase mb-1">Response / Result</div>
                        <div className="text-kala-300 text-sm whitespace-pre-wrap">{lead.responseSummary}</div>
                     </div>
                  </div>
               ))}
               {(!localArtist.leadQueries || localArtist.leadQueries.length === 0) && (
                  <div className="text-center py-8 text-kala-500 text-sm">No lead queries recorded yet.</div>
               )}
            </div>
         </div>

      ) : activeTab === 'guide' && isOwnProfile ? (
        <UserGuide isSubscribed={!!isSubscribed} onSubscribe={handleSubscribe} />
      ) : activeTab === 'settings' && isOwnProfile ? (
        /* Settings Tab */
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
           
           {/* Profile Images & Identity */}
           <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Image className="w-5 h-5 text-kala-secondary" /> Profile Appearance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Avatar</label>
                    <div className="flex gap-4 items-center">
                        <img src={localArtist.avatar} alt="Preview" className="w-16 h-16 rounded-lg bg-kala-900 object-cover border border-kala-700" />
                        <label className="cursor-pointer bg-kala-800 hover:bg-kala-700 text-white px-4 py-2 rounded-lg border border-kala-600 text-xs font-bold flex items-center gap-2 transition-colors">
                           <Upload className="w-4 h-4" /> Upload New
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImageUpload('avatar', e.target.files[0])} />
                        </label>
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Cover Image</label>
                    <div className="flex gap-4 items-center">
                        <img src={localArtist.coverImage} alt="Preview" className="w-24 h-16 rounded-lg bg-kala-900 object-cover border border-kala-700" />
                        <label className="cursor-pointer bg-kala-800 hover:bg-kala-700 text-white px-4 py-2 rounded-lg border border-kala-600 text-xs font-bold flex items-center gap-2 transition-colors">
                           <Upload className="w-4 h-4" /> Upload New
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImageUpload('coverImage', e.target.files[0])} />
                        </label>
                    </div>
                 </div>
              </div>
           </div>

           {/* Security & Login */}
           <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <KeyRound className="w-5 h-5 text-yellow-400" /> Security & Login
              </h3>
              <div className="space-y-4 max-w-md">
                 <div>
                    <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Current Password</label>
                    <input 
                       type="password" 
                       value={currentPassword}
                       onChange={(e) => setCurrentPassword(e.target.value)}
                       className="w-full bg-kala-900 border border-kala-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-kala-secondary"
                       placeholder="Enter current password to verify"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs text-kala-400 font-bold uppercase mb-1">New Password</label>
                       <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-kala-900 border border-kala-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-kala-secondary"
                          placeholder="Min 6 chars"
                       />
                    </div>
                    <div>
                       <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Confirm New</label>
                       <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-kala-900 border border-kala-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-kala-secondary"
                          placeholder="Re-enter password"
                       />
                    </div>
                 </div>
                 <button 
                    onClick={handlePasswordChange}
                    className="bg-kala-700 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors w-full md:w-auto"
                 >
                    Update Password
                 </button>
              </div>
           </div>

           {/* Social Media Management */}
           <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Link className="w-5 h-5 text-blue-400" /> Social Media & Presence
              </h3>
              <div className="space-y-3">
                 {localArtist.pressKit.socials.map((social, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-3 items-end md:items-center bg-kala-900/30 p-3 rounded-lg border border-kala-700/50">
                        <div className="flex-1 w-full">
                           <label className="text-[10px] text-kala-500 uppercase font-bold">Platform</label>
                           <input 
                              type="text"
                              value={social.platform}
                              placeholder="e.g. Instagram"
                              onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                              className="w-full bg-kala-800 border border-kala-700 rounded px-3 py-1.5 text-white text-sm focus:border-kala-secondary outline-none"
                           />
                        </div>
                        <div className="flex-1 w-full">
                           <label className="text-[10px] text-kala-500 uppercase font-bold">Followers</label>
                           <input 
                              type="text"
                              value={social.followers}
                              placeholder="e.g. 10k"
                              onChange={(e) => handleSocialChange(index, 'followers', e.target.value)}
                              className="w-full bg-kala-800 border border-kala-700 rounded px-3 py-1.5 text-white text-sm focus:border-kala-secondary outline-none"
                           />
                        </div>
                        <button 
                           onClick={() => handleRemoveSocial(index)}
                           className="p-2 text-kala-500 hover:text-red-400 hover:bg-kala-800 rounded transition-colors"
                           title="Remove"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                 ))}
                 <button 
                    onClick={handleAddSocial}
                    className="w-full py-2 border border-dashed border-kala-600 rounded-lg text-kala-400 hover:text-white hover:border-kala-400 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                 >
                    <Plus className="w-4 h-4" /> Add Social Account
                 </button>
              </div>
           </div>

           {/* Account Status / Moderation */}
           <div className={`border rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${isBlocked ? 'bg-red-900/20 border-red-500/50' : 'bg-gradient-to-br from-kala-800 to-kala-900 border-kala-700'}`}>
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">Account Status</h3>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded border ${isBlocked ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                       {isBlocked ? 'SUSPENDED' : 'Active / Good Standing'}
                    </span>
                 </div>
                 <div className="space-y-1 text-sm text-kala-400">
                    <p className="flex items-center gap-2">
                       {isBlocked ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <ShieldCheck className="w-4 h-4 text-green-500" />}
                       {isBlocked ? 'Your account has been blocked due to a policy violation.' : 'No recent violations found on your account.'}
                    </p>
                 </div>
              </div>
           </div>

           {/* DAO Membership Invite / Status */}
           <div className={`border rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${localArtist.role === UserRole.DAO_MEMBER ? 'bg-purple-900/20 border-purple-500/30' : 'bg-kala-800/50 border-kala-700'}`}>
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${localArtist.role === UserRole.DAO_MEMBER ? 'bg-purple-500 text-white' : 'bg-kala-700 text-kala-400'}`}>
                       <Network className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">DAO Membership</h3>
                        <p className="text-sm text-kala-400">
                            {localArtist.role === UserRole.DAO_MEMBER 
                              ? "You are a fully verified member of the governance council."
                              : "You have a pending invitation to join the KalaKrut DAO."}
                        </p>
                    </div>
                 </div>
              </div>
              <div>
                  {localArtist.role === UserRole.DAO_MEMBER ? (
                     <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-lg font-bold">
                        <CheckCircle className="w-5 h-5" /> Active Member
                     </div>
                  ) : (
                     <button 
                       onClick={handleAcceptDaoInvite}
                       className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-purple-900/20 flex items-center gap-2 transition-all"
                     >
                        <Sparkles className="w-4 h-4" /> Accept Invitation
                     </button>
                  )}
              </div>
           </div>

           {/* Subscription Status Card */}
           <div className="bg-gradient-to-br from-kala-800 to-kala-900 border border-kala-700 rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">{localArtist.subscription?.planName} Plan</h3>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30">
                       {localArtist.subscription?.status}
                    </span>
                 </div>
                 <div className="space-y-1 text-sm text-kala-400">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-kala-500" /> Renews on: <span className="text-white">{localArtist.subscription?.expiryDate}</span></p>
                    <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-kala-500" /> Support Tier: <span className="text-kala-secondary font-bold">{localArtist.subscription?.supportTier}</span></p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <button className="px-4 py-2 bg-kala-800 hover:bg-kala-700 text-white rounded-lg border border-kala-600 transition-colors text-sm font-bold">
                    Manage Plan
                 </button>
                 <button className="px-4 py-2 bg-kala-secondary hover:bg-cyan-400 text-kala-900 rounded-lg transition-colors text-sm font-bold shadow-lg shadow-cyan-900/20">
                    Upgrade Tier
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Crypto Wallets */}
              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Wallet className="w-5 h-5 text-purple-400" /> Crypto Wallets
                    </h3>
                    <button className="text-xs bg-kala-700 hover:bg-kala-600 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors">
                       <Plus className="w-3 h-3" /> Add Wallet
                    </button>
                 </div>
                 <div className="space-y-3">
                    {localArtist.savedPaymentMethods?.crypto.map((wallet) => (
                       <div key={wallet.id} className="p-3 bg-kala-900/50 border border-kala-700 rounded-lg flex justify-between items-center group">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <Wallet className="w-4 h-4" />
                             </div>
                             <div>
                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                  {wallet.label}
                                  {wallet.isDefault && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 rounded border border-purple-500/30">DEFAULT</span>}
                                </div>
                                <div className="text-xs text-kala-400 flex items-center gap-1">
                                   <span className="text-kala-500">{wallet.network}</span> â€¢ {wallet.address}
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             {!wallet.isDefault && (
                                <button onClick={() => setDefaultMethod('crypto', wallet.id)} className="text-[10px] text-kala-500 hover:text-white px-2 py-1 bg-kala-800 rounded">
                                   Set Default
                                </button>
                             )}
                             <button className="text-kala-500 hover:text-white" title="Copy Address">
                                <Copy className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Fiat Methods */}
              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <CreditCard className="w-5 h-5 text-green-400" /> Fiat Methods
                    </h3>
                    <button className="text-xs bg-kala-700 hover:bg-kala-600 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors">
                       <Plus className="w-3 h-3" /> Add Card
                    </button>
                 </div>
                 <div className="space-y-3">
                    {localArtist.savedPaymentMethods?.fiat.map((method) => (
                       <div key={method.id} className="p-3 bg-kala-900/50 border border-kala-700 rounded-lg flex justify-between items-center group">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                <CreditCard className="w-4 h-4" />
                             </div>
                             <div>
                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                   {method.label}
                                   {method.isDefault && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 rounded border border-green-500/30">DEFAULT</span>}
                                </div>
                                <div className="text-xs text-kala-400">
                                   {method.type} ending in {method.last4} {method.expiry && `(Exp: ${method.expiry})`}
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             {!method.isDefault && (
                                <button onClick={() => setDefaultMethod('fiat', method.id)} className="text-[10px] text-kala-500 hover:text-white px-2 py-1 bg-kala-800 rounded">
                                   Set Default
                                </button>
                             )}
                             <button className="text-kala-500 hover:text-red-400" title="Remove Method">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* DANGER ZONE */}
           <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-bold text-red-200 mb-4 flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5 text-red-500" /> Danger Zone
              </h3>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                 <div>
                    <h4 className="font-bold text-white text-sm">Delete Account</h4>
                    <p className="text-xs text-kala-400 max-w-lg mt-1">
                       Permanently delete your profile, assets, and history. This action cannot be undone. 
                       <span className="text-red-300 ml-1">
                          Note: As per community guidelines, you cannot self-delete active accounts to prevent fraud. Please contact an admin.
                       </span>
                    </p>
                 </div>
                 <button 
                   disabled
                   className="bg-kala-800 text-kala-600 font-bold px-6 py-3 rounded-lg border border-kala-700 cursor-not-allowed flex items-center gap-2"
                   title="Contact Admin to request deletion"
                 >
                    <Trash className="w-4 h-4" /> Delete Account (Locked)
                 </button>
              </div>
           </div>
        </div>
      ) : null}
      
      {showPayoutModal && <PayoutModal />}
    </div>
  );
};

export default ArtistProfile;
