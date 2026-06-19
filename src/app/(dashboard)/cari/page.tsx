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
  Mic,
  CheckCircle2
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
import { useToast } from "@/hooks/use-toast";

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

const POPULAR_LOCATIONS = [
  "Global", "Jakarta", "Surabaya", "Medan", "Bandung", "Bali", "Singapore", "Malaysia", "Tokyo", "London"
];

export default function CariPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  
  // Filters
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [activeLocation, setActiveLocation] = React.useState("Pilih Lokasi");
  
  // Voice state
  const [isListening, setIsListening] = React.useState(false);
  
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
          location: activeLocation !== "Pilih Lokasi" ? activeLocation : undefined
        } 
      });
      setResults(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Browser Tidak Mendukung",
        description: "Browser Anda tidak mendukung pencarian suara."
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({ title: "Mendengarkan...", description: "Silakan bicara sekarang." });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      toast({ title: "Suara Terdeteksi", description: `Mencari: "${transcript}"` });
      // Trigger search automatically
      setTimeout(() => handleSearch(), 500);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({ variant: "destructive", title: "Gagal Mendengar", description: "Coba lagi nanti." });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
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
      <div className="max-w-5xl mx-auto space-y-6 py-4">
        {/* Search & Filters Area - Now More Compact */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="size-5 text-slate-400 group-focus-within:text-accent transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari apa saja dengan AI..."
                className="h-14 pl-12 pr-20 rounded-2xl border-slate-200 bg-slate-50/50 shadow-inner text-base font-medium focus:bg-white transition-all focus:border-accent"
              />
              <button 
                type="button"
                onClick={toggleVoiceSearch}
                className={cn(
                  "absolute inset-y-2.5 right-2.5 w-10 flex items-center justify-center rounded-xl transition-all",
                  isListening ? "bg-rose-500 text-white animate-pulse" : "bg-white text-slate-400 hover:bg-slate-100 shadow-sm border"
                )}
              >
                <Mic className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 justify-between rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 px-5 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Filter className="size-4 text-accent" />
                      {activeCategory ? activeCategory : "Kategori"}
                    </div>
                    <ChevronDown className="size-4 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[280px] rounded-2xl p-2 shadow-2xl border-slate-100">
                  <DropdownMenuItem 
                    onClick={() => setActiveCategory(null)}
                    className="font-bold text-slate-400 hover:text-accent p-2.5 rounded-lg"
                  >
                    Semua Kategori
                  </DropdownMenuItem>
                  {ENTITY_CATEGORIES.map((cat) => (
                    <DropdownMenuItem 
                      key={cat.id} 
                      onClick={() => setActiveCategory(cat.label)}
                      className="flex items-center gap-3 py-3 rounded-lg font-bold cursor-pointer hover:bg-slate-50"
                    >
                      <div className="size-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                        <cat.icon className="size-4" />
                      </div>
                      {cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Location Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 justify-between rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 px-5 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="size-4 text-rose-500" />
                      {activeLocation}
                    </div>
                    <ChevronDown className="size-4 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px] rounded-2xl p-2 shadow-2xl border-slate-100">
                  <DropdownMenuItem 
                    onClick={() => setActiveLocation("Semua Lokasi")}
                    className="font-bold text-slate-400 p-2.5 rounded-lg"
                  >
                    Seluruh Dunia
                  </DropdownMenuItem>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <DropdownMenuItem 
                      key={loc} 
                      onClick={() => setActiveLocation(loc)}
                      className="flex items-center gap-3 py-3 rounded-lg font-bold cursor-pointer hover:bg-slate-50"
                    >
                      <MapPin className="size-4 text-slate-300" />
                      {loc}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-base shadow-lg transition-all active:scale-95 flex gap-2"
            >
              {loading ? <RefreshCw className="size-5 animate-spin" /> : <><Sparkles className="size-4" /> Temukan Sekarang</>}
            </Button>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {loading && (
            <div className="grid gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse border-slate-100 rounded-[2rem]">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="size-14 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-1/3 rounded" />
                        <Skeleton className="h-4 w-2/3 rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-black text-slate-900 text-lg tracking-tight">Hasil Penemuan AI</h3>
                  <Badge className="bg-slate-100 text-slate-500 font-bold px-2.5 py-0.5 rounded-lg text-xs">{results.results.length}</Badge>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Prioritas Member OnTapp Aktif</p>
              </div>

              <div className="grid gap-4">
                {results.results.map((result, idx) => {
                  const resId = `res-${idx}`;
                  const trans = translations[resId];
                  return (
                    <Card key={idx} className={cn(
                      "group overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-500 bg-white relative rounded-[2.5rem]",
                      result.source !== 'external' ? "border-indigo-100" : "border-slate-100"
                    )}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className={cn(
                            "w-1.5 shrink-0",
                            result.source === 'ontapp_verified' ? 'bg-emerald-500' : 
                            result.source === 'ontapp_member' ? 'bg-accent' : 'bg-slate-200'
                          )} />
                          <div className="p-8 flex-1 flex flex-col md:flex-row gap-6 items-start">
                            <div className={cn(
                              "size-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-300",
                              result.source === 'external' ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-accent'
                            )}>
                              {getTypeIcon(result.type)}
                            </div>
                            
                            <div className="flex-1 space-y-4">
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-3">
                                  <h4 className="text-xl font-black text-slate-900 group-hover:text-accent transition-colors tracking-tight">{result.name}</h4>
                                  {getSourceBadge(result.source)}
                                </div>
                                <div className="relative">
                                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    {trans?.show ? trans.text : result.description}
                                  </p>
                                  {trans?.show && (
                                    <div className="mt-2 text-[8px] font-black text-accent uppercase tracking-widest flex items-center gap-1 bg-indigo-50/50 w-fit px-2 py-1 rounded-md">
                                      <RefreshCw className="size-2" />
                                      AI Translated ({trans.detected?.toUpperCase()})
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 pt-1">
                                {result.location && (
                                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <MapPin className="size-3.5 text-rose-400" />
                                    {result.location}
                                  </div>
                                )}
                                {result.industry && (
                                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Filter className="size-3.5 text-indigo-400" />
                                    {result.industry}
                                  </div>
                                )}
                              </div>

                              {/* Match Reasons */}
                              <div className="flex flex-wrap gap-2 pt-1">
                                {result.matchReasons.map((reason, rIdx) => (
                                  <span key={rIdx} className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                                    • {reason}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="md:w-44 shrink-0 flex flex-col items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                               <div className="text-center">
                                  <div className="text-3xl font-black text-indigo-600 leading-none">{result.matchScore}%</div>
                                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Synergy</div>
                               </div>
                               
                               <div className="w-full space-y-2.5">
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleTranslateResult(resId, result.description)}
                                    className="w-full h-8 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-accent gap-1.5 rounded-lg"
                                    disabled={trans?.loading}
                                  >
                                    {trans?.loading ? <RefreshCw className="size-2.5 animate-spin" /> : <Globe className="size-2.5" />}
                                    {trans?.show ? "Asli" : "Translate"}
                                  </Button>
                                  
                                  {result.source === 'external' ? (
                                    <Button variant="outline" className="w-full rounded-xl h-10 border-slate-200 text-[10px] font-black hover:bg-indigo-50 hover:text-accent transition-all shadow-sm">
                                      Hubungkan AI
                                    </Button>
                                  ) : (
                                    <Button className="w-full rounded-xl h-10 bg-accent hover:bg-indigo-600 text-white text-[10px] font-black shadow-lg shadow-indigo-100 transition-all active:scale-95">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {[
                { title: "Prioritas OnTapp", desc: "Anggota internal diprioritaskan.", icon: Zap, color: "text-accent", bg: "bg-indigo-50" },
                { title: "Web Hibrida", desc: "AI mensintesis data dari seluruh web.", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
                { title: "Suara Cerdas", desc: "Cari mitra hanya dengan berbicara.", icon: Mic, color: "text-rose-500", bg: "bg-rose-50" }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-center space-y-4 hover:shadow-lg transition-all group">
                  <div className={cn("size-12 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-transform", feature.bg, feature.color)}>
                    <feature.icon className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-900">{feature.title}</h4>
                    <p className="text-slate-500 text-[10px] font-medium leading-relaxed">{feature.desc}</p>
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
