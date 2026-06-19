
'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Zap, 
  Check, 
  Package,
  Headphones,
  Truck,
  Layers,
  Users,
  RefreshCw,
  Globe,
  ChevronDown,
  Building2,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { translateText } from "@/ai/flows/translate-flow";
import { useLanguage } from "@/context/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function CariPage() {
  const { language } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  
  // Filters
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [locationInput, setLocationInput] = React.useState("");
  
  // Translation state
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean, detected: string }>>({});

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query && !activeCategory) return;
    
    setLoading(true);
    setTranslations({});
    try {
      const output = await aiIntentSearch({ 
        query: query || (activeCategory ? `Cari ${activeCategory}` : ""), 
        filters: {
          category: activeCategory || undefined,
          location: locationInput || undefined
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
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex gap-1 items-center px-3 py-1 font-bold rounded-lg">
          <ShieldCheck className="size-3" /> Terverifikasi OnTapp
        </Badge>;
      case 'ontapp_member': 
        return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 flex gap-1 items-center px-3 py-1 font-bold rounded-lg">
          <Zap className="size-3" /> Anggota OnTapp
        </Badge>;
      default: 
        return <Badge variant="outline" className="bg-slate-50 text-slate-400 flex gap-1 items-center px-3 py-1 font-bold rounded-lg">
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
      <div className="max-w-5xl mx-auto space-y-12 py-8">
        {/* Header section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Temukan
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Cari produk, layanan, atau mitra strategis di seluruh ekosistem global OnTapp.
          </p>
        </div>

        {/* Search & Filters Area */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="size-6 text-slate-400 group-focus-within:text-accent transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari apa saja dengan AI... (cth: Supplier kopi organik)"
                className="h-16 pl-16 pr-4 rounded-2xl border-slate-200 bg-slate-50/50 shadow-inner text-lg font-medium focus:bg-white transition-all focus:border-accent"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Category Dropdown */}
              <div className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full h-14 justify-between rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 px-6"
                    >
                      <div className="flex items-center gap-3">
                        <Filter className="size-4 text-slate-400" />
                        {activeCategory ? activeCategory : "Pilih Kategori"}
                      </div>
                      <ChevronDown className="size-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[300px] rounded-2xl p-2 shadow-2xl border-slate-100">
                    <DropdownMenuItem 
                      onClick={() => setActiveCategory(null)}
                      className="font-bold text-slate-400 hover:text-accent"
                    >
                      Semua Kategori
                    </DropdownMenuItem>
                    {ENTITY_CATEGORIES.map((cat) => (
                      <DropdownMenuItem 
                        key={cat.id} 
                        onClick={() => setActiveCategory(cat.label)}
                        className="flex items-center gap-3 py-3 rounded-xl font-bold cursor-pointer"
                      >
                        <cat.icon className="size-4 text-slate-400" />
                        {cat.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Location Input */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input 
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Ketik lokasi (cth: Jakarta, Medan, Global)"
                  className="h-14 pl-12 rounded-2xl border-slate-200 bg-white font-bold text-slate-600 focus:ring-accent/10"
                />
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black shadow-lg transition-all active:scale-95 flex gap-2"
              >
                {loading ? <RefreshCw className="size-5 animate-spin" /> : <><Sparkles className="size-4" /> Temukan Sekarang</>}
              </Button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {loading && (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse border-slate-100 rounded-[2rem]">
                  <CardContent className="p-8">
                    <div className="flex gap-6">
                      <Skeleton className="size-16 rounded-2xl" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-8 w-1/3 rounded-lg" />
                        <Skeleton className="h-5 w-2/3 rounded-md" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {results && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 px-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-black text-slate-900 text-lg">Hasil Penemuan AI</h3>
                  <Badge className="bg-slate-100 text-slate-500 font-bold px-2 rounded-md">{results.results.length}</Badge>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Prioritas Member OnTapp Aktif</p>
              </div>

              <div className="grid gap-6">
                {results.results.map((result, idx) => {
                  const resId = `res-${idx}`;
                  const trans = translations[resId];
                  return (
                    <Card key={idx} className={cn(
                      "group overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 bg-white relative rounded-[2.5rem]",
                      result.source !== 'external' ? "border-indigo-100" : "border-slate-100"
                    )}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className={cn(
                            "w-2 shrink-0",
                            result.source === 'ontapp_verified' ? 'bg-emerald-500' : 
                            result.source === 'ontapp_member' ? 'bg-accent' : 'bg-slate-200'
                          )} />
                          <div className="p-8 flex-1 flex flex-col md:flex-row gap-6 items-start">
                            <div className={cn(
                              "size-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-3 transition-transform",
                              result.source === 'external' ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-accent'
                            )}>
                              {getTypeIcon(result.type)}
                            </div>
                            
                            <div className="flex-1 space-y-4">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-3">
                                  <h4 className="text-xl font-black text-slate-900 group-hover:text-accent transition-colors">{result.name}</h4>
                                  {getSourceBadge(result.source)}
                                </div>
                                <div className="relative">
                                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    {trans?.show ? trans.text : result.description}
                                  </p>
                                  {trans?.show && (
                                    <div className="mt-2 text-[8px] font-black text-accent uppercase tracking-widest flex items-center gap-1.5 bg-indigo-50/50 w-fit px-2 py-1 rounded-md">
                                      <RefreshCw className="size-2" />
                                      AI Translated ({trans.detected?.toUpperCase()})
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-6 pt-1">
                                {result.location && (
                                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <MapPin className="size-3 text-rose-400" />
                                    {result.location}
                                  </div>
                                )}
                                {result.industry && (
                                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Filter className="size-3 text-indigo-400" />
                                    {result.industry}
                                  </div>
                                )}
                              </div>

                              {/* Match Reasons */}
                              <div className="flex flex-wrap gap-2">
                                {result.matchReasons.map((reason, rIdx) => (
                                  <span key={rIdx} className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                                    • {reason}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="md:w-48 shrink-0 flex flex-col items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                               <div className="text-center">
                                  <div className="text-3xl font-black text-indigo-600">{result.matchScore}%</div>
                                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Synergy</div>
                               </div>
                               
                               <div className="w-full space-y-2">
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleTranslateResult(resId, result.description)}
                                    className="w-full h-8 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-accent gap-2"
                                    disabled={trans?.loading}
                                  >
                                    {trans?.loading ? <RefreshCw className="size-3 animate-spin" /> : <Globe className="size-3" />}
                                    {trans?.show ? "Asli" : "Terjemahkan"}
                                  </Button>
                                  
                                  {result.source === 'external' ? (
                                    <Button variant="outline" className="w-full rounded-xl h-10 border-slate-200 text-xs font-black hover:bg-indigo-50 hover:text-accent transition-all">
                                      Hubungkan AI
                                    </Button>
                                  ) : (
                                    <Button className="w-full rounded-xl h-10 bg-accent hover:bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-100 transition-all active:scale-95">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
              {[
                { title: "Prioritas OnTapp", desc: "Anggota internal diprioritaskan untuk menjamin kepercayaan.", icon: Zap, color: "text-accent", bg: "bg-indigo-50" },
                { title: "Web Hibrida", desc: "AI mensintesis data dari seluruh web untuk hasil maksimal.", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
                { title: "Lokasi Bebas", desc: "Cari mitra di mana pun dengan mengetikkan lokasi impian Anda.", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-center space-y-4 hover:shadow-md transition-all group">
                  <div className={cn("size-14 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform", feature.bg, feature.color)}>
                    <feature.icon className="size-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-900">{feature.title}</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{feature.desc}</p>
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

