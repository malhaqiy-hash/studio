'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { TappLogo } from '@/components/ui/tapp-logo';

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
      <div className="max-w-xl mx-auto space-y-6 py-2 px-1">
        <header className="space-y-3">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="pl-0 h-6 text-[10px] text-slate-400 hover:text-teal-600 font-black uppercase tracking-widest gap-1.5 active:scale-95 transition-all">
              <ChevronLeft className="size-3" />
              Kembali
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 bg-teal-50 text-teal-600 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest w-fit border border-teal-100">
              <Info className="size-2.5" />
              Informasi Sistem
            </div>
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Info Aplikasi</h1>
              <Badge className="bg-slate-900 text-white px-2 py-0.5 rounded-lg font-black text-[7px] uppercase tracking-widest border-none">
                V 2.4.0
              </Badge>
            </div>
            <p className="text-slate-500 font-medium text-[11px] leading-snug">Pelajari cara kerja kecerdasan buatan OnTapp.</p>
          </div>
        </header>

        <section className="space-y-4">
          <div className="bg-[#0047BB] text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10 space-y-3">
              <TappLogo className="size-12 rounded-2xl shadow-2xl" variant="white" />
              <h2 className="text-lg font-black tracking-tight leading-none">Tapp Intelligence</h2>
              <p className="text-blue-50 font-medium text-[11px] leading-relaxed opacity-90">
                Sistem AI yang mensintesis data jaringan global untuk memberikan rekomendasi yang akurat, aman, dan hemat biaya bagi setiap member.
              </p>
              <div className="flex gap-3 pt-1">
                 <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-widest text-blue-100">
                    <ShieldCheck className="size-3" /> Encrypted
                 </div>
                 <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-widest text-blue-100">
                    <Cpu className="size-3" /> Optimized
                 </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-16 -mt-16" />
          </div>

          <div className="grid gap-3">
            {APP_FEATURES.map((feature: AppFeature) => {
              const IconComp = ICON_MAP[feature.iconName];
              return (
                <Card key={feature.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="size-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <IconComp className="size-5" />
                      </div>
                      <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-slate-100 text-slate-300">
                        Inti
                      </Badge>
                    </div>
                    <CardTitle className="text-[14px] font-black text-slate-900 group-hover:text-teal-600 transition-colors">
                      {feature.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <p className="text-slate-500 font-medium text-[11px] leading-relaxed line-clamp-2">
                      {feature.description}
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-50 flex items-start gap-2">
                      <Zap className="size-3 text-amber-500 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Biaya/Kuota</p>
                        <p className="text-[9px] font-bold text-slate-700 leading-tight truncate">{feature.quotaInfo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <footer className="text-center py-8 space-y-3">
          <p className="text-slate-400 text-[10px] font-medium px-4">Butuh bantuan mengenai fungsionalitas sistem?</p>
          <Button 
            size="sm"
            className="rounded-xl bg-slate-900 hover:bg-black text-white px-6 h-10 font-black shadow-lg text-[10px] uppercase tracking-widest active:scale-95 transition-all"
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
          >
            Hubungi Asisten AI
          </Button>
        </footer>
      </div>
    </DashboardLayout>
  );
}
