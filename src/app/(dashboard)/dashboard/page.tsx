"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Zap, 
  ArrowUpRight, 
  Activity, 
  DollarSign,
  Target,
  Clock,
  ShieldCheck,
  Award,
  Globe,
  Star,
  Brain,
  Bookmark,
  Search,
  Trash2,
  ExternalLink,
  MapPin,
  MessageCircleCode,
  Instagram,
  Facebook,
  Music,
  Youtube,
  ShoppingBag,
  Linkedin,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { useAccount } from "@/context/account-context";

const RECENT_ACTIVITY = [
  { id: 1, type: 'match', title: 'Sinergi Baru Ditemukan', desc: 'EcoPack Solutions (98%)', time: '10m yang lalu' },
  { id: 2, type: 'opportunity', title: 'Update Pipeline', desc: 'Global Logistics pindah ke Won', time: '2j yang lalu' },
  { id: 3, type: 'search', title: 'Alert AI Scout', desc: 'Permintaan tinggi di Green Tech terdeteksi', time: '5j yang lalu' },
];

const PERFORMANCE_DATA = [
  { month: "Jan", volume: 4500, value: 24 },
  { month: "Feb", volume: 5200, value: 32 },
  { month: "Mar", volume: 4800, value: 28 },
  { month: "Apr", volume: 6100, value: 45 },
  { month: "May", volume: 5900, value: 38 },
  { month: "Jun", volume: 7200, value: 52 },
];

const chartConfig = {
  volume: {
    label: "Aktivitas Jaringan",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function UserDashboardPage() {
  const { t, language } = useLanguage();
  const { activeAccount, removePost } = useAccount();

  const getStats = () => {
    if (activeAccount.type === 'bisnis') {
      return [
        { label: t('active_opps'), val: "24", icon: Briefcase, color: "text-teal-600", bg: "bg-teal-50" },
        { label: "Market Reach", val: "1.2k", icon: Globe, color: "text-accent", bg: "bg-accent/10" },
        { label: t('pipeline_est'), val: "$42.5k", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Market Pulse", val: "Bullish", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" }
      ];
    }
    if (activeAccount.type === 'professional') {
      return [
        { label: t('synergy_score'), val: "94%", icon: Target, color: "text-teal-600", bg: "bg-teal-50" },
        { label: "Proyek Aktif", val: "8", icon: Award, color: "text-accent", bg: "bg-accent/10" },
        { label: "Profil View", val: "452", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Keahlian", val: activeAccount.extra || "Umum", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" }
      ];
    }
    return [
      { label: "Disimpan", val: "12", icon: Bookmark, color: "text-teal-600", bg: "bg-teal-50" },
      { label: "Koneksi", val: "84", icon: Users, color: "text-accent", bg: "bg-accent/10" },
      { label: "Pencarian", val: "128", icon: Search, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Voucher AI", val: "5", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" }
    ];
  };

  const getLinkIcon = (url?: string) => {
    if (!url) return <Link2 className="size-4" />;
    const l = url.toLowerCase();
    if (l.includes('maps.google') || l.includes('goo.gl/maps')) return <MapPin className="size-4 text-rose-500" />;
    if (l.includes('wa.me') || l.includes('whatsapp')) return <MessageCircleCode className="size-4 text-emerald-500" />;
    if (l.includes('instagram')) return <Instagram className="size-4 text-pink-500" />;
    if (l.includes('facebook') || l.includes('fb.com')) return <Facebook className="size-4 text-blue-600" />;
    if (l.includes('tiktok')) return <Music className="size-4 text-foreground" />;
    if (l.includes('youtube') || l.includes('youtu.be')) return <Youtube className="size-4 text-red-600" />;
    if (l.includes('shopee')) return <ShoppingBag className="size-4 text-orange-500" />;
    if (l.includes('tokopedia')) return <ShoppingBag className="size-4 text-green-500" />;
    if (l.includes('linkedin')) return <Linkedin className="size-4 text-blue-700" />;
    return <Link2 className="size-4 text-accent" />;
  };

  const stats = getStats();

  return (
    <DashboardLayout>
      <div className="space-y-8 py-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              {activeAccount.type === 'bisnis' ? 'Pusat Komando Bisnis' : 
               activeAccount.type === 'professional' ? 'Dashboard Professional' : 
               t('dashboard')}
            </h1>
            <p className="text-slate-500 font-medium text-lg">{t('dashboard_desc')}</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex gap-2">
              <ShieldCheck className="size-3" /> {activeAccount.verificationStatus === 'Verified' ? t('verified_account') : 'Profil Dalam Review AI'}
            </Badge>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="rounded-[2rem] border-slate-100 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                  <stat.icon className="size-6" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-slate-900 truncate">{stat.val}</p>
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 line-clamp-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 rounded-[3rem] border-slate-100 shadow-xl overflow-hidden bg-white">
            <CardHeader className="p-10 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">
                    {activeAccount.type === 'bisnis' ? 'Pertumbuhan Pipeline' : 'Aktivitas Jaringan'}
                  </CardTitle>
                  <CardDescription className="font-bold text-slate-400">
                    {language === 'id' ? 'Visualisasi performa Anda dalam 6 bulan terakhir.' : 'Visualization of your performance over the last 6 months.'}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-lg h-8 px-3 text-xs font-black uppercase border-slate-100 text-slate-400">
                  6 Bulan Terakhir
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-10">
              <div className="h-[300px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_DATA}>
                      <defs>
                        <linearGradient id="colorAct" x1="0" x1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                        dy={10}
                      />
                      <YAxis hide />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="volume" 
                        stroke="var(--color-volume)" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorAct)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 rounded-[3rem] border-slate-100 shadow-xl bg-slate-900 text-white overflow-hidden relative">
            <CardHeader className="p-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Activity className="size-5 text-accent" />
                </div>
                <CardTitle className="text-xl font-black">{t('recent_act')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6 relative z-10">
              {RECENT_ACTIVITY.map((act) => (
                <div key={act.id} className="flex gap-4 group cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="size-2 rounded-full bg-accent mt-1.5" />
                    <div className="w-0.5 flex-1 bg-white/10 my-2" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-sm text-white group-hover:text-accent transition-colors">{act.title}</h4>
                      <span className="text-[9px] font-bold text-white/30 uppercase">{act.time}</span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{act.desc}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 mt-4">
                Lihat Log Lengkap
              </Button>
            </CardContent>
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl -mr-24 -mt-24" />
          </Card>
        </div>

        {/* New Management Section: Manage All Posts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Postingan</h2>
            <Badge variant="secondary" className="font-black text-[10px] uppercase">{activeAccount.items?.length || 0} Total Konten</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeAccount.items || []).map((item) => (
              <Card key={item.id} className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  {item.image ? (
                    <img src={item.image} className="w-full h-full object-cover" alt="Content" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="size-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className={cn(
                      "font-black text-[9px] uppercase border-none",
                      item.source === 'feed' ? "bg-accent text-white" : "bg-teal-500 text-white"
                    )}>
                      {item.source === 'feed' ? 'Beranda' : 'Profil'}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removePost(item.id)}
                      className="rounded-xl h-12 px-6 font-black uppercase text-xs gap-2"
                    >
                      <Trash2 className="size-4" /> Hapus
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-black text-slate-900 text-lg line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.timestamp}</span>
                    <div className="flex gap-2">
                      {item.externalLink && (
                        <button onClick={() => window.open(item.externalLink, '_blank')} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-accent transition-colors">
                          {getLinkIcon(item.externalLink)}
                        </button>
                      )}
                      {item.locationLink && (
                        <button onClick={() => window.open(item.locationLink, '_blank')} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                          <MapPin className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!activeAccount.items || activeAccount.items.length === 0) && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50 space-y-4">
                <div className="size-20 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center text-slate-200">
                  <Zap className="size-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">Belum Ada Postingan</h3>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">Postingan yang Anda tambahkan di Beranda atau Profil akan muncul di sini.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Context Banner */}
        <div className="p-12 rounded-[4rem] bg-teal-700 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="size-24 rounded-[2.5rem] bg-white/20 backdrop-blur-xl flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform duration-500">
              {activeAccount.type === 'bisnis' ? <Zap className="size-12 text-white fill-white" /> : <Brain className="size-12 text-white" />}
            </div>
            <div className="space-y-3 flex-1 text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tight">
                {activeAccount.type === 'bisnis' ? t('network_evolution') : 'Akselerasi Profil Anda'}
              </h3>
              <p className="text-teal-100 font-medium text-lg max-w-xl">
                {activeAccount.type === 'bisnis' 
                  ? 'AI OnTapp telah mendeteksi 14 kembaran bisnis (*lookalike partners*) di wilayah Asia Timur yang belum Anda sapa.' 
                  : `AI menyarankan Anda untuk memperbarui portofolio keahlian '${activeAccount.extra}' untuk mendapatkan kecocokan 40% lebih tinggi minggu ini.`}
              </p>
            </div>
            <Button className="rounded-2xl bg-white text-teal-700 hover:bg-teal-50 font-black px-10 h-14 shadow-xl shadow-black/10 active:scale-95 transition-all">
              {activeAccount.type === 'bisnis' ? t('connect_now') : 'Perbarui Profil'}
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -mr-96 -mt-96" />
        </div>
      </div>
    </DashboardLayout>
  );
}
