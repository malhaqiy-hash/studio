'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'id' | 'ja' | 'zh' | 'ko' | 'ar' | 'es' | 'fr' | 'all';

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
  { code: 'all', label: 'All Worldwide Languages', flag: '🌐' },
];

export const translations = {
  dashboard: {
    en: 'Control Center', id: 'Pusat Kendali', ja: 'コントロールセンター', zh: '控制中心', ko: '제어 센터', ar: 'مركز التحكم', es: 'Centro de Control', fr: 'Centre de contrôle', all: 'Dashboard'
  },
  dashboard_desc: {
    en: 'Summary of your business performance and network intelligence.', id: 'Ringkasan performa bisnis dan intelijen jaringan Anda.', ja: 'ビジネスパフォーマンスとネットワークインテリジェンスの概要。', zh: '业务绩效和网络情报摘要。', ko: '비즈니스 성과 및 네트워크 인텔리전스 요약.', ar: 'ملخص لأداء عملك وذكاء الشبكة.', es: 'Resumen de su desempeño comercial e inteligencia de red.', fr: 'Résumé de vos performances commerciales et de l\'intelligence de votre réseau.', all: 'Summary'
  },
  feed: {
    en: 'Feed', id: 'Beranda', ja: 'フィード', zh: '动态', ko: '피드', ar: 'التغذية', es: 'Noticias', fr: 'Flux', all: 'Feed'
  },
  search: {
    en: 'Search', id: 'Cari', ja: '検索', zh: '搜索', ko: '검색', ar: 'بحث', es: 'Búsqueda', fr: 'Recherche', all: 'Search'
  },
  search_placeholder: {
    en: 'Search anything in OnTapp...', id: 'Cari apa saja di OnTapp...', ja: 'OnTappで何でも検索...', zh: '在 OnTapp 中搜索任何内容...', ko: 'OnTapp에서 무엇이든 검색하세요...', ar: 'ابحث عن أي شيء في OnTapp...', es: 'Busca cualquier cosa en OnTapp...', fr: 'Recherchez n\'importe quoi dans OnTapp...', all: 'Search...'
  },
  search_now: {
    en: 'Search Now', id: 'Cari Sekarang', ja: '今すぐ検索', zh: '现在搜索', ko: '지금 검색', ar: 'ابحث الآن', es: 'Buscar ahora', fr: 'Rechercher maintenant', all: 'Search'
  },
  nearby: {
    en: 'Nearby (GPS)', id: 'Cari Sekitar (GPS)', ja: '近く (GPS)', zh: '附近 (GPS)', ko: '근처 (GPS)', ar: 'بالقرب (GPS)', es: 'Cerca (GPS)', fr: 'À proximité (GPS)', all: 'Nearby'
  },
  ai_backup: {
    en: 'AI Backup', id: 'Penemuan AI (Backup)', ja: 'AIバックアップ', zh: 'AI 备份', ko: 'AI 백업', ar: 'نسخ احتياطي للذكاء الاصطناعي', es: 'Respaldo AI', fr: 'Sauvegarde AI', all: 'AI Backup'
  },
  ai_backup_desc: {
    en: 'Your discovery history is automatically backed up here.', id: 'Hasil pencarian AI yang Anda temukan dicadangkan di sini secara otomatis.', ja: '検索履歴はここに自動的にバックアップされます。', zh: '您的发现历史记录将在此处自动备份。', ko: '발견 기록이 여기에 자동으로 백업됩니다.', ar: 'يتم نسخ سجل الاكتشاف الخاص بك احتياطيًا هنا تلقائيًا.', es: 'Su historial de descubrimientos se respalda automáticamente aquí.', fr: 'Votre historique de découverte est automatiquement sauvegardé ici.', all: 'Backup'
  },
  market_radar: {
    en: 'Market Radar', id: 'Market Radar', ja: '市場レーダー', zh: '市场雷达', ko: '시장 레이더', ar: 'رادار السوق', es: 'Radar de Mercado', fr: 'Radar du marché', all: 'Market Radar'
  },
  market_radar_desc: {
    en: 'Global AI signals aggregated daily for network efficiency.', id: 'Sinyal AI global yang diagregasikan setiap hari untuk efisiensi jaringan.', ja: 'ネットワーク効率のために毎日集約されるグローバル AI シグナル。', zh: '每日汇总的全球 AI 信号，以提高网络效率。', ko: '네트워크 효율성을 위해 매일 집계되는 글로벌 AI 신호.', ar: 'إشارات الذكاء الاصطناعي العالمية التي يتم تجميعها يوميًا لفعالية الشبكة.', es: 'Señales de IA globales agregadas diariamente para la eficiencia de la red.', fr: 'Signaux IA mondiaux agrégés quotidiennement pour l\'efficacité du réseau.', all: 'Market Radar'
  },
  opportunity_map: {
    en: 'Opportunity Map', id: 'Peta Peluang', ja: 'オポチュニティマップ', zh: '机遇地图', ko: '기회 지도', ar: 'خريطة الفرص', es: 'Mapa de Oportunidades', fr: 'Carte des opportunités', all: 'Opportunity Map'
  },
  opportunity_map_desc: {
    en: 'Visualize global business leads and market demands.', id: 'Visualisasikan prospek bisnis global dan permintaan pasar.', ja: 'グローバルなビジネスリードと市場の需要を可視化します。', zh: '可视化全球业务线索和市场需求。', ko: '글로벌 비즈니스 리드와 시장 수요를 시각화합니다.', ar: 'تصور فرص العمل العالمية وطلبات السوق.', es: 'Visualice clientes potenciales de negocios globales y demandas del mercado.', fr: 'Visualisez les pistes d\'affaires mondiales et les demandes du marché.', all: 'Map'
  },
  registry: {
    en: 'OnTapp Registry', id: 'Registri OnTapp', ja: 'OnTappレジストリ', zh: 'OnTapp 注册', ko: 'OnTapp 레지스트리', ar: 'سجل OnTapp', es: 'Registro OnTapp', fr: 'Registre OnTapp', all: 'Registry'
  },
  registry_desc: {
    en: 'Claim and verify your business profile to unlock features.', id: 'Klaim dan verifikasi profil bisnis Anda untuk membuka fitur eksklusif.', ja: 'ビジネスプロフィールを申請して確認し、機能をアンロックします。', zh: '认领并验证您的业务概况以解锁功能。', ko: '비즈니스 프로필을 요청하고 인증하여 기능을 잠금 해제하세요.', ar: 'قم بتقديم طلب والتحقق من ملف تعريف عملك لفتح الميزات.', es: 'Reclame y verifique su perfil comercial para desbloquear funciones.', fr: 'Réclamez et vérifiez votre profil d\'entreprise pour débloquer des fonctionnalités.', all: 'Registry'
  },
  discovery: {
    en: 'AI Discovery', id: 'Penemuan AI', ja: 'AIディスカバリー', zh: 'AI 发现', ko: 'AI 디스커버리', ar: 'اكتشاف AI', es: 'Descubrimiento AI', fr: 'Découverte AI', all: 'AI Discovery'
  },
  matches: {
    en: 'Pairings', id: 'Kecocokan', ja: 'ペアリング', zh: '配对', ko: '페어링', ar: 'إقران', es: 'Emparejamientos', fr: 'Matchs', all: 'Pairings'
  },
  matchmaker: {
    en: 'AI Matchmaker', id: 'Pencari Mitra', ja: 'マッチメーカー', zh: '撮合者', ko: '매치메이커', ar: 'صانع المطابقات', es: 'Casamentero', fr: 'Entremetteur', all: 'Matchmaker'
  },
  matchmaker_desc: {
    en: 'Automated business profile analysis every 24 hours.', id: 'Analisis profil bisnis otomatis sekali setiap 24 jam.', ja: '24時間ごとの自動ビジネスプロフィール分析。', zh: '每 24 小时进行一次自动业务概况分析。', ko: '24시간마다 자동 비즈니스 프로필 분석.', ar: 'تحليل ملف تعريف العمل التلقائي كل 24 ساعة.', es: 'Análisis automatizado de perfiles comerciales cada 24 horas.', fr: 'Analyse automatisée du profil de l\'entreprise toutes les 24 heures.', all: 'Analysis'
  },
  opportunities: {
    en: 'Pipeline', id: 'Peluang', ja: 'オポチュニティ', zh: '机遇', ko: '기회', ar: 'فرص', es: 'Oportunidades', fr: 'Opportunités', all: 'Opportunities'
  },
  opportunities_desc: {
    en: 'Track and manage your B2B sales funnel with real-time intelligence.', id: 'Lacak dan kelola corong penjualan B2B Anda dengan intelijen real-time.', ja: 'リアルタイムのインテリジェンスで B2B セールスファネルを追跡および管理します。', zh: '利用实时情报跟踪和管理您的 B2B 销售渠道。', ko: '실시간 인텔리전스로 B2B 판매 퍼널을 추적하고 관리하세요.', ar: 'تتبع وإدارة مسار مبيعات B2B بذكاء في الوقت الفعلي.', es: 'Rastree y gestione su embudo de ventas B2B con inteligencia en tiempo real.', fr: 'Suivez et gérez votre entonnoir de vente B2B avec une intelligence en temps réel.', all: 'Pipeline'
  },
  messages: {
    en: 'Messages', id: 'Pesan', ja: 'メッセージ', zh: '消息', ko: '메시지', ar: 'رسائل', es: 'Mensajes', fr: 'Messages', all: 'Messages'
  },
  notifications: {
    en: 'Notifications', id: 'Notifikasi', ja: '通知', zh: '通知', ko: '알림', ar: 'إشعارات', es: 'Notificaciones', fr: 'Notifications', all: 'Notifications'
  },
  settings: {
    en: 'Settings', id: 'Pengaturan', ja: '設定', zh: '设置', ko: '설정', ar: 'الإعدادات', es: 'Ajustes', fr: 'Paramètres', all: 'Settings'
  },
  saved: {
    en: 'Saved', id: 'Koleksi', ja: '保存済み', zh: '已保存', ko: '저장됨', ar: 'محفوظ', es: 'Guardado', fr: 'Enregistré', all: 'Saved'
  },
  saved_desc: {
    en: 'Items, insights, and opportunities you have saved for later.', id: 'Postingan, wawasan pasar, dan peluang yang Anda simpan untuk ditinjau kembali.', ja: '後で見るために保存したアイテム、洞察、オポチュニティ。', zh: '您保存供以后查看的项目、见解和机遇。', ko: '나중에 보기 위해 저장한 항목, 인사이트 및 기회.', ar: 'العناصر والرؤى والفرص التي قمت بحفظها لوقت لاحق.', es: 'Artículos, ideas y oportunidades que ha guardado para más tarde.', fr: 'Éléments, idées et opportunités que vous avez enregistrés pour plus tard.', all: 'Saved'
  },
  logout: {
    en: 'Logout', id: 'Keluar', ja: 'ログアウト', zh: '登出', ko: '로그아웃', ar: 'تسجيل الخروج', es: 'Cerrar Sesión', fr: 'Déconnexion', all: 'Logout'
  },
  welcome: {
    en: 'Welcome', id: 'Selamat Datang', ja: 'ようこそ', zh: '欢迎', ko: '환영합니다', ar: 'مرحباً', es: 'Bienvenido', fr: 'Bienvenue', all: 'Welcome'
  },
  profile: {
    en: 'Profile', id: 'Profil', ja: 'プロフィール', zh: '个人资料', ko: '프로필', ar: 'الملف الشخصي', es: 'Perfil', fr: 'Profil', all: 'Profile'
  },
  scout: {
    en: 'AI Scout', id: 'Pemandu AI', ja: 'AIスカウト', zh: 'AI 侦察', ko: 'AI 스카우트', ar: 'مستطلع AI', es: 'Explorador AI', fr: 'Scout AI', all: 'AI Scout'
  },
  scout_desc: {
    en: 'Detecting unmet demand and hidden market gaps.', id: 'Mendeteksi permintaan yang tidak terpenuhi dan celah pasar yang tersembunyi.', ja: '満たされていない需要と隠れた市場のギャップを検出します。', zh: '检测未满足的需求和隐藏的市场空白。', ko: '충족되지 않은 수요와 숨겨진 시장 격차를 감지합니다.', ar: 'كشف الطلب غير الملبي وفجوات السوق الخفية.', es: 'Detección de demanda insatisfecha y brechas de mercado ocultas.', fr: 'Détection de la demande non satisfaite et des lacunes cachées du marché.', all: 'Scout'
  },
  reverse_discovery: {
    en: 'Demand Detection', id: 'Deteksi Permintaan', ja: '需要検出', zh: '需求检测', ko: '수요 탐지', ar: 'كشف الطلب', es: 'Detección de Demanda', fr: 'Détection de la demande', all: 'Demand Detection'
  },
  reverse_discovery_desc: {
    en: 'Let our AI show you where the market is screaming for your solutions.', id: 'Biarkan AI kami menunjukkan di mana pasar membutuhkan solusi Anda sekarang.', ja: '市場があなたのソリューションを求めている場所を AI に示させましょう。', zh: '让我们的 AI 向您展示市场在哪些方面急需您的解决方案。', ko: 'AI가 귀하의 솔루션을 요구하는 시장을 보여줍니다.', ar: 'دع ذكائنا الاصطناعي يوضح لك أين يطلب السوق حلولك.', es: 'Deje que nuestra IA le muestre dónde el mercado pide a gritos sus soluciones.', fr: 'Laissez notre IA vous montrer où le marché réclame vos solutions.', all: 'Demand'
  },
  knowledge: {
    en: 'Academy', id: 'Akademi Bisnis', ja: 'ビジネスアカデミー', zh: '商业学院', ko: '비즈니스 아카데미', ar: 'أكاديمية الأعمال', es: 'Academia de Negocios', fr: 'Académie des affaires', all: 'Academy'
  },
  knowledge_desc: {
    en: 'Personalized insights and global trade knowledge designed to scale.', id: 'Wawasan pribadi dan pengetahuan perdagangan global untuk skala bisnis.', ja: '規模を拡大するために設計されたパーソナライズされた洞察とグローバルな貿易知識。', zh: '旨在扩大规模的个性化见解和全球贸易知识。', ko: '규모 확장을 위해 설계된 맞춤형 인사이트 및 글로벌 무역 지식.', ar: 'رؤى مخصصة ومعرفة بالتجارة العالمية مصممة للتوسع.', es: 'Información personalizada y conocimiento del comercio global diseñado para escalar.', fr: 'Des informations personnalisées et des connaissances en commerce mondial conçues pour évoluer.', all: 'Academy'
  },
  more: {
    en: 'More', id: 'Lainnya', ja: 'もっと', zh: '更多', ko: '더보기', ar: 'المزيد', es: 'Más', fr: 'Plus', all: 'More'
  },
  verified_account: {
    en: 'Verified Account', id: 'Akun Terverifikasi', ja: '認証済みアカウント', zh: '已验证帐户', ko: '인증된 계정', ar: 'حساب موثق', es: 'Cuenta Verificada', fr: 'Compte vérifié', all: 'Verified'
  },
  results: {
    en: 'Results', id: 'Hasil', ja: '結果', zh: '结果', ko: '결과', ar: 'نتائج', es: 'Resultados', fr: 'Résultats', all: 'Results'
  },
  start_search: {
    en: 'Start Smart Search', id: 'Mulai Pencarian Pintar', ja: 'スマート検索を開始', zh: '开始智能搜索', ko: '스마트 검색 시작', ar: 'بدء البحث الذكي', es: 'Iniciar búsqueda inteligente', fr: 'Démarrer la recherche intelligente', all: 'Search'
  },
  daily_limit_msg: {
    en: '30 daily accesses to maintain OnTapp network quality.', id: 'Batas 30 akses harian untuk menjaga kualitas jaringan OnTapp.', ja: 'OnTapp ネットワークの品質を維持するための 1 日 30 回のアクセス制限。', zh: '每天 30 次访问以维持 OnTapp 网络质量。', ko: 'OnTapp 네트워크 품질을 유지하기 위한 일일 30회 액세스.', ar: '30 وصولاً يوميًا للحفاظ على جودة شبكة OnTapp.', es: '30 accesos diarios para mantener la calidad de la red OnTapp.', fr: '30 accès quotidiens pour maintenir la qualité du réseau OnTapp.', all: 'Limit'
  }
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
    if (savedLang) {
      setInternalLanguage(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setInternalLanguage(lang);
    localStorage.setItem('ontapp_system_lang', lang);
  };

  const t = (key: keyof typeof translations): string => {
    const entry = translations[key];
    if (!entry) return key as string;
    return (entry as any)[language] || entry.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
