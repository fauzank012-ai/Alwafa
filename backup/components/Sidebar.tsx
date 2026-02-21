
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isAuthenticated, onLogout }) => {
  const menuItems: { id: ViewState; label: string; icon: string; protected?: boolean }[] = [
    { id: 'dashboard', label: 'Beranda', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'santri', label: 'Santri', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', protected: true },
    { id: 'guru', label: 'Asatidz', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', protected: true },
    { id: 'setoran', label: 'Input', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', protected: true },
    { id: 'leaderboard', label: 'Peringkat', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-emerald-900 text-white min-h-screen flex-col fixed left-0 top-0 shadow-2xl z-50 border-r border-emerald-800">
        <div className="p-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-amber-400 font-arabic text-3xl">الوفاء</span>
            <span className="tracking-tight">Al Wafa</span>
          </h1>
          <p className="text-emerald-300 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold opacity-80">Tahfidz Tracker</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                currentView === item.id
                  ? 'bg-emerald-800 text-white shadow-lg ring-1 ring-white/10'
                  : 'text-emerald-100/70 hover:bg-emerald-800/40 hover:text-white'
              }`}
            >
              <svg className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${currentView === item.id ? 'text-amber-400' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-semibold text-sm">{item.label}</span>
              {item.protected && !isAuthenticated && (
                <svg className="w-3 h-3 text-amber-500 absolute right-4 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-emerald-800/50 bg-emerald-950/30">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isAuthenticated ? 'bg-emerald-800 border-amber-500/50' : 'bg-slate-800 border-slate-700'}`}>
              {isAuthenticated ? 'ADM' : 'GST'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{isAuthenticated ? 'Administrator' : 'Mode Tamu'}</p>
              <p className="text-[10px] text-emerald-400 truncate font-medium">{isAuthenticated ? 'Akses Pengurus' : 'Lihat Data'}</p>
            </div>
          </div>
          
          {isAuthenticated && (
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold text-emerald-100 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-all hover:bg-red-500/10 hover:border-red-500/20"
            >
              Keluar Sesi
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-2 flex justify-around items-center z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              currentView === item.id 
                ? 'text-emerald-700 scale-105' 
                : 'text-slate-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${currentView === item.id ? 'bg-emerald-50' : ''} relative`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
            </div>
            <span className="text-[8px] font-bold mt-1 uppercase tracking-tight text-center leading-none px-0.5">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
