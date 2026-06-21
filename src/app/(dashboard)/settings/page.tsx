"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Languages,
  Monitor,
  Globe,
  Lock,
  ChevronRight,
  Cpu,
  Eye,
  Heart,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, LANGUAGES } from "@/context/language-context";
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
  
  const [mounted, setMounted] = React.useState(false);
  const [settings, setSettings] = React.useState<SettingsState>(DEFAULT_SETTINGS);

  const applyTheme = (theme: string) => {
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

  // Auto-save logic for Theme
  const handleThemeChange = (val: string) => {
    const newSettings = { ...settings, theme: val };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    applyTheme(val);
    toast({ title: "Tema Diperbarui", description: "Perubahan tampilan telah diterapkan secara otomatis." });
  };

  // Auto-save logic for Language
  const handleLanguageChange = (val: any) => {
    setLanguage(val);
    toast({ title: "Bahasa Diperbarui", description: "Format bahasa sistem telah disinkronkan." });
  };

  const updatePreference = (key: string, value: boolean) => {
    updateActiveAccount({
      preferences: {
        ...activeAccount.preferences,
        [key]: value
      }
    });
    toast({ title: "Privasi Diperbarui", description: "Perubahan visibilitas profil telah disimpan." });
  };

  if (!mounted) return <DashboardLayout><div className="max-w-5xl mx-auto py-4 animate-pulse h-96 bg-card rounded-3xl" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-[2rem] border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">{t('settings')}</h1>
            <p className="text-muted-foreground font-medium text-xs md:text-sm">Preferensi sistem dan visibilitas jaringan Anda disimpan otomatis.</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="border-border shadow-sm rounded-[2rem] overflow-hidden group">
            <CardHeader className="bg-slate-900 text-white p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Lock className="size-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black">Privasi & Visibilitas</CardTitle>
                  <CardDescription className="text-slate-400 font-medium text-xs">Kontrol akses informasi profil Anda.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAccount.type === 'pribadi' ? (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
                      <Label className="font-black text-xs uppercase tracking-tight flex items-center gap-2 text-foreground"><Users className="size-3.5 text-accent" /> Daftar Pengikut</Label>
                      <Switch 
                        checked={activeAccount.preferences?.publicFollowers} 
                        onCheckedChange={(val) => updatePreference('publicFollowers', val)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
                      <Label className="font-black text-xs uppercase tracking-tight flex items-center gap-2 text-foreground"><Users className="size-3.5 text-accent" /> Daftar Mengikuti</Label>
                      <Switch 
                        checked={activeAccount.preferences?.publicFollowing} 
                        onCheckedChange={(val) => updatePreference('publicFollowing', val)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
                    <Label className="font-black text-xs uppercase tracking-tight flex items-center gap-2 text-foreground"><Eye className="size-3.5 text-accent" /> Daftar Penonton Profil</Label>
                    <Switch 
                      checked={activeAccount.preferences?.publicViews} 
                      onCheckedChange={(val) => updatePreference('publicViews', val)}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
                  <Label className="font-black text-xs uppercase tracking-tight flex items-center gap-2 text-foreground"><Heart className="size-3.5 text-rose-500" /> Daftar Penyukat</Label>
                  <Switch 
                    checked={activeAccount.preferences?.publicLikes} 
                    onCheckedChange={(val) => updatePreference('publicLikes', val)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow bg-card">
              <CardHeader className="bg-muted/20 border-b border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Palette className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">Tampilan</CardTitle>
                    <CardDescription className="text-xs font-medium text-muted-foreground">Tema antarmuka sistem.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs flex items-center gap-2">
                    <Monitor className="size-4 text-muted-foreground" /> Pilih Tema
                  </Label>
                  <Select value={settings.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="rounded-xl h-11 bg-background text-foreground"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="light">Terang</SelectItem><SelectItem value="dark">Gelap</SelectItem><SelectItem value="system">Ikuti Sistem</SelectItem></SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow bg-card">
              <CardHeader className="bg-muted/20 border-b border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">Lokalisasi</CardTitle>
                    <CardDescription className="text-xs font-medium text-muted-foreground">Format regional dan bahasa.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs flex items-center gap-2">
                    <Globe className="size-4 text-muted-foreground" /> Bahasa Pilihan
                  </Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="rounded-xl h-11 bg-background text-foreground"><SelectValue /></SelectTrigger>
                    <SelectContent>{LANGUAGES.map(lang => (<SelectItem key={lang.code} value={lang.code}>{lang.flag} {lang.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow bg-card">
            <CardHeader className="bg-muted/20 border-b border-border p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cpu className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Sistem & Informasi</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground">Detail aplikasi.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Link href="/settings/info">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-black/5 border border-border hover:border-black transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="size-9 rounded-xl bg-card shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Lock className="size-4.5 text-accent" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-sm text-foreground">Info Aplikasi</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">V 2.4.0 Stable</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-black transition-colors" />
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
