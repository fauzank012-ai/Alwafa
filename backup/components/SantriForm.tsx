
import React, { useState } from 'react';
import { Santri, Guru } from '../types';

interface SantriFormProps {
  onAddSantri: (santri: Santri) => void;
  onAddGuru: (guru: Guru) => void;
  activeTab: 'santri' | 'guru';
}

const SantriForm: React.FC<SantriFormProps> = ({ onAddSantri, onAddGuru, activeTab }) => {
  const [formData, setFormData] = useState({
    name: '',
    className: '',
    asrama: '',
    specialization: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'santri') {
      const newSantri: Santri = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        className: formData.className,
        asrama: formData.asrama,
        totalJuz: 0,
        totalSurah: 0,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      onAddSantri(newSantri);
    } else {
      const newGuru: Guru = {
        id: 'g' + Math.random().toString(36).substr(2, 5),
        name: formData.name,
        specialization: formData.specialization,
      };
      onAddGuru(newGuru);
    }
    setFormData({ name: '', className: '', asrama: '', specialization: '' });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Tambah {activeTab === 'santri' ? 'Santri' : 'Guru'} Baru
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            placeholder="Masukkan nama lengkap..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {activeTab === 'santri' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kelas / Tingkatan</label>
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                >
                  <option value="">Pilih Kelas</option>
                  {[7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={`Kelas ${num}`}>Kelas {num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Asrama</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="Contoh: Madinah"
                  value={formData.asrama}
                  onChange={(e) => setFormData({ ...formData, asrama: e.target.value })}
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Spesialisasi</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="Contoh: Tahfidz, Tahsin, Qiraat..."
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all"
        >
          Simpan Data {activeTab === 'santri' ? 'Santri' : 'Guru'}
        </button>
      </form>
    </div>
  );
};

export default SantriForm;
