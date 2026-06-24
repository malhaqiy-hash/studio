'use client';

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Radar, 
  Zap, 
  RefreshCw,
  Lightbulb,
  ArrowRight,
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
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="flex flex-col gap-4 bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl overflow-hidden relative">
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Badge className="bg-emerald-500 text-white border-none px-2 py-0.5 font-black text-[7px] uppercase tracking-widest">{t('scout_market_intel')}</Badge>
            </div>
            <h1 className="text-xl font-black tracking-tight leading-none flex items-center gap-2">
              {t('scout')}
            </h1>
            <p className="text-slate-400 font-medium text-[11px] leading-snug">
              {t('scout_desc')}
            </p>
          </div>
          <div className="relative z-10">
            <Button 
              size="sm" 
              onClick={runScout}
              disabled={loading}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl h-10 px-4 shadow-lg active:scale-95 transition-all flex gap-2 text-[10px] uppercase tracking-widest"
            >
              {loading ? <RefreshCw className="size-3 animate-spin" /> : <Radar className="size-3.5" />}
              {loading ? t('scout_scanning') : t('scout_start')}
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        </header>

        {loading && (
          <div className="p-10 text-center space-y-4 bg-indigo-50/30 rounded-3xl border border-indigo-100 animate-pulse">
            <Radar className="size-8 text-accent mx-auto animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">{t('scout_analyzing')}</h3>
              <p className="text-[10px] text-slate-500 font-medium max-w-[200px] mx-auto">{t('scout_processing')}</p>
            </div>
          </div>
        )}

        {reports && !loading && (
          <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {reports.reports.map((report, idx) => (
              <Card key={idx} className="overflow-hidden border-slate-100 shadow-sm rounded-2xl bg-white transition-all flex flex-col">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                      <Lightbulb className="size-4" />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-600 leading-none">{report.confidenceScore}%</div>
                      <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{t('scout_confidence')}</div>
                    </div>
                  </div>
                  <CardTitle className="text-[15px] font-black text-slate-900 leading-tight">
                    {report.marketGap}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-4">
                   <p className="text-slate-600 font-medium leading-relaxed italic border-l-2 border-emerald-100 pl-3 text-[11px]">
                     "{report.reasoning}"
                   </p>
                   <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[8px] font-black uppercase text-slate-400">{t('potential_vol')}</span>
                         <Badge className="bg-emerald-500 text-white font-black text-[8px] h-4 px-1.5">{report.potentialValue}</Badge>
                      </div>
                      <div className="space-y-0.5">
                         <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-700 uppercase">
                            <Zap className="size-2.5 text-amber-500" />
                            {t('scout_pivot')}
                         </div>
                         <p className="text-[11px] font-medium text-slate-500 leading-tight">{report.suggestedAction}</p>
                      </div>
                   </div>
                   <Button variant="outline" className="w-full h-8 rounded-lg border-slate-100 hover:bg-slate-900 hover:text-white text-[9px] font-black uppercase tracking-widest gap-1.5 transition-all">
                      {t('scout_create_opp')}
                      <ArrowRight className="size-3" />
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