
export interface Santri {
  id: string;
  name: string;
  className: string;
  asrama: string;
  totalJuz: number;
  totalSurah: number;
  joinedDate: string;
}

export interface Guru {
  id: string;
  name: string;
  specialization: string;
}

export interface Setoran {
  id: string;
  santriId: string;
  guruId: string;
  surah: string;
  juz: number;
  ayatRange: string;
  date: string;
  status: 'Mumtaz (Istimewa)' | 'Jayyid Jiddan (Sangat Baik)' | 'Jayyid (Baik)' | 'Maqbul (Cukup)' | 'Naqish/Mardud (Kurang/Ditolak)';
  notes?: string;
}

export type ViewState = 'dashboard' | 'santri' | 'guru' | 'setoran' | 'leaderboard';
