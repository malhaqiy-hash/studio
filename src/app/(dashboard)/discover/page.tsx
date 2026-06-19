
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
  RefreshCw,
  Users,
  Truck,
  Briefcase,
  Layers
} from "lucide-react";
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { translateText } from "@/ai/flows/translate-flow";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ENTITY_CATEGORIES = [
  { id: 'products', label: 'Produk', icon: Package },
  { id: 'services', label: 'Layanan', icon: Headphones },
  { id: 'suppliers', label: 'Supplier', icon: Truck },
  { id: 'distributors', label: 'Distributor', icon: Layers },
  { id: 'freelancers', label: 'Freelancer', icon: Users },
  { id: 'communities', label: 'Komunitas', icon: Users },
  { id: 'transporters', label: 'Transporter', icon: Truck },
  { id: 'opportunities', label: 'Peluang Bisnis', icon: Briefcase },
  { id: 'partners', label: 'Mitra Bisnis', icon: Users },
];

const LOCATIONS = [
  "Global", "Jakarta", "Surabaya", "Medan", "Bandung", "Bali", "Singapore", "Malaysia", "Japan"
];

export default function DiscoverPage() {
  const { language } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  
  // Filters
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = React.useState("Global");
  
  // Translation state
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean, detected: string }>>({});

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query && !activeCategory) return;
    
    setLoading(true);
    setTranslations({});
    try {
      const output = await aiIntentSearch({ 
        query: query || (activeCategory ? `Discover ${activeCategory}` : ""), 
        filters: {
          category: activeCategory || undefined,
          location: selectedLocation === "Global" ? undefined : selectedLocation
        } 
      });
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
          <ShieldCheck className="size-3" /> Terverifikasi OnTapp
        </Badge>;
      case 'ontapp_member': 
        return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 flex gap-1 items-center px-3 py-1 font-bold">
          <Zap className="size-3" /> Anggota OnTapp
        </Badge>;
      default: 
        return <Badge variant="outline" className="bg-slate-50 text-slate-400 flex gap-1 items-center px-3 py-1 font-bold">
          <Globe className="size-3" /> Media Eksternal
        </Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'product': return <Package className="size-5" />;
      case 'service': return <Headphones className="size-5" />;
      case 'supplier': return <Truck className="size-5" />;
      case 'transporter': return <Truck className="size-5" />;
      case 'opportunity': return <Briefcase className="size-5" />;
      default: return <Building2 className="size-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 py-6">
        {/* Header section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-headline font-black text-slate-900 tracking-tight leading-[1.1]">
            Temukan
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Cari produk, layanan, atau mitra strategis di seluruh ekosistem OnTapp.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-8">
          <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="size-6 text-slate-400 group-focus-within:text-accent transition-colors" />
            </div>
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari apa saja... (cth: Supplier kopi organik)"
              className="h-20 pl-16 pr-40 rounded-[2.5rem] border-slate-200 bg-white shadow-2xl text-xl font-medium focus:ring-accent/10 transition-all focus:border-accent"
            />
            <Button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 rounded-full px-10 bg-accent hover:bg-indigo-600 text-white font-black text-lg transition-all shadow-lg active:scale-95"
            >
              {loading ? <RefreshCw className="size-5 animate-spin" /> : "Cari"}
            </Button>
          </form>

          {/* New Categories UI */}
          <div className="space-y-6">
             <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pilih Kategori</h3>
                   <div className="flex items-center gap-2">
                      <MapPin className="size-3 text-slate-400" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-accent">
                            Lokasi: {selectedLocation} <ChevronDown className="size-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          {LOCATIONS.map(loc => (
                            <DropdownMenuItem 
                              key={loc} 
                              onClick={() => setSelectedLocation(loc)}
                              className="font-bold text-xs"
                            >
                              {loc}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {ENTITY_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                      className={cn(
                        "px-6 py-3 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 shadow-sm",
                        activeCategory === cat.label 
                          ? "bg-slate-900 text-white border-slate-900 scale-105" 
                          : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <cat.icon className="size-3.5" />
                      {cat.label}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {loading && (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse border-slate-100 rounded-[2.5rem]">
                  <CardContent className="p-10">
                    <div className="flex gap-8">
                      <Skeleton className="size-20 rounded-3xl" />
                      <div className="flex-1 space-y-4">
                        <Skeleton className="h-10 w-1/3 rounded-xl" />
                        <Skeleton className="h-6 w-2/3 rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {results && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6 px-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-indigo-50 rounded-lg flex items-center justify-center text-accent">
                    <Search className="size-4" />
                  </div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">Hasil Penemuan</h3>
                  <Badge className="bg-slate-100 text-slate-500 font-bold px-3">{results.results.length}</Badge>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Prioritas Jaringan OnTapp Aktif</p>
              </div>

              <div className="grid gap-6">
                {results.results.map((result, idx) => {
                  const resId = `res-${idx}`;
                  const trans = translations[resId];
                  return (
                    <Card key={idx} className={cn(
                      "group overflow-hidden border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white relative rounded-[2.5rem]",
                      result.source !== 'external' ? "border-indigo-100" : "border-slate-100"
                    )}>
                      {result.matchScore >= 90 && (
                        <div className="absolute top-0 right-0 p-4">
                          <Badge className="bg-amber-500 text-white border-none font-black text-[10px] uppercase shadow-lg flex gap-1 animate-in zoom-in-50">
                            <Sparkles className="size-3 fill-white" /> Top Synergy
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className={cn(
                            "w-2 shrink-0 transition-colors",
                            result.source === 'ontapp_verified' ? 'bg-emerald-500' : 
                            result.source === 'ontapp_member' ? 'bg-accent' : 'bg-slate-200'
                          )} />
                          <div className="p-10 flex-1 flex flex-col md:flex-row gap-10 items-start">
                            <div className={cn(
                              "size-20 rounded-3xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-500",
                              result.source === 'external' ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-accent'
                            )}>
                              {getTypeIcon(result.type)}
                            </div>
                            
                            <div className="flex-1 space-y-5">
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-4">
                                  <h4 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-accent transition-colors">{result.name}</h4>
                                  {getSourceBadge(result.source)}
                                </div>
                                <div className="relative">
                                  <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-3xl">
                                    {trans?.show ? trans.text : result.description}
                                  </p>
                                  {trans?.show && (
                                    <div className="mt-3 text-[10px] font-black text-accent uppercase tracking-[0.15em] flex items-center gap-2 bg-indigo-50/50 w-fit px-4 py-2 rounded-xl">
                                      <Sparkles className="size-3.5" />
                                      Diterjemahkan dari {trans.detected?.toUpperCase()}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-8 pt-2">
                                {result.location && (
                                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <MapPin className="size-4 text-rose-400" />
                                    {result.location}
                                  </div>
                                )}
                                {result.industry && (
                                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <Filter className="size-4 text-indigo-400" />
                                    {result.industry}
                                  </div>
                                )}
                              </div>

                              {/* Match Reasons */}
                              <div className="bg-slate-50/50 p-6 rounded-3xl space-y-3 border border-slate-100/50">
                                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 className="size-3 text-emerald-500" />
                                    Analisis Kecocokan AI
                                 </div>
                                 <div className="flex flex-wrap gap-3">
                                    {result.matchReasons.map((reason, rIdx) => (
                                      <span key={rIdx} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                                        • {reason}
                                      </span>
                                    ))}
                                 </div>
                              </div>
                            </div>

                            <div className="md:w-56 shrink-0 flex flex-col items-center justify-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-10">
                               <div className="text-center space-y-1">
                                  <div className="text-5xl font-black text-indigo-600 leading-none">{result.matchScore}%</div>
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Synergy Score</div>
                               </div>
                               
                               <div className="w-full space-y-3">
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleTranslateResult(resId, result.description)}
                                    className="w-full h-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent gap-2 border border-transparent hover:border-indigo-100"
                                    disabled={trans?.loading}
                                  >
                                    {trans?.loading ? <RefreshCw className="size-3 animate-spin" /> : <Globe className="size-3" />}
                                    {trans?.show ? "Asli" : "Terjemahkan"}
                                  </Button>
                                  
                                  {result.source === 'external' ? (
                                    <Button variant="outline" className="w-full rounded-2xl h-14 border-slate-200 hover:bg-indigo-50 hover:text-accent font-black shadow-sm group/btn gap-3 transition-all">
                                      <UserPlus className="size-5" />
                                      Undang ke OnTapp
                                    </Button>
                                  ) : (
                                    <Button className="w-full rounded-2xl h-14 bg-accent hover:bg-indigo-600 text-white font-black shadow-xl shadow-indigo-100 gap-3 transition-all active:scale-95">
                                      <ExternalLink className="size-5" />
                                      Lihat Profil
                                    </Button>
                                  )}
                               </div>
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
              {[
                { title: "Prioritas Anggota", desc: "Anggota jaringan OnTapp selalu muncul pertama untuk menjamin kepercayaan.", icon: Zap, color: "text-accent", bg: "bg-indigo-50" },
                { title: "Indeks Eksternal", desc: "Kami memindai web global untuk menemukan peluang di luar jaringan utama.", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
                { title: "Verifikasi AI", desc: "Mesin kami menganalisis reputasi dan sertifikat untuk hasil berkualitas.", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-50" }
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm space-y-6 text-center group hover:shadow-xl hover:-translate-y-2 transition-all">
                  <div className={cn("size-20 rounded-[2rem] flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform", feature.bg, feature.color)}>
                    <feature.icon className="size-10" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{feature.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
