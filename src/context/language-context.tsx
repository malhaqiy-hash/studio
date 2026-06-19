
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
    en: 'Dashboard', id: 'Dasbor', ja: 'ダッシュボード', zh: '仪表板', ko: '대시보드', ar: 'لوحة القيادة', es: 'Tablero', fr: 'Tableau de bord', all: 'Dashboard'
  },
  feed: {
    en: 'Feed', id: 'Umpan', ja: 'フィード', zh: '动态', ko: '피드', ar: 'التغذية', es: 'Noticias', fr: 'Flux', all: 'Feed'
  },
  search: {
    en: 'AI Search Hub', id: 'Pusat Pencarian AI', ja: 'AI検索ハブ', zh: 'AI搜索中心', ko: 'AI 검색 허브', ar: 'مركز بحث AI', es: 'Búsqueda AI', fr: 'Recherche AI', all: 'AI Search'
  },
  discovery: {
    en: 'AI Discovery', id: 'Penemuan AI', ja: 'AIディスカバリー', zh: 'AI 发现', ko: 'AI 디스커버리', ar: 'اكتشاف AI', es: 'Descubrimiento AI', fr: 'Découverte AI', all: 'AI Discovery'
  },
  matches: {
    en: 'Intelligent Matches', id: 'Kecocokan Cerdas', ja: 'インテリジェントマッチ', zh: '智能匹配', ko: '지능형 매칭', ar: 'مطابقات ذكية', es: 'Emparejamientos', fr: 'Matchs intelligents', all: 'Matches'
  },
  matchmaker: {
    en: 'Matchmaker', id: 'Pencari Mitra', ja: 'マッチメーカー', zh: '撮合者', ko: '매치메이커', ar: 'صانع المطابقات', es: 'Casamentero', fr: 'Entremetteur', all: 'Matchmaker'
  },
  opportunities: {
    en: 'Opportunities', id: 'Peluang', ja: 'オポチュニティ', zh: '机遇', ko: '기회', ar: 'فرص', es: 'Oportunidades', fr: 'Opportunités', all: 'Opportunities'
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
  logout: {
    en: 'Logout', id: 'Keluar', ja: 'ログアウト', zh: '登出', ko: '로그아웃', ar: 'تسجيل الخروج', es: 'Cerrar Sesión', fr: 'Déconnexion', all: 'Logout'
  },
  welcome: {
    en: 'Welcome', id: 'Selamat Datang', ja: 'ようこそ', zh: '欢迎', ko: '환영합니다', ar: 'مرحباً', es: 'Bienvenido', fr: 'Bienvenue', all: 'Welcome'
  },
  profile: {
    en: 'Profile', id: 'Profil', ja: 'プロフィール', zh: '个人资料', ko: '프로필', ar: 'الملف الشخصي', es: 'Perfil', fr: 'Profil', all: 'Profile'
  },
  payment: {
    en: 'Payment', id: 'Pembayaran', ja: '支払い', zh: '支付', ko: '결제', ar: 'دفع', es: 'Pago', fr: 'Paiement', all: 'Payment'
  },
  scout: {
    en: 'AI Scout', id: 'Pemandu AI', ja: 'AIスカウト', zh: 'AI 侦察', ko: 'AI 스카우트', ar: 'مستطلع AI', es: 'Explorador AI', fr: 'Scout AI', all: 'AI Scout'
  },
  reverse_discovery: {
    en: 'Reverse Discovery', id: 'Penemuan Terbalik', ja: 'リバースディスカバリー', zh: '反向发现', ko: '리버스 디스커버리', ar: 'اكتشاف عكسي', es: 'Descubrimiento Inverso', fr: 'Découverte inversée', all: 'Reverse Discovery'
  },
  knowledge: {
    en: 'Business Academy', id: 'Akademi Bisnis', ja: 'ビジネスアカデミー', zh: '商业学院', ko: '비즈니스 아카데미', ar: 'أكاديمية الأعمال', es: 'Academia de Negocios', fr: 'Académie des affaires', all: 'Business Academy'
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
