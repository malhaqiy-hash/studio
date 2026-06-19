"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Package, 
  Headphones, 
  Truck, 
  Network, 
  Target, 
  Sparkles, 
  Filter, 
  History, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SEARCH_SCOPES = [
  { id: "products", label: "Product Search", icon: Package, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "services", label: "Service Search", icon: Headphones, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "suppliers", label: "Supplier Search", icon: Truck, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "distributors", label: "Distributor Search", icon: Network, color: "text-rose-500", bg: "bg-rose-50" },
  { id: "opportunities", label: "Opportunity Search", icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
];

const RECENT_SEARCHES = [
  "Biodegradable coffee cups bulk",
  "AI implementation partners EU",
  "Solar panel distributors Jakarta",
  "Logistics tech startups Series A"
];

export default function SearchHubPage() {
  const [activeTab, setActiveTab] = React.useState("products");
  const [query, setQuery] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [extractedData, setExtractedData] = React.useState<null | {
    industry: string;
    certification: string;
    market: string;
    location: string;
  }>(null);

  const activeScope = SEARCH_SCOPES.find(s => s.id === activeTab);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setExtractedData(null);

    // Simulate AI Intent Extraction
    setTimeout(() => {
      setIsAnalyzing(false);
      setExtractedData({
        industry: "Packaging",
        certification: "Halal",
        market: "Japan",
        location: "Indonesia"
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-accent/20">
              <Sparkles className="size-3 animate-pulse" />
              Intelligence Index
            </div>
            <h1 className="text-4xl font-headline font-black text-slate-900 tracking-tight leading-none">
              AI Search Hub
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">
              Query the global business network using natural language to find verified {activeScope?.label.toLowerCase().split(' ')[0]}s and more.
            </p>
          </header>

          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardContent className="p-8 space-y-8">
              {/* Premium Search Bar */}
              <div className="space-y-6">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="size-6 text-slate-400 group-focus-within:text-accent transition-colors" />
                  </div>
                  <Input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Looking for halal food packaging suppliers for export to Japan."
                    className="h-24 pl-16 pr-40 rounded-[2rem] border-slate-200 bg-slate-50/50 text-xl font-medium focus:bg-white focus:ring-accent/10 transition-all shadow-inner"
                  />
                  <Button 
                    type="submit"
                    disabled={isAnalyzing}
                    className="absolute right-4 top-4 bottom-4 rounded-2xl px-10 bg-accent hover:bg-indigo-600 text-white font-black text-lg shadow-lg active:scale-95 transition-all"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <Cpu className="size-5 animate-spin" />
                        Analyzing...
                      </div>
                    ) : "Search"}
                  </Button>
                </form>

                {/* Loading State: AI Analysis */}
                {isAnalyzing && (
                  <div className="p-8 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <Sparkles className="size-5 text-accent animate-pulse" />
                      <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">
                        AI is analyzing market intent and extraction...
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Skeleton className="h-10 w-full rounded-xl bg-indigo-100" />
                      <Skeleton className="h-10 w-full rounded-xl bg-indigo-100" />
                      <Skeleton className="h-10 w-full rounded-xl bg-indigo-100" />
                      <Skeleton className="h-10 w-full rounded-xl bg-indigo-100" />
                    </div>
                  </div>
                )}

                {/* AI Extracted Intent Chips */}
                {extractedData && !isAnalyzing && (
                  <div className="p-6 rounded-[2rem] bg-emerald-50/30 border border-emerald-100 space-y-3 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">
                      <CheckCircle2 className="size-3" />
                      Intent Parameters Extracted
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-white text-slate-700 border-slate-200 shadow-sm py-2 px-4 rounded-xl font-bold flex gap-2 items-center">
                        <span className="text-[10px] text-slate-400 uppercase">Industry:</span>
                        {extractedData.industry}
                      </Badge>
                      <Badge className="bg-white text-slate-700 border-slate-200 shadow-sm py-2 px-4 rounded-xl font-bold flex gap-2 items-center">
                        <span className="text-[10px] text-slate-400 uppercase">Certification:</span>
                        {extractedData.certification}
                      </Badge>
                      <Badge className="bg-white text-slate-700 border-slate-200 shadow-sm py-2 px-4 rounded-xl font-bold flex gap-2 items-center">
                        <span className="text-[10px] text-slate-400 uppercase">Market:</span>
                        {extractedData.market}
                      </Badge>
                      <Badge className="bg-white text-slate-700 border-slate-200 shadow-sm py-2 px-4 rounded-xl font-bold flex gap-2 items-center">
                        <span className="text-[10px] text-slate-400 uppercase">Location:</span>
                        {extractedData.location}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Scope Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-50 p-1.5 rounded-2xl h-auto flex flex-wrap gap-2 border border-slate-100">
                  {SEARCH_SCOPES.map((scope) => (
                    <TabsTrigger 
                      key={scope.id} 
                      value={scope.id}
                      className="flex-1 min-w-[140px] rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-md font-bold text-xs gap-2 transition-all"
                    >
                      <scope.icon className="size-4" />
                      {scope.label.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {SEARCH_SCOPES.map((scope) => (
                  <TabsContent key={scope.id} value={scope.id} className="mt-8 space-y-6 outline-none">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <scope.icon className={`size-5 ${scope.color}`} />
                        {scope.label}
                      </h3>
                      <Button 
                        variant="ghost" 
                        onClick={() => { setQuery(""); setExtractedData(null); }}
                        className="text-xs font-black uppercase text-slate-400 hover:text-accent tracking-widest"
                      >
                        Reset Hub
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      {/* Empty State / Initial Suggestions */}
                      {!extractedData && (
                        <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4">
                          <div className={`size-16 rounded-3xl ${scope.bg} flex items-center justify-center`}>
                            <scope.icon className={`size-8 ${scope.color}`} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900">Ready to Discover {scope.label.split(' ')[0]}s</h4>
                            <p className="text-sm text-slate-400 font-medium max-w-xs">
                              Type your requirements above to see real-time matches from the OnTapp network.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Results Placeholder when data is extracted */}
                      {extractedData && (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between group hover:border-accent transition-all">
                              <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                   <scope.icon className={`size-5 ${scope.color}`} />
                                </div>
                                <div>
                                  <h5 className="font-bold text-slate-900">Verified {scope.label.split(' ')[0]} {i}</h5>
                                  <p className="text-xs text-slate-500 font-medium">Matching intent: {extractedData.industry} / {extractedData.certification}</p>
                                </div>
                              </div>
                              <Button variant="ghost" className="rounded-xl font-bold text-accent group-hover:bg-indigo-50">
                                View Profile
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Featured Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-[2rem] border-slate-200 shadow-sm p-6 space-y-4">
              <div className="size-10 rounded-xl bg-indigo-50 text-accent flex items-center justify-center">
                <Zap className="size-5 fill-accent" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Proximity Intelligence</h4>
                <p className="text-sm text-slate-500 font-medium">Find partners within your region to optimize logistics and speed.</p>
              </div>
              <Button variant="outline" className="w-full rounded-xl font-bold text-xs">Explore Local Index</Button>
            </Card>
            <Card className="rounded-[2rem] border-slate-200 shadow-sm p-6 space-y-4">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Verification Engine</h4>
                <p className="text-sm text-slate-500 font-medium">Filter for businesses with active certifications and AI-vetted reputation scores.</p>
              </div>
              <Button variant="outline" className="w-full rounded-xl font-bold text-xs">Apply Verification Filter</Button>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <History className="size-4" />
                Recent Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {RECENT_SEARCHES.map((search, i) => (
                  <button 
                    key={i}
                    onClick={() => setQuery(search)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all group text-left"
                  >
                    <span className="text-sm font-bold text-slate-600 group-hover:text-accent truncate">{search}</span>
                    <ArrowRight className="size-4 text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <TrendingUp className="size-4" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100">
                  <Badge className="bg-indigo-500 text-white border-none mt-1">HOT</Badge>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-indigo-900 leading-tight">Demand for "Renewable Packaging" is up 42% this week.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Badge className="bg-slate-400 text-white border-none mt-1">NEW</Badge>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700 leading-tight">12 New verified suppliers joined in "Jakarta Area".</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-4">
              <div className="size-12 rounded-2xl bg-accent flex items-center justify-center">
                <Sparkles className="size-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">AI Power-Search</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Looking for something complex? Ask the AI Assistant to synthesize a custom list for you.
                </p>
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-12 shadow-lg">
                Ask AI Assistant
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl -mr-16 -mt-16" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
