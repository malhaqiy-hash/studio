"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Magnet, MapPin, Clock, ArrowRight, Package, Globe, Truck } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const MOCK_DEMANDS = [
  { id: "d1", title: "Eco-Friendly Bulk Shipping Boxes", description: "E-commerce distributors in Surabaya seeking FSC-certified suppliers.", category: "Packaging", location: "Surabaya", urgency: "High", volume: "10,000+ units/mo", timestamp: "2h ago" },
  { id: "d2", title: "AI Implementation for Logistic Fleets", description: "Transport companies looking for route optimization software.", category: "Tech & SaaS", location: "Global", urgency: "Medium", volume: "Enterprise License", timestamp: "5h ago" }
];

export default function ReverseDiscoveryPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState('all');

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-rose-600 font-black text-[8px] uppercase tracking-widest">
            <Magnet className="size-2.5 animate-pulse" />
            Reverse Intelligence
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-0.5">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{t('reverse_discovery')}</h1>
              <p className="text-slate-500 font-medium text-[11px] leading-snug">{t('reverse_discovery_desc')}</p>
            </div>
          </div>
        </header>

        <div className="space-y-4">
           <div className="grid grid-cols-2 gap-2">
              <Card className="rounded-2xl bg-slate-900 text-white p-4 space-y-3 overflow-hidden relative shadow-lg">
                 <div className="relative z-10 space-y-0.5">
                    <h4 className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Global Signals</h4>
                    <p className="text-xl font-black leading-none">124 Alerts</p>
                 </div>
                 <Button size="sm" className="relative z-10 w-full bg-white text-slate-900 font-black rounded-lg h-7 text-[8px] uppercase tracking-widest active:scale-95 shadow-lg">Set Alert</Button>
                 <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 rounded-full blur-2xl -mr-12 -mt-12" />
              </Card>
              <Card className="rounded-2xl border-slate-100 p-4 space-y-2.5 bg-white shadow-sm">
                <h4 className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Top Clusters</h4>
                <div className="flex gap-2 items-center">
                  <div className="size-7 rounded-lg bg-slate-50 flex items-center justify-center shadow-inner"><Globe className="size-3.5 text-slate-400" /></div>
                  <div className="min-w-0"><h5 className="text-[10px] font-black text-slate-900 truncate">Tokyo Cafe</h5><p className="text-[7px] font-bold text-slate-400 uppercase">12 Active</p></div>
                </div>
              </Card>
           </div>

           <div className="space-y-3">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-0 overflow-x-auto no-scrollbar">
                {['all', 'urgent', 'local'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`text-[9px] font-black uppercase tracking-[0.2em] pb-2 px-1 relative transition-colors ${activeTab === tab ? "text-accent" : "text-slate-400"}`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
                  </button>
                ))}
              </div>
              
              <div className="grid gap-3">
                {MOCK_DEMANDS.map((demand) => (
                  <Card key={demand.id} className="overflow-hidden border-slate-100 rounded-2xl bg-white group hover:shadow-md transition-all">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className={`h-1.5 md:h-auto md:w-1.5 shrink-0 ${demand.urgency === 'High' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                      <div className="p-4 flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-[14px] font-black text-slate-900 group-hover:text-accent transition-colors leading-tight truncate">{demand.title}</h3>
                            <Badge variant="secondary" className="text-[7px] font-black uppercase h-4 px-1.5 border-none shadow-none">{demand.category}</Badge>
                          </div>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest shrink-0 mt-1">{demand.timestamp}</span>
                        </div>
                        <p className="text-slate-500 font-medium text-[11px] leading-snug line-clamp-2">{demand.description}</p>
                        <div className="flex flex-wrap gap-4 pt-1 border-t border-slate-50">
                          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase"><MapPin className="size-2.5 text-rose-400" />{demand.location}</div>
                          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase"><Package className="size-2.5 text-amber-400" />{demand.volume}</div>
                        </div>
                        <Button size="sm" className="w-full rounded-lg bg-slate-900 text-white font-black h-8 px-4 flex gap-1.5 text-[9px] uppercase tracking-widest active:scale-95 transition-all">
                          {t('pitch_solution')}
                          <ArrowRight className="size-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}