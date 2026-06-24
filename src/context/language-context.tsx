'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 
  | 'en' | 'id' | 'ja' | 'zh' | 'ko' | 'ar' | 'es' | 'fr' 
  | 'de' | 'pt' | 'ru' | 'it' | 'hi' | 'tr' | 'vi' | 'th';

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'id', label: 'Indonesian', flag: '🇮🇩' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'tr', label: 'Turkish', flag: '🇹🇷' },
  { code: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', label: 'Thai', flag: '🇹🇭' },
];

export const translations = {
  // Navigation
  dashboard: { en: 'Control Center', id: 'Pusat Kendali' },
  dashboard_desc: { en: 'Summary of your business performance.', id: 'Ringkasan performa bisnis Anda.' },
  feed: { en: 'Feed', id: 'Beranda' },
  search: { en: 'Search', id: 'Cari' },
  more: { en: 'More', id: 'Lainnya' },
  profile: { en: 'Profile', id: 'Profil' },
  view_profile: { en: 'View Profile', id: 'Lihat Profil' },
  
  // Search Page
  search_placeholder: { en: 'Search anything in Tapp...', id: 'Cari apa saja di Tapp...' },
  search_now: { en: 'Search Now', id: 'Cari Sekarang' },
  nearby: { en: 'Nearby (GPS)', id: 'Sekitar (GPS)' },
  results: { en: 'Results', id: 'Hasil' },
  start_search: { en: 'Start Smart Search', id: 'Mulai Cari Cerdas' },
  daily_limit_msg: { en: '30 daily accesses to maintain quality.', id: 'Batas 30 akses harian untuk menjaga kualitas.' },
  recent_searches: { en: 'Recent Searches', id: 'Pencarian Terakhir' },
  clear_all: { en: 'Clear All', id: 'Hapus Semua' },
  
  // Dashboard Stats
  active_opps: { en: 'Active Opportunities', id: 'Peluang Aktif' },
  ai_matches_label: { en: 'AI Matches', id: 'Kecocokan AI' },
  pipeline_est: { en: 'Pipeline Estimate', id: 'Estimasi Pipeline' },
  synergy_score: { en: 'Synergy Score', id: 'Skor Sinergi' },
  network_perf: { en: 'Network Performance', id: 'Performa Jaringan' },
  recent_act: { en: 'Recent Activity', id: 'Aktivitas Terkini' },
  network_evolution: { en: 'Network Evolution', id: 'Evolusi Jaringan' },
  connect_now: { en: 'Connect Now', id: 'Hubungkan Sekarang' },
  verified_account: { en: 'Verified Account', id: 'Akun Terverifikasi' },

  // Module Titles & Descriptions
  ai_backup: { en: 'AI Backup', id: 'Penemuan AI (Backup)' },
  ai_backup_desc: { en: 'Your discovery history is automatically backed up.', id: 'Riwayat pencarian AI Anda dicadangkan otomatis.' },
  market_radar: { en: 'Market Radar', id: 'Market Radar' },
  market_radar_desc: { en: 'Daily global AI signals for network efficiency.', id: 'Sinyal AI harian untuk efisiensi jaringan.' },
  opportunity_map: { en: 'Opportunity Map', id: 'Peta Peluang' },
  opportunity_map_desc: { en: 'Visualize global business leads and demands.', id: 'Visualisasikan prospek dan permintaan bisnis global.' },
  registry: { en: 'Tapp Registry', id: 'Registri Tapp' },
  registry_desc: { en: 'Claim and verify your profile to unlock features.', id: 'Klaim dan verifikasi profil untuk buka fitur.' },
  matchmaker: { en: 'AI Matchmaker', id: 'Pencari Mitra' },
  matchmaker_desc: { en: 'Automated profile analysis every 24 hours.', id: 'Analisis profil otomatis setiap 24 jam.' },
  matches: { en: 'Pairings', id: 'Kecocokan' },
  opportunities: { en: 'Pipeline', id: 'Peluang' },
  opportunities_desc: { en: 'Track and manage your B2B sales funnel.', id: 'Lacak dan kelola corong penjualan B2B Anda.' },
  reverse_discovery: { en: 'Demand Detection', id: 'Deteksi Permintaan' },
  reverse_discovery_desc: { en: 'See where the market needs your solutions.', id: 'Lihat di mana pasar butuh solusi Anda.' },
  knowledge: { en: 'Academy', id: 'Akademi Bisnis' },
  knowledge_desc: { en: 'Personalized global trade insights.', id: 'Wawasan perdagangan global personal.' },
  scout: { en: 'AI Scout', id: 'Pemandu AI' },
  scout_desc: { en: 'Detecting unmet demand and market gaps.', id: 'Deteksi permintaan tak terpenuhi & celah pasar.' },
  communities: { en: 'Communities', id: 'Komunitas' },
  communities_desc: { en: 'Connect with industry-specific groups.', id: 'Terhubung dengan grup spesifik industri.' },
  
  // Scout Detailed
  scout_market_intel: { en: 'Market Intelligence', id: 'Intelijen Pasar' },
  scout_start: { en: 'Start Scouting', id: 'Mulai Memandu' },
  scout_scanning: { en: 'Scanning Network...', id: 'Memindai Jaringan...' },
  scout_analyzing: { en: 'Analyzing Unmet Demand', id: 'Menganalisis Permintaan' },
  scout_processing: { en: 'Processing signals to find your next pivot...', id: 'Memproses sinyal untuk menemukan peluang Anda...' },
  scout_confidence: { en: 'Confidence', id: 'Kepercayaan' },
  scout_signal: { en: 'Analysis Signal', id: 'Sinyal Analisis' },
  scout_pivot: { en: 'Suggested Pivot', id: 'Saran Pivot' },
  scout_create_opp: { en: 'Create Opportunity from Gap', id: 'Buat Peluang dari Celah' },

  // Messages & Notifications
  global_pulse: { en: 'Global Pulse', id: 'Nadi Global' },
  search_chats: { en: 'Search conversations...', id: 'Cari percakapan...' },
  type_message: { en: 'Type a secure message...', id: 'Ketik pesan aman...' },
  online: { en: 'Online', id: 'Aktif' },
  offline: { en: 'Offline', id: 'Luring' },
  away: { en: 'Away', id: 'Sibuk' },
  activity_center: { en: 'Activity Center', id: 'Pusat Aktivitas' },
  activity_desc: { en: 'Stay updated with your latest business network interactions.', id: 'Tetap perbarui interaksi jaringan bisnis Anda.' },
  mark_read: { en: 'Mark all as read', id: 'Tandai semua dibaca' },
  take_action: { en: 'Take Action', id: 'Ambil Tindakan' },
  notif_intel: { en: 'Notification Intelligence', id: 'Intelijen Notifikasi' },
  view_insights: { en: 'View Insights Report', id: 'Lihat Laporan Wawasan' },

  // Specific Actions & Labels
  claim_profile: { en: 'Claim Profile', id: 'Klaim Profil' },
  accuracy: { en: 'Accuracy', id: 'Akurasi' },
  recommendations: { en: 'Recommendations', id: 'Rekomendasi' },
  next_steps: { en: 'Next Steps', id: 'Langkah Selanjutnya' },
  market_sentiment: { en: 'Market Sentiment', id: 'Sentimen Pasar' },
  hot_products: { en: 'Hot Products', id: 'Produk Populer' },
  generate_report: { en: 'Generate Report', id: 'Buat Laporan' },
  market_gap: { en: 'Market Gap', id: 'Celah Pasar' },
  potential_vol: { en: 'Potential Vol.', id: 'Potensi Volume' },
  leads_found: { en: 'Leads Found', id: 'Prospek Ditemukan' },
  sync_network: { en: 'Synchronizing Global Network', id: 'Menyelaraskan Jaringan Global' },
  start_dialogue: { en: 'Start Dialogue', id: 'Mulai Dialog' },
  add_opp: { en: 'Add New Opportunity', id: 'Tambah Peluang Baru' },
  settings: { en: 'Settings', id: 'Pengaturan' },
  saved: { en: 'Saved', id: 'Koleksi' },
  messages: { en: 'Messages', id: 'Pesan' },
  notifications: { en: 'Notifications', id: 'Notifikasi' },
  logout: { en: 'Logout', id: 'Keluar' },

  // AI Assistant
  ai_greet: { en: 'Hello! I am your Tapp assistant. How can I help you today?', id: 'Halo! Saya asisten Tapp Anda. Bagaimana saya bisa membantu Anda hari ini?' },
  ai_ask_strategy: { en: 'Ask strategy...', id: 'Tanya strategi...' },
  ai_translating: { en: 'Translating...', id: 'Menerjemahkan...' },
  ai_original: { en: 'Show Original', id: 'Lihat Asli' },
  ai_active: { en: 'Active', id: 'Aktif' },
  ai_error: { en: 'AI Error. Please try again later.', id: 'Gangguan AI. Silakan coba lagi nanti.' }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setInternalLanguage] = useState<Language>('id');

  useEffect(() => {
    const savedLang = localStorage.getItem('ontapp_system_lang') as Language;
    if (savedLang) setInternalLanguage(savedLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setInternalLanguage(lang);
    localStorage.setItem('ontapp_system_lang', lang);
  };

  const t = (key: keyof typeof translations): string => {
    const entry = translations[key];
    if (!entry) return key as string;
    return (entry as any)[language] || (entry as any).en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
