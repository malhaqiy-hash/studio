"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, MapPin, Globe, Users, DollarSign, Maximize2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

const MOCK_LOCATIONS = [
  { city: "Jakarta", country: "Indonesia", count: 124, value: "$4.2M", lat: 10, lng: 10, intensity: 90 },
  { city: "Singapore", country: "Singapore", count: 86, value: "$12.8M", lat: 20, lng: 20, intensity: 75 }
];

export default function OpportunityMapPage() {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = React.useState(MOCK_LOCATIONS[0]);

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-rose-600 font-black text-[8px] uppercase tracking-widest">
            <MapIcon className="size-2.5 animate-pulse" />
            Geo-Intelligence
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-0.5">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{t('opportunity_map')}</h1>
              <p className="text-slate-500 font-medium text-[11px] leading-snug">{t('opportunity_map_desc')}</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-lg border-slate-100 font-black uppercase text-[8px] h-7 px-2.5 shadow-sm active:scale-95 transition-all">Switch</Button>
          </div>
        </header>

        <div className="space-y-3">
           <Card className="rounded-[2rem] border-slate-100 shadow-xl bg-slate-50 overflow-hidden relative flex items-center justify-center h-[280px]">
              <div className="absolute inset-0 opacity-10"><div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/600')] bg-cover grayscale" /></div>
              <div className="relative w-full h-full p-10">{MOCK_LOCATIONS.map((loc, i) => <button key={i} onClick={() => setSelectedRegion(loc)} className={cn("absolute rounded-full transition-all hover:scale-125 active:scale-95 group", selectedRegion.city === loc.city ? "ring-2 ring-white shadow-2xl z-20" : "opacity-60")} style={{ top: `${loc.lat}%`, left: `${loc.lng}%`, width: `${loc.intensity / 3}px`, height: `${loc.intensity / 3}px`, backgroundColor: `hsl(239, 84%, ${100 - loc.intensity/2}%)` }}><div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-0.5 rounded-lg text-[7px] font-black uppercase opacity-0 group-hover:opacity-100 whitespace-nowrap shadow-lg">{loc.city}</div></button>)}</div>
              <div className="absolute bottom-4 left-4 flex flex-col gap-1.5"><button className="size-8 rounded-lg bg-white shadow-md flex items-center justify-center active:scale-90 transition-all"><Maximize2 className="size-3.5 text-slate-400" /></button><button className="size-8 rounded-lg bg-white shadow-md flex items-center justify-center active:scale-90 transition-all"><Globe className="size-3.5 text-slate-400" /></button></div>
           </Card>

           <div className="grid gap-3">
              <Card className="rounded-2xl shadow-md bg-white p-4 space-y-4">
                 <div className="flex items-center gap-2.5">
                   <div className="size-10 rounded-xl bg-rose-50 flex items-center justify-center shadow-inner"><MapPin className="size-5 text-rose-500" /></div>
                   <div>
                     <h3 className="text-[15px] font-black text-slate-900 leading-none">{selectedRegion.city}</h3>
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{selectedRegion.country}</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-slate-50 space-y-0.5">
                      <Users className="size-3 text-indigo-500 mb-1" />
                      <p className="text-lg font-black text-slate-900 leading-none">{selectedRegion.count}</p>
                      <p className="text-[7px] font-black text-slate-400 uppercase leading-none">{t('leads_found')}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 space-y-0.5">
                      <DollarSign className="size-3 text-emerald-500 mb-1" />
                      <p className="text-lg font-black text-slate-900 leading-none">{selectedRegion.value}</p>
                      <p className="text-[7px] font-black text-slate-400 uppercase leading-none">{t('potential_vol')}</p>
                    </div>
                 </div>
                 <Button className="w-full bg-slate-900 text-white font-black rounded-xl h-10 shadow-lg active:scale-95 transition-all text-[10px] uppercase tracking-widest">Index This Region</Button>
              </Card>

              <Card className="rounded-2xl bg-slate-900 text-white p-4 relative overflow-hidden flex items-center justify-between gap-4">
                <div className="relative z-10 space-y-1 flex-1">
                   <h4 className="text-[13px] font-black leading-tight uppercase">Heatmap Layer</h4>
                   <p className="text-slate-400 text-[9px] font-medium leading-tight">Unlock advanced global trade visualization.</p>
                </div>
                <Button size="sm" variant="ghost" className="relative z-10 border border-white/20 text-white font-black text-[8px] uppercase tracking-widest h-8 px-3 rounded-lg active:scale-95">Unlock</Button>
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 rounded-full blur-2xl -mr-12 -mt-12" />
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}