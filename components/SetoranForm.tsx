import React, { useState, useEffect } from 'react';
import { Santri, Guru, Setoran } from '../types';
import { SURAH_DATA, getHafizSequence } from '../constants';

interface SetoranFormProps {
  santriList: Santri[];
  guruList: Guru[];
  onAddSetoran: (setoran: Setoran) => void;
  setoranList: Setoran[];
}

const SetoranForm: React.FC<SetoranFormProps> = ({ santriList, guruList, onAddSetoran, setoranList }) => {
  const [formData, setFormData] = useState({
    santriId: '',
    guruId: '',
    surah: 'An-Nas',
    juz: 30,
    startAyat: 1,
    endAyat: 6,
    status: '' as Setoran['status'] | '',
    notes: ''
  });

  const sequence = getHafizSequence();

  // Efek untuk mengisi otomatis saat Santri dipilih
  useEffect(() => {
    if (!formData.santriId) return;

    // Cari setoran terakhir santri ini
    const lastSetoran = setoranList
      .filter(s => s.santriId === formData.santriId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (lastSetoran) {
      const currentSurah = SURAH_DATA.find(s => s.name === lastSetoran.surah);
      if (currentSurah) {
        // Ambil ayat terakhir dari range (misal "1-7" -> 7)
        const lastAyatStr = lastSetoran.ayatRange.split('-')[1];
        const lastAyat = parseInt(lastAyatStr);

        if (lastAyat < currentSurah.totalAyah) {
          // Jika belum selesai satu surat, lanjut ayat berikutnya
          setFormData(prev => ({
            ...prev,
            surah: lastSetoran.surah,
            juz: lastSetoran.juz,
            startAyat: lastAyat + 1,
            endAyat: currentSurah.totalAyah
          }));
        } else {
          // Jika sudah selesai, cari surat berikutnya dalam sekuens
          const currentIndex = sequence.indexOf(lastSetoran.surah);
          const nextSurahName = sequence[currentIndex + 1] || sequence[0];
          const nextSurah = SURAH_DATA.find(s => s.name === nextSurahName);
          
          if (nextSurah) {
            setFormData(prev => ({
              ...prev,
              surah: nextSurah.name,
              juz: nextSurah.juz,
              startAyat: 1,
              endAyat: nextSurah.totalAyah
            }));
          }
        }
      }
    } else {
      // Jika belum pernah setoran, default ke An-Nas (Awal Sekuens)
      const firstSurah = SURAH_DATA.find(s => s.name === sequence[0]);
      if (firstSurah) {
        setFormData(prev => ({
          ...prev,
          surah: firstSurah.name,
          juz: firstSurah.juz,
          startAyat: 1,
          endAyat: firstSurah.totalAyah
        }));
      }
    }
  }, [formData.santriId, setoranList]);

  // Update juz dan ayat saat surah diubah manual
  const handleSurahChange = (surahName: string) => {
    const meta = SURAH_DATA.find(s => s.name === surahName);
    if (meta) {
      setFormData({
        ...formData,
        surah: surahName,
        juz: meta.juz,
        startAyat: 1,
        endAyat: meta.totalAyah
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.santriId || !formData.guruId) return;
    if (!formData.status) {
      alert('Mohon pilih kualitas hafalan');
      return;
    }
    const newSetoran: Setoran = {
      id: Math.random().toString(36).substr(2, 9),
      santriId: formData.santriId,
      guruId: formData.guruId,
      surah: formData.surah,
      juz: formData.juz,
      ayatRange: `${formData.startAyat}-${formData.endAyat}`,
      date: new Date().toISOString().split('T')[0],
      status: formData.status as Setoran['status'],
      notes: formData.notes
    };
    onAddSetoran(newSetoran);
    setFormData({ ...formData, notes: '', status: '' });
  };

  const currentSurahMetadata = SURAH_DATA.find(s => s.name === formData.surah);
  const ayatOptions = Array.from({ length: currentSurahMetadata?.totalAyah || 0 }, (_, i) => i + 1);

  const statusOptions: Setoran['status'][] = [
    'Mumtaz (Istimewa)',
    'Jayyid Jiddan (Sangat Baik)',
    'Jayyid (Baik)',
    'Maqbul (Cukup)',
    'Naqish/Mardud (Kurang/Ditolak)'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">Input Setoran</h2>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase tracking-widest">
            Sistem Auto-Next
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Santri</label>
              <select
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                value={formData.santriId}
                onChange={(e) => setFormData({...formData, santriId: e.target.value})}
              >
                <option value="">Pilih Nama Santri</option>
                {santriList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Guru Penguji</label>
              <select
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                value={formData.guruId}
                onChange={(e) => setFormData({...formData, guruId: e.target.value})}
              >
                <option value="">Pilih Guru</option>
                {guruList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Surah</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-xs md:text-sm"
                value={formData.surah}
                onChange={(e) => handleSurahChange(e.target.value)}
              >
                {sequence.map(name => {
                  const s = SURAH_DATA.find(sd => sd.name === name);
                  return <option key={name} value={name}>{name} ({s?.arabic})</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Juz</label>
              <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold text-center text-sm">
                {formData.juz}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Dari Ayat</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.startAyat}
                onChange={(e) => setFormData({...formData, startAyat: parseInt(e.target.value)})}
              >
                {ayatOptions.map(num => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sampai Ayat</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.endAyat}
                onChange={(e) => setFormData({...formData, endAyat: parseInt(e.target.value)})}
              >
                {ayatOptions.map(num => (
                  <option key={num} value={num} disabled={num < formData.startAyat}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kualitas Hafalan</label>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({...formData, status: status})}
                  className={`w-full py-2.5 px-4 text-[10px] md:text-xs font-bold rounded-xl border text-left transition-all ${
                    formData.status === status 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/10' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{status}</span>
                    {formData.status === status && <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-50 hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            Simpan Setoran
          </button>
        </form>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 md:w-32 h-24 md:h-32 bg-emerald-500/20 rounded-full blur-2xl" />
          <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">Preview Kurikulum</h3>
          <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Tahap Saat Ini:</span>
              <span className="font-bold">{formData.juz >= 26 ? 'Tahap Dasar (Juz 26-30)' : 'Tahap Lanjutan (Juz 1-25)'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Ayat Surah:</span>
              <span className="font-bold">{currentSurahMetadata?.totalAyah} Ayat</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Setoran Sekarang:</span>
              <span className="text-emerald-400 font-bold">{formData.endAyat - formData.startAyat + 1} Ayat</span>
            </div>
          </div>
          
          <div className="p-4 border-l-4 border-emerald-500 bg-emerald-500/10 rounded-r-xl">
             <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Catatan Sistem</p>
             <p className="text-xs text-slate-300 leading-relaxed">Sistem secara otomatis menyesuaikan Surah dan Ayat berdasarkan setoran terakhir santri agar kurikulum tetap terjaga.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetoranForm;
