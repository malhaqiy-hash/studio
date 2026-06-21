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
  Activity, 
  DollarSign,
  Target,
  ShieldCheck,
  Award,
  Globe,
  Star,
  Brain,
  Bookmark,
  Search,
  Trash2,
  MapPin,
  MessageCircleCode,
  Instagram,
  Facebook,
  Music,
  Youtube,
  ShoppingBag,
  Linkedin,
  Link2,
  Image as ImageIcon,
  X
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
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PERFORMANCE_DATA = [
  { month: "Jan", volume: 4500 },
  { month: "Feb", volume: 5200 },
  { month: "Mar", volume: 4800 },
  { month: "Apr", volume: 6100 },
  { month: "May", volume: 5900 },
  { month: "Jun", volume: 7200 },
];

const chartConfig = {
  volume: { label: "Aktivitas Jaringan", color: "hsl(var(--accent))" },
} satisfies ChartConfig;

export default function UserDashboardPage() {
  const { t, language } = useLanguage();
  const { activeAccount, removePost } = useAccount();
  const [zoomedImage, setExpandedImage] = React.useState<string | null>(null);

  const stats = [
    { label: t('active_opps'), val: "24", icon: Briefcase, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Market Reach", val: "1.2k", icon: Globe, color: "text-accent", bg: "bg-accent/10" },
    { label: t('pipeline_est'), val: "$42.5k", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Market Pulse", val: "Bullish", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 py-2 md:py-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 px-1">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">{t('dashboard')}</h1>
            <p className="text-slate-500 font-medium text-sm md:text-lg">{t('dashboard_desc')}</p>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex gap-2 w-fit">
            <ShieldCheck className="size-3" /> {t('verified_account')}
          </Badge>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="rounded-[1.5rem] md:rounded-[2rem] border-slate-100 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 md:p-8 space-y-3 md:space-y-4">
                <div className={cn("size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center", stat.bg, stat.color)}><stat.icon className="size-5 md:size-6" /></div>
                <div>
                  <p className="text-xl md:text-3xl font-black text-slate-900 truncate">{stat.val}</p>
                  <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Manajemen Postingan</h2>
            <Badge variant="secondary" className="font-black text-[8px] md:text-[10px] uppercase">{activeAccount.items?.length || 0} Konten</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {(activeAccount.items || []).map((item) => (
              <Card key={item.id} className="rounded-[1.5rem] md:rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                <div className="aspect-video relative overflow-hidden bg-slate-100 cursor-zoom-in" onClick={() => item.images?.[0] && setExpandedImage(item.images[0])}>
                  {item.images?.[0] ? (
                    <img src={item.images[0]} className="w-full h-full object-cover" alt="Content" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="size-8 md:size-12" /></div>
                  )}
                  {item.images && item.images.length > 1 && <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/60 text-white px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black">{item.images.length} Foto</div>}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 pointer-events-none">
                    <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); removePost(item.id); }} className="rounded-xl h-9 md:h-12 px-4 md:px-6 font-black uppercase text-[10px] md:text-xs gap-2 pointer-events-auto shadow-xl"><Trash2 className="size-3.5 md:size-4" /> Hapus</Button>
                  </div>
                </div>
                <CardContent className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-sm md:text-lg line-clamp-1">{item.title}</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!zoomedImage} onOpenChange={() => setExpandedImage(null)}>
        <DialogContent 
          className="max-w-screen-lg p-0 bg-black/95 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden"
          onClick={() => setExpandedImage(null)}
        >
          {zoomedImage && (
            <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4 cursor-pointer">
              <img 
                src={zoomedImage} 
                alt="Zoomed" 
                onClick={(e) => e.stopPropagation()} 
                className="max-w-full max-h-full object-contain rounded-lg animate-in zoom-in-95 duration-200" 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}