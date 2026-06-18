
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Building2, Package, Headphones, MapPin, Target } from "lucide-react";
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoverPage() {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const output = await aiIntentSearch({ query });
      setResults(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'business': return <Building2 className="size-5 text-indigo-500" />;
      case 'product': return <Package className="size-5 text-emerald-500" />;
      case 'service': return <Headphones className="size-5 text-orange-500" />;
      default: return <Sparkles className="size-5 text-slate-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12 py-10">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="rounded-full px-4 py-1 bg-white border-accent/20 text-accent font-bold animate-bounce">
            AI-Powered Discovery
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-slate-900 tracking-tight">
            Find exactly what your <span className="text-accent underline decoration-indigo-200 underline-offset-8">business needs.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Describe your requirement in plain English. Our AI will scan the OnTapp network to find the best matches for your business.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Sparkles className="size-6 text-accent animate-pulse" />
          </div>
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'Eco-friendly packaging suppliers in Europe with bulk discounts'"
            className="h-16 pl-16 pr-32 rounded-3xl border-slate-200 bg-white shadow-xl text-lg font-medium ring-accent/20 transition-all focus:border-accent"
          />
          <Button 
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 rounded-2xl px-8 bg-accent hover:bg-accent/90 text-white font-bold transition-all shadow-lg active:scale-95"
          >
            {loading ? "Searching..." : "Explore"}
          </Button>
        </form>

        <div className="space-y-6">
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="size-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4">
                <h3 className="font-bold text-slate-700">Discovered Results ({results.results.length})</h3>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ranked by relevance</span>
              </div>
              {results.results.map((result, idx) => (
                <Card key={idx} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-stretch">
                    <div className="w-1 bg-accent/20 group-hover:bg-accent transition-colors" />
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 flex-1">
                      <div className="flex gap-4">
                        <div className="size-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                          {getIcon(result.type)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-black text-lg text-slate-900 leading-none">{result.name}</h4>
                            <Badge variant="outline" className="bg-slate-50 text-[10px] uppercase font-black tracking-tighter">
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                            {result.description}
                          </p>
                          <div className="flex flex-wrap gap-4 pt-2">
                            {result.industry && (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                <Target className="size-3" />
                                {result.industry}
                              </div>
                            )}
                            {result.location && (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                <MapPin className="size-3" />
                                {result.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <div className="text-center">
                          <span className="block text-2xl font-black text-indigo-600">{result.relevanceScore}%</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Match</span>
                        </div>
                        <Button variant="outline" className="rounded-xl font-bold border-slate-200 hover:bg-slate-50">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && !results && query === "" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
              <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center space-y-3 shadow-sm">
                <div className="size-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="size-6" />
                </div>
                <h4 className="font-bold">Natural Search</h4>
                <p className="text-sm text-slate-500 leading-relaxed">No more rigid keywords. Search the way you talk.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center space-y-3 shadow-sm">
                <div className="size-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="size-6" />
                </div>
                <h4 className="font-bold">Intent Ranking</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Our AI understands what you want, not just what you say.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center space-y-3 shadow-sm">
                <div className="size-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="size-6" />
                </div>
                <h4 className="font-bold">Smart Filters</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Industry, location, and type are auto-filtered for precision.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
