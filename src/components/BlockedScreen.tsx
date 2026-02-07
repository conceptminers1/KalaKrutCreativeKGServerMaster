
import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

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

export default BlockedScreen;
