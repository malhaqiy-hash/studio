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
  ChevronRight,
  Zap,
  Heart,
  Eye,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, LANGUAGES } from "@/context/language-context";
import { useAccount } from "@/context/account-context";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { cn } from "@/lib/utils";

const SETTINGS_KEY = "ontapp_system_settings_v3";

interface SettingsState {
  theme: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: "system",
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { activeAccount, availableAccounts, switchAccount, updateActiveAccount } = useAccount();
  const auth = useAuth();
  const router = useRouter();
  
  const [mounted, setMounted] = React.useState(false);
  const [settings, setSettings] = React.useState<SettingsState>(DEFAULT_SETTINGS);

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

  const handleLanguageChange = (val: any) => {
    setLanguage(val);
    toast({ title: "Bahasa Diperbarui" });
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

  const MenuList = ({ items }: { items: any[] }) => (
    <div className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
      {items.map((item, idx) => (
        <div key={idx} className="group relative">
          {item.href ? (
            <button onClick={() => router.push(item.href)} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn("size-9 rounded-xl flex items-center justify-center shadow-sm", item.bg || "bg-muted text-muted-foreground")}>
                  <item.icon className="size-4.5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[14px] leading-none">{item.label}</h4>
                  {item.desc && <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">{item.desc}</p>}
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-black transition-colors" />
            </button>
          ) : (
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={cn("size-9 rounded-xl flex items-center justify-center shadow-sm", item.bg || "bg-muted text-muted-foreground")}>
                  <item.icon className="size-4.5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[14px] leading-none">{item.label}</h4>
                  {item.desc && <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">{item.desc}</p>}
                </div>
              </div>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 pb-32 pt-4 px-1">
        <header className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings')}</h1>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Manajemen sistem dan ekosistem</p>
        </header>

        {/* GROUP 1: AKUN */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Akun & Keamanan</h3>
          <MenuList items={[
            { icon: User, label: "Kelola Akun", desc: "Profil, Tipe Akun, Lencana", href: "/profile", bg: "bg-black text-white" },
            { 
              icon: ShieldCheck, 
              label: "Izin Keamanan & Privasi Sosial", 
              desc: "Enkripsi & Manajemen Perangkat",
              content: (
                <div className="space-y-4 pt-2">
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Siapa dapat melihat Pengikut?</Label>
                      <Select value={activeAccount.preferences?.whoCanSeeFollowers} onValueChange={(v) => updatePrivacy('whoCanSeeFollowers', v)}>
                        <SelectTrigger className="rounded-xl h-10 bg-muted/20 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="friends">👥 Diikuti</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Siapa dapat melihat Mengikuti?</Label>
                      <Select value={activeAccount.preferences?.whoCanSeeFollowing} onValueChange={(v) => updatePrivacy('whoCanSeeFollowing', v)}>
                        <SelectTrigger className="rounded-xl h-10 bg-muted/20 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="friends">👥 Diikuti</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Siapa dapat melihat Suka?</Label>
                      <Select value={activeAccount.preferences?.whoCanSeeLikes} onValueChange={(v) => updatePrivacy('whoCanSeeLikes', v)}>
                        <SelectTrigger className="rounded-xl h-10 bg-muted/20 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="friends">👥 Diikuti</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Siapa dapat melihat Subscribe?</Label>
                      <Select value={activeAccount.preferences?.whoCanSeeSubscribe} onValueChange={(v) => updatePrivacy('whoCanSeeSubscribe', v)}>
                        <SelectTrigger className="rounded-xl h-10 bg-muted/20 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="friends">👥 Diikuti</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )
            }
          ]} />
        </section>

        {/* GROUP 2: AKTIVITAS */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Aktivitas & Interaksi</h3>
          <MenuList items={[
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
            { 
              icon: Palette, 
              label: "Mode Tampilan", 
              desc: "Tema Antarmuka",
              content: (
                <Select value={settings.theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="rounded-xl h-10 bg-muted/20 border-none font-bold text-xs shadow-inner"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="light">Terang</SelectItem><SelectItem value="dark">Gelap</SelectItem><SelectItem value="system">Ikuti Sistem HP</SelectItem></SelectContent>
                </Select>
              )
            },
            { 
              icon: Languages, 
              label: "Bahasa", 
              desc: "Lokalisasi Aplikasi",
              content: (
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="rounded-xl h-10 bg-muted/20 border-none font-bold text-xs shadow-inner"><SelectValue /></SelectTrigger>
                  <SelectContent>{LANGUAGES.map(lang => (<SelectItem key={lang.code} value={lang.code}>{lang.flag} {lang.label}</SelectItem>))}</SelectContent>
                </Select>
              )
            },
            { icon: Accessibility, label: "Aksesibilitas", desc: "Ukuran Teks, Auto-Play", href: "#" },
            { icon: MapPin, label: "Kontak dan Lokasi", desc: "IP Geolocation, Sinkronisasi", href: "/cari" }
          ]} />
        </section>

        {/* GROUP 4: PENYIMPANAN */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Penyimpanan</h3>
          <MenuList items={[
            { 
              icon: Trash2, 
              label: "Hapus Cache", 
              desc: "Bersihkan File Sampah",
              content: (
                <button onClick={() => toast({ title: "Cache Berhasil Dihapus" })} className="w-full h-10 rounded-xl bg-muted/30 hover:bg-black/5 text-[11px] font-black uppercase tracking-widest transition-all">Bersihkan Sekarang</button>
              )
            },
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
      </div>
    </DashboardLayout>
  );
}
