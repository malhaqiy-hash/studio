
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  ShieldCheck,
  Zap,
  Package,
  History,
  Trash2,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock saved history from "Cari" page
const MOCK_SAVED_DISCOVERIES = [
  {
    id: "h1",
    name: "Nusantara Eco-Pack",
    type: "supplier",
    industry: "Eco-Packaging",
    location: "Jakarta, ID",
    source: "ontapp_verified",
    matchScore: 98,
    date: "12 Okt 2024"
  },
  {
    id: "h2",
    name: "Global Halal Logistics",
    type: "service",
    industry: "Logistics",
    location: "Surabaya, ID",
    source: "ontapp_member",
    matchScore: 92,
    date: "10 Okt 2024"
  },
  {
    id: "h3",
    name: "BioSolutions Ltd",
    type: "business",
    industry: "Tech & Manufacturing",
    location: "Singapore, SG",
    source: "external",
    matchScore: 85,
    date: "08 Okt 2024"
  }
];

export default function DiscoveryHistoryPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 py-6">
        <header className="space-y-4">
          <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-indigo-100">
             <History className="size-3" />
             Arsip Penemuan AI
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Penemuan Anda</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">
            Hasil pencarian AI yang Anda simpan atau temukan sebelumnya dicadangkan di sini secara otomatis.
          </p>
        </header>

        {MOCK_SAVED_DISCOVERIES.length > 0 ? (
          <div className="grid gap-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ditemukan Bulan Ini</h3>
               <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50">
                 Bersihkan Riwayat
               </Button>
            </div>

            <div className="grid gap-4">
              {MOCK_SAVED_DISCOVERIES.map((item) => (
                <Card key={item.id} className="group rounded-[2rem] border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className={cn(
                        "w-1.5 shrink-0 transition-colors",
                        item.source === 'ontapp_verified' ? 'bg-emerald-500' : 
                        item.source === 'ontapp_member' ? 'bg-accent' : 'bg-slate-200'
                      )} />
                      <div className="p-8 flex-1 flex flex-col md:flex-row gap-8 items-center">
                        <div className={cn(
                          "size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform",
                          item.source === 'external' ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-accent'
                        )}>
                          {item.type === 'supplier' ? <Package size={24} /> : <Building2 size={24} />}
                        </div>
                        
                        <div className="flex-1 space-y-2 text-center md:text-left">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <h4 className="text-xl font-black text-slate-900 leading-none">{item.name}</h4>
                            {item.source === 'ontapp_verified' && <ShieldCheck className="size-4 text-emerald-500 fill-emerald-50" />}
                          </div>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1"><MapPin className="size-3" /> {item.location}</div>
                            <div className="size-1 bg-slate-200 rounded-full" />
                            <div>{item.industry}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                           <div className="text-center">
                              <div className="text-2xl font-black text-indigo-600 leading-none">{item.matchScore}%</div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Sinergi</p>
                           </div>
                           <div className="hidden sm:block text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</p>
                              <p className="text-[8px] font-bold text-slate-300 italic">Disimpan Otomatis</p>
                           </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                           <Button className="flex-1 md:flex-none rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase h-10 px-6">
                             Profil
                           </Button>
                           <Button variant="ghost" size="icon" className="size-10 rounded-xl border border-slate-100 text-slate-300 hover:text-rose-500">
                             <Trash2 size={16} />
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-24 text-center space-y-6 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <div className="size-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-xl">
                <Search className="size-10 text-slate-200" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Belum Ada Cadangan</h3>
                <p className="text-slate-400 max-w-xs mx-auto font-medium">
                  Mulai mencari mitra di halaman Cari AI untuk melihat riwayat penemuan Anda di sini.
                </p>
             </div>
             <Button className="rounded-2xl bg-accent px-10 h-14 font-black shadow-lg shadow-accent/20">
                Buka Pencarian AI
             </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
