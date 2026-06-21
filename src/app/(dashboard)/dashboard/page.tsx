"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Briefcase, 
  DollarSign,
  ShieldCheck,
  Globe,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { useAccount } from "@/context/account-context";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function UserDashboardPage() {
  const { t, language } = useLanguage();
  const { activeAccount, removePost } = useAccount();
  const [zoomData, setZoomData] = React.useState<{ images: string[], initial: number } | null>(null);

  const stats = [
    { label: t('active_opps'), val: "24", icon: Briefcase, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Reach", val: "1.2k", icon: Globe, color: "text-accent", bg: "bg-accent/10" },
    { label: "Pipeline", val: "$42.5k", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pulse", val: "Bullish", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-8 py-2 md:py-4">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-3 px-1">
          <div className="space-y-0.5">
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">{t('dashboard')}</h1>
            <p className="text-slate-500 font-medium text-xs md:text-lg">{t('dashboard_desc')}</p>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-2 py-1 rounded-lg font-black text-[8px] md:text-[10px] uppercase tracking-widest flex gap-1.5 w-fit">
            <ShieldCheck className="size-2.5 md:size-3" /> {t('verified_account')}
          </Badge>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="rounded-xl md:rounded-[2rem] border-slate-100 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-3 md:p-8 space-y-2 md:space-y-4">
                <div className={cn("size-8 md:size-12 rounded-lg md:rounded-2xl flex items-center justify-center", stat.bg, stat.color)}><stat.icon className="size-4 md:size-6" /></div>
                <div>
                  <p className="text-base md:text-3xl font-black text-slate-900 truncate">{stat.val}</p>
                  <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3 md:space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base md:text-2xl font-black text-slate-900 tracking-tight">Postingan</h2>
            <Badge variant="secondary" className="font-black text-[7px] md:text-[10px] uppercase">{activeAccount.items?.length || 0} Item</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {(activeAccount.items || []).map((item) => (
              <Card key={item.id} className="rounded-xl md:rounded-[2rem] border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                <div 
                  className="aspect-video relative overflow-hidden bg-slate-50 cursor-pointer" 
                  onClick={() => item.images && item.images.length > 0 && setZoomData({ images: item.images, initial: 0 })}
                >
                  {item.images?.[0] ? (
                    <img src={item.images[0]} className="w-full h-full object-cover" alt="Content" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="size-6 md:size-10" /></div>
                  )}
                  {item.images && item.images.length > 1 && <div className="absolute top-1 right-1 md:top-3 md:right-3 bg-black/50 text-white px-1.5 py-0.5 rounded-md text-[6px] md:text-[8px] font-black">{item.images.length} Foto</div>}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); removePost(item.id); }} className="rounded-lg h-7 md:h-10 px-2 md:px-4 font-black uppercase text-[7px] md:text-[10px] gap-1.5 pointer-events-auto shadow-lg"><Trash2 className="size-3 md:size-4" /> Hapus</Button>
                  </div>
                </div>
                <CardContent className="p-2 md:p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-black text-slate-900 text-[10px] md:text-lg line-clamp-1">{item.title}</h4>
                    <p className="text-[8px] md:text-xs text-slate-500 line-clamp-2 leading-tight">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!zoomData} onOpenChange={() => setZoomData(null)}>
        <DialogContent 
          className="max-w-[100vw] w-screen h-screen p-0 m-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden"
          onClick={() => setZoomData(null)}
        >
          {zoomData && (
            <div className="w-full h-full relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
               <div className="absolute inset-0 z-0" onClick={() => setZoomData(null)} />
               <div className="relative z-10 w-full max-w-4xl px-4 flex items-center justify-center">
                  <Swiper
                    modules={[Navigation]}
                    navigation={zoomData.images.length > 1}
                    initialSlide={zoomData.initial}
                    className="w-full h-full flex items-center justify-center"
                    slidesPerView={1}
                  >
                    {zoomData.images.map((src, idx) => (
                      <SwiperSlide key={idx} className="flex items-center justify-center">
                        <img 
                          src={src} 
                          alt="Zoomed" 
                          className="max-w-full max-h-[90vh] object-contain rounded-lg animate-in zoom-in-95 duration-200 shadow-none border-none" 
                          onClick={(e) => e.stopPropagation()}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
