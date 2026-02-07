
import React, { useState } from 'react';
import {
    FileSignature, CheckCircle, XCircle, MessageSquare, Search, ShieldCheck, AlertTriangle, Edit
} from 'lucide-react';
import { MOCK_PROPOSALS, MOCK_USERS_BY_ROLE } from '../mockData';
import { UserRole, SmartContractDraft, RosterMember } from '../types';
import ContractEditor from '../components/ContractEditor';
import { useToast } from '../contexts/ToastContext';

interface AdminContract {
    id: string;
    title: string;
    type: 'DAO Proposal' | 'Booking Contract' | 'Service Agreement';
    proposerName: string;
    proposerId: string;
    value: string;
    status: 'Pending' | 'Active' | 'Ratified' | 'Rejected' | 'Negotiation' | 'Pending Review';
    date: string;
    description: string;
    contractData: SmartContractDraft;
}

// Helper to generate dummy contract text
const generateContractText = (title: string, type: string) => {
  return `// SMART CONTRACT DRAFT: ${type.toUpperCase()}
// TITLE: ${title}
// DATE: ${new Date().toISOString()}

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Agreement {
    address public admin;
    address public beneficiary;
    uint256 public value;
    bool public isExecuted;

    constructor(address _beneficiary, uint256 _value) {
        admin = msg.sender;
        beneficiary = _beneficiary;
        value = _value;
    }

    /**
     * @dev Release funds upon milestone completion
     * Validated by KalaKrut Admin Multi-sig
     */
    function release() external {
        require(msg.sender == admin, "Only Admin");
        // Logic for transfer...
    }
}`;
};

const INITIAL_CONTRACTS: AdminContract[] = [
    ...MOCK_PROPOSALS.map(p => ({
        id: p.id,
        title: p.title,
        type: 'DAO Proposal' as const,
        proposerName: p.creator,
        proposerId: 'u_dao',
        value: 'N/A',
        status: (p.status === 'Active' ? 'Pending' : p.status === 'Passed' ? 'Ratified' : 'Rejected') as AdminContract['status'],
        date: p.deadline,
        description: p.description,
        contractData: { id: `c-${p.id}`, contractType: 'IERC-20', content: generateContractText(p.title, 'DAO Proposal'), lastEditedBy: 'User', version: 1, status: 'Pending Review' }
    })),
    {
        id: 'CTR-2023-881',
        title: 'Summer Solstice - Headliner Agreement',
        type: 'Booking Contract',
        proposerName: 'The Warehouse',
        proposerId: 'u_venue',
        value: '5.5 ETH',
        status: 'Pending',
        date: '2023-10-25',
        description: 'Performance contract for Neon Pulse including rider requirements and exclusivity clause.',
        contractData: { id: 'c-CTR-2023-881', contractType: 'Service Agreement', content: generateContractText('Summer Solstice', 'Booking Contract'), lastEditedBy: 'User', version: 1, status: 'Pending Review' }
    }
];

interface AdminContractsProps {
    onChat: (name: string, avatar: string) => void;
    onBlockUser: () => void;
    permissions: any;
    currentUser: RosterMember;
}

const AdminContracts: React.FC<AdminContractsProps> = ({ onChat, onBlockUser, permissions, currentUser }) => {
    const { notify } = useToast();
    const [contracts, setContracts] = useState<AdminContract[]>(INITIAL_CONTRACTS);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [editorOpen, setEditorOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<AdminContract | null>(null);

    const handleDecision = (id: string, decision: 'Ratify' | 'Reject') => {
        if (!permissions.canManageAllContracts) {
            notify('You do not have permission to ratify or reject contracts.', 'error');
            return;
        }
        setContracts(prev => prev.map(c => c.id === id ? { ...c, status: decision === 'Ratify' ? 'Ratified' : 'Rejected' } : c));
        notify(`Contract ${id} has been ${decision === 'Ratify' ? 'Ratified' : 'Rejected'}.`, decision === 'Ratify' ? 'success' : 'info');
    };

    const handleOpenEditor = (contract: AdminContract) => {
        const canEdit = permissions.canManageAllContracts || (permissions.canOnlyManageOwnContracts && contract.proposerName === currentUser.name);
        if (!canEdit) {
            notify('You do not have permission to edit this contract.', 'error');
            return;
        }
        setSelectedContract(contract);
        setEditorOpen(true);
    };

    const handleEditorSave = (newContent: string) => {
        if (selectedContract) {
            const editorRole = currentUser.role === UserRole.SYSTEM_ADMIN_LIVE ? 'SYSTEM_ADMIN_LIVE' : currentUser.role; // Make it explicit
            setContracts(prev => prev.map(c => c.id === selectedContract.id ? { ...c, contractData: { ...c.contractData, content: newContent, lastEditedBy: editorRole, version: c.contractData.version + 1 } } : c));
            notify('Contract draft saved.', 'info');
        }
    };

    const handleEditorStatusChange = (status: any, notes?: string) => {
        if (selectedContract) {
            setContracts(prev => prev.map(c => c.id === selectedContract.id ? { ...c, status: status === 'Active' ? 'Ratified' : status === 'Negotiation' ? 'Pending' : 'Rejected', contractData: { ...c.contractData, status: status, adminNotes: notes } } : c));
            notify(`Contract status updated to: ${status}`, 'success');
        }
    };

    const initiateChat = (contract: AdminContract) => {
        let avatar = 'https://picsum.photos/seed/generic/50';
        const mockUser = Object.values(MOCK_USERS_BY_ROLE).flat().find(u => u.name === contract.proposerName);
        if (mockUser) avatar = mockUser.avatar;
        onChat(contract.proposerName, avatar);
    };

    const filteredContracts = contracts.filter(c => {
        const matchesFilter = filter === 'All' || c.status === filter || (filter === 'Pending' && c.status === 'Negotiation');
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.proposerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><FileSignature className="text-kala-secondary" /> Contracts & Agreements</h2>
                    <p className="text-kala-400 text-sm">Manage, ratify, and edit all DAO proposals and high-value booking contracts.</p>
                </div>
                <div className="flex gap-2 bg-kala-800 p-1 rounded-lg border border-kala-700">
                    {['All', 'Pending', 'Ratified', 'Rejected'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${filter === f ? 'bg-kala-secondary text-kala-900' : 'text-kala-400 hover:text-white'}`}>{f}</button>))}
                </div>
            </div>

            <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-kala-500" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by Contract ID, Title, or Proposer..." className="w-full bg-kala-800/50 border border-kala-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-kala-secondary" /></div>

            <div className="grid grid-cols-1 gap-4">
                {filteredContracts.map((contract) => {
                    const canEditAny = permissions.canManageAllContracts;
                    const canEditOwn = permissions.canOnlyManageOwnContracts && contract.proposerName === currentUser.name;
                    const canEdit = canEditAny || canEditOwn;
                    
                    return (
                        <div key={contract.id} className="bg-kala-800/50 border border-kala-700 rounded-xl p-6 hover:border-kala-500 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${contract.type === 'DAO Proposal' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : contract.type === 'Booking Contract' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>{contract.type}</span>
                                        <span className="text-xs text-kala-500 font-mono">{contract.id}</span>
                                        <span className="text-xs text-kala-500">• {contract.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{contract.title}</h3>
                                    <p className="text-sm text-kala-300 mb-4 max-w-2xl">{contract.description}</p>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2"><span className="text-kala-500">Proposer:</span><span className="text-white font-medium">{contract.proposerName}</span></div>
                                        <div className="flex items-center gap-2"><span className="text-kala-500">Value:</span><span className="text-kala-secondary font-mono font-bold">{contract.value}</span></div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${contract.status === 'Ratified' ? 'bg-green-500/10 text-green-400 border-green-500/20' : contract.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                        {contract.status === 'Ratified' && <ShieldCheck className="w-3 h-3" />}
                                        {contract.status === 'Rejected' && <AlertTriangle className="w-3 h-3" />}
                                        {(contract.status === 'Pending' || contract.status === 'Negotiation') && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />}
                                        {contract.status.toUpperCase()}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => handleOpenEditor(contract)} className={`p-2 bg-kala-800 rounded-lg transition-colors border border-kala-700 ${canEdit ? 'text-kala-300 hover:bg-kala-700 hover:text-white' : 'text-kala-600 cursor-not-allowed'}`} title={canEdit ? "View & Edit Contract" : "You do not have permission to edit this contract"}><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => initiateChat(contract)} className="p-2 bg-kala-800 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-kala-700 hover:border-blue-500" title="Contact Proposer"><MessageSquare className="w-4 h-4" /></button>
                                        {permissions.canManageAllContracts && (contract.status === 'Pending' || contract.status === 'Negotiation') && (
                                            <>
                                                <button onClick={() => handleDecision(contract.id, 'Reject')} className="p-2 bg-kala-800 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-kala-700 hover:border-red-500" title="Reject / Veto"><XCircle className="w-4 h-4" /></button>
                                                <button onClick={() => handleDecision(contract.id, 'Ratify')} className="p-2 bg-kala-800 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-colors border border-kala-700 hover:border-green-500" title="Ratify / Allow"><CheckCircle className="w-4 h-4" /></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                )}
            </div>

            {editorOpen && selectedContract && (
                <ContractEditor 
                    contract={selectedContract.contractData} 
                    userRole={currentUser.role} 
                    onClose={() => setEditorOpen(false)} 
                    onSave={handleEditorSave} 
                    onStatusChange={handleEditorStatusChange} 
                    onBlockUser={onBlockUser}
                    canEdit={permissions.canManageAllContracts || (permissions.canOnlyManageOwnContracts && selectedContract.proposerName === currentUser.name)}
                />
            )}
        </div>
    );
};

export default AdminContracts;
