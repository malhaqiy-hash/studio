'use client';

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Radar, 
  Zap, 
  BarChart3,
  RefreshCw,
  Lightbulb,
  Target,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { businessScout, type BusinessScoutOutput } from "@/ai/flows/business-scout-flow";
import { useLanguage } from "@/context/language-context";

export default function ScoutPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(false);
  const [reports, setReports] = React.useState<BusinessScoutOutput | null>(null);

  const runScout = async () => {
    setLoading(true);
    try {
      const result = await businessScout({
        context: "High frequency of searches for 'Sustainable Logistics in Southeast Asia'. 40% of B2B packaging deals are pending due to lack of certified recycled suppliers. Increased activity in Tokyo-Jakarta trade route for IoT hardware."
      });
      setReports(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto py-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl overflow-hidden relative">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-emerald-500 text-white border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">{t('scout_market_intel')}</Badge>
              <Badge variant="outline" className="text-white border-white/20 text-[10px] uppercase font-bold">V 1.0</Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-none flex items-center gap-3">
              {t('scout')}
            </h1>
            <p className="text-slate-400 max-w-lg font-medium">{t('scout_desc')}</p>
          </div>
          <div className="relative z-10">
            <Button 
              size="lg" 
              onClick={runScout}
              disabled={loading}
              className="bg-white hover:bg-slate-100 text-slate-900 font-black rounded-2xl h-14 px-10 shadow-2xl active:scale-95 transition-all flex gap-3"
            >
              {loading ? <RefreshCw className="size-5 animate-spin" /> : <Radar className="size-5" />}
              {loading ? t('scout_scanning') : t('scout_start')}
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        </header>

        {loading && (
          <Card className="border-none shadow-sm bg-indigo-50/50 rounded-[2.5rem]">
            <CardContent className="p-16 text-center space-y-8">
              <div className="relative size-32 mx-auto">
                 <div className="absolute inset-0 border-8 border-indigo-100 rounded-full" />
                 <div className="absolute inset-0 border-8 border-accent rounded-full border-t-transparent animate-spin" />
                 <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <Radar className="size-8 text-accent animate-pulse" />
                 </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">{t('scout_analyzing')}</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                  {t('scout_processing')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {reports && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {reports.reports.map((report, idx) => (
              <Card key={idx} className="overflow-hidden border-slate-100 shadow-xl rounded-[2.5rem] bg-white group hover:border-emerald-200 transition-all flex flex-col">
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Lightbulb className="size-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-600">{report.confidenceScore}%</div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('scout_confidence')}</div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black text-slate-900 leading-tight">
                    {report.marketGap}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-2 flex-1 space-y-6">
                   <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('scout_signal')}</span>
                      <p className="text-slate-600 font-medium leading-relaxed italic border-l-2 border-emerald-100 pl-4">
                        "{report.reasoning}"
                      </p>
                   </div>

                   <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('potential_vol')}</span>
                         <Badge className="bg-emerald-500 text-white font-black">{report.potentialValue}</Badge>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <Zap className="size-3 text-amber-500" />
                            {t('scout_pivot')}:
                         </div>
                         <p className="text-sm font-medium text-slate-500">{report.suggestedAction}</p>
                      </div>
                   </div>
                </CardContent>
                <div className="p-6 bg-emerald-50/30 border-t border-emerald-50">
                  <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-black font-black flex gap-2">
                    {t('scout_create_opp')}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!reports && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {[
              { icon: TrendingUp, title: t('market_radar'), desc: t('market_radar_desc') },
              { icon: Target, title: t('matchmaker'), desc: t('matchmaker_desc') },
              { icon: BarChart3, title: t('network_perf'), desc: t('dashboard_desc') }
            ].map((f, i) => (
              <Card key={i} className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="size-12 rounded-2xl bg-indigo-50 text-accent flex items-center justify-center">
                  <f.icon className="size-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
