"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Handshake, Activity, CheckCircle2, Zap, Target, ArrowRight, MessageSquare, CalendarDays, FileText } from "lucide-react";
import { strategicPartnerMatchmaker, type StrategicPartnerMatchmakerOutput } from "@/ai/flows/strategicPartnerMatchmaker";
import { useFirestore, useUser } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export default function MatchmakerPage() {
  const { t } = useLanguage();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<StrategicPartnerMatchmakerOutput | null>(null);

  const handleMatchmaking = async () => {
    if (!user || !db) return;
    setLoading(true);
    try {
      const output = await strategicPartnerMatchmaker({
        companyName: "Alpha Tech Solutions",
        industry: "SaaS & AI Infrastructure",
        location: "Jakarta, Indonesia",
        businessSize: "Enterprise",
        description: "Leading provider of enterprise AI solutions.",
        productsServicesOffered: ["AI Analytics"],
        targetMarket: "Industrial conglomerates",
        strategicGoals: ["Market expansion"],
        idealPartnerCriteria: "Distributors",
        opportunityRequirements: "Seeking partners.",
        userActivity: "Active",
        searchHistory: []
      });
      setResults(output);
    } catch (err) {
      toast({ variant: "destructive", title: "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto py-6">
        <header className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="relative z-10 space-y-2">
            <Badge className="bg-indigo-500 text-white border-none px-3 py-1 font-black text-[10px] uppercase">Core Intelligence</Badge>
            <h1 className="text-4xl font-black tracking-tight">{t('matchmaker')}</h1>
            <p className="text-slate-400 max-w-lg">{t('matchmaker_desc')}</p>
          </div>
          <Button onClick={handleMatchmaking} disabled={loading} className="bg-white text-slate-900 font-black rounded-2xl h-14 px-10 shadow-2xl flex gap-3 relative z-10">
            {loading ? <Activity className="size-5 animate-spin" /> : <Target className="size-5" />}
            {t('connect_now')}
          </Button>
        </header>

        {loading && (
          <Card className="border-none bg-indigo-50/50 rounded-[2.5rem]">
            <CardContent className="p-16 text-center space-y-8">
              <div className="relative size-32 mx-auto"><div className="absolute inset-0 border-8 border-accent rounded-full border-t-transparent animate-spin" /><div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner"><Zap className="size-8 text-accent fill-accent animate-pulse" /></div></div>
              <h3 className="text-2xl font-black text-slate-900">{t('sync_network')}</h3>
            </CardContent>
          </Card>
        )}

        {results && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {results.partners.map((partner, idx) => (
              <Card key={idx} className="overflow-hidden border-slate-100 shadow-xl rounded-[2.5rem] bg-white relative flex flex-col">
                <div className="absolute top-6 right-6 text-center"><div className="text-4xl font-black text-indigo-600 leading-none">{partner.compatibilityScore}%</div><div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('accuracy')}</div></div>
                <CardHeader className="p-8 pb-4"><div className="flex items-start gap-4"><div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300 text-2xl">{partner.partnerName[0]}</div><div className="space-y-1"><Badge className="bg-indigo-50 text-accent font-black text-[9px] uppercase">{partner.partnerType}</Badge><CardTitle className="text-2xl font-black text-slate-900">{partner.partnerName}</CardTitle></div></div></CardHeader>
                <CardContent className="p-8 pt-2 space-y-8 flex-1">
                  <div className="space-y-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><CheckCircle2 className="size-3 text-emerald-500" />{t('synergy_score')}</div><div className="grid gap-2">{partner.matchReasons.map((r, i) => <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl"><span className="size-1.5 rounded-full bg-accent" />{r}</div>)}</div></div>
                  <div className="space-y-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><Zap className="size-3 text-amber-500" />{t('next_steps')}</div><div className="flex flex-wrap gap-2">{partner.recommendedActions.map((a, i) => <Badge key={i} variant="outline" className="rounded-lg px-3 py-1.5 font-bold flex gap-2 items-center">{a}</Badge>)}</div></div>
                </CardContent>
                <div className="p-6 bg-slate-50 border-t"><Button className="w-full rounded-2xl h-12 bg-slate-900 text-white font-black uppercase tracking-widest gap-2">{t('start_dialogue')}<ArrowRight className="size-4" /></Button></div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
