
import React, { useState } from 'react';
import { Proposal, RosterMember } from '../types';
import { Artist } from '../data/knowledgeGraphSchema';
import { MOCK_PROPOSALS } from '../mockData';
import { ThumbsUp, ThumbsDown, Clock, ShieldAlert, Plus, X, BrainCircuit, Search, Edit } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { knowledgeGraph } from '../services/knowledgeGraphService';

interface DaoGovernanceProps {
  permissions: any;
  onOpenExchange?: () => void;
  currentUser: RosterMember;
}

const DaoGovernance: React.FC<DaoGovernanceProps> = ({ permissions, onOpenExchange, currentUser }) => {
  const { isConnected, connect } = useWallet();
  const { notify } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [fundingCurrency, setFundingCurrency] = useState('KALA');
  const [artistSearch, setArtistSearch] = useState('');
  const [searchedArtists, setSearchedArtists] = useState<Artist[]>([]);

  const handleArtistSearch = () => {
    const artists = knowledgeGraph.getAllNodes('artists').filter(a => a.name.toLowerCase().includes(artistSearch.toLowerCase()));
    setSearchedArtists(artists as Artist[]);
  }

  const handleAttachArtist = (artist: Artist) => {
    const artistData = `
--- [Verified Artist Attachment] ---
Artist: ${artist.name}
Bio: ${artist.bio}
--- [End of Attachment] ---
`;
    setNewDesc(newDesc + artistData);
    setArtistSearch('');
    setSearchedArtists([]);
    notify(`${artist.name} attached to proposal.`, 'info');
  }

  const handleCreateProposal = () => {
    if (!newTitle || !newDesc) return;
    
    const newProposal: Proposal = {
      id: `PROP-${Math.floor(Math.random() * 1000)}`,
      title: newTitle,
      description: `${newDesc} (Funding Request: ${fundingAmount || 0} ${fundingCurrency})`,
      votesFor: 0,
      votesAgainst: 0,
      deadline: '7 Days Left',
      status: 'Active',
      creator: currentUser.name,
      quorumRequired: 20,
      currentParticipation: 0,
      isCritical: false
    };

    setProposals([newProposal, ...proposals]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setFundingAmount('');
    notify('Proposal Created Successfully!', 'success');
  };

  const handleVote = (id: string, vote: 'for' | 'against') => {
    if (!isConnected) {
      notify('Please connect your wallet to vote.', 'warning');
      connect();
      return;
    }
    setProposals(proposals.map(p => p.id === id ? { ...p, votesFor: vote === 'for' ? p.votesFor + 1 : p.votesFor, votesAgainst: vote === 'against' ? p.votesAgainst + 1 : p.votesAgainst } : p));
    notify(`Voted ${vote} proposal ${id}.`, 'success');
  };

  const handleAdminAction = (id: string, action: 'force_pass' | 'veto' | 'ratify' | 'reject') => {
    if (action === 'veto' && !permissions.canVetoProposals) {
        notify("You don't have permission to veto proposals.", "error");
        return;
    }
    if ((action === 'ratify' || action === 'reject' || action === 'force_pass') && !permissions.canRatifyProposals) {
        notify("You don't have permission for this action.", "error");
        return;
    }
    
    let newStatus: Proposal['status'] = 'Active';
    switch(action) {
        case 'force_pass': newStatus = 'Admin_Passed'; break;
        case 'veto': newStatus = 'Vetoed'; break;
        case 'ratify': newStatus = 'Passed'; break;
        case 'reject': newStatus = 'Rejected'; break;
    }

    setProposals(proposals.map(p => p.id === id ? { ...p, status: newStatus } : p));
    notify(`Proposal ${id} has been ${action.replace('_', ' ')}ed.`, 'info');
  };

  const canEditProposal = (proposal: Proposal) => {
    if (permissions.canManageAllContracts) return true;
    if (permissions.canOnlyManageOwnContracts && proposal.creator === currentUser.name) return true;
    return false;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-kala-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3"><BrainCircuit className="text-purple-400 w-8 h-8"/>DAO Governance</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsModalOpen(true)} className="bg-kala-secondary text-kala-900 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-400 transition-colors"><Plus className="w-5 h-5"/>Create Proposal</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map(p => (
            <div key={p.id} className={`bg-kala-900 border ${p.isCritical ? 'border-red-500/50' : 'border-kala-800'} rounded-2xl shadow-lg flex flex-col`}>
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${{
                    Active: 'bg-blue-500/10 text-blue-400',
                    Passed: 'bg-green-500/10 text-green-400',
                    Rejected: 'bg-red-500/10 text-red-400',
                    Vetoed: 'bg-yellow-500/10 text-yellow-400',
                    Admin_Passed: 'bg-purple-500/10 text-purple-400',
                  }[p.status]}`}>{p.status.replace('_', ' ')}</span>
                  {p.isCritical && <span className="flex items-center gap-1 text-red-400 text-xs font-bold"><ShieldAlert className="w-3 h-3"/>Critical</span>}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-kala-400 leading-relaxed line-clamp-3 mb-4">{p.description}</p>
                <div className="text-xs text-kala-500">Proposed by: <span className="font-semibold text-kala-300">{p.creator}</span></div>
              </div>

              <div className="p-5 border-t border-kala-800 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-kala-400 font-medium">Quorum</span>
                  <div className="w-full bg-kala-800 rounded-full h-2.5 mx-4">
                    <div className="bg-kala-secondary h-2.5 rounded-full" style={{ width: `${p.currentParticipation}%` }}></div>
                  </div>
                  <span className="font-bold text-white">{p.currentParticipation}%</span>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <ThumbsUp className="w-4 h-4"/>
                    <span>{p.votesFor} For</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400">
                    <ThumbsDown className="w-4 h-4"/>
                    <span>{p.votesAgainst} Against</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-kala-900/50 border-t border-kala-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-kala-500">
                  <Clock className="w-4 h-4"/>
                  <span>Deadline: {p.deadline}</span>
                </div>
                {p.status === 'Active' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => handleVote(p.id, 'for')} className="flex-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 font-bold py-2 px-4 rounded-lg text-xs transition-colors">Vote For</button>
                    <button onClick={() => handleVote(p.id, 'against')} className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold py-2 px-4 rounded-lg text-xs transition-colors">Vote Against</button>
                    {canEditProposal(p) && <button className="flex-1 bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center gap-1"><Edit size={12}/> Edit</button>}
                  </div>
                )}
              </div>
              
              {permissions.canRatifyProposals && p.status === 'Active' && (
                  <div className="p-3 bg-kala-700/50 border-t border-kala-700 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-kala-300">Governor Action:</span>
                      <div className="flex gap-2">
                          <button onClick={() => handleAdminAction(p.id, 'ratify')} className="text-xs bg-green-500/20 text-white px-2 py-1 rounded hover:bg-green-500/30">Ratify</button>
                          <button onClick={() => handleAdminAction(p.id, 'reject')} className="text-xs bg-red-500/20 text-white px-2 py-1 rounded hover:bg-red-500/30">Reject</button>
                      </div>
                  </div>
              )}
              
              {(permissions.canRatifyProposals || permissions.canVetoProposals) && p.status === 'Active' && (
                  <div className="p-3 bg-yellow-500/5 border-t border-yellow-500/20 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-yellow-400">Special Action:</span>
                      <div className="flex gap-2">
                        {permissions.canRatifyProposals && (
                            <button onClick={() => handleAdminAction(p.id, 'force_pass')} className="text-xs bg-purple-500/20 text-white px-2 py-1 rounded hover:bg-purple-500/30">Force Pass</button>
                        )}
                        {permissions.canVetoProposals && (
                            <button onClick={() => handleAdminAction(p.id, 'veto')} className="text-xs bg-red-500/20 text-white px-2 py-1 rounded hover:bg-red-500/30">Veto</button>
                        )}
                      </div>
                  </div>
              )}
            </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-kala-800 flex justify-between items-center">
                 <h3 className="text-white font-bold">Draft New Proposal</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-kala-500 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                    <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Title</label>
                    <input 
                        type="text" 
                        value={newTitle} 
                        onChange={(e) => setNewTitle(e.target.value)} 
                        placeholder="E.g., Fund community hackathon"
                        className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                    />
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Funding Amount (Optional)</label>
                        <input 
                            type="number" 
                            value={fundingAmount} 
                            onChange={(e) => setFundingAmount(e.target.value)} 
                            placeholder="1000"
                            className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Currency</label>
                        <select 
                            value={fundingCurrency} 
                            onChange={(e) => setFundingCurrency(e.target.value)} 
                            className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary h-[42px]"
                        >
                            <option>KALA</option>
                            <option>ETH</option>
                            <option>USDC</option>
                        </select>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Description</label>
                    <textarea 
                      rows={4}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Detail your proposal..."
                      className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary resize-none"
                    />
                 </div>

                 <div className="border-t border-kala-800 pt-4">
                    <label className="block text-xs text-kala-400 font-bold uppercase mb-2 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-purple-400"/> Attach Verified Data</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={artistSearch}
                        onChange={(e) => setArtistSearch(e.target.value)}
                        placeholder="Search for an artist in the KG..."
                        className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
                      />
                      <button onClick={handleArtistSearch} className="px-4 bg-purple-600 rounded-lg hover:bg-purple-500"><Search className="w-4 h-4"/></button>
                    </div>
                    {searchedArtists.length > 0 && (
                      <div className="mt-2 bg-kala-800/50 border border-kala-700 rounded-lg p-2 max-h-40 overflow-y-auto">
                        {searchedArtists.map(artist => (
                          <button key={artist.id} onClick={() => handleAttachArtist(artist as Artist)} className="w-full text-left p-2 hover:bg-kala-700 rounded-md text-sm">
                            <p className="font-bold">{artist.name}</p>
                            <p className="text-kala-400 text-xs">{artist.bio}</p>
                          </button>
                        ))}
                      </div>
                    )}
                 </div>

                 <button 
                   onClick={handleCreateProposal}
                   className="w-full py-3 bg-kala-secondary text-kala-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors"
                 >
                    Submit Proposal
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DaoGovernance;
