/**
 * @fileOverview Konfigurasi pusat untuk fitur-fitur AI di OnTapp.
 * Memudahkan pembaruan deskripsi dan transparansi kuota di seluruh aplikasi.
 */

export interface AppFeature {
  id: string;
  name: string;
  description: string;
  quotaInfo: string;
  iconName: 'Search' | 'Radar' | 'Handshake' | 'TrendingUp' | 'Map' | 'Brain' | 'Zap';
}

export const APP_FEATURES: AppFeature[] = [
  {
    id: 'hybrid-search',
    name: 'Pencarian Hybrid',
    description: 'Mesin pencari cerdas yang mensintesis data internal jaringan OnTapp dengan pengetahuan pasar global. AI melakukan indexing mendalam untuk menemukan entitas bisnis, produk, atau layanan yang paling relevan dengan niat (intent) Anda.',
    quotaInfo: 'Batas 30 akses harian untuk menjaga kualitas sinkronisasi data.',
    iconName: 'Search'
  },
  {
    id: 'ai-scout',
    name: 'Pemandu AI (Scout)',
    description: 'Agen intelijen yang aktif memindai sinyal pasar secara real-time. Scout mendeteksi "Market Gaps" atau celah permintaan yang belum terpenuhi, memberikan Anda keunggulan kompetitif untuk melakukan pivot bisnis yang tepat sasaran.',
    quotaInfo: 'Batas 10 laporan intelijen harian per akun.',
    iconName: 'Radar'
  },
  {
    id: 'matchmaker',
    name: 'Kecocokan Cerdas (Matchmaker)',
    description: 'Algoritma sinkronisasi profil yang menganalisis kebutuhan dan kapabilitas bisnis Anda. Matchmaker menghubungkan Anda dengan mitra strategis potensial berdasarkan skor sinergi teknis dan geografis yang dihitung secara otomatis.',
    quotaInfo: 'Batas 5 analisis kecocokan mendalam setiap 24 jam.',
    iconName: 'Handshake'
  },
  {
    id: 'market-radar',
    name: 'Market Radar',
    description: 'Sistem deteksi tren industri global. Radar memantau lonjakan permintaan produk dan pergeseran minat pasar di berbagai wilayah dunia, membantu Anda mengantisipasi perubahan sebelum kompetitor Anda.',
    quotaInfo: 'Batas 10 pemindaian radar harian untuk akurasi optimal.',
    iconName: 'TrendingUp'
  },
  {
    id: 'opportunity-map',
    name: 'Opportunity Map',
    description: 'Visualisasi geo-spasial dari prospek bisnis global. Memetakan volume potensi pasar dan intensitas permintaan di koridor industri internasional, memungkinkan Anda mengeksplorasi wilayah ekspansi baru secara visual.',
    quotaInfo: 'Batas 20 eksplorasi geo-intelligence harian.',
    iconName: 'Map'
  }
];
