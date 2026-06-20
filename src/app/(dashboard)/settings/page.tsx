"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Palette, 
  Bell, 
  Save, 
  Languages,
  Monitor,
  Globe,
  Lock,
  Zap,
  Info,
  ChevronRight,
  Cpu,
  Eye,
  Heart,
  Users,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, LANGUAGES } from "@/context/language-context";
import { useNotifications } from "@/hooks/use-notifications";
import { useAccount } from "@/context/account-context";
import Link from "next/link";

const SETTINGS_KEY = "ontapp_system_settings_v2";

interface SettingsState {
  theme: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: "system",
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { activeAccount, updateActiveAccount } = useAccount();
  const { requestPermission, loading: notificationLoading } = useNotifications();
  
  const [loading, setLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [settings, setSettings] = React.useState<SettingsState>(DEFAULT_SETTINGS);

  const applyTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
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

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      applyTheme(settings.theme);
      setLoading(false);
      toast({ title: "Pengaturan Disimpan" });
    }, 800);
  };

  const updatePreference = (key: string, value: boolean) => {
    updateActiveAccount({
      preferences: {
        ...activeAccount.preferences,
        [key]: value
      }
    });
    toast({ title: "Privasi Diperbarui", description: "Perubahan akan segera diterapkan pada profil Anda." });
  };

  if (!mounted) return <DashboardLayout><div className="max-w-5xl mx-auto py-4 animate-pulse h-96 bg-slate-50 rounded-3xl" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 pb-20 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('settings')}</h1>
            <p className="text-slate-500 font-medium">Kelola preferensi sistem dan visibilitas jaringan Anda.</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="rounded-2xl bg-teal-600 hover:bg-teal-700 px-8 h-12 font-black shadow-lg flex gap-2 text-white"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Privacy Section */}
          <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group">
            <CardHeader className="bg-slate-900 text-white p-8 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Lock className="size-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black">Privasi & Visibilitas</CardTitle>
                  <CardDescription className="text-slate-400 font-medium">Kontrol siapa yang dapat melihat detail statistik Anda.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeAccount.type === 'pribadi' ? (
                  <>
                    <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div className="space-y-1">
                        <Label className="font-black text-sm uppercase tracking-tight flex items-center gap-2"><Users className="size-4 text-teal-600" /> Daftar Pengikut</Label>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Bisa diklik oleh publik</p>
                      </div>
                      <Switch 
                        checked={activeAccount.preferences?.publicFollowers} 
                        onCheckedChange={(val) => updatePreference('publicFollowers', val)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div className="space-y-1">
                        <Label className="font-black text-sm uppercase tracking-tight flex items-center gap-2"><Users className="size-4 text-teal-600" /> Daftar Mengikuti</Label>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Bisa diklik oleh publik</p>
                      </div>
                      <Switch 
                        checked={activeAccount.preferences?.publicFollowing} 
                        onCheckedChange={(val) => updatePreference('publicFollowing', val)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="space-y-1">
                      <Label className="font-black text-sm uppercase tracking-tight flex items-center gap-2"><Eye className="size-4 text-teal-600" /> Daftar Penonton Profil</Label>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Bisa diklik oleh publik</p>
                    </div>
                    <Switch 
                      checked={activeAccount.preferences?.publicViews} 
                      onCheckedChange={(val) => updatePreference('publicViews', val)}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="space-y-1">
                    <Label className="font-black text-sm uppercase tracking-tight flex items-center gap-2"><Heart className="size-4 text-rose-500" /> Daftar Penyukat</Label>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Bisa diklik oleh publik</p>
                  </div>
                  <Switch 
                    checked={activeAccount.preferences?.publicLikes} 
                    onCheckedChange={(val) => updatePreference('publicLikes', val)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Palette className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Tampilan</CardTitle>
                    <CardDescription className="text-xs font-medium">Sesuaikan tema antarmuka Anda.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="theme" className="font-bold text-slate-700 flex items-center gap-2">
                    <Monitor className="size-4 text-slate-400" /> Tema Antarmuka
                  </Label>
                  <Select value={settings.theme} onValueChange={(val) => setSettings({ theme: val })}>
                    <SelectTrigger className="rounded-xl h-12 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="light">Terang</SelectItem><SelectItem value="dark">Gelap</SelectItem><SelectItem value="system">Ikuti Sistem</SelectItem></SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Languages className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Lokalisasi</CardTitle>
                    <CardDescription className="text-xs font-medium">Format regional dan bahasa.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="language" className="font-bold text-slate-700 flex items-center gap-2">
                    <Globe className="size-4 text-slate-400" /> Bahasa Pilihan
                  </Label>
                  <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
                    <SelectTrigger className="rounded-xl h-12 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{LANGUAGES.map(lang => (<SelectItem key={lang.code} value={lang.code}>{lang.flag} {lang.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cpu className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Sistem & Informasi</CardTitle>
                  <CardDescription className="text-xs font-medium">Detail aplikasi dan transparansi fitur.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <Link href="/settings/info">
                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Info className="size-5 text-teal-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-slate-900">Info Aplikasi</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Penjelasan Fitur & Kuota AI</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-slate-300 group-hover:text-teal-600 transition-colors" />
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
