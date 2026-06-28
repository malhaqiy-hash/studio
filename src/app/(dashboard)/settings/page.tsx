
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Activity, 
  MessageSquare, 
  Bell, 
  Palette, 
  Languages, 
  MapPin, 
  Trash2, 
  HardDrive, 
  HelpCircle, 
  FileText, 
  Info, 
  Users, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Smartphone,
  Check,
  UserCheck,
  LayoutGrid,
  Handshake
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, LANGUAGES } from "@/context/language-context";
import { useAccount } from "@/context/account-context";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const SETTINGS_KEY = "ontapp_system_settings_v3";

interface SettingsState {
  theme: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: "system",
};

const MOCK_RELATIONS = {
  pengikut: [
    { id: 'conn1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/f1/100', extra: 'Distributor Kopi' },
    { id: 'conn2', name: 'Siti Aminah', avatar: 'https://picsum.photos/seed/f2/100', extra: 'Pemasok Kemasan' },
    { id: 'conn3', name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/f3/100', extra: 'Logistik Regional' },
  ],
  mengikuti: [
    { id: 'conn4', name: 'Alpha Tech', avatar: 'https://picsum.photos/seed/f4/100', extra: 'Solusi AI' },
    { id: 'conn2', name: 'Global Logistics', avatar: 'https://picsum.photos/seed/f2/100', extra: 'Cargo Udara' },
  ],
  suka: [
    { id: 'conn1', name: 'Rina Kartika', avatar: 'https://picsum.photos/seed/f1/100', extra: 'Desain Produk' },
    { id: 'conn3', name: 'Hendra Gunawan', avatar: 'https://picsum.photos/seed/f3/100', extra: 'Export Manager' },
  ],
  subscribe: [
    { id: 'conn4', name: 'Indo Retail Corp', avatar: 'https://picsum.photos/seed/f4/100', extra: 'Premium Member' },
    { id: 'conn1', name: 'Eco Pack Solutions', avatar: 'https://picsum.photos/seed/f1/100', extra: 'Partner Bisnis' },
  ]
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { activeAccount, availableAccounts, switchAccount, updateActiveAccount } = useAccount();
  const auth = useAuth();
  const router = useRouter();
  
  const [mounted, setMounted] = React.useState(false);
  const [settings, setSettings] = React.useState<SettingsState>(DEFAULT_SETTINGS);
  const [activeSubMenu, setActiveSubMenu] = React.useState<string | null>(null);

  // Stepped Back Navigation Support
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (activeSubMenu) {
        setActiveSubMenu(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeSubMenu]);

  const applyTheme = (theme: string) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') { root.classList.add('dark'); } 
    else if (theme === 'light') { root.classList.remove('dark'); } 
    else if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) { try { const parsed = JSON.parse(saved); setSettings({ ...DEFAULT_SETTINGS, ...parsed }); applyTheme(parsed.theme); } catch (e) { } }
    setMounted(true);
  }, []);

  const handleThemeChange = (val: string) => {
    const newSettings = { ...settings, theme: val };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    applyTheme(val);
    toast({ title: "Tema Diperbarui" });
  };

  const handleLogout = async () => {
    try { await signOut(auth); router.push("/login"); } catch (error) { }
  };

  const updatePrivacy = (key: string, val: string) => {
    updateActiveAccount({ preferences: { ...activeAccount.preferences, [key]: val } });
    toast({ title: "Privasi Diperbarui" });
  };

  const openSubMenu = (menuId: string) => {
    setActiveSubMenu(menuId);
    window.history.pushState({ subMenu: menuId }, '');
  };

  const goBack = () => {
    if (window.history.state?.subMenu) {
      window.history.back();
    } else {
      setActiveSubMenu(null);
    }
  };

  if (!mounted) return <DashboardLayout><div className="max-w-5xl mx-auto py-4 animate-pulse h-96 bg-card rounded-3xl" /></DashboardLayout>;

  const SubMenuLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 border-b border-border/40 pb-3">
        <button onClick={goBack} className="size-9 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-primary transition-all active:scale-90"><ChevronLeft className="size-4" /></button>
        <h2 className="text-[13px] font-black uppercase tracking-tight"> {title}</h2>
      </div>
      <div className="px-1">{children}</div>
    </div>
  );

  const UserListRow = ({ user, actionLabel }: { user: any, actionLabel?: string }) => (
    <button 
      onClick={() => router.push(`/profile?id=${user.id}`)}
      className="w-full flex items-center justify-between p-3 bg-muted/10 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/[0.02] transition-all group active:scale-[0.98]"
    >
      <div className="flex items-center gap-2.5 text-left">
        <Avatar className="size-9 rounded-lg border border-border group-hover:scale-105 transition-transform">
          <AvatarImage src={user.avatar} className="object-cover" />
          <AvatarFallback className="bg-primary/5 font-bold text-[10px] text-primary">{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold text-[13px] leading-none mb-0.5 group-hover:text-primary transition-colors">{user.name}</span>
          <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{user.extra}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[8px] font-black uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity">Profil</span>
        <ChevronRight className="size-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
      </div>
    </button>
  );

  const renderSubMenuContent = () => {
    switch (activeSubMenu) {
      case "hubungan":
        const type = activeAccount.type;
        const isPersonal = type === 'personal';
        return (
          <SubMenuLayout title="Hubungan Jaringan">
            <Tabs defaultValue={isPersonal ? "pengikut" : "subscribe"} className="w-full">
              <TabsList className="w-full grid h-10 bg-muted/20 rounded-lg p-1 gap-1 mb-4" style={{ gridTemplateColumns: isPersonal ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' }}>
                {isPersonal ? (
                  <>
                    <TabsTrigger value="pengikut" className="rounded-md font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Pengikut</TabsTrigger>
                    <TabsTrigger value="mengikuti" className="rounded-md font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Mengikuti</TabsTrigger>
                    <TabsTrigger value="suka" className="rounded-md font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Suka</TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="subscribe" className="rounded-md font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">{type === 'bisnis' ? 'Radar Jaringan' : 'Ditambahkan'}</TabsTrigger>
                    <TabsTrigger value="suka" className="rounded-md font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Penyuka</TabsTrigger>
                  </>
                )}
              </TabsList>
              <TabsContent value="pengikut" className="space-y-1.5 outline-none">{MOCK_RELATIONS.pengikut.map(u => <UserListRow key={u.id} user={u} actionLabel="Ikuti Balik" />)}</TabsContent>
              <TabsContent value="mengikuti" className="space-y-1.5 outline-none">{MOCK_RELATIONS.mengikuti.map(u => <UserListRow key={u.id} user={u} actionLabel="Berhenti" />)}</TabsContent>
              <TabsContent value="suka" className="space-y-1.5 outline-none">{MOCK_RELATIONS.suka.map(u => <UserListRow key={u.id} user={u} actionLabel="Hubungkan" />)}</TabsContent>
              <TabsContent value="subscribe" className="space-y-1.5 outline-none">{MOCK_RELATIONS.subscribe.map(u => <UserListRow key={u.id} user={u} actionLabel="Detail" />)}</TabsContent>
            </Tabs>
          </SubMenuLayout>
        );
      case "keamanan_privasi":
        return (
          <SubMenuLayout title="Keamanan & Privasi">
            <div className="space-y-6">
              <div className="space-y-2"><h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kredensial</h3><div className="grid grid-cols-2 gap-2"><button className="p-3 rounded-xl bg-muted/20 border border-border/50 text-[10px] font-black uppercase tracking-tight text-center hover:bg-primary/5 hover:text-primary transition-all">Ubah Password</button><button className="p-3 rounded-xl bg-muted/20 border border-border/50 text-[10px] font-black uppercase tracking-tight text-center hover:bg-primary/5 hover:text-primary transition-all">Aktifkan 2FA</button></div></div>
              <div className="space-y-3"><h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kontrol Visibilitas Daftar</h3><div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border/50 shadow-sm">{[{ label: "Siapa dapat melihat Pengikut?", key: "whoCanSeeFollowers" },{ label: "Siapa dapat melihat Mengikuti?", key: "whoCanSeeFollowing" },{ label: "Siapa dapat melihat Suka?", key: "whoCanSeeLikes" },{ label: activeAccount.type === 'bisnis' ? "Siapa dapat melihat Radar?" : "Siapa dapat melihat Ditambahkan?", key: "whoCanSeeSubscribe" }].map((item) => (<div key={item.key} className="p-3 space-y-1.5"><Label className="text-[10px] font-bold uppercase text-slate-600">{item.label}</Label><Select value={activeAccount.preferences?.[item.key as keyof typeof activeAccount.preferences] as string || 'public'} onValueChange={(v) => updatePrivacy(item.key, v)}><SelectTrigger className="rounded-lg h-9 bg-muted/20 border-none font-bold text-[11px] shadow-inner"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl shadow-xl"><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="friends">👥 Diikuti</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></Select></div>))}</div></div>
            </div>
          </SubMenuLayout>
        );
      case "mode":
        return (
          <SubMenuLayout title="Mode Tampilan">
            <div className="space-y-3"><div className="grid gap-2">{[{ id: 'light', label: 'Terang', icon: Zap, bg: 'bg-amber-50 text-amber-600' },{ id: 'dark', label: 'Gelap', icon: Lock, bg: 'bg-slate-900 text-white' },{ id: 'system', label: 'Ikuti Sistem', icon: Smartphone, bg: 'bg-muted text-muted-foreground' }].map((m) => (<button key={m.id} onClick={() => handleThemeChange(m.id)} className={cn("w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all active:scale-[0.98]", settings.theme === m.id ? "border-primary bg-primary/[0.02]" : "border-transparent bg-muted/20")}> <div className="flex items-center gap-3"><div className={cn("size-8 rounded-lg flex items-center justify-center shadow-sm", m.bg)}><m.icon className="size-4" /></div><span className="font-black text-[12px] uppercase tracking-wide">{m.label}</span></div> {settings.theme === m.id && <Check className="size-4 text-primary" />}</button>))}</div></div>
          </SubMenuLayout>
        );
      case "bahasa":
        return (
          <SubMenuLayout title="Bahasa Sistem">
            <Card className="rounded-2xl border border-border overflow-hidden"><ScrollArea className="h-[350px]"><div className="flex flex-col divide-y divide-border">{LANGUAGES.map((lang) => (<button key={lang.code} onClick={() => { setLanguage(lang.code); toast({ title: `Bahasa diubah ke ${lang.label}` }); }} className={cn("w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors", language === lang.code ? "bg-primary/[0.02]" : "bg-transparent")}> <div className="flex items-center gap-3"><span className="text-xl">{lang.flag}</span><div className="flex flex-col"><span className="font-bold text-[13px] text-slate-900">{lang.label}</span><span className="text-[9px] font-black uppercase text-muted-foreground opacity-60">{lang.code}</span></div></div> {language === lang.code && <Check className="size-4 text-primary" />}</button>))}</div></ScrollArea></Card>
          </SubMenuLayout>
        );
      default: return null;
    }
  };

  const MenuRow = ({ item }: { item: any }) => (
    <button onClick={() => { if (item.subMenu) openSubMenu(item.subMenu); else if (item.href && item.href !== '#') router.push(item.href); }} className="w-full flex items-center justify-between p-3.5 hover:bg-muted/50 transition-colors group">
      <div className="flex items-center gap-3 text-left"><div className={cn("size-8 rounded-lg flex items-center justify-center shadow-sm", item.bg || "bg-muted text-muted-foreground")}><item.icon className="size-4" /></div><div className="flex flex-col"><h4 className="font-bold text-[13px] leading-none group-hover:text-primary transition-colors">{item.label}</h4>{item.desc && <p className="text-[9px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">{item.desc}</p>}</div></div>
      <ChevronRight className="size-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6 pb-24 pt-2 px-1">
        {activeSubMenu ? renderSubMenuContent() : (
          <>
            <header className="space-y-0.5"><h1 className="text-xl font-black tracking-tight text-foreground uppercase">{t('settings')}</h1><p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest">Manajemen sistem dan ekosistem</p></header>
            <section className="space-y-2"><h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Akun & Keamanan</h3><div className="flex flex-col bg-card rounded-xl border border-border overflow-hidden divide-y divide-border"><MenuRow item={{ icon: User, label: "Kelola Akun", desc: "Profil, Tipe Akun, Lencana", href: "/profile?edit=true", bg: "bg-primary text-white" }} /><MenuRow item={{ icon: ShieldCheck, label: "Izin Keamanan & Privasi", desc: "Enkripsi & Visibilitas", subMenu: "keamanan_privasi" }} /></div></section>
            <section className="space-y-2"><h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Aktivitas & Interaksi</h3><div className="flex flex-col bg-card rounded-xl border border-border overflow-hidden divide-y divide-border"><MenuRow item={{ icon: LayoutGrid, label: "Kelola Postingan", desc: "Arsip, Pin, Aktivitas", href: "/settings/posts", bg: "bg-primary text-white" }} /><MenuRow item={{ icon: Handshake, label: "Koneksi", desc: "Relasi Bisnis", href: "/connections" }} /><MenuRow item={{ icon: Users, label: "Komunitas", desc: "Grup Kolaborasi", href: "/communities" }} /><MenuRow item={{ icon: UserCheck, label: "Hubungan Jaringan", desc: "Pengikut & Suka", subMenu: "hubungan" }} /><MenuRow item={{ icon: Bell, label: "Notifikasi", desc: "Push, Chat, Email", href: "/notifications" }} /></div></section>
            <section className="space-y-2"><h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Sistem & Tampilan</h3><div className="flex flex-col bg-card rounded-xl border border-border overflow-hidden divide-y divide-border"><MenuRow item={{ icon: Palette, label: "Mode Tampilan", desc: "Tema Antarmuka", subMenu: "mode" }} /><MenuRow item={{ icon: Languages, label: "Bahasa", desc: "Lokalisasi", subMenu: "bahasa" }} /></div></section>
            <section className="space-y-2"><h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Bantuan</h3><div className="flex flex-col bg-card rounded-xl border border-border overflow-hidden divide-y divide-border"><MenuRow item={{ icon: HelpCircle, label: "Pusat Bantuan", href: "/knowledge" }} /><MenuRow item={{ icon: Info, label: "Info Aplikasi", href: "/settings/info" }} /></div></section>
            <div className="space-y-2 pt-4"><div className="flex flex-col bg-card rounded-xl border border-border overflow-hidden divide-y divide-border shadow-sm"><button onClick={() => { const nextAcc = availableAccounts.find(a => a.id !== activeAccount.id) || availableAccounts[0]; switchAccount(nextAcc.id); router.push("/profile"); }} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 group"><div className="flex items-center gap-3"><div className="size-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg"><Users className="size-4" /></div><span className="font-bold text-[13px] group-hover:text-primary">Beralih Akun</span></div><ChevronRight className="size-3.5 text-muted-foreground/30 group-hover:text-primary" /></button><button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-rose-50 group"><div className="flex items-center gap-3 text-rose-600"><div className="size-8 rounded-lg bg-rose-100 flex items-center justify-center"><LogOut className="size-4" /></div><span className="font-black text-[13px] uppercase tracking-wide">Logout</span></div><ChevronRight className="size-3.5 text-rose-300 group-hover:text-rose-600" /></button></div></div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
