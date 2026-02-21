
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Santri, Setoran } from '../types';
import { SURAH_DATA, getTargetAyat, AVG_AYAT_PER_JUZ } from '../constants';

interface SantriDetailModalProps {
  santri: Santri;
  setoranList: Setoran[];
  onClose: () => void;
}

const SantriDetailModal: React.FC<SantriDetailModalProps> = ({ santri, setoranList, onClose }) => {
  // Logic Hafz Calc & Analisis Progres
  const analysisData = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const weeklyProgress = last7Days.map(date => {
      const count = setoranList
        .filter(s => s.date === date)
        .reduce((acc, curr) => {
          const parts = curr.ayatRange.split('-');
          return acc + (parseInt(parts[1]) - parseInt(parts[0]) + 1);
        }, 0);
      return { date: date.split('-')[2], ayat: count };
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const totalAyat30Days = setoranList
      .filter(s => new Date(s.date) >= thirtyDaysAgo)
      .reduce((acc, curr) => {
        const parts = curr.ayatRange.split('-');
        return acc + (parseInt(parts[1]) - parseInt(parts[0]) + 1);
      }, 0);
    
    const speedPerDay = totalAyat30Days / 30;

    const targetAyat = getTargetAyat(santri.className);
    const currentProgressAyat = setoranList.reduce((acc, curr) => {
      const parts = curr.ayatRange.split('-');
      return acc + (parseInt(parts[1]) - parseInt(parts[0]) + 1);
    }, 0);
    
    const remainingAyatTarget = Math.max(0, targetAyat - currentProgressAyat);

    const daysToFinishTarget = speedPerDay > 0 ? Math.ceil(remainingAyatTarget / speedPerDay) : Infinity;
    const daysToFinishJuz = speedPerDay > 0 ? Math.ceil(AVG_AYAT_PER_JUZ / speedPerDay) : Infinity;

    const lastSetoran = [...setoranList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const currentSurahMeta = SURAH_DATA.find(s => s.name === lastSetoran?.surah);
    
    let daysToFinishSurah = 0;
    if (lastSetoran && currentSurahMeta) {
      const currentVerse = parseInt(lastSetoran.ayatRange.split('-')[1]);
      const remainingInSurah = currentSurahMeta.totalAyah - currentVerse;
      daysToFinishSurah = speedPerDay > 0 ? Math.ceil(remainingInSurah / speedPerDay) : Infinity;
    }

    const isSMP = parseInt(santri.className.replace(/\D/g, '')) <= 9;

    return {
      weeklyProgress,
      speedPerDay: speedPerDay.toFixed(1),
      estimates: {
        surah: daysToFinishSurah,
        juz: daysToFinishJuz,
        target: daysToFinishTarget,
        surahName: lastSetoran?.surah || 'N/A',
        targetLabel: isSMP ? 'Target 5 Juz (SMP)' : 'Target 10 Juz (SMA)'
      }
    };
  }, [setoranList, santri]);

  const formatDate = (days: number) => {
    if (days === Infinity) return "Data tidak cukup";
    if (days === 0) return "Selesai hari ini";
    if (days < 30) return `${days} Hari`;
    if (days < 365) return `${Math.floor(days / 30)} Bulan ${days % 30} Hari`;
    return `${Math.floor(days / 365)} Tahun ${Math.floor((days % 365) / 30)} Bulan`;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden relative my-auto animate-in zoom-in-95 duration-300">
        
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none rotate-12 -mr-20 -mt-20">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
        </div>

        <div className="bg-emerald-900 p-8 md:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-emerald-950 font-arabic text-3xl md:text-4xl shadow-xl shadow-emerald-950/20 border-4 border-emerald-800">
              {santri.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{santri.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">{santri.className}</span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">{santri.asrama}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-xl"
            aria-label="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-600 rounded-full"></span>
                  Analisis Progres Mingguan
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">7 Hari Terakhir</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysisData.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px'}}
                    />
                    <Bar dataKey="ayat" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kecepatan Hafalan</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-black text-slate-900">{analysisData.speedPerDay}</h4>
                  <p className="text-xs font-bold text-slate-500">Ayat / Hari</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative z-10">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-100 rounded-full blur-3xl opacity-50 transition-transform group-hover:scale-150"></div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-500 rounded-full"></span>
              Hafz Calc: Estimasi Selesai
            </h3>
            
            <div className="grid gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Target Terdekat</p>
                    <h5 className="font-bold text-slate-800">Selesaikan Surah {analysisData.estimates.surahName}</h5>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Estimasi</div>
                </div>
                <div className="text-xl font-black text-emerald-800 mb-1 group-hover:text-emerald-600 transition-colors">
                  {formatDate(analysisData.estimates.surah)}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Target Juz Aktif</p>
                    <h5 className="font-bold text-slate-800">Menyelesaikan 1 Juz (Rerata)</h5>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Estimasi</div>
                </div>
                <div className="text-xl font-black text-blue-800 mb-1">
                  {formatDate(analysisData.estimates.juz)}
                </div>
              </div>

              <div className="bg-amber-600 p-6 rounded-3xl shadow-xl shadow-amber-900/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-amber-200 uppercase tracking-widest mb-1">Capaian Kurikulum</p>
                  <h5 className="font-bold text-white mb-4">{analysisData.estimates.targetLabel}</h5>
                  <div className="text-3xl font-black text-white mb-2">
                    {analysisData.estimates.target === 0 ? 'Target Tercapai!' : formatDate(analysisData.estimates.target)}
                  </div>
                  <p className="text-[10px] text-amber-100 font-medium leading-tight">
                    Estimasi ini menyesuaikan dengan target minimal hafalan jenjang pendidikan santri.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center md:text-left max-w-md">
             Analisis ini dihitung berdasarkan target kurikulum Al Wafa (SMP: 5 Juz, SMA: 10 Juz). Data bersifat dinamis mengikuti grafik setoran harian.
           </p>
           <button
             onClick={onClose}
             className="w-full md:w-auto px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
           >
             Tutup Analisis
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
        </div>
      </div>
    </div>
  );
};

export default SantriDetailModal;
