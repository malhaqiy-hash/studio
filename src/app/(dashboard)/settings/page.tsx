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
  Languages
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SETTINGS_KEY = "ontapp_system_settings";

interface SettingsState {
  language: string;
  theme: string;
  emailUpdates: boolean;
  directMessages: boolean;
  networkActivity: boolean;
  apiEndpoint: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  language: "en",
  theme: "system",
  emailUpdates: true,
  directMessages: true,
  networkActivity: false,
  apiEndpoint: "https://api.ontapp.network/v1/discover",
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
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setMounted(true);
  }, []);

  const handleSave = () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your configuration has been updated and persisted successfully.",
      });
    }, 800);
  };

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Prevent hydration mismatch by not rendering the form values until mounted
  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-10 w-48 bg-slate-200 rounded-lg" />
          <div className="h-64 bg-slate-100 rounded-3xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div>
          <h1 className="text-3xl font-headline font-black text-slate-900">System Settings</h1>
          <p className="text-slate-500 font-medium">Manage your platform preferences and network configurations.</p>
        </div>

        <div className="grid gap-6">
          {/* Localization & Language */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Languages className="size-5 text-accent" />
                <CardTitle className="text-lg">Localization</CardTitle>
              </div>
              <CardDescription>Select your preferred language and regional format.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="max-w-xs space-y-2">
                <Label htmlFor="language" className="font-bold text-slate-700">Display Language</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(val) => updateSetting("language", val)}
                >
                  <SelectTrigger id="language" className="rounded-xl border-slate-200">
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

          {/* Theme & Visuals */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Palette className="size-5 text-indigo-500" />
                <CardTitle className="text-lg">Appearance</CardTitle>
              </div>
              <CardDescription>Customize how OnTapp looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="max-w-xs space-y-2">
                <Label htmlFor="theme" className="font-bold text-slate-700">Interface Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(val) => updateSetting("theme", val)}
                >
                  <SelectTrigger id="theme" className="rounded-xl border-slate-200">
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

          {/* Notifications */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-orange-500" />
                <CardTitle className="text-lg">Notifications</CardTitle>
              </div>
              <CardDescription>Configure which events trigger alerts.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-bold text-slate-700">Email Updates</Label>
                  <p className="text-xs text-slate-400 font-medium">Receive weekly digest and major platform updates.</p>
                </div>
                <Switch 
                  checked={settings.emailUpdates} 
                  onCheckedChange={(val) => updateSetting("emailUpdates", val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-bold text-slate-700">Direct Messages</Label>
                  <p className="text-xs text-slate-400 font-medium">Get notified when a potential partner messages you.</p>
                </div>
                <Switch 
                  checked={settings.directMessages} 
                  onCheckedChange={(val) => updateSetting("directMessages", val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-bold text-slate-700">Network Activity</Label>
                  <p className="text-xs text-slate-400 font-medium">Alerts for new opportunities in your sector.</p>
                </div>
                <Switch 
                  checked={settings.networkActivity} 
                  onCheckedChange={(val) => updateSetting("networkActivity", val)}
                />
              </div>
            </CardContent>
          </Card>

          {/* API & Network */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="size-5 text-emerald-500" />
                <CardTitle className="text-lg">API Network Configurations</CardTitle>
              </div>
              <CardDescription>Manage external data indexing and secure API connections.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint" className="font-bold text-slate-700">Discovery API Endpoint</Label>
                  <Input 
                    id="api-endpoint" 
                    value={settings.apiEndpoint} 
                    onChange={(e) => updateSetting("apiEndpoint", e.target.value)}
                    className="rounded-xl border-slate-200" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="font-bold text-slate-700">Secret Access Key</Label>
                  <Input id="api-key" type="password" value="••••••••••••••••" className="rounded-xl border-slate-200" readOnly />
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 items-start">
                <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-emerald-900 leading-none">Discovery Indexing Active</h4>
                  <p className="text-xs text-emerald-700 font-medium">Your account is currently syncing with external business directories.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-200">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="rounded-2xl bg-accent hover:bg-indigo-600 px-10 h-14 font-black shadow-lg shadow-indigo-100 flex gap-2"
          >
            <Save className="size-5" />
            {loading ? "Saving Changes..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
