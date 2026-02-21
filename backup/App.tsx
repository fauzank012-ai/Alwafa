
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SantriForm from './components/SantriForm';
import SetoranForm from './components/SetoranForm';
import Login from './components/Login';
import { ViewState, Santri, Guru, Setoran } from './types';
import { INITIAL_SANTRI, INITIAL_GURU, INITIAL_SETORAN } from './constants';
import { getSmartInsights, QuotaExceededError } from './services/geminiService'; // Import QuotaExceededError

// Fix: Assuming 'AIStudio' type is already globally available in the environment
// and describes the window.aistudio object. The previous declaration with an
// anonymous object literal was conflicting with this pre-existing named type.
declare global {
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Load initial state from LocalStorage or constants
  const [santriList, setSantriList] = useState<Santri[]>(() => {
    const saved = localStorage.getItem('alwafa_santri');
    return saved ? JSON.parse(saved) : INITIAL_SANTRI;
  });
  
  const [guruList, setGuruList] = useState<Guru[]>(() => {
    const saved = localStorage.getItem('alwafa_guru');
    return saved ? JSON.parse(saved) : INITIAL_GURU;
  });
  
  const [setoranList, setSetoranList] = useState<Setoran[]>(() => {
    const saved = localStorage.getItem('alwafa_setoran');
    return saved ? JSON.parse(saved) : INITIAL_SETORAN;
  });

  const [aiInsight, setAiInsight] = useState<string>('Memuat motivasi pagi...');
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [geminiErrorMessage, setGeminiErrorMessage] = useState('');

  // Save effects
  useEffect(() => {
    localStorage.setItem('alwafa_santri', JSON.stringify(santriList));
  }, [santriList]);

  useEffect(() => {
    localStorage.setItem('alwafa_guru', JSON.stringify(guruList));
  }, [guruList]);

  useEffect(() => {
    localStorage.setItem('alwafa_setoran', JSON.stringify(setoranList));
  }, [setoranList]);

  const fetchInsight = async () => {
    setGeminiErrorMessage(''); // Clear previous errors
    setShowApiKeyPrompt(false); // Hide prompt initially
    if (santriList.length > 0) {
      const sortedSantri = [...santriList].sort((a, b) => b.totalJuz - a.totalJuz);
      const topSantri = sortedSantri[0];
      const latestSetoran = setoranList.filter(s => s.santriId === topSantri.id);
      setAiInsight('Memuat motivasi pagi...'); // Show loading state
      try {
        const insight = await getSmartInsights(topSantri, latestSetoran);
        setAiInsight(insight || 'Terus semangat menghafal Al-Quran!');
      } catch (error) {
        if (error instanceof QuotaExceededError) {
          setShowApiKeyPrompt(true);
          setGeminiErrorMessage("Kuota API terlampaui. Mohon pilih API Key dari proyek berbayar.");
          setAiInsight('Terjadi masalah dengan API Key Anda.');
        } else {
          console.error("Failed to get AI insight:", error);
          setAiInsight('Gagal memuat motivasi. Coba lagi nanti.');
        }
      }
    } else {
      setAiInsight('Selamat datang di Al Wafa. Mari mulai menghafal!');
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [santriList.length, setoranList.length]); // showApiKeyPrompt removed as a dependency here, fetchInsight is called directly after key selection

  const addSantri = (newSantri: Santri) => {
    setSantriList([...santriList, newSantri]);
    setCurrentView('dashboard');
  };

  const addGuru = (newGuru: Guru) => {
    setGuruList([...guruList, newGuru]);
    setCurrentView('dashboard');
  };

  const addSetoran = (newSetoran: Setoran) => {
    const updatedSetoranList = [newSetoran, ...setoranList];
    setSetoranList(updatedSetoranList);

    setSantriList(prev => prev.map(s => {
      if (s.id === newSetoran.santriId) {
        const santriSetorans = updatedSetoranList.filter(st => st.santriId === s.id);
        const uniqueJuzs = new Set(santriSetorans.map(st => st.juz));
        const uniqueSurahs = new Set(santriSetorans.map(st => st.juz + '-' + st.surah)); // Unique by Juz-Surah combo
        
        return {
          ...s,
          totalJuz: uniqueJuzs.size,
          totalSurah: uniqueSurahs.size
        };
      }
      return s;
    }));
    setCurrentView('dashboard');
  };

  const isProtectedView = ['santri', 'guru', 'setoran'].includes(currentView);
  const shouldShowLogin = isProtectedView && !isAuthenticated;

  const handleCloseLogin = () => {
    if (isProtectedView) {
      setCurrentView('dashboard');
    }
  };

  const handleSelectApiKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      setAiInsight('Mengambil motivasi terbaru...'); // Immediate feedback
      await window.aistudio.openSelectKey(); 
      setShowApiKeyPrompt(false); // Hide the prompt
      // Directly re-trigger insight fetch after key selection is done.
      fetchInsight();
    } else {
      alert("Fungsi pemilihan API Key tidak tersedia di lingkungan ini.");
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard santriList={santriList} setoranList={setoranList} />;
      case 'santri':
        return isAuthenticated ? <SantriForm onAddSantri={addSantri} onAddGuru={addGuru} activeTab="santri" /> : <Dashboard santriList={santriList} setoranList={setoranList} />;
      case 'guru':
        return isAuthenticated ? <SantriForm onAddSantri={addSantri} onAddGuru={addGuru} activeTab="guru" /> : <Dashboard santriList={santriList} setoranList={setoranList} />;
      case 'setoran':
        return isAuthenticated ? <SetoranForm santriList={santriList} guruList={guruList} onAddSetoran={addSetoran} setoranList={setoranList} /> : <Dashboard santriList={santriList} setoranList={setoranList} />;
      case 'leaderboard':
        return <Dashboard santriList={santriList} setoranList={setoranList} />;
      default:
        return <Dashboard santriList={santriList} setoranList={setoranList} />;
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Utama';
      case 'santri': return 'Kelola Data Santri';
      case 'guru': return 'Manajemen Asatidz';
      case 'setoran': return 'Input Hafalan Baru';
      case 'leaderboard': return 'Peringkat Hafidz';
      default: return 'Al Wafa Tracker';
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isAuthenticated={isAuthenticated}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentView('dashboard');
        }}
      />
      
      {shouldShowLogin && (
        <Login 
          onLogin={(success) => setIsAuthenticated(success)} 
          onClose={handleCloseLogin}
        />
      )}
      
      <main className="flex-1 md:ml-64 p-4 md:p-10 pb-24 md:pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-1.5 h-8 bg-amber-500 rounded-full hidden md:block"></div>
                {getViewTitle()}
              </h2>
              <p className="hidden md:block text-slate-500 mt-1 text-sm font-medium">Laporan monitoring hafalan Pondok Pesantren Al Wafa.</p>
            </div>
            <div className="md:hidden flex flex-col items-end">
               <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-emerald-800 font-bold text-xl font-arabic">الوفاء</span>
                  <span className="text-emerald-700 font-black text-sm tracking-tight">Al Wafa</span>
               </div>
               <span className="text-emerald-600 font-bold text-[7px] tracking-[0.15em] uppercase opacity-70 mt-0.5">Tahfidz Tracker</span>
            </div>
          </div>
          
          <div className="flex-shrink-0"> {/* Wrapper for the insight card */}
            {showApiKeyPrompt && (
              <div 
                role="alert" 
                aria-live="assertive"
                className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl shadow-sm text-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in fade-in duration-300 relative mb-4"
              >
                <button 
                  onClick={() => setShowApiKeyPrompt(false)}
                  className="absolute top-4 right-4 text-red-300 hover:text-red-500 cursor-pointer p-1 rounded-full hover:bg-red-100 transition-colors"
                  aria-label="Tutup peringatan"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <svg className="w-6 h-6 flex-shrink-0 text-red-500 mt-1 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <div className="flex-1">
                  <p className="font-bold mb-1">Peringatan Kuota API!</p>
                  <p>{geminiErrorMessage || "Kuota API Gemini terlampaui. Mohon pastikan Anda memilih API Key dari proyek Google Cloud yang telah mengaktifkan penagihan."}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button 
                      onClick={handleSelectApiKey}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-red-700 transition-colors"
                    >
                      Pilih API Key Baru
                    </button>
                    <a 
                      href="https://ai.google.dev/gemini-api/docs/billing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-xl text-xs font-bold shadow-sm hover:bg-red-50 transition-colors"
                    >
                      Informasi Billing
                    </a>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white/60 backdrop-blur-md border border-emerald-100 p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700 flex-shrink-0 shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <div className="overflow-hidden relative z-10">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
                  Motivasi Qurani
                  <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                </p>
                <p className="text-[10px] md:text-xs text-slate-700 font-medium italic line-clamp-2 leading-tight">"{aiInsight}"</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>

        {isAuthenticated && currentView !== 'setoran' && (
          <button 
            onClick={() => setCurrentView('setoran')}
            className="hidden md:flex fixed bottom-10 right-10 w-16 h-16 bg-emerald-700 text-white rounded-full shadow-2xl shadow-emerald-200 items-center justify-center hover:bg-emerald-800 hover:scale-110 active:scale-[0.95] transition-all z-40 group border-4 border-white"
          >
            <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            <span className="absolute right-20 bg-emerald-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none shadow-xl">Input Tahfidz</span>
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
