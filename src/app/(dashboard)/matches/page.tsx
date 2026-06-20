"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Handshake, Truck, Briefcase, MapPin, Search, Zap, CheckCircle2, Info, CalendarDays, FileText, MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const MATCH_DATA = {
  businesses: [
    { name: "Apex Solutions", type: "Distributor ↔ Manufacturer", category: "Tech", location: "Singapore", matchScore: 98, verified: true, reasons: ["Compatible production capacity", "Shared export market"], actions: ["Schedule Sync Meeting"] },
    { name: "Global Partners LLC", type: "Buyer ↔ Supplier", category: "Retail", location: "London", matchScore: 92, verified: true, reasons: ["Verified supply chain", "ISO 9001 certified"], actions: ["Request Quotation"] }
  ],
  suppliers: [
    { name: "EcoLogistics", type: "Buyer ↔ Supplier", category: "Logistics", location: "Jakarta", matchScore: 95, verified: true, reasons: ["Green energy fleet", "Regional leadership"], actions: ["Schedule Site Visit"] }
  ],
  opportunities: [
    { name: "EU Market Expansion", type: "Startup ↔ Investor", category: "Strategy", location: "Brussels", matchScore: 94, verified: true, reasons: ["Matched investment stage"], actions: ["Submit Pitch Deck"] }
  ]
};

export default function MatchesPage() {
  const { t } = useLanguage();

  const getActionIcon = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('meeting')) return <CalendarDays className="size-3" />;
    if (lower.includes('proposal') || lower.includes('deck')) return <FileText className="size-3" />;
    return <MessageSquare className="size-3" />;
  };

  const renderCard = (item: any) => (
    <Card key={item.name} className="group border-slate-100 shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden">
      <div className="absolute top-6 right-6 text-right">
        <div className="text-3xl font-black text-indigo-600 leading-none">{item.matchScore}%</div>
        <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('accuracy')}</div>
      </div>
      <CardHeader className="p-8 pb-4">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300 text-2xl">{item.name[0]}</div>
          <div className="space-y-1">
            <h3 className="font-black text-slate-900 text-xl group-hover:text-accent transition-colors">{item.name}</h3>
            <Badge className="bg-indigo-50 text-accent font-black text-[9px] uppercase">{item.type}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-2 space-y-6">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><CheckCircle2 className="size-3 text-emerald-500" />{t('synergy_score')}</div>
        <div className="grid gap-1.5">{item.reasons.map((r: string, idx: number) => <div key={idx} className="text-[11px] font-bold text-slate-600 flex items-center gap-2 bg-slate-50 p-2 rounded-xl"><span className="size-1 rounded-full bg-accent" />{r}</div>)}</div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><Zap className="size-3 text-amber-500" />{t('recommendations')}</div>
          <div className="flex flex-wrap gap-2">{item.actions.map((a: string, idx: number) => <Badge key={idx} variant="outline" className="rounded-lg text-[10px] flex gap-1.5 items-center">{getActionIcon(a)}{a}</Badge>)}</div>
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-slate-50 border-t"><Button className="w-full rounded-2xl h-12 bg-slate-900 text-white font-black text-[10px] uppercase">{t('connect_now')}</Button></CardFooter>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-10 py-6 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase"><Zap className="size-3 fill-accent" />Intelligence Hub</div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{t('matches')}</h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">{t('market_radar_desc')}</p>
          </div>
        </header>

        <Tabs defaultValue="businesses" className="space-y-8">
          <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start border-b w-full">
            {['businesses', 'suppliers', 'opportunities'].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="bg-transparent border-none p-0 pb-4 h-auto data-[state=active]:text-accent font-black uppercase text-[10px]">
                {tab === 'businesses' && <Handshake className="size-3.5 mr-2" />}
                {tab === 'suppliers' && <Truck className="size-3.5 mr-2" />}
                {tab === 'opportunities' && <Briefcase className="size-3.5 mr-2" />}
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="businesses" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{MATCH_DATA.businesses.map(renderCard)}</TabsContent>
          <TabsContent value="suppliers" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{MATCH_DATA.suppliers.map(renderCard)}</TabsContent>
          <TabsContent value="opportunities" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{MATCH_DATA.opportunities.map(renderCard)}</TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
