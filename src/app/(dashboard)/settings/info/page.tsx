'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Radar, 
  Handshake, 
  TrendingUp, 
  Map, 
  Brain, 
  Zap, 
  ChevronLeft,
  Info,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { APP_FEATURES, AppFeature } from '@/config/app-features';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const ICON_MAP = {
  Search,
  Radar,
  Handshake,
  TrendingUp,
  Map,
  Brain,
  Zap
};

export default function AppInfoPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10 py-6 pb-20">
        <header className="space-y-4">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="pl-0 text-slate-500 hover:text-teal-600 font-bold gap-2">
              <ChevronLeft className="size-4" />
              Kembali ke Pengaturan
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-teal-100">
                <Info className="size-3" />
                Informasi Sistem
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Info Aplikasi Tapp</h1>
              <p className="text-slate-500 font-medium text-lg">Pelajari cara kerja kecerdasan buatan dalam mendukung bisnis Anda.</p>
            </div>
            <Badge className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest border-none shadow-lg">
              Versi 2.4.0-Stable
            </Badge>
          </div>
        </header>

        <section className="grid gap-6">
          <div className="bg-teal-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center rotate-6 shadow-inner">
                <Brain className="size-8 text-white fill-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Arsitektur Tapp Intelligence</h2>
              <p className="text-teal-50 font-medium leading-relaxed opacity-90">
                Tapp menggunakan model bahasa besar (LLM) tercanggih yang disesuaikan khusus untuk sektor B2B dan perdagangan global. Sistem kami mensintesis miliaran titik data untuk memberikan rekomendasi yang akurat, aman, dan hemat biaya bagi setiap member.
              </p>
              <div className="flex gap-4 pt-2">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-100">
                    <ShieldCheck className="size-3.5" /> Terenkripsi End-to-End
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-100">
                    <Cpu className="size-3.5" /> Optimasi Token Aktif
                 </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {APP_FEATURES.map((feature: AppFeature) => {
              const IconComp = ICON_MAP[feature.iconName];
              return (
                <Card key={feature.id} className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white">
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="size-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <IconComp className="size-7" />
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-400">
                        Fitur Inti
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">
                      {feature.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                      <Zap className="size-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transparansi Biaya/Kuota</p>
                        <p className="text-xs font-bold text-slate-700 leading-tight">{feature.quotaInfo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <footer className="text-center py-10 space-y-4">
          <p className="text-slate-400 text-sm font-medium">Butuh bantuan lebih lanjut mengenai fungsionalitas sistem?</p>
          <Button 
            className="rounded-2xl bg-slate-900 hover:bg-black text-white px-10 h-14 font-black shadow-xl"
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
          >
            Hubungi Asisten AI
          </Button>
        </footer>
      </div>
    </DashboardLayout>
  );
}
