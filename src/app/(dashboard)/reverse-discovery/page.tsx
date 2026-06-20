"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Magnet, MapPin, Clock, ArrowRight, Filter, Package, Globe, Truck } from "lucide-react";
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
      <div className="space-y-8 py-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase"><Magnet className="size-3 animate-pulse" />Reverse Intelligence</div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('reverse_discovery')}</h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">{t('reverse_discovery_desc')}</p>
          </div>
          <Button variant="outline" className="rounded-2xl font-bold h-12 px-6 flex gap-2"><Filter className="size-4" />{t('more')}</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-[2.5rem] bg-slate-900 text-white p-8 space-y-8 overflow-hidden relative shadow-2xl">
                 <div className="relative z-10 space-y-6"><div className="space-y-1"><h4 className="text-[10px] font-black uppercase text-slate-400">Global Signals</h4><p className="text-3xl font-black">124 New Alerts</p></div><Button className="w-full bg-white text-slate-900 font-black rounded-xl h-12 shadow-xl">Get Signal Alert</Button></div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
              </Card>
              <Card className="rounded-[2.5rem] border-slate-100 p-8 space-y-6 bg-white"><h4 className="text-sm font-black uppercase text-slate-400">Top Clusters</h4><div className="space-y-4">{[{ name: "Tokyo Cafe Co-ops", icon: Globe, count: 12 }, { name: "EU Bio-Logistics", icon: Truck, count: 8 }].map((c, i) => <div key={i} className="flex items-center gap-4 group"><div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors"><c.icon className="size-5" /></div><div><h5 className="text-sm font-bold text-slate-900">{c.name}</h5><p className="text-[10px] font-black text-slate-400 uppercase">{c.count} Active</p></div></div>)}</div></Card>
           </div>

           <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-4 border-b pb-2">{['all', 'urgent', 'local', 'global'].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[10px] font-black uppercase tracking-widest pb-4 px-2 relative ${activeTab === tab ? "text-accent" : "text-slate-400"}`}>{tab} Signals{activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full" />}</button>)}</div>
              <div className="grid gap-6">{MOCK_DEMANDS.map((demand) => (
                <Card key={demand.id} className="overflow-hidden border-slate-100 rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all">
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className={`w-2 shrink-0 ${demand.urgency === 'High' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                    <div className="p-8 flex-1 space-y-6">
                      <div className="flex items-center justify-between"><div className="flex items-center gap-3"><h3 className="text-2xl font-black text-slate-900 group-hover:text-accent transition-colors">{demand.title}</h3><Badge variant="outline" className="text-[10px] font-black uppercase">{demand.category}</Badge></div><div className="flex items-center gap-2 text-[10px] font-black text-slate-400"><Clock className="size-3" />{demand.timestamp}</div></div>
                      <p className="text-slate-500 font-medium text-base">{demand.description}</p>
                      <div className="flex flex-wrap gap-6"><div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase"><MapPin className="size-3.5 text-rose-400" />{demand.location}</div><div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase"><Package className="size-3.5 text-amber-400" />{demand.volume}</div></div>
                      <div className="pt-6 border-t flex flex-col sm:flex-row gap-4"><Button className="rounded-xl bg-slate-900 text-white font-black h-12 px-8 flex gap-2">{t('pitch_solution')}<ArrowRight className="size-4" /></Button></div>
                    </div>
                  </CardContent>
                </Card>
              ))}</div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
