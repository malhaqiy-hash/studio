"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // AUTO-SAVE: Langsung simpan tema
  const handleThemeChange = (val: string) => {
    const newSettings = { ...settings, theme: val };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    applyTheme(val);
    toast({ title: "Tema Diperbarui" });
  };

  // AUTO-SAVE: Langsung simpan bahasa
  const handleLanguageChange = (val: any) => {
    setLanguage(val);
    toast({ title: "Bahasa Diperbarui" });
  };

  // AUTO-SAVE: Langsung simpan preferensi privasi
  const updatePreference = (key: string, value: boolean) => {
    updateActiveAccount({
      preferences: {
        ...activeAccount.preferences,
        [key]: value
      }
    });
    toast({ title: "Privasi Diperbarui" });
  };

  if (!mounted) return <DashboardLayout><div className="max-w-5xl mx-auto py-4 animate-pulse h-96 bg-card rounded-3xl" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-4 pb-20 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-foreground tracking-tight uppercase">{t('settings')}</h1>
            <p className="text-muted-foreground font-medium text-[11px] uppercase tracking-wider">Perubahan disimpan otomatis</p>
          </div>
        </div>

        <div className="grid gap-4">
          <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-black text-white p-5">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Lock className="size-4.5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-[15px] font-black uppercase tracking-tight">Privasi & Visibilitas</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeAccount.type === 'pribadi' ? (
                  <>
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/5">
                      <Label className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Users className="size-3.5" /> Pengikut</Label>
                      <Switch 
                        checked={activeAccount.preferences?.publicFollowers} 
                        onCheckedChange={(val) => updatePreference('publicFollowers', val)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/5">
                      <Label className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Users className="size-3.5" /> Mengikuti</Label>
                      <Switch 
                        checked={activeAccount.preferences?.publicFollowing} 
                        onCheckedChange={(val) => updatePreference('publicFollowing', val)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/5">
                    <Label className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Eye className="size-3.5" /> Penonton Profil</Label>
                    <Switch 
                      checked={activeAccount.preferences?.publicViews} 
                      onCheckedChange={(val) => updatePreference('publicViews', val)}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/5">
                  <Label className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Heart className="size-3.5" /> Penyukat</Label>
                  <Switch 
                    checked={activeAccount.preferences?.publicLikes} 
                    onCheckedChange={(val) => updatePreference('publicLikes', val)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/10 border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-black text-white flex items-center justify-center">
                    <Palette className="size-4.5" />
                  </div>
                  <CardTitle className="text-[14px] font-bold">Tampilan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Pilih Tema</Label>
                  <Select value={settings.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="rounded-xl h-11 bg-background text-[13px] font-bold shadow-inner"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="light">Terang</SelectItem><SelectItem value="dark">Gelap</SelectItem><SelectItem value="system">Ikuti Sistem</SelectItem></SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/10 border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-black text-white flex items-center justify-center">
                    <Globe className="size-4.5" />
                  </div>
                  <CardTitle className="text-[14px] font-bold">Lokalisasi</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Bahasa Pilihan</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="rounded-xl h-11 bg-background text-[13px] font-bold shadow-inner"><SelectValue /></SelectTrigger>
                    <SelectContent>{LANGUAGES.map(lang => (<SelectItem key={lang.code} value={lang.code}>{lang.flag} {lang.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/10 border-b border-border p-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-black text-white flex items-center justify-center">
                  <Cpu className="size-4.5" />
                </div>
                <CardTitle className="text-[14px] font-bold">Sistem & Informasi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <Link href="/settings/info">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/10 hover:bg-black/[0.03] border border-border transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-8 rounded-lg bg-card shadow-sm flex items-center justify-center"><Lock className="size-3.5" /></div>
                    <div className="text-left">
                      <h4 className="font-bold text-[13px]">Info Aplikasi</h4>
                      <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">V 2.4.0 Stable</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/30" />
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
