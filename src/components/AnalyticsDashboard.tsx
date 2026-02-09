
import React from 'react';
import { BarChart3, Users, DollarSign, Activity, Briefcase, Handshake } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  // Data is hardcoded for this mock. In a real app, this would come from an API.
  const stats = {
    totalUsers: { value: 10, change: '+233%' },
    volume30d: { value: 8190, change: '+555%' },
    activeDaos: { value: 1, change: 'New' },
    gigsBooked: { value: 7, change: '+75%' },
  };

  const recentTransactions = [
    {
      id: 'txn1',
      description: 'Venue Booking: The Grand Hall',
      time: '1 day ago',
      amount: 2500,
      type: 'credit',
      icon: Briefcase
    },
    {
      id: 'txn2',
      description: 'Sponsorship Payout: Soundwave Audio',
      time: '2 days ago',
      amount: 5000,
      type: 'credit',
      icon: Handshake
    },
    {
      id: 'txn3',
      description: 'Artist Payment: Alex Ray',
      time: '2 days ago',
      amount: 850,
      type: 'credit',
      icon: Users
    },
     {
      id: 'txn4',
      description: 'Platform Fee',
      time: '2 days ago',
      amount: 120,
      type: 'debit',
      icon: Activity
    }
  ];

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white flex items-center gap-2">
         <Activity className="text-kala-secondary" /> Platform Analytics
       </h2>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Members" value={stats.totalUsers.value} change={stats.totalUsers.change} icon={Users} />
          <StatCard label="Volume (30d)" value={`$${stats.volume30d.value.toLocaleString()}`} change={stats.volume30d.change} icon={DollarSign} />
          <StatCard label="Active DAOs" value={stats.activeDaos.value} change={stats.activeDaos.change} icon={Activity} />
          <StatCard label="Market Conversions" value={stats.gigsBooked.value} change={stats.gigsBooked.change} icon={BarChart3} />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6 h-80 flex flex-col justify-center items-center">
           <p className="text-kala-400 text-sm mb-4">User Growth (Last 6 Months)</p>
           <div className="w-full h-full flex items-end justify-between gap-2 px-4 pt-4">
             {[1, 2, 2, 3, 5, 10].map((h, i) => (
               <div key={i} className="w-full bg-kala-secondary/20 hover:bg-kala-secondary/40 rounded-t-lg transition-colors relative group">
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-kala-900 px-2 py-1 rounded text-white text-xs">{h}</div>
                 <div className="absolute bottom-0 w-full bg-kala-secondary" style={{ height: `${h * 10}%` }}></div>
               </div>
             ))}
           </div>
         </div>

         <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-3 bg-kala-900/50 rounded-lg border border-kala-800/60">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      <tx.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-200 font-medium">{tx.description}</div>
                      <div className="text-xs text-kala-500">{tx.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-mono ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
       </div>
    </div>
  );
};

const StatCard = ({ label, value, change, icon: Icon }: any) => (
  <div className="bg-kala-800/70 border border-kala-700 rounded-xl p-4 transform transition-all hover:-translate-y-1 hover:border-kala-500 hover:bg-kala-800">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-kala-700/50 rounded-lg text-kala-400">
        <Icon className="w-5 h-5" />
      </div>
      {change && (
        <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">{change}</span>
      )}
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="text-xs text-kala-400">{label}</div>
  </div>
);

export default AnalyticsDashboard;
