
import React from 'react';
import { Santri, Guru, Setoran } from './types';

export const TOTAL_AYAT_QURAN = 6236;
export const AVG_AYAT_PER_JUZ = 208; // Estimasi rata-rata ayat per juz

export const TARGET_JUZ = {
  SMP: 5,
  SMA: 10
};

// Data dikosongkan untuk penggunaan produksi/bersih
export const INITIAL_SANTRI: Santri[] = [
  {
    id: 's001',
    name: 'Ahmad Fikri',
    className: 'Kelas 8',
    asrama: 'Madinah',
    totalJuz: 3,
    totalSurah: 15,
    joinedDate: '2022-09-01',
  },
  {
    id: 's002',
    name: 'Siti Aminah',
    className: 'Kelas 9',
    asrama: 'Mekkah',
    totalJuz: 5,
    totalSurah: 25,
    joinedDate: '2022-09-01',
  },
  {
    id: 's003',
    name: 'Muhammad Faiz',
    className: 'Kelas 7',
    asrama: 'Jeddah',
    totalJuz: 1,
    totalSurah: 7,
    joinedDate: '2023-01-15',
  },
  {
    id: 's004',
    name: 'Nurul Hidayah',
    className: 'Kelas 10',
    asrama: 'Kairo',
    totalJuz: 7,
    totalSurah: 35,
    joinedDate: '2021-07-01',
  },
  {
    id: 's005',
    name: 'Abdullah Rasyid',
    className: 'Kelas 11',
    asrama: 'Madinah',
    totalJuz: 9,
    totalSurah: 40,
    joinedDate: '2021-07-01',
  },
  {
    id: 's006',
    name: 'Fatimah Az-Zahra',
    className: 'Kelas 12',
    asrama: 'Mekkah',
    totalJuz: 12,
    totalSurah: 50,
    joinedDate: '2020-07-01',
  },
  {
    id: 's007',
    name: 'Hasan Basri',
    className: 'Kelas 8',
    asrama: 'Jeddah',
    totalJuz: 2,
    totalSurah: 10,
    joinedDate: '2023-09-01',
  },
  {
    id: 's008',
    name: 'Zainab Hamidah',
    className: 'Kelas 7',
    asrama: 'Kairo',
    totalJuz: 0,
    totalSurah: 0,
    joinedDate: '2024-01-01',
  },
  {
    id: 's009',
    name: 'Umar Faruq',
    className: 'Kelas 9',
    asrama: 'Madinah',
    totalJuz: 4,
    totalSurah: 20,
    joinedDate: '2022-01-01',
  },
  {
    id: 's010',
    name: 'Aisyah Humaira',
    className: 'Kelas 10',
    asrama: 'Mekkah',
    totalJuz: 6,
    totalSurah: 30,
    joinedDate: '2021-01-01',
  },
];

export const INITIAL_GURU: Guru[] = [
  {
    id: 'g001',
    name: 'Ustadz Harun Ar-Rasyid',
    specialization: 'Tahfidz Al-Quran',
  },
  {
    id: 'g002',
    name: 'Ustadzah Khadijah',
    specialization: 'Tajwid & Gharib',
  },
  {
    id: 'g003',
    name: 'Ustadz Yusuf Ali',
    specialization: 'Murojaah & Sanad',
  },
  {
    id: 'g004',
    name: 'Ustadzah Fatimah',
    specialization: 'Qiraat Sab\'ah',
  },
];

export const INITIAL_SETORAN: Setoran[] = [];

export const STATUS_SCORES: Record<Setoran['status'], number> = {
  'Mumtaz (Istimewa)': 100,
  'Jayyid Jiddan (Sangat Baik)': 85,
  'Jayyid (Baik)': 75,
  'Maqbul (Cukup)': 60,
  'Naqish/Mardud (Kurang/Ditolak)': 40
};

export interface SurahMetadata {
  name: string;
  arabic: string;
  totalAyah: number;
  juz: number;
}

export const SURAH_DATA: SurahMetadata[] = [
  { name: "Al-Fatihah", arabic: "الفاتحة", totalAyah: 7, juz: 1 },
  { name: "Al-Baqarah", arabic: "البقرة", totalAyah: 286, juz: 1 },
  { name: "Ali 'Imran", arabic: "آل عمران", totalAyah: 200, juz: 3 },
  { name: "An-Nisa'", arabic: "النساء", totalAyah: 176, juz: 4 },
  { name: "Al-Ma'idah", arabic: "المائدة", totalAyah: 120, juz: 6 },
  { name: "Al-An'am", arabic: "الأنعام", totalAyah: 165, juz: 7 },
  { name: "Al-A'raf", arabic: "الأعراف", totalAyah: 206, juz: 8 },
  { name: "Al-Anfal", arabic: "الأنfāl", totalAyah: 75, juz: 9 },
  { name: "At-Tawbah", arabic: "التوبة", totalAyah: 129, juz: 10 },
  { name: "Yunus", arabic: "يونس", totalAyah: 109, juz: 11 },
  { name: "Hud", arabic: "هود", totalAyah: 123, juz: 11 },
  { name: "Yusuf", arabic: "يوسف", totalAyah: 111, juz: 12 },
  { name: "Ar-Ra'd", arabic: "الرعد", totalAyah: 43, juz: 13 },
  { name: "Ibrahim", arabic: "إبراهيم", totalAyah: 52, juz: 13 },
  { name: "Al-Hijr", arabic: "الحجر", totalAyah: 99, juz: 14 },
  { name: "An-Nahl", arabic: "النحل", totalAyah: 128, juz: 14 },
  { name: "Al-Isra'", arabic: "الإسراء", totalAyah: 111, juz: 15 },
  { name: "Al-Kahf", arabic: "الkahf", totalAyah: 110, juz: 15 },
  { name: "Maryam", arabic: "مريم", totalAyah: 98, juz: 16 },
  { name: "Ta-Ha", arabic: "طه", totalAyah: 135, juz: 16 },
  { name: "Al-Anbiya'", arabic: "الأنبياء", totalAyah: 112, juz: 17 },
  { name: "Al-Hajj", arabic: "الحج", totalAyah: 78, juz: 17 },
  { name: "Al-Mu'minun", arabic: "المؤمنون", totalAyah: 118, juz: 18 },
  { name: "An-Nur", arabic: "النور", totalAyah: 64, juz: 18 },
  { name: "Al-Furqan", arabic: "الfurqan", totalAyah: 77, juz: 18 },
  { name: "Ash-Shu'ara'", arabic: "الشعراء", totalAyah: 227, juz: 19 },
  { name: "An-Naml", arabic: "النمل", totalAyah: 93, juz: 19 },
  { name: "Al-Qasas", arabic: "القصص", totalAyah: 88, juz: 20 },
  { name: "Al-'Ankabut", arabic: "العنكبut", totalAyah: 69, juz: 20 },
  { name: "Ar-Rum", arabic: "الروم", totalAyah: 60, juz: 21 },
  { name: "Luqman", arabic: "لقمان", totalAyah: 34, juz: 21 },
  { name: "As-Sajdah", arabic: "السجدة", totalAyah: 30, juz: 21 },
  { name: "Al-Ahzab", arabic: "الأحزاب", totalAyah: 73, juz: 21 },
  { name: "Saba'", arabic: "سبأ", totalAyah: 54, juz: 22 },
  { name: "Fatir", arabic: "فاطر", totalAyah: 45, juz: 22 },
  { name: "Ya-Sin", arabic: "يس", totalAyah: 83, juz: 22 },
  { name: "As-Saffat", arabic: "الصافات", totalAyah: 182, juz: 23 },
  { name: "Sad", arabic: "ص", totalAyah: 88, juz: 23 },
  { name: "Az-Zumar", arabic: "الزمر", totalAyah: 75, juz: 23 },
  { name: "Ghafir", arabic: "غافر", totalAyah: 85, juz: 24 },
  { name: "Fussilat", arabic: "فصلt", totalAyah: 54, juz: 24 },
  { name: "Ash-Shura", arabic: "الشورى", totalAyah: 53, juz: 25 },
  { name: "Az-Zukhruf", arabic: "الزخرف", totalAyah: 89, juz: 25 },
  { name: "Ad-Dukhan", arabic: "الدخان", totalAyah: 59, juz: 25 },
  { name: "Al-Jathiyah", arabic: "الجاثية", totalAyah: 37, juz: 25 },
  { name: "Al-Ahqaf", arabic: "الأحقaf", totalAyah: 35, juz: 26 },
  { name: "Muhammad", arabic: "محمد", totalAyah: 38, juz: 26 },
  { name: "Al-Fath", arabic: "الفتح", totalAyah: 29, juz: 26 },
  { name: "Al-Hujurat", arabic: "الحجرات", totalAyah: 18, juz: 26 },
  { name: "Qaf", arabic: "ق", totalAyah: 45, juz: 26 },
  { name: "Adh-Dhariyat", arabic: "الذاريات", totalAyah: 60, juz: 26 },
  { name: "At-Tur", arabic: "الطور", totalAyah: 49, juz: 27 },
  { name: "An-Najm", arabic: "النجم", totalAyah: 62, juz: 27 },
  { name: "Al-Qamar", arabic: "القمر", totalAyah: 55, juz: 27 },
  { name: "Ar-Rahman", arabic: "الرحمن", totalAyah: 78, juz: 27 },
  { name: "Al-Waqi'ah", arabic: "الواقعة", totalAyah: 96, juz: 27 },
  { name: "Al-Hadid", arabic: "الحديد", totalAyah: 29, juz: 27 },
  { name: "Al-Mujadilah", arabic: "المجادلة", totalAyah: 22, juz: 28 },
  { name: "Al-Hashr", arabic: "الحشر", totalAyah: 24, juz: 28 },
  { name: "Al-Mumtahanah", arabic: "المmuntahanah", totalAyah: 13, juz: 28 },
  { name: "As-Saff", arabic: "الصف", totalAyah: 14, juz: 28 },
  { name: "Al-Jumu'ah", arabic: "الجمعة", totalAyah: 11, juz: 28 },
  { name: "Al-Munafiqun", arabic: "المنافقون", totalAyah: 11, juz: 28 },
  { name: "At-Taghabun", arabic: "التغابن", totalAyah: 18, juz: 28 },
  { name: "At-Talaq", arabic: "الطلاق", totalAyah: 12, juz: 28 },
  { name: "At-Tahrim", arabic: "التحريم", totalAyah: 12, juz: 28 },
  { name: "Al-Mulk", arabic: "الملك", totalAyah: 30, juz: 29 },
  { name: "Al-Qalam", arabic: "القلم", totalAyah: 52, juz: 29 },
  { name: "Al-Haqqah", arabic: "الحاقة", totalAyah: 52, juz: 29 },
  { name: "Al-Ma'arij", arabic: "المعارج", totalAyah: 44, juz: 29 },
  { name: "Nuh", arabic: "نوح", totalAyah: 28, juz: 29 },
  { name: "Al-Jinn", arabic: "الجن", totalAyah: 28, juz: 29 },
  { name: "Al-Muzzammil", arabic: "المزمل", totalAyah: 20, juz: 29 },
  { name: "Al-Muddaththir", arabic: "المدثر", totalAyah: 56, juz: 29 },
  { name: "Al-Qiyamah", arabic: "القيامة", totalAyah: 40, juz: 29 },
  { name: "Al-Insan", arabic: "الإنسان", totalAyah: 31, juz: 29 },
  { name: "Al-Mursalat", arabic: "المرسلات", totalAyah: 50, juz: 29 },
  { name: "An-Naba'", arabic: "النبأ", totalAyah: 40, juz: 30 },
  { name: "An-Nazi'at", arabic: "النازعات", totalAyah: 46, juz: 30 },
  { name: "Abasa", arabic: "عبس", totalAyah: 42, juz: 30 },
  { name: "At-Takwir", arabic: "التكوير", totalAyah: 29, juz: 30 },
  { name: "Al-Infitar", arabic: "الانفطار", totalAyah: 19, juz: 30 },
  { name: "Al-Mutaffifin", arabic: "المطففين", totalAyah: 36, juz: 30 },
  { name: "Al-Inshiqaq", arabic: "الانشقاق", totalAyah: 25, juz: 30 },
  { name: "Al-Buruj", arabic: "البروج", totalAyah: 22, juz: 30 },
  { name: "At-Tariq", arabic: "الطارق", totalAyah: 17, juz: 30 },
  { name: "Al-A'la", arabic: "الأعلى", totalAyah: 19, juz: 30 },
  { name: "Al-Ghashiyah", arabic: "الغاشية", totalAyah: 26, juz: 30 },
  { name: "Al-Fajr", arabic: "الفجر", totalAyah: 30, juz: 30 },
  { name: "Al-Balad", arabic: "البلد", totalAyah: 20, juz: 30 },
  { name: "Ash-Shams", arabic: "الشams", totalAyah: 15, juz: 30 },
  { name: "Al-Layl", arabic: "الليل", totalAyah: 21, juz: 30 },
  { name: "Ad-Duha", arabic: "الضحى", totalAyah: 11, juz: 30 },
  { name: "Ash-Sharh", arabic: "الشرح", totalAyah: 8, juz: 30 },
  { name: "At-Tin", arabic: "التين", totalAyah: 8, juz: 30 },
  { name: "Al-'Alaq", arabic: "العلق", totalAyah: 19, juz: 30 },
  { name: "Al-Qadr", arabic: "القدر", totalAyah: 5, juz: 30 },
  { name: "Al-Bayyinah", arabic: "البينة", totalAyah: 8, juz: 30 },
  { name: "Az-Zalzalah", arabic: "الزلزلة", totalAyah: 8, juz: 30 },
  { name: "Al-'Adiyat", arabic: "العاديات", totalAyah: 11, juz: 30 },
  { name: "Al-Qari'ah", arabic: "القارعة", totalAyah: 11, juz: 30 },
  { name: "At-Takathur", arabic: "التكاثر", totalAyah: 8, juz: 30 },
  { name: "Al-'Asr", arabic: "العصر", totalAyah: 3, juz: 30 },
  { name: "Al-Humazah", arabic: "الهمزة", totalAyah: 9, juz: 30 },
  { name: "Al-Fil", arabic: "الفيل", totalAyah: 5, juz: 30 },
  { name: "Quraysh", arabic: "قريish", totalAyah: 4, juz: 30 },
  { name: "Al-Ma'un", arabic: "الماعون", totalAyah: 7, juz: 30 },
  { name: "Al-Kawthar", arabic: "الkoutar", totalAyah: 3, juz: 30 },
  { name: "Al-Kafirun", arabic: "الكافرون", totalAyah: 6, juz: 30 },
  { name: "An-Nasr", arabic: "النصر", totalAyah: 3, juz: 30 },
  { name: "Al-Masad", arabic: "المسد", totalAyah: 5, juz: 30 },
  { name: "Al-Ikhlas", arabic: "الإخلاص", totalAyah: 4, juz: 30 },
  { name: "Al-Falaq", arabic: "الفلق", totalAyah: 5, juz: 30 },
  { name: "An-Nas", arabic: "الناس", totalAyah: 6, juz: 30 }
];

export const getHafizSequence = () => {
  const juz30 = SURAH_DATA.filter(s => s.juz === 30).map(s => s.name).reverse();
  const juz29 = SURAH_DATA.filter(s => s.juz === 29).map(s => s.name).reverse();
  const juz28 = SURAH_DATA.filter(s => s.juz === 28).map(s => s.name).reverse();
  const juz27 = SURAH_DATA.filter(s => s.juz === 27).map(s => s.name).reverse();
  const juz26 = SURAH_DATA.filter(s => s.juz === 26).map(s => s.name).reverse();
  const juz1to25 = SURAH_DATA.filter(s => s.juz < 26).map(s => s.name);
  
  return [...juz30, ...juz29, ...juz28, ...juz27, ...juz26, ...juz1to25];
};

export const getTargetAyat = (className: string) => {
  const grade = parseInt(className.replace(/\D/g, ''));
  if (grade >= 7 && grade <= 9) return TARGET_JUZ.SMP * AVG_AYAT_PER_JUZ;
  if (grade >= 10 && grade <= 12) return TARGET_JUZ.SMA * AVG_AYAT_PER_JUZ;
  return TOTAL_AYAT_QURAN;
};