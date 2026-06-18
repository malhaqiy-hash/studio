
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
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const SETTINGS_KEY = "ontapp_system_settings_v2";

interface SettingsState {
  language: string;
  theme: string;
  emailUpdates: boolean;
  directMessages: boolean;
  networkActivity: boolean;
  apiEndpoint: string;
  twoFactorAuth: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  language: "en",
  theme: "system",
  emailUpdates: true,
  directMessages: true,
  networkActivity: false,
  apiEndpoint: "https://api.ontapp.network/v1/discover",
  twoFactorAuth: false,
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [settings, setSettings] = React.useState<SettingsState>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure any new keys are present
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
      }
    }
    setMounted(true);
  }, []);

  const handleSave = () => {
    setLoading(true);
    
    // In a real app, you might also send this to a backend API
    // We'll simulate a small delay for better UX feedback
    setTimeout(() => {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
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
          description: "There was an error saving your preferences to the browser storage.",
        });
      }
    }, 800);
  };

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Prevent hydration mismatch by not rendering the form until client-side mount
  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-10 py-4 animate-pulse">
          <div className="h-32 bg-white rounded-[2rem] border border-slate-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-slate-100 rounded-[2rem]" />
            <div className="h-64 bg-slate-100 rounded-[2rem]" />
          </div>
          <div className="h-96 bg-slate-100 rounded-[2rem]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 pb-20 pt-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-slate-500 font-medium">Manage your global discovery preferences and network security.</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="rounded-2xl bg-accent hover:bg-indigo-600 px-8 h-12 font-black shadow-lg shadow-indigo-100 transition-all active:scale-95 flex gap-2"
          >
            <Save className="size-4" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Visuals & Localization */}
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
                    value={settings.language} 
                    onValueChange={(val) => updateSetting("language", val)}
                  >
                    <SelectTrigger id="language" className="rounded-xl border-slate-200 h-12 bg-white">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (Global)</SelectItem>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Smart Notifications</CardTitle>
                  <CardDescription className="text-xs font-medium">Control how and when you receive network alerts.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <Label className="font-bold text-slate-700">Email Digest</Label>
                    <p className="text-xs text-slate-400 font-medium">Weekly summary of discovery leads.</p>
                  </div>
                  <Switch 
                    checked={settings.emailUpdates} 
                    onCheckedChange={(val) => updateSetting("emailUpdates", val)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <Label className="font-bold text-slate-700">Direct Messages</Label>
                    <p className="text-xs text-slate-400 font-medium">Alerts for inbound partnership chats.</p>
                  </div>
                  <Switch 
                    checked={settings.directMessages} 
                    onCheckedChange={(val) => updateSetting("directMessages", val)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <Label className="font-bold text-slate-700">Network Activity</Label>
                    <p className="text-xs text-slate-400 font-medium">Real-time alerts for industry trends.</p>
                  </div>
                  <Switch 
                    checked={settings.networkActivity} 
                    onCheckedChange={(val) => updateSetting("networkActivity", val)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <Label className="font-bold text-slate-700 flex items-center gap-2">
                      <Lock className="size-3.5" /> 
                      2FA Login
                    </Label>
                    <p className="text-xs text-slate-400 font-medium">Enhanced account security layer.</p>
                  </div>
                  <Switch 
                    checked={settings.twoFactorAuth} 
                    onCheckedChange={(val) => updateSetting("twoFactorAuth", val)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API & Network */}
          <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Database className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">API & Discovery Engine</CardTitle>
                  <CardDescription className="text-xs font-medium">Advanced network indexing and data sync controls.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="api-endpoint" className="font-bold text-slate-700">Primary Discovery URL</Label>
                  <Input 
                    id="api-endpoint" 
                    value={settings.apiEndpoint} 
                    onChange={(e) => updateSetting("apiEndpoint", e.target.value)}
                    className="rounded-xl border-slate-200 h-12 bg-white font-medium" 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="api-key" className="font-bold text-slate-700">Encrypted Access Key</Label>
                  <div className="relative">
                    <Input id="api-key" type="password" value="••••••••••••••••••••" className="rounded-xl border-slate-200 h-12 bg-slate-50/50 font-medium pr-24" readOnly />
                    <Badge className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-100 text-slate-500 border-none">Secured</Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-[1.5rem] flex gap-4 items-start">
                <div className="size-10 rounded-xl bg-white border border-emerald-100 flex items-center justify-center shadow-sm shrink-0">
                  <ShieldCheck className="size-6 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-emerald-900 leading-none">Global Indexing Status</h4>
                    <Badge className="bg-emerald-500 text-white border-none text-[10px] uppercase font-black px-2 py-0">Active</Badge>
                  </div>
                  <p className="text-xs text-emerald-700 font-medium max-w-2xl">
                    Your discovery engine is currently authenticated and indexing external business registries. Your match scores will include real-time global data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between p-8 bg-slate-900 text-white rounded-[2rem] shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-lg font-bold">Persistence & Backup</h3>
            <p className="text-slate-400 text-sm font-medium">Settings are automatically synchronized and stored locally.</p>
          </div>
          <div className="relative z-10 flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setSettings(DEFAULT_SETTINGS)}
              className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 font-black px-6 h-12 border-none"
            >
              Reset to Defaults
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="rounded-xl bg-white text-slate-900 hover:bg-indigo-50 font-black px-10 h-12 shadow-lg transition-all active:scale-95"
            >
              {loading ? "Processing..." : "Commit Settings"}
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>
      </div>
    </DashboardLayout>
  );
}
