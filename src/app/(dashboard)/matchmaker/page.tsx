
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Info, TrendingUp, Handshake, ChevronRight, Activity } from "lucide-react";
import { strategicPartnerMatchmaker, type StrategicPartnerMatchmakerOutput } from "@/ai/flows/strategicPartnerMatchmaker";
import { Progress } from "@/components/ui/progress";

export default function MatchmakerPage() {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<StrategicPartnerMatchmakerOutput | null>(null);

  const handleMatchmaking = async () => {
    setLoading(true);
    try {
      // Mocked input for the demo based on the profile
      const output = await strategicPartnerMatchmaker({
        companyName: "Alpha Tech Solutions",
        industry: "SaaS & AI Infrastructure",
        description: "A leading provider of enterprise AI solutions and cloud infrastructure for the manufacturing sector.",
        productsServicesOffered: ["AI Analytics Dashboard", "Cloud Data Storage", "Predictive Maintenance APIs"],
        targetMarket: "Large-scale manufacturing and industrial conglomerates",
        strategicGoals: ["Market expansion into Europe", "Integration with IoT hardware providers"],
        idealPartnerCriteria: "Hardware manufacturers or industrial distributors in the EU market"
      });
      setResults(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto py-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-indigo-900 text-white p-10 rounded-3xl shadow-xl overflow-hidden relative">
          <div className="relative z-10 space-y-2">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-4 py-1 backdrop-blur-md mb-2">B2B Core Intelligence</Badge>
            <h1 className="text-4xl font-headline font-black tracking-tight">Strategic Matchmaker</h1>
            <p className="text-indigo-100 max-w-lg font-medium">Evaluate your business profile against the network to identify high-value strategic partnerships.</p>
          </div>
          <div className="relative z-10">
            <Button 
              size="lg" 
              onClick={handleMatchmaking}
              disabled={loading}
              className="bg-accent hover:bg-indigo-400 text-white font-bold rounded-2xl h-14 px-8 shadow-2xl active:scale-95 transition-all flex gap-2"
            >
              <Users className="size-5" />
              {loading ? "Analyzing Network..." : "Generate Matches"}
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-20 -mt-20" />
        </header>

        {loading && (
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-indigo-50/50">
              <CardContent className="p-12 text-center space-y-6">
                <div className="relative size-24 mx-auto">
                   <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
                   <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Scanning 45,000+ Business Profiles</h3>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto">Analyzing compatibility across goals, target markets, and industrial sectors...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {results && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.partners.map((partner, idx) => (
              <Card key={idx} className="flex flex-col overflow-hidden border-slate-200 shadow-sm hover:shadow-xl transition-all group border-t-4 border-t-accent">
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="size-12 rounded-xl bg-slate-50 border flex items-center justify-center font-bold text-slate-400 text-lg shadow-inner group-hover:bg-indigo-50 group-hover:text-accent transition-colors">
                      {partner.partnerName[0]}
                    </div>
                    <Badge className="bg-indigo-50 text-accent border-none font-bold px-3 py-1">
                      {partner.partnerType}
                    </Badge>
                  </div>
                  <CardTitle className="pt-4 text-xl font-black text-slate-900">{partner.partnerName}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 flex-1">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                      <span>Compatibility</span>
                      <span className="text-accent">{partner.compatibilityScore}%</span>
                    </div>
                    <Progress value={partner.compatibilityScore} className="h-2 bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      <Info className="size-3" />
                      <span>Match Reasoning</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-indigo-100 pl-4">
                      "{partner.reasoning}"
                    </p>
                  </div>
                </CardContent>
                <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                  <Button variant="ghost" className="w-full justify-between font-bold text-slate-600 group-hover:text-accent group-hover:bg-indigo-50 rounded-xl transition-all">
                    Initiate Discussion
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!results && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <Card className="border-slate-200 shadow-sm p-8 bg-white space-y-4">
              <div className="size-12 bg-indigo-50 text-accent rounded-2xl flex items-center justify-center">
                <TrendingUp className="size-6" />
              </div>
              <h3 className="text-xl font-bold">Calculate Synergy</h3>
              <p className="text-slate-500 font-medium">Our algorithm evaluates more than just industry. We look at strategic alignment, geographic reach, and product-market fit to calculate a precise synergy score.</p>
            </Card>
            <Card className="border-slate-200 shadow-sm p-8 bg-white space-y-4">
              <div className="size-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                <Handshake className="size-6" />
              </div>
              <h3 className="text-xl font-bold">Accelerate Partnerships</h3>
              <p className="text-slate-500 font-medium">Skip months of networking and cold calls. Connect instantly with businesses that are pre-vetted for strategic compatibility with your specific business goals.</p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
