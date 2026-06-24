"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, BarChart3, RefreshCw, PieChart } from "lucide-react";
import { getMarketRadar, type MarketRadarOutput } from "@/ai/flows/market-radar-flow";
import { useLanguage } from "@/context/language-context";

export default function MarketRadarPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<MarketRadarOutput | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await getMarketRadar('Global');
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { runAnalysis(); }, []);

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="flex items-end justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-accent px-0 py-0 text-[8px] font-black uppercase tracking-widest">
              <TrendingUp className="size-2.5 animate-pulse" />
              Intelligence Radar
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{t('market_radar')}</h1>
            <p className="text-slate-500 font-medium text-[11px] leading-snug">{t('market_radar_desc')}</p>
          </div>
          <Button size="sm" onClick={() => runAnalysis()} disabled={loading} className="rounded-xl h-8 px-3 bg-slate-900 text-white font-black shadow-lg flex gap-1.5 text-[9px] uppercase tracking-widest active:scale-95 transition-all">
            <RefreshCw className={cn("size-3", loading && "animate-spin")} />
            {loading ? "Analisis..." : "Refresh"}
          </Button>
        </header>

        {data && (
          <Card className="rounded-2xl bg-indigo-600 text-white shadow-xl relative overflow-hidden">
            <CardContent className="p-5 space-y-2 relative z-10">
              <div className="flex items-center gap-2">
                <PieChart className="size-3.5 text-white/70" />
                <h2 className="text-[9px] font-black uppercase tracking-widest text-indigo-100">{t('market_sentiment')}</h2>
              </div>
              <p className="text-lg font-black leading-tight italic">"{data.overallSentiment}"</p>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/30 rounded-full blur-3xl -mr-16 -mt-16" />
          </Card>
        )}

        <div className="grid gap-3">
          {loading ? [1, 2].map((i) => <div key={i} className="animate-pulse h-40 rounded-2xl bg-slate-100" />) : data?.trends.map((trend, idx) => (
            <Card key={idx} className="group rounded-2xl border-slate-100 shadow-sm bg-white hover:shadow-md transition-all flex flex-col">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="px-2 py-0.5 font-black text-[7px] uppercase bg-emerald-50 text-emerald-600 border-none shadow-none">{trend.signal}</Badge>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">{trend.growthScore}%</span>
                    <p className="text-[7px] font-black text-slate-400 uppercase leading-none">Growth</p>
                  </div>
                </div>
                <CardTitle className="text-[15px] font-black text-slate-900 leading-tight group-hover:text-accent transition-colors">{trend.industry}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 flex-1 space-y-3">
                <p className="text-slate-500 font-medium text-[11px] line-clamp-2 leading-relaxed">{trend.description}</p>
                <div className="space-y-1.5">
                  <p className="text-[8px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                    <Zap className="size-2.5 text-amber-500" />
                    {t('hot_products')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {trend.risingProducts.map((p, i) => <Badge key={i} variant="secondary" className="rounded-lg text-slate-700 font-bold text-[9px] px-2 py-0.5 bg-slate-100">{p}</Badge>)}
                  </div>
                </div>
                <Button size="sm" className="w-full rounded-lg bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white font-black flex gap-1.5 h-8 text-[8px] uppercase tracking-widest transition-all">
                  {t('generate_report')}
                  <BarChart3 className="size-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
import { cn } from "@/lib/utils";