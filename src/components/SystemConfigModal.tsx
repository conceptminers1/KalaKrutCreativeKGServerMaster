
import React from 'react';
import { X, Shield, Zap, Info, AlertTriangle } from 'lucide-react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Switch: React.FC<SwitchProps> = ({ label, ...props }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm font-medium text-slate-300">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only peer" {...props} />
      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
    </div>
  </label>
);

interface SystemConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDemoAvailable: boolean;
  onToggleDemoAvailability: () => void;
  onPurge: () => void;
  isActionAllowed: boolean;
  currentUserRole: string | undefined;
}

export const SystemConfigModal: React.FC<SystemConfigModalProps> = ({
  isOpen,
  onClose,
  isDemoAvailable,
  onToggleDemoAvailability,
  onPurge,
  isActionAllowed,
  currentUserRole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" /> System Configuration
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <Switch
                label="Enable Demo Mode"
                checked={isDemoAvailable}
                onChange={onToggleDemoAvailability}
                disabled={!isActionAllowed}
              />
              <p className="text-xs text-slate-500 mt-2">
                When enabled, users can log in to a "Demo Mode" with pre-loaded sample data.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-red-900/40 border border-red-700/60">
              <div className="flex items-center justify-between">
                  <div className="flex-grow">
                      <h4 className="text-sm font-bold text-red-300">Purge Demo Data</h4>
                      <p className="text-xs text-slate-400 mt-1">
                          Permanently delete all mock users, proposals, and market items from the database.
                      </p>
                  </div>
                  <button 
                      onClick={onPurge}
                      disabled={!isActionAllowed}
                      className="ml-4 px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-500 disabled:bg-red-800/50 disabled:text-red-500/80 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                      <Zap className="w-4 h-4"/> Purge
                  </button>
              </div>
            </div>
          </div>
          
          {!isActionAllowed && (
             <div className="mt-4 p-3 rounded-lg bg-yellow-900/50 border border-yellow-700/80 text-yellow-300 text-xs flex items-center gap-3">
               <Info className="w-4 h-4 flex-shrink-0" />
               <div>
                  <span className="font-bold">Permission Denied.</span> Your role ({currentUserRole || 'N/A'}) does not have permission to change these settings. Access is restricted to designated administrators in Live Mode.
               </div>
             </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 text-slate-300 font-bold rounded-lg hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
