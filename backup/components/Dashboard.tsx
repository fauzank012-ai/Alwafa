
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { Santri, Setoran } from '../types';
import { TOTAL_AYAT_QURAN, STATUS_SCORES, getTargetAyat, TARGET_JUZ } from '../constants';
import SantriDetailModal from './SantriDetailModal';

interface DashboardProps {
  santriList: Santri[];
  setoranList: Setoran[];
}

const Dashboard: React.FC<DashboardProps> = ({ santriList, setoranList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState(''); // New state for class filter
  const [asramaFilter, setAsramaFilter] = useState(''); // New state for dormitory filter
  const [selectedSantriId, setSelectedSantriId] = useState<string | null>(null);

  // Helper untuk menghitung total ayat dari list setoran
  const calculateTotalAyat = (id: string) => {
    return setoranList
      .filter(s => s.santriId === id)
      .reduce((acc, curr) => {
        const parts = curr.ayatRange.split('-');
        const count = parseInt(parts[1]) - parseInt(parts[0]) + 1;
        return acc + count;
      }, 0);
  };

  // Helper untuk menghitung rata-rata skor kualitas
  const calculateAverageScore = (id: string) => {
    const santriSetoran = setoranList.filter(s => s.santriId === id);
    if (santriSetoran.length === 0) return 0;
    const totalScore = santriSetoran.reduce((acc, curr) => acc + (STATUS_SCORES[curr.status] || 0), 0);
    return Math.round(totalScore / santriSetoran.length);
  };

  // Helper untuk menghitung Skor Kumulatif
  const calculateCumulativeScore = (id: string) => {
    return setoranList
      .filter(s => s.santriId === id)
      .reduce((acc, curr) => {
        const parts = curr.ayatRange.split('-');
        const ayatCount = parseInt(parts[1]) - parseInt(parts[0]) + 1;
        const scoreWeight = (STATUS_SCORES[curr.status] || 0) / 100;
        return acc + (ayatCount * scoreWeight);
      }, 0);
  };

  // Generate unique filter options
  const uniqueClasses = useMemo(() => {
    const classes = new Set(santriList.map(s => s.className));
    return ['', ...Array.from(classes)].sort();
  }, [santriList]);

  const uniqueAsramas = useMemo(() => {
    const asramas = new Set(santriList.map(s => s.asrama));
    return ['', ...Array.from(asramas)].sort();
  }, [santriList]);

  // Filter & Process Chart Data
  const filteredSantri = useMemo(() => {
    return santriList.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (classFilter === '' || s.className === classFilter) &&
      (asramaFilter === '' || s.asrama === asramaFilter)
    );
  }, [santriList, searchTerm, classFilter, asramaFilter]);

  const sortedByProgress = useMemo(() => {
    return [...filteredSantri].sort((a, b) => {
      const aProgress = calculateTotalAyat(a.id) / getTargetAyat(a.className);
      const bProgress = calculateTotalAyat(b.id) / getTargetAyat(b.className);
      return bProgress - aProgress;
    });
  }, [filteredSantri, setoranList]);

  const chartData = useMemo(() => {
    return sortedByProgress.slice(0, 8).map(s => {
      const ayat = calculateTotalAyat(s.id);
      const target = getTargetAyat(s.className);
      const score = calculateAverageScore(s.id);
      const cumulative = calculateCumulativeScore(s.id);
      return {
        name: s.name.split(' ')[0],
        persentase: parseFloat(((ayat / target) * 100).toFixed(2)),
        skor: score,
        totalSkor: Math.round(cumulative),
        fullName: s.name
      };
    });
  }, [sortedByProgress, setoranList]);

  const maxPercentage = useMemo(() => {
    const maxVal = Math.max(...chartData.map(data => data.persentase));
    // Set domain max to be slightly above the highest value, or 100 if maxVal is high, or 25 if data is empty/small
    return maxVal > 0 ? (maxVal > 80 ? 100 : Math.ceil(maxVal / 10) * 10 + 10) : 25;
  }, [chartData]);


  const stats = [
    { label: 'Total Santri', value: santriList.length, color: 'bg-blue-600', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { 
      label: 'Rata-rata Hafalan Juz Santri', 
      value: santriList.length > 0 ? `${(santriList.reduce((acc, s) => acc + s.totalJuz, 0) / santriList.length).toFixed(1)} Juz` : '0 Juz', 
      color: 'bg-emerald-600', 
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' 
    },
  ];

  const selectedSantri = useMemo(() => 
    santriList.find(s => s.id === selectedSantriId), 
    [selectedSantriId, santriList]
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-row items-center gap-4">
            <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-slate-100`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Progress % Chart */}
        <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">Capaian Target (%)</h3>
              <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Persentase ayat dihafal vs Target Jenjang (SMP 5J, SMA 10J)</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Progress</span>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} unit="%" domain={[0, maxPercentage]} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                  formatter={(value) => [`${value}%`, 'Capaian Target']}
                />
                <Bar dataKey="persentase" radius={[6, 6, 0, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#059669" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Nilai (Kumulatif) Chart */}
        <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">Skor Total (Ayat x Nilai)</h3>
              <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Nilai kumulatif berdasarkan kuantitas & kualitas</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Total Value</span>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSkorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                  formatter={(value) => [`${value} Pts`, 'Skor Kumulatif']}
                />
                <Area type="monotone" dataKey="totalSkor" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSkorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 md:gap-0">
            <h3 className="text-base md:text-lg font-bold text-slate-900">Monitoring Target Hafalan</h3>
            <div className="flex flex-col gap-3 w-full md:w-auto"> {/* Wrapper for filters and search */}
              <div className="flex flex-row gap-3 w-full"> {/* Filters row: now always flex-row */}
                {/* Class Filter */}
                <div className="relative flex-1">
                  <select
                    className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                  >
                    <option value="">Semua Kelas</option>
                    {uniqueClasses.map(cls => cls && <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {/* Asrama Filter */}
                <div className="relative flex-1">
                  <select
                    className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    value={asramaFilter}
                    onChange={(e) => setAsramaFilter(e.target.value)}
                  >
                    <option value="">Semua Asrama</option>
                    {uniqueAsramas.map(asrama => asrama && <option key={asrama} value={asrama}>{asrama}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Search input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari nama santri..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Rank</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Santri</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">Capaian Target</th>
                </tr>
              </thead>
              <tbody>
                {sortedByProgress.map((santri, idx) => {
                  const ayat = calculateTotalAyat(santri.id);
                  const target = getTargetAyat(santri.className);
                  const progress = ((ayat / target) * 100).toFixed(2);
                  // const isSMP = parseInt(santri.className.replace(/\D/g, '')) <= 9; // Not needed for display

                  return (
                    <tr key={santri.id} className="border-b border-slate-100 hover:bg-slate-50/50 even:bg-slate-50 transition-all group">
                      <td className="py-3 px-4">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-sm ${idx < 3 ? 'bg-amber-100 text-amber-700 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                          {idx + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setSelectedSantriId(santri.id)}
                          className="cursor-pointer hover:text-emerald-700 transition-colors"
                        >
                          <p className="text-base font-semibold text-slate-800 leading-tight">{santri.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{santri.className} • {santri.asrama}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                           <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${parseFloat(progress) >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(parseFloat(progress), 100)}%` }}></div>
                           </div>
                           <span className={`text-xs font-black ${parseFloat(progress) >= 100 ? 'text-emerald-700' : 'text-blue-700'}`}>{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      </div>

      {/* Detail Modal */}
      {selectedSantri && (
        <SantriDetailModal 
          santri={selectedSantri} 
          setoranList={setoranList.filter(s => s.santriId === selectedSantri.id)}
          onClose={() => setSelectedSantriId(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
    
