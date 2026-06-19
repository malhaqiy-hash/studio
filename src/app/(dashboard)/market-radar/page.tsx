
'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Activity, 
  ArrowUpRight, 
  RefreshCw, 
  ShieldCheck,
  Globe,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { getMarketRadar, type MarketRadarOutput } from '@/ai/flows/market-radar-flow';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function MarketRadarPage() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<MarketRadarOutput | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await getMarketRadar();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 py-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-indigo-100">
              <TrendingUp className="size-3 animate-pulse" />
              Intelligence Radar
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Market Radar</h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">
              AI-driven trend detection analyzing real-time B2B supply/demand signals across the global network.
            </p>
          </div>
          <Button 
            onClick={runAnalysis} 
            disabled={loading}
            className="rounded-2xl h-14 px-8 bg-slate-900 hover:bg-black text-white font-black shadow-xl flex gap-3 transition-all active:scale-95"
          >
            {loading ? <RefreshCw className="size-5 animate-spin" /> : <Activity className="size-5" />}
            {loading ? "Analyzing..." : "Refresh Signals"}
          </Button>
        </header>

        {data && (
          <Card className="rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl overflow-hidden relative">
            <CardContent className="p-10 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <PieChart className="size-6 text-white" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest text-indigo-100">Market Sentiment</h2>
              </div>
              <p className="text-3xl font-black leading-tight max-w-3xl">
                "{data.overallSentiment}"
              </p>
            </CardContent>
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-[100px] -mr-48 -mt-48" />
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse h-80 rounded-[2.5rem] border-slate-100 bg-slate-50" />
            ))
          ) : data?.trends.map((trend, idx) => (
            <Card key={idx} className="group rounded-[2.5rem] border-slate-100 shadow-xl bg-white hover:shadow-2xl transition-all flex flex-col">
              <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <Badge className={cn(
                    "px-3 py-1 font-black text-[10px] uppercase border-none",
                    trend.signal === 'Rising Demand' ? "bg-emerald-50 text-emerald-600" :
                    trend.signal === 'Emerging Tech' ? "bg-indigo-50 text-accent" : "bg-orange-50 text-orange-600"
                  )}>
                    {trend.signal}
                  </Badge>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">{trend.growthScore}%</span>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Growth Score</p>
                  </div>
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 leading-tight group-hover:text-accent transition-colors">
                  {trend.industry}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-2 flex-1 space-y-6">
                <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-3">
                  {trend.description}
                </p>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="size-3 text-amber-500" />
                    Hot Products
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trend.risingProducts.map((p, i) => (
                      <Badge key={i} variant="outline" className="rounded-lg border-slate-200 bg-slate-50 text-slate-700 font-bold">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Pivot</p>
                  <ul className="space-y-2">
                    {trend.suggestedPivots.slice(0, 2).map((pivot, i) => (
                      <li key={i} className="text-xs font-bold text-slate-600 flex items-start gap-2">
                        <ArrowUpRight className="size-3 text-indigo-400 shrink-0 mt-0.5" />
                        {pivot}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <Button className="w-full rounded-xl bg-slate-900 hover:bg-black font-black flex gap-2 h-12">
                  Generate Report
                  <BarChart3 className="size-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
