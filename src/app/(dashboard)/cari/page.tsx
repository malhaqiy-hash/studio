'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
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
  CheckCircle2,
  Sparkles,
  Plus,
  Store,
  Hotel,
  User,
  MoreHorizontal,
  Camera,
  LocateFixed,
  X
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

const ENTITY_CATEGORIES = [
  { id: 'toko', label: 'Toko', icon: Store },
  { id: 'produk', label: 'Produk', icon: Package },
  { id: 'service', label: 'Service', icon: Headphones },
  { id: 'hotel', label: 'Hotel', icon: Hotel },
  { id: 'transportasi', label: 'Transportasi', icon: Truck },
  { id: 'supplier', label: 'Supplier', icon: Truck },
  { id: 'distributor', label: 'Distributor', icon: Layers },
  { id: 'freelancer', label: 'Freelancer', icon: User },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'others', label: 'Lainnya', icon: MoreHorizontal },
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
  const [locationSearch, setLocationSearch] = React.useState("");
  
  // Voice & Image state
  const [isListening, setIsListening] = React.useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Translation state
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean, detected: string }>>({});

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    e?.preventDefault();
    const finalQuery = overrideQuery || query;
    if (!finalQuery && !activeCategory && !previewImage) return;
    
    setLoading(true);
    setTranslations({});
    try {
      const output = await aiIntentSearch({ 
        query: finalQuery || (activeCategory ? `Cari ${activeCategory}` : "Analisis Gambar Bisnis"), 
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
    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
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
      setTimeout(() => handleSearch(undefined, transcript), 500);
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

  const handleImageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsAnalyzingImage(true);
        toast({ title: "Menganalisis Gambar...", description: "AI sedang mengidentifikasi objek bisnis." });
        
        // Simulasikan analisis AI
        setTimeout(() => {
          setIsAnalyzingImage(false);
          setQuery("Produk serupa dari gambar");
          handleSearch(undefined, "Produk serupa dari gambar");
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNearbySearch = () => {
    setLoading(true);
    toast({ title: "Mencari di Sekitar", description: "Mengakses lokasi GPS Anda..." });
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setActiveLocation("Lokasi Saat Ini");
        try {
          const output = await aiIntentSearch({ 
            query: "Bisnis terdekat dari koordinat saya", 
            filters: {
              location: "Radius 5km"
            } 
          });
          setResults(output);
          toast({ title: "Hasil Ditemukan", description: "Menampilkan bisnis dalam radius 5km." });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, () => {
        setLoading(false);
        toast({ variant: "destructive", title: "Gagal Akses Lokasi", description: "Pastikan izin lokasi diaktifkan." });
      });
    } else {
      setLoading(false);
      toast({ variant: "destructive", title: "Fitur Tidak Tersedia", description: "Browser Anda tidak mendukung geolokasi." });
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
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex gap-1 items-center px-3 py-1 font-bold rounded-lg text-[10px]">
          <ShieldCheck className="size-3" /> Terverifikasi OnTapp
        </Badge>;
      case 'ontapp_member': 
        return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 flex gap-1 items-center px-3 py-1 font-bold rounded-lg text-[10px]">
          <Zap className="size-3" /> Anggota OnTapp
        </Badge>;
      default: 
        return <Badge variant="outline" className="bg-slate-50 text-slate-400 flex gap-1 items-center px-3 py-1 font-bold rounded-lg text-[10px]">
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
      case 'shop': return <Store className="size-5" />;
      case 'hotel': return <Hotel className="size-5" />;
      default: return <Building2 className="size-5" />;
    }
  };

  const filteredLocations = POPULAR_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 py-2">
        {/* Search & Filters Area */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-4">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="size-5 text-slate-400 group-focus-within:text-accent transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari apa saja dengan AI..."
                className="h-16 pl-12 pr-32 rounded-2xl border-slate-100 bg-slate-50/50 shadow-inner text-base font-medium focus:bg-white transition-all focus:border-accent"
              />
              <div className="absolute inset-y-3 right-3 flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-accent border border-slate-100 shadow-sm transition-all active:scale-90"
                >
                  <Camera className="size-5" />
                </button>
                <button 
                  type="button"
                  onClick={toggleVoiceSearch}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90",
                    isListening ? "bg-rose-500 text-white animate-pulse" : "bg-white text-slate-400 hover:text-accent shadow-sm border border-slate-100"
                  )}
                >
                  <Mic className="size-5" />
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSearch} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            {previewImage && (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-accent/20 animate-in zoom-in-50">
                <img src={previewImage} className="w-full h-full object-cover" alt="Search visual" />
                <button 
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1"
                >
                  <X className="size-3" />
                </button>
                {isAnalyzingImage && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <RefreshCw className="size-5 animate-spin text-accent" />
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 justify-between rounded-xl border-slate-100 bg-white text-slate-600 font-bold hover:bg-slate-50 px-4 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="size-3.5 text-accent" />
                      {activeCategory ? activeCategory : "Pilih Kategori"}
                    </div>
                    <ChevronDown className="size-3.5 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[280px] rounded-2xl p-2 shadow-2xl border-slate-100">
                  <DropdownMenuItem 
                    onClick={() => setActiveCategory(null)}
                    className="font-bold text-slate-400 hover:text-accent p-2.5 rounded-lg text-xs"
                  >
                    Semua Kategori
                  </DropdownMenuItem>
                  {ENTITY_CATEGORIES.map((cat) => (
                    <DropdownMenuItem 
                      key={cat.id} 
                      onClick={() => setActiveCategory(cat.label)}
                      className="flex items-center gap-3 py-2.5 rounded-lg font-bold cursor-pointer hover:bg-slate-50 text-xs"
                    >
                      <div className="size-7 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                        <cat.icon className="size-3.5" />
                      </div>
                      {cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Location Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 justify-between rounded-xl border-slate-100 bg-white text-slate-600 font-bold hover:bg-slate-50 px-4 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-rose-500" />
                      {activeLocation}
                    </div>
                    <ChevronDown className="size-3.5 opacity-30" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-[280px] rounded-2xl p-3 shadow-2xl border-slate-100 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input 
                      placeholder="Cari lokasi..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="h-9 pl-9 rounded-xl border-slate-100 bg-slate-50 text-[11px] font-bold"
                    />
                  </div>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto no-scrollbar">
                    {filteredLocations.map((loc) => (
                      <button 
                        key={loc} 
                        onClick={() => { setActiveLocation(loc); setLocationSearch(""); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Nearby Search Button */}
              <Button 
                type="button"
                variant="outline"
                onClick={handleNearbySearch}
                className="w-full h-12 rounded-xl border-emerald-100 bg-emerald-50/30 text-emerald-700 font-bold hover:bg-emerald-50 text-xs gap-2"
              >
                <LocateFixed className="size-4" />
                Cari Sekitar
              </Button>
            </div>

            <Button 
              onClick={(e) => handleSearch(e)}
              disabled={loading}
              className="w-full h-14 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-sm shadow-md transition-all active:scale-95 flex gap-2"
            >
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <><Sparkles className="size-4" /> Cari Sekarang</>}
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
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-base tracking-tight">Hasil</h3>
                  <Badge className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-lg text-[10px]">{results.results.length}</Badge>
                </div>
              </div>

              <div className="grid gap-4">
                {results.results.map((result, idx) => {
                  const resId = `res-${idx}`;
                  const trans = translations[resId];
                  return (
                    <Card key={idx} className={cn(
                      "group overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 bg-white relative rounded-[1.5rem]",
                      result.source !== 'external' ? "border-indigo-100" : "border-slate-100"
                    )}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className={cn(
                            "w-1 shrink-0",
                            result.source === 'ontapp_verified' ? 'bg-emerald-500' : 
                            result.source === 'ontapp_member' ? 'bg-accent' : 'bg-slate-200'
                          )} />
                          <div className="p-6 flex-1 flex flex-col md:flex-row gap-5 items-start">
                            <div className={cn(
                              "size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-300",
                              result.source === 'external' ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-accent'
                            )}>
                              {getTypeIcon(result.type)}
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-lg font-black text-slate-900 group-hover:text-accent transition-colors tracking-tight">{result.name}</h4>
                                  {getSourceBadge(result.source)}
                                </div>
                                <div className="relative">
                                  <p className="text-slate-500 font-medium text-xs leading-relaxed line-clamp-2">
                                    {trans?.show ? trans.text : result.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4">
                                {result.location && (
                                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <MapPin className="size-3 text-rose-400" />
                                    {result.location}
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-[10px] font-black text-indigo-600">
                                  {result.matchScore}% Synergy
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {result.matchReasons.map((reason, rIdx) => (
                                  <span key={rIdx} className="text-[8px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                                    • {reason}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="md:w-32 shrink-0 flex flex-col gap-2 pt-4 md:pt-0 md:pl-4 md:border-l border-slate-50">
                               <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleTranslateResult(resId, result.description)}
                                  className="w-full h-8 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-accent gap-1.5 rounded-lg"
                                  disabled={trans?.loading}
                                >
                                  {trans?.loading ? <RefreshCw className="size-2.5 animate-spin" /> : <Globe className="size-2.5" />}
                                  {trans?.show ? "Asli" : "Translate"}
                                </Button>
                                <Button className="w-full rounded-lg h-9 bg-accent hover:bg-indigo-600 text-white text-[9px] font-black shadow-md transition-all active:scale-95">
                                  Lihat Profil
                                </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {[
                { title: "Prioritas OnTapp", desc: "Internal member diprioritaskan.", icon: Zap, color: "text-accent", bg: "bg-indigo-50" },
                { title: "Web Hibrida", desc: "Data global dari seluruh web.", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
                { title: "Voice & Visual AI", desc: "Cari dengan suara atau gambar.", icon: Camera, color: "text-rose-500", bg: "bg-rose-50" }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm text-center space-y-3"
                >
                  <div className={cn("size-10 rounded-2xl flex items-center justify-center mx-auto", feature.bg, feature.color)}>
                    <feature.icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900">{feature.title}</h4>
                    <p className="text-slate-400 text-[9px] font-medium leading-relaxed">{feature.desc}</p>
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
