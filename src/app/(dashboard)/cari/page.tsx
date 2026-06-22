
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

  // Auto-Detect Wilayah saat pertama kali muat
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

  // Handle click outside suggestions
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
      case 'product': return <Package className="size-4" />;
      case 'service': return <Headphones className="size-4" />;
      case 'supplier': return <Truck className="size-4" />;
      case 'professional': 
      case 'freelancer': return <User className="size-4" />;
      case 'opportunity': 
      case 'job_opportunity': return <Briefcase className="size-4" />;
      case 'shop': return <Store className="size-4" />;
      case 'hotel': return <Hotel className="size-4" />;
      case 'channel': return <Radio className="size-4" />;
      case 'event': return <Calendar className="size-4" />;
      case 'community': return <Users className="size-4" />;
      case 'transporter': return <Car className="size-4" />;
      case 'company':
      case 'business': return <Building2 className="size-4" />;
      default: return <Building2 className="size-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1 md:px-0">
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-3">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-3">
            {/* Search Input Utama */}
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="size-4 text-muted-foreground" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="h-11 pl-10 pr-24 rounded-xl border-border bg-muted/20 text-[14px] font-medium focus:bg-background transition-all focus:border-black"
              />
              <div className="absolute inset-y-1.5 right-2 flex items-center gap-1">
                <button type="button" onClick={handleVoiceSearch} className="size-8 flex items-center justify-center rounded-lg bg-card text-muted-foreground border border-border shadow-sm active:scale-90 transition-transform"><Mic className="size-3.5" /></button>
                <button type="button" onClick={() => setIsSourcePickerOpen(true)} className="size-8 flex items-center justify-center rounded-lg bg-card text-muted-foreground border border-border shadow-sm active:scale-90 transition-transform"><Camera className="size-3.5" /></button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-black text-white font-black text-[12px] uppercase tracking-widest shadow-lg flex gap-2">
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <>{t('search_now')}</>}
            </Button>

            {/* Filter Section: Kategori & Lokasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-10 justify-between rounded-lg border-border bg-card text-foreground font-bold hover:bg-muted/50 px-3 text-[10px] uppercase tracking-widest">
                    <div className="flex items-center gap-2 max-w-[120px] truncate"><Filter className="size-3 shrink-0" />{activeCategory || "Kategori"}</div>
                    <ChevronDown className="size-3 opacity-30 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[280px] rounded-xl p-1 shadow-2xl bg-card border-border max-h-[400px] overflow-y-auto no-scrollbar">
                  <DropdownMenuItem onClick={() => setActiveCategory(null)} className="font-black text-muted-foreground p-2 rounded-lg text-[10px] uppercase">Semua Kategori</DropdownMenuItem>
                  {SEARCH_CATEGORIES.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setActiveCategory(cat.label)} className="flex items-center gap-3 py-2 rounded-lg font-bold cursor-pointer hover:bg-muted text-[13px]">
                      <div className="size-7 bg-muted rounded-md flex items-center justify-center text-muted-foreground shrink-0"><cat.icon className="size-3.5" /></div>{cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Input Lokasi Dinamis dengan Suggestions */}
              <div className="relative group w-full" ref={suggestionRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="size-3 text-muted-foreground" />
                </div>
                <Input 
                  value={activeLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => activeLocation.length > 0 && setShowSuggestions(true)}
                  placeholder={language === 'id' ? "Ketik Lokasi..." : "Type Location..."}
                  className="h-10 pl-8 pr-8 rounded-lg border-border bg-card text-[10px] font-black uppercase tracking-widest focus:bg-background transition-all focus:border-black shadow-none"
                />
                {activeLocation !== "" && (
                  <button 
                    type="button" 
                    onClick={handleClearLocation}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-black transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                )}

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-[150] bg-white border border-border rounded-xl shadow-2xl max-h-48 overflow-y-auto no-scrollbar py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {filteredRegions.map((region, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectRegion(region)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-none border-border/40"
                      >
                        <MapPin className="size-3 text-muted-foreground" />
                        <span className="text-[12px] font-bold text-slate-700">{region}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {results && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2"><h3 className="font-black text-foreground text-[13px] uppercase tracking-widest">{t('results')}</h3><Badge className="bg-black/5 text-black font-black px-2 py-0.5 rounded-lg text-[10px] border-none">{results.results.length}</Badge></div>
            </div>
            <div className="grid gap-3">
              {results.results.map((result, idx) => (
                <Card key={idx} className="rounded-xl border border-border shadow-sm bg-card overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-0 flex flex-col">
                    <div className="p-3 md:p-4 flex gap-4 items-start">
                      <div className="size-11 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0 shadow-inner">{getTypeIcon(result.type)}</div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[14px] font-bold text-slate-900 leading-none">{cleanTitle(result.name)}</h4>
                          <Badge className={cn("text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0 border-none", result.source === 'external' ? 'bg-black/10 text-black' : 'bg-black text-white')}>
                            {result.source === 'external' ? 'Eksternal' : 'Verified'}
                          </Badge>
                        </div>
                        <p className="text-slate-500 font-medium text-[13px] leading-snug line-clamp-2">{result.description}</p>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">
                          {result.location && <div className="flex items-center gap-1"><MapPin className="size-3" />{result.location}</div>}
                          <div className="flex items-center gap-1 text-black"><Target className="size-3" />{result.matchScore}% Synergy</div>
                        </div>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        <Button className="rounded-lg h-8 bg-black text-white text-[9px] font-black uppercase tracking-widest">{t('view_profile')}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !results && (
          <div className="py-12 text-center space-y-4 bg-card rounded-2xl border-2 border-dashed border-border/50">
             <div className="size-11 rounded-xl bg-muted flex items-center justify-center mx-auto"><Search className="size-5 text-muted-foreground/20" /></div>
             <div className="space-y-1 px-4">
               <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">{t('start_search')}</h3>
               <p className="text-[11px] text-slate-500 max-w-xs mx-auto font-medium">{t('daily_limit_msg')}</p>
             </div>
          </div>
        )}
      </div>

      {/* Visual Search Modal */}
      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-[280px] rounded-[1.5rem] bg-card text-foreground p-6 border-none shadow-2xl overflow-hidden outline-none [&>button]:hidden">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-black tracking-tight text-center uppercase">Cari Visual</h2>
              <p className="text-[9px] text-center text-muted-foreground font-black uppercase tracking-widest">Sintesis Objek AI</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-4 group text-left active:scale-95 transition-transform">
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-black group-hover:text-white transition-colors"><Camera className="size-5" /></div>
                <div className="flex flex-col"><span className="font-black text-[14px] leading-none uppercase">Kamera</span><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Ambil Foto</span></div>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 group text-left active:scale-95 transition-transform">
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-black group-hover:text-white transition-colors"><ImageIcon className="size-5" /></div>
                <div className="flex flex-col"><span className="font-black text-[14px] leading-none uppercase">Galeri</span><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Media Lokal</span></div>
              </button>
            </div>
            <button onClick={() => setIsSourcePickerOpen(false)} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors">Batal</button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
