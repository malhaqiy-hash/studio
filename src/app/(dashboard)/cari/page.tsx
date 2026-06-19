
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
  MicOff,
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
      <div className="max-w-5xl mx-auto space-y-10 py-8">
        {/* Header section */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
            Temukan
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Cari produk, layanan, atau mitra strategis di seluruh ekosistem global OnTapp.
          </p>
        </div>

        {/* Search & Filters Area */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="size-6 text-slate-400 group-focus-within:text-accent transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari apa saja dengan AI..."
                className="h-20 pl-16 pr-24 rounded-[2rem] border-slate-200 bg-slate-50/50 shadow-inner text-xl font-medium focus:bg-white transition-all focus:border-accent"
              />
              <button 
                type="button"
                onClick={toggleVoiceSearch}
                className={cn(
                  "absolute inset-y-4 right-4 w-12 flex items-center justify-center rounded-2xl transition-all",
                  isListening ? "bg-rose-500 text-white animate-pulse" : "bg-white text-slate-400 hover:bg-slate-100 shadow-sm border"
                )}
              >
                {isListening ? <Mic className="size-6" /> : <Mic className="size-6" />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-16 justify-between rounded-2xl border-slate-200 text-slate-700 font-black hover:bg-slate-50 px-8 text-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Filter className="size-5 text-accent" />
                      {activeCategory ? activeCategory : "Kategori"}
                    </div>
                    <ChevronDown className="size-5 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[320px] rounded-3xl p-3 shadow-2xl border-slate-100">
                  <DropdownMenuItem 
                    onClick={() => setActiveCategory(null)}
                    className="font-bold text-slate-400 hover:text-accent p-3 rounded-xl"
                  >
                    Semua Kategori
                  </DropdownMenuItem>
                  {ENTITY_CATEGORIES.map((cat) => (
                    <DropdownMenuItem 
                      key={cat.id} 
                      onClick={() => setActiveCategory(cat.label)}
                      className="flex items-center gap-4 py-4 rounded-xl font-bold cursor-pointer hover:bg-slate-50"
                    >
                      <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                        <cat.icon className="size-5" />
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
                    className="w-full h-16 justify-between rounded-2xl border-slate-200 text-slate-700 font-black hover:bg-slate-50 px-8 text-lg"
                  >
                    <div className="flex items-center gap-4">
                      <MapPin className="size-5 text-rose-500" />
                      {activeLocation}
                    </div>
                    <ChevronDown className="size-5 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[320px] rounded-3xl p-3 shadow-2xl border-slate-100">
                  <DropdownMenuItem 
                    onClick={() => setActiveLocation("Semua Lokasi")}
                    className="font-bold text-slate-400 p-3 rounded-xl"
                  >
                    Seluruh Dunia
                  </DropdownMenuItem>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <DropdownMenuItem 
                      key={loc} 
                      onClick={() => setActiveLocation(loc)}
                      className="flex items-center gap-4 py-4 rounded-xl font-bold cursor-pointer hover:bg-slate-50"
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
              className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-black text-white font-black text-xl shadow-2xl transition-all active:scale-95 flex gap-3"
            >
              {loading ? <RefreshCw className="size-6 animate-spin" /> : <><Sparkles className="size-5" /> Temukan Sekarang</>}
            </Button>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {loading && (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse border-slate-100 rounded-[2.5rem]">
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
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">Hasil Penemuan AI</h3>
                  <Badge className="bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-lg text-sm">{results.results.length}</Badge>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Prioritas Member OnTapp Aktif</p>
              </div>

              <div className="grid gap-6">
                {results.results.map((result, idx) => {
                  const resId = `res-${idx}`;
                  const trans = translations[resId];
                  return (
                    <Card key={idx} className={cn(
                      "group overflow-hidden border shadow-sm hover:shadow-2xl transition-all duration-500 bg-white relative rounded-[3rem]",
                      result.source !== 'external' ? "border-indigo-100" : "border-slate-100"
                    )}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className={cn(
                            "w-2 shrink-0",
                            result.source === 'ontapp_verified' ? 'bg-emerald-500' : 
                            result.source === 'ontapp_member' ? 'bg-accent' : 'bg-slate-200'
                          )} />
                          <div className="p-10 flex-1 flex flex-col md:flex-row gap-8 items-start">
                            <div className={cn(
                              "size-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-300",
                              result.source === 'external' ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-accent'
                            )}>
                              {getTypeIcon(result.type)}
                            </div>
                            
                            <div className="flex-1 space-y-5">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-4">
                                  <h4 className="text-2xl font-black text-slate-900 group-hover:text-accent transition-colors tracking-tight">{result.name}</h4>
                                  {getSourceBadge(result.source)}
                                </div>
                                <div className="relative">
                                  <p className="text-slate-500 font-medium text-base leading-relaxed">
                                    {trans?.show ? trans.text : result.description}
                                  </p>
                                  {trans?.show && (
                                    <div className="mt-3 text-[9px] font-black text-accent uppercase tracking-widest flex items-center gap-1.5 bg-indigo-50/50 w-fit px-3 py-1.5 rounded-lg">
                                      <RefreshCw className="size-2.5" />
                                      AI Translated ({trans.detected?.toUpperCase()})
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-6 pt-1">
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
                              <div className="flex flex-wrap gap-2 pt-2">
                                {result.matchReasons.map((reason, rIdx) => (
                                  <span key={rIdx} className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                                    • {reason}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="md:w-52 shrink-0 flex flex-col items-center gap-5 border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-10">
                               <div className="text-center">
                                  <div className="text-4xl font-black text-indigo-600 leading-none">{result.matchScore}%</div>
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Synergy</div>
                               </div>
                               
                               <div className="w-full space-y-3">
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleTranslateResult(resId, result.description)}
                                    className="w-full h-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent gap-2 rounded-xl"
                                    disabled={trans?.loading}
                                  >
                                    {trans?.loading ? <RefreshCw className="size-3 animate-spin" /> : <Globe className="size-3" />}
                                    {trans?.show ? "Asli" : "Terjemahkan"}
                                  </Button>
                                  
                                  {result.source === 'external' ? (
                                    <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-200 text-xs font-black hover:bg-indigo-50 hover:text-accent transition-all shadow-sm">
                                      Hubungkan AI
                                    </Button>
                                  ) : (
                                    <Button className="w-full rounded-2xl h-12 bg-accent hover:bg-indigo-600 text-white text-xs font-black shadow-xl shadow-indigo-100 transition-all active:scale-95">
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
                { title: "Prioritas OnTapp", desc: "Anggota internal diprioritaskan untuk menjamin kepercayaan.", icon: Zap, color: "text-accent", bg: "bg-indigo-50" },
                { title: "Web Hibrida", desc: "AI mensintesis data dari seluruh web untuk hasil maksimal.", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
                { title: "Suara Cerdas", desc: "Cari mitra hanya dengan berbicara. AI memahami niat bisnis Anda.", icon: Mic, color: "text-rose-500", bg: "bg-rose-50" }
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm text-center space-y-6 hover:shadow-xl transition-all group hover:-translate-y-1">
                  <div className={cn("size-16 rounded-[1.5rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-transform", feature.bg, feature.color)}>
                    <feature.icon className="size-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900">{feature.title}</h4>
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
