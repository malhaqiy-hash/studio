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
  ShieldCheck
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

const RECENT_ACTIVITY = [
  { id: 1, type: 'match', title: 'New Match Found', desc: 'EcoPack Solutions (98%)', time: '10m ago' },
  { id: 2, type: 'opportunity', title: 'Pipeline Update', desc: 'Global Logistics moved to Won', time: '2h ago' },
  { id: 3, type: 'search', title: 'AI Scout Alert', desc: 'High demand in Green Tech detected', time: '5h ago' },
];

const PERFORMANCE_DATA = [
  { month: "Jan", revenue: 4500, leads: 24 },
  { month: "Feb", revenue: 5200, leads: 32 },
  { month: "Mar", revenue: 4800, leads: 28 },
  { month: "Apr", revenue: 6100, leads: 45 },
  { month: "May", revenue: 5900, leads: 38 },
  { month: "Jun", revenue: 7200, leads: 52 },
];

const chartConfig = {
  revenue: {
    label: "Revenue Pipeline",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function UserDashboardPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-8 py-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{t('dashboard')}</h1>
            <p className="text-slate-500 font-medium text-lg">{t('dashboard_desc')}</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex gap-2">
              <ShieldCheck className="size-3" /> {t('verified_account')}
            </Badge>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Peluang Aktif", val: "24", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Kecocokan AI", val: "128", icon: Target, color: "text-accent", bg: "bg-accent/10" },
            { label: "Estimasi Pipeline", val: "$42.5k", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Skor Sinergi", val: "92%", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" }
          ].map((stat, i) => (
            <Card key={i} className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-8 space-y-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                  <stat.icon className="size-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">{stat.val}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-8 rounded-[3rem] border-slate-100 shadow-xl overflow-hidden bg-white">
            <CardHeader className="p-10 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Performa Jaringan</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Pertumbuhan koneksi dan nilai peluang bulanan.</CardDescription>
                </div>
                <Badge variant="outline" className="rounded-lg h-8 px-3 text-xs font-black uppercase border-slate-100 text-slate-400">6 Bulan Terakhir</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-10">
              <div className="h-[300px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_DATA}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="revenue" 
                        stroke="var(--color-revenue)" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorRev)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Sidebar */}
          <Card className="lg:col-span-4 rounded-[3rem] border-slate-100 shadow-xl bg-slate-900 text-white overflow-hidden relative">
            <CardHeader className="p-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Activity className="size-5 text-accent" />
                </div>
                <CardTitle className="text-xl font-black">Aktivitas Terkini</CardTitle>
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
                Lihat Semua Log
              </Button>
            </CardContent>
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl -mr-24 -mt-24" />
          </Card>
        </div>

        {/* Intelligence Banner */}
        <div className="p-12 rounded-[4rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="size-24 rounded-[2.5rem] bg-white/20 backdrop-blur-xl flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform duration-500">
              <Zap className="size-12 text-white fill-white" />
            </div>
            <div className="space-y-3 flex-1 text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tight">Evolusi Jaringan Anda</h3>
              <p className="text-indigo-100 font-medium text-lg max-w-xl">
                AI OnTapp telah mendeteksi 14 kembaran bisnis (*lookalike partners*) di wilayah Asia Timur yang belum Anda sapa.
              </p>
            </div>
            <Button className="rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-black px-10 h-14 shadow-xl shadow-black/10 active:scale-95 transition-all">
              Hubungkan Sekarang
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -mr-96 -mt-96" />
        </div>
      </div>
    </DashboardLayout>
  );
}
