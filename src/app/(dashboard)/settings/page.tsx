"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Database, 
  Save, 
  ShieldCheck,
  Languages,
  Monitor,
  Globe,
  Lock,
  Zap,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useLanguage, LANGUAGES } from "@/context/language-context";
import { useNotifications } from "@/hooks/use-notifications";

const SETTINGS_KEY = "ontapp_system_settings_v2";

interface SettingsState {
  theme: string;
  emailUpdates: boolean;
  directMessages: boolean;
  networkActivity: boolean;
  apiEndpoint: string;
  twoFactorAuth: boolean;
  pushNotifications: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: "system",
  emailUpdates: true,
  directMessages: true,
  networkActivity: false,
  apiEndpoint: "https://api.ontapp.network/v1/discover",
  twoFactorAuth: false,
  pushNotifications: false,
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
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
        console.error("Failed to parse settings from localStorage", e);
      }
    }
    setMounted(true);
  }, []);

  const handleSave = () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        applyTheme(settings.theme);
        setLoading(false);
        toast({
          title: "Configuration Saved",
          description: "Your system preferences have been updated and persisted successfully.",
        });
      } catch (e) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "There was an error saving your preferences.",
        });
      }
    }, 800);
  };

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const togglePushNotifications = async (val: boolean) => {
    if (val) {
      await requestPermission();
    }
    updateSetting("pushNotifications", val);
  };

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto py-4 animate-pulse h-96 bg-slate-50 rounded-3xl" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 pb-20 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('settings')}</h1>
            <p className="text-slate-500 font-medium">Manage your global discovery preferences and network security.</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="rounded-2xl bg-accent hover:bg-indigo-600 px-8 h-12 font-black shadow-lg flex gap-2"
          >
            <Save className="size-4" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-indigo-100 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Palette className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Appearance</CardTitle>
                    <CardDescription className="text-xs font-medium">Customize your interface theme.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="theme" className="font-bold text-slate-700 flex items-center gap-2">
                    <Monitor className="size-4 text-slate-400" />
                    Interface Theme
                  </Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(val) => updateSetting("theme", val)}
                  >
                    <SelectTrigger id="theme" className="rounded-xl border-slate-200 h-12 bg-white">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="system">Follow System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Languages className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Localization</CardTitle>
                    <CardDescription className="text-xs font-medium">Regional and language formats.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="language" className="font-bold text-slate-700 flex items-center gap-2">
                    <Globe className="size-4 text-slate-400" />
                    Preferred Language
                  </Label>
                  <Select 
                    value={language} 
                    onValueChange={(val) => setLanguage(val as any)}
                  >
                    <SelectTrigger id="language" className="rounded-xl border-slate-200 h-12 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Bell className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Smart Notifications</CardTitle>
                  <CardDescription className="text-xs font-medium">Control network alerts.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <Label className="font-bold text-slate-700">Push Notifications</Label>
                    <p className="text-[10px] text-slate-400">Get alerts on your browser/device.</p>
                  </div>
                  <Switch 
                    checked={settings.pushNotifications} 
                    onCheckedChange={togglePushNotifications}
                    disabled={notificationLoading}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                  <Label className="font-bold text-slate-700">Email Digest</Label>
                  <Switch 
                    checked={settings.emailUpdates} 
                    onCheckedChange={(val) => updateSetting("emailUpdates", val)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                  <Label className="font-bold text-slate-700">Direct Messages</Label>
                  <Switch 
                    checked={settings.directMessages} 
                    onCheckedChange={(val) => updateSetting("directMessages", val)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
