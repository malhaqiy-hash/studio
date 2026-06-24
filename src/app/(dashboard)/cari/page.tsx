'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  MapPin, 
  RefreshCw,
  ChevronDown,
  Building2,
  Filter,
  Mic,
  Store,
  Hotel,
  User,
  Camera,
  LocateFixed,
  Package,
  Headphones,
  Truck,
  Layers,
  Users,
  Image as ImageIcon,
  Target,
  Briefcase,
  Radio,
  Calendar,
  Car,
  X,
  Map as MapIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useAccount } from "@/context/account-context";

const SEARCH_CATEGORIES = [
  { id: 'professional_personal', label: 'Profesional/Pribadi', icon: User },
  { id: 'toko', label: 'Toko', icon: Store },
  { id: 'perusahaan', label: 'Perusahaan', icon: Building2 },
  { id: 'saluran', label: 'Saluran', icon: Radio },
  { id: 'komunitas', label: 'Komunitas', icon: Users },
  { id: 'acara', label: 'Acara', icon: Calendar },
  { id: 'peluang_bisnis', label: 'Peluang Bisnis', icon: Target },
  { id: 'peluang_kerja', label: 'Peluang Kerja', icon: Briefcase },
  { id: 'produk', label: 'Produk', icon: Package },
  { id: 'pemasok', label: 'Pemasok', icon: Truck },
  { id: 'distributor', label: 'Distributor', icon: Layers },
  { id: 'layanan', label: 'Layanan/Jasa', icon: Headphones },
  { id: 'transportasi', label: 'Transportasi', icon: Car },
  { id: 'penginapan', label: 'Penginapan', icon: Hotel },
  { id: 'lainnya', label: 'Lainnya', icon: Filter },
];

const DAFTAR_DAERAH = [
  "Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara", 
  "Bandung", "Surabaya", "Semarang", "Kendal", "Yogyakarta", 
  "Medan", "Makassar", "Palembang", "Denpasar", "Malang",
  "Banten", "Depok", "Bekasi", "Tangerang", "Bogor"
];

export default function CariPage() {
  const { language, t } = useLanguage();
  const { activeAccount } = useAccount();
  const { toast } = useToast();
  
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [activeLocation, setActiveLocation] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredRegions, setFilteredRegions] = React.useState<string[]>([]);
  
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const suggestionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.city && data.country_name) {
          setActiveLocation(`${data.city}, ${data.country_name}`);
        }
      } catch (err) {
        console.warn("Gagal mendeteksi lokasi otomatis.");
      }
    };
    detectLocation();
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cleanTitle = (text: string) => text.replace(/^Informasi Terkait:\s*/i, '').trim();

  const handleSearch = async (
    e?: React.FormEvent, 
    overrideQuery?: string, 
    overrideCategory?: string | null,
    overrideLocation?: string
  ) => {
    e?.preventDefault();
    const finalQuery = cleanTitle(overrideQuery !== undefined ? overrideQuery : query);
    const finalCategory = overrideCategory !== undefined ? overrideCategory : activeCategory;
    const finalLocation = overrideLocation !== undefined ? overrideLocation : activeLocation;
    
    if (!finalQuery && !finalCategory) return;
    
    setLoading(true);
    setShowSuggestions(false);
    if (!overrideQuery) setResults(null);

    try {
      const output = await aiIntentSearch({ 
        query: finalQuery || (finalCategory ? `Cari ${finalCategory}` : "Analisis Gambar"), 
        filters: {
          category: finalCategory || undefined,
          location: finalLocation || undefined
        } 
      });

      if (output) {
        output.results = output.results.map(r => ({ ...r, name: cleanTitle(r.name) }));
        setResults(output);
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Mencari", description: "Terjadi gangguan jaringan AI." });
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = (name: string, location?: string) => {
    const searchQuery = encodeURIComponent(`${name} ${location || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  const handleLocationChange = (val: string) => {
    setActiveLocation(val);
    if (val.length > 0) {
      const filtered = DAFTAR_DAERAH.filter(d => 
        d.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredRegions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectRegion = (region: string) => {
    setActiveLocation(region);
    setShowSuggestions(false);
    handleSearch(undefined, query, activeCategory, region);
  };

  const handleClearLocation = () => {
    setActiveLocation("");
    setShowSuggestions(false);
    if (query || activeCategory) {
      handleSearch(undefined, query, activeCategory, "");
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'id' ? 'id-ID' : 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(undefined, transcript);
    };
    recognition.start();
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'product': return <Package className="size-5" />;
      case 'service': return <Headphones className="size-5" />;
      case 'supplier': return <Truck className="size-5" />;
      case 'professional': 
      case 'freelancer': return <User className="size-5" />;
      case 'opportunity': 
      case 'job_opportunity': return <Briefcase className="size-5" />;
      case 'shop': return <Store className="size-5" />;
      case 'hotel': return <Hotel className="size-5" />;
      case 'channel': return <Radio className="size-5" />;
      case 'event': return <Calendar className="size-5" />;
      case 'community': return <Users className="size-5" />;
      case 'transporter': return <Car className="size-5" />;
      case 'company':
      case 'business': return <Building2 className="size-5" />;
      default: return <Building2 className="size-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6 py-2 px-1 md:px-0">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-4">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-4">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="h-14 pl-12 pr-28 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
              />
              <div className="absolute inset-y-2 right-2.5 flex items-center gap-1.5">
                <button type="button" onClick={handleVoiceSearch} className="size-10 flex items-center justify-center rounded-xl bg-white text-slate-400 border border-slate-100 shadow-sm hover:text-primary hover:border-primary/30 active:scale-90 transition-all"><Mic className="size-4.5" /></button>
                <button type="button" onClick={() => setIsSourcePickerOpen(true)} className="size-10 flex items-center justify-center rounded-xl bg-white text-slate-400 border border-slate-100 shadow-sm hover:text-primary hover:border-primary/30 active:scale-90 transition-all"><Camera className="size-4.5" /></button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-[13px] uppercase tracking-widest shadow-xl shadow-primary/20 flex gap-2 active:scale-[0.98] transition-all">
              {loading ? <RefreshCw className="size-5 animate-spin" /> : <>{t('search_now')}</>}
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-between rounded-xl border-slate-100 bg-slate-50/50 text-slate-600 font-bold hover:bg-white hover:border-primary/20 px-4 text-[11px] uppercase tracking-widest transition-all">
                    <div className="flex items-center gap-2 max-w-[140px] truncate"><Filter className="size-4 shrink-0 text-primary/60" />{activeCategory || "Semua Kategori"}</div>
                    <ChevronDown className="size-4 opacity-40 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px] rounded-2xl p-2 shadow-2xl bg-card border-border max-h-[450px] overflow-y-auto no-scrollbar">
                  <DropdownMenuItem onClick={() => setActiveCategory(null)} className="font-black text-primary p-3 rounded-xl text-[11px] uppercase tracking-widest hover:bg-primary/5 cursor-pointer">Semua Kategori</DropdownMenuItem>
                  <div className="grid grid-cols-1 gap-1">
                    {SEARCH_CATEGORIES.map((cat) => (
                      <DropdownMenuItem key={cat.id} onClick={() => setActiveCategory(cat.label)} className="flex items-center gap-4 py-3 px-3 rounded-xl font-bold cursor-pointer hover:bg-slate-50 text-[14px] text-slate-700">
                        <div className="size-9 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110"><cat.icon className="size-4.5" /></div>{cat.label}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative group w-full" ref={suggestionRef}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="size-4 text-primary/60" />
                </div>
                <Input 
                  value={activeLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => activeLocation.length > 0 && setShowSuggestions(true)}
                  placeholder={language === 'id' ? "Pilih Wilayah..." : "Choose Location..."}
                  className="h-12 pl-10 pr-10 rounded-xl border-slate-100 bg-slate-50/50 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                />
                {activeLocation !== "" && (
                  <button 
                    type="button" 
                    onClick={handleClearLocation}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-destructive transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                )}

                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-[150] bg-white border border-slate-100 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] max-h-56 overflow-y-auto no-scrollbar p-1.5 animate-in fade-in slide-in-from-top-3 duration-300">
                    {filteredRegions.map((region, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectRegion(region)}
                        className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-primary/5 rounded-xl transition-all border-b last:border-none border-slate-50 group"
                      >
                        <MapPin className="size-4 text-primary group-hover:scale-125 transition-transform" />
                        <span className="text-[13px] font-bold text-slate-700">{region}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {results && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3"><h3 className="font-black text-slate-900 text-[14px] uppercase tracking-widest">{t('results')}</h3><Badge className="bg-primary/10 text-primary font-black px-3 py-1 rounded-full text-[11px] border-none">{results.results.length} Item</Badge></div>
            </div>
            <div className="grid gap-4">
              {results.results.map((result, idx) => (
                <Card key={idx} className="rounded-2xl border-none shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] bg-white overflow-hidden hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 group">
                  <CardContent className="p-0 flex flex-col">
                    <div className="p-5 md:p-6 flex gap-5 items-start">
                      <div className="size-14 rounded-2xl bg-slate-50 text-primary flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6">{getTypeIcon(result.type)}</div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-[16px] font-bold text-slate-900 leading-none group-hover:text-primary transition-colors">{cleanTitle(result.name)}</h4>
                          <Badge className={cn("text-[10px] font-black uppercase tracking-widest rounded-full px-3 py-0.5 border-none shadow-sm", result.source === 'external' ? 'bg-slate-100 text-slate-600' : 'bg-primary/10 text-primary')}>
                            {result.source === 'external' ? 'Eksternal' : 'Verified'}
                          </Badge>
                        </div>
                        <p className="text-slate-500 font-medium text-[14px] leading-relaxed line-clamp-2">{result.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest pt-2">
                          {result.location && (
                            <button 
                              onClick={() => openInGoogleMaps(result.name, result.location)}
                              className="flex items-center gap-1.5 hover:text-primary transition-all p-1 -ml-1 rounded-lg hover:bg-primary/5"
                            >
                              <MapPin className="size-3.5" />
                              <span className="underline decoration-primary/20 underline-offset-4">{result.location}</span>
                            </button>
                          )}
                          <div className="flex items-center gap-1.5 text-primary bg-primary/5 px-2 py-0.5 rounded-lg"><Target className="size-3.5" />{result.matchScore}% Synergy</div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button variant="outline" className="rounded-xl h-10 border-slate-100 hover:bg-primary hover:text-white hover:border-primary text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-90">{t('view_profile')}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && !results && (
          <div className="py-20 text-center space-y-6 bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-inner">
             <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto transition-transform hover:scale-110"><Search className="size-8 text-slate-200" /></div>
             <div className="space-y-2 px-6">
               <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-widest">{t('start_search')}</h3>
               <p className="text-[13px] text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">{t('daily_limit_msg')}</p>
             </div>
          </div>
        )}
      </div>

      {/* Visual Search Modal */}
      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-[320px] rounded-[2.5rem] bg-card text-foreground p-8 border-none shadow-2xl overflow-hidden outline-none animate-in zoom-in-95 duration-300 [&>button]:hidden">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-center uppercase text-primary">Cari Visual</h2>
              <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-[0.2em]">Analisis Gambar Cerdas</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-5 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 group transition-all active:scale-95 text-left border border-transparent hover:border-primary/20">
                <div className="size-12 rounded-xl bg-white flex items-center justify-center shadow-md text-primary group-hover:scale-110 transition-transform"><Camera className="size-6" /></div>
                <div className="flex flex-col"><span className="font-black text-[15px] leading-none uppercase text-slate-800">Kamera</span><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">Ambil Foto Langsung</span></div>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-5 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 group transition-all active:scale-95 text-left border border-transparent hover:border-primary/20">
                <div className="size-12 rounded-xl bg-white flex items-center justify-center shadow-md text-primary group-hover:scale-110 transition-transform"><ImageIcon className="size-6" /></div>
                <div className="flex flex-col"><span className="font-black text-[15px] leading-none uppercase text-slate-800">Galeri</span><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">Pilih dari Media Lokal</span></div>
              </button>
            </div>
            <button onClick={() => setIsSourcePickerOpen(false)} className="w-full text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors">Batalkan</button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}