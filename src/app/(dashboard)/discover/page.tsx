
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Sparkles, 
  Building2, 
  Package, 
  Headphones, 
  MapPin, 
  CheckCircle2, 
  Globe, 
  Filter, 
  UserPlus, 
  ExternalLink, 
  ShieldCheck,
  Zap,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { translateText } from "@/ai/flows/translate-flow";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DiscoverPage() {
  const { language } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  
  // Translation state for discovery results
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean, detected: string }>>({});

  // Advanced Filters State
  const [filters, setFilters] = React.useState({
    verifiedOnly: false,
    onTappOnly: false,
    externalOnly: false
  });

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setTranslations({}); // Reset translations on new search
    try {
      const output = await aiIntentSearch({ query, filters });
      setResults(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateResult = async (resId: string, content: string) => {
    const existing = translations[resId];
    if (existing?.text) {
      setTranslations(prev => ({
        ...prev,
        [resId]: { ...existing, show: !existing.show }
      }));
      return;
    }

    setTranslations(prev => ({
      ...prev,
      [resId]: { text: "", show: false, loading: true, detected: "" }
    }));

    try {
      const { translatedText, detectedLanguage } = await translateText({
        text: content,
        targetLanguage: language
      });
      setTranslations(prev => ({
        ...prev,
        [resId]: { text: translatedText, show: true, loading: false, detected: detectedLanguage }
      }));
    } catch (err) {
      console.error("Result translation failed", err);
      setTranslations(prev => ({
        ...prev,
        [resId]: { text: "", show: false, loading: false, detected: "" }
      }));
    }
  };

  const getSourceBadge = (source: string) => {
    switch(source) {
      case 'ontapp_verified': 
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex gap-1 items-center px-3 py-1 font-bold">
          <ShieldCheck className="size-3" /> Verified Member
        </Badge>;
      case 'ontapp_member': 
        return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 flex gap-1 items-center px-3 py-1 font-bold">
          <Zap className="size-3" /> OnTapp Member
        </Badge>;
      default: 
        return <Badge variant="outline" className="bg-slate-50 text-slate-500 flex gap-1 items-center px-3 py-1 font-bold">
          <Globe className="size-3" /> External Source
        </Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'business': return <Building2 className="size-5" />;
      case 'product': return <Package className="size-5" />;
      case 'service': return <Headphones className="size-5" />;
      default: return <Search className="size-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 py-6">
        {/* Header section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="size-3 animate-pulse" />
            Hybrid Discovery Engine
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black text-slate-900 tracking-tight leading-[1.1]">
            Explore the <span className="text-accent underline decoration-indigo-200 underline-offset-8">Global Business</span> Ecosystem.
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Discover verified OnTapp members and index-linked external businesses using natural language intelligence.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="size-6 text-slate-400 group-focus-within:text-accent transition-colors" />
            </div>
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'Coffee suppliers in South East Asia with eco-certifications'"
              className="h-20 pl-16 pr-40 rounded-[2rem] border-slate-200 bg-white shadow-2xl text-xl font-medium ring-accent/10 transition-all focus:border-accent"
            />
            <Button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 rounded-full px-10 bg-accent hover:bg-indigo-600 text-white font-black text-lg transition-all shadow-lg active:scale-95"
            >
              {loading ? "Scanning..." : "Search"}
            </Button>
          </form>

          {/* Filter Toggles */}
          <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-white/50 border border-white/20 rounded-2xl backdrop-blur-sm max-w-fit mx-auto shadow-sm">
             <div className="flex items-center space-x-2">
                <Checkbox 
                  id="verified" 
                  checked={filters.verifiedOnly} 
                  onCheckedChange={(checked) => setFilters(prev => ({...prev, verifiedOnly: !!checked}))}
                />
                <Label htmlFor="verified" className="text-sm font-bold text-slate-600 cursor-pointer">Verified Only</Label>
             </div>
             <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ontapp" 
                  checked={filters.onTappOnly} 
                  onCheckedChange={(checked) => setFilters(prev => ({...prev, onTappOnly: !!checked}))}
                />
                <Label htmlFor="ontapp" className="text-sm font-bold text-slate-600 cursor-pointer">OnTapp Members</Label>
             </div>
             <div className="flex items-center space-x-2">
                <Checkbox 
                  id="external" 
                  checked={filters.externalOnly} 
                  onCheckedChange={(checked) => setFilters(prev => ({...prev, externalOnly: !!checked}))}
                />
                <Label htmlFor="external" className="text-sm font-bold text-slate-600 cursor-pointer">External Sources</Label>
             </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {loading && (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse border-slate-100">
                  <CardContent className="p-8">
                    <div className="flex gap-6">
                      <Skeleton className="size-16 rounded-2xl" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-2">
                           <Skeleton className="h-6 w-20 rounded-full" />
                           <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {results && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Discovery Results</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500">{results.results.length}</Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="font-bold text-slate-400 hover:text-slate-600 gap-2">
                      Sort by: Match Score <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-bold">Match Score</DropdownMenuItem>
                    <DropdownMenuItem className="font-bold">Latest Activity</DropdownMenuItem>
                    <DropdownMenuItem className="font-bold">Verification</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid gap-6">
                {results.results.map((result, idx) => {
                  const resId = `res-${idx}`;
                  const trans = translations[resId];
                  return (
                    <Card key={idx} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white relative">
                      {result.matchScore >= 90 && (
                        <div className="absolute top-0 right-0 p-3">
                          <Badge className="bg-amber-500 text-white border-none font-black text-[10px] uppercase shadow-md flex gap-1">
                            <Zap className="size-3 fill-white" /> Top Match
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className={`w-2 shrink-0 ${result.source === 'external' ? 'bg-slate-200' : 'bg-accent'}`} />
                          <div className="p-8 flex-1 flex flex-col md:flex-row gap-8 items-start">
                            <div className={`size-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${result.source === 'external' ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-accent'}`}>
                              {getTypeIcon(result.type)}
                            </div>
                            
                            <div className="flex-1 space-y-4">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <h4 className="text-2xl font-black text-slate-900 leading-tight">{result.name}</h4>
                                    {getSourceBadge(result.source)}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleTranslateResult(resId, result.description)}
                                    className="h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent"
                                    disabled={trans?.loading}
                                  >
                                    {trans?.loading ? (
                                      <RefreshCw className="size-3 mr-1 animate-spin" />
                                    ) : (
                                      <Globe className="size-3 mr-1" />
                                    )}
                                    {trans?.show ? "Original" : "Translate"}
                                  </Button>
                                </div>
                                <div className="relative">
                                  <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-3xl">
                                    {trans?.show ? trans.text : result.description}
                                  </p>
                                  {trans?.show && (
                                    <div className="mt-2 text-[10px] font-black text-accent uppercase tracking-[0.1em] flex items-center gap-1.5 bg-indigo-50/50 w-fit px-3 py-1.5 rounded-lg">
                                      <Sparkles className="size-3" />
                                      Translated from {trans.detected?.toUpperCase() || "INTL"}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-6 pt-2">
                                {result.location && (
                                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <MapPin className="size-3.5" />
                                    {result.location}
                                  </div>
                                )}
                                {result.industry && (
                                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <Filter className="size-3.5" />
                                    {result.industry}
                                  </div>
                                )}
                              </div>

                              {/* Match Reasons */}
                              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 className="size-3 text-emerald-500" />
                                    AI Match Confidence
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                    {result.matchReasons.map((reason, rIdx) => (
                                      <span key={rIdx} className="text-xs font-bold text-slate-600 bg-white border px-2 py-1 rounded-md shadow-sm">
                                        • {reason}
                                      </span>
                                    ))}
                                 </div>
                              </div>
                            </div>

                            <div className="md:w-48 shrink-0 flex flex-col items-center justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                               <div className="text-center space-y-1">
                                  <div className="text-4xl font-black text-indigo-600 leading-none">{result.matchScore}%</div>
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</div>
                               </div>
                               
                               {result.source === 'external' ? (
                                 <Button variant="outline" className="w-full rounded-xl h-11 border-slate-200 hover:bg-indigo-50 hover:text-accent font-bold group/btn flex gap-2">
                                   <UserPlus className="size-4" />
                                   Invite to OnTapp
                                 </Button>
                               ) : (
                                 <Button className="w-full rounded-xl h-11 bg-accent hover:bg-indigo-600 text-white font-black shadow-lg shadow-indigo-100 flex gap-2">
                                   <ExternalLink className="size-4" />
                                   View Profile
                                 </Button>
                               )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {!loading && !results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
              <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-6 text-center group hover:shadow-xl transition-all">
                <div className="size-16 bg-indigo-50 text-accent rounded-3xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform">
                  <Zap className="size-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900">Priority Ranking</h4>
                  <p className="text-slate-500 font-medium">OnTapp members and verified businesses always appear first in discovery.</p>
                </div>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-6 text-center group hover:shadow-xl transition-all">
                <div className="size-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform">
                  <Globe className="size-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900">External Indexing</h4>
                  <p className="text-slate-500 font-medium">We scan the global web to bring you relevant leads outside our network.</p>
                </div>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-6 text-center group hover:shadow-xl transition-all">
                <div className="size-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform">
                  <ShieldCheck className="size-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900">AI Verification</h4>
                  <p className="text-slate-500 font-medium">Our engine analyzes reputations and certificates to ensure quality results.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
