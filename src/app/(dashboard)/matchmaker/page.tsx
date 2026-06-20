"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Handshake, 
  Activity, 
  CheckCircle2, 
  Zap, 
  Target,
  ArrowRight,
  MessageSquare,
  CalendarDays,
  FileText
} from "lucide-react";
import { strategicPartnerMatchmaker, type StrategicPartnerMatchmakerOutput } from "@/ai/flows/strategicPartnerMatchmaker";
import { useFirestore, useUser } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function MatchmakerPage() {
  const { db } = { db: useFirestore() };
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<StrategicPartnerMatchmakerOutput | null>(null);

  const checkDailyLimit = async (userId: string) => {
    if (!db) return true;
    const rateRef = doc(db, 'user_rate_limits', userId);
    const snap = await getDoc(rateRef);
    const today = new Date().toISOString().split('T')[0];
    
    if (snap.exists()) {
      const data = snap.data();
      if (data.lastResetDate === today && (data.dailyCount || 0) >= 30) {
        toast({ variant: "destructive", title: "Limit AI Tercapai", description: "Batas 30 akses harian sudah habis." });
        return false;
      }
      await setDoc(rateRef, { dailyCount: (data.dailyCount || 0) + 1, lastResetDate: today }, { merge: true });
    } else {
      await setDoc(rateRef, { dailyCount: 1, lastResetDate: today });
    }
    return true;
  };

  const handleMatchmaking = async () => {
    if (!user || !db) return;
    
    setLoading(true);
    try {
      // 1. Check Daily Global Limit
      const canProceed = await checkDailyLimit(user.uid);
      if (!canProceed) {
        setLoading(false);
        return;
      }

      // 2. Check Matchmaking Cache (24h per User)
      const cacheRef = doc(db, 'search_cache', `match_cache_${user.uid}`);
      const cacheSnap = await getDoc(cacheRef);
      if (cacheSnap.exists()) {
        const cacheData = cacheSnap.data();
        const cacheTime = new Date(cacheData.timestamp).getTime();
        if (Date.now() - cacheTime < 86400000) { // 24h
           setResults(JSON.parse(cacheData.results));
           toast({ title: "Cache Pintar Aktif", description: "Menampilkan analisis profil 24 jam terakhir Anda." });
           setLoading(false);
           return;
        }
      }

      // 3. AI Execution
      const output = await strategicPartnerMatchmaker({
        companyName: "Alpha Tech Solutions",
        industry: "SaaS & AI Infrastructure",
        location: "Jakarta, Indonesia",
        businessSize: "Enterprise",
        description: "Leading provider of enterprise AI solutions and cloud infrastructure.",
        productsServicesOffered: ["AI Analytics", "Cloud Storage"],
        targetMarket: "Industrial conglomerates",
        strategicGoals: ["Market expansion Europe"],
        idealPartnerCriteria: "Industrial distributors EU",
        opportunityRequirements: "Seeking European distributors.",
        userActivity: "Recently searched for German IoT hardware",
        searchHistory: ["IoT sensors Europe"]
      });

      // 4. Save to Cache
      await setDoc(cacheRef, {
        results: JSON.stringify(output),
        timestamp: new Date().toISOString()
      });

      setResults(output);
    } catch (err) {
      toast({ variant: "destructive", title: "Analisis Gagal", description: "Terjadi gangguan pada mesin AI." });
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('meeting')) return <CalendarDays className="size-3" />;
    if (lower.includes('proposal')) return <FileText className="size-3" />;
    return <MessageSquare className="size-3" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto py-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <Badge className="bg-indigo-500 text-white border-none px-3 py-1 font-black text-[10px] uppercase">Core Intelligence</Badge>
            <h1 className="text-4xl font-black tracking-tight">AI Matchmaker</h1>
            <p className="text-slate-400 max-w-lg">Analisis profil bisnis otomatis sekali setiap 24 jam.</p>
          </div>
          <Button onClick={handleMatchmaking} disabled={loading} className="bg-white hover:bg-slate-100 text-slate-900 font-black rounded-2xl h-14 px-10 shadow-2xl flex gap-3 relative z-10">
            {loading ? <Activity className="size-5 animate-spin" /> : <Target className="size-5" />}
            Identify Matches
          </Button>
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/30 rounded-full blur-[100px] -mr-40 -mt-40" />
        </header>

        {loading && (
          <Card className="border-none shadow-sm bg-indigo-50/50 rounded-[2.5rem]">
            <CardContent className="p-16 text-center space-y-8">
              <div className="relative size-32 mx-auto"><div className="absolute inset-0 border-8 border-indigo-100 rounded-full" /><div className="absolute inset-0 border-8 border-accent rounded-full border-t-transparent animate-spin" /><div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner"><Zap className="size-8 text-accent fill-accent animate-pulse" /></div></div>
              <h3 className="text-2xl font-black text-slate-900">Synchronizing Global Network</h3>
            </CardContent>
          </Card>
        )}

        {results && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {results.partners.map((partner, idx) => (
              <Card key={idx} className="flex flex-col overflow-hidden border-slate-100 shadow-xl rounded-[2.5rem] bg-white relative group">
                <div className="absolute top-6 right-6 text-center"><div className="text-4xl font-black text-indigo-600 leading-none">{partner.compatibilityScore}%</div><div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Synergy</div></div>
                <CardHeader className="p-8 pb-4"><div className="flex items-start gap-4"><div className="size-14 rounded-2xl bg-slate-50 border flex items-center justify-center font-black text-slate-300 text-2xl">{partner.partnerName[0]}</div><div className="space-y-1"><Badge className="bg-indigo-50 text-accent border-none font-black text-[9px] uppercase">{partner.partnerType}</Badge><CardTitle className="text-2xl font-black text-slate-900">{partner.partnerName}</CardTitle></div></div></CardHeader>
                <CardContent className="p-8 pt-2 space-y-8 flex-1">
                  <div className="space-y-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><CheckCircle2 className="size-3 text-emerald-500" />Why it matches</div><div className="grid gap-2">{partner.matchReasons.map((reason, rIdx) => (<div key={rIdx} className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50"><span className="size-1.5 rounded-full bg-accent" />{reason}</div>))}</div></div>
                  <div className="space-y-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><Zap className="size-3 text-amber-500" />Next Steps</div><div className="flex flex-wrap gap-2">{partner.recommendedActions.map((action, aIdx) => (<Badge key={aIdx} variant="outline" className="rounded-lg border-indigo-100 bg-indigo-50/50 text-indigo-700 font-bold px-3 py-1.5 flex gap-2 items-center">{getActionIcon(action)}{action}</Badge>))}</div></div>
                </CardContent>
                <div className="p-6 bg-slate-50 border-t flex gap-3"><Button className="flex-1 rounded-2xl h-12 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest gap-2">Start Dialogue<ArrowRight className="size-4" /></Button></div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
