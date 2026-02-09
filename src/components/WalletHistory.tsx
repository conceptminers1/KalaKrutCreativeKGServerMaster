
import React from 'react';
import { Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight, Fuel, RefreshCw, ExternalLink } from 'lucide-react';

export const MOCK_HISTORY: Transaction[] = [
  { id: '1', type: 'Incoming', description: 'Payment for Gig #882', amount: '+0.85', currency: 'ETH', date: '2023-10-14', status: 'Completed', hash: '0x32...a1b2' },
  { id: '2', type: 'Gas', description: 'Contract Deployment (Event)', amount: '-0.012', currency: 'ETH', date: '2023-10-13', status: 'Completed', hash: '0x99...c3d4' },
  { id: '3', type: 'Mint', description: 'Minted NFT: "Neon Rain"', amount: '-0.05', currency: 'ETH', date: '2023-10-12', status: 'Completed', hash: '0x55...e6f7' },
  { id: '4', type: 'Outgoing', description: 'DAO Membership Fee', amount: '-500', currency: 'KALA', date: '2023-10-10', status: 'Completed', hash: '0x11...g8h9' },
  { id: '5', type: 'Swap', description: 'Swap ETH to USDC', amount: '250', currency: 'USDC', date: '2023-10-09', status: 'Pending', hash: '0x77...i0j1' }
];

const WalletHistory: React.FC = () => {
  return (
    <div className="bg-kala-900 border border-kala-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-kala-700 bg-kala-800/50 flex justify-between items-center">
         <h3 className="font-bold text-white">Transaction History</h3>
         <button className="text-xs text-kala-400 hover:text-white flex items-center gap-1">
           View on Etherscan <ExternalLink className="w-3 h-3" />
         </button>
      </div>
      <div className="divide-y divide-kala-800">
         {MOCK_HISTORY.map((tx) => (
           <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-kala-800/30 transition-colors">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-full ${
                    tx.type === 'Incoming' ? 'bg-green-500/20 text-green-400' :
                    tx.type === 'Outgoing' ? 'bg-red-500/20 text-red-400' :
                    tx.type === 'Mint' ? 'bg-purple-500/20 text-purple-400' :
                    tx.type === 'Gas' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                 }`}>
                    {tx.type === 'Incoming' ? <ArrowDownLeft className="w-4 h-4" /> :
                     tx.type === 'Outgoing' ? <ArrowUpRight className="w-4 h-4" /> :
                     tx.type === 'Mint' ? <RefreshCw className="w-4 h-4" /> :
                     tx.type === 'Gas' ? <Fuel className="w-4 h-4" /> :
                     <RefreshCw className="w-4 h-4" />}
                 </div>
                 <div>
                    <div className="text-sm font-medium text-white">{tx.description}</div>
                    <div className="text-xs text-kala-500">{tx.date} • {tx.status}</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className={`text-sm font-mono font-bold ${
                    tx.amount.startsWith('+') ? 'text-green-400' : 'text-slate-200'
                 }`}>
                    {tx.amount} {tx.currency}
                 </div>
                 <div className="text-[10px] text-kala-600 font-mono truncate w-20 ml-auto">
                    {tx.hash}
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default WalletHistory;