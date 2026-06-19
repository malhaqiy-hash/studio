"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Info, 
  TrendingUp, 
  Handshake, 
  ChevronRight, 
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function MatchmakerPage() {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<StrategicPartnerMatchmakerOutput | null>(null);

  const handleMatchmaking = async () => {
    setLoading(true);
    try {
      const output = await strategicPartnerMatchmaker({
        companyName: "Alpha Tech Solutions",
        industry: "SaaS & AI Infrastructure",
        location: "Jakarta, Indonesia",
        businessSize: "Enterprise",
        productCategories: ["Analytics Tools", "Cloud Servers"],
        serviceCategories: ["AI Implementation", "Consulting"],
        description: "Leading provider of enterprise AI solutions and cloud infrastructure for the manufacturing sector.",
        productsServicesOffered: ["AI Analytics Dashboard", "Cloud Data Storage", "Predictive Maintenance APIs"],
        targetMarket: "Large-scale manufacturing and industrial conglomerates",
        strategicGoals: ["Market expansion into Europe", "Integration with IoT hardware providers"],
        idealPartnerCriteria: "Hardware manufacturers or industrial distributors in the EU market",
        opportunityRequirements: "Seeking European distributors with existing industrial networks.",
        userActivity: "Recently searched for German IoT hardware suppliers",
        searchHistory: ["IoT sensors Europe", "Industrial automation Germany"]
      });
      setResults(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('meeting') || lower.includes('schedule')) return <CalendarDays className="size-3" />;
    if (lower.includes('proposal') || lower.includes('quotation')) return <FileText className="size-3" />;
    return <MessageSquare className="size-3" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto py-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl overflow-hidden relative">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-indigo-500 text-white border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">Core Intelligence</Badge>
              <Badge variant="outline" className="text-white border-white/20 text-[10px] uppercase font-bold">V 2.0</Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-none">AI Matchmaker</h1>
            <p className="text-slate-400 max-w-lg font-medium">Cross-referencing industry profile, activity, and search history to find your next strategic synergy.</p>
          </div>
          <div className="relative z-10">
            <Button 
              size="lg" 
              onClick={handleMatchmaking}
              disabled={loading}
              className="bg-white hover:bg-slate-100 text-slate-900 font-black rounded-2xl h-14 px-10 shadow-2xl active:scale-95 transition-all flex gap-3"
            >
              {loading ? (
                <Activity className="size-5 animate-spin" />
              ) : (
                <Target className="size-5" />
              )}
              {loading ? "Analyzing Network..." : "Identify Matches"}
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/30 rounded-full blur-[100px] -mr-40 -mt-40" />
        </header>

        {loading && (
          <div className="grid gap-6">
             <Card className="border-none shadow-sm bg-indigo-50/50 rounded-[2.5rem]">
              <CardContent className="p-16 text-center space-y-8">
                <div className="relative size-32 mx-auto">
                   <div className="absolute inset-0 border-8 border-indigo-100 rounded-full" />
                   <div className="absolute inset-0 border-8 border-accent rounded-full border-t-transparent animate-spin" />
                   <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                      <Zap className="size-8 text-accent fill-accent animate-pulse" />
                   </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900">Synchronizing Global Database</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto italic">
                    Matching your recent activity, industry profile, and growth goals against 45,000+ active business entities...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {results && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {results.partners.map((partner, idx) => (
              <Card key={idx} className="flex flex-col overflow-hidden border-slate-100 shadow-xl rounded-[2.5rem] group hover:border-accent/30 transition-all bg-white relative">
                <div className="absolute top-0 right-0 p-6">
                   <div className="text-center">
                      <div className="text-4xl font-black text-indigo-600 leading-none">{partner.compatibilityScore}%</div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Synergy</div>
                   </div>
                </div>

                <CardHeader className="p-8 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="size-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-300 text-2xl shadow-inner group-hover:bg-indigo-50 group-hover:text-accent transition-colors">
                      {partner.partnerName[0]}
                    </div>
                    <div className="space-y-1">
                      <Badge className="bg-indigo-50 text-accent border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                        {partner.partnerType}
                      </Badge>
                      <CardTitle className="text-2xl font-black text-slate-900">{partner.partnerName}</CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-2 space-y-8 flex-1">
                  {/* Match Reasons */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <CheckCircle2 className="size-3 text-emerald-500" />
                      Why it matches
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                       {partner.matchReasons.map((reason, rIdx) => (
                         <div key={rIdx} className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                           <span className="size-1.5 rounded-full bg-accent" />
                           {reason}
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Zap className="size-3 text-amber-500" />
                      Recommended Next Actions
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {partner.recommendedActions.map((action, aIdx) => (
                         <Badge key={aIdx} variant="outline" className="rounded-lg border-indigo-100 bg-indigo-50/50 text-indigo-700 font-bold px-3 py-1.5 flex gap-2 items-center">
                            {getActionIcon(action)}
                            {action}
                         </Badge>
                       ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                      "{partner.reasoning}"
                    </p>
                  </div>
                </CardContent>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <Button className="flex-1 rounded-2xl h-12 bg-slate-900 hover:bg-black font-black text-xs uppercase tracking-widest gap-2 shadow-lg">
                    Start Dialogue
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="size-12 rounded-2xl border-slate-200">
                    <Info className="size-4 text-slate-400" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!results && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <Card className="border-slate-100 shadow-xl p-10 rounded-[2.5rem] bg-white space-y-6 group hover:shadow-2xl transition-all">
              <div className="size-14 bg-indigo-50 text-accent rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <TrendingUp className="size-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Intelligent Synergy</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Our 2.0 algorithm evaluates search history, industry alignment, and real-time activity to identify non-obvious high-value partners.</p>
              </div>
            </Card>
            <Card className="border-slate-100 shadow-xl p-10 rounded-[2.5rem] bg-white space-y-6 group hover:shadow-2xl transition-all">
              <div className="size-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Handshake className="size-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Contextual Matches</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Stop generic networking. Connect with businesses that are pre-qualified for the specific relationship types you need right now.</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
