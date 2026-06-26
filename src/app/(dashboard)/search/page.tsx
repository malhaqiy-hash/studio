"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
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
  RefreshCw,
  ShieldCheck,
  MapPin,
  Globe,
  Building2,
  Camera,
  Navigation,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";

const SEARCH_SCOPES = [
  { id: "products", label: "Product Search", icon: Package, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "services", label: "Service Search", icon: Headphones, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "suppliers", label: "Supplier Search", icon: Truck, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "distributors", label: "Distributor Search", icon: Network, color: "text-rose-500", bg: "bg-rose-50" },
  { id: "opportunities", label: "Opportunity Search", icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
];

export default function SearchHubPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("products");
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const output = await aiIntentSearch({ 
        query: query, 
        filters: { category: activeTab } 
      });
      if (output) setResults(output);
    } catch (err) {
      toast({ variant: "destructive", title: "Search Error", description: "Could not connect to AI engine." });
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = (name: string, location?: string, lat?: number, lng?: number) => {
    let url = "";
    if (lat && lng) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else {
      const searchQuery = encodeURIComponent(`${name} ${location || ''}`);
      url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    }
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 py-4 px-2">
        <div className="space-y-8">
          {/* Search Header - No Banner */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="size-6 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="h-16 pl-16 pr-44 rounded-2xl border-slate-100 bg-white text-xl font-medium focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
            />
            
            <div className="absolute inset-y-2 right-2 flex items-center gap-2">
               <button 
                 onClick={() => setIsSourcePickerOpen(true)}
                 className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all active:scale-90"
               >
                  <Camera className="size-6" />
               </button>
               <Button 
                 onClick={() => handleSearch()}
                 disabled={loading}
                 className="h-12 rounded-xl px-8 bg-black hover:bg-slate-800 text-white font-black text-base shadow-lg active:scale-95 transition-all"
               >
                 {loading ? <RefreshCw className="size-5 animate-spin" /> : "Search"}
               </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-50 p-1 rounded-2xl h-auto flex flex-wrap gap-1 border border-slate-100">
              {SEARCH_SCOPES.map((scope) => (
                <TabsTrigger 
                  key={scope.id} 
                  value={scope.id}
                  className="flex-1 min-w-[120px] rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md font-bold text-[11px] uppercase tracking-widest gap-2 transition-all"
                >
                  <scope.icon className="size-3.5" />
                  {scope.label.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-8 space-y-6 outline-none">
              {loading ? (
                 <div className="space-y-4">
                   {[1, 2, 3].map(i => <div key={i} className="h-32 w-full bg-slate-50 animate-pulse rounded-3xl" />)}
                 </div>
              ) : results && results.results.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 px-2">
                     <Globe className="size-4 text-blue-500" />
                     <h2 className="text-sm font-black uppercase tracking-tight text-slate-900">Hasil Eksternal</h2>
                  </div>
                  <div className="grid gap-6">
                    {results.results.map((result, idx) => (
                      <Card key={idx} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white relative rounded-[2rem]">
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-white/90 backdrop-blur-md text-blue-600 font-black text-[8px] uppercase px-3 py-1 rounded-full shadow-lg border-none">
                            {result.matchScore}% Match
                          </Badge>
                        </div>

                        <div className="flex flex-col md:flex-row">
                          {result.imageUrl && (
                            <div className="md:w-64 h-48 md:h-auto relative overflow-hidden bg-slate-100">
                               <img src={result.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={result.name} />
                            </div>
                          )}
                          <CardContent className="p-8 flex-1 flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h4 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{result.name}</h4>
                                {result.isVerified && <ShieldCheck className="size-5 text-emerald-500" />}
                              </div>
                              <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">{result.description}</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-50">
                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <MapPin className="size-3.5 text-rose-500" />
                                  {result.location || 'Global'}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <Building2 className="size-3.5 text-blue-500" />
                                  {result.type}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => openInGoogleMaps(result.name, result.location, result.lat, result.lng)}
                                  size="sm" 
                                  variant="outline" 
                                  className="rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-widest gap-2"
                                >
                                  <Navigation className="size-3.5" />
                                  Maps
                                </Button>
                                <Button className="rounded-xl h-10 px-6 bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-lg">
                                  Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-6">
                  <div className="size-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto shadow-inner rotate-3">
                     <Target className="size-10 text-slate-200" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-black text-slate-900 uppercase">Discover Opportunities</h3>
                     <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">Search the global business network using AI-powered intent synthesis.</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-[320px] rounded-[2.5rem] border-none shadow-2xl p-8 bg-[#2d3035] text-white overflow-hidden outline-none animate-in zoom-in-95 duration-200 [&>button]:hidden">
          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tight text-center">Visual Search</h2>
            <div className="space-y-4">
              <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-5 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left">
                <Camera className="size-6 text-blue-400" />
                <span className="font-bold uppercase text-xs tracking-widest">Take Photo</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-5 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left">
                <ImageIcon className="size-6 text-emerald-400" />
                <span className="font-bold uppercase text-xs tracking-widest">Gallery</span>
              </button>
            </div>
            <button onClick={() => setIsSourcePickerOpen(false)} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cancel</button>
          </div>
          <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" />
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}