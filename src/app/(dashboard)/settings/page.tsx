
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
  History, 
  MessageSquare, 
  Bell, 
  Palette, 
  Languages, 
  Accessibility, 
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
  Heart,
  UserCheck,
  UserPlus,
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

// Mock Data for Hubungan
const MOCK_RELATIONS = {
  pengikut: [
    { id: 'u1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/u1/100', extra: 'Distributor Kopi' },
    { id: 'u2', name: 'Siti Aminah', avatar: 'https://picsum.photos/seed/u2/100', extra: 'Pemasok Kemasan' },
    { id: 'u3', name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/u3/100', extra: 'Logistik Regional' },
  ],
  mengikuti: [
    { id: 'u4', name: 'Alpha Tech', avatar: 'https://picsum.photos/seed/u4/100', extra: 'Solusi AI' },
    { id: 'u5', name: 'Global Logistics', avatar: 'https://picsum.photos/seed/u5/100', extra: 'Cargo Udara' },
  ],
  suka: [
    { id: 'u6', name: 'Rina Kartika', avatar: 'https://picsum.photos/seed/u6/100', extra: 'Desain Produk' },
    { id: 'u7', name: 'Hendra Gunawan', avatar: 'https://picsum.photos/seed/u7/100', extra: 'Export Manager' },
  ],
  subscribe: [
    { id: 'u8', name: 'Indo Retail Corp', avatar: 'https://picsum.photos/seed/u8/100', extra: 'Premium Member' },
    { id: 'u9', name: 'Eco Pack Solutions', avatar: 'https://picsum.photos/seed/u9/100', extra: 'Partner Bisnis' },
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

  const applyTheme = (theme: string) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        applyTheme(parsed.theme);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
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
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updatePrivacy = (key: string, val: string) => {
    updateActiveAccount({
      preferences: {
        ...activeAccount.preferences,
        [key]: val
      }
    });
    toast({ title: "Privasi Diperbarui" });
  };

  if (!mounted) return <DashboardLayout><div className="max-w-5xl mx-auto py-4 animate-pulse h-96 bg-card rounded-3xl" /></DashboardLayout>;

  // --- SUB-MENU COMPONENTS ---

  const SubMenuLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 border-b border-border/40 pb-4">
        <button 
          onClick={() => setActiveSubMenu(null)}
          className="size-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-black transition-all active:scale-90"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h2 className="text-lg font-black uppercase tracking-tight">{title}</h2>
      </div>
      <div className="px-1">{children}</div>
    </div>
  );

  const UserListRow = ({ user, actionLabel }: { user: any, actionLabel?: string }) => (
    <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-transparent hover:border-border transition-all">
      <div className="flex items-center gap-3">
        <Avatar className="size-10 rounded-xl border border-border">
          <AvatarImage src={user.avatar} className="object-cover" />
          <AvatarFallback className="bg-black/5 font-bold text-xs">{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold text-[14px] leading-none mb-1">{user.name}</span>
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{user.extra}</span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest px-3">
        {actionLabel || 'Lihat'}
      </Button>
    </div>
  );

  const renderSubMenuContent = () => {
    switch (activeSubMenu) {
      case "hubungan":
        const isPribadi = activeAccount.type === 'pribadi';
        return (
          <SubMenuLayout title="Hubungan Jaringan">
            <Tabs defaultValue={isPribadi ? "pengikut" : "subscribe"} className="w-full">
              <TabsList className="w-full grid h-12 bg-muted/20 rounded-xl p-1 gap-1 mb-6" style={{ gridTemplateColumns: isPribadi ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' }}>
                {isPribadi ? (
                  <>
                    <TabsTrigger value="pengikut" className="rounded-lg font-black text-[10px] uppercase tracking-widest">Pengikut</TabsTrigger>
                    <TabsTrigger value="mengikuti" className="rounded-lg font-black text-[10px] uppercase tracking-widest">Mengikuti</TabsTrigger>
                    <TabsTrigger value="suka" className="rounded-lg font-black text-[10px] uppercase tracking-widest">Suka</TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="subscribe" className="rounded-lg font-black text-[10px] uppercase tracking-widest">Subscriber</TabsTrigger>
                    <TabsTrigger value="suka" className="rounded-lg font-black text-[10px] uppercase tracking-widest">Penyuka</TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="pengikut" className="space-y-2 outline-none">
                {MOCK_RELATIONS.pengikut.map(u => <UserListRow key={u.id} user={u} actionLabel="Ikuti Balik" />)}
              </TabsContent>
              <TabsContent value="mengikuti" className="space-y-2 outline-none">
                {MOCK_RELATIONS.mengikuti.map(u => <UserListRow key={u.id} user={u} actionLabel="Berhenti" />)}
              </TabsContent>
              <TabsContent value="suka" className="space-y-2 outline-none">
                {MOCK_RELATIONS.suka.map(u => <UserListRow key={u.id} user={u} actionLabel="Hubungkan" />)}
              </TabsContent>
              <TabsContent value="subscribe" className="space-y-2 outline-none">
                {MOCK_RELATIONS.subscribe.map(u => <UserListRow key={u.id} user={u} actionLabel="Detail" />)}
              </TabsContent>
            </Tabs>
          </SubMenuLayout>
        );

      case "keamanan_privasi":
        return (
          <SubMenuLayout title="Izin Keamanan & Privasi">
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kredensial</h3>
                <div className="grid grid-cols-2 gap-2">
                   <button className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-[11px] font-black uppercase tracking-tight text-center hover:bg-muted/30 transition-all">Ubah Password</button>
                   <button className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-[11px] font-black uppercase tracking-tight text-center hover:bg-muted/30 transition-all">Aktifkan 2FA</button>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kontrol Visibilitas</h3>
                <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border/50 shadow-sm">
                  {[
                    { label: "Siapa dapat melihat Pengikut?", key: "whoCanSeeFollowers" },
                    { label: "Siapa dapat melihat Mengikuti?", key: "whoCanSeeFollowing" },
                    { label: "Siapa dapat melihat Suka?", key: "whoCanSeeLikes" },
                    { label: "Siapa dapat melihat Subscribe?", key: "whoCanSeeSubscribe" },
                  ].map((item) => (
                    <div key={item.key} className="p-4 space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-slate-600">{item.label}</Label>
                      <Select 
                        value={activeAccount.preferences?.[item.key as keyof typeof activeAccount.preferences] as string || 'public'} 
                        onValueChange={(v) => updatePrivacy(item.key, v)}
                      >
                        <SelectTrigger className="rounded-xl h-11 bg-muted/20 border-none font-bold text-xs shadow-inner">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">🌍 Publik</SelectItem>
                          <SelectItem value="friends">👥 Diikuti</SelectItem>
                          <SelectItem value="private">🔒 Privat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SubMenuLayout>
        );

      case "mode":
        return (
          <SubMenuLayout title="Mode Tampilan">
            <div className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground px-1">Pilih tema antarmuka yang paling nyaman bagi Anda.</p>
              <div className="grid gap-3">
                {[
                  { id: 'light', label: 'Terang', icon: Zap, bg: 'bg-amber-50 text-amber-600' },
                  { id: 'dark', label: 'Gelap', icon: Lock, bg: 'bg-slate-900 text-white' },
                  { id: 'system', label: 'Ikuti Sistem', icon: Smartphone, bg: 'bg-muted text-muted-foreground' },
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => handleThemeChange(m.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all active:scale-[0.98]",
                      settings.theme === m.id ? "border-black bg-black/[0.02]" : "border-transparent bg-muted/20 hover:border-muted-foreground/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("size-10 rounded-xl flex items-center justify-center shadow-sm", m.bg)}>
                        <m.icon className="size-5" />
                      </div>
                      <span className="font-black text-sm uppercase tracking-wide">{m.label}</span>
                    </div>
                    {settings.theme === m.id && <Check className="size-5 text-black" />}
                  </button>
                ))}
              </div>
            </div>
          </SubMenuLayout>
        );

      case "bahasa":
        return (
          <SubMenuLayout title="Bahasa Sistem">
            <div className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground px-1">Pilih bahasa pilihan Anda untuk antarmuka aplikasi.</p>
              <Card className="rounded-3xl border border-border overflow-hidden">
                <ScrollArea className="h-[400px]">
                  <div className="flex flex-col divide-y divide-border">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          toast({ title: `Bahasa diubah ke ${lang.label}` });
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors text-left",
                          language === lang.code ? "bg-black/[0.02]" : "bg-transparent"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl leading-none">{lang.flag}</span>
                          <div className="flex flex-col">
                            <span className="font-bold text-[14px] text-slate-900">{lang.label}</span>
                            <span className="text-[10px] font-black uppercase text-muted-foreground opacity-60">{lang.code}</span>
                          </div>
                        </div>
                        {language === lang.code && <Check className="size-5 text-black" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                <Info className="size-4 text-accent mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">Daftar ini mencakup bahasa-bahasa utama dunia untuk mendukung ekspansi bisnis global Anda.</p>
              </div>
            </div>
          </SubMenuLayout>
        );

      case "hapus_cache":
        return (
          <SubMenuLayout title="Pembersihan Cache">
            <div className="space-y-6">
              <Card className="rounded-[2.5rem] border-none bg-muted/20 shadow-inner">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="size-20 rounded-full bg-white flex items-center justify-center mx-auto shadow-xl">
                    <Trash2 className="size-10 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-3xl font-black tracking-tight">24.5 MB</h4>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Ukuran File Sampah</p>
                  </div>
                  <p className="text-xs text-slate-500 font-medium px-4">Membersihkan cache akan menghapus data gambar sementara dan mempercepat performa aplikasi tanpa menghapus data penting Anda.</p>
                </CardContent>
              </Card>
              <Button 
                onClick={() => toast({ title: "Cache Berhasil Dihapus", description: "Sistem sekarang lebih ringan." })}
                className="w-full h-14 rounded-2xl bg-black text-white font-black uppercase tracking-[0.15em] shadow-xl hover:bg-black/90 active:scale-95 transition-all"
              >
                Bersihkan Sekarang
              </Button>
            </div>
          </SubMenuLayout>
        );

      case "kontak_lokasi":
        return (
          <SubMenuLayout title="Kontak dan Lokasi">
            <div className="space-y-6">
              <div className="bg-card rounded-3xl border border-border overflow-hidden divide-y divide-border">
                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">Deteksi Negara Otomatis</h4>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Gunakan IP Geolocation</p>
                  </div>
                  <Switch 
                    defaultChecked={true}
                    onCheckedChange={(checked) => toast({ title: checked ? "Lokasi Diaktifkan" : "Lokasi Dinonaktifkan" })}
                  />
                </div>
                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">Sinkronisasi Kontak</h4>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Temukan relasi bisnis</p>
                  </div>
                  <Switch 
                    defaultChecked={false}
                    onCheckedChange={(checked) => toast({ title: "Fitur akan segera hadir" })}
                  />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                <Info className="size-4 text-accent mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">Informasi lokasi digunakan hanya untuk memberikan hasil pencarian yang relevan di halaman Cari AI.</p>
              </div>
            </div>
          </SubMenuLayout>
        );

      default:
        return null;
    }
  };

  // --- MAIN MENU RENDER ---

  const MenuRow = ({ item }: { item: any }) => {
    return (
      <button 
        onClick={() => {
          if (item.subMenu) setActiveSubMenu(item.subMenu);
          else if (item.href && item.href !== '#') router.push(item.href);
        }} 
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
      >
        <div className="flex items-center gap-4 text-left">
          <div className={cn("size-9 rounded-xl flex items-center justify-center shadow-sm", item.bg || "bg-muted text-muted-foreground")}>
            <item.icon className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-[14px] leading-none">{item.label}</h4>
            {item.desc && <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">{item.desc}</p>}
          </div>
        </div>
        <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-black transition-colors" />
      </button>
    );
  };

  const MenuList = ({ items }: { items: any[] }) => (
    <div className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
      {items.map((item, idx) => (
        <MenuRow key={idx} item={item} />
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 pb-32 pt-4 px-1">
        {activeSubMenu ? (
          renderSubMenuContent()
        ) : (
          <>
            <header className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings')}</h1>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Manajemen sistem dan ekosistem</p>
            </header>

            {/* GROUP 1: AKUN */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Akun & Keamanan</h3>
              <MenuList items={[
                { icon: User, label: "Kelola Akun", desc: "Profil, Tipe Akun, Lencana", href: "/profile", bg: "bg-black text-white" },
                { icon: ShieldCheck, label: "Izin Keamanan & Privasi Sosial", desc: "Enkripsi & Manajemen Perangkat", subMenu: "keamanan_privasi" }
              ]} />
            </section>

            {/* GROUP 2: AKTIVITAS */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Aktivitas & Interaksi</h3>
              <MenuList items={[
                { icon: UserCheck, label: "Hubungan Jaringan", desc: activeAccount.type === 'pribadi' ? "Pengikut, Mengikuti, Suka" : "Subscribe & Suka", subMenu: "hubungan", bg: "bg-black text-white" },
                { icon: Activity, label: "Kelola Aktivitas", desc: "Log, Waktu Layar", href: "/dashboard" },
                { icon: History, label: "Preferensi", desc: "Filter Minat, Muted Words", href: "#" },
                { icon: MessageSquare, label: "Interaksi & Pesan", desc: "Izin Komentar, Balasan Otomatis", href: "/messages" },
                { icon: Bell, label: "Notifikasi", desc: "Push, Chat, Email", href: "/notifications" }
              ]} />
            </section>

            {/* GROUP 3: TAMPILAN */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Sistem & Tampilan</h3>
              <MenuList items={[
                { icon: Palette, label: "Mode Tampilan", desc: "Tema Antarmuka", subMenu: "mode" },
                { 
                  icon: Languages, 
                  label: "Bahasa", 
                  desc: "Lokalisasi Aplikasi",
                  subMenu: "bahasa"
                },
                { icon: Accessibility, label: "Aksesibilitas", desc: "Ukuran Teks, Auto-Play", href: "#" },
                { icon: MapPin, label: "Kontak dan Lokasi", desc: "IP Geolocation, Sinkronisasi", subMenu: "kontak_lokasi" }
              ]} />
            </section>

            {/* GROUP 4: PENYIMPANAN */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Penyimpanan</h3>
              <MenuList items={[
                { icon: Trash2, label: "Hapus Cache", desc: "Bersihkan File Sampah", subMenu: "hapus_cache" },
                { icon: HardDrive, label: "Kelola Data", desc: "Penghemat Data, Unduh ZIP", href: "#" }
              ]} />
            </section>

            {/* GROUP 5: DUKUNGAN */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Dukungan & Tentang</h3>
              <MenuList items={[
                { icon: HelpCircle, label: "Pusat Bantuan", desc: "FAQ, Hubungi CS", href: "/knowledge" },
                { icon: FileText, label: "Ketentuan & Kebijakan", desc: "Privasi, Data Pengguna", href: "#" },
                { icon: Info, label: "Info Aplikasi", desc: "V 2.4.0-Stable", href: "/settings/info" }
              ]} />
            </section>

            {/* AKSES CEPAT PALING BAWAH */}
            <div className="space-y-3 pt-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Sesi</h3>
              <div className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border shadow-sm">
                <button 
                  onClick={() => {
                    const nextAcc = availableAccounts.find(a => a.id !== activeAccount.id) || availableAccounts[0];
                    switchAccount(nextAcc.id);
                    toast({ title: `Beralih ke ${nextAcc.name}` });
                    router.push("/profile");
                  }}
                  className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-9 rounded-xl bg-black text-white flex items-center justify-center"><Users className="size-4.5" /></div>
                    <span className="font-bold text-[14px]">Beralih Akun</span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/30" />
                </button>
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-5 hover:bg-rose-50 transition-colors group">
                  <div className="flex items-center gap-4 text-rose-600">
                    <div className="size-9 rounded-xl bg-rose-100 flex items-center justify-center"><LogOut className="size-4.5" /></div>
                    <span className="font-black text-[14px] uppercase tracking-wide">Logout</span>
                  </div>
                  <ChevronRight className="size-4 text-rose-300 group-hover:text-rose-600 transition-colors" />
                </button>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">OnTapp Intelligence Network</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">© 2025 ALL RIGHTS RESERVED</p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
