
import React, { useState } from 'react';
import { knowledgeGraph } from '../services/knowledgeGraphService';
import PaymentGateway from '../components/PaymentGateway';
import { 
  Lock, Unlock, ShieldCheck, MapPin, Star, Briefcase, Music, Calendar, Headphones, Ticket, Layers, Search, ShieldAlert, Loader2
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { RosterMember } from '../types';

interface RosterProps {
  onNavigate: (view: string) => void;
  onViewProfile: (id: string) => void;
}

const Roster: React.FC<RosterProps> = ({ onNavigate, onViewProfile }) => {
  const { notify } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  
  // This now contains ALL users, including demo users needed for login.
  const allMembers = knowledgeGraph.getRosterMembers();

  // --- STEP 2 of 2: De-duplicate the UI without breaking login ---
  // The data source now correctly contains all users. This logic filters the list
  // for display only, ensuring a clean UI without removing data needed for auth.
  const getFilteredRosterForDisplay = (members: RosterMember[]) => {
    if (!Array.isArray(members)) return [];

    // 1. Find all roles that have a REAL user assigned.
    const realUserRoles = new Set(
      members
        .filter(member => !member.isMock)
        .map(member => member.role)
    );

    // 2. Filter the list for display.
    return members.filter(member => {
      // If the member is a demo user...
      if (member.isMock) {
        // ...hide them if a real user already exists for that role.
        return !realUserRoles.has(member.role);
      }
      // Otherwise, always show the real user.
      return true;
    });
  };

  const cleanRoster = getFilteredRosterForDisplay(allMembers);

  const filteredRoster = cleanRoster.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Guard clause for loading state, as established previously.
  if (!Array.isArray(allMembers)) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-kala-secondary animate-spin" />
        <p className="ml-4 text-white">Loading Roster Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-kala-secondary" /> Community Roster
          </h2>
          <p className="text-kala-400 text-sm">Discover talent, venues, and service providers with transparent asset inventories.</p>
        </div>
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-3">
             <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-400">
                <Lock className="w-4 h-4" />
             </div>
             <div>
                <div className="text-sm font-bold text-yellow-200">Guest Access</div>
                <div className="text-xs text-yellow-200/70">Subscribe to view ratings & contact info</div>
             </div>
             <button 
               onClick={() => setShowPayment(true)}
               className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-kala-900 text-xs font-bold rounded transition-colors ml-2"
             >
               Subscribe Now
             </button>
          </div>
        )}
        {isSubscribed && (
           <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 flex items-center gap-2 text-green-400 text-sm font-bold">
             <Unlock className="w-4 h-4" /> Premium Access Unlocked
           </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-kala-500" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search roster by name or role (e.g., 'Producer', 'Venue', 'Aria Blaze')" 
          className="w-full bg-kala-800/50 border border-kala-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-kala-secondary focus:border-transparent outline-none"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredRoster.map((member) => {
          const isProtected = (member as any).protected;

          return (
            <div key={member.id} className={`relative bg-kala-800/50 border rounded-xl overflow-hidden group transition-all ${isProtected ? 'border-red-900/50' : 'border-kala-700 hover:border-kala-500'}`}>
              
              {isProtected && (
                 <div className="absolute inset-0 z-20 flex items-center justify-center bg-kala-900/20 pointer-events-none">
                    <div className="transform -rotate-12 border-4 border-red-500/50 text-red-500/50 px-6 py-3 font-black text-2xl uppercase tracking-widest rounded-xl shadow-2xl backdrop-blur-sm select-none">
                       Protected Info
                    </div>
                 </div>
              )}

              <div className={isProtected ? 'filter blur-[3px] grayscale opacity-60 pointer-events-none select-none' : ''}>
                  {/* Card Header */}
                  <div className="p-6 flex items-start justify-between">
                     <div className="flex items-center gap-4">
                       <div className="relative">
                         <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-xl object-cover border-2 border-kala-700" />
                         {member.verified && (
                           <div className="absolute -bottom-2 -right-2 bg-kala-900 p-1 rounded-full">
                             <ShieldCheck className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                           </div>
                         )}
                       </div>
                       <div>
                         <h3 className="text-lg font-bold text-white flex items-center gap-2">{member.name}</h3>
                         <div className="flex items-center gap-2 text-sm text-kala-400 mt-1">
                            <span className="px-2 py-0.5 bg-kala-700 rounded text-xs text-kala-300 border border-kala-600">{member.role}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {member.location}</span>
                         </div>
                       </div>
                     </div>
                     
                     <div className="text-right">
                       {isSubscribed && !isProtected ? (
                         <div className="flex flex-col items-end">
                           <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                             {member.rating.toFixed(1)} <Star className="w-4 h-4 fill-current" />
                           </div>
                           <div className="text-xs text-kala-500">Community Rating</div>
                         </div>
                       ) : (
                         <div className="flex flex-col items-end opacity-50 blur-[2px]">
                           <div className="flex items-center gap-1 text-slate-400 font-bold text-lg">
                             5.0 <Star className="w-4 h-4" />
                           </div>
                           <div className="text-xs text-kala-500">Community Rating</div>
                         </div>
                       )}
                     </div>
                  </div>

                  {/* Assets Inventory */}
                  <div className="px-6 pb-4">
                    <h4 className="text-xs font-bold text-kala-500 uppercase mb-3">Verifiable Assets from Knowledge Graph</h4>
                    <div className="flex flex-wrap gap-2">
                       {member.assets?.ips?.length > 0 && (
                         <Badge icon={Layers} label={`${member.assets.ips.length} IPs`} color="purple" />
                       )}
                       {member.assets?.events?.length > 0 && (
                         <Badge icon={Calendar} label={`${member.assets.events.length} Events`} color="pink" />
                       )}
                       {member.assets?.services?.length > 0 && (
                         <Badge icon={Briefcase} label={`${member.assets.services.length} Services`} color="blue" />
                       )}
                       {member.assets?.products?.length > 0 && (
                         <Badge icon={Headphones} label={`${member.assets.products.length} Products`} color="orange" />
                       )}
                       {member.assets?.tickets?.length > 0 && (
                         <Badge icon={Ticket} label={`${member.assets.tickets.length} Tickets`} color="green" />
                       )}
                       {(member.assets?.ips?.length || 0) === 0 &&
                        (member.assets?.events?.length || 0) === 0 &&
                        (member.assets?.services?.length || 0) === 0 &&
                        (member.assets?.products?.length || 0) === 0 &&
                        (member.assets?.tickets?.length || 0) === 0 && (
                          <span className="text-xs text-kala-600 italic">No public assets linked in the Knowledge Graph.</span>
                       )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-4 bg-kala-900/30 border-t border-kala-700 flex justify-between items-center">
                    <div className={`relative ${(!isSubscribed || isProtected) ? 'blur-sm select-none' : ''}`}>
                        {isSubscribed && !isProtected ? (
                          <div className="text-xs text-kala-300">
                            {member.subscriberOnly?.email}
                          </div>
                        ) : (
                          <div className="text-xs text-kala-400">
                            contact@hidden.com
                          </div>
                        )}
                        {(!isSubscribed && !isProtected) && (
                          <div className="absolute inset-0 flex items-center">
                             <Lock className="w-4 h-4 text-kala-400 opacity-80" />
                          </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onViewProfile(member.id)}
                        disabled={isProtected}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-kala-300 hover:text-white hover:bg-kala-800 transition-colors"
                      >
                        View Profile
                      </button>
                      <button 
                        disabled={!isSubscribed || isProtected}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                          isSubscribed && !isProtected
                          ? 'bg-kala-secondary text-kala-900 hover:bg-cyan-400' 
                          : 'bg-kala-800 text-kala-500 cursor-not-allowed'
                        }`}
                      >
                        {isProtected ? 'Locked' : isSubscribed ? 'Book Now' : 'Subscribe'}
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      {showPayment && (
         <PaymentGateway 
           amount={19.99} 
           currency="USD / mo" 
           itemDescription="Monthly Roster Access" 
           onSuccess={(method) => { 
             setIsSubscribed(true); 
             setShowPayment(false); 
             notify("Roster Access Unlocked! You can now view contacts and ratings.", "success");
           }}
           onCancel={() => setShowPayment(false)}
         />
      )}
    </div>
  );
};

const Badge = ({ icon: Icon, label, color }: { icon: any, label: string, color: string }) => {
  const colors: Record<string, string> = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border ${colors[color] || colors.blue}`}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

export default Roster;
