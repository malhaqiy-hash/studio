"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, Zap, Target, ArrowRight } from "lucide-react";
import { strategicPartnerMatchmaker, type StrategicPartnerMatchmakerOutput } from "@/ai/flows/strategicPartnerMatchmaker";
import { useFirestore, useUser } from "@/firebase";
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
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col gap-4">
          <div className="relative z-10 space-y-1">
            <Badge className="bg-indigo-500 text-white border-none px-2 py-0.5 font-black text-[7px] uppercase tracking-widest">Core Intelligence</Badge>
            <h1 className="text-xl font-black tracking-tight">{t('matchmaker')}</h1>
            <p className="text-slate-400 font-medium text-[11px] leading-snug">{t('matchmaker_desc')}</p>
          </div>
          <Button onClick={handleMatchmaking} disabled={loading} className="w-full bg-white text-slate-900 font-black rounded-xl h-10 px-4 shadow-lg flex gap-2 relative z-10 text-[10px] uppercase tracking-widest active:scale-95 transition-all">
            {loading ? <Activity className="size-3.5 animate-spin" /> : <Target className="size-3.5" />}
            {t('connect_now')}
          </Button>
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        </header>

        {loading && (
          <div className="p-12 text-center space-y-4 bg-indigo-50/30 rounded-[2rem] border border-indigo-100">
            <div className="relative size-16 mx-auto">
              <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner"><Zap className="size-4 text-accent fill-accent animate-pulse" /></div>
            </div>
            <h3 className="text-sm font-black text-slate-900">{t('sync_network')}</h3>
          </div>
        )}

        {results && !loading && (
          <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {results.partners.map((partner, idx) => (
              <Card key={idx} className="overflow-hidden border-slate-100 shadow-sm rounded-2xl bg-white relative flex flex-col">
                <div className="absolute top-4 right-4 text-right">
                  <div className="text-xl font-black text-indigo-600 leading-none">{partner.compatibilityScore}%</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{t('accuracy')}</div>
                </div>
                <CardHeader className="p-4 pb-1">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-300 text-lg shadow-inner">{partner.partnerName[0]}</div>
                    <div className="space-y-0.5">
                      <Badge className="bg-indigo-50 text-accent font-black text-[7px] uppercase h-4 px-1.5">{partner.partnerType}</Badge>
                      <CardTitle className="text-[15px] font-black text-slate-900">{partner.partnerName}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400"><CheckCircle2 className="size-2.5 text-emerald-500" />{t('synergy_score')}</div>
                    <div className="grid gap-1.5">{partner.matchReasons.map((r, i) => <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 p-1.5 rounded-lg leading-tight"><span className="size-1 rounded-full bg-accent shrink-0" />{r}</div>)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400"><Zap className="size-2.5 text-amber-500" />{t('next_steps')}</div>
                    <div className="flex flex-wrap gap-1.5">{partner.recommendedActions.map((a, i) => <Badge key={i} variant="outline" className="rounded-lg px-2 py-0.5 font-bold text-[9px] flex gap-1 items-center">{a}</Badge>)}</div>
                  </div>
                  <Button size="sm" className="w-full rounded-lg h-8 bg-slate-900 text-white font-black uppercase tracking-widest text-[8px] gap-1.5">
                    {t('start_dialogue')}
                    <ArrowRight className="size-2.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}